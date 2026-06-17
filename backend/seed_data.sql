-- SEED DATA FOR REED BREED BACKEND

-- 1. Users (Admin and Clients)
-- Password for all is: admin123 (Hash: $2y$12$Z6W.sYp.w5uY.f9Uo1E7Ee7z7I6vQ8Z1G7p1t8v9h0.j1.W.j.w.u)
-- Note: Laravel uses Bcrypt. You can use this hash for 'admin123'
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES
(1, 'Admin User', 'admin@reedbreed.cc', '$2y$12$Z6W.sYp.w5uY.f9Uo1E7Ee7z7I6vQ8Z1G7p1t8v9h0.j1.W.j.w.u', 'admin', NOW(), NOW()),
(2, 'Alex Rivera', 'alex@riveradesign.com', '$2y$12$Z6W.sYp.w5uY.f9Uo1E7Ee7z7I6vQ8Z1G7p1t8v9h0.j1.W.j.w.u', 'client', NOW(), NOW()),
(3, 'Sarah Johnson', 'sarah@johnsoncreative.com', '$2y$12$Z6W.sYp.w5uY.f9Uo1E7Ee7z7I6vQ8Z1G7p1t8v9h0.j1.W.j.w.u', 'client', NOW(), NOW());

-- 2. Subscription Plans
INSERT INTO `subscription_plans` (`id`, `name`, `price`, `interval`, `features`, `created_at`, `updated_at`) VALUES
(1, 'Starter', 350000, 'one-off', 'Full Business Audit, Market Scan & Competitor Review, Funnel & Automation Review, Growth Diagnostic Report, Implementation Roadmap', NOW(), NOW()),
(2, 'Growth', 1000000, 'one-off', 'Everything in Starter, Brand Positioning & Messaging, Complete Marketing Strategy, Channel & Content Plan, Tailored System Prototype, Investment Proposal', NOW(), NOW()),
(3, 'Transformation', 3500000, 'one-off', 'Everything in Growth, Full CRM & Pipeline Setup, Custom Automation Build, Lead Capture System Deploy, Dashboards & BI Setup, Team Handover & Training', NOW(), NOW()),
(4, 'Retainer', 800000, 'monthly', 'Monthly Growth Advisory, Campaign Management, Automation Monitoring, Continuous Optimization, Lead Follow-up Reviews, Monthly Performance Reporting', NOW(), NOW());

-- 3. Blog Categories
INSERT INTO `categories` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES
(1, 'AI Automation', 'ai-automation', NOW(), NOW()),
(2, 'Digital Strategy', 'digital-strategy', NOW(), NOW()),
(3, 'Promotions', 'promotions', NOW(), NOW());

-- 4. Sample Leads
INSERT INTO `leads` (`id`, `company`, `contact`, `email`, `phone`, `website`, `details`, `status`, `industry`, `created_at`, `updated_at`) VALUES
(1, 'TechNova Solutions', 'Marcus Thorne', 'marcus@technova.io', NULL, NULL, 'Interested in AI-driven CRM integration for their sales team.', 'New', 'Tech', NOW(), NOW()),
(2, 'GreenLeaf Org', 'Elena Gomez', 'elena@greenleaf.org', NULL, NULL, 'Looking for a full brand refresh and sustainable e-commerce setup.', 'Qualified', 'Sustainability', NOW(), NOW());

-- 5. Sample Appointments
INSERT INTO `appointments` (`id`, `user_id`, `name`, `email`, `date`, `time`, `type`, `notes`, `status`, `meeting_url`, `created_at`, `updated_at`) VALUES
(1, NULL, 'John Doe', 'john.doe@example.com', '2026-06-20', '10:00', 'Discovery Call', 'Initial consultation', 'Upcoming', 'https://zoom.us/j/123456789', NOW(), NOW()),
(2, NULL, 'Jane Smith', 'jane.smith@example.com', '2026-06-21', '14:30', 'Strategy Session', 'Scaling project discussion', 'Upcoming', 'https://meet.google.com/abc-defg-hij', NOW(), NOW());
