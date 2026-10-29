import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Target, 
  Briefcase, 
  BookOpen, 
  Building2, 
  GraduationCap, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Award,
  ChevronDown,
  HelpCircle,
  Clock,
  IndianRupee
} from 'lucide-react';
import { dataService } from '../services/dataService';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const jobs = dataService.getAllJobs();
  const courses = dataService.getAllCourses();
  const companies = dataService.getAllCompanies();
  const students = dataService.getAllStudents();

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const stats = [
    { label: 'Active Vacancies', value: `${jobs.length * 15}+`, icon: Briefcase },
    { label: 'Enrolled Candidates', value: `${students.length * 250}+`, icon: Users },
    { label: 'Hiring Partners', value: `${companies.length * 12}+`, icon: Building2 },
    { label: 'Placement Rate', value: '88.4%', icon: TrendingUp },
  ];

  const careerCategories = [
    { title: 'Data Analyst', count: 18, icon: '📊', desc: 'SQL, Excel, Power BI, Python, Business Dashboards' },
    { title: 'Software Developer', count: 24, icon: '💻', desc: 'React, TypeScript, Node.js, Git, Cloud Architecture' },
    { title: 'Sales Executive', count: 14, icon: '🤝', desc: 'B2B Sales, Lead Generation, Corporate Outreach' },
    { title: 'Corporate Finance & Accounts', count: 11, icon: '📈', desc: 'Financial Modeling, Tally ERP, Variance Analysis' },
    { title: 'Customer Operations', count: 9, icon: '🎧', desc: 'Customer Support, SLA Resolution, Communications' },
    { title: 'Operations & Management', count: 12, icon: '⚙️', desc: 'Supply Chain, Agile Sprints, Vendor Coordination' },
  ];

  const faqs = [
    {
      q: 'How does the Individual Placement Assistance Programme work?',
      a: 'Students enroll in our structured programme with a one-time fee of ₹5,000. Our platform analyzes your existing skills against partner company requirements, identifies missing skills, connects you with curated training from accredited skill centres, and coordinates up to 3 guaranteed interview opportunities with verified employers.'
    },
    {
      q: 'How is the ₹2,000 conditional refund granted?',
      a: 'If you fulfill the agreed selection criteria and secure a verified placement or accepted job offer with one of our partner employers during the 6-month assistance window, you become eligible for a ₹2,000 refund. You simply submit your offer verification in your dashboard, and our administrator authorizes the direct disbursement back to your account.'
    },
    {
      q: 'How does SkillBridge match candidates without relying solely on AI?',
      a: 'We use a transparent, deterministic matching algorithm that compares structured skill tags, career preferences, and academic benchmarks. An explainable Job Match Score is shown to you and the recruiter with an itemized breakdown. Candidates are never rejected by black-box algorithms—recruiters review all applications independently.'
    },
    {
      q: 'Can colleges or institutions enroll entire cohorts?',
      a: 'Yes! Educational institutions can register their Training & Placement Cells (TPOs), create batches, bulk-import students via a validated CSV template, monitor aggregate skill readiness charts, and download authorised placement progress reports.'
    },
    {
      q: 'How is student data privacy protected?',
      a: 'We implement strict data minimization. Student contact details, phone numbers, and CV files are only shared with verified employers when the candidate explicitly consents or applies to a job vacancy. For students under 18, guardian consent is required.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-900 text-white pt-20 pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Empowering India's Next Generation of Skilled Talent
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            From Skills to Careers: <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-teal-300 to-emerald-300">
              The AI-Powered Skilling & Placement Ecosystem
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Bridge the gap between academic education and industry requirements. SkillBridge assesses your capabilities, pinpoints missing skills, connects you with accredited skill centres, and secures direct employer interviews.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/jobs"
              className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Find Your Career Path</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/company"
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <span>Hire Pre-Vetted Talent</span>
            </Link>

            <Link
              to="/register"
              className="w-full sm:w-auto px-6 py-3.5 bg-teal-600/20 hover:bg-teal-600/30 border border-teal-500/40 text-teal-300 font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4 text-teal-400" />
              <span>Partner With Us</span>
            </Link>
          </div>

          {/* Trust Banner with ₹5000 / ₹2000 refund badge */}
          <div className="mt-12 inline-flex flex-wrap items-center justify-center gap-6 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-xs text-slate-300">
            <div className="flex items-center gap-2 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Placement Programme Fee: <strong>₹5,000</strong></span>
            </div>
            <div className="h-4 w-px bg-white/20 hidden sm:block"></div>
            <div className="flex items-center gap-2 font-medium text-emerald-300">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Conditional Refund Upon Verified Placement: <strong>₹2,000</strong></span>
            </div>
            <div className="h-4 w-px bg-white/20 hidden sm:block"></div>
            <div className="flex items-center gap-2 font-medium">
              <Clock className="w-4 h-4 text-indigo-300" />
              <span>6-Month Assistance Window</span>
            </div>
          </div>

        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="bg-white border-y border-slate-200 py-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, idx) => (
              <div key={idx} className="p-2">
                <s.icon className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                <div className="text-3xl font-black text-slate-900 tracking-tight">{s.value}</div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              The Placement Pipeline
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3">
              How SkillBridge Works
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              A structured four-step journey transforming candidates into industry-ready hires.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 font-black text-sm flex items-center justify-center mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Profile & Skills Audit</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter your technical background or upload your CV. Our system extracts your verified skills and generates a transparent CV score.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 font-black text-sm flex items-center justify-center mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Skill-Gap Analysis</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Compare your current skills against live employer requirements. Clearly identify which skills are possessed and which are missing.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 font-black text-sm flex items-center justify-center mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Targeted Upskilling</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enrol in courses delivered by accredited skill centres (recorded lessons, live online, or offline classes) to bridge your specific gaps.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-black text-sm flex items-center justify-center mb-4">
                04
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Interviews & Placements</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receive direct interview invitations from verified partner companies. Secure verified placement and unlock your ₹2,000 conditional refund!
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Stakeholder Value Propositions */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              One Integrated Ecosystem
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3">
              Built For All Four Stakeholders
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Every participant gains verifiable outcomes, transparent terms, and purpose-built dashboards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* 1. Students */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-indigo-600 text-white">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">For Students & Job Seekers</h3>
                  <span className="text-xs text-indigo-600 font-semibold">Career Acceleration</span>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Explainable Job Match Score calculated without black-box rejections.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Personalized skill-gap breakdown showing exact missing requirements.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Structured placement programme with ₹2,000 conditional refund upon hiring.</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link to="/student" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                  Explore Student Dashboard <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 2. Companies */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-slate-900 text-white">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">For Partner Companies</h3>
                  <span className="text-xs text-indigo-600 font-semibold">Zero-Noise Hiring</span>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Receive candidates whose verified skills map directly to job specifications.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Integrated ATS to shortlist, schedule interviews, and record outcomes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Configurable hiring packages: pay-per-job or unlimited monthly plans.</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link to="/company" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                  Explore Company Dashboard <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 3. Skill Centres */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-amber-600 text-white">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">For Skill Centres & Trainers</h3>
                  <span className="text-xs text-amber-700 font-semibold">Monetized Upskilling</span>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>List accredited courses directly targeting candidate missing skills.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Deliver via recorded video lessons, live webinars, or offline campus classes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Track student lesson progress and issue verified completion credentials.</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link to="/skillcentre" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                  Explore Skill Centre Dashboard <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 4. Schools & Colleges */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-teal-600 text-white">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">For Schools & Colleges (TPOs)</h3>
                  <span className="text-xs text-teal-700 font-semibold">Institutional Employability</span>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Bulk import student cohorts via validated CSV template in seconds.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Track aggregate cohort employability, course completion, and placement rates.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Download privacy-compliant placement audit reports for accreditation.</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link to="/institution" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                  Explore Institution Dashboard <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Career Paths */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Trending Opportunities
              </span>
              <h2 className="text-3xl font-black text-slate-900 mt-1">
                Featured Career Paths & Roles
              </h2>
            </div>
            <Link
              to="/jobs"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mt-2 md:mt-0"
            >
              Browse All Vacancies <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {careerCategories.map((c, idx) => (
              <div
                key={idx}
                onClick={() => navigate(`/jobs?category=${encodeURIComponent(c.title)}`)}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-400 hover:shadow-md cursor-pointer transition-all group"
              >
                <div className="text-3xl mb-3">{c.icon}</div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {c.title}
                  </h3>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                    {c.count} openings
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  Key Skills: {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparent FAQ Section */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Clear & Transparent Policies
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-3">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Everything you need to know about our programme fee, refund terms, and matching workflow.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-5 bg-white hover:bg-slate-50 flex items-center justify-between font-semibold text-slate-900 text-sm"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      openFaq === idx ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-slate-600 bg-white leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Testimonials (Transparently labelled) */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-200 px-3 py-1 rounded-full">
              Simulated Demonstration Experience
            </span>
            <h3 className="text-2xl font-bold text-slate-900 mt-2">
              Candidate & Partner Feedback
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-xs text-slate-600 space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">Rahul S. (Student)</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-semibold">Verified Placement</span>
              </div>
              <p className="italic">
                "The skill-gap analysis identified my missing Power BI knowledge immediately. I completed the 6-week module with Apex Tech Academy, interviewed with TechCorp, and received an offer within 3 weeks!"
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-xs text-slate-600 space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">Priya I. (TechCorp HR)</span>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-semibold">Employer Partner</span>
              </div>
              <p className="italic">
                "Unlike standard job boards where 90% of applicants lack required tools, SkillBridge candidates are pre-screened on concrete skills. Our time-to-hire dropped by 65%."
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-xs text-slate-600 space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">Prof. K. Rao (Head TPO)</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-semibold">NIT Campus</span>
              </div>
              <p className="italic">
                "Importing our 200+ engineering student cohort took just 2 minutes via CSV. We track real-time course completions and placement stages without administrative friction."
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
