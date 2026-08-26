import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useSimulation } from '../../context/SimulationContext';
import { useAuth } from '../../context/AuthContext';
import { DashboardView } from '../pages/DashboardView';
import { ClientView } from '../pages/ClientView';
import { TasksView } from '../pages/TasksView';
import { ClientChatView } from '../pages/ClientChatView';
import { ProgressView } from '../pages/ProgressView';
import { AdminDashboardView } from '../pages/AdminDashboardView';
import { NotActivatedView } from '../pages/NotActivatedView';
import { TaskDetailsModal } from '../tasks/TaskDetailsModal';
import { OnboardingModal } from '../onboarding/OnboardingModal';
import { BetaAdminModal } from '../beta/BetaAdminModal';
import { TaskItem } from '../../types';

export const AppLayout: React.FC = () => {
  const {
    activeTab,
    tasks,
    selectedTaskId,
    setSelectedTaskId,
    isOnboardingOpen,
    setIsOnboardingOpen,
    isBetaAdminModalOpen,
    setIsBetaAdminModalOpen,
  } = useSimulation();
  const { user, isAdmin } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || null;

  const handleOpenTask = (task: TaskItem) => {
    setSelectedTaskId(task.id);
  };

  const handleCloseModal = () => {
    setSelectedTaskId(null);
  };

  // If user is a regular student and accessType is NOT_ACTIVATED, show dedicated not-activated screen
  if (!isAdmin && user?.accessType === 'NOT_ACTIVATED') {
    return <NotActivatedView />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar */}
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Navbar */}
        <Navbar setMobileOpen={setMobileSidebarOpen} />

        {/* Page Content View - The Core V1 Areas + Dedicated Admin Dashboard */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && <DashboardView onOpenTask={handleOpenTask} />}
          {activeTab === 'client' && <ClientView />}
          {activeTab === 'tasks' && <TasksView onOpenTask={handleOpenTask} />}
          {activeTab === 'chat' && <ClientChatView />}
          {activeTab === 'progress' && <ProgressView />}
          {activeTab === 'admin' && isAdmin && <AdminDashboardView onOpenTaskDetails={(taskId) => setSelectedTaskId(taskId)} />}
          {activeTab === 'admin' && !isAdmin && <DashboardView onOpenTask={handleOpenTask} />}
        </main>
      </div>

      {/* Task Submission & 5-Dimension Evaluation Modal */}
      {selectedTask && (
        <TaskDetailsModal task={selectedTask} onClose={handleCloseModal} />
      )}

      {/* Specialization Selection & Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

      {/* Administrator Beta Controls Modal */}
      <BetaAdminModal
        isOpen={isBetaAdminModalOpen}
        onClose={() => setIsBetaAdminModalOpen(false)}
      />
    </div>
  );
};
