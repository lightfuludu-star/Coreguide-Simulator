import React from 'react';
import {
  CalendarDays,
  Clock,
  ArrowRight,
  MessageSquare,
  User,
  Building2,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileCheck,
  Award,
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { useAuth } from '../../context/AuthContext';
import { TaskItem } from '../../types';
import { TaskDeadlineTimer } from '../TaskDeadlineTimer';
import { BetaExpiredBanner } from '../beta/BetaExpiredBanner';

interface DashboardViewProps {
  onOpenTask: (task: TaskItem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenTask }) => {
  const { user } = useAuth();
  const {
    currentDay,
    stats,
    client,
    todaysTask,
    setActiveTab,
    currentStage,
    tasks,
    betaState,
    setIsBetaAdminModalOpen,
  } = useSimulation();

  const evaluatedTasks = tasks.filter((t) => t.status === 'evaluated');
  const latestEvaluated = evaluatedTasks[evaluatedTasks.length - 1] || null;

  const handleStartTask = () => {
    if (todaysTask) {
      setActiveTab('tasks');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Beta Status Notice Banner */}
      <BetaExpiredBanner onOpenAdmin={() => setIsBetaAdminModalOpen(true)} />

      {/* 1. Header: Command Center Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              Day {currentDay} of 90
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Stage: <strong className="text-slate-800 font-semibold">{currentStage.name}</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Welcome, {user?.fullName || 'Student'}
          </h1>
          <p className="text-sm text-slate-600">
            Your assigned client is <strong className="text-slate-900">{client.ceoName}</strong> ({client.ceoRole} at {client.companyName}).
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            id="home-chat-client-btn"
            onClick={() => setActiveTab('chat')}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center space-x-2"
          >
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            <span>Chat with Client</span>
          </button>
        </div>
      </div>

      {/* 2. Primary Focal Point: Today's Task Card */}
      {todaysTask ? (
        <div className="bg-white rounded-2xl border-2 border-indigo-500/80 shadow-md overflow-hidden">
          {/* Header banner */}
          <div className="p-6 bg-indigo-50/70 border-b border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white uppercase tracking-wider">
                  Today's Task • Day {todaysTask.dayNumber}
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    todaysTask.priority === 'urgent'
                      ? 'bg-rose-100 text-rose-800'
                      : todaysTask.priority === 'high'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {todaysTask.priority.toUpperCase()} PRIORITY
                </span>
                <TaskDeadlineTimer task={todaysTask} variant="badge" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 pt-1">
                {todaysTask.title}
              </h2>
            </div>

            {/* Main CTA Button */}
            <button
              id="start-todays-task-btn"
              onClick={handleStartTask}
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl font-bold text-sm sm:text-base shadow-sm transition-all flex items-center justify-center space-x-2 shrink-0"
            >
              <span>
                {todaysTask.status === 'evaluated'
                  ? "VIEW GRADED TASK"
                  : todaysTask.status === 'submitted'
                  ? "VIEW SUBMITTED TASK"
                  : "START TODAY'S TASK"}
              </span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Task Brief Content */}
          <div className="p-6 space-y-5">
            {/* Client Context Quote */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 mb-1">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <span>Client Request from {client.ceoName}:</span>
              </div>
              <p className="text-sm text-slate-700 italic leading-relaxed">
                "{todaysTask.clientContext}"
              </p>
            </div>

            {/* Brief Description */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                What you need to do:
              </h3>
              <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal">
                {todaysTask.brief}
              </p>
            </div>

            {/* Expected Deliverables */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Expected Deliverable:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {todaysTask.deliverables.map((del) => (
                  <div
                    key={del.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 flex items-center space-x-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="font-medium">{del.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Row */}
            <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-100 text-xs sm:text-sm text-slate-600 gap-2">
              <div>
                Status:{' '}
                <strong
                  className={`font-semibold ${
                    todaysTask.status === 'evaluated'
                      ? 'text-emerald-600'
                      : todaysTask.status === 'submitted'
                      ? 'text-blue-600'
                      : 'text-amber-600'
                  }`}
                >
                  {todaysTask.status === 'evaluated'
                    ? 'Evaluated'
                    : todaysTask.status === 'submitted'
                    ? 'Submitted (In Review)'
                    : 'Pending Submission'}
                </strong>
              </div>
              <button
                onClick={handleStartTask}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
              >
                <span>Go to Today's Task page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">All tasks completed for today!</h2>
          <p className="text-xs text-slate-500">Advance to the next day in the simulation when ready.</p>
        </div>
      )}

      {/* 3. Simple 2-Column Overview (Client & Performance) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              1. My Client
            </span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ● Active Client
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <img
              src={client.avatarUrl}
              alt={client.ceoName}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-100 shadow-xs shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0">
              <h3 className="text-base font-bold text-slate-900 truncate">{client.ceoName}</h3>
              <p className="text-xs text-slate-600 font-medium truncate">{client.ceoRole}</p>
              <p className="text-xs text-indigo-600 font-semibold truncate">{client.companyName}</p>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-500">Industry:</span>
              <span className="font-medium text-slate-800">{client.industry}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Timezone:</span>
              <span className="font-medium text-slate-800">{client.timezone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Comms Style:</span>
              <span className="font-medium text-slate-800">{client.communicationStyle}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              id="home-view-client-profile-btn"
              onClick={() => setActiveTab('client')}
              className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors text-center"
            >
              View Client Profile
            </button>
            <button
              id="home-chat-client-action-btn"
              onClick={() => setActiveTab('chat')}
              className="w-full py-2.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold transition-colors text-center"
            >
              Open Client Chat
            </button>
          </div>
        </div>

        {/* Progress & Performance Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              5. My Performance
            </span>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              Overall Score: {stats.averageScore}/100
            </span>
          </div>

          {latestEvaluated && latestEvaluated.evaluation ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600">Latest Graded Task:</span>
                <span className="text-xs font-bold text-slate-900">Day {latestEvaluated.dayNumber}</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5 text-center">
                {[
                  { label: 'Accuracy', val: latestEvaluated.evaluation.accuracy || 9 },
                  { label: 'Comms', val: latestEvaluated.evaluation.communication || 9 },
                  { label: 'Judgement', val: latestEvaluated.evaluation.judgement || 9 },
                  { label: 'Initiative', val: latestEvaluated.evaluation.initiative || 8 },
                  { label: 'Client', val: latestEvaluated.evaluation.clientHandling || 9 },
                ].map((item, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-500 block truncate">{item.label}</span>
                    <span className="text-xs font-bold text-slate-900">{item.val}/10</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100 line-clamp-2">
                "{latestEvaluated.evaluation.feedback}"
              </p>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center space-y-1">
              <Award className="w-6 h-6 text-indigo-500 mx-auto" />
              <p className="text-xs font-semibold text-slate-800">No tasks evaluated yet</p>
              <p className="text-[11px] text-slate-500">Complete and submit today's task to receive feedback across the 5 core dimensions.</p>
            </div>
          )}

          <div className="pt-2">
            <button
              id="home-view-progress-btn"
              onClick={() => setActiveTab('progress')}
              className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors text-center"
            >
              View Full Progress & Advice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
