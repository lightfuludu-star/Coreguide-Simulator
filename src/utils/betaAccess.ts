import { StudentProfile, AccessType, BetaStatus } from '../types';

export const BETA_DURATION_DAYS = 14;
export const BETA_MAX_SIMULATION_DAY = 14;

// Default Administrator Designation (App Owner)
export const DEFAULT_ADMIN_EMAILS = [
  'lightfuludu@gmail.com',
  'admin@coreguide.io',
  'owner@coreguide.io',
];

/**
 * Checks if a given email is a configured administrator.
 */
export function isConfiguredAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  
  // Check default list
  if (DEFAULT_ADMIN_EMAILS.some((adm) => adm.toLowerCase() === clean)) {
    return true;
  }

  // Check custom admins in localStorage
  try {
    const custom = localStorage.getItem('coreguide_custom_admin_emails');
    if (custom) {
      const list: string[] = JSON.parse(custom);
      if (list.some((adm) => adm.toLowerCase() === clean)) {
        return true;
      }
    }
  } catch {
    // Ignore error
  }

  return false;
}

/**
 * Adds an email to the administrator whitelist.
 */
export function addAdminEmail(email: string): void {
  const clean = email.trim().toLowerCase();
  try {
    const custom = localStorage.getItem('coreguide_custom_admin_emails');
    const list: string[] = custom ? JSON.parse(custom) : [];
    if (!list.includes(clean)) {
      list.push(clean);
      localStorage.setItem('coreguide_custom_admin_emails', JSON.stringify(list));
    }
  } catch {
    // Ignore error
  }
}

/**
 * Checks if a student profile is an administrator.
 */
export function isAdminUser(user: StudentProfile | null | { email?: string; role?: string; accessType?: AccessType }): boolean {
  if (!user) return false;
  if (user.role === 'admin' || user.accessType === 'ADMIN') return true;
  if (user.email && isConfiguredAdminEmail(user.email)) return true;
  return false;
}

/**
 * Calculates the beta expiration timestamp.
 */
export function calculateBetaExpiry(
  startDateStr?: string | null,
  durationDays: number = BETA_DURATION_DAYS
): string {
  const start = startDateStr ? new Date(startDateStr) : new Date();
  const expiry = new Date(start.getTime() + durationDays * 24 * 60 * 60 * 1000);
  return expiry.toISOString();
}

export interface BetaAccessState {
  accessType: AccessType;
  isBetaTester: boolean;
  status: BetaStatus;
  startDate: string | null;
  expiryDate: string | null;
  durationDays: number;
  currentBetaDay: number; // Calendar day: 1 to 14
  daysRemaining: number; // 0 to 14
  isExpired: boolean;
  isRevoked: boolean;
  isNotStarted: boolean;
  canPerformTasks: boolean; // false when not_started, expired, or revoked
  maxAllowedSimulationDay: number; // 14 for beta testers, 90 for unrestricted/admin
  statusMessage: string | null;
}

/**
 * Derives the active access and beta state for a user profile.
 */
