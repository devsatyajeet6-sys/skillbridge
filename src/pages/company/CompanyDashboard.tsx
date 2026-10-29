import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Users, 
  Calendar, 
  Plus, 
  Search, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Video, 
  ExternalLink,
  ChevronDown,
  Building,
  CreditCard,
  FileText,
  UserCheck
} from 'lucide-react';
import { dataService, subscribeToDataChanges } from '../../services/dataService';
import { Company, Job, Application, Interview, StudentProfile } from '../../types';
import { SkillBadge } from '../../components/common/SkillBadge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell 
} from 'recharts';

export const CompanyDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'applicants' | 'interviews' | 'billing'>('overview');
  
  const currentUser = dataService.getCurrentUser();
  const [company, setCompany] = useState<Company | null>(
    currentUser ? (dataService.getCompanyByUserId(currentUser.id) || dataService.getAllCompanies()[0]) : dataService.getAllCompanies()[0]
  );

  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  
  // Job Creation Modal State
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState('Engineering');
  const [newCategory, setNewCategory] = useState('Software Developer');
  const [newLocation, setNewLocation] = useState('Bengaluru');
  const [newMode, setNewMode] = useState<'remote' | 'hybrid' | 'on_site'>('hybrid');
  const [newExp, setNewExp] = useState<'entry' | 'mid' | 'senior'>('entry');
  const [newSalaryMin, setNewSalaryMin] = useState(450000);
  const [newSalaryMax, setNewSalaryMax] = useState(700000);
  const [newSkills, setNewSkills] = useState('React, TypeScript, JavaScript, Git');
  const [newDesc, setNewDesc] = useState('');

  // Interview Schedule Modal State
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [interviewDate, setInterviewDate] = useState('2026-11-05T11:00');
  const [interviewMode, setInterviewMode] = useState<'online_video' | 'offline_in_person' | 'phone'>('online_video');
  const [meetLink, setMeetLink] = useState('https://meet.google.com/xyz-tech-interview');
  const [interviewerName, setInterviewerName] = useState('Priya Iyer (Hiring Manager)');

  // Selected candidate filter in ATS
  const [selectedJobFilter, setSelectedJobFilter] = useState<string>('All');

  const refreshData = () => {
    const user = dataService.getCurrentUser();
    const comp = user ? (dataService.getCompanyByUserId(user.id) || dataService.getAllCompanies()[0]) : dataService.getAllCompanies()[0];
    setCompany(comp);
    if (comp) {
      const compJobs = dataService.getAllJobs().filter(j => j.company_id === comp.id);
      setJobs(compJobs);
      setApplications(dataService.getApplicationsForCompany(comp.id));
      setInterviews(dataService.getInterviewsForCompany(comp.id));
    }
  };

  useEffect(() => {
    refreshData();
    const unsub = subscribeToDataChanges(refreshData);
    return unsub;
  }, []);

  if (!company) {
    return (
      <div className="min-h-screen p-8 text-center bg-slate-50">
        <h2 className="text-xl font-bold text-slate-800">No Employer Profile Linked</h2>
        <p className="text-xs text-slate-500 mt-2">Please use the header switcher to choose "Company Recruiter".</p>
      </div>
    );
  }

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = newSkills.split(',').map(s => s.trim()).filter(Boolean);

    dataService.createJob({
      company_id: company.id,
      company_name: company.company_name,
      company_logo: company.logo_url,
      title: newTitle,
      department: newDept,
      category: newCategory,
      location: newLocation,
      work_mode: newMode,
      experience_level: newExp,
      salary_min: newSalaryMin,
      salary_max: newSalaryMax,
      salary_currency: 'INR',
      description: newDesc || `Exciting entry-level vacancy for ${newTitle} at ${company.company_name}.`,
      responsibilities: ['Collaborate with agile cross-functional teams', 'Deliver verified technical deliverables', 'Report to team lead'],
      requirements: ['Bachelor degree or equivalent accredited diploma', 'High problem-solving aptitude'],
      required_skills: skillsArray,
      preferred_skills: ['Fast Learner', 'Communication'],
      qualifications: ['B.Tech / B.Sc / Any Graduate'],
      application_deadline: '2026-12-31',
      moderation_status: 'approved',
      is_active: true
    });

    setIsCreateJobOpen(false);
    setNewTitle('');
    setNewDesc('');
    alert('Job posting published successfully!');
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    dataService.scheduleInterview({
      application_id: selectedApp.id,
      job_id: selectedApp.job_id,
      job_title: selectedApp.job_title,
      company_id: company.id,
      company_name: company.company_name,
      student_id: selectedApp.student_id,
      student_name: selectedApp.student_name,
      student_email: selectedApp.student_email,
      scheduled_at: new Date(interviewDate).toISOString(),
      duration_minutes: 45,
      mode: interviewMode,
      meeting_link_or_address: meetLink,
      status: 'scheduled',
      outcome: 'pending',
      interviewer_name: interviewerName
    });

    setIsScheduleOpen(false);
    setSelectedApp(null);
    alert(`Interview invitation dispatched to ${selectedApp.student_name}!`);
  };

  const handleStatusChange = (appId: string, newStatus: Application['status']) => {
    dataService.updateApplicationStatus(appId, newStatus);
  };

  const filteredApps = applications.filter(a => selectedJobFilter === 'All' || a.job_id === selectedJobFilter);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Company Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xl font-bold shadow-md overflow-hidden shrink-0">
              {company.logo_url ? (
                <img src={company.logo_url} alt={company.company_name} className="w-full h-full object-cover" />
              ) : (
                company.company_name.slice(0, 2).toUpperCase()
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">{company.company_name}</h1>
                <StatusBadge status={company.verification_status} />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {company.industry} • {company.location} • Recruiter: {company.recruiter_name} ({company.business_email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-stretch md:self-auto justify-end">
            <button
              onClick={() => setIsCreateJobOpen(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Post New Job
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-8 overflow-x-auto pb-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            Hiring Overview
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'jobs' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            Job Postings ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab('applicants')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'applicants' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            Applicant Tracking (ATS) ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab('interviews')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'interviews' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            Interview Rounds ({interviews.length})
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'billing' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            Packages & Invoices
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-400">Active Openings</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{jobs.filter(j => j.is_active).length} Vacancies</div>
                <p className="text-[11px] text-slate-500 mt-0.5">Live on candidate marketplace</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Applicants</span>
                <div className="text-2xl font-black text-indigo-600 mt-1">{applications.length} Candidates</div>
                <p className="text-[11px] text-slate-500 mt-0.5">Matched by required skills</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-400">Interviews Scheduled</span>
                <div className="text-2xl font-black text-amber-600 mt-1">{interviews.length} Scheduled</div>
                <p className="text-[11px] text-slate-500 mt-0.5">Active calendar invites</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-400">Job Credits</span>
                <div className="text-2xl font-black text-emerald-600 mt-1">{company.job_credits_remaining} Remaining</div>
                <p className="text-[11px] text-slate-500 mt-0.5">Tier: {company.subscription_tier.replace('_', ' ')}</p>
              </div>
            </div>

            {/* Recruitment Pipeline Funnel */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">Recruitment Funnel & Pipeline Distribution</h3>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded">Real-Time Funnel</span>
              </div>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { stage: 'Applied', count: applications.filter(a => a.status === 'applied').length },
                      { stage: 'Screening', count: applications.filter(a => a.status === 'screening').length },
                      { stage: 'Shortlisted', count: applications.filter(a => a.status === 'shortlisted').length },
                      { stage: 'Interview', count: applications.filter(a => a.status === 'interview_scheduled').length },
                      { stage: 'Offer', count: applications.filter(a => a.status === 'offer_extended').length },
                      { stage: 'Hired', count: applications.filter(a => a.status === 'hired').length }
                    ]}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                    <Bar dataKey="count" name="Candidates" radius={[4, 4, 0, 0]}>
                      {[
                        '#6366f1', '#818cf8', '#0d9488', '#f59e0b', '#3b82f6', '#10b981'
                      ].map((c, idx) => (
                        <Cell key={`cell-${idx}`} fill={c} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
                {[
                  { label: 'Applied', count: applications.filter(a => a.status === 'applied').length },
                  { label: 'Screening', count: applications.filter(a => a.status === 'screening').length },
                  { label: 'Shortlisted', count: applications.filter(a => a.status === 'shortlisted').length },
                  { label: 'Interview', count: applications.filter(a => a.status === 'interview_scheduled').length },
                  { label: 'Offer', count: applications.filter(a => a.status === 'offer_extended').length },
                  { label: 'Hired', count: applications.filter(a => a.status === 'hired').length }
                ].map((stage, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-lg font-black text-indigo-700">{stage.count}</div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">{stage.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Applicants Table */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">Recent Candidate Applications</h3>
                <button onClick={() => setActiveTab('applicants')} className="text-xs text-indigo-600 font-semibold hover:underline">
                  Manage in ATS →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="p-3">Candidate</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Match Score</th>
                      <th className="p-3">Missing Skills</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications.slice(0, 5).map(app => (
                      <tr key={app.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-semibold text-slate-900">{app.student_name}</td>
                        <td className="p-3 text-slate-600">{app.job_title}</td>
                        <td className="p-3 font-black text-indigo-600">{app.match_score}%</td>
                        <td className="p-3 text-slate-500">
                          {app.missing_skills.length > 0 ? app.missing_skills.join(', ') : 'None (100% matched)'}
                        </td>
                        <td className="p-3"><StatusBadge status={app.status} size="sm" /></td>
                        <td className="p-3">
                          <button
                            onClick={() => {
                              setSelectedApp(app);
                              setIsScheduleOpen(true);
                            }}
                            className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold rounded hover:bg-indigo-100"
                          >
                            Schedule Interview
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: JOBS MANAGEMENT */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Your Posted Vacancies</h3>
                <p className="text-xs text-slate-500 mt-0.5">Create, edit, and monitor live role postings.</p>
              </div>
              <button
                onClick={() => setIsCreateJobOpen(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Create Vacancy
              </button>
            </div>

            <div className="space-y-4">
              {jobs.map(job => (
                <div key={job.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-slate-900">{job.title}</h4>
                      <StatusBadge status={job.moderation_status} size="sm" />
                      {!job.is_active && (
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold">Closed</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {job.department} • {job.location} ({job.work_mode}) • {job.experience_level} level
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {job.required_skills.map(s => <SkillBadge key={s} skill={s} />)}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-xs text-slate-600 self-end md:self-center">
                    <div className="text-center">
                      <div className="font-black text-sm text-slate-900">{job.applicants_count}</div>
                      <div className="text-[10px] text-slate-400">Applicants</div>
                    </div>
                    <div className="text-center">
                      <div className="font-black text-sm text-slate-900">{job.views_count}</div>
                      <div className="text-[10px] text-slate-400">Views</div>
                    </div>

                    <button
                      onClick={() => {
                        dataService.updateJob(job.id, { is_active: !job.is_active });
                        refreshData();
                      }}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs ${
                        job.is_active ? 'bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700' : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {job.is_active ? 'Close Role' : 'Reactivate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: APPLICANT TRACKING (ATS) */}
        {activeTab === 'applicants' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Applicant Tracking System</h3>
                <p className="text-xs text-slate-500 mt-0.5">Screen candidates, assess match percentages, and manage candidate pipeline.</p>
              </div>

              {/* Filter by Job */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Filter Job:</span>
                <select
                  value={selectedJobFilter}
                  onChange={(e) => setSelectedJobFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="All">All Jobs ({applications.length})</option>
                  {jobs.map(j => (
                    <option key={j.id} value={j.id}>{j.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Candidates List */}
            <div className="space-y-4">
              {filteredApps.map(app => (
                <div key={app.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="text-base font-bold text-slate-900">{app.student_name}</h4>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs font-semibold text-slate-600">{app.education}</span>
                        <StatusBadge status={app.status} size="sm" />
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Applied for <strong>{app.job_title}</strong> on {new Date(app.applied_at).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-black text-indigo-600">{app.match_score}% Match</div>
                      <div className="text-[10px] text-slate-400">Algorithmic Skill Rating</div>
                    </div>
                  </div>

                  {/* Skills Possessed vs Missing */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[11px] font-bold text-emerald-800 block mb-1">Candidate Possesses:</span>
                      <div className="flex flex-wrap gap-1">
                        {app.possessed_skills.map(s => <SkillBadge key={s} skill={s} variant="matched" />)}
                      </div>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-rose-800 block mb-1">Missing Required Skills:</span>
                      <div className="flex flex-wrap gap-1">
                        {app.missing_skills.length > 0 ? (
                          app.missing_skills.map(s => <SkillBadge key={s} skill={s} variant="missing" />)
                        ) : (
                          <span className="text-[11px] text-emerald-600 font-medium">None (Full match)</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ATS Stage Transition Actions */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-medium">Advance Stage:</span>
                      <select
                        value={app.status}
                        onChange={(e: any) => handleStatusChange(app.id, e.target.value)}
                        className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-white font-semibold text-slate-700"
                      >
                        <option value="applied">Applied</option>
                        <option value="screening">Screening</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interview_scheduled">Interview Scheduled</option>
                        <option value="offer_extended">Offer Extended</option>
                        <option value="hired">Hired (Placement Confirmed)</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setIsScheduleOpen(true);
                        }}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-sm"
                      >
                        Schedule Interview
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: INTERVIEWS */}
        {activeTab === 'interviews' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Scheduled Interview Rounds</h3>
                <p className="text-xs text-slate-500 mt-0.5">Manage live interview links, dates, and submit evaluation outcomes.</p>
              </div>
            </div>

            <div className="space-y-4">
              {interviews.map(inv => (
                <div key={inv.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900">{inv.student_name}</h4>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs font-semibold text-indigo-600">{inv.job_title}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Scheduled: <strong>{new Date(inv.scheduled_at).toLocaleDateString()}</strong> at {new Date(inv.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({inv.duration_minutes} mins)
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">Interviewer: {inv.interviewer_name}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusBadge status={inv.status} />
                      <StatusBadge status={inv.outcome} />
                    </div>
                  </div>

                  {/* Meeting Link */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-600 truncate max-w-md">Meeting: {inv.meeting_link_or_address}</span>
                    <a
                      href={inv.meeting_link_or_address}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 font-bold hover:underline flex items-center gap-1 shrink-0 ml-2"
                    >
                      Open Link <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Outcome Decision Buttons */}
                  {inv.outcome === 'pending' && (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Record Round Outcome:</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            dataService.updateInterviewOutcome(inv.id, 'passed', 'Candidate cleared technical and behavioral evaluation.');
                            refreshData();
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold"
                        >
                          Pass & Extend Offer
                        </button>
                        <button
                          onClick={() => {
                            dataService.updateInterviewOutcome(inv.id, 'failed', 'Missing requisite depth in specific technical requirements.');
                            refreshData();
                          }}
                          className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg font-bold"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: BILLING & PRICING */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-slate-900">Employer Packages & Credits</h3>
              <p className="text-xs text-slate-500">Configured hiring tiers for verified partner companies.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="font-bold text-slate-900 text-sm">Pay-Per-Job</div>
                  <div className="text-2xl font-black text-slate-900">₹2,500 <span className="text-xs text-slate-400 font-normal">/ posting</span></div>
                  <ul className="text-xs text-slate-600 space-y-1">
                    <li>• 30-day active listing</li>
                    <li>• Algorithmic skill matching</li>
                    <li>• Basic ATS workflow</li>
                  </ul>
                  <button className="w-full py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-not-allowed">
                    Current Tier
                  </button>
                </div>

                <div className="p-5 rounded-2xl border border-indigo-500 bg-indigo-50/50 space-y-3 relative">
                  <span className="absolute top-3 right-3 text-[10px] bg-indigo-600 text-white font-bold px-2 py-0.5 rounded-full">Popular</span>
                  <div className="font-bold text-indigo-950 text-sm">Monthly Pro</div>
                  <div className="text-2xl font-black text-indigo-950">₹14,999 <span className="text-xs text-slate-500 font-normal">/ month</span></div>
                  <ul className="text-xs text-slate-700 space-y-1">
                    <li>• Up to 15 active job listings</li>
                    <li>• Automated interview scheduler</li>
                    <li>• Priority candidate screening</li>
                  </ul>
                  <button
                    onClick={() => alert('Demo Mode: Upgraded to Monthly Pro package!')}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm"
                  >
                    Select Plan
                  </button>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="font-bold text-slate-900 text-sm">Institutional Enterprise</div>
                  <div className="text-2xl font-black text-slate-900">Custom</div>
                  <ul className="text-xs text-slate-600 space-y-1">
                    <li>• Dedicated campus drives</li>
                    <li>• Custom college cohort sourcing</li>
                    <li>• SLA guarantee</li>
                  </ul>
                  <button className="w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-lg">
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: CREATE JOB */}
        {isCreateJobOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto border border-slate-100">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <h3 className="text-lg font-bold text-slate-900">Create New Job Vacancy</h3>
                <button onClick={() => setIsCreateJobOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>

              <form onSubmit={handleCreateJob} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Junior Data Analyst"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                    <input
                      type="text"
                      value={newDept}
                      onChange={(e) => setNewDept(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                    >
                      <option>Data Analyst</option>
                      <option>Software Developer</option>
                      <option>Sales Executive</option>
                      <option>Accountant</option>
                      <option>Customer Support</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Work Mode</label>
                    <select
                      value={newMode}
                      onChange={(e: any) => setNewMode(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                    >
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="on_site">On-Site</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Experience</label>
                    <select
                      value={newExp}
                      onChange={(e: any) => setNewExp(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                    >
                      <option value="entry">Entry Level</option>
                      <option value="mid">Mid Level</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Required Skills (comma separated for matching)</label>
                  <input
                    type="text"
                    required
                    value={newSkills}
                    onChange={(e) => setNewSkills(e.target.value)}
                    placeholder="e.g. SQL, Excel, Power BI"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Job Description</label>
                  <textarea
                    rows={3}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Detail the day-to-day expectations..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateJobOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md"
                  >
                    Publish Vacancy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: SCHEDULE INTERVIEW */}
        {isScheduleOpen && selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-base font-bold text-slate-900">Schedule Interview Round</h3>
                <button onClick={() => setIsScheduleOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>

              <form onSubmit={handleScheduleSubmit} className="space-y-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="font-bold text-slate-900">Candidate: {selectedApp.student_name}</div>
                  <div className="text-slate-500 mt-0.5">Role: {selectedApp.job_title}</div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Interview Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Interview Mode</label>
                  <select
                    value={interviewMode}
                    onChange={(e: any) => setInterviewMode(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                  >
                    <option value="online_video">Online Video Call</option>
                    <option value="offline_in_person">In-Person at Office</option>
                    <option value="phone">Telephonic Screening</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Meeting Link or Office Address</label>
                  <input
                    type="text"
                    required
                    value={meetLink}
                    onChange={(e) => setMeetLink(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Interviewer Name / Panel</label>
                  <input
                    type="text"
                    value={interviewerName}
                    onChange={(e) => setInterviewerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsScheduleOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md"
                  >
                    Confirm & Send Invite
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
