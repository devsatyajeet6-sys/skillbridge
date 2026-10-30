import {
  User,
  StudentProfile,
  Company,
  SkillCentre,
  Institution,
  Job,
  Course,
  CourseEnrolment,
  Application,
  Interview,
  ProgrammeEnrolment,
  Batch,
  BatchStudentImportItem,
  PaymentRecord,
  Notification,
  AuditLog,
  PlatformConfig,
  UserRole
} from '../types';

import {
  INITIAL_USERS,
  INITIAL_STUDENTS,
  INITIAL_COMPANIES,
  INITIAL_SKILL_CENTRES,
  INITIAL_INSTITUTIONS,
  INITIAL_JOBS,
  INITIAL_COURSES,
  INITIAL_ENROLMENTS,
  INITIAL_APPLICATIONS,
  INITIAL_INTERVIEWS,
  INITIAL_PROGRAMME_ENROLMENTS,
  INITIAL_BATCHES,
  INITIAL_PAYMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_PLATFORM_CONFIG
} from './mockData';

const STORAGE_KEYS = {
  CURRENT_USER: 'skillbridge_current_user',
  USERS: 'skillbridge_users',
  STUDENTS: 'skillbridge_students',
  COMPANIES: 'skillbridge_companies',
  SKILL_CENTRES: 'skillbridge_skill_centres',
  INSTITUTIONS: 'skillbridge_institutions',
  JOBS: 'skillbridge_jobs',
  COURSES: 'skillbridge_courses',
  ENROLMENTS: 'skillbridge_enrolments',
  APPLICATIONS: 'skillbridge_applications',
  INTERVIEWS: 'skillbridge_interviews',
  PROGRAMME_ENROLMENTS: 'skillbridge_programme_enrolments',
  BATCHES: 'skillbridge_batches',
  PAYMENTS: 'skillbridge_payments',
  NOTIFICATIONS: 'skillbridge_notifications',
  AUDIT_LOGS: 'skillbridge_audit_logs',
  CONFIG: 'skillbridge_config',
  INITIALIZED: 'skillbridge_initialized_v1'
};

// Simple event bus for reactivity across components
type Listener = () => void;
const listeners = new Set<Listener>();

export const subscribeToDataChanges = (callback: Listener) => {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
};

const notifyChange = () => {
  listeners.forEach(fn => fn());
};

function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return defaultValue;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyChange();
  } catch (err) {
    console.error(`Error writing ${key} to storage:`, err);
  }
}

// Initialise storage if first time
export function initStorage(forceReset = false): void {
  if (forceReset || !localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(INITIAL_COMPANIES));
    localStorage.setItem(STORAGE_KEYS.SKILL_CENTRES, JSON.stringify(INITIAL_SKILL_CENTRES));
    localStorage.setItem(STORAGE_KEYS.INSTITUTIONS, JSON.stringify(INITIAL_INSTITUTIONS));
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(INITIAL_JOBS));
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(INITIAL_COURSES));
    localStorage.setItem(STORAGE_KEYS.ENROLMENTS, JSON.stringify(INITIAL_ENROLMENTS));
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
    localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify(INITIAL_INTERVIEWS));
    localStorage.setItem(STORAGE_KEYS.PROGRAMME_ENROLMENTS, JSON.stringify(INITIAL_PROGRAMME_ENROLMENTS));
    localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(INITIAL_BATCHES));
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(INITIAL_PAYMENTS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(INITIAL_PLATFORM_CONFIG));
    
    // Default current user to Student (Rahul Sharma)
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || forceReset) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
    }
    
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    notifyChange();
  }
}

// Automatically initialise on import
initStorage();

