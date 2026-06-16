<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Deliverable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    /**
     * Get all clients (Admin only).
     */
    public function getClients()
    {
        $clients = \App\Models\User::where('role', 'client')->get();
        return response()->json($clients);
    }

    /**
     * Display a listing of projects (Admin: all, Client: own).
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            return Project::with(['client', 'deliverables'])->latest()->get();
        }

        return Project::where('client_id', $user->id)
            ->with('deliverables')
            ->latest()
            ->get();
    }

    /**
     * Store a newly created project (Admin only).
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'client_id' => 'required|exists:users,id',
            'status' => 'required|string',
            'start_date' => 'required|date',
        ]);

        $project = Project::create($request->all());

        return response()->json($project, 201);
    }

    /**
     * Update the specified project (Admin only).
     */
    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'status' => 'sometimes|required|string',
        ]);

        $project->update($request->all());

        return response()->json($project);
    }

    /**
     * Add a deliverable to a project (Admin only).
     */
    public function addDeliverable(Request $request, $projectId)
    {
        $project = Project::findOrFail($projectId);

        $request->validate([
            'title' => 'required|string|max:255',
            'status' => 'required|string',
        ]);

        $deliverable = $project->deliverables()->create($request->all());

        return response()->json($deliverable, 201);
    }

    /**
     * Update a deliverable (Admin only).
     */
    public function updateDeliverable(Request $request, $id)
    {
        $deliverable = Deliverable::findOrFail($id);

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'status' => 'sometimes|required|string',
        ]);

        $deliverable->update($request->all());

        return response()->json($deliverable);
    }

    /**
     * Remove a project (Admin only).
     */
    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();

        return response()->json(null, 204);
    }
}
