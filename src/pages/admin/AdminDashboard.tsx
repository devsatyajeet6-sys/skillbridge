import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  Building, 
  BookOpen, 
  Briefcase, 
  Award, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Settings, 
  FileText, 
  RotateCcw,
  Sliders,
  DollarSign,
  Search,
  ExternalLink
} from 'lucide-react';
import { dataService, subscribeToDataChanges } from '../../services/dataService';
import { 
  User, 
  Company, 
  SkillCentre, 
  Institution, 
  Job, 
  Course, 
  ProgrammeEnrolment, 
  AuditLog, 
  PlatformConfig 
} from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'approvals' | 'refunds' | 'moderation' | 'users' | 'settings' | 'audit'>('overview');
  
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [centres, setCentres] = useState<SkillCentre[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [refunds, setRefunds] = useState<ProgrammeEnrolment[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [config, setConfig] = useState<PlatformConfig>(dataService.getConfig());

  // Platform Config form
  const [programmeFee, setProgrammeFee] = useState(config.programme_fee);
  const [refundAmount, setRefundAmount] = useState(config.refund_amount);
  const [maxInterviews, setMaxInterviews] = useState(config.max_interviews);
  const [assistanceMonths, setAssistanceMonths] = useState(config.assistance_duration_months);
  const [llmProvider, setLlmProvider] = useState(config.llm_provider);
  const [llmKey, setLlmKey] = useState(config.llm_api_key || '');

  const refreshData = () => {
    setUsers(dataService.getAllUsers());
    setCompanies(dataService.getAllCompanies());
    setCentres(dataService.getAllSkillCentres());
    setInstitutions(dataService.getAllInstitutions());
    setJobs(dataService.getAllJobs());
    setCourses(dataService.getAllCourses());
    setRefunds(dataService.getAllProgrammeEnrolments());
    setAuditLogs(dataService.getAuditLogs());
    setConfig(dataService.getConfig());
  };

  useEffect(() => {
    refreshData();
    const unsub = subscribeToDataChanges(refreshData);
    return unsub;
  }, []);

  const pendingCompanies = companies.filter(c => c.verification_status === 'pending');
  const pendingCentres = centres.filter(sc => sc.verification_status === 'pending');
  const pendingInsts = institutions.filter(i => i.verification_status === 'pending');
  const pendingRefunds = refunds.filter(r => r.refund_status === 'requested');

  const handleApproveCompany = (id: string) => {
    dataService.updateCompanyStatus(id, 'verified');
    refreshData();
  };

  const handleRejectCompany = (id: string) => {
    dataService.updateCompanyStatus(id, 'rejected');
    refreshData();
  };

  const handleApproveCentre = (id: string) => {
    dataService.updateSkillCentreStatus(id, 'verified');
    refreshData();
  };

  const handleRejectCentre = (id: string) => {
    dataService.updateSkillCentreStatus(id, 'rejected');
    refreshData();
  };

  const handleApproveInstitution = (id: string) => {
    dataService.updateInstitutionStatus(id, 'verified');
    refreshData();
  };

  const handleProcessRefund = (enrolmentId: string, approved: boolean) => {
    const reason = approved 
      ? 'Verified employer placement contract validated against partner records.' 
      : 'Employer offer confirmation could not be verified.';
    dataService.processRefundByAdmin(enrolmentId, approved, reason);
    refreshData();
    alert(`Refund ${approved ? 'Authorized & Paid (₹2,000)' : 'Rejected'}.`);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    dataService.updateConfig({
      programme_fee: Number(programmeFee),
      refund_amount: Number(refundAmount),
      max_interviews: Number(maxInterviews),
      assistance_duration_months: Number(assistanceMonths),
      llm_provider: llmProvider,
      llm_api_key: llmKey
    });

    dataService.logAudit({
      action: 'UPDATE_PLATFORM_CONFIG',
      target_type: 'settings',
      target_id: 'global_config',
      details: `Updated placement fee to ₹${programmeFee}, refund to ₹${refundAmount}, and LLM mode to ${llmProvider}`
    });

    alert('Platform configuration updated successfully!');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-md mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/30 overflow-hidden shrink-0">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">Platform Administrator Portal</h1>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded-full border border-rose-500/30 uppercase tracking-wider">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Ecosystem moderation, enterprise verifications, refund approvals, and audit trails.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (window.confirm('Reset all platform demo data to fresh initial seed state?')) {
                  dataService.resetDemoData();
                  refreshData();
                }
              }}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Demo Ecosystem
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
            System Health
          </button>
          <button
            onClick={() => setActiveTab('approvals')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap relative ${
              activeTab === 'approvals' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            Pending Verifications ({pendingCompanies.length + pendingCentres.length + pendingInsts.length})
          </button>
          <button
            onClick={() => setActiveTab('refunds')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap relative ${
              activeTab === 'refunds' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            Refund Authorizations ({pendingRefunds.length})
          </button>
          <button
            onClick={() => setActiveTab('moderation')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'moderation' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            Jobs & Courses Moderation
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'users' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            User Accounts ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            Platform Configuration
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'audit' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            Audit Logs ({auditLogs.length})
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Users</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{users.length} Registered</div>
                <p className="text-[11px] text-slate-500 mt-0.5">Across all 5 ecosystem roles</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-400">Partner Employers</span>
                <div className="text-2xl font-black text-indigo-600 mt-1">{companies.length} Companies</div>
                <p className="text-[11px] text-slate-500 mt-0.5">{pendingCompanies.length} pending verification</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-400">Skill Centres</span>
                <div className="text-2xl font-black text-amber-600 mt-1">{centres.length} Institutes</div>
                <p className="text-[11px] text-slate-500 mt-0.5">{courses.length} accredited courses</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-400">Refund Claims</span>
                <div className="text-2xl font-black text-emerald-600 mt-1">{pendingRefunds.length} Actionable</div>
                <p className="text-[11px] text-slate-500 mt-0.5">₹2,000 conditional payouts</p>
              </div>
            </div>

            {/* Pending Queues Alert Banner */}
            {(pendingCompanies.length > 0 || pendingRefunds.length > 0) && (
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                  <div>
                    <h4 className="font-bold text-sm text-amber-900">Action Required: Pending Administrative Reviews</h4>
                    <p className="text-xs text-amber-700 mt-0.5">
                      {pendingCompanies.length} employer account(s) and {pendingRefunds.length} placement refund claim(s) require review.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab(pendingRefunds.length > 0 ? 'refunds' : 'approvals')}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm"
                >
                  Review Queue
                </button>
              </div>
            )}

            {/* Visual Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900">Ecosystem Entity Volumes</h3>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded">Platform Metrics</span>
                </div>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Users', count: users.length },
                        { name: 'Jobs', count: jobs.length },
                        { name: 'Courses', count: courses.length },
                        { name: 'Companies', count: companies.length },
                        { name: 'Centres', count: centres.length },
                        { name: 'Colleges', count: institutions.length }
                      ]}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                      <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {['#6366f1', '#0d9488', '#f59e0b', '#3b82f6', '#8b5cf6', '#10b981'].map((c, idx) => (
                          <Cell key={`cell-${idx}`} fill={c} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">User Role Distribution</h3>
                  <span className="text-[10px] text-slate-400">Total Registered Identities</span>
                </div>
                <div className="h-44 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Students', value: users.filter(u => u.role === 'student').length },
                          { name: 'Companies', value: users.filter(u => u.role === 'company').length },
                          { name: 'Centres', value: users.filter(u => u.role === 'skill_centre').length },
                          { name: 'Institutions', value: users.filter(u => u.role === 'institution').length }
                        ]}
                        innerRadius={40}
                        outerRadius={65}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        <Cell fill="#6366f1" />
                        <Cell fill="#0d9488" />
                        <Cell fill="#f59e0b" />
                        <Cell fill="#3b82f6" />
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-500 pt-2 border-t border-slate-100">
                  <span className="text-indigo-700 font-bold">Students ({users.filter(u => u.role === 'student').length})</span>
                  <span className="text-teal-700 font-bold">Companies ({users.filter(u => u.role === 'company').length})</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PENDING APPROVAL QUEUE */}
        {activeTab === 'approvals' && (
          <div className="space-y-6">
            
            {/* Pending Companies */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-slate-900">
                Pending Partner Employer Registrations ({pendingCompanies.length})
              </h3>
              {pendingCompanies.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No companies currently awaiting verification.</p>
              ) : (
                <div className="space-y-3">
                  {pendingCompanies.map(comp => (
                    <div key={comp.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900">{comp.company_name}</h4>
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold">Pending Approval</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {comp.industry} • {comp.location} • Size: {comp.company_size} • Recruiter: {comp.recruiter_name} ({comp.business_email})
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproveCompany(comp.id)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm"
                        >
                          Approve & Verify
                        </button>
                        <button
                          onClick={() => handleRejectCompany(comp.id)}
                          className="px-3.5 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold rounded-lg"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pending Skill Centres */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-slate-900">
                Pending Skill Centres ({pendingCentres.length})
              </h3>
              {pendingCentres.length === 0 ? (
                <p className="text-xs text-slate-400 italic">All skill centres are verified.</p>
              ) : (
                <div className="space-y-3">
                  {pendingCentres.map(sc => (
                    <div key={sc.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{sc.centre_name}</h4>
                        <div className="text-xs text-slate-500">{sc.location} • {sc.contact_email}</div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleApproveCentre(sc.id)} className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg">Approve</button>
                        <button onClick={() => handleRejectCentre(sc.id)} className="px-3 py-1.5 bg-rose-50 text-rose-700 text-xs font-bold rounded-lg">Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 3: REFUND AUTHORIZATIONS */}
        {activeTab === 'refunds' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Placement Assistance Refund Authorizations</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Authorize the release of conditional ₹2,000 refund disbursements upon verifying candidate employment selection.
                  </p>
                </div>
                <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-200">
                  Fixed Condition: ₹2,000 Payout
                </span>
              </div>

              <div className="space-y-4">
                {refunds.map(r => (
                  <div key={r.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-base text-slate-900">{r.student_name}</h4>
                          <span className="text-xs text-slate-500">({r.student_email})</span>
                          <StatusBadge status={r.refund_status} size="sm" />
                        </div>
                        <div className="text-xs text-slate-600 mt-1">
                          Enrolment ID: <strong>{r.id}</strong> • Enrolled on {new Date(r.enrolled_at).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-slate-700 font-medium mt-1">
                          Verified Employer: <strong>{r.verified_company_name || 'Infosys Cloud Labs'}</strong> (Offer: {r.verified_job_title || 'Junior React Specialist'})
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xl font-black text-emerald-600">₹{r.refund_amount}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Refund Amount</div>
                      </div>
                    </div>

                    {r.admin_notes && (
                      <div className="text-xs bg-white p-2.5 rounded-lg border border-slate-200 text-slate-600">
                        <strong>Verification Notes:</strong> {r.admin_notes}
                      </div>
                    )}

                    {r.refund_status === 'requested' && (
                      <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleProcessRefund(r.id, false)}
                          className="px-3.5 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-bold"
                        >
                          Reject Claim
                        </button>
                        <button
                          type="button"
                          onClick={() => handleProcessRefund(r.id, true)}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm"
                        >
                          Validate & Authorize ₹2,000 Refund
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MODERATION */}
        {activeTab === 'moderation' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-slate-900">Job Vacancy Moderation</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="p-3">Job Title</th>
                      <th className="p-3">Company</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Moderation</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {jobs.map(job => (
                      <tr key={job.id}>
                        <td className="p-3 font-semibold text-slate-900">{job.title}</td>
                        <td className="p-3 text-slate-600">{job.company_name}</td>
                        <td className="p-3 text-slate-500">{job.category}</td>
                        <td className="p-3"><StatusBadge status={job.moderation_status} size="sm" /></td>
                        <td className="p-3">
                          {job.moderation_status === 'approved' ? (
                            <button
                              onClick={() => dataService.updateJobModeration(job.id, 'archived')}
                              className="text-rose-600 hover:underline font-semibold"
                            >
                              Archive
                            </button>
                          ) : (
                            <button
                              onClick={() => dataService.updateJobModeration(job.id, 'approved')}
                              className="text-emerald-600 hover:underline font-semibold"
                            >
                              Approve
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: USERS MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-slate-900">Platform Registered Users</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="p-3">Full Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map(u => (
                      <tr key={u.id}>
                        <td className="p-3 font-semibold text-slate-900">{u.full_name}</td>
                        <td className="p-3 text-slate-600">{u.email}</td>
                        <td className="p-3 capitalize font-medium">{u.role.replace('_', ' ')}</td>
                        <td className="p-3"><StatusBadge status={u.status} size="sm" /></td>
                        <td className="p-3">
                          {u.role !== 'admin' && (
                            u.status === 'active' ? (
                              <button
                                onClick={() => dataService.updateUserStatus(u.id, 'suspended')}
                                className="text-rose-600 font-semibold hover:underline"
                              >
                                Suspend
                              </button>
                            ) : (
                              <button
                                onClick={() => dataService.updateUserStatus(u.id, 'active')}
                                className="text-emerald-600 font-semibold hover:underline"
                              >
                                Activate
                              </button>
                            )
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Platform Global Parameters</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Centralized financial controls and AI matching weights.
              </p>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Placement Programme Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={programmeFee}
                    onChange={(e) => setProgrammeFee(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Conditional Refund (₹)
                  </label>
                  <input
                    type="number"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Max Interview Opportunities
                  </label>
                  <input
                    type="number"
                    value={maxInterviews}
                    onChange={(e) => setMaxInterviews(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assistance Validity (Months)
                  </label>
                  <input
                    type="number"
                    value={assistanceMonths}
                    onChange={(e) => setAssistanceMonths(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">AI Recommendation Engine</label>
                <select
                  value={llmProvider}
                  onChange={(e: any) => setLlmProvider(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                >
                  <option value="deterministic">Deterministic Rule-Based Matching (Zero API Cost)</option>
                  <option value="openai">OpenAI GPT Integration</option>
                  <option value="gemini">Google Gemini Integration</option>
                </select>
              </div>

              {llmProvider !== 'deterministic' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Provider API Key</label>
                  <input
                    type="password"
                    value={llmKey}
                    onChange={(e) => setLlmKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Save Platform Settings
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 7: AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-slate-900">Platform Security & Audit Trail</h3>
              <p className="text-xs text-slate-500">Immutable record of sensitive administrative actions and approvals.</p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Actor</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">Target</th>
                      <th className="p-3">Audit Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {auditLogs.map(log => (
                      <tr key={log.id}>
                        <td className="p-3 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                        <td className="p-3 font-semibold text-slate-900">{log.actor_name}</td>
                        <td className="p-3">
                          <span className="font-mono text-[11px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold">
                            {log.action}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600 capitalize">{log.target_type}</td>
                        <td className="p-3 text-slate-600">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
