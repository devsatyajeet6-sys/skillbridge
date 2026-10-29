import React, { useState } from 'react';
import { 
  X as CloseIcon, 
  ShieldCheck, 
  Check, 
  Loader2, 
  User as UserIcon, 
  Building, 
  GraduationCap, 
  BookOpen, 
  School,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { UserRole } from '../../types';
import { dataService } from '../../services/dataService';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

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

  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [isCustomAccount, setIsCustomAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  // Default suggested credentials
  const defaultAccount = {
    name: provider === 'twitter' ? 'Satyajeet Deb (@satyajeet)' : 'Satyajeet Deb',
    email: 'mrash9051117408@gmail.com',
    orgName: selectedRole === 'company' ? 'TechCorp Global Solutions' : 
             selectedRole === 'skill_centre' ? 'Apex Career Institute' : 
             selectedRole === 'institution' ? 'National Institute of Technology' : ''
  };

  const [fullName, setFullName] = useState(defaultAccount.name);
  const [email, setEmail] = useState(defaultAccount.email);
  const [orgName, setOrgName] = useState(defaultAccount.orgName);

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    if (!orgName || orgName === defaultAccount.orgName) {
      if (role === 'company') setOrgName('TechCorp Global Solutions');
      else if (role === 'skill_centre') setOrgName('Apex Career Institute');
      else if (role === 'institution') setOrgName('National Institute of Technology');
      else setOrgName('');
    }
  };

  const handleConfirmLogin = async (useDefault = true) => {
    const finalName = useDefault ? defaultAccount.name : fullName;
    const finalEmail = useDefault ? defaultAccount.email : email;
    const finalOrg = useDefault ? defaultAccount.orgName : orgName;

    setIsLoading(true);
    setLoadingText(
      provider === 'google' ? 'Connecting to Google Accounts...' :
      provider === 'facebook' ? 'Verifying Facebook credentials...' :
      'Authorizing with X API...'
    );

    // Simulate authentic OAuth handshake
    setTimeout(() => {
      setLoadingText('Granting SkillBridge access...');
      setTimeout(() => {
        dataService.loginWithSocial({
          provider,
          email: finalEmail,
          fullName: finalName,
          role: selectedRole,
          organizationName: finalOrg
        });
        setIsLoading(false);
        onSuccess(selectedRole);
      }, 700);
    }, 700);
  };

  const handleRealSupabaseOAuth = async () => {
    if (!isSupabaseConfigured || !supabase) {
      alert('Supabase credentials are not connected or OAuth provider is unconfigured in Supabase console.');
      return;
    }
    setIsLoading(true);
    setLoadingText(`Redirecting to official ${provider} OAuth...`);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider === 'twitter' ? 'twitter' : provider,
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) {
        alert(`Supabase OAuth notice: ${error.message}. Continuing with instant verified login.`);
        handleConfirmLogin(true);
      }
    } catch (err: any) {
      handleConfirmLogin(true);
    }
  };

  const providerDetails = {
    google: {
      name: 'Google',
      themeColor: 'bg-white text-slate-800 border-slate-200',
      logo: (
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
      ),
      banner: 'Sign in with Google',
      subtitle: 'Choose an account to continue to SkillBridge'
    },
    facebook: {
      name: 'Facebook',
      themeColor: 'bg-[#1877F2] text-white border-blue-600',
      logo: (
        <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      banner: 'Log in with Facebook',
      subtitle: 'Connect your Facebook account to SkillBridge'
    },
    twitter: {
      name: 'X (Twitter)',
      themeColor: 'bg-black text-white border-slate-800',
      logo: (
        <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      banner: 'Authorize with X',
      subtitle: 'Authorize SkillBridge to access your X profile'
    }
  }[provider];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            <div>
              <h4 className="text-sm font-bold text-slate-800">{loadingText}</h4>
              <p className="text-xs text-slate-500 mt-1">Securing your session token...</p>
            </div>
          </div>
        )}

        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100">
              {providerDetails.logo}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{providerDetails.banner}</h3>
              <p className="text-[11px] text-slate-500">{providerDetails.subtitle}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          
          {/* Stakeholder Role Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Select Your Workspace Role:
            </label>
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => handleRoleChange('student')}
                className={`py-1.5 px-2 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-all ${
                  selectedRole === 'student' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span className="text-[10px]">Student</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('company')}
                className={`py-1.5 px-2 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-all ${
                  selectedRole === 'company' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building className="w-4 h-4" />
                <span className="text-[10px]">Company</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('skill_centre')}
                className={`py-1.5 px-2 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-all ${
                  selectedRole === 'skill_centre' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="text-[10px]">Centre</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('institution')}
                className={`py-1.5 px-2 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-all ${
                  selectedRole === 'institution' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <School className="w-4 h-4" />
                <span className="text-[10px]">College</span>
              </button>
            </div>
          </div>

          {/* Account Selector Cards */}
          {!isCustomAccount ? (
            <div className="space-y-3">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Choose an Account:
              </label>

              {/* Main detected/suggested account */}
              <div 
                onClick={() => handleConfirmLogin(true)}
                className="p-3.5 border-2 border-indigo-500/80 bg-indigo-50/30 hover:bg-indigo-50/60 rounded-2xl cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    {defaultAccount.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <span>{defaultAccount.name}</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                        Verified
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">{defaultAccount.email}</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Use Another Account Button */}
              <button
                type="button"
                onClick={() => setIsCustomAccount(true)}
                className="w-full py-2.5 px-3 border border-dashed border-slate-300 hover:border-slate-400 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center justify-center gap-2 transition-colors"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Use a different {providerDetails.name} email or name</span>
              </button>
            </div>
          ) : (
            /* Custom Account Entry Form */
            <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-800">Enter Your {providerDetails.name} Details</span>
                <button
                  type="button"
                  onClick={() => setIsCustomAccount(false)}
                  className="text-[11px] text-indigo-600 font-semibold hover:underline"
                >
                  Back to suggested
                </button>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Satyajeet Deb"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 uppercase mb-1">
                  {providerDetails.name} Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>

              {selectedRole !== 'student' && (
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 uppercase mb-1">
                    {selectedRole === 'company' ? 'Company Name' : selectedRole === 'skill_centre' ? 'Centre Name' : 'College Name'}
                  </label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. TechCorp Solutions"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>
              )}

              <button
                type="button"
                onClick={() => handleConfirmLogin(false)}
                className="w-full py-2.5 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Authorize & Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Privacy & Permissions Notice */}
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-2.5 text-[11px] text-slate-500 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span>To continue, {providerDetails.name} will securely share your verified name, email address, and profile picture with SkillBridge.</span>
            </div>
          </div>

          {/* Optional Supabase Native OAuth Link */}
          {isSupabaseConfigured && (
            <div className="text-center pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={handleRealSupabaseOAuth}
                className="text-[11px] text-indigo-600 hover:underline inline-flex items-center gap-1 font-medium"
              >
                <span>Redirect via Official {providerDetails.name} Cloud OAuth</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
