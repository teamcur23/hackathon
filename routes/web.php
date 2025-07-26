<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReceiptController;
use App\Http\Controllers\ReportsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Laravel\WorkOS\Http\Middleware\ValidateSessionWithWorkOS;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', ValidateSessionWithWorkOS::class])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Receipt routes
    Route::resource('receipts', ReceiptController::class);
    Route::post('receipts/{receipt}/reprocess', [ReceiptController::class, 'reprocess'])
        ->name('receipts.reprocess');

    // Reports routes
    Route::get('/reports', [ReportsController::class, 'index'])->name('reports');
    Route::get('/reports/export', [ReportsController::class, 'export'])->name('reports.export');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
