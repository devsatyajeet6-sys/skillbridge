import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Briefcase, 
  BookOpen, 
  Building, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { UserRole } from '../../types';
import { SocialAuthModal } from '../../components/auth/SocialAuthModal';
import { validateEmail } from '../../utils/validation';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [activeSocialProvider, setActiveSocialProvider] = useState<'google' | 'facebook' | 'twitter' | null>(null);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);

  const handleOpenSocialModal = (provider: 'google' | 'facebook' | 'twitter') => {
    setActiveSocialProvider(provider);
    setIsSocialModalOpen(true);
  };
  
  // Common
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Student specific
  const [educationLevel, setEducationLevel] = useState('B.Tech');
  const [institutionName, setInstitutionName] = useState('National Institute of Technology');
  const [graduationYear, setGraduationYear] = useState(2025);
  const [careerPath, setCareerPath] = useState('Data Analyst');
  const [skillsText, setSkillsText] = useState('Excel, SQL, Communication');
  const [isMinor, setIsMinor] = useState(false);
  const [guardianConsent, setGuardianConsent] = useState(false);

  // Company specific
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('Technology & Software');
  const [companySize, setCompanySize] = useState('51-200');
  const [companyLocation, setCompanyLocation] = useState('Bengaluru');

  // Skill Centre specific
  const [centreName, setCentreName] = useState('');
  const [centreLocation, setCentreLocation] = useState('Bengaluru');

  // Institution specific
  const [instName, setInstName] = useState('');
  const [instType, setInstType] = useState<'school' | 'college' | 'university' | 'polytechnic'>('college');
  const [expectedStudents, setExpectedStudents] = useState(200);

  const [error, setError] = useState('');
  const [pendingApprovalMsg, setPendingApprovalMsg] = useState(false);

  const handleSocialRegister = (provider: 'google' | 'facebook' | 'twitter') => {
    const user = dataService.loginWithSocial(provider, selectedRole);
    if (['company', 'skill_centre', 'institution'].includes(user.role)) {
      setPendingApprovalMsg(true);
    } else {
      navigate('/student');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) {
      setError(emailCheck.error || 'Please enter a valid email address.');
      return;
    }

    if (selectedRole === 'student' && isMinor && !guardianConsent) {
      setError('Guardian consent is required for students under the age of 18.');
      return;
    }

    let extra: any = {};
    if (selectedRole === 'student') {
      const skillsArray = skillsText.split(',').map(s => s.trim()).filter(Boolean);
      extra = {
        education_level: educationLevel,
        institution_name: institutionName,
        graduation_year: graduationYear,
        preferred_career_path: careerPath,
        skills: skillsArray,
        is_minor: isMinor,
        guardian_consent_given: isMinor ? guardianConsent : true
      };
    } else if (selectedRole === 'company') {
      extra = {
        company_name: companyName || fullName,
        industry,
        company_size: companySize,
        location: companyLocation
      };
    } else if (selectedRole === 'skill_centre') {
      extra = {
        centre_name: centreName || fullName,
        location: centreLocation,
        training_categories: ['Data Analytics', 'Software Development']
      };
    } else if (selectedRole === 'institution') {
      extra = {
        institution_name: instName || fullName,
        institution_type: instType,
        student_count_expected: expectedStudents
      };
    }

    const res = dataService.registerUser({
      email,
      role: selectedRole,
      full_name: fullName,
      phone,
      extra
    });

    if (!res.success) {
      setError(res.message || 'Registration failed.');
      return;
    }

    if (['company', 'skill_centre', 'institution'].includes(selectedRole)) {
      setPendingApprovalMsg(true);
    } else {
      navigate('/student');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Skill<span className="text-indigo-600">Bridge</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-slate-900">Create your account</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Join the ecosystem connecting talent, employers, trainers, and educators.
          </p>
        </div>

        {/* Pending Approval Notice */}
        {pendingApprovalMsg ? (
          <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl text-center space-y-3">
            <Clock className="w-12 h-12 text-amber-600 mx-auto" />
            <h3 className="font-bold text-slate-900 text-lg">Application Submitted for Review</h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              To preserve ecosystem authenticity, all partner company, skill-centre, and institutional accounts undergo administrative review. You can log in via the Platform Administrator portal to approve this request immediately in demo mode.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                to="/admin"
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700"
              >
                Go to Admin Approval Queue
              </Link>
              <Link
                to="/login"
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Role Select Tabs */}
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                className={`py-2 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-all ${
                  selectedRole === 'student' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Student</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('company')}
                className={`py-2 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-all ${
                  selectedRole === 'company' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Company</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('skill_centre')}
                className={`py-2 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-all ${
                  selectedRole === 'skill_centre' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Skill Centre</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('institution')}
                className={`py-2 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-all ${
                  selectedRole === 'institution' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>College TPO</span>
              </button>
            </div>

            {/* Free Social 1-Click Registration */}
            <div className="space-y-2 pt-2">
              <div className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Or Fast 1-Click Free Sign Up
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenSocialModal('google')}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenSocialModal('facebook')}
                  className="py-2.5 px-3 rounded-xl border border-blue-600 bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Facebook</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenSocialModal('twitter')}
                  className="py-2.5 px-3 rounded-xl border border-slate-900 bg-black hover:bg-slate-900 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span>X (Twitter)</span>
                </button>
              </div>
            </div>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-slate-400 font-semibold">Or complete profile details</span>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                {error}
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    {selectedRole === 'company' ? 'Recruiter Contact Name' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    {selectedRole === 'company' ? 'Business Email' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Student Role Fields */}
              {selectedRole === 'student' && (
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Degree / Qualification</label>
                      <input
                        type="text"
                        value={educationLevel}
                        onChange={(e) => setEducationLevel(e.target.value)}
                        placeholder="B.Tech CSE"
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">College / Institute</label>
                      <input
                        type="text"
                        value={institutionName}
                        onChange={(e) => setInstitutionName(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Pass Year</label>
                      <input
                        type="number"
                        value={graduationYear}
                        onChange={(e) => setGraduationYear(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Career Path</label>
                    <select
                      value={careerPath}
                      onChange={(e) => setCareerPath(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                    >
                      <option>Data Analyst</option>
                      <option>Software Developer</option>
                      <option>Sales Executive</option>
                      <option>Accountant</option>
                      <option>Customer Support</option>
                      <option>Operations Executive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Current Technical Skills (comma separated)</label>
                    <input
                      type="text"
                      value={skillsText}
                      onChange={(e) => setSkillsText(e.target.value)}
                      placeholder="e.g. Python, SQL, Excel, React"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  {/* Minor consent checkbox */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isMinor}
                        onChange={(e) => setIsMinor(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>I am under 18 years of age (School / Junior College student)</span>
                    </label>

                    {isMinor && (
                      <label className="flex items-start gap-2 text-xs text-slate-600 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                        <input
                          type="checkbox"
                          required
                          checked={guardianConsent}
                          onChange={(e) => setGuardianConsent(e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                        />
                        <span>I confirm that my parent or legal guardian has provided consent for my participation and skill data processing on SkillBridge.</span>
                      </label>
                    )}
                  </div>
                </div>
              )}

              {/* Company Role Fields */}
              {selectedRole === 'company' && (
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Company Legal Name</label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Infosys Ltd."
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Industry</label>
                      <input
                        type="text"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Company Size</label>
                      <select
                        value={companySize}
                        onChange={(e) => setCompanySize(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                      >
                        <option>1-10 employees</option>
                        <option>11-50 employees</option>
                        <option>51-200 employees</option>
                        <option>201-1000 employees</option>
                        <option>1000+ employees</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Headquarters Location</label>
                      <input
                        type="text"
                        value={companyLocation}
                        onChange={(e) => setCompanyLocation(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Skill Centre Fields */}
              {selectedRole === 'skill_centre' && (
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Skill Centre Name</label>
                      <input
                        type="text"
                        required
                        value={centreName}
                        onChange={(e) => setCentreName(e.target.value)}
                        placeholder="Apex Learning Academy"
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Campus Location</label>
                      <input
                        type="text"
                        value={centreLocation}
                        onChange={(e) => setCentreLocation(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Institution Fields */}
              {selectedRole === 'institution' && (
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Institution Name</label>
                      <input
                        type="text"
                        required
                        value={instName}
                        onChange={(e) => setInstName(e.target.value)}
                        placeholder="National Institute of Technology"
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
                      <select
                        value={instType}
                        onChange={(e: any) => setInstType(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                      >
                        <option value="college">College</option>
                        <option value="university">University</option>
                        <option value="polytechnic">Polytechnic</option>
                        <option value="school">School</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Register as {selectedRole.replace('_', ' ')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </>
        )}

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-indigo-600 hover:underline">
            Sign In here
          </Link>
        </div>

      </div>

      {/* Interactive Social Authentication Dialog */}
      <SocialAuthModal
        isOpen={isSocialModalOpen}
        provider={activeSocialProvider}
        initialRole={selectedRole}
        onClose={() => setIsSocialModalOpen(false)}
        onSuccess={(role) => {
          setIsSocialModalOpen(false);
          if (role === 'student') navigate('/student');
          else if (role === 'company') navigate('/company');
          else if (role === 'skill_centre') navigate('/skillcentre');
          else if (role === 'institution') navigate('/institution');
          else navigate('/dashboard');
        }}
      />
    </div>
  );
};
