<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReceiptFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'category_id' => Category::factory(),
            'vendor_name' => $this->faker->company(),
            'amount' => $this->faker->randomFloat(2, 5, 500),
            'receipt_date' => $this->faker->dateTimeBetween('-3 months', 'now'),
            'image_path' => 'receipts/sample-receipt.jpg',
            'status' => $this->faker->randomElement(['processed', 'processing', 'failed']),
            'confidence_score' => $this->faker->randomFloat(2, 0.7, 1.0),
            'notes' => $this->faker->optional()->sentence(),
            'ai_analysis' => [
                'vendor_name' => $this->faker->company(),
                'amount' => $this->faker->randomFloat(2, 5, 500),
                'date' => $this->faker->date(),
                'category' => $this->faker->randomElement(['restaurant', 'groceries', 'transport']),
                'confidence' => $this->faker->randomFloat(2, 0.7, 1.0),
                'items' => []
            ],
            'processed_at' => now(),
        ];
    }

    public function processing(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'processing',
            'processed_at' => null,
        ]);
    }

    public function failed(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'failed',
            'processed_at' => null,
        ]);
    }
}
