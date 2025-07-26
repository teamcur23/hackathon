<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Receipt extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'category_id',
        'vendor_name',
        'amount',
        'receipt_date',
        'image_path',
        'image_url',
        'status',
        'ai_analysis',
        'confidence_score',
        'notes',
        'raw_gemini_response',
        'processed_at'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'confidence_score' => 'decimal:2',
        'receipt_date' => 'date',
        'ai_analysis' => 'array',
        'raw_gemini_response' => 'array',
        'processed_at' => 'datetime'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function getImageUrlAttribute(): string
    {
        if ($this->attributes['image_url']) {
            return $this->attributes['image_url'];
        }

        if ($this->image_path) {
            return Storage::url($this->image_path);
        }

        return '/placeholder.svg?height=200&width=200';
    }

    public function scopeProcessed($query)
    {
        return $query->where('status', 'processed');
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeInDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('receipt_date', [$startDate, $endDate]);
    }

    public function markAsProcessing(): void
    {
        $this->update(['status' => 'processing']);
    }

    public function markAsProcessed(array $analysisData): void
    {
        $this->update([
            'status' => 'processed',
            'ai_analysis' => $analysisData,
            'processed_at' => now()
        ]);
    }

    public function markAsFailed(): void
    {
        $this->update(['status' => 'failed']);
    }
}
