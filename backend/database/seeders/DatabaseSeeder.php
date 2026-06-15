<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\SubscriptionPlan;
use App\Models\UserSubscription;
use App\Models\Project;
use App\Models\Deliverable;
use App\Models\Review;
use App\Models\Appointment;
use App\Models\Lead;
use App\Models\Category;
use App\Models\BlogPost;
use App\Models\Invoice;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Users
        $admin = User::updateOrCreate(
            ['email' => 'admin@reedbreed.cc'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
            ]
        );

        $client1 = User::updateOrCreate(
            ['email' => 'alex@riveradesign.com'],
            [
                'name' => 'Alex Rivera',
                'password' => Hash::make('client123'),
                'role' => 'client',
            ]
        );

        $client2 = User::updateOrCreate(
            ['email' => 'sarah@johnsoncreative.com'],
            [
                'name' => 'Sarah Johnson',
                'password' => Hash::make('client123'),
                'role' => 'client',
            ]
        );

        $client3 = User::updateOrCreate(
            ['email' => 'david@chentech.io'],
            [
                'name' => 'David Chen',
                'password' => Hash::make('client123'),
                'role' => 'client',
            ]
        );

        // 2. Subscription Plans
        $growthPlan = SubscriptionPlan::updateOrCreate(
            ['name' => 'Growth Plan'],
            [
                'price' => 2500,
                'interval' => 'monthly',
                'features' => 'AI Automation, Sales CRM, Weekly Strategy Calls, Email Marketing'
            ]
        );

        $scalePlan = SubscriptionPlan::updateOrCreate(
            ['name' => 'Scale Plan'],
            [
                'price' => 5000,
                'interval' => 'monthly',
                'features' => 'Custom AI Models, Multi-channel Funnels, 24/7 Priority Support, Dedicated Account Manager'
            ]
        );

        // 3. User Subscriptions
        UserSubscription::create([
            'user_id' => $client1->id,
            'plan_id' => $growthPlan->id,
            'status' => 'Active',
            'start_date' => now()->subMonths(1),
        ]);

        UserSubscription::create([
            'user_id' => $client2->id,
            'plan_id' => $scalePlan->id,
            'status' => 'Active',
            'start_date' => now()->subMonths(3),
        ]);

        // 4. Projects & Deliverables
        $project1 = Project::create([
            'name' => 'Brand System & AI Integration',
            'status' => 'Active',
            'client_id' => $client1->id,
            'start_date' => now()->subDays(15),
        ]);

        $project1->deliverables()->createMany([
            ['title' => 'Brand Identity Framework', 'status' => 'Completed', 'due_date' => now()->subDays(5)],
            ['title' => 'AI Chatbot Logic & Training', 'status' => 'In Progress', 'due_date' => now()->addDays(10)],
            ['title' => 'Sales Pipeline Setup', 'status' => 'Pending', 'due_date' => now()->addDays(20)],
        ]);

        $project2 = Project::create([
            'name' => 'Next-Gen E-commerce Platform',
            'status' => 'In Progress',
            'client_id' => $client2->id,
            'start_date' => now()->subDays(45),
        ]);

        $project2->deliverables()->createMany([
            ['title' => 'UI/UX Design Phase', 'status' => 'Completed', 'due_date' => now()->subDays(20)],
            ['title' => 'Backend API Development', 'status' => 'In Progress', 'due_date' => now()->addDays(5)],
            ['title' => 'Payment Gateway Integration', 'status' => 'Pending', 'due_date' => now()->addDays(15)],
        ]);

        // 5. Invoices
        Invoice::create([
            'user_id' => $client1->id,
            'amount' => 2500,
            'status' => 'Paid',
            'due_date' => now()->subDays(10),
        ]);

        Invoice::create([
            'user_id' => $client2->id,
            'amount' => 5000,
            'status' => 'Pending',
            'due_date' => now()->addDays(5),
        ]);

        // 6. Reviews
        Review::create([
            'user_id' => $client1->id,
            'rating' => 5,
            'text' => "Reed Breed didn't just build us a website — they built us a system. Our booking inquiries tripled within the first month of launch.",
            'status' => 'Approved',
        ]);

        Review::create([
            'user_id' => $client2->id,
            'rating' => 5,
            'text' => "The level of technical expertise and creative vision they brought to our e-commerce project was staggering. Best investment we've made.",
            'status' => 'Approved',
        ]);

        Review::create([
            'user_id' => $client3->id,
            'rating' => 4,
            'text' => "Great team to work with. They really understood our market and delivered a solid platform. Minor delays in communication but the quality is top-notch.",
            'status' => 'Approved',
        ]);

        Review::create([
            'user_id' => $client1->id,
            'rating' => 5,
            'text' => "Absolutely phenomenal service. We are already planning our next project with them.",
            'status' => 'Pending',
        ]);

        Review::create([
            'user_id' => $client2->id,
            'rating' => 1,
            'text' => "Testing the rejection pipeline. This is a sample negative review that should be rejected by admin.",
            'status' => 'Rejected',
        ]);

        // 7. Appointments
        Appointment::create([
            'name' => 'John Doe',
            'email' => 'john.doe@example.com',
            'date' => now()->addDays(2)->format('Y-m-d'),
            'time' => '10:00',
            'type' => 'Discovery Call',
            'status' => 'Upcoming',
            'meeting_url' => 'https://zoom.us/j/123456789'
        ]);

        Appointment::create([
            'name' => 'Sarah Johnson',
            'email' => 'sarah@johnsoncreative.com',
            'date' => now()->addDays(5)->format('Y-m-d'),
            'time' => '14:30',
            'type' => 'Strategy Session',
            'status' => 'Upcoming',
            'meeting_url' => 'https://meet.google.com/abc-defg-hij'
        ]);

        // 8. Leads
        Lead::create([
            'company' => 'TechNova Solutions',
            'contact' => 'Marcus Thorne',
            'email' => 'marcus@technova.io',
            'status' => 'New',
            'details' => 'Interested in AI-driven CRM integration for their sales team.',
        ]);

        Lead::create([
            'company' => 'GreenLeaf Org',
            'contact' => 'Elena Gomez',
            'email' => 'elena@greenleaf.org',
            'status' => 'Qualified',
            'details' => 'Looking for a full brand refresh and sustainable e-commerce setup.',
        ]);

        // 9. Blog Categories & Posts
        $cat1 = Category::create(['name' => 'AI Automation', 'slug' => 'ai-automation']);
        $cat2 = Category::create(['name' => 'Digital Strategy', 'slug' => 'digital-strategy']);

        BlogPost::create([
            'category_id' => $cat1->id,
            'title' => 'The Future of AI in SME Sales',
            'slug' => 'future-of-ai-sme-sales',
            'excerpt' => 'How small businesses are leveraging AI to outpace larger competitors.',
            'content' => 'Full article content about AI automation in sales...',
            'status' => 'Published',
        ]);

        BlogPost::create([
            'category_id' => $cat2->id,
            'title' => 'Scaling Your Creative Agency',
            'slug' => 'scaling-creative-agency',
            'excerpt' => 'Proven strategies for moving from boutique to global presence.',
            'content' => 'Full article content about digital strategy for agencies...',
            'status' => 'Published',
        ]);
    }
}
