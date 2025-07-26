<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('monthly_summaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->year('year');
            $table->tinyInteger('month');
            $table->decimal('total_amount', 10, 2)->default(0);
            $table->integer('receipt_count')->default(0);
            $table->json('category_breakdown')->nullable();
            $table->decimal('average_per_receipt', 10, 2)->default(0);
            $table->timestamps();

            $table->unique(['user_id', 'year', 'month']);
            $table->index(['user_id', 'year', 'month']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('monthly_summaries');
    }
};
