<?php

namespace App\Http\Controllers;

use App\Models\Receipt;
use App\Models\MonthlySummary;
use App\Models\Category;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        try {
            $userId = Auth::user()->id;
            $currentMonth = now();
            $previousMonth = now()->subMonth();

            // Get current month summary
            $currentSummary = MonthlySummary::where('user_id', $userId)
                ->where('year', $currentMonth->year)
                ->where('month', $currentMonth->month)
                ->first();

            // Get previous month for comparison
            $previousSummary = MonthlySummary::where('user_id', $userId)
                ->where('year', $previousMonth->year)
                ->where('month', $previousMonth->month)
                ->first();

            // Recent receipts
            $recentReceipts = Receipt::forUser($userId)
                ->with(['category'])
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get()
                ->map(function ($receipt) {
                    return [
                        'id' => $receipt->id,
                        'image_path' => $receipt->image_path,
                        'image_url' => $receipt->image_url,
                        'vendor_name' => $receipt->vendor_name,
                        'category' => $receipt->category ? [
                            'id' => $receipt->category->id,
                            'name' => $receipt->category->name,
                            'color' => $receipt->category->color,
                        ] : null,
                        'amount' => $receipt->amount,
                        'receipt_date' => $receipt->receipt_date?->format('Y-m-d'),
                        'status' => $receipt->status,
                        'confidence_score' => $receipt->confidence_score,
                        'notes' => $receipt->notes,
                        'created_at' => $receipt->created_at->format('Y-m-d H:i:s'),
                    ];
                });

            // Monthly trends (last 6 months)
            $monthlyTrends = MonthlySummary::where('user_id', $userId)
                ->where('year', '>=', now()->subMonths(6)->year)
                ->orderBy('year')
                ->orderBy('month')
                ->get()
                ->map(function ($summary) {
                    return [
                        'month' => Carbon::create($summary->year, $summary->month)->format('M Y'),
                        'amount' => (float) $summary->total_amount,
                        'count' => $summary->receipt_count
                    ];
                });

            // Calculate statistics
            $stats = $this->calculateDashboardStats($currentSummary, $previousSummary, $userId);

            // Get categories
            $categories = Category::get()->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'color' => $category->color,
                    'icon' => $category->icon,
                    'description' => $category->description,
                    'is_active' => $category->is_active,
                ];
            });

            return Inertia::render('Dashboard', [
                'stats' => $stats,
                'recentReceipts' => $recentReceipts,
                'monthlyTrends' => $monthlyTrends,
                'currentSummary' => $currentSummary,
                'categories' => $categories
            ]);
        } catch (\Exception $e) {
            Log::error('Dashboard loading failed', [
                'error' => $e->getMessage(),
                'user_id' => Auth::user()->id,
            ]);

            // Return safe defaults
            return Inertia::render('Dashboard', [
                'stats' => [
                    'totalSpent' => 0,
                    'totalChange' => 0,
                    'receiptCount' => 0,
                    'countChange' => 0,
                    'avgPerReceipt' => 0,
                    'avgChange' => 0,
                    'categoryCount' => 0
                ],
                'recentReceipts' => [],
                'monthlyTrends' => [],
                'currentSummary' => null,
                'categories' => []
            ]);
        }
    }

    private function calculateDashboardStats($currentSummary, $previousSummary, $userId): array
    {
        $currentTotal = $currentSummary?->total_amount ?? 0;
        $previousTotal = $previousSummary?->total_amount ?? 0;
        $currentCount = $currentSummary?->receipt_count ?? 0;
        $previousCount = $previousSummary?->receipt_count ?? 0;

        // Calculate percentage changes
        $totalChange = $previousTotal > 0
            ? (($currentTotal - $previousTotal) / $previousTotal) * 100
            : 0;

        $countChange = $previousCount > 0
            ? (($currentCount - $previousCount) / $previousCount) * 100
            : 0;

        $avgPerReceipt = $currentCount > 0 ? $currentTotal / $currentCount : 0;
        $previousAvg = $previousCount > 0 ? $previousTotal / $previousCount : 0;
        $avgChange = $previousAvg > 0
            ? (($avgPerReceipt - $previousAvg) / $previousAvg) * 100
            : 0;

        return [
            'totalSpent' => (float) $currentTotal,
            'totalChange' => round($totalChange, 1),
            'receiptCount' => $currentCount,
            'countChange' => round($countChange, 1),
            'avgPerReceipt' => (float) $avgPerReceipt,
            'avgChange' => round($avgChange, 1),
            'categoryCount' => $currentSummary?->category_breakdown
                ? count($currentSummary->category_breakdown)
                : 0
        ];
    }
}
