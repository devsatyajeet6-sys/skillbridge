import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { UserRole } from '../../types';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const users = dataService.getAllUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      setError('No account found with this email. Please try a demo account below or register.');
      return;
    }

    if (user.status === 'suspended') {
      setError('This account has been suspended by an administrator. Please contact support.');
      return;
    }

    if (user.status === 'pending') {
      setError('Your enterprise account is currently pending administrative verification. Please check back shortly.');
      return;
    }

    dataService.setCurrentUser(user);
    redirectToDashboard(user.role);
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    const user = dataService.loginAsPersona(role);
    if (user) {
      redirectToDashboard(role);
    }
  };

  const redirectToDashboard = (role: UserRole) => {
    switch (role) {
      case 'student': navigate('/student'); break;
      case 'company': navigate('/company'); break;
      case 'skill_centre': navigate('/skillcentre'); break;
      case 'institution': navigate('/institution'); break;
      case 'admin': navigate('/admin'); break;
      default: navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
        
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Skill<span className="text-indigo-600">Bridge</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-slate-900">Sign in to your account</h2>
          <p className="text-xs text-slate-500 mt-1">
            Access your skilling dashboard, job applications, or recruiter portal.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <a href="#" onClick={(e) => { e.preventDefault(); alert('Password reset link simulated: Enter any demo password to log in.'); }} className="text-xs text-indigo-600 hover:underline">
                Forgot?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Persona Logins */}
        <div className="pt-6 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Instant Demo Logins (1-Click)</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('student')}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-left font-medium text-slate-700 transition-colors"
            >
              <div className="font-bold text-slate-900">Student</div>
              <div className="text-[10px] text-slate-400 truncate">Rahul Sharma</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('company')}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-left font-medium text-slate-700 transition-colors"
            >
              <div className="font-bold text-slate-900">Company HR</div>
              <div className="text-[10px] text-slate-400 truncate">TechCorp Solutions</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('skill_centre')}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-left font-medium text-slate-700 transition-colors"
            >
              <div className="font-bold text-slate-900">Skill Centre</div>
              <div className="text-[10px] text-slate-400 truncate">Apex Tech Academy</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('institution')}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-left font-medium text-slate-700 transition-colors"
            >
              <div className="font-bold text-slate-900">College TPO</div>
              <div className="text-[10px] text-slate-400 truncate">National Inst. of Tech</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin')}
              className="col-span-2 p-2.5 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-left font-medium text-rose-900 transition-colors flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-rose-900">Platform Administrator</div>
                <div className="text-[10px] text-rose-700">Audit logs, approvals, refunds & system config</div>
              </div>
              <ShieldCheck className="w-5 h-5 text-rose-600 shrink-0" />
            </button>
          </div>
        </div>

        {/* Register Footer */}
        <div className="text-center text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-indigo-600 hover:underline">
            Register here
          </Link>
        </div>

      </div>
    </div>
  );
};
