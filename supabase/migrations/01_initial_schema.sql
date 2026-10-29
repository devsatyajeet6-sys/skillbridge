-- SkillBridge PostgreSQL Database Schema
-- Comprehensive schema with Row Level Security (RLS) for all 5 roles

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Base user table linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'company', 'skill_centre', 'institution', 'admin')),
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. INSTITUTIONS (Schools / Colleges)
CREATE TABLE IF NOT EXISTS public.institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    institution_name TEXT NOT NULL,
    institution_type TEXT NOT NULL CHECK (institution_type IN ('school', 'college', 'university', 'polytechnic')),
    address TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    institutional_email TEXT NOT NULL,
    phone TEXT NOT NULL,
    student_count_expected INT DEFAULT 0,
    verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    billing_terms TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. STUDENT PROFILES
CREATE TABLE IF NOT EXISTS public.student_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    education_level TEXT NOT NULL,
    institution_id UUID REFERENCES public.institutions(id) ON DELETE SET NULL,
    institution_name TEXT NOT NULL,
    graduation_year INT NOT NULL,
    location TEXT NOT NULL,
    preferred_career_path TEXT NOT NULL,
    preferred_locations TEXT[] DEFAULT '{}',
    desired_salary_min NUMERIC,
    desired_salary_max NUMERIC,
    employment_type TEXT NOT NULL DEFAULT 'full_time',
    share_profile_with_employers BOOLEAN DEFAULT true,
    cv_url TEXT,
    cv_name TEXT,
    cv_text TEXT,
    cv_score INT DEFAULT 0,
    job_readiness_score INT DEFAULT 0,
    bio TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    is_minor BOOLEAN DEFAULT false,
    guardian_consent_given BOOLEAN DEFAULT false,
    guardian_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SKILLS & STUDENT SKILLS
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    proficiency TEXT DEFAULT 'intermediate' CHECK (proficiency IN ('beginner', 'intermediate', 'advanced')),
    verified BOOLEAN DEFAULT false,
    certificate_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, skill_name)
);

-- 5. COMPANIES
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    business_email TEXT NOT NULL,
    industry TEXT NOT NULL,
    company_size TEXT NOT NULL,
    website TEXT,
    location TEXT NOT NULL,
    recruiter_name TEXT NOT NULL,
    recruiter_phone TEXT,
    logo_url TEXT,
    description TEXT,
    verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    subscription_tier TEXT NOT NULL DEFAULT 'pay_per_job' CHECK (subscription_tier IN ('pay_per_job', 'monthly_pro', 'enterprise')),
    job_credits_remaining INT DEFAULT 3,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SKILL CENTRES
CREATE TABLE IF NOT EXISTS public.skill_centres (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    centre_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    phone TEXT NOT NULL,
    training_categories TEXT[] DEFAULT '{}',
    delivery_modes TEXT[] DEFAULT '{}',
    location TEXT NOT NULL,
    address TEXT,
    website TEXT,
    verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    commission_rate NUMERIC DEFAULT 15,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. JOBS
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    company_logo TEXT,
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    work_mode TEXT NOT NULL CHECK (work_mode IN ('remote', 'hybrid', 'on_site')),
    experience_level TEXT NOT NULL CHECK (experience_level IN ('entry', 'mid', 'senior')),
    salary_min NUMERIC,
    salary_max NUMERIC,
    salary_currency TEXT DEFAULT 'INR',
    description TEXT NOT NULL,
    responsibilities TEXT[] DEFAULT '{}',
    requirements TEXT[] DEFAULT '{}',
    required_skills TEXT[] DEFAULT '{}',
    preferred_skills TEXT[] DEFAULT '{}',
    qualifications TEXT[] DEFAULT '{}',
    application_deadline DATE,
    moderation_status TEXT NOT NULL DEFAULT 'approved' CHECK (moderation_status IN ('approved', 'pending_review', 'archived')),
    is_active BOOLEAN DEFAULT true,
    views_count INT DEFAULT 0,
    applicants_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. COURSES & LESSONS
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    centre_id UUID REFERENCES public.skill_centres(id) ON DELETE CASCADE,
    centre_name TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    skills_taught TEXT[] DEFAULT '{}',
    duration_weeks INT NOT NULL,
    duration_hours INT NOT NULL,
    delivery_mode TEXT NOT NULL CHECK (delivery_mode IN ('recorded', 'live_online', 'offline')),
    language TEXT DEFAULT 'English',
    price NUMERIC DEFAULT 0,
    prerequisites TEXT[] DEFAULT '{}',
    learning_outcomes TEXT[] DEFAULT '{}',
    video_preview_url TEXT,
    offline_location TEXT,
    offline_schedule TEXT,
    moderation_status TEXT NOT NULL DEFAULT 'approved' CHECK (moderation_status IN ('approved', 'pending_review', 'rejected')),
    enrolled_count INT DEFAULT 0,
    rating NUMERIC DEFAULT 4.8,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.course_lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    duration_minutes INT DEFAULT 30,
    video_url TEXT NOT NULL,
    is_preview BOOLEAN DEFAULT false,
    order_index INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.course_enrolments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    course_title TEXT NOT NULL,
    student_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    enrolment_type TEXT NOT NULL DEFAULT 'paid' CHECK (enrolment_type IN ('paid', 'enquiry', 'institutional')),
    status TEXT NOT NULL DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'in_progress', 'completed', 'dropped')),
    progress_percent INT DEFAULT 0,
    completed_lessons TEXT[] DEFAULT '{}',
    certificate_issued BOOLEAN DEFAULT false,
    certificate_url TEXT,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 9. APPLICATIONS & INTERVIEWS
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    job_title TEXT NOT NULL,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    student_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    student_email TEXT NOT NULL,
    student_phone TEXT,
    education TEXT,
    cv_url TEXT,
    match_score INT NOT NULL,
    missing_skills TEXT[] DEFAULT '{}',
    possessed_skills TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'applied' CHECK (status IN ('applied', 'screening', 'shortlisted', 'interview_scheduled', 'interview_attended', 'offer_extended', 'offer_accepted', 'hired', 'rejected')),
    recruiter_notes TEXT,
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.interviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    job_title TEXT NOT NULL,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    student_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    student_email TEXT NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INT DEFAULT 45,
    mode TEXT NOT NULL CHECK (mode IN ('online_video', 'offline_in_person', 'phone')),
    meeting_link_or_address TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'attended', 'completed', 'cancelled', 'no_show')),
    outcome TEXT NOT NULL DEFAULT 'pending' CHECK (outcome IN ('pending', 'passed', 'failed')),
    feedback TEXT,
    interviewer_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. PLACEMENT ASSISTANCE PROGRAMME & REFUNDS (₹5000 fee, ₹2000 refund)
