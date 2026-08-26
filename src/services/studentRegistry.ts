import { StudentProfile, AccessType, BetaStatus } from '../types';
import {
  calculateBetaExpiry,
  activateStudentBeta,
  extendStudentBeta,
  expireStudentBeta,
  revokeStudentBeta,
  grantFull90DayAccess,
  grantAdminAccess,
  isConfiguredAdminEmail,
} from '../utils/betaAccess';

const REGISTRY_STORAGE_KEY = 'coreguide_registered_students_v1';

const getInitialDemoDates = () => {
  const now = new Date();
  const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString();
  const expiryActive = calculateBetaExpiry(fiveDaysAgo, 14);

  const twentyDaysAgo = new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString();
  const expiryExpired = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString();

  return { fiveDaysAgo, expiryActive, twentyDaysAgo, expiryExpired };
};

const dates = getInitialDemoDates();

export const INITIAL_REGISTERED_STUDENTS: StudentProfile[] = [
  {
    id: 'student-john-100',
    email: 'john@email.com',
    fullName: 'John Miller',
    role: 'student',
    accessType: 'NOT_ACTIVATED',
    currentDay: 1,
    targetNiche: 'Executive & Tech VA',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    simulationStartDate: new Date().toISOString(),
    lastActivity: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    is_beta_tester: false,
    beta_start_date: null,
    beta_expiry_date: null,
    beta_status: undefined,
  },
  {
    id: 'student-sarah-103',
    email: 'sarah.j@example.com',
    fullName: 'Sarah Jenkins',
    role: 'student',
    accessType: 'BETA_TESTER',
    currentDay: 5,
    targetNiche: 'Customer Service & Support VA',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    createdAt: dates.fiveDaysAgo,
    simulationStartDate: dates.fiveDaysAgo,
    lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    is_beta_tester: true,
    beta_start_date: dates.fiveDaysAgo,
    beta_expiry_date: dates.expiryActive,
    beta_status: 'active',
    beta_duration: 14,
  },
  {
    id: 'student-david-104',
    email: 'david.kim@example.com',
    fullName: 'David Kim',
    role: 'student',
    accessType: 'FULL_STUDENT',
    currentDay: 27,
    targetNiche: 'Executive & Tech VA',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    simulationStartDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    lastActivity: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    is_beta_tester: false,
    beta_status: undefined,
  },
  {
    id: 'student-alexa-101',
    email: 'alexa.morales@example.com',
    fullName: 'Alexa Morales',
    role: 'student',
    accessType: 'BETA_TESTER',
    currentDay: 14,
    targetNiche: 'General Virtual Assistance',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    createdAt: dates.twentyDaysAgo,
    simulationStartDate: dates.twentyDaysAgo,
    lastActivity: dates.expiryExpired,
    is_beta_tester: true,
    beta_start_date: dates.twentyDaysAgo,
    beta_expiry_date: dates.expiryExpired,
    beta_status: 'expired',
    beta_duration: 14,
  },
  {
    id: 'student-marcus-102',
    email: 'marcus.vance@example.com',
    fullName: 'Marcus Vance',
    role: 'student',
    accessType: 'NOT_ACTIVATED',
    currentDay: 1,
    targetNiche: 'Real Estate & Transaction Coordinator',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    simulationStartDate: new Date().toISOString(),
    lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    is_beta_tester: false,
    beta_start_date: null,
    beta_expiry_date: null,
    beta_status: undefined,
  },
  {
    id: 'admin-owner-001',
    email: 'lightfuludu@gmail.com',
    fullName: 'Administrator (Owner)',
    role: 'admin',
    accessType: 'ADMIN',
    currentDay: 14,
    targetNiche: 'Executive & Tech VA',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    createdAt: '2026-08-01T00:00:00Z',
    simulationStartDate: '2026-08-01T00:00:00Z',
    lastActivity: new Date().toISOString(),
    is_beta_tester: false,
    beta_status: undefined,
  },
];

export function getStoredStudents(): StudentProfile[] {
  try {
    const raw = localStorage.getItem(REGISTRY_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(REGISTRY_STORAGE_KEY, JSON.stringify(INITIAL_REGISTERED_STUDENTS));
      return INITIAL_REGISTERED_STUDENTS;
    }
    const parsed: StudentProfile[] = JSON.parse(raw);
    
    // Ensure all students have proper accessType
    const normalized: StudentProfile[] = parsed.map((s) => {
      let accessType: AccessType = s.accessType || (s.role === 'admin' ? 'ADMIN' : (s.is_beta_tester ? 'BETA_TESTER' : 'NOT_ACTIVATED'));
      if (isConfiguredAdminEmail(s.email) || s.role === 'admin') {
        accessType = 'ADMIN';
      }
      return {
        ...s,
        accessType,
      };
    });

    // Make sure owner account exists in list
    if (!normalized.some((s) => s.email.toLowerCase() === 'lightfuludu@gmail.com')) {
      const owner = INITIAL_REGISTERED_STUDENTS.find((s) => s.email.toLowerCase() === 'lightfuludu@gmail.com');
      if (owner) normalized.push(owner);
      localStorage.setItem(REGISTRY_STORAGE_KEY, JSON.stringify(normalized));
    }

    return normalized;
  } catch {
    return INITIAL_REGISTERED_STUDENTS;
  }
}

