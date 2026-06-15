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
        ]);

        return SubscriptionPlan::create($request->all());
    }

    /**
     * Admin: Assign a plan to a user.
     */
    public function assignToUser(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'plan_id' => 'required|exists:subscription_plans,id',
        ]);

        // Deactivate old subscriptions
        UserSubscription::where('user_id', $request->user_id)
            ->update(['status' => 'Expired']);

        return UserSubscription::create([
            'user_id' => $request->user_id,
            'plan_id' => $request->plan_id,
            'status' => 'Active',
            'start_date' => now(),
        ]);
    }
}
