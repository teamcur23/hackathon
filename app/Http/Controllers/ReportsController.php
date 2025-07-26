<?php

namespace App\Http\Controllers;

use App\Models\Receipt;
use App\Models\MonthlySummary;
use App\Models\Category;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ReportsController extends Controller
{
    public function index(Request $request): Response
    {
        $userId = Auth::user()->id;
        $period = $request->get('period', '6months');

        // Calculate date range based on period
        $dateRange = $this->getDateRange($period);

        // Get monthly trends
        $monthlyTrends = $this->getMonthlyTrends($userId, $dateRange);

        // Get category breakdown
        $categoryBreakdown = $this->getCategoryBreakdown($userId, $dateRange);

        // Get spending statistics
        $statistics = $this->getSpendingStatistics($userId, $dateRange);

        // Get top vendors
        $topVendors = $this->getTopVendors($userId, $dateRange);

        // Get daily spending pattern
        $dailyPattern = $this->getDailySpendingPattern($userId, $dateRange);

        return Inertia::render('Reports', [
            'monthlyTrends' => $monthlyTrends,
            'categoryBreakdown' => $categoryBreakdown,
            'statistics' => $statistics,
            'topVendors' => $topVendors,
            'dailyPattern' => $dailyPattern,
            'period' => $period,
            'dateRange' => [
                'start' => $dateRange['start']->format('Y-m-d'),
                'end' => $dateRange['end']->format('Y-m-d')
            ]
        ]);
    }

    public function export(Request $request)
    {
        $userId = Auth::user()->id;
        $period = $request->get('period', '6months');
        $format = $request->get('format', 'csv');

        $dateRange = $this->getDateRange($period);

        $receipts = Receipt::forUser($userId)
            ->with(['category'])
            ->whereBetween('receipt_date', [$dateRange['start'], $dateRange['end']])
            ->orderBy('receipt_date', 'desc')
            ->get();

        if ($format === 'csv') {
            return $this->exportToCsv($receipts);
        }

        return $this->exportToPdf($receipts, $dateRange);
    }

    private function getDateRange(string $period): array
    {
        $end = now();

        $start = match ($period) {
            '1month' => now()->subMonth(),
            '3months' => now()->subMonths(3),
            '6months' => now()->subMonths(6),
            '1year' => now()->subYear(),
            default => now()->subMonths(6)
        };

        return ['start' => $start, 'end' => $end];
    }

    private function getMonthlyTrends(int $userId, array $dateRange): array
    {
        $summaries = MonthlySummary::where('user_id', $userId)
            ->where(function ($query) use ($dateRange) {
                $query->where('year', '>', $dateRange['start']->year)
                    ->orWhere(function ($q) use ($dateRange) {
                        $q->where('year', $dateRange['start']->year)
                            ->where('month', '>=', $dateRange['start']->month);
                    });
            })
            ->where(function ($query) use ($dateRange) {
                $query->where('year', '<', $dateRange['end']->year)
                    ->orWhere(function ($q) use ($dateRange) {
                        $q->where('year', $dateRange['end']->year)
                            ->where('month', '<=', $dateRange['end']->month);
                    });
            })
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        return $summaries->map(function ($summary) {
            return [
                'month' => Carbon::create($summary->year, $summary->month)->format('M Y'),
                'amount' => (float) $summary->total_amount,
                'count' => $summary->receipt_count,
                'average' => (float) $summary->average_per_receipt
            ];
        })->toArray();
    }

    private function getCategoryBreakdown(int $userId, array $dateRange): array
    {
        $categoryData = Receipt::forUser($userId)
            ->processed()
            ->whereBetween('receipt_date', [$dateRange['start'], $dateRange['end']])
            ->join('categories', 'receipts.category_id', '=', 'categories.id')
            ->select(
                'categories.name',
                'categories.color',
                DB::raw('SUM(receipts.amount) as total_amount'),
                DB::raw('COUNT(*) as receipt_count'),
                DB::raw('AVG(receipts.amount) as average_amount')
            )
            ->groupBy('categories.id', 'categories.name', 'categories.color')
            ->orderBy('total_amount', 'desc')
            ->get();

        $totalSpent = $categoryData->sum('total_amount');

        return $categoryData->map(function ($category) use ($totalSpent) {
            return [
                'name' => $category->name,
                'amount' => (float) $category->total_amount,
                'count' => $category->receipt_count,
                'average' => (float) $category->average_amount,
                'percentage' => $totalSpent > 0 ? round(($category->total_amount / $totalSpent) * 100, 1) : 0,
                'color' => $category->color
            ];
        })->toArray();
    }

    private function getSpendingStatistics(int $userId, array $dateRange): array
    {
        $receipts = Receipt::forUser($userId)
            ->processed()
            ->whereBetween('receipt_date', [$dateRange['start'], $dateRange['end']])
            ->get();

        $totalAmount = $receipts->sum('amount');
        $receiptCount = $receipts->count();
        $averagePerReceipt = $receiptCount > 0 ? $totalAmount / $receiptCount : 0;

        // Calculate previous period for comparison
        $periodLength = $dateRange['end']->diffInDays($dateRange['start']);
        $previousStart = $dateRange['start']->copy()->subDays($periodLength);
        $previousEnd = $dateRange['start']->copy();

        $previousReceipts = Receipt::forUser($userId)
            ->processed()
            ->whereBetween('receipt_date', [$previousStart, $previousEnd])
            ->get();

        $previousTotal = $previousReceipts->sum('amount');
        $previousCount = $previousReceipts->count();
        $previousAverage = $previousCount > 0 ? $previousTotal / $previousCount : 0;

        // Calculate percentage changes
        $totalChange = $previousTotal > 0 ? (($totalAmount - $previousTotal) / $previousTotal) * 100 : 0;
        $countChange = $previousCount > 0 ? (($receiptCount - $previousCount) / $previousCount) * 100 : 0;
        $averageChange = $previousAverage > 0 ? (($averagePerReceipt - $previousAverage) / $previousAverage) * 100 : 0;

        return [
            'totalExpenses' => (float) $totalAmount,
            'totalChange' => round($totalChange, 1),
            'averageMonthly' => (float) ($totalAmount / max(1, $dateRange['end']->diffInMonths($dateRange['start']))),
            'averageChange' => round($averageChange, 1),
            'receiptsProcessed' => $receiptCount,
            'countChange' => round($countChange, 1),
            'highestCategory' => $this->getHighestCategory($userId, $dateRange)
        ];
    }

    private function getHighestCategory(int $userId, array $dateRange): ?array
    {
        $highest = Receipt::forUser($userId)
            ->processed()
            ->whereBetween('receipt_date', [$dateRange['start'], $dateRange['end']])
            ->join('categories', 'receipts.category_id', '=', 'categories.id')
            ->select(
                'categories.name',
                DB::raw('SUM(receipts.amount) as total_amount')
            )
            ->groupBy('categories.id', 'categories.name')
            ->orderBy('total_amount', 'desc')
            ->first();

        if (!$highest) return null;

        $totalSpent = Receipt::forUser($userId)
            ->processed()
            ->whereBetween('receipt_date', [$dateRange['start'], $dateRange['end']])
            ->sum('amount');

        return [
            'name' => $highest->name,
            'amount' => (float) $highest->total_amount,
            'percentage' => $totalSpent > 0 ? round(($highest->total_amount / $totalSpent) * 100, 1) : 0
        ];
    }

    private function getTopVendors(int $userId, array $dateRange): array
    {
        return Receipt::forUser($userId)
            ->processed()
            ->whereBetween('receipt_date', [$dateRange['start'], $dateRange['end']])
            ->whereNotNull('vendor_name')
            ->select(
                'vendor_name',
                DB::raw('SUM(amount) as total_amount'),
                DB::raw('COUNT(*) as visit_count'),
                DB::raw('AVG(amount) as average_amount')
            )
            ->groupBy('vendor_name')
            ->orderBy('total_amount', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($vendor) {
                return [
                    'name' => $vendor->vendor_name,
                    'total' => (float) $vendor->total_amount,
                    'visits' => $vendor->visit_count,
                    'average' => (float) $vendor->average_amount
                ];
            })
            ->toArray();
    }

    private function getDailySpendingPattern(int $userId, array $dateRange): array
    {
        $dailyData = Receipt::forUser($userId)
            ->processed()
            ->whereBetween('receipt_date', [$dateRange['start'], $dateRange['end']])
            ->select(
                DB::raw('DAYNAME(receipt_date) as day_name'),
                DB::raw('DAYOFWEEK(receipt_date) as day_number'),
                DB::raw('AVG(amount) as average_amount'),
                DB::raw('COUNT(*) as transaction_count')
            )
            ->groupBy('day_name', 'day_number')
            ->orderBy('day_number')
            ->get();

        return $dailyData->map(function ($day) {
            return [
                'day' => $day->day_name,
                'average' => (float) $day->average_amount,
                'count' => $day->transaction_count
            ];
        })->toArray();
    }

    private function exportToCsv($receipts)
    {
        $filename = 'expense-report-' . now()->format('Y-m-d') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ];

        $callback = function () use ($receipts) {
            $file = fopen('php://output', 'w');

            // CSV headers
            fputcsv($file, [
                'Date',
                'Vendor',
                'Category',
                'Amount',
                'Status',
                'Confidence',
                'Notes'
            ]);

            // CSV data
            foreach ($receipts as $receipt) {
                fputcsv($file, [
                    $receipt->receipt_date?->format('Y-m-d') ?? '',
                    $receipt->vendor_name ?? '',
                    $receipt->category?->name ?? '',
                    $receipt->amount ?? '',
                    $receipt->status,
                    $receipt->confidence_score ?? '',
                    $receipt->notes ?? ''
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    private function exportToPdf($receipts, $dateRange)
    {
        // This would require a PDF library like DomPDF or similar
        // For now, return JSON data that could be used by frontend PDF generation
        return response()->json([
            'receipts' => $receipts,
            'dateRange' => $dateRange,
            'summary' => [
                'total' => $receipts->sum('amount'),
                'count' => $receipts->count(),
                'average' => $receipts->avg('amount')
            ]
        ]);
    }
}
