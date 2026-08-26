import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { StudentProfile, AccessType, BetaStatus } from '../types';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';
import {
  calculateBetaExpiry,
  BETA_DURATION_DAYS,
  isConfiguredAdminEmail,
  isAdminUser,
  activateStudentBeta,
  extendStudentBeta,
  expireStudentBeta,
  revokeStudentBeta,
  grantFull90DayAccess,
  grantAdminAccess,
} from '../utils/betaAccess';
import {
  getStoredStudents,
  saveStudents,
  upsertStudent,
  INITIAL_REGISTERED_STUDENTS,
} from '../services/studentRegistry';

interface AuthContextType {
  user: StudentProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  isSupabaseActive: boolean;
  registeredStudents: StudentProfile[];
  refreshStudents: () => void;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (fullName: string, email: string, pass: string, targetNiche: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchStudentPerspective: (student: StudentProfile) => void;
  quickAdminLogin: () => void;
  quickStudentLogin: (studentId?: string) => void;
  createTestStudent: (fullName: string, email: string, targetNiche?: string, accessType?: AccessType) => StudentProfile;
  updateProfile: (updatedData: Partial<StudentProfile>) => void;
  // Beta Management Direct Mutations
  activateStudentById: (studentId: string) => void;
  reactivateStudentById: (studentId: string) => void;
  extendStudentById: (studentId: string, days?: number) => void;
  expireStudentById: (studentId: string) => void;
  revokeStudentById: (studentId: string) => void;
  resetStudentToNotActivatedById: (studentId: string) => void;
  grantFullAccessById: (studentId: string) => void;
  grantAdminById: (studentId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [registeredStudents, setRegisteredStudents] = useState<StudentProfile[]>(() => getStoredStudents());

  const refreshStudents = useCallback(() => {
    setRegisteredStudents(getStoredStudents());
  }, []);

  const [user, setUser] = useState<StudentProfile | null>(() => {
    // 1. Check localStorage for persisted session
    const saved = localStorage.getItem('coreguide_va_user');
    if (saved) {
      try {
        const parsed: StudentProfile = JSON.parse(saved);
        // Normalize role and access type if email is configured admin
        if (isConfiguredAdminEmail(parsed.email) || parsed.role === 'admin') {
          return {
            ...parsed,
            role: 'admin',
            accessType: 'ADMIN',
            is_beta_tester: false,
          };
        }
        return parsed;
      } catch {
        return null;
      }
    }

    // 2. Default to Owner Admin account on first load so administrator has instant access
    const adminAccount = INITIAL_REGISTERED_STUDENTS.find(
      (s) => s.email.toLowerCase() === 'lightfuludu@gmail.com'
    ) || {
      id: 'admin-owner-001',
      email: 'lightfuludu@gmail.com',
      fullName: 'Administrator (Owner)',
      role: 'admin',
      accessType: 'ADMIN',
      currentDay: 14,
      targetNiche: 'Executive & Tech VA',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
      simulationStartDate: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      is_beta_tester: false,
      beta_status: 'active',
    };

    localStorage.setItem('coreguide_va_user', JSON.stringify(adminAccount));
    return adminAccount;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isSupabaseActive = isSupabaseConfigured();

  useEffect(() => {
    const supabase = getSupabase();
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const email = session.user.email || 'student@coreguide.io';
          const isAdmin = isConfiguredAdminEmail(email);
          const profile: StudentProfile = {
            id: session.user.id,
            email,
            fullName: session.user.user_metadata?.full_name || email.split('@')[0],
            role: isAdmin ? 'admin' : (session.user.user_metadata?.role || 'student'),
            accessType: isAdmin ? 'ADMIN' : (session.user.user_metadata?.access_type || 'BETA_TESTER'),
            currentDay: 1,
            targetNiche: session.user.user_metadata?.target_niche || 'Executive Assistant',
            createdAt: session.user.created_at,
            simulationStartDate: session.user.created_at,
            is_beta_tester: !isAdmin,
            beta_status: isAdmin ? 'active' : 'not_started',
            beta_duration: BETA_DURATION_DAYS,
          };
          setUser(profile);
          upsertStudent(profile);
          refreshStudents();
          localStorage.setItem('coreguide_va_user', JSON.stringify(profile));
        }
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [refreshStudents]);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });
      if (error) {
        setIsLoading(false);
        return { success: false, error: error.message };
      }
      if (data.user) {
        const isAdmin = isConfiguredAdminEmail(data.user.email);
        const existing = getStoredStudents().find((s) => s.email.toLowerCase() === (data.user?.email || '').toLowerCase());

        const profile: StudentProfile = existing || {
          id: data.user.id,
          email: data.user.email || email,
          fullName: data.user.user_metadata?.full_name || email.split('@')[0],
          role: isAdmin ? 'admin' : (data.user.user_metadata?.role || 'student'),
          accessType: isAdmin ? 'ADMIN' : (data.user.user_metadata?.access_type || 'NOT_ACTIVATED'),
          currentDay: 1,
          targetNiche: data.user.user_metadata?.target_niche || 'Executive Assistant',
          createdAt: data.user.created_at,
          simulationStartDate: data.user.created_at,
          is_beta_tester: false,
          beta_status: undefined,
          beta_start_date: null,
          beta_expiry_date: null,
        };
        setUser(profile);
        upsertStudent(profile);
        refreshStudents();
        localStorage.setItem('coreguide_va_user', JSON.stringify(profile));
      }
      setIsLoading(false);
      return { success: true };
    }

    // Local / Dev sign-in fallback
    await new Promise((res) => setTimeout(res, 300));
    if (!email || !pass) {
      setIsLoading(false);
      return { success: false, error: 'Please enter both email and password.' };
    }

    const isAdmin = isConfiguredAdminEmail(email);
    // Find existing student from registry or create new with NOT_ACTIVATED default
    const existing = getStoredStudents().find((s) => s.email.toLowerCase() === email.toLowerCase());

    const fallbackProfile: StudentProfile = existing || {
      id: 'student-' + Math.random().toString(36).substring(2, 9),
      email,
      fullName: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      role: isAdmin ? 'admin' : 'student',
      accessType: isAdmin ? 'ADMIN' : 'NOT_ACTIVATED',
      currentDay: 1,
      targetNiche: 'Executive & Tech VA',
      createdAt: new Date().toISOString(),
      simulationStartDate: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      is_beta_tester: false,
      beta_status: undefined,
      beta_start_date: null,
      beta_expiry_date: null,
    };

    setUser(fallbackProfile);
    upsertStudent(fallbackProfile);
    refreshStudents();
    localStorage.setItem('coreguide_va_user', JSON.stringify(fallbackProfile));
    setIsLoading(false);
    return { success: true };
  };