CREATE TABLE IF NOT EXISTS public.programme_enrolments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    student_email TEXT NOT NULL,
    fee_amount NUMERIC NOT NULL DEFAULT 5000,
    fee_paid BOOLEAN NOT NULL DEFAULT false,
    payment_id TEXT,
    transaction_ref TEXT,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    assistance_valid_until TIMESTAMPTZ,
    stage TEXT NOT NULL DEFAULT 'enrolled' CHECK (stage IN (
        'enrolled', 'interview_scheduled', 'interview_attended',
        'selected_by_employer', 'offer_received', 'offer_accepted',
        'placement_verified', 'refund_eligible', 'refund_requested',
        'refund_approved', 'refund_paid', 'assistance_period_completed'
    )),
    interviews_scheduled_count INT DEFAULT 0,
    interviews_attended_count INT DEFAULT 0,
    max_interviews_allowed INT DEFAULT 3,
    verified_company_name TEXT,
    verified_job_title TEXT,
    offer_letter_url TEXT,
    refund_status TEXT NOT NULL DEFAULT 'not_applicable' CHECK (refund_status IN (
        'not_applicable', 'eligible', 'requested', 'approved', 'rejected', 'paid'
    )),
    refund_amount NUMERIC DEFAULT 2000,
    refund_requested_at TIMESTAMPTZ,
    refund_approved_at TIMESTAMPTZ,
    refund_paid_at TIMESTAMPTZ,
    refund_transaction_id TEXT,
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. INSTITUTION BATCHES
CREATE TABLE IF NOT EXISTS public.batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE,
    institution_name TEXT NOT NULL,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    academic_year TEXT NOT NULL,
    total_students INT DEFAULT 0,
    registered_students INT DEFAULT 0,
    assessed_students INT DEFAULT 0,
    placed_students INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. PAYMENTS & TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'INR',
    purpose TEXT NOT NULL CHECK (purpose IN ('placement_programme', 'course_fee', 'employer_subscription', 'institutional_batch')),
    payment_method TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'initiated' CHECK (status IN ('initiated', 'pending', 'success', 'failed', 'refunded')),
    transaction_id TEXT UNIQUE NOT NULL,
    provider_ref TEXT,
    is_sandbox BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('job_match', 'application_update', 'interview', 'course', 'refund', 'admin', 'system')),
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor_name TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    details TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_jobs_category ON public.jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_work_mode ON public.jobs(work_mode);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON public.jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_applications_job ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_student ON public.applications(student_id);
CREATE INDEX IF NOT EXISTS idx_enrolments_student ON public.course_enrolments(student_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_centres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programme_enrolments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper security functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles: Anyone can view public basic profiles, user can edit their own, admin can do everything
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (id = auth.uid() OR public.is_admin());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (id = auth.uid() OR public.is_admin());

-- Jobs: Publicly viewable if approved & active; companies manage own jobs; admin manages all
CREATE POLICY "Active approved jobs are viewable by all" ON public.jobs FOR SELECT USING ((moderation_status = 'approved' AND is_active = true) OR public.is_admin() OR company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()));
CREATE POLICY "Companies can manage own jobs" ON public.jobs FOR ALL USING (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()) OR public.is_admin());

-- Courses: Approved courses are viewable by all; centres manage own courses
CREATE POLICY "Courses viewable by all" ON public.courses FOR SELECT USING (moderation_status = 'approved' OR public.is_admin() OR centre_id IN (SELECT id FROM public.skill_centres WHERE user_id = auth.uid()));
CREATE POLICY "Centres can manage own courses" ON public.courses FOR ALL USING (centre_id IN (SELECT id FROM public.skill_centres WHERE user_id = auth.uid()) OR public.is_admin());

-- Applications: Students can see their own applications; companies can see applications for their jobs
CREATE POLICY "Students see own applications" ON public.applications FOR SELECT USING (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()) OR public.is_admin());
CREATE POLICY "Companies see their applicants" ON public.applications FOR SELECT USING (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()) OR public.is_admin());
CREATE POLICY "Students can create applications" ON public.applications FOR INSERT WITH CHECK (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Companies can update their applicants" ON public.applications FOR UPDATE USING (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()) OR public.is_admin());

-- Programme Enrolments & Refunds: Students see their own, Admin manages all
CREATE POLICY "Students see own programme enrolment" ON public.programme_enrolments FOR SELECT USING (student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid()) OR public.is_admin());
CREATE POLICY "Admins manage programme enrolments" ON public.programme_enrolments FOR ALL USING (public.is_admin());
