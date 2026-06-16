<?php

namespace App\Services;

use Illuminate\Support\Facades\Mail;

class EmailService
{
    protected $adminEmail = 'admin@reedbreed.cc';

    public function notifyAdminNewLead($lead)
    {
        $subject = "New Lead Submitted: {$lead->contact}";
        $body = "A new lead has been submitted.\n\n"
              . "Name: {$lead->contact}\n"
              . "Company: {$lead->company}\n"
              . "Email: {$lead->email}\n"
              . "Phone: {$lead->phone}\n"
              . "Details: {$lead->details}\n";

        try {
            Mail::raw($body, function ($message) use ($subject) {
                $message->to($this->adminEmail)->subject($subject);
            });
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Mail sending failed: " . $e->getMessage());
        }
    }

    public function notifyAdminNewBooking($appointment)
    {
        $subject = "New Meeting Booked: {$appointment->name}";
        $body = "A new meeting has been scheduled.\n\n"
              . "Name: {$appointment->name}\n"
              . "Email: {$appointment->email}\n"
              . "Date: {$appointment->date}\n"
              . "Time: {$appointment->time}\n"
              . "Type: {$appointment->type}\n"
              . "Notes: {$appointment->notes}\n";

        try {
            Mail::raw($body, function ($message) use ($subject) {
                $message->to($this->adminEmail)->subject($subject);
            });
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Mail sending failed: " . $e->getMessage());
        }
    }

    public function notifyClientMeetingLink($appointment)
    {
        if (!$appointment->meeting_url || !$appointment->email) {
            return;
        }

        $subject = "Meeting Link Added: Your Call with Reed Breed";
        $body = "Hi {$appointment->name},\n\n"
              . "The meeting link for your upcoming call has been added.\n\n"
              . "Date: {$appointment->date}\n"
              . "Time: {$appointment->time}\n"
              . "Join Link: {$appointment->meeting_url}\n\n"
              . "Looking forward to speaking with you!\n"
              . "The Reed Breed Team";

        try {
            Mail::raw($body, function ($message) use ($appointment, $subject) {
                $message->to($appointment->email)->subject($subject);
            });
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Mail sending failed: " . $e->getMessage());
        }
    }
}
