# SkillBridge | AI-Powered Skilling & Placement Platform

> **From Skills to Careers:** An integrated full-stack career-tech ecosystem connecting students, partner companies, skill centres, and educational institutions in one unified platform.

---

## 1. Product Vision & Ecosystem

SkillBridge directly addresses the employability gap between academic education and industry requirements. The platform provides:
- **Skills Assessment & CV Scoring**: Analyzes existing competencies and extracts verified skills.
- **Explainable Job Matching**: Evaluates transparent job-match scores without black-box rejections.
- **Skill-Gap Analysis & Training Marketplace**: Discovers exact missing skills and links candidates to accredited skill centres offering recorded, live online, and offline training.
- **Structured Placement Assistance Programme**: Individual student programme with a ₹5,000 assistance fee and a **conditional ₹2,000 refund** upon verified selection by a partner employer.
- **Multi-Tenant Role Dashboards**: Tailored workspaces for all 5 stakeholders:
  1. **Students and Job Seekers**
  2. **Partner Companies & Recruiters**
  3. **Skill Centres & Training Providers**
  4. **Schools & Colleges (TPOs)**
  5. **Platform Administrator**

---

## 2. Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide React icons, Inter typography
- **Data Visualizations & Charts**: Recharts
- **Database & Backend**: PostgreSQL via Supabase (Full DDL in `supabase/migrations/01_initial_schema.sql` with Row Level Security)
- **Authentication**: Supabase Auth (with seamless local persona switching in Demo Mode)
- **Storage**: Supabase Storage for CV documents and course syllabi
- **Payment Gateway**: Razorpay Sandbox Simulation / Live Gateway integration
- **AI Engine**: Deterministic rule-based matching engine (100% operational offline without paid API keys) with optional pluggable OpenAI/Gemini integration

---

## 3. Key Stakeholder Portals & Features

### 👨‍🎓 1. Student Dashboard (`/student`)
- **Overview & Checklist**: Profile readiness gauge (0-100), matched jobs count, eligibility counts, enrolled courses progress, upcoming interview notifications, and actionable onboarding checklist.
- **CV & Profile Management**: Add/remove skill tags, update academic background, upload/parse PDF CVs, and configure employer data-sharing consent.
- **Matched Vacancies**: Review vacancies ranked by transparent Job Match Score (`(Skills/Required)*70 + Alignment*15 + Readiness*15`), view possessed vs. missing skills, and 1-click apply.
- **Skill-Gap Analysis**: Identifies exact skill deficiencies and recommends accredited courses to bridge each gap.
- **Training Marketplace (`/courses`)**: Enrol in courses, inspect syllabi, stream recorded video modules, and track lesson completion.
- **Placement Programme (`/placement-programme`)**: 10-stage lifecycle visualizer, interview counter, and direct **₹2,000 Refund Claim** submission upon verified hiring.

### 🏢 2. Company Dashboard (`/company`)
- **Overview & Funnel**: Active job openings, applicants count, interview schedule, and recruitment funnel stages (Applied → Screening → Shortlisted → Interview → Offer → Hired).
- **Job Management**: Create job vacancies, specify required/preferred skills, work mode (remote, hybrid, on-site), experience level, and salary ranges.
- **Applicant Tracking System (ATS)**: Filter candidates by job, inspect match scores and missing skills, advance applicant stages, and access verified profiles.
- **Interview Scheduler**: Set interview date/time, choose mode (video call, in-person, phone), attach Google Meet/Zoom links, and record pass/fail outcomes.
- **Employer Packages**: View job credit tiers (Pay-Per-Job, Monthly Pro, Enterprise) and draft invoices.

### 🏫 3. Skill Centre Dashboard (`/skillcentre`)
- **Performance Overview**: Active learners enrolled, average student ratings, and course revenue breakdown.
- **Course Catalogue**: Publish courses across Data Analytics, Software Engineering, Sales, and Finance.
- **Course Builder**: Configure syllabus modules, recorded lesson embed links, and physical campus schedules for offline training.
- **Student Progress Tracker**: Monitor lesson completions and authorize verified completion credentials.

### 🏛️ 4. School & College (Institution) Dashboard (`/institution`)
- **Cohort Batches**: Organize student bodies into academic departments (e.g. "2025 B.Tech CSE Cohort A").
- **Validated Bulk CSV Import**: Download a standard template and bulk-import hundreds of students in seconds with validation safeguards.
- **Cohort Analytics**: Monitor registration rates, skill-readiness distributions, and verified placement numbers.
- **Privacy & Accreditation Reports**: Download authorized audit reports for NAAC/NBA compliance while keeping private candidate phone numbers shielded.

