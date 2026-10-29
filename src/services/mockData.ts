import { 
  User, 
  StudentProfile, 
  Company, 
  SkillCentre, 
  Institution, 
  Job, 
  Course, 
  CourseEnrolment, 
  Application, 
  Interview, 
  ProgrammeEnrolment, 
  Batch, 
  PaymentRecord, 
  Notification, 
  AuditLog, 
  PlatformConfig 
} from '../types';

export const INITIAL_PLATFORM_CONFIG: PlatformConfig = {
  programme_fee: 5000,
  refund_amount: 2000,
  max_interviews: 3,
  assistance_duration_months: 6,
  auto_approve_jobs: true,
  auto_approve_courses: true,
  llm_provider: 'deterministic'
};

export const INITIAL_USERS: User[] = [
  {
    id: 'user-student-1',
    email: 'rahul.sharma@example.com',
    role: 'student',
    full_name: 'Rahul Sharma',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    phone: '+91 98765 43210',
    status: 'active',
    created_at: '2026-09-01T10:00:00Z'
  },
  {
    id: 'user-student-2',
    email: 'priya.patel@example.com',
    role: 'student',
    full_name: 'Priya Patel',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    phone: '+91 98765 43211',
    status: 'active',
    created_at: '2026-09-05T10:00:00Z'
  },
  {
    id: 'user-company-1',
    email: 'recruiter@techcorp.in',
    role: 'company',
    full_name: 'Priya Iyer (TechCorp HR)',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    phone: '+91 98220 11223',
    status: 'active',
    created_at: '2026-08-15T09:00:00Z'
  },
  {
    id: 'user-company-pending',
    email: 'hr@cloudscale.io',
    role: 'company',
    full_name: 'Vikram Joshi (CloudScale)',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    phone: '+91 98440 55667',
    status: 'pending',
    created_at: '2026-10-27T14:30:00Z'
  },
  {
    id: 'user-skillcentre-1',
    email: 'director@apexacademy.in',
    role: 'skill_centre',
    full_name: 'Dr. Anand Verma',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    phone: '+91 98111 22334',
    status: 'active',
    created_at: '2026-08-10T11:00:00Z'
  },
  {
    id: 'user-institution-1',
    email: 'tpo@nationaltech.edu.in',
    role: 'institution',
    full_name: 'Prof. K. Venkatesh Rao',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    phone: '+91 98333 44556',
    status: 'active',
    created_at: '2026-08-01T08:00:00Z'
  },
  {
    id: 'user-admin-1',
    email: 'admin@skillbridge.in',
    role: 'admin',
    full_name: 'SkillBridge Platform Admin',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    phone: '+91 80000 99999',
    status: 'active',
    created_at: '2026-07-01T00:00:00Z'
  }
];

