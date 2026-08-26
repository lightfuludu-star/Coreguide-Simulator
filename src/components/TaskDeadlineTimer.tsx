import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle2, Flame, ShieldAlert, Sparkles } from 'lucide-react';
import { TaskItem, DeadlineType } from '../types';

interface TaskDeadlineTimerProps {
  task: TaskItem;
  variant?: 'full' | 'compact' | 'badge';
  className?: string;
}

export const TaskDeadlineTimer: React.FC<TaskDeadlineTimerProps> = ({
  task,
  variant = 'full',
  className = '',
}) => {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const deadlineType: DeadlineType = task.deadlineType || (task.priority === 'urgent' ? 'hard' : 'soft');
  const startedAtMs = task.taskStartedAt ? new Date(task.taskStartedAt).getTime() : now;
  const deadlineAtMs = task.deadlineAt ? new Date(task.deadlineAt).getTime() : (startedAtMs + (task.estimatedMinutes || 30) * 60 * 1000);

  const diffMs = deadlineAtMs - now;
  const isExpired = diffMs <= 0;
  const overdueMinutes = Math.abs(Math.floor(diffMs / (1000 * 60)));

  const totalDurationMs = Math.max(1000, deadlineAtMs - startedAtMs);
  const elapsedMs = Math.max(0, now - startedAtMs);
  const progressPercent = Math.min(100, Math.max(0, Math.round((elapsedMs / totalDurationMs) * 100)));

  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formattedTimeRemaining =
    hours > 0
      ? `${hours}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`
      : `${minutes}m ${seconds.toString().padStart(2, '0')}s`;

  // Badge Variant
  if (variant === 'badge') {
    if (deadlineType === 'hard') {
      if (isExpired) {
        return (
          <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 ${className}`}>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Past Cutoff (+{overdueMinutes}m)</span>
          </span>
        );
      }
      return (
        <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse ${className}`}>
          <Flame className="w-3.5 h-3.5 text-rose-600" />
          <span>Hard Deadline: {formattedTimeRemaining}</span>
        </span>
      );
    }

    if (deadlineType === 'soft') {
      return (
        <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 ${className}`}>
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>Soft Deadline: ~{task.estimatedMinutes || 45} mins</span>
        </span>
      );
    }

    return (
      <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 ${className}`}>
        <Sparkles className="w-3.5 h-3.5 text-slate-500" />
        <span>Flexible Timeline (~{task.estimatedMinutes || 30}m)</span>
      </span>
    );
  }

  // Compact Variant (e.g., in headers or cards)
  if (variant === 'compact') {
    if (deadlineType === 'hard') {
      return (
        <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-bold border ${isExpired ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-rose-50 text-rose-700 border-rose-200'} ${className}`}>
          <Flame className={`w-4 h-4 ${isExpired ? 'text-rose-600' : 'text-rose-600 animate-bounce'}`} />
          <div>
            <span className="block">{isExpired ? `Overdue (+${overdueMinutes}m)` : formattedTimeRemaining}</span>
            <span className="text-[10px] text-rose-600 font-normal">Hard Deadline</span>
          </div>
        </div>
      );
    }

    if (deadlineType === 'soft') {
      return (
        <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200 ${className}`}>
          <Clock className="w-4 h-4 text-amber-600" />
          <div>
            <span className="block font-bold">Due within {task.deadlineHours || 1}h</span>
            <span className="text-[10px] text-amber-700 font-normal">Soft Deadline (~{task.estimatedMinutes}m)</span>
          </div>
        </div>
      );
    }

    return (
      <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200 ${className}`}>
        <Clock className="w-4 h-4 text-slate-500" />
        <div>
          <span className="block font-bold">No Strict Cutoff</span>
          <span className="text-[10px] text-slate-500 font-normal">Est. ~{task.estimatedMinutes || 30} mins</span>
        </div>
      </div>
    );
  }

  // Full Variant (Step 5 in Tasks View or Detail card)
  if (deadlineType === 'hard') {
    return (
      <div className={`p-4 rounded-xl border transition-all ${isExpired ? 'bg-rose-50/60 border-rose-200' : 'bg-rose-50/40 border-rose-200 shadow-xs'} ${className}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-lg text-white ${isExpired ? 'bg-rose-600' : 'bg-rose-600'}`}>
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                  5. Hard Client Deadline (Urgent)
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-200 text-rose-900 uppercase">
                  Countdown Active
                </span>
              </div>
              <div className="text-lg sm:text-xl font-mono font-bold text-slate-900 mt-0.5">
                {isExpired ? (
                  <span className="text-rose-700">Time Expired (+{overdueMinutes}m late)</span>
                ) : (
                  <span className="text-rose-600">{formattedTimeRemaining} remaining</span>
                )}
              </div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[11px] text-slate-500 block">Target Window</span>
            <span className="text-xs font-bold text-slate-800">~{task.estimatedMinutes || 30} mins total</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3.5 space-y-1.5">
          <div className="w-full bg-rose-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${isExpired ? 'bg-rose-600 w-full' : 'bg-rose-600'}`}
              style={{ width: isExpired ? '100%' : `${progressPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-600 leading-tight">
            {isExpired ? (
              <span className="text-rose-700 font-medium">
                The target deadline window has elapsed, but you can still submit your deliverable. Your work will be evaluated on accuracy and completeness.
              </span>
            ) : (
              <span>
                Client requires fast turnaround for this urgent situation. Your submission timestamp is recorded.
              </span>
            )}
          </p>
        </div>
      </div>
    );
  }

  if (deadlineType === 'soft') {
    return (
      <div className={`p-4 rounded-xl bg-amber-50/50 border border-amber-200 ${className}`}>
        <div className="flex items-center space-x-3.5">
          <div className="p-2.5 rounded-lg bg-amber-600 text-white shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                5. Soft Client Deadline
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 uppercase">
                Expected Today
              </span>
            </div>
            <span className="text-sm sm:text-base font-bold text-slate-900 block mt-0.5">
              Due within {task.deadlineHours || 1} hour(s)
            </span>
            <span className="text-xs text-slate-600 block mt-0.5">
              Expected completion time: ~{task.estimatedMinutes || 45} mins. No strict countdown cutoff.
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Type: None (Flexible)
  return (
    <div className={`p-4 rounded-xl bg-slate-50 border border-slate-200 ${className}`}>
      <div className="flex items-center space-x-3.5">
        <div className="p-2.5 rounded-lg bg-slate-700 text-white shrink-0">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              5. Timeline & Pace
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-800 uppercase">
              Flexible
            </span>
          </div>
          <span className="text-sm sm:text-base font-bold text-slate-900 block mt-0.5">
            No Strict Deadline
          </span>
          <span className="text-xs text-slate-500 block mt-0.5">
            Take the time you need to produce a high-quality deliverable. Estimated ~{task.estimatedMinutes || 30} mins.
          </span>
        </div>
      </div>
    </div>
  );
};
