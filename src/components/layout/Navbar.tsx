import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  GraduationCap, 
  Briefcase, 
  BookOpen, 
  Building, 
  Shield, 
  Bell, 
  Check, 
  RotateCcw, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown,
  UserCheck,
  Layers
} from 'lucide-react';
import { dataService, subscribeToDataChanges } from '../../services/dataService';
import { User, Notification, UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<User | null>(dataService.getCurrentUser());
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const user = dataService.getCurrentUser();
      setCurrentUser(user);
      if (user) {
        setNotifications(dataService.getNotificationsForUser(user.id));
      } else {
        setNotifications([]);
      }
    };
    update();
    const unsub = subscribeToDataChanges(update);
    return unsub;
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleSwitchPersona = (role: UserRole) => {
    const switched = dataService.loginAsPersona(role);
    setIsPersonaOpen(false);
    if (switched) {
      if (role === 'student') navigate('/student');
      else if (role === 'company') navigate('/company');
      else if (role === 'skill_centre') navigate('/skillcentre');
      else if (role === 'institution') navigate('/institution');
      else if (role === 'admin') navigate('/admin');
    }
  };

  const handleLogout = () => {
    dataService.setCurrentUser(null);
    navigate('/login');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo data back to initial seeds? This will refresh student applications, jobs, and courses.')) {
      dataService.resetDemoData();
      navigate('/');
    }
  };

  const getDashboardPath = (role?: UserRole) => {
    return role ? `/dashboard?role=${role}` : '/dashboard';
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Skill<span className="text-indigo-600">Bridge</span>
                </span>
                <span className="block text-[10px] uppercase tracking-wider font-semibold text-slate-400 -mt-1">
                  Skills to Careers
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              <Link
                to="/jobs"
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === '/jobs' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Find Jobs
              </Link>
              <Link
                to="/courses"
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === '/courses' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Training Courses
              </Link>
              <Link
                to="/placement-programme"
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === '/placement-programme' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Placement Scheme (₹5k/₹2k)
              </Link>
              <Link
                to="/dashboard"
                className={`px-3 py-2 text-sm font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                  location.pathname.startsWith('/dashboard')
                    ? 'text-indigo-700 bg-indigo-100/80 ring-1 ring-indigo-300'
                    : 'text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100'
                }`}
              >
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>All Dashboards</span>
              </Link>
            </div>
          </div>

          {/* Right Action Icons & Persona Switcher */}
          <div className="hidden md:flex items-center space-x-3">
            
            {/* Quick Demo Persona Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsPersonaOpen(!isPersonaOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 transition-all shadow-sm"
              >
                <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Persona: <strong className="text-indigo-700 capitalize">{currentUser?.role || 'Guest'}</strong></span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isPersonaOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Test Persona
                  </div>
                  <button
                    onClick={() => handleSwitchPersona('student')}
                    className="w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-indigo-50 text-slate-700 hover:text-indigo-700"
                  >
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="font-semibold">Student (Rahul Sharma)</div>
                        <div className="text-[10px] text-slate-400">View jobs, match skills, ₹5k scheme</div>
                      </div>
                    </div>
                    {currentUser?.role === 'student' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </button>
                  <button
                    onClick={() => handleSwitchPersona('company')}
                    className="w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-indigo-50 text-slate-700 hover:text-indigo-700"
                  >
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-indigo-600" />
                      <div>
                        <div className="font-semibold">Company Recruiter (TechCorp)</div>
                        <div className="text-[10px] text-slate-400">Post jobs, ATS & interviews</div>
                      </div>
                    </div>
                    {currentUser?.role === 'company' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </button>
                  <button
                    onClick={() => handleSwitchPersona('skill_centre')}
                    className="w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-indigo-50 text-slate-700 hover:text-indigo-700"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-amber-600" />
                      <div>
                        <div className="font-semibold">Skill Centre (Apex Academy)</div>
                        <div className="text-[10px] text-slate-400">Course catalogue & lessons</div>
                      </div>
                    </div>
                    {currentUser?.role === 'skill_centre' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </button>
                  <button
                    onClick={() => handleSwitchPersona('institution')}
                    className="w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-indigo-50 text-slate-700 hover:text-indigo-700"
                  >
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="font-semibold">College TPO (NIT)</div>
                        <div className="text-[10px] text-slate-400">Batch management & CSV import</div>
                      </div>
                    </div>
                    {currentUser?.role === 'institution' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </button>
                  <button
                    onClick={() => handleSwitchPersona('admin')}
                    className="w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border-t border-slate-100"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-rose-600" />
                      <div>
                        <div className="font-semibold">Platform Administrator</div>
                        <div className="text-[10px] text-slate-400">Approvals, moderation, refunds</div>
                      </div>
                    </div>
                    {currentUser?.role === 'admin' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </button>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            {currentUser && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-800">Notifications ({unreadCount} unread)</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={() => currentUser && dataService.markAllNotificationsAsRead(currentUser.id)}
                          className="text-[11px] text-indigo-600 hover:underline font-medium"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-6 text-center text-xs text-slate-400">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.slice(0, 6).map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              dataService.markNotificationAsRead(n.id);
                              if (n.link) navigate(n.link);
                              setIsNotifOpen(false);
                            }}
                            className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition-colors ${
                              !n.is_read ? 'bg-indigo-50/40 font-medium' : 'text-slate-600'
                            }`}
                          >
                            <div className="font-semibold text-slate-900">{n.title}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{n.message}</div>
                            <div className="text-[10px] text-slate-400 mt-1">
                              {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Dashboard or Auth Button */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  to={getDashboardPath(currentUser.role)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-all shadow-sm"
                >
                  My Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleResetData}
                  title="Reset Demo Data"
                  className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}

          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/jobs"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700"
          >
            Find Jobs
          </Link>
          <Link
            to="/courses"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700"
          >
            Training Courses
          </Link>
          <Link
            to="/placement-programme"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700"
          >
            Placement Scheme (₹5k/₹2k)
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 px-3 text-sm font-bold text-indigo-700 bg-indigo-50 rounded-lg"
          >
            All Dashboards (Ecosystem Hub)
          </Link>

          <div className="pt-2 border-t border-slate-100">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Switch Role</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { handleSwitchPersona('student'); setIsMobileMenuOpen(false); }}
                className="text-left text-xs p-2 bg-slate-50 rounded border border-slate-200 font-medium"
              >
                👨‍🎓 Student
              </button>
              <button
                onClick={() => { handleSwitchPersona('company'); setIsMobileMenuOpen(false); }}
                className="text-left text-xs p-2 bg-slate-50 rounded border border-slate-200 font-medium"
              >
                🏢 Company
              </button>
              <button
                onClick={() => { handleSwitchPersona('skill_centre'); setIsMobileMenuOpen(false); }}
                className="text-left text-xs p-2 bg-slate-50 rounded border border-slate-200 font-medium"
              >
                🏫 Skill Centre
              </button>
              <button
                onClick={() => { handleSwitchPersona('institution'); setIsMobileMenuOpen(false); }}
                className="text-left text-xs p-2 bg-slate-50 rounded border border-slate-200 font-medium"
              >
                🏛️ College
              </button>
              <button
                onClick={() => { handleSwitchPersona('admin'); setIsMobileMenuOpen(false); }}
                className="text-left text-xs p-2 bg-rose-50 text-rose-800 rounded border border-rose-200 font-medium col-span-2"
              >
                🛡️ Platform Admin
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            {currentUser ? (
              <button
                onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                className="w-full text-center py-2 text-sm text-rose-600 font-semibold bg-rose-50 rounded-lg"
              >
                Sign Out ({currentUser.full_name})
              </button>
            ) : (
              <div className="flex w-full gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-1/2 text-center py-2 text-sm border border-slate-300 rounded-lg font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-1/2 text-center py-2 text-sm bg-indigo-600 text-white rounded-lg font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
