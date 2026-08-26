import React, { useState } from 'react';
import {
  X,
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  UserCheck,
  Award,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSimulation } from '../../context/SimulationContext';
import { BETA_DURATION_DAYS } from '../../utils/betaAccess';

interface BetaAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BetaAdminModal: React.FC<BetaAdminModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const {
    betaState,
    activateStudent,
    extendStudent,
    expireStudent,
    revokeStudent,
    grantFullAccess,
    grantAdmin,
    setActiveTab,
  } = useSimulation();

  if (!isOpen) return null;

  const currentUserId = user?.id || '';

  const formattedStart = betaState.startDate
    ? new Date(betaState.startDate).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'Not Set';

  const formattedExpiry = betaState.expiryDate
    ? new Date(betaState.expiryDate).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'Not Set';

  return (
    <div
      id="beta-admin-modal-backdrop"
      className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        id="beta-admin-modal"
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-600 text-white">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Beta Environment Controls</h3>
              <p className="text-xs text-slate-400">14-Day Simulation Beta Layer (Admin Override)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Overview Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Current Beta Status
              </span>
              <span
                className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  betaState.status === 'active'
                    ? 'bg-emerald-100 text-emerald-800'
                    : betaState.status === 'expired'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {betaState.status === 'active' ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5" />
                )}
                <span className="capitalize">{betaState.status}</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <span className="text-slate-400 block font-medium">Beta Start Date:</span>
                <span className="font-semibold text-slate-800">{formattedStart}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Beta Expiry Date:</span>
                <span className="font-semibold text-slate-800">{formattedExpiry}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Beta Duration:</span>
                <span className="font-semibold text-slate-800">{BETA_DURATION_DAYS} Calendar Days</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Current Calendar Progress:</span>
                <span className="font-semibold text-indigo-600">
                  Beta Day {betaState.currentBetaDay} of 14 ({betaState.daysRemaining} days left)
                </span>
              </div>
            </div>
          </div>

          {/* Student Profile Info */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs">
            <div className="flex items-center space-x-2.5">
              <UserCheck className="w-4 h-4 text-indigo-600" />
              <div>
                <span className="font-bold text-slate-900 block">{user?.fullName || 'Student'}</span>
                <span className="text-slate-500">{user?.email}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-indigo-600 block">Access Tier</span>
              <span className="font-semibold text-slate-800 uppercase text-xs">{user?.accessType || 'BETA_TESTER'}</span>
            </div>
          </div>

          {/* Admin Override Actions */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
              Direct Quick Actions
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Reset / Activate Beta (14 days fresh) */}
              <button
                onClick={() => {
                  if (currentUserId) activateStudent(currentUserId);
                }}
                className="p-3 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-semibold flex items-center space-x-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-indigo-600 shrink-0" />
                <div className="text-left">
                  <span className="block font-bold">Activate / Reset Beta</span>
                  <span className="text-[10px] text-indigo-600/80 font-normal">14 days from today</span>
                </div>
              </button>

              {/* Extend Beta by 7 days */}
              <button
                onClick={() => {
                  if (currentUserId) extendStudent(currentUserId, 7);
                }}
                className="p-3 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-semibold flex items-center space-x-2 transition-colors"
              >
                <Zap className="w-4 h-4 text-indigo-600 shrink-0" />
                <div className="text-left">
                  <span className="block font-bold">+7 Days Extension</span>
                  <span className="text-[10px] text-indigo-600/80 font-normal">Add 7 calendar days</span>
                </div>
              </button>

              {/* Expire Beta Access */}
              <button
                onClick={() => {
                  if (currentUserId) expireStudent(currentUserId);
                }}
                className="p-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-semibold flex items-center space-x-2 transition-colors"
              >
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <div className="text-left">
                  <span className="block font-bold">Expire Beta Now</span>
                  <span className="text-[10px] text-rose-600/80 font-normal">Test student expired state</span>
                </div>
              </button>

              {/* Grant Full 90-Day Access */}
              <button
                onClick={() => {
                  if (currentUserId) grantFullAccess(currentUserId);
                }}
                className="p-3 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center space-x-2 transition-colors"
              >
                <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="text-left">
                  <span className="block font-bold">Grant Full 90-Day Access</span>
                  <span className="text-[10px] text-emerald-600/80 font-normal">Remove beta restrictions</span>
                </div>
              </button>
            </div>

            {/* Jump to Full Admin Dashboard */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setActiveTab('admin');
                  onClose();
                }}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-2"
              >
                <Shield className="w-4 h-4 text-purple-400" />
                <span>Open Full Admin Dashboard</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
