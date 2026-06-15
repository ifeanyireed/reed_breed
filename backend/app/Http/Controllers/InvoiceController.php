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
            return Invoice::with('user')->latest()->get();
        }

        return Invoice::where('user_id', $user->id)
            ->latest()
            ->get();
    }

    /**
     * Store a newly created invoice (Admin only).
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
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
            'pdf_url' => 'sometimes|nullable|url',
        ]);

        $invoice->update($request->all());

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
