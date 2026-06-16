<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    /**
     * Display a listing of invoices (Admin: all, Client: own).
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            return Invoice::with(['user', 'plan'])->latest()->get();
        }

        return Invoice::where('user_id', $user->id)
            ->with('plan')
            ->latest()
            ->get();
    }

    /**
     * Display the specified invoice.
     */
    public function show(Request $request, $id)
    {
        $invoice = Invoice::with('plan')->findOrFail($id);

        // Ensure user can only see their own invoice unless admin
        if ($request->user()->role !== 'admin' && $invoice->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return $invoice;
    }

    /**
     * Store a newly created invoice (Admin only).
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'plan_id' => 'nullable|exists:subscription_plans,id',
            'amount' => 'required|numeric',
            'status' => 'required|string',
            'due_date' => 'required|date',
            'pdf_url' => 'nullable|url',
        ]);

        $invoice = Invoice::create($request->all());

        return response()->json($invoice, 201);
    }

    /**
     * Update the specified invoice (Admin only).
     */
    public function update(Request $request, $id)
    {
        $invoice = Invoice::findOrFail($id);

        $request->validate([
            'status' => 'sometimes|required|string',
            'plan_id' => 'sometimes|nullable|exists:subscription_plans,id',
            'pdf_url' => 'sometimes|nullable|url',
        ]);

        $oldStatus = $invoice->status;
        $invoice->update($request->all());

        // If invoice is marked as Paid and has a plan attached, activate the subscription
        if ($oldStatus !== 'Paid' && $invoice->status === 'Paid' && $invoice->plan_id) {
            // Expire old subscriptions for this user
            \App\Models\UserSubscription::where('user_id', $invoice->user_id)
                ->update(['status' => 'Expired']);

            $plan = $invoice->plan;
            $startDate = now();
            $endDate = null;

            if ($plan->interval === 'monthly') {
                $endDate = $startDate->copy()->addMonth();
            } elseif ($plan->interval === 'yearly') {
                $endDate = $startDate->copy()->addYear();
            } elseif ($plan->interval === 'one-off') {
                $endDate = $startDate->copy()->addMonth();
            }

            // Create new active subscription based on the paid invoice's plan
            \App\Models\UserSubscription::create([
                'user_id' => $invoice->user_id,
                'plan_id' => $invoice->plan_id,
                'amount' => $invoice->amount,
                'status' => 'Active',
                'start_date' => $startDate,
                'end_date' => $endDate,
            ]);
        }

        return response()->json($invoice);
    }

    /**
     * Remove an invoice (Admin only).
     */
    public function destroy($id)
    {
        $invoice = Invoice::findOrFail($id);
        $invoice->delete();

        return response()->json(null, 204);
    }
}
