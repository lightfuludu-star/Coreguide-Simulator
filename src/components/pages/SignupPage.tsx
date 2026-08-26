import React, { useState } from 'react';
import {
  Lock,
  Mail,
  User,
  Briefcase,
  ArrowRight,
  Sparkles,
  AlertCircle,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SignupPageProps {
  onNavigateToLogin: () => void;
  onNavigateToHome: () => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({
  onNavigateToLogin,
  onNavigateToHome,
}) => {
  const { signup, quickStudentLogin, isLoading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetNiche, setTargetNiche] = useState('Executive VA');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters.');
      return;
    }
    const res = await signup(fullName, email, password, targetNiche);
    if (!res.success) {
      setErrorMsg(res.error || 'Failed to create account. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-4">
        <button
          onClick={onNavigateToHome}
          className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center space-x-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Overview</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="flex items-center justify-center space-x-2.5 mb-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-xs">
            CG
          </div>
          <span className="font-bold text-slate-900 text-lg">CoreGuide VA Simulator</span>
        </div>
        <h2 className="text-center text-xl font-bold text-slate-900">
          Enroll in 90-Day Simulation
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          Create your student training profile and match with your simulated client
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-8 rounded-xl shadow-xs border border-slate-200 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 flex items-start space-x-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jordan Miller"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jordan@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Choose Your VA Service</label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <select
                  value={targetNiche}
                  onChange={(e) => setTargetNiche(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  <option value="Executive VA">Executive VA</option>
                  <option value="Social Media VA">Social Media VA</option>
                  <option value="Customer Service VA">Customer Service VA</option>
                  <option value="Travel Management VA">Travel Management VA</option>
                  <option value="Social Marketing & Cold Outreach VA">Social Marketing & Cold Outreach VA</option>
                  <option value="Lead Generation & Research VA">Lead Generation & Research VA</option>
                  <option value="Content Writing VA">Content Writing VA</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center justify-center space-x-1.5"
            >
              <span>{isLoading ? 'Creating Account...' : 'Enroll in Simulation (Start Day 1)'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Sandbox Option */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <p className="text-center text-[11px] text-slate-400">
              Want to skip signup and test the workspace immediately?
            </p>
            <button
              type="button"
              onClick={() => quickStudentLogin()}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Launch Instant Demo Student Sandbox</span>
            </button>
          </div>

          <div className="flex items-center justify-center space-x-1 text-xs text-slate-500 pt-1">
            <span>Already have an account?</span>
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="text-indigo-600 font-semibold hover:underline"
            >
              Sign in here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