### 🛡️ 5. Platform Administrator Dashboard (`/admin`)
- **Central System Health**: Overview across all registered entities and listings.
- **Verification Queues**: Approve or reject pending employer companies, skill centres, and colleges.
- **Content Moderation**: Moderate job postings and training courses.
- **Refund Authorizations**: Review student refund claims (₹2,000 payout), validate employer offer letters, and authorize direct disbursements.
- **Configurable Platform Parameters**: Adjust programme fees (₹5,000), refund amounts (₹2,000), interview limits, and AI provider settings.
- **Audit Logs**: Tamper-evident, chronological log of all administrative actions.

---

## 4. The 10-Step Placement & Refund Lifecycle

1. **Enrolment**: Student completes profile and enrols in placement assistance (₹5,000 fee).
2. **Skill Audit**: Platform identifies possessed skills and highlights gaps.
3. **Targeted Upskilling**: Student bridges missing skills via accredited skill centres.
4. **Interview Scheduled**: Up to 3 guaranteed interview opportunities with partner employers.
5. **Interview Attended**: Candidate completes technical rounds with recorded feedback.
6. **Selected by Employer**: Candidate clears technical evaluation.
7. **Job Offer Issued & Accepted**: Official written employment offer confirmed.
8. **Placement Verified**: Details validated by SkillBridge and Institution TPO.
9. **Refund Eligible & Claimed**: Student unlocks ₹2,000 refund claim button in dashboard.
10. **Refund Authorized & Disbursed**: Platform Administrator authorizes payment back to candidate's payment method.

---

## 5. Getting Started (Local Development)

### Prerequisites
- Node.js (v18+ or v20+)
- npm

### Installation
```bash
# Clone the repository
git clone <repo-url> skillbridge
cd skillbridge

# Install dependencies (use npm.cmd on Windows if script execution is restricted)
npm install

# Copy environment variables
cp .env.example .env

# Run development server
npm run dev
```

Visit `http://localhost:5173` (or the port indicated in terminal).

---

## 6. Supabase & Database Setup (Production Mode)

SkillBridge includes complete SQL migrations and seed scripts in `supabase/`:
- `supabase/migrations/01_initial_schema.sql`: 28+ relational tables, indexes, triggers, and Row Level Security (RLS) policies.
- `supabase/seed.sql`: Realistic seed datasets.

### Linking to Supabase:
1. Create a new Supabase project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in Supabase Studio.
3. Run the contents of `supabase/migrations/01_initial_schema.sql`.
4. Run the contents of `supabase/seed.sql`.
5. In your `.env` file, supply:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
6. The application will automatically detect your Supabase credentials!

---

## 7. Demo Persona Quick-Switching

SkillBridge features a built-in **Demo Persona Switcher** in the navigation bar. You can instantly switch between:
- 👨‍🎓 **Student**: Rahul Sharma (`rahul.sharma@example.com`)
- 🏢 **Company HR**: Priya Iyer, TechCorp Solutions (`recruiter@techcorp.in`)
- 🏫 **Skill Centre**: Dr. Anand Verma, Apex Tech Academy (`director@apexacademy.in`)
- 🏛️ **College TPO**: Prof. K. Rao, National Institute of Technology (`tpo@nationaltech.edu.in`)
- 🛡️ **Administrator**: Platform Super Admin (`admin@skillbridge.in`)

To reset all demonstration data back to fresh seed state at any time, click the **Reset Demo Ecosystem** button in the header or Admin portal.

---

## 8. Deployment to Vercel

```bash
# Build production bundle
npm run build

# Preview build locally
npm run preview
```

Deploy directly via Vercel CLI:
```bash
vercel --prod
```
Or connect your GitHub repository to Vercel and configure the environment variables specified in `.env.example`.

---

## 9. Security & Compliance Safeguards

- **Multi-Tenant Data Isolation**: Row-Level Security policies ensure colleges and employers cannot access unauthorized candidate information.
- **Student Data Minimization**: CV files and phone numbers are only shared when a student explicitly consents or applies to a vacancy.
- **Guardian Consent for Minors**: Students under 18 must verify parent/guardian consent.
- **Admin Audit Trail**: Every sensitive financial and moderation decision is timestamped and logged.
