import React, { useState } from 'react';
import {
  Clock,
  LogOut,
  RefreshCw,
  User,
  Mail,
  Briefcase,
  Shield,
  CheckCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSimulation } from '../../context/SimulationContext';

export const NotActivatedView: React.FC = () => {
  const { user, logout, refreshStudents, quickAdminLogin, quickStudentLogin } = useAuth();
  const { setActiveTab } = useSimulation();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshNotice, setRefreshNotice] = useState<string | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshStudents();
    setTimeout(() => {
      setIsRefreshing(false);
      setRefreshNotice('Account status checked. Currently pending administrator activation.');
      setTimeout(() => setRefreshNotice(null), 4000);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Bar */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between py-2 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-xs">
            CG
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">CoreGuide VA Simulator</h1>
            <p className="text-[11px] text-slate-400">Virtual Assistant Interactive Apprenticeship</p>
          </div>
        </div>

        <button
          onClick={() => logout()}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </header>

      {/* Main Notice Card */}
      <main className="max-w-xl w-full mx-auto my-auto py-8">
        <div className="bg-slate-800/90 backdrop-blur-xs rounded-2xl border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6">
          {/* Icon & Heading */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center shadow-inner">
              <Clock className="w-7 h-7" />
            </div>
            
            <div className="space-y-1.5">
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400/10 text-amber-400 border border-amber-400/20">
                <span>ACCESS STATUS: NOT ACTIVATED</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Your CoreGuide access has not been activated yet.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                Your registration has been successfully recorded. Simulation access is managed in cohorts and must be explicitly activated by the administrator.
              </p>
            </div>
          </div>

          {/* User Registration Details Card */}
          <div className="bg-slate-900/80 rounded-xl p-4 sm:p-5 border border-slate-700/80 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Registration Profile
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center space-x-2 text-slate-300">
                <User className="w-4 h-4 text-slate-500 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-500 block">Student Name</span>
                  <span className="font-semibold text-white truncate block">{user?.fullName || 'Registered Student'}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-slate-300">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-500 block">Email Address</span>
                  <span className="font-semibold text-white truncate block">{user?.email || '—'}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-slate-300">
                <Briefcase className="w-4 h-4 text-slate-500 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-500 block">Track Focus</span>
                  <span className="font-semibold text-indigo-300 truncate block">{user?.targetNiche || 'Executive & Tech VA'}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-slate-300">
                <Shield className="w-4 h-4 text-slate-500 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-500 block">Access Tier</span>
                  <span className="font-bold text-amber-400 block">NOT ACTIVATED</span>
                </div>
              </div>
            </div>
          </div>

          {/* Refresh notification */}
          {refreshNotice && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center space-x-2">
              <Clock className="w-4 h-4 shrink-0" />
              <span>{refreshNotice}</span>
            </div>
          )}

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="w-full sm:flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Checking Status...' : 'Check Activation Status'}</span>
            </button>

            <button
              onClick={() => logout()}
              className="w-full sm:w-auto py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-semibold transition-colors"
            >
              Sign Out
            </button>
          </div>

          {/* Admin / Testing Sandbox Quick Links */}
          <div className="pt-4 border-t border-slate-700/80 space-y-2">
            <p className="text-[11px] text-slate-400 text-center font-medium">
              Administrator & Beta Evaluation Testing Shortcuts:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  quickAdminLogin();
                  setActiveTab('admin');
                }}
                className="p-2.5 rounded-lg bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/50 text-purple-200 text-xs font-medium transition-colors flex items-center justify-center space-x-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                <span>Log in as ADMIN (Owner)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  quickStudentLogin('student-sarah-103');
                  setActiveTab('dashboard');
                }}
                className="p-2.5 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-800/50 text-indigo-200 text-xs font-medium transition-colors flex items-center justify-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Log in as BETA TESTER (Sarah)</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl w-full mx-auto text-center py-2 text-[11px] text-slate-500">
        CoreGuide Virtual Assistant Simulator • Version 1.0
      </footer>
    </div>
  );
};
