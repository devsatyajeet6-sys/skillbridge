import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Building, 
  IndianRupee, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Filter, 
  X, 
  ArrowRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { Job, StudentProfile } from '../types';
import { SkillBadge } from '../components/common/SkillBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { calculateJobMatch } from '../utils/matchingEngine';

export const JobsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedMode, setSelectedMode] = useState<string>('All');
  const [selectedExp, setSelectedExp] = useState<string>('All');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applySuccessMsg, setApplySuccessMsg] = useState('');

  const currentUser = dataService.getCurrentUser();
  const student = currentUser?.role === 'student' ? dataService.getStudentByUserId(currentUser.id) : null;
  const allJobs = dataService.getAllJobs().filter(j => j.moderation_status === 'approved' && j.is_active);
  const allCourses = dataService.getAllCourses();
  const studentApplications = student ? dataService.getApplicationsForStudent(student.id) : [];

  const categories = ['All', 'Data Analyst', 'Software Developer', 'Sales Executive', 'Accountant', 'Customer Support'];

  const filteredJobs = useMemo(() => {
    return allJobs.filter(job => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.required_skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = selectedCategory === 'All' || job.category === selectedCategory;
      const matchesMode = selectedMode === 'All' || job.work_mode === selectedMode;
      const matchesExp = selectedExp === 'All' || job.experience_level === selectedExp;

      return matchesSearch && matchesCat && matchesMode && matchesExp;
    });
  }, [allJobs, searchQuery, selectedCategory, selectedMode, selectedExp]);

  const handleApply = (job: Job) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (currentUser.role !== 'student' || !student) {
      alert('Please switch to a Student account to apply for job vacancies.');
      return;
    }

    // Check if already applied
    const alreadyApplied = studentApplications.some(a => a.job_id === job.id);
    if (alreadyApplied) {
      alert('You have already applied for this position.');
      return;
    }

    setIsApplying(true);
    setTimeout(() => {
      const match = calculateJobMatch(student, job, allCourses);
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
        match_score: match.matchScore,
        missing_skills: match.missingSkills,
        possessed_skills: match.possessedSkills,
        status: 'applied',
        recruiter_notes: 'Applied via SkillBridge marketplace.'
      });

      // Send notification to company
      const company = dataService.getCompanyById(job.company_id);
      if (company) {
        dataService.sendNotification({
          user_id: company.user_id,
          title: `New Applicant: ${student.full_name}`,
          message: `${student.full_name} applied for ${job.title} with a ${match.matchScore}% Match Score.`,
          type: 'application_update',
          link: '/company/applicants'
        });
      }

      setIsApplying(false);
      setApplySuccessMsg(`Application successfully submitted to ${job.company_name}!`);
      setTimeout(() => setApplySuccessMsg(''), 4000);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Job Marketplace
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Browse verified opportunities from partner employers with transparent skill matching.
          </p>
        </div>

        {/* Global Success Notification */}
        {applySuccessMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{applySuccessMsg}</span>
            </div>
            <Link to="/student" className="font-semibold underline text-xs">
              View in Dashboard
            </Link>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search job title, company, or skills (e.g. SQL, React, Python)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="All">All Work Modes</option>
                <option value="remote">Remote Only</option>
                <option value="hybrid">Hybrid</option>
                <option value="on_site">On-Site</option>
              </select>

              <select
                value={selectedExp}
                onChange={(e) => setSelectedExp(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="All">All Experience</option>
                <option value="entry">Entry Level / Graduate</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior</option>
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Jobs Listing Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>Showing <strong>{filteredJobs.length}</strong> matching vacancies</span>
              {student && (
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Match score calculated for {student.full_name}
                </span>
              )}
            </div>

            {filteredJobs.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No vacancies match your filters</h3>
                <p className="text-xs text-slate-500 mt-1">Try resetting keywords or selecting "All" categories.</p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedMode('All'); }}
                  className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg hover:bg-indigo-100"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              filteredJobs.map((job) => {
                const isSelected = selectedJob?.id === job.id;
                const matchResult = student ? calculateJobMatch(student, job, allCourses) : null;
                const isApplied = studentApplications.some(a => a.job_id === job.id);

                return (
                  <div
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                      isSelected ? 'border-indigo-600 ring-2 ring-indigo-500/20' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 shrink-0 overflow-hidden">
                          {job.company_logo ? (
                            <img src={job.company_logo} alt={job.company_name} className="w-full h-full object-cover" />
                          ) : (
                            job.company_name.slice(0, 2).toUpperCase()
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-base hover:text-indigo-600 transition-colors">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <span className="font-semibold text-slate-700">{job.company_name}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                            <span>•</span>
                            <span className="capitalize">{job.work_mode.replace('_', ' ')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Match Score Badge */}
                      {matchResult && (
                        <div className="text-right shrink-0">
                          <div className={`text-base font-black ${
                            matchResult.matchScore >= 75 ? 'text-emerald-600' : matchResult.matchScore >= 50 ? 'text-indigo-600' : 'text-amber-600'
                          }`}>
                            {matchResult.matchScore}%
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium">Job Match</div>
                        </div>
                      )}
                    </div>

                    {/* Salary & Details */}
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                      {job.salary_min && job.salary_max && (
                        <div className="flex items-center gap-1 font-semibold text-slate-900 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                          <IndianRupee className="w-3.5 h-3.5 text-slate-600" />
                          <span>₹{(job.salary_min / 100000).toFixed(1)}L - ₹{(job.salary_max / 100000).toFixed(1)}L / yr</span>
                        </div>
                      )}
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 capitalize">
                        {job.experience_level} Level
                      </span>
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-medium">
                        {job.category}
                      </span>
                    </div>

                    {/* Skill Pills */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {job.required_skills.map((skill) => {
                        const isPossessed = matchResult?.possessedSkills.includes(skill);
                        return (
                          <SkillBadge
                            key={skill}
                            skill={skill}
                            variant={matchResult ? (isPossessed ? 'matched' : 'missing') : 'default'}
                          />
                        );
                      })}
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Posted {new Date(job.created_at).toLocaleDateString()}
                      </span>
                      {isApplied ? (
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Already Applied
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApply(job);
                          }}
                          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors shadow-sm"
                        >
                          Apply Now
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Detail Pane */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              {selectedJob ? (
                <div className="space-y-5">
                  <div className="border-b border-slate-100 pb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {selectedJob.category}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 mt-2">{selectedJob.title}</h2>
                    <div className="text-xs font-semibold text-slate-700 mt-1">{selectedJob.company_name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{selectedJob.location} ({selectedJob.work_mode})</div>
                  </div>

                  {/* Skill-Gap Analysis Card if Student */}
                  {student && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">Job Match Analysis</span>
                        {(() => {
                          const m = calculateJobMatch(student, selectedJob, allCourses);
                          return (
                            <span className="text-xs font-black text-indigo-600">
                              {m.matchScore}% Match
                            </span>
                          );
                        })()}
                      </div>

                      {(() => {
                        const m = calculateJobMatch(student, selectedJob, allCourses);
                        return (
                          <>
                            {m.missingSkills.length > 0 ? (
                              <div>
                                <div className="text-[11px] font-semibold text-rose-700 mb-1">
                                  Missing Skills for this Role ({m.missingSkills.length}):
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {m.missingSkills.map(s => (
                                    <SkillBadge key={s} skill={s} variant="missing" />
                                  ))}
                                </div>
                                {m.recommendedCourses.length > 0 && (
                                  <div className="mt-3 p-2.5 bg-indigo-50/60 rounded-lg border border-indigo-100 text-xs">
                                    <div className="font-semibold text-indigo-900 text-[11px] mb-1">
                                      Recommended Training:
                                    </div>
                                    <div className="font-medium text-slate-800 text-xs">
                                      {m.recommendedCourses[0].title}
                                    </div>
                                    <div className="text-[10px] text-slate-500 mt-0.5">
                                      By {m.recommendedCourses[0].centre_name}
                                    </div>
                                    <Link
                                      to="/courses"
                                      className="text-[11px] text-indigo-600 font-bold hover:underline block mt-1"
                                    >
                                      View Course Syllabus →
                                    </Link>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-xs text-emerald-700 font-medium flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4" /> You possess 100% of required skills!
                              </div>
                            )}

                            <p className="text-[10px] text-slate-400 leading-tight">
                              {m.explanation}
                            </p>
                          </>
                        );
                      })()}
                    </div>
                  )}

                  {/* Description */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">About The Role</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{selectedJob.description}</p>
                  </div>

                  {/* Responsibilities */}
                  {selectedJob.responsibilities?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Key Responsibilities</h4>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {selectedJob.responsibilities.map((r, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-indigo-600 font-bold">•</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Requirements */}
                  {selectedJob.requirements?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Requirements</h4>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {selectedJob.requirements.map((req, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-teal-600 font-bold">•</span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Apply Action in Drawer */}
                  <div className="pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      disabled={isApplying}
                      onClick={() => handleApply(selectedJob)}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      {isApplying ? 'Submitting Application...' : 'Apply for this Position'}
                    </button>
                    <p className="text-[11px] text-slate-400 text-center mt-2">
                      Your profile and verified CV will be securely shared with {selectedJob.company_name}.
                    </p>
                  </div>

                </div>
              ) : (
                <div className="text-center py-16 text-slate-400">
                  <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-xs font-medium text-slate-600">Select a vacancy to preview job description, skill gaps, and employer requirements.</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
