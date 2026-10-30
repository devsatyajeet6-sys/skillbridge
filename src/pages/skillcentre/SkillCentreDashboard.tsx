import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Users, 
  Plus, 
  Video, 
  Star, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  IndianRupee,
  Award,
  Calendar,
  Sparkles
} from 'lucide-react';
import { dataService, subscribeToDataChanges } from '../../services/dataService';
import { SkillCentre, Course, CourseEnrolment, CourseLesson } from '../../types';
import { SkillBadge } from '../../components/common/SkillBadge';
import { StatusBadge } from '../../components/common/StatusBadge';

export const SkillCentreDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'students' | 'builder'>('overview');
  
  const currentUser = dataService.getCurrentUser();
  const [centre, setCentre] = useState<SkillCentre | null>(() => {
    if (!currentUser) return dataService.getAllSkillCentres()[0] || null;
    return dataService.getSkillCentreByUserId(currentUser.id) || null;
  });

  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolments, setEnrolments] = useState<CourseEnrolment[]>([]);

  // Course Builder Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Data Analytics');
  const [skillsTaught, setSkillsTaught] = useState('Power BI, DAX, Data Visualisation');
  const [durationWeeks, setDurationWeeks] = useState(6);
  const [durationHours, setDurationHours] = useState(36);
  const [deliveryMode, setDeliveryMode] = useState<'recorded' | 'live_online' | 'offline'>('recorded');
  const [price, setPrice] = useState(2499);
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/embed/AGrl-H87pRU');
  const [offlineLocation, setOfflineLocation] = useState('Apex Campus, Koramangala, Bengaluru');

  const refreshData = () => {
    const user = dataService.getCurrentUser();
    const sc = user ? (dataService.getSkillCentreByUserId(user.id) || null) : (dataService.getAllSkillCentres()[0] || null);
    setCentre(sc);
    if (sc) {
      const myCourses = dataService.getAllCourses().filter(c => c.centre_id === sc.id);
      setCourses(myCourses);
      const allEnr = dataService.getAllEnrolments().filter(e => myCourses.some(mc => mc.id === e.course_id));
      setEnrolments(allEnr);
    }
  };

  useEffect(() => {
    refreshData();
    const unsub = subscribeToDataChanges(refreshData);
    return unsub;
  }, []);

  if (!centre) {
    return (
      <div className="min-h-screen p-8 text-center bg-slate-50">
        <h2 className="text-xl font-bold text-slate-800">No Skill Centre Profile Linked</h2>
        <p className="text-xs text-slate-500 mt-2">Please switch persona to "Skill Centre (Apex Academy)".</p>
      </div>
    );
  }

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = skillsTaught.split(',').map(s => s.trim()).filter(Boolean);

    const defaultLessons: CourseLesson[] = [
      { id: `mod-${Date.now()}-1`, title: 'Module 1: Foundations & Architecture', duration_minutes: 45, video_url: videoUrl, is_preview: true, order: 1 },
      { id: `mod-${Date.now()}-2`, title: 'Module 2: Practical Implementation & Workflows', duration_minutes: 60, video_url: videoUrl, is_preview: false, order: 2 },
      { id: `mod-${Date.now()}-3`, title: 'Capstone Project & Industry Submission', duration_minutes: 90, video_url: videoUrl, is_preview: false, order: 3 },
    ];

    dataService.createCourse({
      centre_id: centre.id,
      centre_name: centre.centre_name,
      title,
      description: description || `Certified industry upskilling course in ${title} delivered by ${centre.centre_name}.`,
      category,
      skills_taught: skillsArray,
      duration_weeks: Number(durationWeeks),
      duration_hours: Number(durationHours),
      delivery_mode: deliveryMode,
      language: 'English',
      price: Number(price),
      syllabus: defaultLessons,
      prerequisites: ['Basic introductory background in computing'],
      learning_outcomes: ['Industry-level technical execution', 'Capstone project for candidate CV'],
      video_preview_url: videoUrl,
      offline_location: deliveryMode === 'offline' ? offlineLocation : undefined,
      moderation_status: 'approved'
    });

    setTitle('');
    setDescription('');
    setActiveTab('courses');
    alert('Course created and published to marketplace!');
  };

  const handleIssueCertificate = (enrolmentId: string) => {
    dataService.updateEnrolment(enrolmentId, {
      certificate_issued: true,
      certificate_url: `/demo-resumes/cert-${enrolmentId}.pdf`,
      progress_percent: 100,
      status: 'completed',
      completed_at: new Date().toISOString()
    });
    refreshData();
    alert('Verified Certificate of Completion issued to candidate!');
  };

  const totalLearners = enrolments.length;
  const totalRevenue = courses.reduce((acc, c) => acc + (c.enrolled_count * c.price), 0);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-600 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-amber-600/20 overflow-hidden shrink-0">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">{centre.centre_name}</h1>
                <StatusBadge status={centre.verification_status} />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {centre.location} • Commission: {centre.commission_rate}% • Email: {centre.contact_email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('builder')}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Create Course
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
            Centre Performance
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'courses' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            Course Catalogue ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'students' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            Enrolled Students ({enrolments.length})
          </button>
          <button
            onClick={() => setActiveTab('builder')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'builder' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            Course Builder
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Courses</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{courses.length} Live</div>
                <p className="text-[11px] text-slate-500 mt-0.5">Accredited modules</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-400">Learners Enrolled</span>
                <div className="text-2xl font-black text-indigo-600 mt-1">{totalLearners} Active</div>
                <p className="text-[11px] text-slate-500 mt-0.5">Bridging career skill gaps</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-400">Average Rating</span>
                <div className="text-2xl font-black text-amber-500 mt-1 flex items-center gap-1">
                  <Star className="w-5 h-5 fill-current" /> 4.9
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">Student course reviews</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-400">Est. Course Revenue</span>
                <div className="text-2xl font-black text-emerald-600 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</div>
                <p className="text-[11px] text-slate-500 mt-0.5">Prior to platform share</p>
              </div>
            </div>

            {/* Quick Actions & Recent Enrolments */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900">Recent Student Enrolments</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="p-3">Student</th>
                      <th className="p-3">Course</th>
                      <th className="p-3">Progress</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Enrolled Date</th>
                      <th className="p-3">Credential</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {enrolments.map(enr => (
                      <tr key={enr.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-semibold text-slate-900">{enr.student_name}</td>
                        <td className="p-3 text-slate-600">{enr.course_title}</td>
                        <td className="p-3 font-bold text-indigo-600">{enr.progress_percent}%</td>
                        <td className="p-3"><StatusBadge status={enr.status} size="sm" /></td>
                        <td className="p-3 text-slate-500">{new Date(enr.enrolled_at).toLocaleDateString()}</td>
                        <td className="p-3">
                          {enr.certificate_issued ? (
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Issued
                            </span>
                          ) : (
                            <button
                              onClick={() => handleIssueCertificate(enr.id)}
                              className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded font-semibold"
                            >
                              Verify & Issue
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

        {/* TAB 2: COURSE CATALOGUE */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Your Published Courses</h3>
                <p className="text-xs text-slate-500 mt-0.5">Manage syllabi, delivery modes, and pricing.</p>
              </div>
              <button
                onClick={() => setActiveTab('builder')}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-sm"
              >
                + Add Course
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map(course => (
                <div key={course.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        {course.category}
                      </span>
                      <h4 className="font-bold text-base text-slate-900 mt-1.5">{course.title}</h4>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {course.duration_weeks} Weeks • {course.delivery_mode.replace('_', ' ')} • ₹{course.price}
                      </div>
                    </div>
                    <StatusBadge status={course.moderation_status} size="sm" />
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">{course.description}</p>

                  <div className="flex flex-wrap gap-1">
                    {course.skills_taught.map(s => <SkillBadge key={s} skill={s} />)}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">
                      {course.enrolled_count} Learners Enrolled
                    </span>
                    <span className="text-slate-400">
                      {course.syllabus.length} Syllabus Modules
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ENROLLED STUDENTS */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-slate-900">Student Enrolments & Completion Records</h3>
              <p className="text-xs text-slate-500">Track module completion and authorize skill completion credentials.</p>

              <div className="space-y-3">
                {enrolments.map(enr => (
                  <div key={enr.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{enr.student_name}</h4>
                      <div className="text-xs text-slate-500 mt-0.5">Enrolled in: {enr.course_title}</div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Completed: {enr.completed_lessons.length} lessons • Progress: {enr.progress_percent}%
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <StatusBadge status={enr.status} />
                      {enr.certificate_issued ? (
                        <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-lg">
                          Credential Verified
                        </span>
                      ) : (
                        <button
                          onClick={() => handleIssueCertificate(enr.id)}
                          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-sm"
                        >
                          Approve Completion
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: COURSE BUILDER */}
        {activeTab === 'builder' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Create & Publish a New Course</h3>
              <p className="text-xs text-slate-500 mt-0.5">List a certified upskilling module targeting industry skill gaps.</p>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Executive Power BI & DAX Modeling"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                  >
                    <option>Data Analytics</option>
                    <option>Software Engineering</option>
                    <option>Sales & Marketing</option>
                    <option>Finance & Accounting</option>
                    <option>Operations & Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Delivery Mode</label>
                  <select
                    value={deliveryMode}
                    onChange={(e: any) => setDeliveryMode(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                  >
                    <option value="recorded">Recorded Self-Paced</option>
                    <option value="live_online">Live Online Cohort</option>
                    <option value="offline">Offline Campus Classes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Skills Taught (comma separated)</label>
                <input
                  type="text"
                  required
                  value={skillsTaught}
                  onChange={(e) => setSkillsTaught(e.target.value)}
                  placeholder="Power BI, Data Visualisation, DAX"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Weeks</label>
                  <input
                    type="number"
                    value={durationWeeks}
                    onChange={(e) => setDurationWeeks(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Total Hours</label>
                  <input
                    type="number"
                    value={durationHours}
                    onChange={(e) => setDurationHours(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Recorded Video Link (Embed URL)</label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/embed/..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {deliveryMode === 'offline' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Campus Physical Location</label>
                  <input
                    type="text"
                    value={offlineLocation}
                    onChange={(e) => setOfflineLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Course Description & Syllabus Highlights</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe prerequisites and expected outcomes..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('courses')}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Publish Course Listing
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
