import React from 'react';
import {
  TrendingUp,
  Star,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Award,
  Calendar,
  Lock,
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { BetaExpiredBanner } from '../beta/BetaExpiredBanner';

export const ProgressView: React.FC = () => {
  const {
    stats,
    tasks,
    client,
    phases,
    currentDay,
    betaState,
    setIsBetaAdminModalOpen,
    activeService,
    competencies,
  } = useSimulation();
  const evaluatedTasks = tasks.filter((t) => t.status === 'evaluated');

  // Compute average 5-dimension metrics across all evaluated tasks
  const dimAverages = evaluatedTasks.reduce(
    (acc, t) => {
      acc.accuracy += t.evaluation?.accuracy || 9;
      acc.communication += t.evaluation?.communication || 9;
      acc.judgement += t.evaluation?.judgement || 9;
      acc.initiative += t.evaluation?.initiative || 8.5;
      acc.clientHandling += t.evaluation?.clientHandling || 9;
      return acc;
    },
    { accuracy: 0, communication: 0, judgement: 0, initiative: 0, clientHandling: 0 }
  );

  const count = evaluatedTasks.length || 1;
  const metrics = [
    {
      name: 'Accuracy',
      score: Number((dimAverages.accuracy / count).toFixed(1)),
      desc: 'Attention to detail, following instructions, and error-free deliverables',
    },
    {
      name: 'Communication',
      score: Number((dimAverages.communication / count).toFixed(1)),
      desc: 'Clear, concise, professional tone and executive formatting',
    },
    {
      name: 'Judgement',
      score: Number((dimAverages.judgement / count).toFixed(1)),
      desc: 'Handling ambiguity, making smart decisions, and prioritizing well',
    },
    {
      name: 'Initiative',
      score: Number((dimAverages.initiative / count).toFixed(1)),
      desc: 'Proactive suggestions, anticipating client needs, and going the extra mile',
    },
    {
      name: 'Client Handling',
      score: Number((dimAverages.clientHandling / count).toFixed(1)),
      desc: 'Adhering to client preferences, building trust, and prompt delivery',
    },
  ];

  // Aggregate weaknesses / recommendations
  const allImprovements = evaluatedTasks.flatMap((t) => t.evaluation?.areasToImprove || []);
  const allStrengths = evaluatedTasks.flatMap((t) => t.evaluation?.strengths || []);

  const defaultImprovements = [
    'Always double-check numbers and deliverable details against client preferences before submitting.',
    'Keep initial client messages concise with bullet points for easier reading.',
    'Proactively suggest a next step or timeline when handing over completed work.',
  ];

  const improvementsToShow = allImprovements.length > 0
    ? Array.from(new Set(allImprovements)).slice(0, 4)
    : defaultImprovements;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Beta Status Notice Banner */}
      <BetaExpiredBanner onOpenAdmin={() => setIsBetaAdminModalOpen(true)} />

      {/* 1. Header Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>My Progress</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Performance & Skill Ratings
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Evaluated across the 5 core Virtual Assistant competencies.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-indigo-50/80 p-3.5 rounded-2xl border border-indigo-100 shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase text-indigo-700 block">Overall Score</span>
            <span className="text-xl font-bold text-slate-900">{stats.averageScore} / 100</span>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-600 text-white">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2. The 5 Core Competencies */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-7 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            5 Core Evaluation Dimensions
          </h2>
          <span className="text-xs font-medium text-slate-500">
            Graded on 0 - 10 scale
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{m.name}</span>
                  <span className="text-sm font-extrabold text-indigo-600">{m.score}/10</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-1.5 rounded-full"
                    style={{ width: `${(m.score / 10) * 100}%` }}
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2.5. Executive VA 14 Core Competency Framework (When Executive VA is active) */}
      {activeService.id === 'executive_admin' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                14 Executive VA Core Competency Framework
              </h2>
              <p className="text-xs text-slate-500">
                Continuous competency tracking across all 14 official Executive VA skills
              </p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              14 Core Skills Monitored
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {competencies.map((comp) => {
              const scorePercent = comp.score || 85;
              const levelBadge = scorePercent >= 90 ? 'Advanced' : scorePercent >= 80 ? 'Proficient' : 'Developing';
              return (
                <div
                  key={comp.id}
                  className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 flex flex-col justify-between space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{comp.name}</span>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{comp.description}</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        levelBadge === 'Advanced'
                          ? 'bg-emerald-100 text-emerald-800'
                          : levelBadge === 'Proficient'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {levelBadge}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 mb-1">
                      <span>Proficiency</span>
                      <span className="font-bold text-slate-900">{scorePercent}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-1.5 rounded-full"
                        style={{ width: `${scorePercent}%` }}
                      />
                    </div>
                  </div>

                  {comp.keySkills && comp.keySkills.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {comp.keySkills.slice(0, 3).map((sub, i) => (
                        <span key={i} className="text-[9px] font-medium bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                          {sub}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. "What should I improve?" Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-7 space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h2 className="text-sm sm:text-base font-bold text-slate-900">
            What should I improve?
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600">
          Based on your recent deliverable submissions and client interactions:
        </p>

        <div className="space-y-3">
          {improvementsToShow.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-start space-x-3 text-xs sm:text-sm text-amber-950"
            >
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Official 90-Day Simulation Curriculum (6 Stages) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Official 90-Day CoreGuide Curriculum
            </h2>
            <p className="text-xs text-slate-500">
              6 Progressive Career Milestones
            </p>
          </div>
          {betaState.isBetaTester && (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              <span>Beta Layer Active (Days 1–14 Unlocked)</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {phases.map((phase) => {
            const isStageActive = currentDay >= phase.startDay && currentDay <= phase.endDay;
            const isStageCompleted = currentDay > phase.endDay;
            const isStageLocked = currentDay < phase.startDay;

            return (
              <div
                key={phase.id}
                className={`p-4 rounded-xl border transition-all ${
                  isStageActive
                    ? 'bg-indigo-50/50 border-indigo-300 ring-1 ring-indigo-400'
                    : isStageCompleted
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : 'bg-slate-50/80 border-slate-200 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-900">{phase.name}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isStageActive
                        ? 'bg-indigo-600 text-white'
                        : isStageCompleted
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600 flex items-center space-x-1'
                    }`}
                  >
                    {isStageLocked && <Lock className="w-2.5 h-2.5 mr-0.5 inline" />}
                    {isStageActive
                      ? 'In Progress'
                      : isStageCompleted
                      ? 'Completed'
                      : 'Locked (Days 15–90)'}
                  </span>
                </div>
                <div className="text-[11px] font-medium text-slate-600 mb-1">
                  {phase.daysRange} • {phase.title}
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {phase.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Simple Submission History List */}
      {evaluatedTasks.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
            Graded Task Submissions ({evaluatedTasks.length})
          </h2>

          <div className="space-y-2.5">
            {evaluatedTasks.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm"
              >
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 mr-2">
                    Day {t.dayNumber}
                  </span>
                  <span className="font-bold text-slate-900">{t.title}</span>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                    "{t.evaluation?.feedback || 'Graded submission'}"
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className="flex items-center space-x-1 font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    <Star className="w-3.5 h-3.5 fill-emerald-600" />
                    <span>{t.evaluation?.score || 90} / 100</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