  const signup = async (fullName: string, email: string, pass: string, targetNiche: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const now = new Date().toISOString();
    const isAdmin = isConfiguredAdminEmail(email);

    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            full_name: fullName,
            target_niche: targetNiche,
            role: isAdmin ? 'admin' : 'student',
            access_type: isAdmin ? 'ADMIN' : 'NOT_ACTIVATED',
          },
        },
      });
      if (error) {
        setIsLoading(false);
        return { success: false, error: error.message };
      }
      if (data.user) {
        const profile: StudentProfile = {
          id: data.user.id,
          email: data.user.email || email,
          fullName: fullName,
          role: isAdmin ? 'admin' : 'student',
          accessType: isAdmin ? 'ADMIN' : 'NOT_ACTIVATED',
          currentDay: 1,
          targetNiche: targetNiche,
          createdAt: now,
          simulationStartDate: now,
          lastActivity: now,
          is_beta_tester: false,
          beta_status: undefined,
          beta_start_date: null,
          beta_expiry_date: null,
        };
        setUser(profile);
        upsertStudent(profile);
        refreshStudents();
        localStorage.setItem('coreguide_va_user', JSON.stringify(profile));
      }
      setIsLoading(false);
      return { success: true };
    }

    // Local signup fallback: Defaults strictly to NOT_ACTIVATED for students
    await new Promise((res) => setTimeout(res, 300));
    const newProfile: StudentProfile = {
      id: 'student-' + Math.random().toString(36).substring(2, 9),
      email,
      fullName,
      role: isAdmin ? 'admin' : 'student',
      accessType: isAdmin ? 'ADMIN' : 'NOT_ACTIVATED',
      currentDay: 1,
      targetNiche: targetNiche || 'Executive & Tech VA',
      createdAt: now,
      simulationStartDate: now,
      lastActivity: now,
      is_beta_tester: false,
      beta_status: undefined,
      beta_start_date: null,
      beta_expiry_date: null,
    };

    setUser(newProfile);
    upsertStudent(newProfile);
    refreshStudents();
    localStorage.setItem('coreguide_va_user', JSON.stringify(newProfile));
    setIsLoading(false);
    return { success: true };
  };

  const logout = async (): Promise<void> => {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('coreguide_va_user');
  };

  const quickAdminLogin = () => {
    const admin = INITIAL_REGISTERED_STUDENTS.find(
      (s) => s.email.toLowerCase() === 'lightfuludu@gmail.com'
    ) || INITIAL_REGISTERED_STUDENTS[INITIAL_REGISTERED_STUDENTS.length - 1];
    setUser(admin);
    upsertStudent(admin);
    refreshStudents();
    localStorage.setItem('coreguide_va_user', JSON.stringify(admin));
  };

  const quickStudentLogin = (studentId?: string) => {
    const list = getStoredStudents();
    const student = (studentId && list.find((s) => s.id === studentId)) || list[0];
    setUser(student);
    localStorage.setItem('coreguide_va_user', JSON.stringify(student));
  };

  const createTestStudent = (
    fullName: string,
    email: string,
    targetNiche: string = 'Executive & Tech VA',
    accessType: AccessType = 'NOT_ACTIVATED'
  ): StudentProfile => {
    const now = new Date().toISOString();
    const isBeta = accessType === 'BETA_TESTER';
    const isFull = accessType === 'FULL_STUDENT';
    const isAdmin = accessType === 'ADMIN' || isConfiguredAdminEmail(email);

    const testStudent: StudentProfile = {
      id: `student-test-${Date.now()}`,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      role: isAdmin ? 'admin' : 'student',
      accessType,
      currentDay: 1,
      targetNiche,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      createdAt: now,
      simulationStartDate: now,
      lastActivity: now,
      is_beta_tester: isBeta,
      beta_status: isBeta ? 'active' : undefined,
      beta_start_date: isBeta ? now : null,
      beta_expiry_date: isBeta ? calculateBetaExpiry(now, 14) : null,
      beta_duration: isBeta ? 14 : undefined,
    };

    upsertStudent(testStudent);
    refreshStudents();
    return testStudent;
  };

  const switchStudentPerspective = (student: StudentProfile) => {
    setUser(student);
    localStorage.setItem('coreguide_va_user', JSON.stringify(student));
  };

  const updateProfile = (updatedData: Partial<StudentProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updatedData };
    setUser(updated);
    upsertStudent(updated);
    refreshStudents();
    localStorage.setItem('coreguide_va_user', JSON.stringify(updated));
  };

  // Direct Beta Management Methods
  const activateStudentByIdHandler = (studentId: string) => {
    const list = getStoredStudents();
    const target = list.find((s) => s.id === studentId);
    if (!target) return;
    const updated = activateStudentBeta(target);
    upsertStudent(updated);
    refreshStudents();
    if (user?.id === studentId) {
      setUser(updated);
      localStorage.setItem('coreguide_va_user', JSON.stringify(updated));
    }
  };

  const reactivateStudentByIdHandler = (studentId: string) => {
    activateStudentByIdHandler(studentId);
  };

  const extendStudentByIdHandler = (studentId: string, days: number = 7) => {
    const list = getStoredStudents();
    const target = list.find((s) => s.id === studentId);
    if (!target) return;
    const updated = extendStudentBeta(target, days);
    upsertStudent(updated);
    refreshStudents();
    if (user?.id === studentId) {
      setUser(updated);
      localStorage.setItem('coreguide_va_user', JSON.stringify(updated));
    }
  };

  const expireStudentByIdHandler = (studentId: string) => {
    const list = getStoredStudents();
    const target = list.find((s) => s.id === studentId);
    if (!target) return;
    const updated = expireStudentBeta(target);
    upsertStudent(updated);
    refreshStudents();
    if (user?.id === studentId) {
      setUser(updated);
      localStorage.setItem('coreguide_va_user', JSON.stringify(updated));
    }
  };

  const revokeStudentByIdHandler = (studentId: string) => {
    const list = getStoredStudents();
    const target = list.find((s) => s.id === studentId);
    if (!target) return;
    const updated = revokeStudentBeta(target);
    upsertStudent(updated);
    refreshStudents();
    if (user?.id === studentId) {
      setUser(updated);
      localStorage.setItem('coreguide_va_user', JSON.stringify(updated));
    }
  };

  const resetStudentToNotActivatedByIdHandler = (studentId: string) => {
    const list = getStoredStudents();
    const target = list.find((s) => s.id === studentId);
    if (!target) return;
    const updated: StudentProfile = {
      ...target,
      accessType: 'NOT_ACTIVATED',
      role: 'student',
      is_beta_tester: false,
      beta_status: undefined,
      beta_start_date: null,
      beta_expiry_date: null,
      lastActivity: new Date().toISOString(),
    };
    upsertStudent(updated);
    refreshStudents();
    if (user?.id === studentId) {
      setUser(updated);
      localStorage.setItem('coreguide_va_user', JSON.stringify(updated));
    }
  };

  const grantFullAccessByIdHandler = (studentId: string) => {
    const list = getStoredStudents();
    const target = list.find((s) => s.id === studentId);
    if (!target) return;
    const updated = grantFull90DayAccess(target);
    upsertStudent(updated);
    refreshStudents();
    if (user?.id === studentId) {
      setUser(updated);
      localStorage.setItem('coreguide_va_user', JSON.stringify(updated));
    }
  };

  const grantAdminByIdHandler = (studentId: string) => {
    const list = getStoredStudents();
    const target = list.find((s) => s.id === studentId);
    if (!target) return;
    const updated = grantAdminAccess(target);
    upsertStudent(updated);
    refreshStudents();
    if (user?.id === studentId) {
      setUser(updated);
      localStorage.setItem('coreguide_va_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: isAdminUser(user),
        isLoading,
        isSupabaseActive,
        registeredStudents,
        refreshStudents,
        login,
        signup,
        logout,
        switchStudentPerspective,
        quickAdminLogin,
        quickStudentLogin,
        createTestStudent,
        updateProfile,
        activateStudentById: activateStudentByIdHandler,
        reactivateStudentById: reactivateStudentByIdHandler,
        extendStudentById: extendStudentByIdHandler,
        expireStudentById: expireStudentByIdHandler,
        revokeStudentById: revokeStudentByIdHandler,
        resetStudentToNotActivatedById: resetStudentToNotActivatedByIdHandler,
        grantFullAccessById: grantFullAccessByIdHandler,
        grantAdminById: grantAdminByIdHandler,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
