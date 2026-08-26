import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  Building2,
  ArrowRight,
  Target,
  FileText,
  Clock,
  Globe,
  UserCheck,
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { ALL_VA_SERVICES } from '../../data/vaServicesData';
import { AVAILABLE_INDUSTRIES, generateSimulatedClient } from '../../data/clientGenerator';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { selectService, activeService, selectedIndustry } = useSimulation();

  const [step, setStep] = useState<number>(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(activeService.id);
  const [selectedIndustryId, setSelectedIndustryId] = useState<string>(selectedIndustry || 'ecommerce_beauty');
  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

  if (!isOpen) return null;

  const targetService = ALL_VA_SERVICES.find((s) => s.id === selectedServiceId) || ALL_VA_SERVICES[0];
  const assignedClient = generateSimulatedClient(selectedServiceId, selectedIndustryId);

  const handleFinishOnboarding = () => {
    selectService(selectedServiceId, selectedIndustryId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-600 text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {step === 1 && 'Select Your Primary VA Specialization'}
                {step === 2 && 'Select Client Industry & Experience'}
                {step === 3 && 'Meet Your Assigned Client'}
              </h2>
              <p className="text-xs text-slate-500">Step {step} of 3 • CoreGuide V1 Setup</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* STEP 1: Select Official VA Service */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose one of CoreGuide's official 7 Virtual Assistant specializations:
              </p>

              <div className="grid grid-cols-1 gap-2.5">
                {ALL_VA_SERVICES.map((srv) => {
                  const isSelected = srv.id === selectedServiceId;
                  return (
                    <div
                      key={srv.id}
                      onClick={() => setSelectedServiceId(srv.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-slate-900">{srv.name}</span>
                          {srv.isV1BetaFocus && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              ⭐ Core Focus
                            </span>
                          )}
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{srv.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Industry Preference & Experience Level */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Select Simulated Client Industry Preference
                </label>
                <p className="text-xs text-slate-500">
                  Your simulated client will be matched to this business vertical:
                </p>
                <div className="grid grid-cols-1 gap-2 pt-1">
                  {AVAILABLE_INDUSTRIES.map((ind) => {
                    const isSelected = ind.id === selectedIndustryId;
                    return (
                      <div
                        key={ind.id}
                        onClick={() => setSelectedIndustryId(ind.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-500 font-medium'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{ind.name}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                        </div>
                        <span className="text-[11px] text-slate-500 block mt-0.5">{ind.description}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Your Current Experience Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'beginner', label: 'Beginner', desc: 'New to VA work' },
                    { id: 'intermediate', label: 'Intermediate', desc: '1-2 years exp' },
                    { id: 'advanced', label: 'Advanced', desc: 'Senior VA / PM' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setExperienceLevel(lvl.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        experienceLevel === lvl.id
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-bold ring-1 ring-indigo-500'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-xs font-semibold">{lvl.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{lvl.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Matched Client Dossier */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center space-x-4">
                <img
                  src={assignedClient.avatarUrl}
                  alt={assignedClient.ceoName}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-slate-700 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-base text-white">{assignedClient.ceoName}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-300 font-semibold border border-emerald-400/30">
                      Assigned Client
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {assignedClient.ceoRole} •{' '}
                    <span className="text-indigo-400 font-semibold">{assignedClient.companyName}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {assignedClient.industry} • {assignedClient.timezone}
                  </p>
                </div>
              </div>

              {/* Essential Client Info */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block font-medium">Business Size</span>
                  <span className="text-slate-900 font-semibold mt-0.5 block">{assignedClient.businessSize}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block font-medium">Communication Style</span>
                  <span className="text-slate-900 font-semibold mt-0.5 block">{assignedClient.communicationStyle}</span>
                </div>
              </div>

              <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-100 text-xs">
                <span className="font-bold text-indigo-950 block mb-1">Primary Goal:</span>
                <span className="text-slate-700 leading-relaxed">{assignedClient.goals}</span>
              </div>

              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-slate-900 uppercase tracking-wider block">
                  Operating Guidelines
                </span>
                {assignedClient.preferences.slice(0, 2).map((pref, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 flex items-start space-x-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{pref}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Back
            </button>
          ) : (
            <span />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-colors"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinishOnboarding}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-colors"
            >
              <span>Start Day 1 Simulation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
