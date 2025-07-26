<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('receipts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->nullable()->constrained()->onDelete('set null');
            $table->string('vendor_name')->nullable();
            $table->decimal('amount', 10, 2)->nullable();
            $table->date('receipt_date')->nullable();
            $table->string('image_path');
            $table->string('image_url')->nullable();
            $table->enum('status', ['pending', 'processing', 'processed', 'failed'])->default('pending');
            $table->json('ai_analysis')->nullable();
            $table->decimal('confidence_score', 3, 2)->nullable();
            $table->text('notes')->nullable();
            $table->json('raw_gemini_response')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['user_id', 'receipt_date']);
            $table->index(['user_id', 'category_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('receipts');
    }
};
