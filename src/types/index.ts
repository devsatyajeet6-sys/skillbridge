// SkillBridge TypeScript Domain Model

export type UserRole = 'student' | 'company' | 'skill_centre' | 'institution' | 'admin';

export type AccountStatus = 'active' | 'pending' | 'suspended';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  status: AccountStatus;
  created_at: string;
  updated_at?: string;
}

export interface StudentProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  education_level: string; // e.g., 'B.Tech', 'B.Sc', 'MCA', 'Diploma', 'Higher Secondary'
  institution_id?: string;
  institution_name: string;
  graduation_year: number;
  location: string;
  preferred_career_path: string; // e.g., 'Data Analyst', 'Software Developer', 'Sales Executive'
  preferred_locations: string[];
  desired_salary_min?: number;
  desired_salary_max?: number;
  employment_type: 'full_time' | 'internship' | 'remote' | 'any';
  share_profile_with_employers: boolean;
  cv_url?: string;
  cv_name?: string;
  cv_text?: string;
  cv_score: number; // 0-100
  job_readiness_score: number; // 0-100
  skills: string[];
  bio?: string;
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  is_minor?: boolean;
  guardian_consent_given?: boolean;
  guardian_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  user_id: string;
  company_name: string;
  business_email: string;
  industry: string;
  company_size: string; // e.g. '1-10', '11-50', '51-200', '201-1000', '1000+'
  website?: string;
  location: string;
  recruiter_name: string;
  recruiter_phone?: string;
  logo_url?: string;
  description: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  subscription_tier: 'pay_per_job' | 'monthly_pro' | 'enterprise';
  job_credits_remaining: number;
  created_at: string;
}

export interface SkillCentre {
  id: string;
  user_id: string;
  centre_name: string;
  contact_email: string;
  phone: string;
  training_categories: string[];
  delivery_modes: ('recorded' | 'live_online' | 'offline')[];
  location: string;
  address?: string;
  website?: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  commission_rate: number; // percentage e.g. 15
  bio: string;
  created_at: string;
}

export interface Institution {
  id: string;
  user_id: string;
  institution_name: string;
  institution_type: 'school' | 'college' | 'university' | 'polytechnic';
  address: string;
  contact_person: string;
  institutional_email: string;
  phone: string;
  student_count_expected: number;
  verification_status: 'pending' | 'verified' | 'rejected';
  billing_terms: string;
  created_at: string;
}

export type JobWorkMode = 'remote' | 'hybrid' | 'on_site';
export type JobExperienceLevel = 'entry' | 'mid' | 'senior';

export interface Job {
  id: string;
  company_id: string;
  company_name: string;
  company_logo?: string;
  title: string;
  department: string;
  category: string; // e.g., 'Data Analyst', 'Software Developer', 'Sales Executive', 'Operations', 'Customer Support', 'Accountant'
  location: string;
  work_mode: JobWorkMode;
  experience_level: JobExperienceLevel;
  salary_min?: number;
  salary_max?: number;
  salary_currency: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  required_skills: string[];
  preferred_skills: string[];
  qualifications: string[];
  application_deadline?: string;
  moderation_status: 'approved' | 'pending_review' | 'archived';
  is_active: boolean;
  views_count: number;
  applicants_count: number;
  created_at: string;
}

export interface CourseLesson {
  id: string;
  title: string;
  duration_minutes: number;
  video_url: string; // safe embedded link e.g., YouTube/Vimeo/secure storage link
  is_preview: boolean;
  order: number;
}

export interface Course {
  id: string;
  centre_id: string;
  centre_name: string;
  title: string;
  description: string;
  category: string;
  skills_taught: string[];
  duration_weeks: number;
  duration_hours: number;
  delivery_mode: 'recorded' | 'live_online' | 'offline';
  language: string;
  price: number; // 0 for free/demo
  syllabus: CourseLesson[];
  prerequisites: string[];
  learning_outcomes: string[];
  video_preview_url?: string;
  offline_location?: string;
  offline_schedule?: string;
  moderation_status: 'approved' | 'pending_review' | 'rejected';
  enrolled_count: number;
  rating: number;
  created_at: string;
}

export interface CourseEnrolment {
  id: string;
  course_id: string;
  course_title: string;
  student_id: string;
  student_name: string;
  enrolment_type: 'paid' | 'enquiry' | 'institutional';
  status: 'enrolled' | 'in_progress' | 'completed' | 'dropped';
  progress_percent: number;
  completed_lessons: string[]; // lesson ids
  certificate_issued: boolean;
  certificate_url?: string;
  enrolled_at: string;
  completed_at?: string;
}