export const INITIAL_STUDENTS: StudentProfile[] = [
  {
    id: 'student-profile-1',
    user_id: 'user-student-1',
    full_name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    education_level: 'B.Tech Computer Science',
    institution_id: 'inst-1',
    institution_name: 'National Institute of Technology',
    graduation_year: 2025,
    location: 'Bengaluru, Karnataka',
    preferred_career_path: 'Data Analyst',
    preferred_locations: ['Bengaluru', 'Hyderabad', 'Remote'],
    desired_salary_min: 450000,
    desired_salary_max: 700000,
    employment_type: 'full_time',
    share_profile_with_employers: true,
    cv_url: '/demo-resumes/rahul-sharma-cv.pdf',
    cv_name: 'Rahul_Sharma_DataAnalyst_CV.pdf',
    cv_text: 'Summary: Passionate aspiring data analyst with strong foundations in SQL, Excel data modeling, and basic Python data manipulation. Projects include E-commerce Sales Dashboard and Customer Churn Exploratory Analysis.',
    cv_score: 82,
    job_readiness_score: 78,
    skills: ['SQL', 'Excel', 'Python', 'Communication'],
    bio: 'Aspiring Junior Data Analyst with hands-on coursework in database queries, dashboard modeling, and statistics. Looking for high-impact entry-level data roles.',
    github_url: 'https://github.com/example/rahul-sharma',
    linkedin_url: 'https://linkedin.com/in/example-rahul-sharma',
    portfolio_url: 'https://rahul-portfolio.example.com',
    is_minor: false,
    guardian_consent_given: true,
    created_at: '2026-09-01T10:00:00Z',
    updated_at: '2026-10-25T11:20:00Z'
  },
  {
    id: 'student-profile-2',
    user_id: 'user-student-2',
    full_name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+91 98765 43211',
    education_level: 'B.Sc Information Technology',
    institution_id: 'inst-1',
    institution_name: 'National Institute of Technology',
    graduation_year: 2025,
    location: 'Pune, Maharashtra',
    preferred_career_path: 'Software Developer',
    preferred_locations: ['Pune', 'Mumbai', 'Remote'],
    desired_salary_min: 500000,
    desired_salary_max: 800000,
    employment_type: 'full_time',
    share_profile_with_employers: true,
    cv_url: '/demo-resumes/priya-patel-cv.pdf',
    cv_name: 'Priya_Patel_Frontend_CV.pdf',
    cv_text: 'Frontend developer skilled in HTML, CSS, JavaScript, React basics, and Git version control.',
    cv_score: 88,
    job_readiness_score: 85,
    skills: ['JavaScript', 'React', 'HTML', 'CSS', 'Git'],
    bio: 'Passionate frontend engineer excited by responsive UI architectures, modern JavaScript toolchains, and high usability.',
    is_minor: false,
    created_at: '2026-09-05T10:00:00Z',
    updated_at: '2026-10-20T15:00:00Z'
  }
];

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'company-1',
    user_id: 'user-company-1',
    company_name: 'TechCorp Solutions',
    business_email: 'recruiter@techcorp.in',
    industry: 'Enterprise Software & Analytics',
    company_size: '51-200',
    website: 'https://techcorp-example.in',
    location: 'Bengaluru, India',
    recruiter_name: 'Priya Iyer',
    recruiter_phone: '+91 98220 11223',
    logo_url: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100',
    description: 'Leading provider of cloud infrastructure and analytical intelligence platforms across Southeast Asia.',
    verification_status: 'verified',
    subscription_tier: 'monthly_pro',
    job_credits_remaining: 12,
    created_at: '2026-08-15T09:00:00Z'
  },
  {
    id: 'company-2',
    user_id: 'user-company-pending',
    company_name: 'CloudScale Technologies',
    business_email: 'hr@cloudscale.io',
    industry: 'Cloud Infrastructure & DevOps',
    company_size: '11-50',
    website: 'https://cloudscale-example.io',
    location: 'Hyderabad, India',
    recruiter_name: 'Vikram Joshi',
    recruiter_phone: '+91 98440 55667',
    description: 'Next-gen distributed cloud orchestration toolsets.',
    verification_status: 'pending',
    subscription_tier: 'pay_per_job',
    job_credits_remaining: 2,
    created_at: '2026-10-27T14:30:00Z'
  }
];

export const INITIAL_SKILL_CENTRES: SkillCentre[] = [
  {
    id: 'centre-1',
    user_id: 'user-skillcentre-1',
    centre_name: 'Apex Tech Academy',
    contact_email: 'director@apexacademy.in',
    phone: '+91 98111 22334',
    training_categories: ['Data Analytics', 'Business Intelligence', 'Software Engineering', 'Corporate Sales'],
    delivery_modes: ['recorded', 'live_online', 'offline'],
    location: 'Bengaluru, Koramangala',
    address: '4th Block, 80ft Road, Koramangala, Bengaluru, 560034',
    website: 'https://apextechacademy-example.in',
    verification_status: 'verified',
    commission_rate: 15,
    bio: 'Government accredited industry training institute with 94% course completion rate and practical capstone projects.',
    created_at: '2026-08-10T11:00:00Z'
  }
];

export const INITIAL_INSTITUTIONS: Institution[] = [
  {
    id: 'inst-1',
    user_id: 'user-institution-1',
    institution_name: 'National Institute of Technology',
    institution_type: 'college',
    address: 'Campus Complex, Academic District, South Campus',
    contact_person: 'Prof. K. Venkatesh Rao (Head TPO)',
    institutional_email: 'tpo@nationaltech.edu.in',
    phone: '+91 98333 44556',
    student_count_expected: 350,
    verification_status: 'verified',
    billing_terms: 'Institutional Annual Cohort Partner (Net 30)',
    created_at: '2026-08-01T08:00:00Z'
  }
];

