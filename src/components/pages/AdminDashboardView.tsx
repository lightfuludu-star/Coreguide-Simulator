import React, { useState } from 'react';
import {
  Users,
  Shield,
  Zap,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Award,
  RefreshCw,
  UserPlus,
  Mail,
  Sliders,
  Check,
  ChevronRight,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSimulation } from '../../context/SimulationContext';
import { StudentProfile, AccessType, BetaStatus } from '../../types';
import {
  isConfiguredAdminEmail,
  DEFAULT_ADMIN_EMAILS,
  addAdminEmail,
} from '../../utils/betaAccess';

interface AdminDashboardViewProps {
  onOpenTaskDetails?: (taskId: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = () => {
  const { user, switchStudentPerspective, registeredStudents, refreshStudents, createTestStudent } = useAuth();
  const {
    activateStudent,
    reactivateStudent,
    extendStudent,
    expireStudent,
    revokeStudent,
    resetStudentToNotActivated,
    grantFullAccess,
    grantAdmin,
    setActiveTab,
  } = useSimulation();

  const [activeSection, setActiveSection] = useState<'beta' | 'students' | 'progress' | 'config' | 'enroll'>('beta');
  const [searchTerm, setSearchTerm] = useState('');
  const [accessFilter, setAccessFilter] = useState<'ALL' | AccessType>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | BetaStatus>('ALL');
  const [confirmAction, setConfirmAction] = useState<{
    type: 'grant_full' | 'expire' | 'revoke' | 'make_admin' | 'reset_not_activated' | 'reactivate';
    student: StudentProfile;
  } | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [newAdminEmail, setNewAdminEmail] = useState('');

  // Enrollment Form State
  const [enrollName, setEnrollName] = useState('');
  const [enrollEmail, setEnrollEmail] = useState('');
  const [enrollTrack, setEnrollTrack] = useState('Executive & Tech VA');
  const [enrollAccessType, setEnrollAccessType] = useState<AccessType>('NOT_ACTIVATED');

  const showToast = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const students = registeredStudents;

  // Filter students based on search and filters
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.targetNiche.toLowerCase().includes(searchTerm.toLowerCase());

    const isAdm = s.role === 'admin' || s.accessType === 'ADMIN' || isConfiguredAdminEmail(s.email);
    const actualAccessType: AccessType = isAdm ? 'ADMIN' : (s.accessType || (s.is_beta_tester ? 'BETA_TESTER' : 'NOT_ACTIVATED'));

    const matchesAccess =
      accessFilter === 'ALL' ||
      (accessFilter === 'ADMIN' && actualAccessType === 'ADMIN') ||
      (accessFilter === 'FULL_STUDENT' && actualAccessType === 'FULL_STUDENT') ||
      (accessFilter === 'BETA_TESTER' && actualAccessType === 'BETA_TESTER') ||
      (accessFilter === 'NOT_ACTIVATED' && actualAccessType === 'NOT_ACTIVATED');

    const matchesStatus =
      statusFilter === 'ALL' ||
      s.beta_status === statusFilter ||
      (!s.beta_status && statusFilter === 'not_started');

    return matchesSearch && matchesAccess && matchesStatus;
  });

  // Metrics
  const totalStudents = students.length;
  const notActivatedCount = students.filter((s) => !isConfiguredAdminEmail(s.email) && s.role !== 'admin' && s.accessType === 'NOT_ACTIVATED').length;
  const activeBetaCount = students.filter((s) => s.accessType === 'BETA_TESTER' && s.beta_status === 'active').length;
  const expiredBetaCount = students.filter((s) => s.accessType === 'BETA_TESTER' && s.beta_status === 'expired').length;
  const fullAccessCount = students.filter((s) => s.accessType === 'FULL_STUDENT').length;
  const adminCount = students.filter((s) => s.role === 'admin' || s.accessType === 'ADMIN' || isConfiguredAdminEmail(s.email)).length;

  const handleActivateBeta = (student: StudentProfile) => {
    activateStudent(student.id);
    showToast(`Beta access activated for ${student.fullName}! AccessType set to BETA_TESTER (14-day window started).`);
  };

  const handleReactivateBeta = (student: StudentProfile) => {
    reactivateStudent(student.id);
    setConfirmAction(null);
    showToast(`Beta access renewed for ${student.fullName}! 14-day window reset.`);
  };

