<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Restaurant',
                'slug' => 'restaurant',
                'color' => '#8b5cf6',
                'icon' => 'utensils',
                'description' => 'Dining out, fast food, cafes'
            ],
            [
                'name' => 'Groceries',
                'slug' => 'groceries',
                'color' => '#06b6d4',
                'icon' => 'shopping-cart',
                'description' => 'Supermarket, food shopping'
            ],
            [
                'name' => 'Transport',
                'slug' => 'transport',
                'color' => '#10b981',
                'icon' => 'car',
                'description' => 'Gas, public transport, rideshare'
            ],
            [
                'name' => 'Shopping',
                'slug' => 'shopping',
                'color' => '#f59e0b',
                'icon' => 'shopping-bag',
                'description' => 'Retail, online shopping, clothing'
            ],
            [
                'name' => 'Entertainment',
                'slug' => 'entertainment',
                'color' => '#ef4444',
                'icon' => 'film',
                'description' => 'Movies, games, subscriptions'
            ],
            [
                'name' => 'Healthcare',
                'slug' => 'healthcare',
                'color' => '#84cc16',
                'icon' => 'heart',
                'description' => 'Medical, pharmacy, wellness'
            ],
            [
                'name' => 'Utilities',
                'slug' => 'utilities',
                'color' => '#6366f1',
                'icon' => 'zap',
                'description' => 'Bills, internet, phone'
            ],
            [
                'name' => 'Other',
                'slug' => 'other',
                'color' => '#64748b',
                'icon' => 'more-horizontal',
                'description' => 'Miscellaneous expenses'
            ]
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
