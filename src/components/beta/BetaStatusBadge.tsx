import React from 'react';
import { Sparkles, Clock, AlertTriangle, Shield, Lock } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { useAuth } from '../../context/AuthContext';

interface BetaStatusBadgeProps {
  className?: string;
  onClickAdmin?: () => void;
}

export const BetaStatusBadge: React.FC<BetaStatusBadgeProps> = ({
  className = '',
  onClickAdmin,
}) => {
  const { betaState } = useSimulation();
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin' || user?.accessType === 'ADMIN';
  const isFullStudent = user?.accessType === 'FULL_STUDENT';

  // 1. ADMIN USER
  if (isAdmin) {
    return (
      <button
        onClick={onClickAdmin}
        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors ${className}`}
        title="Admin Console — Click to open management dashboard"
      >
        <Shield className="w-3.5 h-3.5 text-purple-600" />
        <span>Admin (Full 90-Day Access)</span>
      </button>
    );
  }

  // 2. FULL STUDENT
  if (isFullStudent || !betaState.isBetaTester) {
    return (
      <span
        className={`hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}
      >
        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
        <span>Full 90-Day Access</span>
      </span>
    );
  }

  // 3. BETA TESTER - NOT STARTED
  if (betaState.isNotStarted) {
    return (
      <span
        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 ${className}`}
        title="Your beta access is pending administrator activation"
      >
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        <span>Pending Beta Activation</span>
      </span>
    );
  }

  // 4. BETA TESTER - REVOKED
  if (betaState.isRevoked) {
    return (
      <span
        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300 ${className}`}
        title="Access disabled"
      >
        <Lock className="w-3.5 h-3.5 text-slate-600" />
        <span>Access Disabled</span>
      </span>
    );
  }

  // 5. BETA TESTER - EXPIRED
  if (betaState.isExpired) {
    return (
      <span
        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 ${className}`}
        title="Beta period ended"
      >
        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
        <span>Beta Expired</span>
      </span>
    );
  }

  // 6. BETA TESTER - ACTIVE
  return (
    <span
      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 ${className}`}
      title="14-Day Beta Access Period (Days 1–14)"
    >
      <Clock className="w-3.5 h-3.5 text-indigo-600" />
      <span>Beta Day {betaState.currentBetaDay} of 14</span>
    </span>
  );
};