  const handleExtendBeta = (student: StudentProfile) => {
    extendStudent(student.id, 7);
    showToast(`Extended beta access for ${student.fullName} by +7 calendar days.`);
  };

  const handleExpireBeta = (student: StudentProfile) => {
    expireStudent(student.id);
    setConfirmAction(null);
    showToast(`Beta access for ${student.fullName} has been set to EXPIRED.`);
  };

  const handleRevokeBeta = (student: StudentProfile) => {
    revokeStudent(student.id);
    setConfirmAction(null);
    showToast(`Access for ${student.fullName} has been TEMPORARILY DISABLED (Revoked).`);
  };

  const handleResetToNotActivated = (student: StudentProfile) => {
    resetStudentToNotActivated(student.id);
    setConfirmAction(null);
    showToast(`Access for ${student.fullName} reset to NOT_ACTIVATED.`);
  };

  const handleGrantFullAccess = (student: StudentProfile) => {
    grantFullAccess(student.id);
    setConfirmAction(null);
    showToast(`Full 90-Day Access granted to ${student.fullName}! All beta restrictions removed.`);
  };

  const handleGrantAdmin = (student: StudentProfile) => {
    grantAdmin(student.id);
    setConfirmAction(null);
    showToast(`Administrator privileges designated to ${student.fullName} (${student.email}).`);
  };

