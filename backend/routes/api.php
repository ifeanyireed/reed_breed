<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LeadController;

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\BlogPostController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\SupportTicketController;

// Public Routes
Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:5,1');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
Route::post('/contact', [LeadController::class, 'store'])->middleware('throttle:10,1');
Route::post('/appointments/book', [AppointmentController::class, 'book'])->middleware('throttle:10,1');
Route::get('/appointments/booked-slots', [AppointmentController::class, 'bookedSlots']);

// Paystack Webhook
Route::post('/webhooks/paystack', [PaymentController::class, 'handleWebhook']);

// Production Deployment Helper (Delete after use!)
Route::get('/deploy-helper', function () {
    if (app()->environment('production')) {
        try {
            // Create storage link
            \Illuminate\Support\Facades\Artisan::call('storage:link');
            // Run migrations
            \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
            return response()->json(['message' => 'Symlink created and migrations applied.']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    return response()->json(['message' => 'Not in production mode.'], 403);
});

// Subscriptions - Public list
Route::get('/subscriptions/plans', [SubscriptionController::class, 'index']);

// Chatbot Routes
Route::post('/chat', [ChatController::class, 'chat'])->middleware('throttle:15,1');
Route::post('/chat/handoff', [ChatController::class, 'handoff'])->middleware('throttle:5,1');

// Public Blog Routes
Route::get('/blog/categories', [CategoryController::class, 'index']);
Route::get('/blog/posts', [BlogPostController::class, 'index']);
Route::get('/blog/posts/{slug}', [BlogPostController::class, 'show']);
Route::post('/blog/comments', [CommentController::class, 'store'])->middleware('throttle:5,1');

// Public Reviews
Route::get('/reviews/public', [ReviewController::class, 'index']);

// Admin Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Projects & Job Progress
    Route::get('/admin/clients', [ProjectController::class, 'getClients']);
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::patch('/projects/{id}', [ProjectController::class, 'update']);
    Route::delete('/projects/{id}', [ProjectController::class, 'destroy']);
    
    // Deliverables (Milestones)
    Route::post('/projects/{projectId}/deliverables', [ProjectController::class, 'addDeliverable']);
    Route::patch('/deliverables/{id}', [ProjectController::class, 'updateDeliverable']);

    // Subscriptions - Management
    Route::get('/client/subscription', [SubscriptionController::class, 'me']);
    Route::post('/admin/subscriptions/plans', [SubscriptionController::class, 'storePlan']);
    Route::patch('/admin/subscriptions/plans/{id}', [SubscriptionController::class, 'updatePlan']);
    Route::delete('/admin/subscriptions/plans/{id}', [SubscriptionController::class, 'destroyPlan']);
    Route::post('/admin/subscriptions/assign', [SubscriptionController::class, 'assignToUser']);

    // Invoices
    Route::get('/invoices', [InvoiceController::class, 'index']);
    Route::get('/invoices/{id}', [InvoiceController::class, 'show']);
    Route::post('/invoices', [InvoiceController::class, 'store']);
    Route::patch('/invoices/{id}', [InvoiceController::class, 'update']);
    Route::delete('/invoices/{id}', [InvoiceController::class, 'destroy']);

    // Reviews
    Route::get('/reviews', [ReviewController::class, 'index']);
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::patch('/reviews/{id}', [ReviewController::class, 'update']);
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);

    // Leads Funnel
    Route::get('/leads', [LeadController::class, 'index']);
    Route::patch('/leads/{id}', [LeadController::class, 'update']);
    Route::delete('/leads/{id}', [LeadController::class, 'destroy']);

    // Blog CMS - Categories
    Route::post('/blog/categories', [CategoryController::class, 'store']);
    Route::patch('/blog/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/blog/categories/{id}', [CategoryController::class, 'destroy']);

    // Blog CMS - Posts
    Route::get('/admin/blog/posts', [BlogPostController::class, 'adminIndex']);
    Route::post('/admin/blog/posts', [BlogPostController::class, 'store']);
    Route::patch('/admin/blog/posts/{id}', [BlogPostController::class, 'update']);
    Route::delete('/admin/blog/posts/{id}', [BlogPostController::class, 'destroy']);
    Route::post('/admin/blog/upload-image', [BlogPostController::class, 'uploadEditorImage']);

    // Blog CMS - Comments
    Route::get('/admin/blog/comments', [CommentController::class, 'index']);
    Route::patch('/admin/blog/comments/{id}', [CommentController::class, 'update']);
    Route::delete('/admin/blog/comments/{id}', [CommentController::class, 'destroy']);

    // Appointments
    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::post('/appointments/manual', [AppointmentController::class, 'store']);
    Route::patch('/appointments/{id}', [AppointmentController::class, 'update']);
    Route::delete('/appointments/{id}', [AppointmentController::class, 'destroy']);

    // Support Tickets
    Route::get('/support/tickets', [SupportTicketController::class, 'index']);
    Route::post('/support/tickets', [SupportTicketController::class, 'store']);
    Route::get('/support/tickets/{id}', [SupportTicketController::class, 'show']);
    Route::post('/support/tickets/{id}/reply', [SupportTicketController::class, 'reply']);
    Route::patch('/support/tickets/{id}/status', [SupportTicketController::class, 'updateStatus']);
});
