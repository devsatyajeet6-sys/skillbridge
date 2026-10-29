import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  GraduationCap, 
  Briefcase, 
  BookOpen, 
  Building, 
  Shield, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';
import { dataService, subscribeToDataChanges } from '../../services/dataService';
import { UserRole } from '../../types';
import { StudentDashboard } from '../student/StudentDashboard';
import { CompanyDashboard } from '../company/CompanyDashboard';
import { SkillCentreDashboard } from '../skillcentre/SkillCentreDashboard';
import { InstitutionDashboard } from '../institution/InstitutionDashboard';
import { AdminDashboard } from '../admin/AdminDashboard';

export const UnifiedDashboardHub: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRole = (searchParams.get('role') as UserRole) || dataService.getCurrentUser()?.role || 'student';

  const [activeRole, setActiveRole] = useState<UserRole>(initialRole);
  const [stats, setStats] = useState({
    studentSkills: 0,
    activeJobs: 0,
    accreditedCourses: 0,
    collegeBatches: 0,
    pendingRefunds: 0
  });

  const refreshStats = () => {
    const students = dataService.getAllStudents();
    const jobs = dataService.getAllJobs();
    const courses = dataService.getAllCourses();
    const batches = dataService.getAllBatches();
    const refunds = dataService.getAllProgrammeEnrolments().filter(r => r.refund_status === 'requested');

    setStats({
      studentSkills: students[0]?.skills.length || 0,
      activeJobs: jobs.filter(j => j.is_active).length,
      accreditedCourses: courses.filter(c => c.moderation_status === 'approved').length,
      collegeBatches: batches.length,
      pendingRefunds: refunds.length
    });
  };

  useEffect(() => {
    refreshStats();
    const unsub = subscribeToDataChanges(refreshStats);
    return unsub;
  }, []);

  const handleSelectRole = (role: UserRole) => {
    setActiveRole(role);
    setSearchParams({ role });
    dataService.loginAsPersona(role);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Master Ecosystem Hub Bar */}
      <div className="bg-slate-900 text-white border-b border-slate-800 sticky top-16 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Label & Quick Ecosystem Stats */}
          <div className="py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 text-xs">
            <div className="flex items-center gap-2 text-indigo-300 font-semibold">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Unified Ecosystem Workspace (Switch stakeholder view instantly):</span>
            </div>

            {/* Quick Live Counters across all 5 */}
            <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-300">
              <span className="flex items-center gap-1">
                👨‍🎓 Student: <strong>{stats.studentSkills} Skills</strong>
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1">
                🏢 Employer: <strong>{stats.activeJobs} Jobs</strong>
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1">
                🏫 Skill Centre: <strong>{stats.accreditedCourses} Courses</strong>
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1">
                🏛️ College: <strong>{stats.collegeBatches} Batches</strong>
              </span>
              {stats.pendingRefunds > 0 && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    🛡️ Admin: {stats.pendingRefunds} Refund Action
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Stakeholder Tabs */}
          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2">
            
            {/* Student Tab */}
            <button
              onClick={() => handleSelectRole('student')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeRole === 'student'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40 ring-2 ring-indigo-400/40'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>Student Workspace</span>
              <span className="text-[10px] opacity-75 font-normal hidden sm:inline">(Rahul Sharma)</span>
            </button>

            {/* Company Tab */}
            <button
              onClick={() => handleSelectRole('company')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeRole === 'company'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40 ring-2 ring-indigo-400/40'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <span>Company ATS Portal</span>
              <span className="text-[10px] opacity-75 font-normal hidden sm:inline">(TechCorp HR)</span>
            </button>

            {/* Skill Centre Tab */}
            <button
              onClick={() => handleSelectRole('skill_centre')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeRole === 'skill_centre'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40 ring-2 ring-indigo-400/40'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Skill Centre Hub</span>
              <span className="text-[10px] opacity-75 font-normal hidden sm:inline">(Apex Academy)</span>
            </button>

            {/* Institution Tab */}
            <button
              onClick={() => handleSelectRole('institution')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeRole === 'institution'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40 ring-2 ring-indigo-400/40'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Building className="w-4 h-4 text-blue-400" />
              <span>College TPO Portal</span>
              <span className="text-[10px] opacity-75 font-normal hidden sm:inline">(NIT Campus)</span>
            </button>

            {/* Administrator Tab */}
            <button
              onClick={() => handleSelectRole('admin')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeRole === 'admin'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/40 ring-2 ring-rose-400/40'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4 text-rose-400" />
              <span>Platform Super Admin</span>
              {stats.pendingRefunds > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              )}
            </button>

          </div>
        </div>
      </div>

      {/* Render Active Dashboard In-Place */}
      <div className="flex-1">
        {activeRole === 'student' && <StudentDashboard />}
        {activeRole === 'company' && <CompanyDashboard />}
        {activeRole === 'skill_centre' && <SkillCentreDashboard />}
        {activeRole === 'institution' && <InstitutionDashboard />}
        {activeRole === 'admin' && <AdminDashboard />}
      </div>

    </div>
  );
};
