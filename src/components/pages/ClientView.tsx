import React from 'react';
import {
  Building2,
  Clock,
  Globe,
  MessageSquare,
  Star,
  CheckCircle2,
  Target,
  FileText,
  Hourglass,
  User,
  HeartHandshake,
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const ClientView: React.FC = () => {
  const { client, setActiveTab, activeService } = useSimulation();

  const preferencesList = client.preferences || client.clientPreferences || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* 1. Client Header Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center space-x-4">
            <img
              src={client.avatarUrl}
              alt={client.ceoName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-100 shadow-xs shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{client.ceoName}</h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Your Client
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-700 mt-0.5">
                {client.ceoRole} • <span className="text-indigo-600 font-bold">{client.companyName}</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Industry: <strong className="text-slate-700 font-medium">{client.industry}</strong>
              </p>
            </div>
          </div>

          <button
            id="client-view-chat-btn"
            onClick={() => setActiveTab('chat')}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center justify-center space-x-2 shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Send Message</span>
          </button>
        </div>
      </div>

      {/* 2. Business & Role Details */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
          <Building2 className="w-4 h-4 text-indigo-600" />
          <span>Business Overview</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-xs text-slate-500 font-medium block">Business Name</span>
            <span className="text-slate-900 font-bold block">{client.companyName}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-xs text-slate-500 font-medium block">Industry</span>
            <span className="text-slate-900 font-bold block">{client.industry}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-xs text-slate-500 font-medium block">Client Role</span>
            <span className="text-slate-900 font-semibold block">{client.ceoRole}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-xs text-slate-500 font-medium block">Specialization Track</span>
            <span className="text-slate-900 font-semibold block">{activeService.name}</span>
          </div>
        </div>

        {client.companyBackground && (
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
            {client.companyBackground}
          </p>
        )}
      </div>

      {/* 3. Goals & Expectations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Goals */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center space-x-2">
            <Target className="w-4 h-4 text-indigo-600" />
            <span>Primary Goals</span>
          </h2>
          <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/70 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
            {client.goals || 'Scale daily operational efficiency, reduce turnaround times, and maintain premium quality for all customer and stakeholder touchpoints.'}
          </div>
        </div>

        {/* Expectations */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
            <FileText className="w-4 h-4 text-slate-600" />
            <span>Expectations from VA</span>
          </h2>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
            {client.expectations || 'Accurate execution adhering strictly to operating guidelines; daily summary of completed tasks; proactive communication when blockers arise.'}
          </div>
        </div>
      </div>

      {/* 4. Preferences & Operating Guidelines */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
          <HeartHandshake className="w-4 h-4 text-indigo-600" />
          <span>Client Preferences & Guidelines</span>
        </h2>

        <div className="space-y-3">
          {preferencesList.map((pref, idx) => (
            <div
              key={idx}
              className="flex items-start space-x-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm"
            >
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span className="text-slate-800 leading-relaxed font-medium">{pref}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Communication Style & Working Hours */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Communication Style */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            <span>Communication Style</span>
          </h2>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
            {client.communicationStyle}
          </div>
        </div>

        {/* Working Hours & Schedule */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>Working Hours & Time Sensitivity</span>
          </h2>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
            <span className="font-bold block mb-1">Time Sensitivity:</span>
            {client.timeSensitivity || 'Urgent inquiries and priority tasks should be completed within assigned business hours.'}
          </div>

          <div className="space-y-2 text-xs sm:text-sm pt-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center space-x-1.5">
                <Globe className="w-4 h-4 text-slate-400" />
                <span>Timezone:</span>
              </span>
              <span className="font-bold text-slate-800">{client.timezone}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Working Hours:</span>
              </span>
              <span className="font-bold text-slate-800">{client.workingHours}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
