import React from 'react';
import {
  Home,
  UserCheck,
  CheckSquare,
  MessageSquare,
  TrendingUp,
  LogOut,
  ArrowRightLeft,
  Shield,
} from 'lucide-react';
import { useSimulation, NavigationTab } from '../../context/SimulationContext';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const {
    activeTab,
    setActiveTab,
    currentDay,
    tasks,
    activeService,
    setIsOnboardingOpen,
    currentStage,
    betaState,
  } = useSimulation();
  const { user, logout, isAdmin } = useAuth();

  const pendingTasksCount = tasks.filter((t) => t.status === 'in_progress' || t.status === 'pending').length;

  // The 5 Core V1 Areas for Students
  const navItems: { id: NavigationTab; label: string; icon: React.FC<{ className?: string }>; badge?: string | number }[] = [
    { id: 'dashboard', label: 'HOME', icon: Home },
    { id: 'client', label: 'MY CLIENT', icon: UserCheck },
    { id: 'tasks', label: "TODAY'S TASK", icon: CheckSquare, badge: pendingTasksCount > 0 ? pendingTasksCount : undefined },
    { id: 'chat', label: 'CLIENT CHAT', icon: MessageSquare },
    { id: 'progress', label: 'MY PROGRESS', icon: TrendingUp },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    setMobileOpen(false);
  };

  const isBetaStudent = !isAdmin && user?.accessType !== 'FULL_STUDENT';

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          id="sidebar-backdrop"
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 flex flex-col transition-transform duration-200 ease-in-out border-r border-slate-800 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white tracking-tight shadow-xs">
              CG
            </div>
            <div>
              <span className="font-semibold text-white tracking-tight text-sm block">
                CoreGuide
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                VA Simulator
              </span>
            </div>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            V1
          </span>
        </div>

        {/* Active Specialization Switcher Pill */}
        <div className="p-3 mx-3 my-2 rounded-xl bg-slate-800/80 border border-slate-700/70 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Track</span>
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="text-[10px] font-medium text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
            >
              <ArrowRightLeft className="w-3 h-3" />
              <span>Change</span>
            </button>
          </div>
          <div className="font-semibold text-xs text-white truncate">{activeService.name}</div>
        </div>

        {/* Simulation Timeline Progress Pill */}
        <div className="px-4 py-3 mx-3 mb-3 rounded-xl bg-slate-800/50 border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-300 font-medium">
              {isBetaStudent ? '14-Day Beta Track' : '90-Day Curriculum'}
            </span>
            <span className="font-semibold text-indigo-400">
              {isBetaStudent ? `Day ${betaState.currentBetaDay}/14` : `Day ${currentDay}/90`}
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
              style={{
                width: isBetaStudent
                  ? `${Math.min(100, (betaState.currentBetaDay / 14) * 100)}%`
                  : `${(currentDay / 90) * 100}%`,
              }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5">
            <span className="truncate max-w-[140px]">{currentStage.name.split('—')[1] || currentStage.name}</span>
            <span>
              {isBetaStudent
                ? `${Math.min(100, Math.round((betaState.currentBetaDay / 14) * 100))}%`
                : `${Math.round((currentDay / 90) * 100)}%`}
            </span>
          </div>
        </div>

        {/* 5 Primary Navigation Tabs */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          <p className="px-3 text-[10px] font-semibold tracking-wider text-slate-400 uppercase mb-2">
            Main Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Dedicated Administrator Dashboard Link (Visible ONLY to Admins) */}
          {isAdmin && (
            <div className="pt-3 mt-3 border-t border-slate-800">
              <p className="px-3 text-[10px] font-semibold tracking-wider text-purple-400 uppercase mb-2">
                Administration
              </p>
              <button
                id="nav-item-admin"
                onClick={() => handleNavClick('admin')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-colors ${
                  activeTab === 'admin'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-purple-300 hover:text-white hover:bg-purple-950/40 border border-purple-900/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Shield className={`w-4 h-4 ${activeTab === 'admin' ? 'text-white' : 'text-purple-400'}`} />
                  <span>ADMIN DASHBOARD</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold bg-purple-400/20 text-purple-200">
                  MGMT
                </span>
              </button>
            </div>
          )}
        </nav>

        {/* User Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/90">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-semibold text-slate-200 shrink-0">
                {user?.fullName?.charAt(0) || 'S'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-white truncate">
                  {user?.fullName || 'Student Trainee'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {isAdmin ? 'Administrator' : activeService.shortName}
                </p>
              </div>
            </div>
            <button
              id="sidebar-logout-btn"
              onClick={() => logout()}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
