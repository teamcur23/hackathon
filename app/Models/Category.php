<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'color',
        'icon',
        'description',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean'
    ];

    public function receipts(): HasMany
    {
        return $this->hasMany(Receipt::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public static function findByKeywords(array $keywords): ?self
    {
        $keywordMap = [
            'restaurant' => ['restaurant', 'cafe', 'bar', 'pizza', 'burger', 'food', 'dining', 'bistro', 'grill'],
            'groceries' => ['market', 'grocery', 'supermarket', 'walmart', 'target', 'costco', 'whole foods', 'trader'],
            'transport' => ['gas', 'shell', 'exxon', 'bp', 'chevron', 'uber', 'lyft', 'taxi', 'metro', 'bus'],
            'shopping' => ['store', 'mall', 'amazon', 'ebay', 'clothing', 'fashion', 'electronics', 'best buy'],
            'entertainment' => ['cinema', 'movie', 'theater', 'netflix', 'spotify', 'game', 'entertainment'],
            'healthcare' => ['pharmacy', 'cvs', 'walgreens', 'hospital', 'clinic', 'medical', 'doctor'],
            'utilities' => ['electric', 'water', 'internet', 'phone', 'cable', 'utility', 'bill']
        ];

        foreach ($keywordMap as $categorySlug => $categoryKeywords) {
            foreach ($keywords as $keyword) {
                foreach ($categoryKeywords as $categoryKeyword) {
                    if (stripos($keyword, $categoryKeyword) !== false) {
                        return self::where('slug', $categorySlug)->first();
                    }
                }
            }
        }

        return self::where('slug', 'other')->first();
    }
}
