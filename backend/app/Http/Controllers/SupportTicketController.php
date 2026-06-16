<?php

namespace App\Http\Controllers;

use App\Models\SupportTicket;
use App\Models\TicketMessage;
use Illuminate\Http\Request;

class SupportTicketController extends Controller
{
    /**
     * Display a listing of tickets (Admin: all, Client: own).
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            return SupportTicket::with('user')->latest()->get();
        }

        return SupportTicket::where('user_id', $user->id)->latest()->get();
    }

    /**
     * Store a newly created ticket.
     */
    public function store(Request $request)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'category' => 'required|string',
            'priority' => 'required|string',
            'message' => 'required|string',
        ]);

        $ticket = SupportTicket::create([
            'user_id' => $request->user()->id,
            'subject' => $request->subject,
            'category' => $request->category,
            'priority' => $request->priority,
            'status' => 'Open',
        ]);

        $ticket->messages()->create([
            'user_id' => $request->user()->id,
            'message' => $request->message,
        ]);

        return response()->json($ticket->load('messages'), 201);
    }

    /**
     * Display the specified ticket.
     */
    public function show(Request $request, $id)
    {
        $ticket = SupportTicket::with(['user', 'messages.user'])->findOrFail($id);

        if ($request->user()->role !== 'admin' && $ticket->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return $ticket;
    }

    /**
     * Add a message to the ticket.
     */
    public function reply(Request $request, $id)
    {
        $ticket = SupportTicket::findOrFail($id);

        if ($request->user()->role !== 'admin' && $ticket->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'message' => 'required|string',
        ]);

        $message = $ticket->messages()->create([
            'user_id' => $request->user()->id,
            'message' => $request->message,
        ]);

        // If admin replies, mark as In Progress if it was Open
        if ($request->user()->role === 'admin' && $ticket->status === 'Open') {
            $ticket->update(['status' => 'In Progress']);
        }

        return response()->json($message->load('user'), 201);
    }

    /**
     * Update ticket status (Admin only).
     */
    public function updateStatus(Request $request, $id)
    {
        $ticket = SupportTicket::findOrFail($id);

        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'status' => 'required|string|in:Open,In Progress,Resolved,Closed',
        ]);

        $ticket->update(['status' => $request->status]);

        return response()->json($ticket);
    }
}