export const dataService = {
  // RESET DEMO DATA
  resetDemoData: () => {
    initStorage(true);
  },

  // CONFIG
  getConfig: (): PlatformConfig => {
    return getStorage<PlatformConfig>(STORAGE_KEYS.CONFIG, INITIAL_PLATFORM_CONFIG);
  },
  updateConfig: (newConfig: Partial<PlatformConfig>) => {
    const current = dataService.getConfig();
    const updated = { ...current, ...newConfig };
    setStorage(STORAGE_KEYS.CONFIG, updated);
    return updated;
  },

  // AUTH & CURRENT USER
  getCurrentUser: (): User | null => {
    return getStorage<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  },
  setCurrentUser: (user: User | null): void => {
    setStorage(STORAGE_KEYS.CURRENT_USER, user);
  },
  getAllUsers: (): User[] => {
    return getStorage<User[]>(STORAGE_KEYS.USERS, []);
  },
  getUserById: (id: string): User | undefined => {
    return dataService.getAllUsers().find(u => u.id === id);
  },
  updateUserStatus: (userId: string, status: 'active' | 'pending' | 'suspended') => {
    const users = dataService.getAllUsers().map(u => u.id === userId ? { ...u, status } : u);
    setStorage(STORAGE_KEYS.USERS, users);
    
    // Log audit
    dataService.logAudit({
      action: status === 'active' ? 'ACTIVATE_USER' : status === 'suspended' ? 'SUSPEND_USER' : 'UPDATE_USER_STATUS',
      target_type: 'user',
      target_id: userId,
      details: `User status changed to ${status}`
    });
  },

  loginAsPersona: (role: UserRole): User | null => {
    const users = dataService.getAllUsers();
    const target = users.find(u => u.role === role && u.status === 'active') || users.find(u => u.role === role);
    if (target) {
      dataService.setCurrentUser(target);
      return target;
    }
    return null;
  },

  loginWithSocial: (
    params: {
      provider: 'google' | 'facebook' | 'twitter';
      email?: string;
      fullName?: string;
      role?: UserRole;
      avatarUrl?: string;
      organizationName?: string;
    } | 'google' | 'facebook' | 'twitter', 
    roleFallback: UserRole = 'student'
  ): User => {
    let provider: 'google' | 'facebook' | 'twitter';
    let email: string;
    let fullName: string;
    let role: UserRole;
    let organizationName: string | undefined;

    if (typeof params === 'string') {
      provider = params;
      role = roleFallback;
      email = `${provider}.user@gmail.com`;
      fullName = `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`;
    } else {
      provider = params.provider;
      role = params.role || roleFallback;
      email = params.email || `${provider}.user@gmail.com`;
      fullName = params.fullName || `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`;
      organizationName = params.organizationName;
    }

    const providerNames: Record<string, string> = {
      google: 'Google',
      facebook: 'Facebook',
      twitter: 'Twitter'
    };

    let user = dataService.getAllUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      // Create user as active with social verification
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: email,
        role: role,
        full_name: fullName,
        phone: '+91 98765 43210',
        status: 'active',
        created_at: new Date().toISOString()
      };
      
      const updatedUsers = [...dataService.getAllUsers(), newUser];
      setStorage(STORAGE_KEYS.USERS, updatedUsers);
      user = newUser;

      // Create role entity
      if (role === 'student') {
        const students = dataService.getAllStudents();
        const newStudent: StudentProfile = {
          id: `student-${Date.now()}`,
          user_id: user.id,
          full_name: fullName,
          email: email,
          phone: '+91 98765 43210',
          education_level: 'B.Tech / Graduate',
          institution_name: organizationName || 'National Skilling University',
          graduation_year: 2025,
          location: 'Bengaluru, Karnataka',
          preferred_career_path: 'Data Analyst & Software Engineering',
          preferred_locations: ['Bengaluru', 'Mumbai', 'Remote'],
          employment_type: 'full_time',
          share_profile_with_employers: true,
          cv_score: 75,
          job_readiness_score: 80,
          skills: ['Python', 'SQL', 'Excel', 'Communication', 'Problem Solving'],
          bio: `Verified candidate authenticated via ${providerNames[provider]}. Seeking full-time placement opportunities.`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setStorage(STORAGE_KEYS.STUDENTS, [...students, newStudent]);
      } else if (role === 'company') {
        const companies = dataService.getAllCompanies();
        const newCompany: Company = {
          id: `company-${Date.now()}`,
          user_id: user.id,
          company_name: organizationName || `${fullName}'s Tech Ventures`,
          business_email: email,
          industry: 'Technology & Cloud Solutions',
          company_size: '51-200',
          location: 'Bengaluru / Mumbai',
          recruiter_name: fullName,
          recruiter_phone: '+91 98765 43210',
          description: `Enterprise recruiting partner authenticated via ${providerNames[provider]} SSO.`,
          verification_status: 'verified',
          subscription_tier: 'enterprise',
          job_credits_remaining: 10,
          created_at: new Date().toISOString()
        };
        setStorage(STORAGE_KEYS.COMPANIES, [...companies, newCompany]);

        // Attach an active sample job for this company so the dashboard is immediately functional
        const existingJobs = dataService.getAllJobs();
        const sampleJob: Job = {
          id: `job-${Date.now()}`,
          company_id: newCompany.id,
          company_name: newCompany.company_name,
          title: 'Associate Software & Data Trainee',
          department: 'Engineering & Analytics',
          category: 'Software Developer',
          location: 'Bengaluru',
          work_mode: 'hybrid',
          experience_level: 'entry',
          salary_min: 500000,
          salary_max: 800000,
          salary_currency: 'INR',
          description: 'Exciting entry-level opening for graduates with foundational skills in SQL, Python, and data analysis.',
          responsibilities: ['Collaborate with engineering teams', 'Build data pipelines and dashboards', 'Perform code reviews'],
          requirements: ['Degree in Science/Engg or relevant bootcamp certificate'],
          required_skills: ['SQL', 'Python', 'Git', 'Communication'],
          preferred_skills: ['React', 'Excel'],
          qualifications: ['B.Tech, BCA, B.Sc or Equivalent'],
          is_active: true,
          moderation_status: 'approved',
          views_count: 142,
          applicants_count: 12,
          created_at: new Date().toISOString()
        };
        setStorage(STORAGE_KEYS.JOBS, [...existingJobs, sampleJob]);
      } else if (role === 'skill_centre') {
        const centres = dataService.getAllSkillCentres();
        const newCentre: SkillCentre = {
          id: `centre-${Date.now()}`,
          user_id: user.id,
          centre_name: organizationName || `${fullName} Training Institute`,
          contact_email: email,
          phone: '+91 98765 43210',
          location: 'Bengaluru',
          delivery_modes: ['live_online', 'offline', 'recorded'],
          training_categories: ['Data Analytics', 'Software Development', 'Finance'],
          verification_status: 'verified',
          commission_rate: 15,
          bio: `Accredited Training Partner authenticated via ${providerNames[provider]} SSO.`,
          created_at: new Date().toISOString()
        };
        setStorage(STORAGE_KEYS.SKILL_CENTRES, [...centres, newCentre]);
      } else if (role === 'institution') {
        const institutions = dataService.getAllInstitutions();
        const newInst: Institution = {
          id: `inst-${Date.now()}`,
          user_id: user.id,
          institution_name: organizationName || `${fullName} Institute of Technology`,
          institution_type: 'college',
          address: 'Main Campus, Tech Enclave',
          contact_person: fullName,
          institutional_email: email,
          phone: '+91 98765 43210',
          student_count_expected: 450,
          billing_terms: 'net30',
          verification_status: 'verified',
          created_at: new Date().toISOString()
        };
        setStorage(STORAGE_KEYS.INSTITUTIONS, [...institutions, newInst]);
      }
    } else {
      // User exists with this email: synchronize full_name, role, and active status
      const updatedUser: User = {
        ...user,
        full_name: fullName || user.full_name,
        role: role || user.role,
        status: 'active'
      };
      user = updatedUser;
      const updatedUsers = dataService.getAllUsers().map(u => u.id === user!.id ? user! : u);
      setStorage(STORAGE_KEYS.USERS, updatedUsers);

      // Also ensure role profile is present & updated
      if (role === 'student' || user.role === 'student') {
        const students = dataService.getAllStudents();
        const existingSt = students.find(s => s.user_id === user!.id || s.email.toLowerCase() === email.toLowerCase());
        if (existingSt) {
          dataService.updateStudentProfile(existingSt.id, {
            user_id: user.id,
            full_name: fullName || existingSt.full_name,
            email: email
          });
        } else {
          const newStudent: StudentProfile = {
            id: `student-${Date.now()}`,
            user_id: user.id,
            full_name: fullName,
            email: email,
            phone: user.phone || '+91 98765 43210',
            education_level: 'B.Tech / Graduate',
            institution_name: organizationName || 'National Skilling University',
            graduation_year: 2025,
            location: 'Bengaluru, Karnataka',
            preferred_career_path: 'Data Analyst & Software Engineering',
            preferred_locations: ['Bengaluru', 'Mumbai', 'Remote'],
            employment_type: 'full_time',
            share_profile_with_employers: true,
            cv_score: 75,
            job_readiness_score: 80,
            skills: ['Python', 'SQL', 'Excel', 'Communication', 'Problem Solving'],
            bio: `Verified candidate authenticated via ${providerNames[provider]}. Seeking full-time placement opportunities.`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setStorage(STORAGE_KEYS.STUDENTS, [...students, newStudent]);
        }
      } else if (role === 'company') {
        const companies = dataService.getAllCompanies();
        const existingComp = companies.find(c => c.user_id === user!.id || c.business_email.toLowerCase() === email.toLowerCase());
        if (existingComp) {
          const updatedCompanies = companies.map(c => c.id === existingComp.id ? {
            ...c,
            user_id: user!.id,
            recruiter_name: fullName || c.recruiter_name,
            company_name: organizationName || c.company_name
          } : c);
          setStorage(STORAGE_KEYS.COMPANIES, updatedCompanies);
        }
      }
    }

    // CRITICAL: Always set active current user session for social logins
    dataService.setCurrentUser(user);

    dataService.logAudit({
      action: 'SOCIAL_LOGIN',
      target_type: 'user',
      target_id: user.id,
      details: `User logged in using ${providerNames[provider]} Single Sign-On`
    });

    return user;
  },

  // REGISTER
  registerUser: (userData: {
    email: string;
    role: UserRole;
    full_name: string;
    phone?: string;
    // Specific extra attributes
    extra?: any;
  }): { success: boolean; user?: User; message?: string } => {
    const users = dataService.getAllUsers();
    if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    // Role-based status: Students are active immediately; Companies, Skill Centres, and Institutions are pending admin review
    const requiresAdminApproval = ['company', 'skill_centre', 'institution'].includes(userData.role);
    const status = requiresAdminApproval ? 'pending' : 'active';

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: userData.email,
      role: userData.role,
      full_name: userData.full_name,
      phone: userData.phone,
      status: status,
      created_at: new Date().toISOString()
    };

    const updatedUsers = [...users, newUser];
    setStorage(STORAGE_KEYS.USERS, updatedUsers);

    // Create role-specific entity
    if (userData.role === 'student') {
      const students = dataService.getAllStudents();
      const newStudent: StudentProfile = {
        id: `student-${Date.now()}`,
        user_id: newUser.id,
        full_name: newUser.full_name,
        email: newUser.email,
        phone: newUser.phone || '',
        education_level: userData.extra?.education_level || 'B.Tech',
        institution_name: userData.extra?.institution_name || 'Autonomous Institute',
        graduation_year: Number(userData.extra?.graduation_year) || 2025,
        location: userData.extra?.location || 'Bengaluru, Karnataka',
        preferred_career_path: userData.extra?.preferred_career_path || 'Data Analyst',
        preferred_locations: userData.extra?.preferred_locations || ['Bengaluru', 'Remote'],
        employment_type: userData.extra?.employment_type || 'full_time',
        share_profile_with_employers: true,
        cv_score: 50,
        job_readiness_score: 55,
        skills: userData.extra?.skills || ['Excel', 'Communication'],
        bio: userData.extra?.bio || 'Recent graduate enthusiastic about skilling and placement opportunities.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setStorage(STORAGE_KEYS.STUDENTS, [...students, newStudent]);
    } else if (userData.role === 'company') {
      const companies = dataService.getAllCompanies();
      const newCompany: Company = {
        id: `company-${Date.now()}`,
        user_id: newUser.id,
        company_name: userData.extra?.company_name || userData.full_name,
        business_email: newUser.email,
        industry: userData.extra?.industry || 'Technology',
        company_size: userData.extra?.company_size || '11-50',
        website: userData.extra?.website,
        location: userData.extra?.location || 'India',
        recruiter_name: userData.full_name,
        recruiter_phone: userData.phone,
        description: userData.extra?.description || 'Recruiting partner on SkillBridge.',
        verification_status: 'pending',
        subscription_tier: 'pay_per_job',
        job_credits_remaining: 3,
        created_at: new Date().toISOString()
      };
      setStorage(STORAGE_KEYS.COMPANIES, [...companies, newCompany]);
    } else if (userData.role === 'skill_centre') {
      const centres = dataService.getAllSkillCentres();
      const newCentre: SkillCentre = {
        id: `centre-${Date.now()}`,
        user_id: newUser.id,
        centre_name: userData.extra?.centre_name || userData.full_name,
        contact_email: newUser.email,
        phone: newUser.phone || '',
        training_categories: userData.extra?.training_categories || ['Information Technology'],
        delivery_modes: userData.extra?.delivery_modes || ['recorded', 'live_online'],
        location: userData.extra?.location || 'India',
        verification_status: 'pending',
        commission_rate: 15,
        bio: userData.extra?.bio || 'Professional skill training academy.',
        created_at: new Date().toISOString()
      };
      setStorage(STORAGE_KEYS.SKILL_CENTRES, [...centres, newCentre]);
    } else if (userData.role === 'institution') {
      const institutions = dataService.getAllInstitutions();
      const newInst: Institution = {
        id: `inst-${Date.now()}`,
        user_id: newUser.id,
        institution_name: userData.extra?.institution_name || userData.full_name,
        institution_type: userData.extra?.institution_type || 'college',
        address: userData.extra?.address || 'Institutional Campus',
        contact_person: userData.full_name,
        institutional_email: newUser.email,
        phone: newUser.phone || '',
        student_count_expected: Number(userData.extra?.student_count_expected) || 100,
        verification_status: 'pending',
        billing_terms: 'Standard Academic Terms',
        created_at: new Date().toISOString()
      };
      setStorage(STORAGE_KEYS.INSTITUTIONS, [...institutions, newInst]);
    }

    // Auto set current user
    dataService.setCurrentUser(newUser);
    return { success: true, user: newUser };
  },

  // STUDENTS
  getAllStudents: (): StudentProfile[] => {
    return getStorage<StudentProfile[]>(STORAGE_KEYS.STUDENTS, []);
  },
  getStudentByUserId: (userId: string): StudentProfile | undefined => {
    const students = dataService.getAllStudents();
    let st = students.find(s => s.user_id === userId);
    if (st) return st;

    // Check by user email or user full_name fallback
    const user = dataService.getUserById(userId) || (dataService.getCurrentUser()?.id === userId ? dataService.getCurrentUser() : null);
    if (user) {
      if (user.email) {
        st = students.find(s => s.email.toLowerCase() === user.email.toLowerCase());
        if (st) {
          st = { ...st, user_id: user.id, full_name: user.full_name || st.full_name };
          const updated = students.map(s => s.id === st!.id ? st! : s);
          setStorage(STORAGE_KEYS.STUDENTS, updated);
          return st;
        }
      }

      if (user.full_name) {
        st = students.find(s => s.full_name.toLowerCase() === user.full_name.toLowerCase());
        if (st) {
          st = { ...st, user_id: user.id, email: user.email || st.email };
          const updated = students.map(s => s.id === st!.id ? st! : s);
          setStorage(STORAGE_KEYS.STUDENTS, updated);
          return st;
        }
      }

      // If user is a student and still no profile exists, create one immediately
      if (user.role === 'student') {
        const newStudent: StudentProfile = {
          id: `student-${Date.now()}`,
          user_id: user.id,
          full_name: user.full_name || 'Student Candidate',
          email: user.email,
          phone: user.phone || '+91 98765 43210',
          education_level: 'B.Tech / Graduate',
          institution_name: 'National Skilling University',
          graduation_year: 2025,
          location: 'Bengaluru, Karnataka',
          preferred_career_path: 'Data Analyst & Software Engineering',
          preferred_locations: ['Bengaluru', 'Mumbai', 'Remote'],
          employment_type: 'full_time',
          share_profile_with_employers: true,
          cv_score: 75,
          job_readiness_score: 80,
          skills: ['Python', 'SQL', 'Excel', 'Communication', 'Problem Solving'],
          bio: 'Verified student candidate profile.',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setStorage(STORAGE_KEYS.STUDENTS, [...students, newStudent]);
        return newStudent;
      }
    }
    return undefined;
  },
  getStudentById: (id: string): StudentProfile | undefined => {
    return dataService.getAllStudents().find(s => s.id === id);
  },
  updateStudentProfile: (studentId: string, updates: Partial<StudentProfile>): StudentProfile | null => {
    const students = dataService.getAllStudents();
    const index = students.findIndex(s => s.id === studentId);
    if (index === -1) return null;

    const updated = {
      ...students[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    students[index] = updated;
    setStorage(STORAGE_KEYS.STUDENTS, students);
    return updated;
  },

  // COMPANIES
  getAllCompanies: (): Company[] => {
    return getStorage<Company[]>(STORAGE_KEYS.COMPANIES, []);
  },
  getCompanyByUserId: (userId: string): Company | undefined => {
    const companies = dataService.getAllCompanies();
    let comp = companies.find(c => c.user_id === userId);
    if (comp) return comp;

    const user = dataService.getUserById(userId) || (dataService.getCurrentUser()?.id === userId ? dataService.getCurrentUser() : null);
    if (user) {
      comp = companies.find(c => c.business_email.toLowerCase() === user.email.toLowerCase());
      if (comp) {
        comp.user_id = user.id;
        setStorage(STORAGE_KEYS.COMPANIES, companies);
        return comp;
      }
      if (user.role === 'company') {
        const newComp: Company = {
          id: `company-${Date.now()}`,
          user_id: user.id,
          company_name: `${user.full_name}'s Tech Ventures`,
          business_email: user.email,
          industry: 'Technology & Cloud Solutions',
          company_size: '51-200',
          location: 'Bengaluru / Mumbai',
          recruiter_name: user.full_name,
          recruiter_phone: user.phone || '+91 98765 43210',
          description: 'Enterprise recruiting partner.',
          verification_status: 'verified',
          subscription_tier: 'enterprise',
          job_credits_remaining: 10,
          created_at: new Date().toISOString()
        };
        setStorage(STORAGE_KEYS.COMPANIES, [...companies, newComp]);
        return newComp;
      }
    }
    return undefined;
  },
  getCompanyById: (id: string): Company | undefined => {
    return dataService.getAllCompanies().find(c => c.id === id);
  },
  updateCompanyStatus: (companyId: string, status: 'verified' | 'rejected') => {
    const companies = dataService.getAllCompanies().map(c => 
      c.id === companyId ? { ...c, verification_status: status } : c
    );
    setStorage(STORAGE_KEYS.COMPANIES, companies);

    const comp = companies.find(c => c.id === companyId);
    if (comp) {
      dataService.updateUserStatus(comp.user_id, status === 'verified' ? 'active' : 'suspended');
      dataService.logAudit({
        action: status === 'verified' ? 'APPROVE_COMPANY' : 'REJECT_COMPANY',
        target_type: 'user',
        target_id: comp.id,
        details: `Company ${comp.company_name} verification status set to ${status}`
      });
    }
  },

  // SKILL CENTRES
  getAllSkillCentres: (): SkillCentre[] => {
    return getStorage<SkillCentre[]>(STORAGE_KEYS.SKILL_CENTRES, []);
  },
  getSkillCentreByUserId: (userId: string): SkillCentre | undefined => {
    const centres = dataService.getAllSkillCentres();
    let sc = centres.find(c => c.user_id === userId);
    if (sc) return sc;

    const user = dataService.getUserById(userId) || (dataService.getCurrentUser()?.id === userId ? dataService.getCurrentUser() : null);
    if (user) {
      sc = centres.find(c => c.contact_email.toLowerCase() === user.email.toLowerCase());
      if (sc) {
        sc.user_id = user.id;
        setStorage(STORAGE_KEYS.SKILL_CENTRES, centres);
        return sc;
      }
      if (user.role === 'skill_centre') {
        const newCentre: SkillCentre = {
          id: `centre-${Date.now()}`,
          user_id: user.id,
          centre_name: `${user.full_name} Training Academy`,
          contact_email: user.email,
          phone: user.phone || '+91 98765 43210',
          location: 'Bengaluru',
          delivery_modes: ['live_online', 'offline', 'recorded'],
          training_categories: ['Data Analytics', 'Software Development'],
          verification_status: 'verified',
          commission_rate: 15,
          bio: 'Accredited Training Partner.',
          created_at: new Date().toISOString()
        };
        setStorage(STORAGE_KEYS.SKILL_CENTRES, [...centres, newCentre]);
        return newCentre;
      }
    }
    return undefined;
  },
  getSkillCentreById: (id: string): SkillCentre | undefined => {
    return dataService.getAllSkillCentres().find(sc => sc.id === id);
  },
  updateSkillCentreStatus: (centreId: string, status: 'verified' | 'rejected') => {
    const centres = dataService.getAllSkillCentres().map(sc => 
      sc.id === centreId ? { ...sc, verification_status: status } : sc
    );
    setStorage(STORAGE_KEYS.SKILL_CENTRES, centres);

    const centre = centres.find(sc => sc.id === centreId);
    if (centre) {
      dataService.updateUserStatus(centre.user_id, status === 'verified' ? 'active' : 'suspended');
      dataService.logAudit({
        action: status === 'verified' ? 'APPROVE_SKILL_CENTRE' : 'REJECT_SKILL_CENTRE',
        target_type: 'user',
        target_id: centre.id,
        details: `Skill centre ${centre.centre_name} verification status set to ${status}`
      });
    }
  },

  // INSTITUTIONS
  getAllInstitutions: (): Institution[] => {
    return getStorage<Institution[]>(STORAGE_KEYS.INSTITUTIONS, []);
  },
  getInstitutionByUserId: (userId: string): Institution | undefined => {
    const institutions = dataService.getAllInstitutions();
    let inst = institutions.find(i => i.user_id === userId);
    if (inst) return inst;

    const user = dataService.getUserById(userId) || (dataService.getCurrentUser()?.id === userId ? dataService.getCurrentUser() : null);
    if (user) {
      inst = institutions.find(i => i.institutional_email.toLowerCase() === user.email.toLowerCase());
      if (inst) {
        inst.user_id = user.id;
        setStorage(STORAGE_KEYS.INSTITUTIONS, institutions);
        return inst;
      }
      if (user.role === 'institution') {
        const newInst: Institution = {
          id: `inst-${Date.now()}`,
          user_id: user.id,
          institution_name: `${user.full_name} Institute of Technology`,
          institution_type: 'college',
          address: 'Main Campus, Tech Enclave',
          contact_person: user.full_name,
          institutional_email: user.email,
          phone: user.phone || '+91 98765 43210',
          student_count_expected: 450,
          billing_terms: 'net30',
          verification_status: 'verified',
          created_at: new Date().toISOString()
        };
        setStorage(STORAGE_KEYS.INSTITUTIONS, [...institutions, newInst]);
        return newInst;
      }
    }
    return undefined;
  },
  getInstitutionById: (id: string): Institution | undefined => {
    return dataService.getAllInstitutions().find(i => i.id === id);
  },
  updateInstitutionStatus: (instId: string, status: 'verified' | 'rejected') => {
    const insts = dataService.getAllInstitutions().map(i => 
      i.id === instId ? { ...i, verification_status: status } : i
    );
    setStorage(STORAGE_KEYS.INSTITUTIONS, insts);

    const inst = insts.find(i => i.id === instId);
    if (inst) {
      dataService.updateUserStatus(inst.user_id, status === 'verified' ? 'active' : 'suspended');
      dataService.logAudit({
        action: status === 'verified' ? 'APPROVE_INSTITUTION' : 'REJECT_INSTITUTION',
        target_type: 'user',
        target_id: inst.id,
        details: `Institution ${inst.institution_name} verification status set to ${status}`
      });
    }
  },

  // JOBS
  getAllJobs: (): Job[] => {
    return getStorage<Job[]>(STORAGE_KEYS.JOBS, []);
  },
  getJobById: (id: string): Job | undefined => {
    return dataService.getAllJobs().find(j => j.id === id);
  },
  createJob: (jobData: Omit<Job, 'id' | 'views_count' | 'applicants_count' | 'created_at'>): Job => {
    const jobs = dataService.getAllJobs();
    const config = dataService.getConfig();
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}`,
      moderation_status: config.auto_approve_jobs ? 'approved' : 'pending_review',
      is_active: true,
      views_count: 1,
      applicants_count: 0,
      created_at: new Date().toISOString()
    };
    setStorage(STORAGE_KEYS.JOBS, [newJob, ...jobs]);
    return newJob;
  },
  updateJob: (jobId: string, updates: Partial<Job>): Job | null => {
    const jobs = dataService.getAllJobs();
    const index = jobs.findIndex(j => j.id === jobId);
    if (index === -1) return null;
    const updated = { ...jobs[index], ...updates };
    jobs[index] = updated;
    setStorage(STORAGE_KEYS.JOBS, jobs);
    return updated;
  },
  updateJobModeration: (jobId: string, status: 'approved' | 'pending_review' | 'archived') => {
    const jobs = dataService.getAllJobs().map(j => 
      j.id === jobId ? { ...j, moderation_status: status } : j
    );
    setStorage(STORAGE_KEYS.JOBS, jobs);
  },

  // COURSES
  getAllCourses: (): Course[] => {
    return getStorage<Course[]>(STORAGE_KEYS.COURSES, []);
  },
  getCourseById: (id: string): Course | undefined => {
    return dataService.getAllCourses().find(c => c.id === id);
  },
  createCourse: (courseData: Omit<Course, 'id' | 'enrolled_count' | 'rating' | 'created_at'>): Course => {
    const courses = dataService.getAllCourses();
    const config = dataService.getConfig();
    const newCourse: Course = {
      ...courseData,
      id: `course-${Date.now()}`,
      moderation_status: config.auto_approve_courses ? 'approved' : 'pending_review',
      enrolled_count: 0,
      rating: 5.0,
      created_at: new Date().toISOString()
    };
    setStorage(STORAGE_KEYS.COURSES, [newCourse, ...courses]);
    return newCourse;
  },
  updateCourse: (courseId: string, updates: Partial<Course>): Course | null => {
    const courses = dataService.getAllCourses();
    const index = courses.findIndex(c => c.id === courseId);
    if (index === -1) return null;
    const updated = { ...courses[index], ...updates };
    courses[index] = updated;
    setStorage(STORAGE_KEYS.COURSES, courses);
    return updated;
  },
  updateCourseModeration: (courseId: string, status: 'approved' | 'pending_review' | 'rejected') => {
    const courses = dataService.getAllCourses().map(c => 
      c.id === courseId ? { ...c, moderation_status: status } : c
    );
    setStorage(STORAGE_KEYS.COURSES, courses);
  },

  // ENROLMENTS
  getAllEnrolments: (): CourseEnrolment[] => {
    return getStorage<CourseEnrolment[]>(STORAGE_KEYS.ENROLMENTS, []);
  },
  getEnrolmentsForStudent: (studentId: string): CourseEnrolment[] => {
    return dataService.getAllEnrolments().filter(e => e.student_id === studentId);
  },
  getEnrolmentsForCourse: (courseId: string): CourseEnrolment[] => {
    return dataService.getAllEnrolments().filter(e => e.course_id === courseId);
  },
  enrolInCourse: (studentId: string, studentName: string, courseId: string, courseTitle: string, type: 'paid' | 'enquiry' | 'institutional' = 'paid'): CourseEnrolment => {
    const enrolments = dataService.getAllEnrolments();
    const existing = enrolments.find(e => e.student_id === studentId && e.course_id === courseId);
    if (existing) return existing;

    const newEnrol: CourseEnrolment = {
      id: `enrol-${Date.now()}`,
      course_id: courseId,
      course_title: courseTitle,
      student_id: studentId,
      student_name: studentName,
      enrolment_type: type,
      status: 'enrolled',
      progress_percent: 0,
      completed_lessons: [],
      certificate_issued: false,
      enrolled_at: new Date().toISOString()
    };
    setStorage(STORAGE_KEYS.ENROLMENTS, [...enrolments, newEnrol]);

    // Increment enrolled_count on course
    const courses = dataService.getAllCourses();
    const cIdx = courses.findIndex(c => c.id === courseId);
    if (cIdx !== -1) {
      courses[cIdx].enrolled_count += 1;
      setStorage(STORAGE_KEYS.COURSES, courses);
    }

    return newEnrol;
  },
  updateLessonProgress: (enrolmentId: string, lessonId: string, totalLessonsCount: number): CourseEnrolment | null => {
    const enrolments = dataService.getAllEnrolments();
    const index = enrolments.findIndex(e => e.id === enrolmentId);
    if (index === -1) return null;

    const item = enrolments[index];
    const completed = new Set(item.completed_lessons);
    completed.add(lessonId);

    const progress = Math.min(100, Math.round((completed.size / Math.max(1, totalLessonsCount)) * 100));
    const isCompleted = progress >= 100;

    const updated: CourseEnrolment = {
      ...item,
      completed_lessons: Array.from(completed),
      progress_percent: progress,
      status: isCompleted ? 'completed' : 'in_progress',
      completed_at: isCompleted ? (item.completed_at || new Date().toISOString()) : undefined,
      certificate_issued: isCompleted ? true : item.certificate_issued
    };

    enrolments[index] = updated;
    setStorage(STORAGE_KEYS.ENROLMENTS, enrolments);
    return updated;
  },
  updateEnrolment: (enrolmentId: string, updates: Partial<CourseEnrolment>): CourseEnrolment | null => {
    const enrolments = dataService.getAllEnrolments();
    const index = enrolments.findIndex(e => e.id === enrolmentId);
    if (index === -1) return null;
    const updated = { ...enrolments[index], ...updates };
    enrolments[index] = updated;
    setStorage(STORAGE_KEYS.ENROLMENTS, enrolments);
    return updated;
  },

  // APPLICATIONS
  getAllApplications: (): Application[] => {
    return getStorage<Application[]>(STORAGE_KEYS.APPLICATIONS, []);
  },
  getApplicationsForStudent: (studentId: string): Application[] => {
    return dataService.getAllApplications().filter(a => a.student_id === studentId);
  },
  getApplicationsForJob: (jobId: string): Application[] => {
    return dataService.getAllApplications().filter(a => a.job_id === jobId);
  },
  getApplicationsForCompany: (companyId: string): Application[] => {
    return dataService.getAllApplications().filter(a => a.company_id === companyId);
  },
  createApplication: (appData: Omit<Application, 'id' | 'applied_at' | 'updated_at'>): Application => {
    const apps = dataService.getAllApplications();
    const newApp: Application = {
      ...appData,
      id: `app-${Date.now()}`,
      applied_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setStorage(STORAGE_KEYS.APPLICATIONS, [newApp, ...apps]);

    // Increment applicants_count on job
    const jobs = dataService.getAllJobs();
    const jIdx = jobs.findIndex(j => j.id === appData.job_id);
    if (jIdx !== -1) {
      jobs[jIdx].applicants_count += 1;
      setStorage(STORAGE_KEYS.JOBS, jobs);
    }

    return newApp;
  },
  updateApplicationStatus: (applicationId: string, status: Application['status'], notes?: string): Application | null => {
    const apps = dataService.getAllApplications();
    const index = apps.findIndex(a => a.id === applicationId);
    if (index === -1) return null;

    const updated: Application = {
      ...apps[index],
      status,
      recruiter_notes: notes !== undefined ? notes : apps[index].recruiter_notes,
      updated_at: new Date().toISOString()
    };
    apps[index] = updated;
    setStorage(STORAGE_KEYS.APPLICATIONS, apps);

    // If candidate status is updated to hired or offer_accepted, sync with placement programme
    if (status === 'hired' || status === 'offer_accepted') {
      dataService.syncPlacementSuccess(updated.student_id, updated.company_name, updated.job_title);
    }

    return updated;
  },

  // INTERVIEWS
  getAllInterviews: (): Interview[] => {
    return getStorage<Interview[]>(STORAGE_KEYS.INTERVIEWS, []);
  },
  getInterviewsForStudent: (studentId: string): Interview[] => {
    return dataService.getAllInterviews().filter(i => i.student_id === studentId);
  },
  getInterviewsForCompany: (companyId: string): Interview[] => {
    return dataService.getAllInterviews().filter(i => i.company_id === companyId);
  },
  scheduleInterview: (interviewData: Omit<Interview, 'id' | 'created_at'>): Interview => {
    const interviews = dataService.getAllInterviews();
    const newInterview: Interview = {
      ...interviewData,
      id: `interview-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    setStorage(STORAGE_KEYS.INTERVIEWS, [newInterview, ...interviews]);

    // Update application status to interview_scheduled
    dataService.updateApplicationStatus(interviewData.application_id, 'interview_scheduled');

    // Notify student
    const student = dataService.getStudentById(interviewData.student_id);
    if (student) {
      dataService.sendNotification({
        user_id: student.user_id,
        title: 'New Interview Scheduled!',
        message: `${interviewData.company_name} scheduled an interview for ${interviewData.job_title} on ${new Date(interviewData.scheduled_at).toLocaleDateString()}.`,
        type: 'interview',
        link: '/student/interviews'
      });
    }

    return newInterview;
  },
  updateInterviewOutcome: (interviewId: string, outcome: 'passed' | 'failed', feedback?: string) => {
    const interviews = dataService.getAllInterviews();
    const index = interviews.findIndex(i => i.id === interviewId);
    if (index === -1) return null;

    const updated: Interview = {
      ...interviews[index],
      status: 'completed',
      outcome,
      feedback
    };
    interviews[index] = updated;
    setStorage(STORAGE_KEYS.INTERVIEWS, interviews);

    // Update application status accordingly
    const targetStatus = outcome === 'passed' ? 'offer_extended' : 'rejected';
    dataService.updateApplicationStatus(updated.application_id, targetStatus, feedback);

    return updated;
  },

  // PLACEMENT PROGRAMME & CONDITIONAL REFUND (₹5,000 / ₹2,000)
  getAllProgrammeEnrolments: (): ProgrammeEnrolment[] => {
    return getStorage<ProgrammeEnrolment[]>(STORAGE_KEYS.PROGRAMME_ENROLMENTS, []);
  },
  getProgrammeEnrolmentForStudent: (studentId: string): ProgrammeEnrolment | undefined => {
    return dataService.getAllProgrammeEnrolments().find(p => p.student_id === studentId);
  },
  enrolInPlacementProgramme: (student: StudentProfile, paymentMethod: 'upi' | 'card' | 'sandbox_demo' = 'sandbox_demo'): ProgrammeEnrolment => {
    const enrolments = dataService.getAllProgrammeEnrolments();
    const config = dataService.getConfig();

    const existing = enrolments.find(p => p.student_id === student.id);
    if (existing) return existing;

    const txnId = `SB-TXN-${Date.now().toString().slice(-6)}`;
    const newEnrol: ProgrammeEnrolment = {
      id: `prog-enrol-${Date.now()}`,
      student_id: student.id,
      student_name: student.full_name,
      student_email: student.email,
      fee_amount: config.programme_fee,
      fee_paid: true,
      payment_id: `pay-${Date.now()}`,
      transaction_ref: txnId,
      enrolled_at: new Date().toISOString(),
      assistance_valid_until: new Date(Date.now() + config.assistance_duration_months * 30 * 24 * 60 * 60 * 1000).toISOString(),
      stage: 'enrolled',
      interviews_scheduled_count: 0,
      interviews_attended_count: 0,
      max_interviews_allowed: config.max_interviews,
      refund_status: 'not_applicable',
      refund_amount: config.refund_amount,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setStorage(STORAGE_KEYS.PROGRAMME_ENROLMENTS, [newEnrol, ...enrolments]);

    // Record payment
    dataService.recordPayment({
      user_id: student.user_id,
      user_name: student.full_name,
      user_email: student.email,
      amount: config.programme_fee,
      currency: 'INR',
      purpose: 'placement_programme',
      payment_method: paymentMethod,
      status: 'success',
      transaction_id: txnId,
      is_sandbox: paymentMethod === 'sandbox_demo'
    });

    return newEnrol;
  },

  syncPlacementSuccess: (studentId: string, companyName: string, jobTitle: string) => {
    const enrolments = dataService.getAllProgrammeEnrolments();
    const index = enrolments.findIndex(p => p.student_id === studentId);
    if (index === -1) return;

    const item = enrolments[index];
    const updated: ProgrammeEnrolment = {
      ...item,
      stage: 'refund_eligible',
      refund_status: 'eligible',
      verified_company_name: companyName,
      verified_job_title: jobTitle,
      updated_at: new Date().toISOString()
    };
    enrolments[index] = updated;
    setStorage(STORAGE_KEYS.PROGRAMME_ENROLMENTS, enrolments);
  },

  requestPlacementRefund: (studentId: string, offerLetterUrl?: string): ProgrammeEnrolment | null => {
    const enrolments = dataService.getAllProgrammeEnrolments();
    const index = enrolments.findIndex(p => p.student_id === studentId);
    if (index === -1) return null;

    const updated: ProgrammeEnrolment = {
      ...enrolments[index],
      stage: 'refund_requested',
      refund_status: 'requested',
      offer_letter_url: offerLetterUrl || '/demo-resumes/verified-offer-letter.pdf',
      refund_requested_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    enrolments[index] = updated;
    setStorage(STORAGE_KEYS.PROGRAMME_ENROLMENTS, enrolments);

    // Notify Admin
    const admin = dataService.getAllUsers().find(u => u.role === 'admin');
    if (admin) {
      dataService.sendNotification({
        user_id: admin.id,
        title: 'New Refund Request',
        message: `${updated.student_name} submitted a ₹${updated.refund_amount} refund claim following verified placement at ${updated.verified_company_name || 'an approved employer'}.`,
        type: 'refund',
        link: '/admin/refunds'
      });
    }

    return updated;
  },

  processRefundByAdmin: (enrolmentId: string, approved: boolean, notes?: string): ProgrammeEnrolment | null => {
    const enrolments = dataService.getAllProgrammeEnrolments();
    const index = enrolments.findIndex(p => p.id === enrolmentId);
    if (index === -1) return null;

    const item = enrolments[index];
    const now = new Date().toISOString();
    const updated: ProgrammeEnrolment = {
      ...item,
      stage: approved ? 'refund_paid' : 'placement_verified',
      refund_status: approved ? 'paid' : 'rejected',
      refund_approved_at: approved ? now : undefined,
      refund_paid_at: approved ? now : undefined,
      refund_transaction_id: approved ? `RF-TXN-${Date.now().toString().slice(-6)}` : undefined,
      admin_notes: notes,
      updated_at: now
    };
    enrolments[index] = updated;
    setStorage(STORAGE_KEYS.PROGRAMME_ENROLMENTS, enrolments);

    // Log administrative audit
    dataService.logAudit({
      action: approved ? 'APPROVE_REFUND' : 'REJECT_REFUND',
      target_type: 'refund',
      target_id: item.id,
      details: `${approved ? 'Approved and released ₹' + item.refund_amount : 'Rejected refund'} for ${item.student_name}. Notes: ${notes || 'Standard placement verification completed.'}`
    });

    // Notify student
    const student = dataService.getStudentById(item.student_id);
    if (student) {
      dataService.sendNotification({
        user_id: student.user_id,
        title: approved ? 'Placement Refund Approved & Paid! 🎉' : 'Refund Claim Update',
        message: approved 
          ? `Your conditional placement assistance refund of ₹${item.refund_amount} has been processed to your original payment method.` 
          : `Your refund claim requires further verification. Reason: ${notes || 'Contact support'}`,
        type: 'refund',
        link: '/student/placement'
      });
    }

    return updated;
  },

  // BATCHES & INSTITUTION BULK IMPORT
  getAllBatches: (): Batch[] => {
    return getStorage<Batch[]>(STORAGE_KEYS.BATCHES, []);
  },
  getBatchesForInstitution: (institutionId: string): Batch[] => {
    return dataService.getAllBatches().filter(b => b.institution_id === institutionId);
  },
  createBatch: (batchData: Omit<Batch, 'id' | 'total_students' | 'registered_students' | 'assessed_students' | 'placed_students' | 'created_at'>): Batch => {
    const batches = dataService.getAllBatches();
    const newBatch: Batch = {
      ...batchData,
      id: `batch-${Date.now()}`,
      total_students: 0,
      registered_students: 0,
      assessed_students: 0,
      placed_students: 0,
      created_at: new Date().toISOString()
    };
    setStorage(STORAGE_KEYS.BATCHES, [newBatch, ...batches]);
    return newBatch;
  },
  importBatchStudents: (batchId: string, studentsToImport: BatchStudentImportItem[]): { importedCount: number; errors: string[] } => {
    const batches = dataService.getAllBatches();
    const bIndex = batches.findIndex(b => b.id === batchId);
    if (bIndex === -1) return { importedCount: 0, errors: ['Batch not found'] };

    const batch = batches[bIndex];
    const existingStudents = dataService.getAllStudents();
    const existingUsers = dataService.getAllUsers();
    const errors: string[] = [];
    let count = 0;

    const newUsers: User[] = [];
    const newStudents: StudentProfile[] = [];

    studentsToImport.forEach((item, idx) => {
      if (!item.email || !item.full_name) {
        errors.push(`Row ${idx + 1}: Name and email are required.`);
        return;
      }
      if (existingUsers.some(u => u.email.toLowerCase() === item.email.toLowerCase())) {
        errors.push(`Row ${idx + 1} (${item.email}): Account already registered.`);
        return;
      }

      const uid = `user-bulk-${Date.now()}-${idx}`;
      const user: User = {
        id: uid,
        email: item.email,
        role: 'student',
        full_name: item.full_name,
        phone: item.phone,
        status: 'active',
        created_at: new Date().toISOString()
      };
      newUsers.push(user);

      const profile: StudentProfile = {
        id: `student-bulk-${Date.now()}-${idx}`,
        user_id: uid,
        full_name: item.full_name,
        email: item.email,
        phone: item.phone || '',
        education_level: item.education_level || 'B.Tech',
        institution_id: batch.institution_id,
        institution_name: batch.institution_name,
        graduation_year: item.graduation_year || 2025,
        location: 'Campus Batch Enrolment',
        preferred_career_path: 'Data Analyst',
        preferred_locations: ['Bengaluru', 'Remote'],
        employment_type: 'full_time',
        share_profile_with_employers: true,
        cv_score: 60,
        job_readiness_score: 65,
        skills: ['SQL', 'Excel', 'Communication'],
        bio: `Enrolled via ${batch.institution_name} Batch: ${batch.name}`,
        is_minor: Boolean(item.is_minor),
        guardian_consent_given: Boolean(item.is_minor),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      newStudents.push(profile);
      count++;
    });

    if (newUsers.length > 0) {
      setStorage(STORAGE_KEYS.USERS, [...existingUsers, ...newUsers]);
      setStorage(STORAGE_KEYS.STUDENTS, [...existingStudents, ...newStudents]);

      // Update batch numbers
      batch.total_students += count;
      batch.registered_students += count;
      batch.assessed_students += Math.floor(count * 0.7);
      batches[bIndex] = batch;
      setStorage(STORAGE_KEYS.BATCHES, batches);
    }

    return { importedCount: count, errors };
  },

  // PAYMENTS
  getAllPayments: (): PaymentRecord[] => {
    return getStorage<PaymentRecord[]>(STORAGE_KEYS.PAYMENTS, []);
  },
  recordPayment: (paymentData: Omit<PaymentRecord, 'id' | 'created_at'>): PaymentRecord => {
    const payments = dataService.getAllPayments();
    const newPayment: PaymentRecord = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    setStorage(STORAGE_KEYS.PAYMENTS, [newPayment, ...payments]);
    return newPayment;
  },

  // NOTIFICATIONS
  getAllNotifications: (): Notification[] => {
    return getStorage<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  },
  getNotificationsForUser: (userId: string): Notification[] => {
    return dataService.getAllNotifications().filter(n => n.user_id === userId);
  },
  markNotificationAsRead: (id: string) => {
    const notifs = dataService.getAllNotifications().map(n => n.id === id ? { ...n, is_read: true } : n);
    setStorage(STORAGE_KEYS.NOTIFICATIONS, notifs);
  },
  markAllNotificationsAsRead: (userId: string) => {
    const notifs = dataService.getAllNotifications().map(n => n.user_id === userId ? { ...n, is_read: true } : n);
    setStorage(STORAGE_KEYS.NOTIFICATIONS, notifs);
  },
  sendNotification: (notifData: Omit<Notification, 'id' | 'is_read' | 'created_at'>): Notification => {
    const notifs = dataService.getAllNotifications();
    const newNotif: Notification = {
      ...notifData,
      id: `notif-${Date.now()}`,
      is_read: false,
      created_at: new Date().toISOString()
    };
    setStorage(STORAGE_KEYS.NOTIFICATIONS, [newNotif, ...notifs]);
    return newNotif;
  },

  // AUDIT LOGS
  getAuditLogs: (): AuditLog[] => {
    return getStorage<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []);
  },
  logAudit: (data: Omit<AuditLog, 'id' | 'actor_id' | 'actor_name' | 'actor_role' | 'created_at'>) => {
    const logs = dataService.getAuditLogs();
    const currentUser = dataService.getCurrentUser();
    const newLog: AuditLog = {
      ...data,
      id: `audit-${Date.now()}`,
      actor_id: currentUser?.id || 'system',
      actor_name: currentUser?.full_name || 'System Auto-Moderation',
      actor_role: currentUser?.role || 'admin',
      ip_address: '127.0.0.1 (Local Session)',
      created_at: new Date().toISOString()
    };
    setStorage(STORAGE_KEYS.AUDIT_LOGS, [newLog, ...logs]);
  }
};
