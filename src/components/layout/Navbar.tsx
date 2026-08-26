import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Calendar,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { useSimulation, NavigationTab } from '../../context/SimulationContext';
import { useAuth } from '../../context/AuthContext';
import { BetaStatusBadge } from '../beta/BetaStatusBadge';

interface NavbarProps {
  setMobileOpen: (open: boolean) => void;
}

const tabTitles: Record<NavigationTab, { title: string; subtitle: string }> = {
  dashboard: { title: 'Home', subtitle: 'Your daily command center' },
  client: { title: 'My Client', subtitle: 'Client background, preferences, and expectations' },
  tasks: { title: "Today's Task", subtitle: 'Client brief, instructions, and work submission' },
  chat: { title: 'Client Chat', subtitle: 'Direct messages with your client' },
  progress: { title: 'My Progress', subtitle: 'Performance scores and improvement feedback' },
  admin: { title: 'Admin Dashboard', subtitle: 'Beta tester management, student registry, and access tiers' },
};

export const Navbar: React.FC<NavbarProps> = ({ setMobileOpen }) => {
  const {
    activeTab,
    setActiveTab,
    currentDay,
    advanceToNextDay,
    currentStage,
    notifications,
    markNotificationAsRead,
    unreadNotificationsCount,
    client,
    todaysTask,
    betaState,
    setIsBetaAdminModalOpen,
  } = useSimulation();
  const { user, isAdmin } = useAuth();
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const currentMeta = tabTitles[activeTab] || { title: 'CoreGuide VA', subtitle: 'Virtual Assistant Simulator' };
  const isTodayCompleted = todaysTask?.status === 'evaluated' || todaysTask?.status === 'submitted';
  const canAdvance = betaState.isBetaTester && !isAdmin && user?.accessType !== 'FULL_STUDENT'
    ? currentDay < 14
    : currentDay < 90;

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8">
      {/* Left section: mobile toggle & page breadcrumb */}
      <div className="flex items-center space-x-3 min-w-0">
        <button
          id="mobile-menu-toggle-btn"
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center space-x-2">
            <h1 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900 truncate">
              {currentMeta.title}
            </h1>
            {activeTab !== 'admin' && (
              <span className="hidden sm:inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                Day {currentDay} of 90
              </span>
            )}
            {/* Beta Test Status Badge */}
            <BetaStatusBadge onClickAdmin={() => setActiveTab('admin')} />
          </div>
          <p className="hidden md:block text-xs text-slate-500 truncate">
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Stage Milestone Badge */}
        {activeTab !== 'admin' && (
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span className="font-semibold text-slate-700">{currentStage.name}</span>
            <span className="text-slate-400">({currentStage.daysRange})</span>
          </div>
        )}

        {/* Sequential Next Day Progress Button */}
        {activeTab !== 'admin' && canAdvance && (
          <button
            id="advance-day-btn"
            onClick={advanceToNextDay}
            title={isTodayCompleted ? 'Proceed to next simulation day' : 'Advance to next simulation day'}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs ${
              isTodayCompleted
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white animate-pulse'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
            }`}
          >
            <span>Next Day</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Admin Dashboard Quick Button (ONLY FOR ADMINS) */}
        {isAdmin && (
          <button
            onClick={() => setActiveTab(activeTab === 'admin' ? 'dashboard' : 'admin')}
            title="Toggle Admin Dashboard"
            className={`p-2 rounded-lg transition-colors flex items-center space-x-1.5 text-xs font-semibold ${
              activeTab === 'admin'
                ? 'bg-purple-600 text-white'
                : 'text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Admin Panel</span>
          </button>
        )}

        {/* Notifications */}
        <div className="relative">
          <button
            id="notifications-toggle-btn"
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white" />
            )}
          </button>

          {notifDropdownOpen && (
            <div
              id="notifications-dropdown"
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
            >
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Notifications</span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {unreadNotificationsCount} unread
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No new client notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={`p-3.5 text-xs hover:bg-slate-50 cursor-pointer transition-colors ${
                        !notif.read ? 'bg-indigo-50/40' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-semibold text-slate-900">{notif.title}</span>
                        <span className="text-[10px] text-slate-400">{notif.time}</span>
                      </div>
                      <p className="text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Assigned Client Mini-Badge */}
        {activeTab !== 'admin' && (
          <div className="hidden md:flex items-center space-x-2 pl-2 border-l border-slate-200">
            <img
              src={client.avatarUrl}
              alt={client.ceoName}
              className="w-7 h-7 rounded-full object-cover border border-slate-200"
              referrerPolicy="no-referrer"
            />
            <div className="text-left">
              <span className="text-xs font-bold text-slate-900 block leading-tight truncate max-w-[100px]">
                {client.ceoName.split(' ')[0]}
              </span>
              <span className="text-[10px] text-slate-500 block leading-tight truncate max-w-[100px]">
                {client.companyName.split(' ')[0]}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
