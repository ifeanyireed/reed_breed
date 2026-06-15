<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Display a listing of reviews (Admin: all, Public: approved).
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user && $user->role === 'admin') {
            return Review::with('user')->latest()->get();
        }

        return Review::where('status', 'Approved')
            ->with('user')
            ->latest()
            ->get();
    }

    /**
     * Store a newly created review (Client only).
     */
    public function store(Request $request)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'text' => 'required|string',
        ]);

        $user = $request->user();

        $review = Review::create([
            'user_id' => $user->id,
            'rating' => $request->rating,
            'text' => $request->text,
            'status' => 'Pending',
        ]);

        return response()->json($review, 201);
    }

    /**
     * Update the specified review status (Admin only).
     */
    public function update(Request $request, $id)
    {
        $review = Review::findOrFail($id);

        $request->validate([
            'status' => 'required|string',
        ]);

        $review->update($request->all());

        return response()->json($review);
    }

    /**
     * Remove a review (Admin only).
     */
    public function destroy($id)
    {
        $review = Review::findOrFail($id);
        $review->delete();

        return response()->json(null, 204);
    }
}