export const INITIAL_JOBS: Job[] = [
  {
    id: 'job-1',
    company_id: 'company-1',
    company_name: 'TechCorp Solutions',
    company_logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100',
    title: 'Junior Data Analyst',
    department: 'Business Intelligence',
    category: 'Data Analyst',
    location: 'Bengaluru, Karnataka',
    work_mode: 'hybrid',
    experience_level: 'entry',
    salary_min: 450000,
    salary_max: 650000,
    salary_currency: 'INR',
    description: 'We are seeking an inquisitive Junior Data Analyst to help build management reporting suites, query transactional data, and build interactive Power BI dashboards.',
    responsibilities: [
      'Write robust SQL queries to aggregate multi-table transactional datasets.',
      'Construct automated dashboards in Power BI and Excel.',
      'Collaborate with product and operations managers to interpret key KPI variances.',
      'Present weekly data insights in executive reviews.'
    ],
    requirements: [
      'Bachelor’s degree in Computer Science, Statistics, Mathematics or related discipline.',
      'Proficiency in SQL (joins, subqueries, group by, window functions).',
      'Solid command of Microsoft Excel (Pivot tables, VLOOKUP, Power Query).',
      'Familiarity with Power BI and Data Visualisation concepts.'
    ],
    required_skills: ['Excel', 'SQL', 'Power BI', 'Data Visualisation'],
    preferred_skills: ['Python', 'DAX', 'Statistics'],
    qualifications: ['B.Tech / B.E / B.Sc in IT or Computer Science', '2024 or 2025 Graduate'],
    application_deadline: '2026-12-15',
    moderation_status: 'approved',
    is_active: true,
    views_count: 342,
    applicants_count: 14,
    created_at: '2026-10-10T10:00:00Z'
  },
  {
    id: 'job-2',
    company_id: 'company-1',
    company_name: 'TechCorp Solutions',
    company_logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100',
    title: 'Junior Frontend Developer (React)',
    department: 'Engineering',
    category: 'Software Developer',
    location: 'Remote (India)',
    work_mode: 'remote',
    experience_level: 'entry',
    salary_min: 500000,
    salary_max: 750000,
    salary_currency: 'INR',
    description: 'Join our customer dashboard UI team crafting lightning-fast, accessible SaaS web apps in React and TypeScript.',
    responsibilities: [
      'Develop modern reusable UI components using React and Tailwind CSS.',
      'Integrate REST APIs and ensure state management consistency.',
      'Participate in code reviews and unit test implementations.'
    ],
    requirements: [
      'Strong grasp of JavaScript ES6+ and React component lifecycles.',
      'Experience with TypeScript, HTML5 semantic elements, and modern CSS frameworks.',
      'Familiarity with Git branching and GitHub workflows.'
    ],
    required_skills: ['JavaScript', 'React', 'TypeScript', 'Git'],
    preferred_skills: ['Tailwind CSS', 'Next.js', 'REST APIs'],
    qualifications: ['Degree in Computer Science, MCA or equivalent practical experience'],
    application_deadline: '2026-11-30',
    moderation_status: 'approved',
    is_active: true,
    views_count: 512,
    applicants_count: 26,
    created_at: '2026-10-12T11:00:00Z'
  },
  {
    id: 'job-3',
    company_id: 'company-1',
    company_name: 'TechCorp Solutions',
    company_logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100',
    title: 'Business Development Executive (B2B)',
    department: 'Growth & Partnerships',
    category: 'Sales Executive',
    location: 'Mumbai, Maharashtra',
    work_mode: 'on_site',
    experience_level: 'entry',
    salary_min: 350000,
    salary_max: 500000,
    salary_currency: 'INR',
    description: 'Drive strategic corporate partnerships and outbound engagement with SME software buyers.',
    responsibilities: [
      'Identify enterprise prospects and map key decision makers.',
      'Conduct exploratory discovery calls and qualify sales opportunities.',
      'Coordinate demonstration sessions with client solutions teams.'
    ],
    requirements: [
      'Outstanding verbal and written communication in English.',
      'High grit, persuasive negotiation skills, and commercial acumen.',
      'Experience in consultative selling or collegiate event sponsorship.'
    ],
    required_skills: ['B2B Sales', 'Communication', 'Project Management'],
    preferred_skills: ['CRM Tools', 'Cold Outreach'],
    qualifications: ['Any Graduate / BBA / MBA preferred'],
    application_deadline: '2026-12-01',
    moderation_status: 'approved',
    is_active: true,
    views_count: 198,
    applicants_count: 8,
    created_at: '2026-10-18T14:00:00Z'
  },
  {
    id: 'job-4',
    company_id: 'company-1',
    company_name: 'TechCorp Solutions',
    company_logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100',
    title: 'Junior Financial Analyst',
    department: 'Corporate Finance',
    category: 'Accountant',
    location: 'Hyderabad, Telangana',
    work_mode: 'hybrid',
    experience_level: 'entry',
    salary_min: 400000,
    salary_max: 600000,
    salary_currency: 'INR',
    description: 'Assist in monthly balance sheet consolidations, variance modeling, and financial statements preparation.',
    responsibilities: [
      'Construct financial models and DCF projections.',
      'Reconcile ledgers and prepare monthly management accounts.',
      'Audit vendor billing schedules.'
    ],
    requirements: [
      'Solid command of advanced Excel and financial modeling methodologies.',
      'Familiarity with Tally ERP or equivalent corporate accounting suites.'
    ],
    required_skills: ['Excel', 'Financial Modeling', 'Tally ERP'],
    preferred_skills: ['Accounting Standards', 'GST Filing'],
    qualifications: ['B.Com / BBA Finance / M.Com'],
    application_deadline: '2026-11-25',
    moderation_status: 'approved',
    is_active: true,
    views_count: 220,
    applicants_count: 11,
    created_at: '2026-10-20T09:30:00Z'
  },
  {
    id: 'job-5',
    company_id: 'company-1',
    company_name: 'TechCorp Solutions',
    company_logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100',
    title: 'Customer Operations Specialist',
    department: 'Customer Success',
    category: 'Customer Support',
    location: 'Pune, Maharashtra',
    work_mode: 'remote',
    experience_level: 'entry',
    salary_min: 300000,
    salary_max: 420000,
    salary_currency: 'INR',
    description: 'Provide omnichannel customer resolution for enterprise client tickets, chat, and email support.',
    responsibilities: [
      'Resolve customer queries within agreed SLA thresholds.',
      'Troubleshoot account integration problems and escalate bugs.',
      'Document FAQ resolutions in customer knowledge base.'
    ],
    requirements: [
      'Empathetic listening and quick technical comprehension.',
      'Proficiency with Excel and issue tracking systems.'
    ],
    required_skills: ['Customer Support', 'Communication', 'Excel'],
    preferred_skills: ['Zendesk', 'Ticketing Systems'],
    qualifications: ['Any Bachelor degree'],
    application_deadline: '2026-12-30',
    moderation_status: 'approved',
    is_active: true,
    views_count: 140,
    applicants_count: 9,
    created_at: '2026-10-22T16:00:00Z'
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-1',
    centre_id: 'centre-1',
    centre_name: 'Apex Tech Academy',
    title: 'Power BI & Data Visualisation Masterclass',
    description: 'Transform raw data into compelling executive dashboards. Master Power BI desktop, DAX formulas, data relationships, and visual storytelling.',
    category: 'Data Analytics',
    skills_taught: ['Power BI', 'Data Visualisation', 'DAX', 'Excel'],
    duration_weeks: 6,
    duration_hours: 36,
    delivery_mode: 'recorded',
    language: 'English',
    price: 2499,
    syllabus: [
      { id: 'c1-l1', title: 'Module 1: Introduction to Power BI & Data Cleaning with Power Query', duration_minutes: 45, video_url: 'https://www.youtube.com/embed/AGrl-H87pRU', is_preview: true, order: 1 },
      { id: 'c1-l2', title: 'Module 2: Star Schemas, Relationships & Data Modeling', duration_minutes: 50, video_url: 'https://www.youtube.com/embed/AGrl-H87pRU', is_preview: false, order: 2 },
      { id: 'c1-l3', title: 'Module 3: Essential DAX Calculations & Time Intelligence', duration_minutes: 60, video_url: 'https://www.youtube.com/embed/AGrl-H87pRU', is_preview: false, order: 3 },
      { id: 'c1-l4', title: 'Module 4: Designing Interactive Dashboards & Executive Storytelling', duration_minutes: 55, video_url: 'https://www.youtube.com/embed/AGrl-H87pRU', is_preview: false, order: 4 },
      { id: 'c1-l5', title: 'Capstone Project: End-to-End Retail KPI Dashboard Build', duration_minutes: 75, video_url: 'https://www.youtube.com/embed/AGrl-H87pRU', is_preview: false, order: 5 }
    ],
    prerequisites: ['Basic familiarity with spreadsheets and tabular data'],
    learning_outcomes: [
      'Build publication-ready business dashboards in Power BI',
      'Write intermediate DAX measures (CALCULATE, RELATED, DATESYTD)',
      'Connect multiple transactional datasets into a coherent dimensional model',
      'Create interactive tooltips, drill-throughs, and bookmarks'
    ],
    video_preview_url: 'https://www.youtube.com/embed/AGrl-H87pRU',
    moderation_status: 'approved',
    enrolled_count: 184,
    rating: 4.9,
    created_at: '2026-08-15T12:00:00Z'
  },
  {
    id: 'course-2',
    centre_id: 'centre-1',
    centre_name: 'Apex Tech Academy',
    title: 'Modern React & TypeScript Bootcamp',
    description: 'Step into professional frontend development with industry standards: React 18, TypeScript strict mode, Tailwind CSS, and Git version control.',
    category: 'Software Engineering',
    skills_taught: ['React', 'TypeScript', 'JavaScript', 'Git'],
    duration_weeks: 8,
    duration_hours: 48,
    delivery_mode: 'live_online',
    language: 'English',
    price: 3999,
    syllabus: [
      { id: 'c2-l1', title: 'TypeScript Foundations: Types, Interfaces & Generics', duration_minutes: 50, video_url: 'https://www.youtube.com/embed/d56mG7DezGs', is_preview: true, order: 1 },
      { id: 'c2-l2', title: 'React State Management with Hooks & Context', duration_minutes: 60, video_url: 'https://www.youtube.com/embed/d56mG7DezGs', is_preview: false, order: 2 },
      { id: 'c2-l3', title: 'Building Scalable Component Architectures & Tailwind', duration_minutes: 55, video_url: 'https://www.youtube.com/embed/d56mG7DezGs', is_preview: false, order: 3 },
      { id: 'c2-l4', title: 'API Integration, Async Data & Error Boundaries', duration_minutes: 65, video_url: 'https://www.youtube.com/embed/d56mG7DezGs', is_preview: false, order: 4 }
    ],
    prerequisites: ['Basic JavaScript, HTML and CSS fundamentals'],
    learning_outcomes: [
      'Write type-safe React enterprise applications',
      'Manage complex application state using modern patterns',
      'Publish deployed applications with Git and CI/CD pipelines'
    ],
    video_preview_url: 'https://www.youtube.com/embed/d56mG7DezGs',
    moderation_status: 'approved',
    enrolled_count: 142,
    rating: 4.8,
    created_at: '2026-08-20T10:00:00Z'
  },
  {
    id: 'course-3',
    centre_id: 'centre-1',
    centre_name: 'Apex Tech Academy',
    title: 'Corporate B2B Sales & Consultative Pitching',
    description: 'Learn high-converting consultative sales workflows, outbound qualification frameworks (BANT/MEDDIC), and negotiation techniques.',
    category: 'Sales',
    skills_taught: ['B2B Sales', 'Communication', 'Project Management'],
    duration_weeks: 4,
    duration_hours: 24,
    delivery_mode: 'offline',
    language: 'English',
    price: 1999,
    syllabus: [
      { id: 'c3-l1', title: 'Principles of Consultative B2B Selling', duration_minutes: 40, video_url: 'https://www.youtube.com/embed/AGrl-H87pRU', is_preview: true, order: 1 },
      { id: 'c3-l2', title: 'Cold Outreach & Decision Maker Mapping', duration_minutes: 45, video_url: 'https://www.youtube.com/embed/AGrl-H87pRU', is_preview: false, order: 2 },
      { id: 'c3-l3', title: 'Live Pitching, Objection Handling & Contract Closing', duration_minutes: 60, video_url: 'https://www.youtube.com/embed/AGrl-H87pRU', is_preview: false, order: 3 }
    ],
    prerequisites: ['Strong verbal communication in English'],
    learning_outcomes: [
      'Conduct confident corporate discovery and qualification calls',
      'Overcome customer objections with value propositions',
      'Structure high-yield outbound email and LinkedIn sequences'
    ],
    offline_location: 'Apex Training Lab, Koramangala 4th Block, Bengaluru',
    offline_schedule: 'Saturdays & Sundays, 10:00 AM - 1:00 PM',
    moderation_status: 'approved',
    enrolled_count: 89,
    rating: 4.7,
    created_at: '2026-09-01T14:00:00Z'
  },
  {
    id: 'course-4',
    centre_id: 'centre-1',
    centre_name: 'Apex Tech Academy',
    title: 'Financial Modeling & Valuation Fundamentals',
    description: 'Construct 3-statement financial models, forecast cash flows, and master corporate accounting in Tally and Excel.',
    category: 'Finance',
    skills_taught: ['Financial Modeling', 'Excel', 'Tally ERP'],
    duration_weeks: 6,
    duration_hours: 30,
    delivery_mode: 'recorded',
    language: 'English',
    price: 2999,
    syllabus: [
      { id: 'c4-l1', title: '3-Statement Model Architecture in Excel', duration_minutes: 50, video_url: 'https://www.youtube.com/embed/AGrl-H87pRU', is_preview: true, order: 1 },
      { id: 'c4-l2', title: 'Discounted Cash Flow (DCF) & Sensitivity Tables', duration_minutes: 60, video_url: 'https://www.youtube.com/embed/AGrl-H87pRU', is_preview: false, order: 2 },
      { id: 'c4-l3', title: 'Corporate Bookkeeping in Tally ERP', duration_minutes: 45, video_url: 'https://www.youtube.com/embed/AGrl-H87pRU', is_preview: false, order: 3 }
    ],
    prerequisites: ['Basic accounting equations and spreadsheet skills'],
    learning_outcomes: [
      'Link Income Statement, Balance Sheet, and Cash Flow statement',
      'Perform DCF and comparable company valuation',
      'Manage corporate ledger entries in Tally ERP'
    ],
    moderation_status: 'approved',
    enrolled_count: 67,
    rating: 4.8,
    created_at: '2026-09-10T16:00:00Z'
  }
];

