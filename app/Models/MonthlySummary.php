<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MonthlySummary extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'year',
        'month',
        'total_amount',
        'receipt_count',
        'category_breakdown',
        'average_per_receipt'
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'average_per_receipt' => 'decimal:2',
        'category_breakdown' => 'array'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function updateForUser(int $userId, int $year, int $month): void
    {
        $receipts = Receipt::forUser($userId)
            ->processed()
            ->whereYear('receipt_date', $year)
            ->whereMonth('receipt_date', $month)
            ->with('category')
            ->get();

        $totalAmount = $receipts->sum('amount');
        $receiptCount = $receipts->count();
        $averagePerReceipt = $receiptCount > 0 ? $totalAmount / $receiptCount : 0;

        $categoryBreakdown = $receipts->groupBy('category.name')
            ->map(function ($categoryReceipts, $categoryName) {
                return [
                    'name' => $categoryName ?? 'Other',
                    'amount' => $categoryReceipts->sum('amount'),
                    'count' => $categoryReceipts->count(),
                    'color' => $categoryReceipts->first()->category->color ?? '#64748b'
                ];
            })->values()->toArray();

        self::updateOrCreate(
            ['user_id' => $userId, 'year' => $year, 'month' => $month],
            [
                'total_amount' => $totalAmount,
                'receipt_count' => $receiptCount,
                'category_breakdown' => $categoryBreakdown,
                'average_per_receipt' => $averagePerReceipt
            ]
        );
    }
}
