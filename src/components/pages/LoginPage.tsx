import React, { useState } from 'react';
import {
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  AlertCircle,
  ArrowLeft,
  Database,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LoginPageProps {
  onNavigateToSignup: () => void;
  onNavigateToHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateToSignup,
  onNavigateToHome,
}) => {
  const { login, quickStudentLogin, isLoading, isSupabaseActive } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const res = await login(email, password);
    if (!res.success) {
      setErrorMsg(res.error || 'Failed to sign in. Please check your credentials.');
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
          Student Portal Sign In
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          Access your active 90-day simulation workspace
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-8 rounded-xl shadow-xs border border-slate-200 space-y-6">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 flex items-start space-x-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-700">Password</label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center justify-center space-x-1.5"
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In to Simulation'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Sandbox Option */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <p className="text-center text-[11px] text-slate-400">
              Testing or previewing the simulator?
            </p>
            <button
              type="button"
              onClick={() => quickStudentLogin()}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Continue as Demo Student (1-Click)</span>
            </button>
          </div>

          <div className="flex items-center justify-center space-x-1 text-xs text-slate-500 pt-1">
            <span>Don't have an account yet?</span>
            <button
              type="button"
              onClick={onNavigateToSignup}
              className="text-indigo-600 font-semibold hover:underline"
            >
              Sign up here
            </button>
          </div>
        </div>

        {/* Backend Status Note */}
        <div className="mt-4 text-center">
          <span className="inline-flex items-center space-x-1 text-[11px] text-slate-400">
            <Database className="w-3 h-3" />
            <span>
              {isSupabaseActive ? 'Supabase Auth active' : 'Local Auth Mode active (Supabase ready)'}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