export const INITIAL_ENROLMENTS: CourseEnrolment[] = [
  {
    id: 'enrol-1',
    course_id: 'course-1',
    course_title: 'Power BI & Data Visualisation Masterclass',
    student_id: 'student-profile-1',
    student_name: 'Rahul Sharma',
    enrolment_type: 'paid',
    status: 'in_progress',
    progress_percent: 60,
    completed_lessons: ['c1-l1', 'c1-l2', 'c1-l3'],
    certificate_issued: false,
    enrolled_at: '2026-10-15T10:00:00Z'
  }
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-1',
    job_id: 'job-1',
    job_title: 'Junior Data Analyst',
    company_id: 'company-1',
    company_name: 'TechCorp Solutions',
    student_id: 'student-profile-1',
    student_name: 'Rahul Sharma',
    student_email: 'rahul.sharma@example.com',
    student_phone: '+91 98765 43210',
    education: 'B.Tech Computer Science (2025)',
    cv_url: '/demo-resumes/rahul-sharma-cv.pdf',
    match_score: 75,
    missing_skills: ['Power BI', 'Data Visualisation'],
    possessed_skills: ['Excel', 'SQL'],
    status: 'interview_scheduled',
    recruiter_notes: 'Strong fundamentals in SQL and relational joins. Candidate is currently enrolled in Power BI certification to bridge visual analytics gap.',
    applied_at: '2026-10-14T11:00:00Z',
    updated_at: '2026-10-24T15:30:00Z'
  },
  {
    id: 'app-2',
    job_id: 'job-2',
    job_title: 'Junior Frontend Developer (React)',
    company_id: 'company-1',
    company_name: 'TechCorp Solutions',
    student_id: 'student-profile-2',
    student_name: 'Priya Patel',
    student_email: 'priya.patel@example.com',
    student_phone: '+91 98765 43211',
    education: 'B.Sc Information Technology (2025)',
    cv_url: '/demo-resumes/priya-patel-cv.pdf',
    match_score: 90,
    missing_skills: ['TypeScript'],
    possessed_skills: ['JavaScript', 'React', 'Git'],
    status: 'screening',
    applied_at: '2026-10-20T16:00:00Z',
    updated_at: '2026-10-21T09:00:00Z'
  }
];

