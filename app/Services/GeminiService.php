<?php

namespace App\Services;

use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    private string $apiKey;
    private string $baseUrl;

    public function __construct()
    {
        $this->apiKey = config('services.gemini.api_key');
        $this->baseUrl = config('services.gemini.base_url', 'https://generativelanguage.googleapis.com/v1beta');

        if (!$this->apiKey) {
            throw new \Exception('Gemini API key is not configured. Please set GEMINI_API_KEY in your .env file.');
        }
    }

    public function analyzeReceiptImage(string $imagePath): array
    {
        try {
            // Validate image file exists
            if (!file_exists($imagePath)) {
                throw new \Exception("Image file not found: {$imagePath}");
            }

            // Read and encode the image
            $imageData = base64_encode(file_get_contents($imagePath));
            $mimeType = mime_content_type($imagePath);

            if (!$imageData) {
                throw new \Exception("Failed to read image file: {$imagePath}");
            }

            $prompt = $this->buildReceiptAnalysisPrompt();

            $response = Http::timeout(30)
                ->post("{$this->baseUrl}/models/gemini-1.5-flash:generateContent?key={$this->apiKey}", [
                    'contents' => [
                        [
                            'parts' => [
                                [
                                    'text' => $prompt
                                ],
                                [
                                    'inline_data' => [
                                        'mime_type' => $mimeType,
                                        'data' => $imageData
                                    ]
                                ]
                            ]
                        ]
                    ],
                    'generationConfig' => [
                        'temperature' => 0.1,
                        'topK' => 32,
                        'topP' => 1,
                        'maxOutputTokens' => 1024,
                    ]
                ]);

            if (!$response->successful()) {
                Log::error('Gemini API Error', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                throw new \Exception('Failed to analyze receipt with Gemini API: ' . $response->body());
            }

            return $this->parseGeminiResponse($response);
        } catch (\Exception $e) {
            Log::error('Receipt analysis failed', [
                'error' => $e->getMessage(),
                'image_path' => $imagePath
            ]);
            throw $e;
        }
    }

    private function buildReceiptAnalysisPrompt(): string
    {
        return "Analyze this receipt image and extract the following information in JSON format:

{
  \"vendor_name\": \"Name of the business/store\",
  \"amount\": \"Total amount as a number (e.g., 45.67)\",
  \"date\": \"Date in YYYY-MM-DD format\",
  \"category\": \"One of: restaurant, groceries, transport, shopping, entertainment, healthcare, utilities, other\",
  \"confidence\": \"Confidence score between 0 and 1\",
  \"items\": [
    {
      \"name\": \"Item name\",
      \"price\": \"Item price as number\",
      \"quantity\": \"Quantity if available\"
    }
  ]
}

Rules:
1. Return ONLY valid JSON, no additional text
2. If you cannot read certain information, use null for that field
3. For category, choose the most appropriate one based on the vendor/items
4. Amount should be the total amount paid
5. Date should be the transaction date, not today's date
6. Confidence should reflect how certain you are about the extracted data
7. The price is in ETB never in USD even if you scan USD receipts
8. If the receipt is not in Amharic or English, translate it to English before analyzing

Analyze the receipt now:";
    }

    private function parseGeminiResponse(Response $response): array
    {
        $data = $response->json();

        if (!isset($data['candidates'][0]['content']['parts'][0]['text'])) {
            throw new \Exception('Invalid response format from Gemini API');
        }

        $textResponse = $data['candidates'][0]['content']['parts'][0]['text'];

        // Clean up the response - remove markdown code blocks if present
        $textResponse = preg_replace('/```json\s*/', '', $textResponse);
        $textResponse = preg_replace('/```\s*$/', '', $textResponse);
        $textResponse = trim($textResponse);

        $analysisData = json_decode($textResponse, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            Log::error('Failed to parse Gemini JSON response', [
                'response' => $textResponse,
                'json_error' => json_last_error_msg()
            ]);

            // Return fallback data instead of throwing exception
            return $this->getFallbackAnalysisData();
        }

        // Validate and clean the data
        return $this->validateAndCleanAnalysisData($analysisData);
    }

    private function getFallbackAnalysisData(): array
    {
        return [
            'vendor_name' => 'Unknown Vendor',
            'amount' => null,
            'date' => now()->format('Y-m-d'),
            'category' => 'other',
            'confidence' => 0.1,
            'items' => []
        ];
    }

    private function validateAndCleanAnalysisData(array $data): array
    {
        return [
            'vendor_name' => $data['vendor_name'] ?? null,
            'amount' => is_numeric($data['amount']) ? (float) $data['amount'] : null,
            'date' => $this->validateDate($data['date'] ?? null),
            'category' => $this->validateCategory($data['category'] ?? 'other'),
            'confidence' => is_numeric($data['confidence']) ? (float) $data['confidence'] : 0.5,
            'items' => $this->validateItems($data['items'] ?? [])
        ];
    }

    private function validateDate(?string $date): ?string
    {
        if (!$date) return null;

        try {
            $parsedDate = \Carbon\Carbon::parse($date);
            return $parsedDate->format('Y-m-d');
        } catch (\Exception $e) {
            return null;
        }
    }

    private function validateCategory(?string $category): string
    {
        $validCategories = [
            'restaurant',
            'groceries',
            'transport',
            'shopping',
            'entertainment',
            'healthcare',
            'utilities',
            'other'
        ];

        return in_array(strtolower($category), $validCategories)
            ? strtolower($category)
            : 'other';
    }

    private function validateItems(array $items): array
    {
        return array_map(function ($item) {
            return [
                'name' => $item['name'] ?? null,
                'price' => is_numeric($item['price'] ?? null) ? (float) $item['price'] : null,
                'quantity' => $item['quantity'] ?? null
            ];
        }, array_slice($items, 0, 20)); // Limit to 20 items
    }
}