export function getBetaAccessState(user: StudentProfile | null): BetaAccessState {
  if (!user) {
    return {
      accessType: 'NOT_ACTIVATED',
      isBetaTester: false,
      status: 'not_started',
      startDate: null,
      expiryDate: null,
      durationDays: 0,
      currentBetaDay: 0,
      daysRemaining: 0,
      isExpired: false,
      isRevoked: false,
      isNotStarted: true,
      canPerformTasks: false,
      maxAllowedSimulationDay: 1,
      statusMessage: 'Your CoreGuide access has not been activated yet.',
    };
  }

  // 1. ADMIN CHECK
  // The administrator must NOT be subject to beta expiration and must NOT see beta banners.
  if (isAdminUser(user)) {
    return {
      accessType: 'ADMIN',
      isBetaTester: false,
      status: 'active',
      startDate: user.createdAt || new Date().toISOString(),
      expiryDate: null,
      durationDays: 90,
      currentBetaDay: 1,
      daysRemaining: 90,
      isExpired: false,
      isRevoked: false,
      isNotStarted: false,
      canPerformTasks: true,
      maxAllowedSimulationDay: 90,
      statusMessage: null,
    };
  }

  // 2. FULL_STUDENT CHECK
  // A FULL_STUDENT has access to the complete 90-day simulation and is not restricted by beta expiry.
  if (user.accessType === 'FULL_STUDENT') {
    return {
      accessType: 'FULL_STUDENT',
      isBetaTester: false,
      status: 'active',
      startDate: user.createdAt || new Date().toISOString(),
      expiryDate: null,
      durationDays: 90,
      currentBetaDay: 1,
      daysRemaining: 90,
      isExpired: false,
      isRevoked: false,
      isNotStarted: false,
      canPerformTasks: true,
      maxAllowedSimulationDay: 90,
      statusMessage: null,
    };
  }

  // 3. NOT_ACTIVATED CHECK
  // Registered student whose account has not been activated into Beta or Full Access yet.
  if (user.accessType === 'NOT_ACTIVATED') {
    return {
      accessType: 'NOT_ACTIVATED',
      isBetaTester: false,
      status: 'not_started',
      startDate: null,
      expiryDate: null,
      durationDays: 0,
      currentBetaDay: 0,
      daysRemaining: 0,
      isExpired: false,
      isRevoked: false,
      isNotStarted: true,
      canPerformTasks: false,
      maxAllowedSimulationDay: 1,
      statusMessage: 'Your CoreGuide access has not been activated yet.',
    };
  }

  // 4. BETA_TESTER CHECK
  const accessType: AccessType = 'BETA_TESTER';
  const rawStatus: BetaStatus = user.beta_status || (user.beta_start_date ? 'active' : 'not_started');

  // Case A: Beta Not Started
  if (rawStatus === 'not_started' || (!user.beta_start_date && rawStatus !== 'active' && rawStatus !== 'expired' && rawStatus !== 'revoked')) {
    return {
      accessType,
      isBetaTester: true,
      status: 'not_started',
      startDate: null,
      expiryDate: null,
      durationDays: BETA_DURATION_DAYS,
      currentBetaDay: 1,
      daysRemaining: 14,
      isExpired: false,
      isRevoked: false,
      isNotStarted: true,
      canPerformTasks: false,
      maxAllowedSimulationDay: BETA_MAX_SIMULATION_DAY,
      statusMessage: 'Your beta access has not been activated yet.',
    };
  }

  // Case B: Beta Revoked
  if (rawStatus === 'revoked') {
    return {
      accessType,
      isBetaTester: true,
      status: 'revoked',
      startDate: user.beta_start_date || null,
      expiryDate: user.beta_expiry_date || null,
      durationDays: BETA_DURATION_DAYS,
      currentBetaDay: 1,
      daysRemaining: 0,
      isExpired: false,
      isRevoked: true,
      isNotStarted: false,
      canPerformTasks: false,
      maxAllowedSimulationDay: BETA_MAX_SIMULATION_DAY,
      statusMessage: 'Your CoreGuide access has been temporarily disabled.',
    };
  }

  // Case C: Active or Expired
  const startDate = user.beta_start_date || user.simulationStartDate || user.createdAt || new Date().toISOString();
  const durationDays = user.beta_duration || BETA_DURATION_DAYS;
  const expiryDate = user.beta_expiry_date || calculateBetaExpiry(startDate, durationDays);

  const nowMs = Date.now();
  const startMs = new Date(startDate).getTime();
  const expiryMs = new Date(expiryDate).getTime();

  // Check expiration by calendar time
  const hasExpired = nowMs >= expiryMs || rawStatus === 'expired';
  const status: BetaStatus = hasExpired ? 'expired' : 'active';

  // Calculate current calendar day of beta (1 to 14)
  const diffMs = nowMs - startMs;
  let currentBetaDay = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  if (currentBetaDay < 1) currentBetaDay = 1;
  if (currentBetaDay > durationDays) currentBetaDay = durationDays;

  // Calculate remaining calendar days
  const remainingMs = Math.max(0, expiryMs - nowMs);
  const daysRemaining = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));

  const isExpired = status === 'expired';
  const canPerformTasks = !isExpired;

  return {
    accessType,
    isBetaTester: true,
    status,
    startDate,
    expiryDate,
    durationDays,
    currentBetaDay,
    daysRemaining,
    isExpired,
    isRevoked: false,
    isNotStarted: false,
    canPerformTasks,
    maxAllowedSimulationDay: BETA_MAX_SIMULATION_DAY,
    statusMessage: isExpired ? 'Your CoreGuide beta period has ended.' : null,
  };
}

