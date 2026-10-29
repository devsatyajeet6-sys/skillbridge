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

  const [socialRole, setSocialRole] = useState<UserRole>('student');

  const handleSocialLogin = (provider: 'google' | 'facebook' | 'twitter') => {
    const user = dataService.loginWithSocial(provider, socialRole);
    redirectToDashboard(user.role);
  };

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
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
        
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
          <h2 className="text-xl font-bold text-slate-900">Sign in to SkillBridge</h2>
          <p className="text-xs text-slate-500 mt-1">
            Free instant login with your Google, Facebook, or X (Twitter) account.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Free Social Single-Sign-On */}
        <div className="space-y-2.5">
          {/* Role selector for social login */}
          <div className="flex items-center justify-between p-1 bg-slate-100 rounded-xl text-xs">
            <span className="text-[11px] font-semibold text-slate-500 pl-2">Sign in as:</span>
            <div className="flex items-center gap-1">
              {(['student', 'company', 'skill_centre', 'institution'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSocialRole(r)}
                  className={`px-2.5 py-1 rounded-lg font-medium capitalize text-[11px] transition-all ${
                    socialRole === r
                      ? 'bg-white text-indigo-600 shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {r === 'skill_centre' ? 'Centre' : r === 'institution' ? 'College' : r}
                </button>
              ))}
            </div>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={() => handleSocialLogin('google')}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-3 transition-all shadow-sm hover:shadow"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Facebook Button */}
          <button
            type="button"
            onClick={() => handleSocialLogin('facebook')}
            className="w-full py-2.5 px-4 rounded-xl border border-blue-600 bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold text-xs flex items-center justify-center gap-3 transition-all shadow-sm"
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Continue with Facebook</span>
          </button>

          {/* Twitter (X) Button */}
          <button
            type="button"
            onClick={() => handleSocialLogin('twitter')}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-900 bg-black hover:bg-slate-900 text-white font-semibold text-xs flex items-center justify-center gap-3 transition-all shadow-sm"
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>Continue with X (Twitter)</span>
          </button>
        </div>

        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-slate-400 font-semibold">Or with password</span>
          </div>
        </div>

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
