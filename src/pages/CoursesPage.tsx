import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  Star, 
  Video, 
  MapPin, 
  CheckCircle2, 
  PlayCircle, 
  Search, 
  IndianRupee, 
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { Course, CourseLesson } from '../types';
import { SkillBadge } from '../components/common/SkillBadge';
import { PaymentModal } from '../components/common/PaymentModal';

export const CoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState<string>('All');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<CourseLesson | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [courseToPay, setCourseToPay] = useState<Course | null>(null);

  const currentUser = dataService.getCurrentUser();
  const student = currentUser?.role === 'student' ? dataService.getStudentByUserId(currentUser.id) : null;
  const allCourses = dataService.getAllCourses().filter(c => c.moderation_status === 'approved');
  const enrolments = student ? dataService.getEnrolmentsForStudent(student.id) : [];

  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.centre_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.skills_taught.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMode = selectedMode === 'All' || course.delivery_mode === selectedMode;

    return matchesSearch && matchesMode;
  });

  const handleEnrolClick = (course: Course) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (currentUser.role !== 'student' || !student) {
      alert('Please switch to a Student account to enrol in training courses.');
      return;
    }

    // Check if free or already enrolled
    const isEnrolled = enrolments.some(e => e.course_id === course.id);
    if (isEnrolled) {
      setSelectedCourse(course);
      if (course.syllabus.length > 0) setActiveLesson(course.syllabus[0]);
      return;
    }

    if (course.price === 0) {
      dataService.enrolInCourse(student.id, student.full_name, course.id, course.title, 'paid');
      alert(`Enrolled successfully in ${course.title}!`);
      return;
    }

    setCourseToPay(course);
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = () => {
    if (student && courseToPay) {
      dataService.enrolInCourse(student.id, student.full_name, courseToPay.id, courseToPay.title, 'paid');
      dataService.sendNotification({
        user_id: student.user_id,
        title: 'Course Enrolment Confirmed',
        message: `You are now enrolled in ${courseToPay.title} with full syllabus access.`,
        type: 'course',
        link: '/student/courses'
      });
      setSelectedCourse(courseToPay);
      if (courseToPay.syllabus.length > 0) setActiveLesson(courseToPay.syllabus[0]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Accredited Training Marketplace
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Courses delivered by approved partner skill centres specifically targeting in-demand industry skills.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search courses, skills, or training academies (e.g. Power BI, React, B2B Sales)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="All">All Delivery Modes</option>
            <option value="recorded">Recorded Self-Paced</option>
            <option value="live_online">Live Online Cohort</option>
            <option value="offline">Offline Campus Classes</option>
          </select>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredCourses.map((course) => {
            const isEnrolled = enrolments.some(e => e.course_id === course.id);
            const userEnrolment = enrolments.find(e => e.course_id === course.id);

            return (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                {/* Course Header Banner */}
                <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-5 text-white relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                      {course.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{course.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-base leading-snug line-clamp-2">{course.title}</h3>
                  <div className="text-xs text-slate-300 mt-1">Provider: {course.centre_name}</div>
                </div>

                {/* Course Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Skills Taught */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Skills Taught
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {course.skills_taught.map(s => (
                        <SkillBadge key={s} skill={s} />
                      ))}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{course.duration_weeks} Weeks ({course.duration_hours} hrs)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {course.delivery_mode === 'recorded' && <Video className="w-3.5 h-3.5 text-indigo-500" />}
                      {course.delivery_mode === 'live_online' && <PlayCircle className="w-3.5 h-3.5 text-emerald-500" />}
                      {course.delivery_mode === 'offline' && <MapPin className="w-3.5 h-3.5 text-amber-500" />}
                      <span className="capitalize">{course.delivery_mode.replace('_', ' ')}</span>
                    </div>
                  </div>

                  {/* Progress bar if enrolled */}
                  {userEnrolment && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                        <span>Course Progress</span>
                        <span>{userEnrolment.progress_percent}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full transition-all"
                          style={{ width: `${userEnrolment.progress_percent}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Price & CTA */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Course Fee</span>
                      <div className="text-base font-black text-slate-900">
                        {course.price > 0 ? `₹${course.price.toLocaleString('en-IN')}` : 'Free'}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCourse(course);
                          if (course.syllabus.length > 0) setActiveLesson(course.syllabus[0]);
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        Syllabus
                      </button>

                      {isEnrolled ? (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCourse(course);
                            if (course.syllabus.length > 0) setActiveLesson(course.syllabus[0]);
                          }}
                          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors flex items-center gap-1"
                        >
                          <PlayCircle className="w-3.5 h-3.5" /> Continue
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleEnrolClick(course)}
                          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
                        >
                          {course.price > 0 ? 'Enrol Now' : 'Enrol Free'}
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Syllabus / Lesson Viewer Modal */}
        {selectedCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-100">
              
              {/* Modal Header */}
              <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                    {selectedCourse.category} • {selectedCourse.centre_name}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{selectedCourse.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                >
                  ✕
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-3">
                
                {/* Video / Preview Area */}
                <div className="md:col-span-2 p-6 bg-slate-950 text-white flex flex-col">
                  {activeLesson ? (
                    <div className="space-y-4">
                      <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-800 relative">
                        <iframe
                          src={activeLesson.video_url}
                          title={activeLesson.title}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                      <div>
                        <span className="text-xs text-indigo-400 font-semibold">Current Lesson</span>
                        <h4 className="text-base font-bold text-white mt-0.5">{activeLesson.title}</h4>
                        <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" /> {activeLesson.duration_minutes} Minutes
                        </div>
                      </div>

                      {/* Mark Lesson Complete Button if Student */}
                      {student && enrolments.some(e => e.course_id === selectedCourse.id) && (
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              const enr = enrolments.find(e => e.course_id === selectedCourse.id);
                              if (enr) {
                                dataService.updateLessonProgress(enr.id, activeLesson.id, selectedCourse.syllabus.length);
                              }
                            }}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Mark Lesson as Completed
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-slate-500 text-xs">
                      Select a module from the syllabus to view video lecture.
                    </div>
                  )}

                  {/* Offline location if applicable */}
                  {selectedCourse.delivery_mode === 'offline' && selectedCourse.offline_location && (
                    <div className="mt-6 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                      <div className="font-bold text-amber-400 flex items-center gap-1.5 mb-1">
                        <MapPin className="w-4 h-4" /> Offline Campus Location:
                      </div>
                      <p>{selectedCourse.offline_location}</p>
                      {selectedCourse.offline_schedule && (
                        <p className="mt-1 text-slate-400">Schedule: {selectedCourse.offline_schedule}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Syllabus Modules List */}
                <div className="md:col-span-1 p-5 bg-white border-l border-slate-200 overflow-y-auto max-h-[60vh] space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                      Course Syllabus ({selectedCourse.syllabus.length} Modules)
                    </h4>
                    <div className="space-y-2">
                      {selectedCourse.syllabus.map((lesson, idx) => {
                        const isCurrent = activeLesson?.id === lesson.id;
                        return (
                          <div
                            key={lesson.id}
                            onClick={() => setActiveLesson(lesson)}
                            className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                              isCurrent
                                ? 'bg-indigo-50 border-indigo-500 font-semibold text-indigo-900'
                                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] text-slate-400 font-mono">Module 0{idx + 1}</span>
                              <span className="text-[10px] text-slate-500">{lesson.duration_minutes}m</span>
                            </div>
                            <div className="line-clamp-2">{lesson.title}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Prerequisites */}
                  {selectedCourse.prerequisites?.length > 0 && (
                    <div className="pt-3 border-t border-slate-100 text-xs text-slate-600">
                      <span className="font-bold text-slate-800 block mb-1">Prerequisites:</span>
                      <ul className="list-disc list-inside space-y-1 text-[11px]">
                        {selectedCourse.prerequisites.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Outcomes */}
                  {selectedCourse.learning_outcomes?.length > 0 && (
                    <div className="pt-3 border-t border-slate-100 text-xs text-slate-600">
                      <span className="font-bold text-slate-800 block mb-1">Learning Outcomes:</span>
                      <ul className="space-y-1 text-[11px]">
                        {selectedCourse.learning_outcomes.map((out, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{out}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                </div>

              </div>

            </div>
          </div>
        )}

        {/* Payment Modal */}
        {courseToPay && (
          <PaymentModal
            isOpen={isPaymentOpen}
            onClose={() => {
              setIsPaymentOpen(false);
              setCourseToPay(null);
            }}
            title={`Enrol in ${courseToPay.title}`}
            amount={courseToPay.price}
            purpose="course_fee"
            description={`Course fee payable to ${courseToPay.centre_name}`}
            onSuccess={handlePaymentSuccess}
          />
        )}

      </div>
    </div>
  );
};