  const handleAddAdminEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail || !newAdminEmail.includes('@')) return;
    addAdminEmail(newAdminEmail.trim());
    refreshStudents();
    setNewAdminEmail('');
    showToast(`Added ${newAdminEmail.trim()} to authorized administrator accounts.`);
  };

  const handleEnrollStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollName.trim() || !enrollEmail.trim()) {
      showToast('Please enter both student name and email.');
      return;
    }
    const created = createTestStudent(enrollName, enrollEmail, enrollTrack, enrollAccessType);
    setEnrollName('');
    setEnrollEmail('');
    showToast(`Enrolled new student ${created.fullName} as ${created.accessType}!`);
    setActiveSection('beta');
  };

  const handleSwitchPerspective = (student: StudentProfile) => {
    switchStudentPerspective(student);
    setActiveTab('dashboard');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Toast Notification */}
      {actionSuccessMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-indigo-500/50 flex items-center space-x-3 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* 1. Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2.5">
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span>CoreGuide Administration</span>
            </span>
            <span className="text-xs text-slate-400">
              Logged in as: <strong className="text-white">{user?.email}</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Admin Management Console
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Manage student access tiers, activate 14-day beta testing windows, review student progress, and grant Full 90-Day Simulation access.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors flex items-center space-x-2"
          >
            <span>Return to Simulator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Total Students
          </span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">{totalStudents}</span>
          <span className="text-[10px] text-slate-400">Registered</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-indigo-200 bg-indigo-50/20 shadow-xs">
          <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider block">
            Active Beta
          </span>
          <span className="text-xl font-bold text-indigo-900 mt-1 block">{activeBetaCount}</span>
          <span className="text-[10px] text-indigo-600">14-Day Active</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-xs">
          <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block">
            Not Activated
          </span>
          <span className="text-xl font-bold text-amber-900 mt-1 block">{notActivatedCount}</span>
          <span className="text-[10px] text-amber-600">Pending Activation</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/20 shadow-xs">
          <span className="text-[11px] font-semibold text-rose-600 uppercase tracking-wider block">
            Beta Expired
          </span>
          <span className="text-xl font-bold text-rose-900 mt-1 block">{expiredBetaCount}</span>
          <span className="text-[10px] text-rose-500">Read-Only Mode</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block">
            Full Access
          </span>
          <span className="text-xl font-bold text-emerald-900 mt-1 block">{fullAccessCount}</span>
          <span className="text-[10px] text-emerald-600">90-Day Curriculum</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-purple-200 bg-purple-50/20 shadow-xs">
          <span className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider block">
            Administrators
          </span>
          <span className="text-xl font-bold text-purple-900 mt-1 block">{adminCount}</span>
          <span className="text-[10px] text-purple-600">Full Testing</span>
        </div>
      </div>

      {/* 3. Section Navigation Tabs */}
      <div className="flex border-b border-slate-200 space-x-2 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveSection('beta')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all border-b-2 whitespace-nowrap flex items-center space-x-2 ${
            activeSection === 'beta'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Beta Management Queue</span>
        </button>

        <button
          onClick={() => setActiveSection('students')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all border-b-2 whitespace-nowrap flex items-center space-x-2 ${
            activeSection === 'students'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>All Registered Users Directory</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
            {students.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSection('enroll')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all border-b-2 whitespace-nowrap flex items-center space-x-2 ${
            activeSection === 'enroll'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Enroll / Test Student Generator</span>
        </button>

        <button
          onClick={() => setActiveSection('progress')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all border-b-2 whitespace-nowrap flex items-center space-x-2 ${
            activeSection === 'progress'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Student Progress & Milestones</span>
        </button>

        <button
          onClick={() => setActiveSection('config')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all border-b-2 whitespace-nowrap flex items-center space-x-2 ${
            activeSection === 'config'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Admin Roles & Accounts</span>
        </button>
      </div>

      {/* 4. Filter and Search Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search students by name, email, or track..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Access Filter */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-400 text-[11px] font-medium">Access:</span>
            <select
              value={accessFilter}
              onChange={(e) => setAccessFilter(e.target.value as any)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="ALL">All Access Tiers</option>
              <option value="NOT_ACTIVATED">NOT ACTIVATED (Pending)</option>
              <option value="BETA_TESTER">BETA TESTER (14-Day)</option>
              <option value="FULL_STUDENT">FULL STUDENT (90-Day)</option>
              <option value="ADMIN">ADMINISTRATOR</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-400 text-[11px] font-medium">Beta Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="ALL">All Statuses</option>
              <option value="not_started">Not Started</option>
              <option value="active">Active (14-Day)</option>
              <option value="expired">Expired</option>
              <option value="revoked">Revoked / Disabled</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 1: BETA MANAGEMENT VIEW */}
      {activeSection === 'beta' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                User Access & Beta Activation Queue
              </h2>
              <p className="text-xs text-slate-500">
                Activate pending registrations, extend beta windows, or transition students to Full 90-Day Access.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Showing {filteredStudents.length} of {students.length} accounts
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {filteredStudents.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
                No students match your filter criteria.
              </div>
            ) : (
              filteredStudents.map((student) => {
                const isAdmin = student.role === 'admin' || student.accessType === 'ADMIN' || isConfiguredAdminEmail(student.email);
                const isFull = student.accessType === 'FULL_STUDENT';
                const isNotActivated = !isAdmin && !isFull && (student.accessType === 'NOT_ACTIVATED' || (!student.is_beta_tester && !student.accessType));
                const isBeta = !isAdmin && !isFull && !isNotActivated;
                const status = student.beta_status || (student.beta_start_date ? 'active' : 'not_started');

                return (
                  <div
                    key={student.id}
                    className={`bg-white rounded-2xl p-5 border transition-all shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5 ${
                      isNotActivated
                        ? 'border-amber-300 bg-amber-50/20 ring-1 ring-amber-300/40'
                        : isBeta && status === 'active'
                        ? 'border-indigo-200/80 bg-white'
                        : isBeta && status === 'expired'
                        ? 'border-rose-200/80 bg-rose-50/10'
                        : isFull
                        ? 'border-emerald-200/80 bg-emerald-50/10'
                        : 'border-slate-200'
                    }`}
                  >
                    {/* Student Basic Information */}
                    <div className="flex items-start space-x-3.5 min-w-0 flex-1">
                      <img
                        src={student.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
                        alt={student.fullName}
                        className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0 mt-0.5"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900 truncate">
                            {student.fullName}
                          </h3>
                          {isAdmin ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                              ADMIN
                            </span>
                          ) : isFull ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              FULL_STUDENT (90-DAY)
                            </span>
                          ) : isNotActivated ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                              NOT ACTIVATED
                            </span>
                          ) : (
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                status === 'active'
                                  ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                                  : status === 'expired'
                                  ? 'bg-rose-100 text-rose-800 border-rose-200'
                                  : 'bg-slate-200 text-slate-700 border-slate-300'
                              }`}
                            >
                              BETA_TESTER: {status.toUpperCase()}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-500 flex items-center space-x-2">
                          <span>{student.email}</span>
                          <span>•</span>
                          <span className="text-slate-700 font-medium">{student.targetNiche}</span>
                        </p>

                        {/* Dates & Timeline info */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 pt-1">
                          <span>
                            Sim Day: <strong className="text-slate-800">Day {student.currentDay}/90</strong>
                          </span>
                          {isNotActivated && (
                            <span className="text-amber-700 font-medium">
                              Registered User • Awaiting Beta Activation
                            </span>
                          )}
                          {isBeta && student.beta_start_date && (
                            <span>
                              Beta Start:{' '}
                              <strong className="text-slate-700">
                                {new Date(student.beta_start_date).toLocaleDateString()}
                              </strong>
                            </span>
                          )}
                          {isBeta && student.beta_expiry_date && (
                            <span>
                              Beta Expiry:{' '}
                              <strong className={status === 'expired' ? 'text-rose-600' : 'text-slate-700'}>
                                {new Date(student.beta_expiry_date).toLocaleDateString()}
                              </strong>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons for this Student */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
                      {/* 1. ACTIVATE BETA BUTTON FOR NOT_ACTIVATED */}
                      {isNotActivated && (
                        <button
                          onClick={() => handleActivateBeta(student)}
                          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5 animate-pulse"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>ACTIVATE BETA</span>
                        </button>
                      )}

                      {/* 2. REACTIVATE BETA FOR EXPIRED / REVOKED */}
                      {isBeta && (status === 'expired' || status === 'revoked') && (
                        <button
                          onClick={() =>
                            setConfirmAction({
                              type: 'reactivate',
                              student,
                            })
                          }
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center space-x-1"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Reactivate Beta (14d)</span>
                        </button>
                      )}

                      {/* 3. EXTEND BETA BY 7 DAYS */}
                      {isBeta && status === 'active' && (
                        <button
                          onClick={() => handleExtendBeta(student)}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>+7 Days Beta</span>
                        </button>
                      )}

                      {/* 4. EXPIRE BETA */}
                      {isBeta && status === 'active' && (
                        <button
                          onClick={() =>
                            setConfirmAction({
                              type: 'expire',
                              student,
                            })
                          }
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition-colors"
                        >
                          Expire Beta
                        </button>
                      )}

                      {/* 5. RESET TO NOT ACTIVATED */}
                      {(isBeta || isFull) && (
                        <button
                          onClick={() =>
                            setConfirmAction({
                              type: 'reset_not_activated',
                              student,
                            })
                          }
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                          title="Reset student access to NOT_ACTIVATED"
                        >
                          Reset to Not Activated
                        </button>
                      )}

                      {/* 6. GRANT FULL 90-DAY ACCESS */}
                      {!isFull && !isAdmin && (
                        <button
                          onClick={() =>
                            setConfirmAction({
                              type: 'grant_full',
                              student,
                            })
                          }
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1"
                        >
                          <Award className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Grant Full 90-Day</span>
                        </button>
                      )}

                      {/* Switch Simulator Perspective (Test As this student) */}
                      <button
                        onClick={() => handleSwitchPerspective(student)}
                        title="Open simulator from this student's perspective"
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-medium transition-colors flex items-center space-x-1"
                      >
                        <span>Test View</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: ALL REGISTERED STUDENTS DIRECTORY */}
      {activeSection === 'students' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Registered Users & Trainees Matrix
              </h2>
              <p className="text-xs text-slate-500">
                Complete directory of registered accounts categorized by access role
              </p>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {filteredStudents.length} accounts shown
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3.5">Student / Email</th>
                  <th className="px-5 py-3.5">VA Specialization</th>
                  <th className="px-5 py-3.5">Access Role</th>
                  <th className="px-5 py-3.5">Beta Status</th>
                  <th className="px-5 py-3.5">Beta Expiry</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((s) => {
                  const isAdmin = s.role === 'admin' || s.accessType === 'ADMIN' || isConfiguredAdminEmail(s.email);
                  const isFull = s.accessType === 'FULL_STUDENT';
                  const isNotActivated = !isAdmin && !isFull && (s.accessType === 'NOT_ACTIVATED' || (!s.is_beta_tester && !s.accessType));
                  const isBeta = !isAdmin && !isFull && !isNotActivated;
                  const status = s.beta_status || (s.beta_start_date ? 'active' : 'not_started');

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={s.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'}
                            alt={s.fullName}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{s.fullName}</span>
                            <span className="text-slate-400 text-[11px]">{s.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-700">{s.targetNiche}</td>
                      <td className="px-5 py-4">
                        {isAdmin ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                            ADMIN
                          </span>
                        ) : isFull ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            FULL_STUDENT
                          </span>
                        ) : isNotActivated ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            NOT_ACTIVATED
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                            BETA_TESTER
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {isAdmin || isFull || isNotActivated ? (
                          <span className="text-slate-400">—</span>
                        ) : (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              status === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : status === 'expired'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {status}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-slate-500 text-[11px]">
                        {s.beta_expiry_date ? new Date(s.beta_expiry_date).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {isNotActivated && (
                            <button
                              onClick={() => handleActivateBeta(s)}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-[11px] font-bold"
                            >
                              Activate Beta
                            </button>
                          )}
                          <button
                            onClick={() => handleSwitchPerspective(s)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-semibold"
                          >
                            Inspect View
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: ENROLL / TEST STUDENT GENERATOR */}
      {activeSection === 'enroll' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Enroll / Test Student Generator
            </h2>
            <p className="text-xs text-slate-500">
              Create test students to verify the NOT_ACTIVATED, BETA_TESTER, or FULL_STUDENT experience without altering the administrator account.
            </p>
          </div>

          <form onSubmit={handleEnrollStudentSubmit} className="space-y-4 max-w-lg">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Full Name:
              </label>
              <input
                type="text"
                value={enrollName}
                onChange={(e) => setEnrollName(e.target.value)}
                placeholder="e.g. Jordan Miller"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Email Address:
              </label>
              <input
                type="email"
                value={enrollEmail}
                onChange={(e) => setEnrollEmail(e.target.value)}
                placeholder="e.g. jordan.m@example.com"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Target VA Track / Specialization:
              </label>
              <select
                value={enrollTrack}
                onChange={(e) => setEnrollTrack(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="Executive & Tech VA">Executive & Tech VA</option>
                <option value="E-Commerce Operations VA">E-Commerce Operations VA</option>
                <option value="Real Estate VA">Real Estate VA</option>
                <option value="Social Media & Marketing VA">Social Media & Marketing VA</option>
                <option value="Customer Support Specialist">Customer Support Specialist</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Initial Access Role:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setEnrollAccessType('NOT_ACTIVATED')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    enrollAccessType === 'NOT_ACTIVATED'
                      ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold ring-1 ring-amber-500'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="block font-bold">NOT ACTIVATED</span>
                  <span className="text-[10px] text-slate-500">Default for new signups</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEnrollAccessType('BETA_TESTER')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    enrollAccessType === 'BETA_TESTER'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-900 font-bold ring-1 ring-indigo-500'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="block font-bold">BETA TESTER</span>
                  <span className="text-[10px] text-slate-500">14-Day Simulation Window</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEnrollAccessType('FULL_STUDENT')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    enrollAccessType === 'FULL_STUDENT'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-500'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="block font-bold">FULL STUDENT</span>
                  <span className="text-[10px] text-slate-500">Unrestricted 90-Day Access</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create & Enroll Student</span>
            </button>
          </form>
        </div>
      )}

      {/* SECTION 4: STUDENT PROGRESS & SCORECARDS */}
      {activeSection === 'progress' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Student Competency & Milestone Summary
            </h2>
            <p className="text-xs text-slate-500">
              Overview of student progression across the 6 simulation milestones
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStudents.map((s) => (
              <div key={s.id} className="p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={s.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'}
                      alt={s.fullName}
                      className="w-8 h-8 rounded-full object-cover border"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">{s.fullName}</span>
                      <span className="text-[11px] text-slate-400">{s.targetNiche}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    Day {s.currentDay} / 90
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>90-Day Simulation Progress</span>
                    <span>{Math.round((s.currentDay / 90) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-1.5 rounded-full"
                      style={{ width: `${(s.currentDay / 90) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500 border-t border-slate-100">
                  <span>Access: <strong className="text-slate-800">{s.accessType || 'NOT_ACTIVATED'}</strong></span>
                  <button
                    onClick={() => handleSwitchPerspective(s)}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center space-x-0.5"
                  >
                    <span>View Student Dashboard</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: ADMIN DESIGNATION & ROLES */}
      {activeSection === 'config' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Administrator Accounts & Access Control
            </h2>
            <p className="text-xs text-slate-500">
              Configure authorized administrator emails and system access policies
            </p>
          </div>

          {/* Current Admin Account Card */}
          <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 space-y-2">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-purple-700" />
              <span className="text-xs font-bold text-purple-900">Application Owner / Current Administrator</span>
            </div>
            <p className="text-xs text-purple-800">
              Your active session (<strong className="font-semibold">{user?.email}</strong>) has full administrator testing privileges. You are not subject to 14-day beta expirations.
            </p>
          </div>

          {/* Authorized Admin List */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Configured Administrator Emails
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DEFAULT_ADMIN_EMAILS.map((admEmail) => (
                <div
                  key={admEmail}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium text-slate-800">{admEmail}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                    OWNER / ADMIN
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Administrator */}
          <form onSubmit={handleAddAdminEmailSubmit} className="space-y-3 pt-3 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-800 block">
              Designate Additional Administrator Email:
            </span>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md">
              <input
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="colleague@example.com"
                className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors shrink-0"
              >
                Add Administrator
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {confirmAction && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3">
              <div
                className={`p-2.5 rounded-xl ${
                  confirmAction.type === 'grant_full'
                    ? 'bg-emerald-100 text-emerald-700'
                    : confirmAction.type === 'reactivate'
                    ? 'bg-indigo-100 text-indigo-700'
                    : confirmAction.type === 'expire'
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {confirmAction.type === 'grant_full' ? (
                  <Award className="w-5 h-5" />
                ) : confirmAction.type === 'reactivate' ? (
                  <RefreshCw className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {confirmAction.type === 'grant_full'
                    ? 'Grant Full 90-Day Access?'
                    : confirmAction.type === 'reactivate'
                    ? 'Reactivate Beta Window?'
                    : confirmAction.type === 'expire'
                    ? 'Expire Beta Access?'
                    : confirmAction.type === 'reset_not_activated'
                    ? 'Reset to NOT_ACTIVATED?'
                    : 'Revoke Access?'}
                </h3>
                <p className="text-xs text-slate-500">
                  Target Student: <strong className="text-slate-800">{confirmAction.student.fullName}</strong>
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {confirmAction.type === 'grant_full' && (
                <>
                  This is a deliberate administrator action that changes the student&apos;s access role to{' '}
                  <strong className="text-slate-900">FULL_STUDENT</strong>. All beta expirations and 14-day caps will be permanently removed, allowing full access to all 6 simulation stages (Days 1–90).
                </>
              )}
              {confirmAction.type === 'reactivate' && (
                <>
                  This will reactivate the 14-day beta testing window for this student, resetting their start date to today and extending expiration by 14 days.
                </>
              )}
              {confirmAction.type === 'expire' && (
                <>
                  This will transition the student&apos;s beta access to <strong className="text-rose-700">EXPIRED</strong>. Their deliverable submissions will be closed, while past scorecards and chat history remain preserved.
                </>
              )}
              {confirmAction.type === 'reset_not_activated' && (
                <>
                  This will set this student&apos;s access type back to <strong className="text-amber-800">NOT_ACTIVATED</strong>. They will see the pending activation screen until you activate them again.
                </>
              )}
              {confirmAction.type === 'revoke' && (
                <>
                  This will temporarily disable access for this student account with the notice:{' '}
                  <em>&ldquo;Your CoreGuide access has been temporarily disabled.&rdquo;</em>
                </>
              )}
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmAction.type === 'grant_full') {
                    handleGrantFullAccess(confirmAction.student);
                  } else if (confirmAction.type === 'reactivate') {
                    handleReactivateBeta(confirmAction.student);
                  } else if (confirmAction.type === 'expire') {
                    handleExpireBeta(confirmAction.student);
                  } else if (confirmAction.type === 'reset_not_activated') {
                    handleResetToNotActivated(confirmAction.student);
                  } else if (confirmAction.type === 'revoke') {
                    handleRevokeBeta(confirmAction.student);
                  }
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-colors shadow-xs ${
                  confirmAction.type === 'grant_full'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : confirmAction.type === 'reactivate'
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : confirmAction.type === 'expire'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-slate-900 hover:bg-slate-800'
                }`}
              >
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