export const INITIAL_INTERVIEWS: Interview[] = [
  {
    id: 'interview-1',
    application_id: 'app-1',
    job_id: 'job-1',
    job_title: 'Junior Data Analyst',
    company_id: 'company-1',
    company_name: 'TechCorp Solutions',
    student_id: 'student-profile-1',
    student_name: 'Rahul Sharma',
    student_email: 'rahul.sharma@example.com',
    scheduled_at: '2026-10-31T11:30:00Z',
    duration_minutes: 45,
    mode: 'online_video',
    meeting_link_or_address: 'https://meet.google.com/xyz-demo-interview',
    status: 'scheduled',
    outcome: 'pending',
    interviewer_name: 'Priya Iyer & Technical Lead',
    feedback: 'Scheduled for Technical Assessment + SQL Live Coding round.',
    created_at: '2026-10-24T15:30:00Z'
  }
];

export const INITIAL_PROGRAMME_ENROLMENTS: ProgrammeEnrolment[] = [
  {
    id: 'prog-enrol-1',
    student_id: 'student-profile-1',
    student_name: 'Rahul Sharma',
    student_email: 'rahul.sharma@example.com',
    fee_amount: 5000,
    fee_paid: true,
    payment_id: 'pay-demo-1001',
    transaction_ref: 'SB-TXN-984712',
    enrolled_at: '2026-09-10T10:00:00Z',
    assistance_valid_until: '2027-03-10T10:00:00Z',
    stage: 'interview_scheduled',
    interviews_scheduled_count: 1,
    interviews_attended_count: 0,
    max_interviews_allowed: 3,
    refund_status: 'not_applicable',
    refund_amount: 2000,
    created_at: '2026-09-10T10:00:00Z',
    updated_at: '2026-10-24T15:30:00Z'
  },
  {
    id: 'prog-enrol-2',
    student_id: 'student-profile-2',
    student_name: 'Priya Patel',
    student_email: 'priya.patel@example.com',
    fee_amount: 5000,
    fee_paid: true,
    payment_id: 'pay-demo-1002',
    transaction_ref: 'SB-TXN-984713',
    enrolled_at: '2026-09-12T10:00:00Z',
    assistance_valid_until: '2027-03-12T10:00:00Z',
    stage: 'refund_requested',
    interviews_scheduled_count: 2,
    interviews_attended_count: 2,
    max_interviews_allowed: 3,
    verified_company_name: 'Infosys Cloud Labs',
    verified_job_title: 'Junior React Specialist',
    offer_letter_url: '/demo-resumes/offer-priya-patel.pdf',
    refund_status: 'requested',
    refund_amount: 2000,
    refund_requested_at: '2026-10-26T14:00:00Z',
    admin_notes: 'Offer letter submitted and verified by TPO. Awaiting admin refund release authorization.',
    created_at: '2026-09-12T10:00:00Z',
    updated_at: '2026-10-26T14:00:00Z'
  }
];

