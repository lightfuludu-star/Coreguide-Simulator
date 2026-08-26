import React, { useState } from 'react';
import {
  CalendarDays,
  Lock,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Award,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { SimulationPhase } from '../../types';

export const SimulationView: React.FC = () => {
  const { currentDay, setCurrentDay, phases, stats, setActiveTab } = useSimulation();
  const [selectedPhase, setSelectedPhase] = useState<number>(1);

  const activePhase = phases.find((p) => p.id === selectedPhase) || phases[0];

  return (
    <div className="space-y-6 pb-12">
      {/* 90-Day Simulation Roadmap Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 mb-1">
              <Layers className="w-4 h-4" />
              <span>90-Day Immersive Curriculum Roadmap</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Simulation Journey (Day {currentDay} of 90)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Experience the full 90-day trajectory of working as an elite Executive Virtual Assistant for a high-growth tech startup.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Overall Progress</span>
              <span className="text-base font-bold text-indigo-600">{stats.completionPercentage}% Complete</span>
            </div>
            <div className="w-10 h-10 rounded-full border-4 border-indigo-600 flex items-center justify-center font-bold text-xs text-slate-900 bg-white">
              {currentDay}d
            </div>
          </div>
        </div>

        {/* 4 Phases Stepper */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
          {phases.map((phase) => {
            const isSelected = selectedPhase === phase.id;
            const isCurrentPhase = currentDay >= phase.startDay && currentDay <= phase.endDay;
            const isCompletedPhase = currentDay > phase.endDay;

            return (
              <button
                key={phase.id}
                onClick={() => setSelectedPhase(phase.id)}
                className={`p-4 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-500">{phase.daysRange}</span>
                  {isCompletedPhase ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : isCurrentPhase ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>

                <div className="font-bold text-sm text-slate-900 mb-1">{phase.name}</div>
                <div className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{phase.title}</div>

                {isCurrentPhase && (
                  <div className="mt-3 inline-block text-[10px] font-semibold text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded">
                    Active Phase
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Phase Detail & Milestone Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Phase Breakdown (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-semibold text-indigo-600">{activePhase.name} • {activePhase.daysRange}</span>
                <h3 className="text-lg font-bold text-slate-900">{activePhase.title}</h3>
              </div>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full w-fit ${
                  activePhase.status === 'active'
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {activePhase.status === 'active' ? '● In Progress' : 'Upcoming Phase'}
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Phase Description</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {activePhase.description}
              </p>
            </div>

            {/* Targeted Competencies in this Phase */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Target Competencies Mastered
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activePhase.focusCompetencies.map((comp, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200/70 text-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="font-medium text-slate-800">{comp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 90-Day Interactive Day Timeline Quick-Jump */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Phase Days ({activePhase.daysRange})
                </h4>
                <span className="text-xs text-slate-500">Click a day to jump simulation state</span>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {Array.from({ length: activePhase.endDay - activePhase.startDay + 1 }, (_, i) => {
                  const dayNum = activePhase.startDay + i;
                  const isCurrent = dayNum === currentDay;
                  const isPast = dayNum < currentDay;

                  return (
                    <button
                      key={dayNum}
                      onClick={() => setCurrentDay(dayNum)}
                      className={`p-2 rounded-lg text-center transition-all text-xs font-medium border ${
                        isCurrent
                          ? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-xs ring-2 ring-indigo-200'
                          : isPast
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-[10px] text-slate-400">Day</div>
                      <div className="text-sm font-semibold">{dayNum}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Certification & Readiness Requirements */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center space-x-2 text-indigo-600">
              <Award className="w-5 h-5" />
              <h3 className="font-bold text-slate-900 text-sm">Graduation Criteria</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              To earn your verified CoreGuide Executive VA Certificate upon completing Day 90, you must meet the following benchmark thresholds:
            </p>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span>Minimum Overall Score:</span>
                <span className="font-bold text-indigo-600">85% / 100</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span>Client Satisfaction:</span>
                <span className="font-bold text-emerald-600">≥ 90%</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span>Deliverable Completion:</span>
                <span className="font-bold text-slate-900">100% Required</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span>High-Stakes Crisis Exam:</span>
                <span className="font-bold text-slate-900">Pass Phase 4</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('tasks')}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center justify-center space-x-1.5"
            >
              <span>Continue Day {currentDay} Tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
