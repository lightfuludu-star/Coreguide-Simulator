import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SimulationProvider } from './context/SimulationContext';
import { LandingPage } from './components/pages/LandingPage';
import { LoginPage } from './components/pages/LoginPage';
import { SignupPage } from './components/pages/SignupPage';
import { AppLayout } from './components/layout/AppLayout';

type PublicRoute = 'landing' | 'login' | 'signup';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [publicRoute, setPublicRoute] = useState<PublicRoute>('landing');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg animate-pulse">
            CG
          </div>
          <p className="text-xs text-slate-400 font-medium">Loading CoreGuide Simulator...</p>
        </div>
      </div>
    );
  }

  // Protected shell when authenticated
  if (isAuthenticated) {
    return (
      <SimulationProvider>
        <AppLayout />
      </SimulationProvider>
    );
  }

  // Public unauthenticated routes
  if (publicRoute === 'login') {
    return (
      <LoginPage
        onNavigateToSignup={() => setPublicRoute('signup')}
        onNavigateToHome={() => setPublicRoute('landing')}
      />
    );
  }

  if (publicRoute === 'signup') {
    return (
      <SignupPage
        onNavigateToLogin={() => setPublicRoute('login')}
        onNavigateToHome={() => setPublicRoute('landing')}
      />
    );
  }

  return (
    <LandingPage
      onNavigateToLogin={() => setPublicRoute('login')}
      onNavigateToSignup={() => setPublicRoute('signup')}
    />
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
