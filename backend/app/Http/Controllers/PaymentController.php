<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\UserSubscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    /**
     * Handle Paystack Webhook
     */
    public function handleWebhook(Request $request)
    {
        // Verify signature
        $paystackSignature = $request->header('x-paystack-signature');
        $secretKey = config('services.paystack.secret_key');

        if (!$paystackSignature || $paystackSignature !== hash_hmac('sha512', $request->getContent(), $secretKey)) {
            Log::error('Invalid Paystack signature');
            return response()->json(['message' => 'Invalid signature'], 400);
        }

        $payload = $request->all();
        $event = $payload['event'] ?? null;

        if ($event === 'charge.success') {
            $data = $payload['data'];
            $invoiceId = $data['metadata']['invoice_id'] ?? null;
            
            if ($invoiceId) {
                $this->processSuccessfulPayment($invoiceId, $data['reference']);
            }
        }

        return response()->json(['status' => 'success'], 200);
    }

    /**
     * Process the successful payment
     */
    protected function processSuccessfulPayment($invoiceId, $reference)
    {
        $invoice = Invoice::find($invoiceId);

        if ($invoice && $invoice->status !== 'Paid') {
            $invoice->update([
                'status' => 'Paid',
                // You might want to store the reference somewhere, 
                // maybe add a 'transaction_reference' column to invoices later.
            ]);

            // Activate subscription
            if ($invoice->plan_id) {
                // Expire old subscriptions for this user
                UserSubscription::where('user_id', $invoice->user_id)
                    ->update(['status' => 'Expired']);

                $plan = $invoice->plan;
                $startDate = now();
                $endDate = null;

                if ($plan->interval === 'monthly') {
                    $endDate = $startDate->copy()->addMonth();
                } elseif ($plan->interval === 'yearly') {
                    $endDate = $startDate->copy()->addYear();
                } elseif ($plan->interval === 'one-off') {
                    // For one-off, maybe default to 1 month or leave as null? 
                    // Let's set it to 1 month for visibility, or keep it null if it truly doesn't expire.
                    // User asked for "expiry date", so let's provide one.
                    $endDate = $startDate->copy()->addMonth(); 
                }

                // Create new active subscription
                UserSubscription::create([
                    'user_id' => $invoice->user_id,
                    'plan_id' => $invoice->plan_id,
                    'amount' => $invoice->amount,
                    'status' => 'Active',
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                ]);

                Log::info("Subscription activated for User ID: {$invoice->user_id} via Invoice ID: {$invoiceId}");
            }
        }
    }
}