export function saveStudents(students: StudentProfile[]): void {
  try {
    localStorage.setItem(REGISTRY_STORAGE_KEY, JSON.stringify(students));
  } catch {
    // Ignore error
  }
}

export function upsertStudent(student: StudentProfile): StudentProfile[] {
  const students = getStoredStudents();
  const index = students.findIndex((s) => s.id === student.id || s.email.toLowerCase() === student.email.toLowerCase());
  
  if (index >= 0) {
    students[index] = { ...students[index], ...student };
  } else {
    students.unshift(student);
  }
  
  saveStudents(students);
  return students;
}

export function activateStudentById(studentId: string): { updatedList: StudentProfile[]; updatedStudent?: StudentProfile } {
  const students = getStoredStudents();
  const index = students.findIndex((s) => s.id === studentId);
  if (index < 0) return { updatedList: students };

  const updated = activateStudentBeta(students[index]);
  students[index] = updated;
  saveStudents(students);
  return { updatedList: students, updatedStudent: updated };
}

export function reactivateStudentById(studentId: string): { updatedList: StudentProfile[]; updatedStudent?: StudentProfile } {
  return activateStudentById(studentId);
}

export function resetStudentToNotActivatedById(studentId: string): { updatedList: StudentProfile[]; updatedStudent?: StudentProfile } {
  const students = getStoredStudents();
  const index = students.findIndex((s) => s.id === studentId);
  if (index < 0) return { updatedList: students };

  const updated: StudentProfile = {
    ...students[index],
    accessType: 'NOT_ACTIVATED',
    role: 'student',
    is_beta_tester: false,
    beta_status: undefined,
    beta_start_date: null,
    beta_expiry_date: null,
    lastActivity: new Date().toISOString(),
  };
  students[index] = updated;
  saveStudents(students);
  return { updatedList: students, updatedStudent: updated };
}

export function extendStudentById(studentId: string, days: number = 7): { updatedList: StudentProfile[]; updatedStudent?: StudentProfile } {
  const students = getStoredStudents();
  const index = students.findIndex((s) => s.id === studentId);
  if (index < 0) return { updatedList: students };

  const updated = extendStudentBeta(students[index], days);
  students[index] = updated;
  saveStudents(students);
  return { updatedList: students, updatedStudent: updated };
}

export function expireStudentById(studentId: string): { updatedList: StudentProfile[]; updatedStudent?: StudentProfile } {
  const students = getStoredStudents();
  const index = students.findIndex((s) => s.id === studentId);
  if (index < 0) return { updatedList: students };

  const updated = expireStudentBeta(students[index]);
  students[index] = updated;
  saveStudents(students);
  return { updatedList: students, updatedStudent: updated };
}

export function revokeStudentById(studentId: string): { updatedList: StudentProfile[]; updatedStudent?: StudentProfile } {
  const students = getStoredStudents();
  const index = students.findIndex((s) => s.id === studentId);
  if (index < 0) return { updatedList: students };

  const updated = revokeStudentBeta(students[index]);
  students[index] = updated;
  saveStudents(students);
  return { updatedList: students, updatedStudent: updated };
}

export function grantFullAccessById(studentId: string): { updatedList: StudentProfile[]; updatedStudent?: StudentProfile } {
  const students = getStoredStudents();
  const index = students.findIndex((s) => s.id === studentId);
  if (index < 0) return { updatedList: students };

  const updated = grantFull90DayAccess(students[index]);
  students[index] = updated;
  saveStudents(students);
  return { updatedList: students, updatedStudent: updated };
}

export function grantAdminRoleById(studentId: string): { updatedList: StudentProfile[]; updatedStudent?: StudentProfile } {
  const students = getStoredStudents();
  const index = students.findIndex((s) => s.id === studentId);
  if (index < 0) return { updatedList: students };

  const updated = grantAdminAccess(students[index]);
  students[index] = updated;
  saveStudents(students);
  return { updatedList: students, updatedStudent: updated };
}

export function createCustomTestStudent(
  fullName: string,
  email: string,
  targetNiche: string = 'Executive & Tech VA',
  accessType: AccessType = 'NOT_ACTIVATED'
): { updatedList: StudentProfile[]; newStudent: StudentProfile } {
  const students = getStoredStudents();
  const newStudent: StudentProfile = {
    id: `student-test-${Date.now()}`,
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    role: accessType === 'ADMIN' ? 'admin' : 'student',
    accessType,
    currentDay: 1,
    targetNiche,
    avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80`,
    createdAt: new Date().toISOString(),
    simulationStartDate: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    is_beta_tester: accessType === 'BETA_TESTER',
    beta_status: accessType === 'BETA_TESTER' ? 'active' : undefined,
    beta_start_date: accessType === 'BETA_TESTER' ? new Date().toISOString() : null,
    beta_expiry_date: accessType === 'BETA_TESTER' ? calculateBetaExpiry(new Date().toISOString(), 14) : null,
    beta_duration: accessType === 'BETA_TESTER' ? 14 : undefined,
  };

  students.unshift(newStudent);
  saveStudents(students);
  return { updatedList: students, newStudent };
}
