<?php

namespace App\Http\Controllers;

use App\Http\Requests\UploadReceiptRequest;
use App\Jobs\ProcessReceiptJob;
use App\Models\Category;
use App\Models\Receipt;
use App\Models\MonthlySummary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ReceiptController extends Controller
{
    public function index(Request $request): Response
    {
        $receipts = Receipt::forUser(Auth::user()->id)
            ->with(['category'])
            ->when($request->category, function ($query, $category) {
                $query->whereHas('category', function ($q) use ($category) {
                    $q->where('slug', $category);
                });
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('vendor_name', 'like', "%{$search}%")
                        ->orWhere('notes', 'like', "%{$search}%");
                });
            })
            ->orderBy('receipt_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $categories = Category::active()->get();

        return Inertia::render('Receipts/Index', [
            'receipts' => $receipts,
            'categories' => $categories,
            'filters' => $request->only(['category', 'status', 'search'])
        ]);
    }

    public function store(UploadReceiptRequest $request)
    {
        try {
            // Store the uploaded image
            $imagePath = $request->file('image')->store('receipts/' . Auth::user()->id, 'public');

            // Create receipt record
            $receipt = Receipt::create([
                'user_id' => Auth::user()->id,
                'image_path' => $imagePath,
                'status' => 'pending',
                'notes' => $request->notes
            ]);

            // Dispatch job to process the receipt
            ProcessReceiptJob::dispatch($receipt);

            return Inertia::render('Dashboard', [
                'receipt' => $receipt->load('category'),
            ])->with('message', 'Receipt uploaded successfully and is being processed.');
        } catch (\Exception $e) {
            \Log::error('Receipt upload failed', [
                'error' => $e->getMessage(),
                'user_id' => Auth::user()->id
            ]);

            return back()->withErrors([
                'upload' => 'Failed to upload receipt. Please try again.'
            ]);
        }
    }

    public function show(Receipt $receipt): Response
    {
        $this->authorize('view', $receipt);

        return Inertia::render('Receipts/Show', [
            'receipt' => $receipt->load(['category', 'user'])
        ]);
    }

    public function edit(Receipt $receipt): Response
    {
        $this->authorize('update', $receipt);

        return Inertia::render('Receipts/Edit', [
            'receipt' => $receipt->load('category'),
            'categories' => Category::active()->get()
        ]);
    }

    public function update(Request $request, Receipt $receipt)
    {
        $this->authorize('update', $receipt);

        $validated = $request->validate([
            'vendor_name' => 'nullable|string|max:255',
            'amount' => 'nullable|numeric|min:0|max:999999.99',
            'receipt_date' => 'nullable|date',
            'category_id' => 'nullable|exists:categories,id',
            'notes' => 'nullable|string|max:1000'
        ]);

        $receipt->update($validated);

        // Update monthly summary if amount or date changed
        if (isset($validated['amount']) || isset($validated['receipt_date'])) {
            $date = $receipt->receipt_date ?? now();
            MonthlySummary::updateForUser(
                $receipt->user_id,
                $date->year,
                $date->month
            );
        }

        return back()->with('message', 'Receipt updated successfully.');
    }

    public function destroy(Receipt $receipt)
    {
        $this->authorize('delete', $receipt);

        try {
            // Delete the image file
            if ($receipt->image_path && Storage::disk('public')->exists($receipt->image_path)) {
                Storage::disk('public')->delete($receipt->image_path);
            }

            $date = $receipt->receipt_date ?? now();
            $userId = $receipt->user_id;

            $receipt->delete();

            // Update monthly summary
            MonthlySummary::updateForUser($userId, $date->year, $date->month);

            return back()->with('message', 'Receipt deleted successfully.');
        } catch (\Exception $e) {
            \Log::error('Receipt deletion failed', [
                'receipt_id' => $receipt->id,
                'error' => $e->getMessage()
            ]);

            return back()->withErrors([
                'delete' => 'Failed to delete receipt.'
            ]);
        }
    }

    public function reprocess(Receipt $receipt)
    {
        $this->authorize('update', $receipt);

        if ($receipt->status === 'processing') {
            return back()->withErrors([
                'reprocess' => 'Receipt is already being processed.'
            ]);
        }

        $receipt->update(['status' => 'pending']);
        ProcessReceiptJob::dispatch($receipt);

        return back()->with('message', 'Receipt reprocessing started.');
    }
}