export type ApplicationStatus = 
  | 'applied' 
  | 'screening' 
  | 'shortlisted' 
  | 'interview_scheduled' 
  | 'interview_attended' 
  | 'offer_extended' 
  | 'offer_accepted' 
  | 'hired' 
  | 'rejected';

export interface Application {
  id: string;
  job_id: string;
  job_title: string;
  company_id: string;
  company_name: string;
  student_id: string;
  student_name: string;
  student_email: string;
  student_phone?: string;
  education?: string;
  cv_url?: string;
  match_score: number; // 0-100
  missing_skills: string[];
  possessed_skills: string[];
  status: ApplicationStatus;
  recruiter_notes?: string;
  interview_id?: string;
  applied_at: string;
  updated_at: string;
}

export interface Interview {
  id: string;
  application_id: string;
  job_id: string;
  job_title: string;
  company_id: string;
  company_name: string;
  student_id: string;
  student_name: string;
  student_email: string;
  scheduled_at: string; // ISO datetime
  duration_minutes: number;
  mode: 'online_video' | 'offline_in_person' | 'phone';
  meeting_link_or_address: string;
  status: 'scheduled' | 'attended' | 'completed' | 'cancelled' | 'no_show';
  outcome: 'pending' | 'passed' | 'failed';
  feedback?: string;
  interviewer_name: string;
  created_at: string;
}

export type ProgrammeStage = 
  | 'enrolled'
  | 'interview_scheduled'
  | 'interview_attended'
  | 'selected_by_employer'
  | 'offer_received'
  | 'offer_accepted'
  | 'placement_verified'
  | 'refund_eligible'
  | 'refund_requested'
  | 'refund_approved'
  | 'refund_paid'
  | 'assistance_period_completed';

export type RefundStatus = 
  | 'not_applicable'
  | 'eligible'
  | 'requested'
  | 'approved'
  | 'rejected'
  | 'paid';

export interface ProgrammeEnrolment {
  id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  fee_amount: number; // ₹5,000
  fee_paid: boolean;
  payment_id?: string;
  transaction_ref?: string;
  enrolled_at: string;
  assistance_valid_until: string;
  stage: ProgrammeStage;
  interviews_scheduled_count: number;
  interviews_attended_count: number;
  max_interviews_allowed: number;
  verified_company_name?: string;
  verified_job_title?: string;
  offer_letter_url?: string;
  refund_status: RefundStatus;
  refund_amount: number; // ₹2,000
  refund_requested_at?: string;
  refund_approved_at?: string;
  refund_paid_at?: string;
  refund_transaction_id?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Batch {
  id: string;
  institution_id: string;
  institution_name: string;
  name: string; // e.g. "2025 B.Tech Final Year"
  department: string;
  academic_year: string;
  total_students: number;
  registered_students: number;
  assessed_students: number;
  placed_students: number;
  created_at: string;
}

export interface BatchStudentImportItem {
  full_name: string;
  email: string;
  phone?: string;
  education_level: string;
  department: string;
  graduation_year: number;
  is_minor?: boolean;
}

export interface PaymentRecord {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  amount: number;
  currency: string; // 'INR'
  purpose: 'placement_programme' | 'course_fee' | 'employer_subscription' | 'institutional_batch';
  payment_method: 'card' | 'upi' | 'netbanking' | 'sandbox_demo';
  status: 'initiated' | 'pending' | 'success' | 'failed' | 'refunded';
  transaction_id: string;
  provider_ref?: string;
  is_sandbox: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'job_match' | 'application_update' | 'interview' | 'course' | 'refund' | 'admin' | 'system';
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  actor_name: string;
  actor_role: UserRole;
  action: string;
  target_type: 'user' | 'job' | 'course' | 'refund' | 'application' | 'settings';
  target_id: string;
  details: string;
  ip_address?: string;
  created_at: string;
}

export interface PlatformConfig {
  programme_fee: number; // Default 5000
  refund_amount: number; // Default 2000
  max_interviews: number; // Default 3
  assistance_duration_months: number; // Default 6
  auto_approve_jobs: boolean;
  auto_approve_courses: boolean;
  llm_provider: 'deterministic' | 'openai' | 'gemini';
  llm_api_key?: string;
}

export interface SkillMatchResult {
  job: Job;
  matchScore: number; // 0-100
  possessedSkills: string[];
  missingSkills: string[];
  recommendedCourses: Course[];
  eligibilityMet: boolean;
  explanation: string;
}
