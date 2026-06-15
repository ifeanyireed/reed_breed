<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointment;

class AppointmentController extends Controller
{
    // Frontend: Submit new booking
    public function book(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'date' => 'required|date_format:Y-m-d',
            'time' => 'required|string|max:50',
            'type' => 'required|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $validated['status'] = 'Upcoming';
        
        // Link to user if logged in
        if ($user = $request->user('sanctum')) {
            $validated['user_id'] = $user->id;
        }

        $appointment = Appointment::create($validated);

        return response()->json(['message' => 'Appointment booked successfully', 'appointment' => $appointment], 201);
    }

    // Admin/Client: List appointments
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            $appointments = Appointment::orderBy('date', 'desc')->orderBy('time', 'asc')->get();
        } else {
            // Client fetches only their own (or matching email if not hard-linked initially)
            $appointments = Appointment::where('user_id', $user->id)
                ->orWhere('email', $user->email)
                ->orderBy('date', 'desc')
                ->orderBy('time', 'asc')
                ->get();
        }
        
        return response()->json($appointments);
    }

    // Admin: Manual entry
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'date' => 'required|date_format:Y-m-d',
            'time' => 'required|string|max:50',
            'type' => 'required|string|max:255',
            'notes' => 'nullable|string',
            'status' => 'sometimes|in:Upcoming,Completed,Cancelled',
            'meeting_url' => 'nullable|url'
        ]);

        $validated['status'] = $validated['status'] ?? 'Upcoming';

        $appointment = Appointment::create($validated);

        return response()->json($appointment, 201);
    }

    // Admin: Update status or meeting link
    public function update(Request $request, $id)
    {
        $appointment = Appointment::findOrFail($id);

        $validated = $request->validate([
            'status' => 'sometimes|in:Upcoming,Completed,Cancelled',
            'meeting_url' => 'sometimes|nullable|url'
        ]);

        $appointment->update($validated);

        return response()->json($appointment);
    }

    // Admin: Delete appointment
    public function destroy($id)
    {
        $appointment = Appointment::findOrFail($id);
        $appointment->delete();
        return response()->json(null, 204);
    }
}
