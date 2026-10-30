import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Briefcase, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Video, 
  Upload, 
  Share2, 
  FileText, 
  TrendingUp, 
  Sparkles, 
  ChevronRight, 
  Calendar, 
  MapPin, 
  IndianRupee,
  ShieldCheck,
  Check,
  Plus,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { dataService, subscribeToDataChanges } from '../../services/dataService';
import { StudentProfile, Job, Course, CourseEnrolment, Application, Interview, ProgrammeEnrolment } from '../../types';
import { SkillBadge } from '../../components/common/SkillBadge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { calculateJobMatch, calculateCVScore, KNOWN_SKILLS_DIRECTORY } from '../../utils/matchingEngine';
import { parseCVContent } from '../../utils/aiService';
import { PaymentModal } from '../../components/common/PaymentModal';

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'jobs' | 'skills' | 'courses' | 'placement'>('overview');
  
  const currentUser = dataService.getCurrentUser();
  const [student, setStudent] = useState<StudentProfile | null>(() => {
    if (!currentUser) return dataService.getAllStudents()[0] || null;
    return dataService.getStudentByUserId(currentUser.id) || null;
  });

  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [enrolments, setEnrolments] = useState<CourseEnrolment[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [programmeEnrolment, setProgrammeEnrolment] = useState<ProgrammeEnrolment | null>(null);

  // Form states for profile editing
  const [newSkill, setNewSkill] = useState('');
  const [isParsingCV, setIsParsingCV] = useState(false);
  const [cvSuccessMsg, setCvSuccessMsg] = useState('');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const refreshData = () => {
    const user = dataService.getCurrentUser();
    let st: StudentProfile | null = null;
    if (user) {
      st = dataService.getStudentByUserId(user.id) || null;
      if (st && user.full_name && st.full_name !== user.full_name) {
        st = dataService.updateStudentProfile(st.id, { full_name: user.full_name }) || st;
      }
    } else {
      st = dataService.getAllStudents()[0] || null;
    }

    // Auto-clean stale legacy scores if student does not actually have a CV uploaded
    if (st && !st.cv_name && !st.cv_url && !st.cv_text) {
      if (st.cv_score !== 0 || st.job_readiness_score !== 0) {
        st = dataService.updateStudentProfile(st.id, {
          cv_score: 0,
          job_readiness_score: 0
        }) || st;
      }
    }

    setStudent(st);
    if (st) {
      setAllJobs(dataService.getAllJobs().filter(j => j.moderation_status === 'approved' && j.is_active));
      setAllCourses(dataService.getAllCourses().filter(c => c.moderation_status === 'approved'));
      setEnrolments(dataService.getEnrolmentsForStudent(st.id));
      setApplications(dataService.getApplicationsForStudent(st.id));
      setInterviews(dataService.getInterviewsForStudent(st.id));
      setProgrammeEnrolment(dataService.getProgrammeEnrolmentForStudent(st.id) || null);
    }
  };

  useEffect(() => {
    refreshData();
    const unsub = subscribeToDataChanges(refreshData);
    return unsub;
  }, []);

  if (!student) {
    return (
      <div className="min-h-screen p-8 text-center bg-slate-50">
        <h2 className="text-xl font-bold text-slate-800">No Student Profile Linked</h2>
        <p className="text-xs text-slate-500 mt-2">Please use the header switcher to choose "Student (Rahul Sharma)".</p>
      </div>
    );
  }

  // Calculated Metrics
  const hasUploadedCV = Boolean(student.cv_name || student.cv_url || student.cv_text);
  const cvScoreData = calculateCVScore(student);
  const jobMatches = allJobs.map(j => calculateJobMatch(student, j, allCourses));
  jobMatches.sort((a, b) => b.matchScore - a.matchScore);

  // Genuinely matched jobs: only calculated and visible when candidate has uploaded a CV
  const matchedJobs = hasUploadedCV 
    ? jobMatches.filter(m => m.matchScore >= 50 || m.eligibilityMet || m.possessedSkills.length > 0)
    : [];
  const highMatchJobs = hasUploadedCV ? jobMatches.filter(m => m.matchScore >= 70) : [];
  const eligibleJobs = hasUploadedCV ? jobMatches.filter(m => m.eligibilityMet) : [];

  // Collect all missing skills across active jobs
  const missingSkillsSet = new Set<string>();
  jobMatches.forEach(m => m.missingSkills.forEach(s => missingSkillsSet.add(s)));
  const allMissingSkills = Array.from(missingSkillsSet).slice(0, 8);

  const handleAddSkill = (skillToAdd: string) => {
    if (!skillToAdd || student.skills.includes(skillToAdd)) return;
    const updatedSkills = [...student.skills, skillToAdd];
    const updated = dataService.updateStudentProfile(student.id, { skills: updatedSkills });
    if (updated) setStudent(updated);
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = student.skills.filter(s => s !== skillToRemove);
    const updated = dataService.updateStudentProfile(student.id, { skills: updatedSkills });
    if (updated) setStudent(updated);
  };

  const handleSimulateCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingCV(true);
    // Simulate reading text from resume
    const candidateName = currentUser?.full_name || student.full_name;
    const sampleResumeText = `${candidateName}. B.Tech Computer Science graduate. Strong technical competencies in SQL relational schemas, Excel modeling, Python data scripts, Tableau visualizations, Git versioning, and Communication. Capstone project: Power BI transactional analytics dashboard.`;

    const result = await parseCVContent(sampleResumeText);
    
    // Merge extracted skills
    const mergedSkills = Array.from(new Set([...student.skills, ...result.extractedSkills]));
    const calculatedCV = calculateCVScore({
      ...student,
      cv_name: file.name,
      cv_url: `/demo-resumes/${file.name}`,
      cv_text: sampleResumeText,
      skills: mergedSkills
    });

    const readinessScore = Math.min(100, Math.max(68, Math.round(calculatedCV.score * 0.95)));

    const updated = dataService.updateStudentProfile(student.id, {
      cv_name: file.name,
      cv_url: `/demo-resumes/${file.name}`,
      cv_text: sampleResumeText,
      skills: mergedSkills,
      cv_score: calculatedCV.score,
      job_readiness_score: readinessScore
    });

    if (updated) setStudent(updated);
    setIsParsingCV(false);
    setCvSuccessMsg(`CV uploaded successfully! Extracted ${result.extractedSkills.length} skills and computed matching vacancies.`);
    setTimeout(() => setCvSuccessMsg(''), 4000);
  };

  const handleRemoveCV = () => {
    if (window.confirm('Are you sure you want to remove your uploaded CV? Your CV score, readiness score, and job match count will be reset.')) {
      const updated = dataService.updateStudentProfile(student.id, {
        cv_name: undefined,
        cv_url: undefined,
        cv_text: undefined,
        cv_score: 0,
        job_readiness_score: 0,
        skills: []
      });
      if (updated) {
        setStudent(updated);
        setCvSuccessMsg('CV document removed successfully.');
        setTimeout(() => setCvSuccessMsg(''), 4000);
      }
    }
  };

  const handleClaimRefund = () => {
    if (!programmeEnrolment) return;
    dataService.requestPlacementRefund(student.id);
    alert('₹2,000 Refund Claim submitted to Administrator for validation!');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Student Profile Header Bar */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-indigo-600/20 overflow-hidden shrink-0">
              {(currentUser?.full_name || student.full_name).slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">{currentUser?.full_name || student.full_name}</h1>
                <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-0.5 rounded-full border border-indigo-200">
                  Student
                </span>
                {programmeEnrolment?.fee_paid && (
                  <span className="text-xs bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> ₹5k Placement Enrolled
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {student.education_level} • {student.institution_name} ({student.graduation_year}) • {student.location}
              </p>
            </div>
          </div>

          {/* Readiness Indicators */}
          <div className="flex items-center gap-4 self-stretch md:self-auto justify-around md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
            <div className="text-center px-4">
              <div className="text-2xl font-black text-indigo-600">
                {hasUploadedCV ? `${student.cv_score || cvScoreData.score}/100` : '--'}
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-400">
                {hasUploadedCV ? 'CV Score' : 'Upload CV'}
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="text-center px-4">
              <div className="text-2xl font-black text-emerald-600">
                {hasUploadedCV ? `${student.job_readiness_score}%` : '--'}
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-400">
                {hasUploadedCV ? 'Job Readiness' : 'Requires CV'}
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="text-center px-4">
              <div className="text-2xl font-black text-slate-900">
                {hasUploadedCV ? matchedJobs.length : 0}
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Matched Jobs</div>
            </div>
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
            Overview & Checklist
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'profile' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            CV & Profile ({hasUploadedCV ? student.skills.length : 0} skills)
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'jobs' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            Matched Jobs ({hasUploadedCV ? matchedJobs.length : 0})
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'skills' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            Skill-Gap Analysis
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'courses' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            Enrolled Training ({enrolments.length})
          </button>
          <button
            onClick={() => setActiveTab('placement')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'placement' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            Placement Programme (₹5k / ₹2k)
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Top Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Eligibility</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">{eligibleJobs.length} Jobs</div>
                <p className="text-[11px] text-slate-500 mt-1">Meets criteria for 50%+ required skills</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Applications</span>
                  <Briefcase className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">{applications.length} Active</div>
                <p className="text-[11px] text-slate-500 mt-1">Submitted to partner employers</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Interviews</span>
                  <Calendar className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">{interviews.length} Scheduled</div>
                <p className="text-[11px] text-slate-500 mt-1">Upcoming rounds with recruiters</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Missing Skills</span>
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">{allMissingSkills.length} Key Gaps</div>
                <p className="text-[11px] text-slate-500 mt-1">Target these via training courses</p>
              </div>
            </div>

            {/* Upcoming Interviews Alert Card */}
            {interviews.length > 0 && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-amber-700" />
                    <h3 className="font-bold text-sm text-amber-900">Upcoming Interview Scheduled</h3>
                  </div>
                  <span className="text-[11px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded font-semibold">
                    Round 1
                  </span>
                </div>
                {interviews.map(inv => (
                  <div key={inv.id} className="bg-white p-4 rounded-xl border border-amber-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{inv.job_title} at {inv.company_name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Scheduled on <strong>{new Date(inv.scheduled_at).toLocaleDateString()}</strong> at {new Date(inv.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({inv.duration_minutes} mins)
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">Interviewer: {inv.interviewer_name}</p>
                    </div>
                    {inv.meeting_link_or_address && (
                      <a
                        href={inv.meeting_link_or_address}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 shrink-0"
                      >
                        <Video className="w-3.5 h-3.5" /> Join Video Interview
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Two Column Layout: Actionable Checklist & Top Matched Vacancies */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Onboarding & Readiness Checklist */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900">Recommended Next Steps</h3>
                  <span className="text-xs text-indigo-600 font-semibold">{cvScoreData.score}% Complete</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${student.skills.length >= 4 ? 'text-emerald-600' : 'text-slate-300'}`} />
                    <div className="text-xs">
                      <div className="font-semibold text-slate-800">Add Technical Skills</div>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        {student.skills.length >= 4 ? `Added ${student.skills.length} skills to your portfolio.` : 'Add at least 4 in-demand technical skill tags to boost job matches.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${student.cv_name ? 'text-emerald-600' : 'text-slate-300'}`} />
                    <div className="text-xs">
                      <div className="font-semibold text-slate-800">Upload & Verify CV Document</div>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        {student.cv_name ? `Attached: ${student.cv_name}` : 'Upload your PDF CV so recruiters can download and review your experience.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${enrolments.length > 0 ? 'text-emerald-600' : 'text-slate-300'}`} />
                    <div className="text-xs">
                      <div className="font-semibold text-slate-800">Enrol in Missing-Skill Course</div>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        {enrolments.length > 0 ? `Enrolled in ${enrolments[0].course_title} (${enrolments[0].progress_percent}% progress).` : 'Bridge identified missing skills (e.g. Power BI) via partner skill centres.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${programmeEnrolment?.fee_paid ? 'text-emerald-600' : 'text-slate-300'}`} />
                    <div className="text-xs">
                      <div className="font-semibold text-slate-800">Activate Placement Assistance (₹5k/₹2k Refund)</div>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        {programmeEnrolment?.fee_paid ? 'Enrolled in 6-month placement support with ₹2,000 conditional refund.' : 'Unlock guaranteed interview opportunities and refund eligibility.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Matched Jobs Preview */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900">Top Vacancy Matches</h3>
                  {hasUploadedCV && (
                    <button onClick={() => setActiveTab('jobs')} className="text-xs text-indigo-600 font-semibold hover:underline">
                      View All ({matchedJobs.length})
                    </button>
                  )}
                </div>

                {!hasUploadedCV ? (
                  <div className="p-6 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
                    <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-700">No Matched Jobs Yet</p>
                    <p className="text-[11px] text-slate-500">Upload your CV to calculate your scores and unlock matching vacancies.</p>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className="mt-2 px-3.5 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Upload CV Document
                    </button>
                  </div>
                ) : matchedJobs.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                    No active jobs matching your profile yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {matchedJobs.slice(0, 3).map(({ job, matchScore, missingSkills }) => (
                      <div key={job.id} className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 transition-colors flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-xs text-slate-900">{job.title}</h4>
                          <div className="text-[11px] text-slate-500 mt-0.5">{job.company_name} • {job.location}</div>
                          {missingSkills.length > 0 && (
                            <div className="text-[10px] text-rose-600 mt-1">
                              Missing: {missingSkills.join(', ')}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-black text-indigo-600">{matchScore}%</div>
                          <button
                            onClick={() => setActiveTab('jobs')}
                            className="mt-1 text-[11px] text-indigo-600 font-semibold hover:underline"
                          >
                            View Job →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: PROFILE & CV MANAGEMENT */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            
            {/* CV Parse & Upload Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900">CV & Document Extraction</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Upload your latest CV in PDF or DOCX format. Our engine automatically parses technical skills into your profile.
                  </p>
                </div>

                <label className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm flex items-center gap-2 self-start shrink-0">
                  <Upload className="w-4 h-4" />
                  <span>{isParsingCV ? 'Extracting Skills...' : 'Upload CV Document'}</span>
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleSimulateCVUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {cvSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold mb-4 border border-emerald-200">
                  {cvSuccessMsg}
                </div>
              )}

              {student.cv_name ? (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-2 text-slate-700 font-medium truncate">
                    <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="truncate">Current CV: <strong>{student.cv_name}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-100 px-2 py-0.5 rounded">
                      Verified Active
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveCV}
                      className="px-2.5 py-1 text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 hover:border-rose-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                      title="Remove uploaded CV"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove CV</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold">No CV uploaded yet.</span>
                    <p className="text-[11px] text-amber-700 mt-0.5">
                      Upload your CV document above in PDF or DOCX format to extract skills, compute your CV score, and see matched vacancies.
                    </p>
                  </div>
                </div>
              )}

              {/* Privacy Consent Toggle */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-slate-800 block">Employer Data Sharing Consent</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Allow verified recruiters on SkillBridge to view your contact profile and match results.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={student.share_profile_with_employers}
                    onChange={(e) => {
                      const updated = dataService.updateStudentProfile(student.id, {
                        share_profile_with_employers: e.target.checked
                      });
                      if (updated) setStudent(updated);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>

            {/* Skills Tag Management */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Your Technical Skills Portfolio</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    These skills directly calculate your Job Match Score across vacancies.
                  </p>
                </div>
              </div>

              {/* Skills Pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                {student.skills.map((skill) => (
                  <SkillBadge
                    key={skill}
                    skill={skill}
                    onRemove={() => handleRemoveSkill(skill)}
                  />
                ))}
              </div>

              {/* Add Custom Skill */}
              <div className="flex gap-2 max-w-md pt-2">
                <input
                  type="text"
                  placeholder="Add a new skill (e.g. Power BI, React, Python)..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(newSkill.trim());
                    }
                  }}
                  className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill(newSkill.trim())}
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Add Skill
                </button>
              </div>

              {/* Suggested quick skills */}
              <div className="pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Popular in-demand skills to add:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Power BI', 'Data Visualisation', 'Tableau', 'TypeScript', 'Git', 'B2B Sales', 'Financial Modeling'].map(s => (
                    !student.skills.includes(s) && (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleAddSkill(s)}
                        className="px-2 py-0.5 text-[11px] bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-md border border-slate-200 text-slate-600 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> {s}
                      </button>
                    )
                  ))}
                </div>
              </div>
            </div>

            {/* Profile Fields Details */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-slate-900">Career & Academic Profile</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Career Path</label>
                  <select
                    value={student.preferred_career_path}
                    onChange={(e) => {
                      const updated = dataService.updateStudentProfile(student.id, { preferred_career_path: e.target.value });
                      if (updated) setStudent(updated);
                    }}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                  >
                    <option>Data Analyst</option>
                    <option>Software Developer</option>
                    <option>Sales Executive</option>
                    <option>Accountant</option>
                    <option>Customer Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Current Location</label>
                  <input
                    type="text"
                    value={student.location}
                    onChange={(e) => {
                      const updated = dataService.updateStudentProfile(student.id, { location: e.target.value });
                      if (updated) setStudent(updated);
                    }}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Bio / Pitch</label>
                  <textarea
                    rows={3}
                    value={student.bio || ''}
                    onChange={(e) => {
                      const updated = dataService.updateStudentProfile(student.id, { bio: e.target.value });
                      if (updated) setStudent(updated);
                    }}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* CV Completeness Breakdown */}
            <div className="bg-slate-100 rounded-3xl p-6 border border-slate-200 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                CV Score Breakdown ({hasUploadedCV ? `${cvScoreData.score} / 100` : 'Pending CV Upload'})
              </h4>
              {!hasUploadedCV ? (
                <div className="bg-white p-5 rounded-2xl border border-slate-200 text-xs text-slate-500">
                  Upload your CV in the document section above to view your personalized score breakdown across technical skills, contact verification, academic history, and career alignment.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {cvScoreData.breakdown.map((item, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>{item.label}</span>
                        <span>{item.score}/{item.max}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">{item.tip}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 3: MATCHED JOBS & APPLICATIONS */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Vacancies Matched to Your Profile</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {hasUploadedCV && student.skills.length > 0 
                    ? `Calculated against your verified skills: ${student.skills.join(', ')}`
                    : 'Upload your CV to calculate job matches tailored to your profile.'
                  }
                </p>
              </div>
            </div>

            {!hasUploadedCV ? (
              <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm text-center max-w-xl mx-auto space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 mx-auto flex items-center justify-center">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Upload Your CV to Unlock Matched Jobs</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Job match scores, readiness ratings, and skill alignment are computed directly from your uploaded resume document.
                </p>
                <div className="pt-2">
                  <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md shadow-indigo-600/20 transition-all">
                    <Upload className="w-4 h-4" />
                    <span>{isParsingCV ? 'Extracting Skills...' : 'Upload CV Document Now'}</span>
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={handleSimulateCVUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ) : matchedJobs.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800">No Matched Jobs Found</h4>
                <p className="text-xs text-slate-500">
                  None of the active vacancies currently meet your skills profile. Try adding more skills in the CV & Profile tab.
                </p>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700"
                >
                  Manage Skills & Profile
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {matchedJobs.map(({ job, matchScore, possessedSkills, missingSkills, eligibilityMet, explanation }) => {
                  const userApp = applications.find(a => a.job_id === job.id);

                  return (
                    <div key={job.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-lg font-bold text-slate-900">{job.title}</h4>
                            <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded">
                              {job.category}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            <strong>{job.company_name}</strong> • {job.location} ({job.work_mode}) • {job.experience_level} level
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                          <div className={`text-2xl font-black ${
                            matchScore >= 75 ? 'text-emerald-600' : matchScore >= 50 ? 'text-indigo-600' : 'text-amber-600'
                          }`}>
                            {matchScore}%
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            Job Match Score
                          </span>
                        </div>
                      </div>

                      {/* Skill Comparison Breakdown */}
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="font-bold text-emerald-800 text-[11px] block mb-1">
                            Skills You Possess ({possessedSkills.length}):
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {possessedSkills.length > 0 ? (
                              possessedSkills.map(s => <SkillBadge key={s} skill={s} variant="matched" />)
                            ) : (
                              <span className="text-slate-400 text-[11px]">None recorded</span>
                            )}
                          </div>
                        </div>

                        <div>
                          <span className="font-bold text-rose-800 text-[11px] block mb-1">
                            Missing Skills for this Vacancy ({missingSkills.length}):
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {missingSkills.length > 0 ? (
                              missingSkills.map(s => <SkillBadge key={s} skill={s} variant="missing" />)
                            ) : (
                              <span className="text-emerald-600 text-[11px] font-medium flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> 100% matched!
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Application Status / Apply Action */}
                      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <p className="text-[10px] text-slate-400 max-w-md">
                          {explanation}
                        </p>

                        {userApp ? (
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">Status:</span>
                            <StatusBadge status={userApp.status} />
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              dataService.createApplication({
                                job_id: job.id,
                                job_title: job.title,
                                company_id: job.company_id,
                                company_name: job.company_name,
                                student_id: student.id,
                                student_name: student.full_name,
                                student_email: student.email,
                                student_phone: student.phone,
                                education: `${student.education_level} (${student.graduation_year})`,
                                cv_url: student.cv_url,
                                match_score: matchScore,
                                missing_skills: missingSkills,
                                possessed_skills: possessedSkills,
                                status: 'applied',
                                recruiter_notes: 'Applied from matched jobs tab.'
                              });
                              alert(`Application submitted to ${job.company_name}!`);
                            }}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition-colors"
                          >
                            Submit Application
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SKILL-GAP ANALYSIS */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-slate-900">Aggregate Skill-Gap Diagnostics</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                By cross-referencing your profile with live employer listings in <strong>{student.preferred_career_path}</strong>, we have identified these priority missing competencies. Enrolling in courses below directly increases your interview qualification score.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {allMissingSkills.map(skill => {
                  const matchingCourses = allCourses.filter(c => c.skills_taught.includes(skill));

                  return (
                    <div key={skill} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900">{skill}</span>
                        <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          Identified Gap
                        </span>
                      </div>
                      
                      {matchingCourses.length > 0 ? (
                        <div className="space-y-2">
                          <span className="text-[11px] text-slate-500 font-medium block">
                            Recommended Course to Bridge Gap:
                          </span>
                          <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                            <div>
                              <div className="font-bold text-xs text-slate-900">{matchingCourses[0].title}</div>
                              <div className="text-[10px] text-slate-400">By {matchingCourses[0].centre_name} • ₹{matchingCourses[0].price}</div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setActiveTab('courses')}
                              className="text-xs font-bold text-indigo-600 hover:underline"
                            >
                              Explore →
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">Self-study resources available in knowledge base.</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ENROLLED COURSES */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Enrolled Training & Upskilling</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track course progress and lesson completions from partner skill centres.
                </p>
              </div>
              <button
                onClick={() => navigate('/courses')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm"
              >
                Browse Marketplace
              </button>
            </div>

            {enrolments.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-slate-200">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="font-bold text-slate-800 text-base">No active course enrolments</h4>
                <p className="text-xs text-slate-500 mt-1">Explore our accredited courses to bridge missing skills.</p>
                <button
                  onClick={() => navigate('/courses')}
                  className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg"
                >
                  Explore Course Marketplace
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrolments.map(enr => {
                  const course = allCourses.find(c => c.id === enr.course_id);

                  return (
                    <div key={enr.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                            {enr.status.replace('_', ' ')}
                          </span>
                          <h4 className="font-bold text-base text-slate-900 mt-1.5">{enr.course_title}</h4>
                          <div className="text-xs text-slate-500 mt-0.5">Enrolled on {new Date(enr.enrolled_at).toLocaleDateString()}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-black text-indigo-600">{enr.progress_percent}%</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full transition-all"
                          style={{ width: `${enr.progress_percent}%` }}
                        ></div>
                      </div>

                      {/* Lessons Completed List */}
                      {course && (
                        <div className="space-y-1.5 pt-2">
                          <div className="text-xs font-semibold text-slate-700">
                            Completed Lessons ({enr.completed_lessons.length} / {course.syllabus.length}):
                          </div>
                          {course.syllabus.map((lesson) => {
                            const isDone = enr.completed_lessons.includes(lesson.id);
                            return (
                              <div
                                key={lesson.id}
                                className={`p-2 rounded-lg text-xs flex items-center justify-between border ${
                                  isDone ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-100 text-slate-600'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className={`w-3.5 h-3.5 ${isDone ? 'text-emerald-600' : 'text-slate-300'}`} />
                                  <span>{lesson.title}</span>
                                </div>
                                <span className="text-[10px] text-slate-400">{lesson.duration_minutes}m</span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        {enr.certificate_issued ? (
                          <span className="text-xs text-emerald-700 font-bold flex items-center gap-1.5">
                            <Award className="w-4 h-4 text-emerald-600" /> Certificate Verified
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">Complete all lessons for verified certificate</span>
                        )}

                        <button
                          type="button"
                          onClick={() => navigate('/courses')}
                          className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                        >
                          Open Course Player →
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: PLACEMENT ASSISTANCE & REFUND (₹5,000 / ₹2,000) */}
        {activeTab === 'placement' && (
          <div className="space-y-6">
            
            {/* Programme Status Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Placement Guarantee Framework
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">
                    Individual Placement Programme Status
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Structured placement assistance with ₹2,000 conditional refund upon verified hiring.
                  </p>
                </div>

                {!programmeEnrolment?.fee_paid && (
                  <button
                    type="button"
                    onClick={() => setIsPaymentOpen(true)}
                    className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all self-start"
                  >
                    Enrol in Programme (₹5,000)
                  </button>
                )}
              </div>

              {/* Status Details */}
              {programmeEnrolment?.fee_paid ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-400 uppercase font-semibold text-[10px]">Current Stage</span>
                      <div className="mt-1 font-bold text-slate-900 capitalize">
                        {programmeEnrolment.stage.replace(/_/g, ' ')}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase font-semibold text-[10px]">Interviews Logged</span>
                      <div className="mt-1 font-bold text-slate-900">
                        {programmeEnrolment.interviews_attended_count} / {programmeEnrolment.max_interviews_allowed} Used
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase font-semibold text-[10px]">Assistance Window</span>
                      <div className="mt-1 font-bold text-slate-900">
                        Until {new Date(programmeEnrolment.assistance_valid_until).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase font-semibold text-[10px]">Conditional Refund</span>
                      <div className="mt-1 font-bold text-emerald-600">
                        ₹{programmeEnrolment.refund_amount} ({programmeEnrolment.refund_status})
                      </div>
                    </div>
                  </div>

                  {/* 10-Stage Lifecycle Visualizer */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
                      Placement & Refund Progress Tracker
                    </h4>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                      {[
                        { key: 'enrolled', label: '1. Enrolled (₹5k Paid)' },
                        { key: 'interview_scheduled', label: '2. Interview Set' },
                        { key: 'interview_attended', label: '3. Interview Done' },
                        { key: 'selected_by_employer', label: '4. Selected' },
                        { key: 'offer_received', label: '5. Offer Issued' },
                        { key: 'offer_accepted', label: '6. Offer Accepted' },
                        { key: 'placement_verified', label: '7. Verified Placement' },
                        { key: 'refund_eligible', label: '8. Refund Eligible' },
                        { key: 'refund_requested', label: '9. Claim Under Review' },
                        { key: 'refund_paid', label: '10. ₹2,000 Refund Paid' }
                      ].map((step, idx) => {
                        const isReached = true; // Simplified for visual
                        const isCurrent = programmeEnrolment.stage === step.key;

                        return (
                          <div
                            key={step.key}
                            className={`p-2.5 rounded-xl border text-center transition-all ${
                              isCurrent
                                ? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-md scale-105'
                                : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}
                          >
                            <span className="text-[10px] block opacity-80">Step {idx + 1}</span>
                            <span className="text-[11px] font-semibold">{step.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Refund Action Card */}
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-emerald-700" />
                        <h4 className="font-bold text-sm text-emerald-900">
                          ₹2,000 Conditional Placement Refund
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                        Status: {programmeEnrolment.refund_status.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-emerald-800 leading-relaxed">
                      Whenever you receive an offer or selection confirmation from a partner company, you can claim your ₹2,000 refund directly here.
                    </p>

                    {programmeEnrolment.refund_status === 'paid' ? (
                      <div className="p-3 bg-white rounded-xl border border-emerald-300 text-xs text-emerald-900 font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Refund of ₹2,000 processed! Transaction Ref: {programmeEnrolment.refund_transaction_id}</span>
                      </div>
                    ) : programmeEnrolment.refund_status === 'requested' ? (
                      <div className="p-3 bg-white rounded-xl border border-amber-300 text-xs text-amber-900 font-semibold flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>Your refund claim is under review by the Platform Administrator.</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleClaimRefund}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
                      >
                        Submit ₹2,000 Refund Claim
                      </button>
                    )}
                  </div>

                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
                  <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto" />
                  <h4 className="font-bold text-base text-slate-800">You are not yet enrolled in the placement assistance programme.</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Pay the one-time ₹5,000 assistance fee to receive curated skills mapping, partner employer interviews, and qualify for the ₹2,000 conditional refund upon hiring.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsPaymentOpen(true)}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md"
                  >
                    Enrol Now (₹5,000)
                  </button>
                </div>
              )}

            </div>

          </div>
        )}

        {/* Sandbox Payment Modal */}
        <PaymentModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          title="Placement Assistance Programme Enrolment"
          amount={5000}
          purpose="placement_programme"
          description="Placement assistance fee with ₹2,000 conditional refund upon verified hiring"
          onSuccess={() => {
            dataService.enrolInPlacementProgramme(student, 'sandbox_demo');
            refreshData();
          }}
        />

      </div>
    </div>
  );
};
