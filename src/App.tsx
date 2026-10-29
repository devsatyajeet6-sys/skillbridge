import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { JobsPage } from './pages/JobsPage';
import { CoursesPage } from './pages/CoursesPage';
import { PlacementProgrammePage } from './pages/PlacementProgrammePage';
import { TermsPolicyPage } from './pages/TermsPolicyPage';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { CompanyDashboard } from './pages/company/CompanyDashboard';
import { SkillCentreDashboard } from './pages/skillcentre/SkillCentreDashboard';
import { InstitutionDashboard } from './pages/institution/InstitutionDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UnifiedDashboardHub } from './pages/dashboard/UnifiedDashboardHub';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

export const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/placement-programme" element={<PlacementProgrammePage />} />
            <Route path="/terms-policy" element={<TermsPolicyPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Combined Master Dashboard Hub (All 5 Dashboards in One) */}
            <Route path="/dashboard" element={<UnifiedDashboardHub />} />

            {/* Role Dashboards with Protected Routes */}
            <Route
              path="/student/*"
              element={
                <ProtectedRoute allowedRoles={['student', 'admin']}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/company/*"
              element={
                <ProtectedRoute allowedRoles={['company', 'admin']}>
                  <CompanyDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/skillcentre/*"
              element={
                <ProtectedRoute allowedRoles={['skill_centre', 'admin']}>
                  <SkillCentreDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/institution/*"
              element={
                <ProtectedRoute allowedRoles={['institution', 'admin']}>
                  <InstitutionDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
