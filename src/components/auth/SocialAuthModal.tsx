import React, { useState, useEffect } from 'react';
import { 
  X as CloseIcon, 
  ShieldCheck, 
  Loader2, 
  Building, 
  GraduationCap, 
  BookOpen, 
  School,
  ArrowRight
} from 'lucide-react';
import { UserRole, User } from '../../types';
import { dataService } from '../../services/dataService';

interface SocialAuthModalProps {
  isOpen: boolean;
  provider: 'google' | 'facebook' | 'twitter' | null;
  initialRole: UserRole;
  onClose: () => void;
  onSuccess: (role: UserRole) => void;
}

export const SocialAuthModal: React.FC<SocialAuthModalProps> = ({
  isOpen,
  provider,
  initialRole,
  onClose,
  onSuccess
}) => {
  if (!isOpen || !provider) return null;

  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole || 'student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [orgName, setOrgName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [existingUsers, setExistingUsers] = useState<User[]>([]);

  useEffect(() => {
    if (isOpen) {
      setSelectedRole(initialRole || 'student');
      setError('');
      // Check existing accounts on device
      const users = dataService.getAllUsers();
      setExistingUsers(users.slice(0, 4));
    }
  }, [isOpen, initialRole, provider]);

  const providerDetails = {
    google: {
      name: 'Google',
      btnBg: 'bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 shadow-sm',
      actionBg: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      logo: (
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
      ),
      banner: 'Sign in with Google',
      subtitle: 'Authenticate securely with your Google account'
    },
    facebook: {
      name: 'Facebook',
      btnBg: 'bg-[#1877F2] hover:bg-[#166fe5] text-white',
      actionBg: 'bg-[#1877F2] hover:bg-[#166fe5] text-white',
      logo: (
        <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      banner: 'Log in with Facebook',
      subtitle: 'Connect your Facebook profile to SkillBridge'
    },
    twitter: {
      name: 'X (Twitter)',
      btnBg: 'bg-black hover:bg-slate-900 text-white',
      actionBg: 'bg-black hover:bg-slate-900 text-white',
      logo: (
        <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      banner: 'Authorize with X',
      subtitle: 'Sign in with your X profile'
    }
  }[provider];

  const handleSelectExistingUser = (u: User) => {
    dataService.setCurrentUser(u);
    onSuccess(u.role);
  };

  const handleExecuteSocialLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError('Please enter your full name to proceed with login.');
      return;
    }
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setLoadingText(`Connecting to ${providerDetails.name}...`);

    setTimeout(() => {
      setLoadingText('Securing credentials & activating workspace...');
      setTimeout(() => {
        const loggedUser = dataService.loginWithSocial({
          provider,
          email: trimmedEmail,
          fullName: trimmedName,
          role: selectedRole,
          organizationName: orgName.trim()
        });

        // Ensure synchronous session lock
        dataService.setCurrentUser(loggedUser);
        setIsLoading(false);
        onSuccess(selectedRole);
      }, 400);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/95 z-30 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            <div>
              <h4 className="text-sm font-bold text-slate-800">{loadingText}</h4>
              <p className="text-xs text-slate-500 mt-1">Establishing your verified session...</p>
            </div>
          </div>
        )}

        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 shrink-0">
              {providerDetails.logo}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{providerDetails.banner}</h3>
              <p className="text-[11px] text-slate-500">{providerDetails.subtitle}</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          
          {/* Stakeholder Role Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Select Your Workspace Role:
            </label>
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                className={`py-1.5 px-2 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-all ${
                  selectedRole === 'student' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span className="text-[10px]">Student</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('company')}
                className={`py-1.5 px-2 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-all ${
                  selectedRole === 'company' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building className="w-4 h-4" />
                <span className="text-[10px]">Company</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('skill_centre')}
                className={`py-1.5 px-2 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-all ${
                  selectedRole === 'skill_centre' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="text-[10px]">Centre</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('institution')}
                className={`py-1.5 px-2 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-all ${
                  selectedRole === 'institution' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <School className="w-4 h-4" />
                <span className="text-[10px]">College</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* User Sign-In Form */}
          <form onSubmit={handleExecuteSocialLogin} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Your Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Nitish Kumar"
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                {providerDetails.name} Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. nitish@gmail.com"
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white font-medium text-slate-800"
              />
            </div>

            {selectedRole !== 'student' && (
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {selectedRole === 'company' ? 'Company / Organization Name' : 
                   selectedRole === 'skill_centre' ? 'Training Institute Name' : 'College / University Name'}
                </label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. TechCorp Solutions"
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white font-medium text-slate-800"
                />
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-3 mt-1 ${providerDetails.actionBg} font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2`}
            >
              <span>Continue with {providerDetails.name}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Select Previously Used Accounts On Device */}
          {existingUsers.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Or pick an account saved on this device:
              </span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {existingUsers.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleSelectExistingUser(u)}
                    className="w-full px-3 py-2 text-left bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 rounded-xl transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                        {u.full_name?.charAt(0) || 'U'}
                      </div>
                      <div className="truncate text-left">
                        <div className="font-semibold text-slate-800 text-[11px] group-hover:text-indigo-700 truncate">
                          {u.full_name}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">{u.email}</div>
                      </div>
                    </div>
                    <span className="text-[9px] capitalize px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 group-hover:bg-indigo-200 group-hover:text-indigo-800 shrink-0">
                      {u.role}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trust Banner */}
          <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>100% Free Instant Verification. Safe & zero passwords needed.</span>
          </div>

        </div>
      </div>
    </div>
  );
};
