<?php

namespace App\Http\Controllers;

use App\Models\SubscriptionPlan;
use App\Models\UserSubscription;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    /**
     * Display a listing of plans (Public).
     */
    public function index()
    {
        return SubscriptionPlan::all();
    }

    /**
     * Display the current user's subscription.
     */
    public function me(Request $request)
    {
        return UserSubscription::where('user_id', $request->user()->id)
            ->with('plan')
            ->orderByRaw("CASE WHEN status = 'Active' THEN 0 ELSE 1 END")
            ->latest()
            ->first();
    }

    /**
     * Admin: Store a new plan.
     */
    public function storePlan(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric',
            'interval' => 'required|string',
            'features' => 'required|string',
        ]);

        return SubscriptionPlan::create($request->all());
    }

    /**
     * Admin: Update an existing plan.
     */
    public function updatePlan(Request $request, $id)
    {
        $plan = SubscriptionPlan::findOrFail($id);
        
        $request->validate([
            'name' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric',
            'interval' => 'sometimes|required|string',
            'features' => 'sometimes|required|string',
        ]);

        $plan->update($request->all());
        return response()->json($plan);
    }

    /**
     * Admin: Delete a plan.
     */
    public function destroyPlan($id)
    {
        $plan = SubscriptionPlan::findOrFail($id);
        $plan->delete();
        return response()->json(null, 204);
    }

    /**
     * Admin: Assign a plan to a user.
     */
    public function assignToUser(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'plan_id' => 'required|exists:subscription_plans,id',
            'amount' => 'required|numeric',
        ]);

        // Deactivate old subscriptions
        UserSubscription::where('user_id', $request->user_id)
            ->update(['status' => 'Expired']);

        $plan = SubscriptionPlan::find($request->plan_id);
        $startDate = now();
        $endDate = null;

        if ($plan->interval === 'monthly') {
            $endDate = $startDate->copy()->addMonth();
        } elseif ($plan->interval === 'yearly') {
            $endDate = $startDate->copy()->addYear();
        } elseif ($plan->interval === 'one-off') {
            $endDate = $startDate->copy()->addMonth();
        }

        return UserSubscription::create([
            'user_id' => $request->user_id,
            'plan_id' => $request->plan_id,
            'amount' => $request->amount,
            'status' => 'Active',
            'start_date' => $startDate,
            'end_date' => $endDate,
        ]);
    }
}
