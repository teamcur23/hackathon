<?php

namespace App\Jobs;

use App\Models\Category;
use App\Models\Receipt;
use App\Models\MonthlySummary;
use App\Services\GeminiService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ProcessReceiptJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 120;
    public int $tries = 3;

    public function __construct(
        private Receipt $receipt
    ) {}

    public function handle(GeminiService $geminiService): void
    {
        try {
            Log::info('Starting receipt processing', ['receipt_id' => $this->receipt->id]);

            // Mark as processing
            $this->receipt->markAsProcessing();

            // Get the full path to the image
            $imagePath = Storage::disk('public')->path($this->receipt->image_path);

            if (!file_exists($imagePath)) {
                throw new \Exception('Receipt image file not found: ' . $imagePath);
            }

            // Analyze with Gemini
            $analysisData = $geminiService->analyzeReceiptImage($imagePath);

            // Find or create category
            $category = null;
            if ($analysisData['category']) {
                $category = Category::where('slug', $analysisData['category'])->first();
            }

            // If no category found by slug, try to find by keywords
            if (!$category && $analysisData['vendor_name']) {
                $category = Category::findByKeywords([$analysisData['vendor_name']]);
            }

            // Default to 'other' category if none found
            if (!$category) {
                $category = Category::where('slug', 'other')->first();
            }

            // Update receipt with analysis results
            $this->receipt->update([
                'vendor_name' => $analysisData['vendor_name'],
                'amount' => $analysisData['amount'],
                'receipt_date' => $analysisData['date'] ? \Carbon\Carbon::parse($analysisData['date']) : now(),
                'category_id' => $category?->id,
                'confidence_score' => $analysisData['confidence'],
                'ai_analysis' => $analysisData,
                'status' => 'processed',
                'processed_at' => now()
            ]);

            // Update monthly summary
            $receiptDate = $this->receipt->receipt_date ?? now();
            MonthlySummary::updateForUser(
                $this->receipt->user_id,
                $receiptDate->year,
                $receiptDate->month
            );

            Log::info('Receipt processing completed successfully', [
                'receipt_id' => $this->receipt->id,
                'vendor' => $analysisData['vendor_name'],
                'amount' => $analysisData['amount']
            ]);
        } catch (\Exception $e) {
            Log::error('Receipt processing failed', [
                'receipt_id' => $this->receipt->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            $this->receipt->markAsFailed();

            // Re-throw to trigger retry mechanism
            throw $e;
        }
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('Receipt processing job failed permanently', [
            'receipt_id' => $this->receipt->id,
            'error' => $exception->getMessage()
        ]);

        $this->receipt->markAsFailed();
    }
}