export const INITIAL_BATCHES: Batch[] = [
  {
    id: 'batch-1',
    institution_id: 'inst-1',
    institution_name: 'National Institute of Technology',
    name: '2025 B.Tech Computer Science Cohort A',
    department: 'Computer Science & Engineering',
    academic_year: '2024-2025',
    total_students: 120,
    registered_students: 104,
    assessed_students: 92,
    placed_students: 48,
    created_at: '2026-08-15T10:00:00Z'
  },
  {
    id: 'batch-2',
    institution_id: 'inst-1',
    institution_name: 'National Institute of Technology',
    name: '2025 B.Sc Information Technology',
    department: 'Information Technology',
    academic_year: '2024-2025',
    total_students: 80,
    registered_students: 76,
    assessed_students: 68,
    placed_students: 34,
    created_at: '2026-08-20T10:00:00Z'
  }
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay-demo-1001',
    user_id: 'user-student-1',
    user_name: 'Rahul Sharma',
    user_email: 'rahul.sharma@example.com',
    amount: 5000,
    currency: 'INR',
    purpose: 'placement_programme',
    payment_method: 'upi',
    status: 'success',
    transaction_id: 'SB-TXN-984712',
    provider_ref: 'pay_rzp_mock_98712a',
    is_sandbox: true,
    created_at: '2026-09-10T10:00:00Z'
  },
  {
    id: 'pay-demo-1002',
    user_id: 'user-student-2',
    user_name: 'Priya Patel',
    user_email: 'priya.patel@example.com',
    amount: 5000,
    currency: 'INR',
    purpose: 'placement_programme',
    payment_method: 'card',
    status: 'success',
    transaction_id: 'SB-TXN-984713',
    provider_ref: 'pay_rzp_mock_98713b',
    is_sandbox: true,
    created_at: '2026-09-12T10:00:00Z'
  },
  {
    id: 'pay-demo-1003',
    user_id: 'user-student-1',
    user_name: 'Rahul Sharma',
    user_email: 'rahul.sharma@example.com',
    amount: 2499,
    currency: 'INR',
    purpose: 'course_fee',
    payment_method: 'netbanking',
    status: 'success',
    transaction_id: 'SB-TXN-984714',
    provider_ref: 'pay_rzp_mock_98714c',
    is_sandbox: true,
    created_at: '2026-10-15T10:00:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    user_id: 'user-student-1',
    title: 'Interview Scheduled!',
    message: 'TechCorp Solutions scheduled your Junior Data Analyst interview for Oct 31, 11:30 AM.',
    type: 'interview',
    link: '/student/interviews',
    is_read: false,
    created_at: '2026-10-24T15:30:00Z'
  },
  {
    id: 'notif-2',
    user_id: 'user-student-1',
    title: 'Recommended Skill Training',
    message: 'You have a 75% match with Junior Data Analyst. Enrolling in Power BI will boost your match to 95%!',
    type: 'job_match',
    link: '/student/skills',
    is_read: false,
    created_at: '2026-10-14T11:05:00Z'
  },
  {
    id: 'notif-3',
    user_id: 'user-company-1',
    title: 'New Applicant for Junior Data Analyst',
    message: 'Rahul Sharma applied for Junior Data Analyst with a 75% match score.',
    type: 'application_update',
    link: '/company/applicants',
    is_read: false,
    created_at: '2026-10-14T11:00:00Z'
  },
  {
    id: 'notif-4',
    user_id: 'user-admin-1',
    title: 'New Refund Claim Pending Review',
    message: 'Priya Patel submitted a ₹2,000 refund claim with verified placement at Infosys Cloud Labs.',
    type: 'refund',
    link: '/admin/refunds',
    is_read: false,
    created_at: '2026-10-26T14:05:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit-1',
    actor_id: 'user-admin-1',
    actor_name: 'Platform Admin',
    actor_role: 'admin',
    action: 'APPROVE_COMPANY',
    target_type: 'user',
    target_id: 'company-1',
    details: 'Verified employer credentials and business registration of TechCorp Solutions.',
    ip_address: '103.21.244.2',
    created_at: '2026-08-15T09:30:00Z'
  },
  {
    id: 'audit-2',
    actor_id: 'user-admin-1',
    actor_name: 'Platform Admin',
    actor_role: 'admin',
    action: 'APPROVE_COURSE',
    target_type: 'course',
    target_id: 'course-1',
    details: 'Approved Power BI & Data Visualisation course by Apex Tech Academy after syllabus review.',
    ip_address: '103.21.244.2',
    created_at: '2026-08-16T14:00:00Z'
  }
];