/**
 * Activates beta access for a student.
 */
export function activateStudentBeta(
  user: StudentProfile,
  customStartDate?: string
): StudentProfile {
  const start = customStartDate || new Date().toISOString();
  const expiry = calculateBetaExpiry(start, BETA_DURATION_DAYS);

  return {
    ...user,
    accessType: 'BETA_TESTER',
    is_beta_tester: true,
    beta_start_date: start,
    beta_expiry_date: expiry,
    beta_status: 'active',
    beta_duration: BETA_DURATION_DAYS,
    currentDay: user.currentDay && user.currentDay > 0 ? user.currentDay : 1,
    lastActivity: new Date().toISOString(),
  };
}

/**
 * Reactivates beta access for an expired student (gives a new 14-day window).
 */
export function reactivateStudentBeta(user: StudentProfile): StudentProfile {
  return activateStudentBeta(user);
}

/**
 * Extends beta access by specified days (default 7 days).
 */
export function extendStudentBeta(
  user: StudentProfile,
  extraDays: number = 7
): StudentProfile {
  const baseExpiry = user.beta_expiry_date && new Date(user.beta_expiry_date).getTime() > Date.now()
    ? new Date(user.beta_expiry_date)
    : new Date();
  
  const newExpiry = new Date(baseExpiry.getTime() + extraDays * 24 * 60 * 60 * 1000).toISOString();

  return {
    ...user,
    accessType: 'BETA_TESTER',
    is_beta_tester: true,
    beta_expiry_date: newExpiry,
    beta_status: 'active',
    lastActivity: new Date().toISOString(),
  };
}

/**
 * Marks beta access as expired.
 */
export function expireStudentBeta(user: StudentProfile): StudentProfile {
  return {
    ...user,
    accessType: 'BETA_TESTER',
    is_beta_tester: true,
    beta_status: 'expired',
    lastActivity: new Date().toISOString(),
  };
}

/**
 * Revokes beta access.
 */
export function revokeStudentBeta(user: StudentProfile): StudentProfile {
  return {
    ...user,
    accessType: 'BETA_TESTER',
    is_beta_tester: true,
    beta_status: 'revoked',
    lastActivity: new Date().toISOString(),
  };
}

/**
 * Resets user back to NOT_ACTIVATED status.
 */
export function resetToNotActivated(user: StudentProfile): StudentProfile {
  return {
    ...user,
    accessType: 'NOT_ACTIVATED',
    role: 'student',
    is_beta_tester: false,
    beta_status: undefined,
    beta_start_date: null,
    beta_expiry_date: null,
    lastActivity: new Date().toISOString(),
  };
}

/**
 * Deliberate administrator action to grant complete 90-day access.
 */
export function grantFull90DayAccess(user: StudentProfile): StudentProfile {
  return {
    ...user,
    accessType: 'FULL_STUDENT',
    role: 'student',
    is_beta_tester: false,
    beta_status: undefined,
    beta_start_date: null,
    beta_expiry_date: null,
    currentDay: user.currentDay && user.currentDay > 0 ? user.currentDay : 1,
    lastActivity: new Date().toISOString(),
  };
}

/**
 * Designates user as administrator.
 */
export function grantAdminAccess(user: StudentProfile): StudentProfile {
  addAdminEmail(user.email);
  return {
    ...user,
    accessType: 'ADMIN',
    role: 'admin',
    is_beta_tester: false,
    beta_status: undefined,
    beta_start_date: null,
    beta_expiry_date: null,
    lastActivity: new Date().toISOString(),
  };
}
