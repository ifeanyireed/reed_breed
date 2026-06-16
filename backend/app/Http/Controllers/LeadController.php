<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lead;
use App\Services\EmailService;

class LeadController extends Controller
{
    protected $emailService;

    public function __construct(EmailService $emailService)
    {
        $this->emailService = $emailService;
    }

    // Frontend: Submit new lead
    public function store(Request $request)
    {
        $validated = $request->validate([
            'contact' => 'required|string|max:255', // Name
            'company' => 'nullable|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'website' => 'nullable|url|max:255',
            'details' => 'nullable|string', // Project Details
        ]);

        $lead = Lead::create([
            'contact' => $validated['contact'],
            'company' => $validated['company'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'website' => $validated['website'] ?? null,
            'details' => $validated['details'] ?? null,
            'status' => 'New',
        ]);

        // Notify Admin
        $this->emailService->notifyAdminNewLead($lead);

        return response()->json(['message' => 'Proposal sent successfully', 'lead' => $lead], 201);
    }

    // Admin: List all leads
    public function index()
    {
        $leads = Lead::orderBy('created_at', 'desc')->get();
        return response()->json($leads);
    }

    // Admin: Update lead status
    public function update(Request $request, $id)
    {
        $lead = Lead::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|string|in:New,In Progress,Qualified,Lost,Won',
            'industry' => 'nullable|string|max:255',
        ]);

        $lead->update($validated);

        return response()->json(['message' => 'Lead updated successfully', 'lead' => $lead]);
    }

    public function destroy($id)
    {
        $lead = Lead::findOrFail($id);
        $lead->delete();
        return response()->json(null, 204);
    }
}
