<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BlogPost;
use Illuminate\Support\Str;

class BlogPostController extends Controller
{
    // Public: List published posts
    public function index()
    {
        $posts = BlogPost::where('status', 'Published')->with('category')->latest()->get();
        return response()->json($posts);
    }

    // Public: Get single post
    public function show($slug)
    {
        $post = BlogPost::where('slug', $slug)->with(['category', 'comments' => function($q) {
            $q->where('status', 'Approved');
        }])->firstOrFail();
        
        return response()->json($post);
    }

    // Admin: List all posts
    public function adminIndex()
    {
        $posts = BlogPost::with('category')->latest()->get();
        return response()->json($posts);
    }

    // Admin: Create post
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'status' => 'required|in:Draft,Published',
            'image' => 'nullable' // Could be file or base64
        ]);

        $validated['slug'] = Str::slug($validated['title']) . '-' . uniqid();

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('blog', 'public');
            $validated['image'] = $path;
        } elseif (is_string($request->image) && str_starts_with($request->image, 'data:image')) {
            // Handle Base64 if sent from frontend
            $imageData = $request->image;
            $extension = explode('/', explode(':', substr($imageData, 0, strpos($imageData, ';')))[1])[1];
            $replace = substr($imageData, 0, strpos($imageData, ',') + 1);
            $image = str_replace($replace, '', $imageData);
            $image = str_replace(' ', '+', $image);
            $imageName = 'blog/' . Str::random(20) . '.' . $extension;
            \Illuminate\Support\Facades\Storage::disk('public')->put($imageName, base64_decode($image));
            $validated['image'] = $imageName;
        }

        $post = BlogPost::create($validated);

        return response()->json($post, 201);
    }

    // Admin: Update post
    public function update(Request $request, $id)
    {
        $post = BlogPost::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'excerpt' => 'sometimes|nullable|string',
            'category_id' => 'sometimes|exists:categories,id',
            'status' => 'sometimes|in:Draft,Published',
            'image' => 'nullable'
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($post->image) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($post->image);
            }
            $path = $request->file('image')->store('blog', 'public');
            $validated['image'] = $path;
        } elseif (is_string($request->image) && str_starts_with($request->image, 'data:image')) {
            if ($post->image) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($post->image);
            }
            $imageData = $request->image;
            $extension = explode('/', explode(':', substr($imageData, 0, strpos($imageData, ';')))[1])[1];
            $replace = substr($imageData, 0, strpos($imageData, ',') + 1);
            $image = str_replace($replace, '', $imageData);
            $image = str_replace(' ', '+', $image);
            $imageName = 'blog/' . Str::random(20) . '.' . $extension;
            \Illuminate\Support\Facades\Storage::disk('public')->put($imageName, base64_decode($image));
            $validated['image'] = $imageName;
        }

        $post->update($validated);

        return response()->json($post);
    }

    // Admin: Delete post
    public function destroy($id)
    {
        $post = BlogPost::findOrFail($id);
        $post->delete();
        return response()->json(null, 204);
    }

    // Admin: Upload image from editor
    public function uploadEditorImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:5120', // Max 5MB
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('blog/editor', 'public');
            $url = rtrim(env('APP_URL', 'http://localhost'), '/') . '/storage/' . $path;
            
            return response()->json([
                'url' => $url
            ]);
        }

        return response()->json(['message' => 'Upload failed'], 400);
    }
}
