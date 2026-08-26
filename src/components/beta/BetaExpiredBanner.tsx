import React from 'react';
import { Sparkles, ShieldCheck, AlertTriangle, Clock, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSimulation } from '../../context/SimulationContext';

interface BetaExpiredBannerProps {
  onOpenAdmin?: () => void;
}

export const BetaExpiredBanner: React.FC<BetaExpiredBannerProps> = ({ onOpenAdmin }) => {
  const { user } = useAuth();
  const { betaState } = useSimulation();

  // If user is Admin or Full Student, never show beta status banner
  if (user?.role === 'admin' || user?.accessType === 'ADMIN' || user?.accessType === 'FULL_STUDENT' || !betaState.isBetaTester) {
    return null;
  }

  // 1. Beta Not Started Case
  if (betaState.isNotStarted) {
    return (
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 text-white rounded-2xl p-6 sm:p-7 border border-amber-500/30 shadow-lg mb-6">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Pending Beta Activation</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Your beta access has not been activated yet.
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Your enrollment has been registered with CoreGuide. Our admissions administrator will activate your 14-day beta testing window shortly. Once activated, you will receive full interactive access starting from Simulation Day 1.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. Beta Revoked Case
  if (betaState.isRevoked) {
    return (
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white rounded-2xl p-6 sm:p-7 border border-rose-500/30 shadow-lg mb-6">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            <span>Account Notice</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Your CoreGuide access has been temporarily disabled.
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Please reach out to your CoreGuide administrator regarding your training account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 3. Beta Expired Case
  if (betaState.isExpired) {
    return (
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-7 border border-indigo-900/50 shadow-lg mb-6">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Beta Test Completed</span>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Your CoreGuide beta period has ended.
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Thank you for helping us test CoreGuide.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start space-x-3 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block">All Simulation Records Preserved</span>
              <span>
                Your submitted deliverables, 5-dimension evaluations, client conversations, and performance scores remain safely archived and available for review.
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
