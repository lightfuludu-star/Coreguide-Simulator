import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Briefcase,
  Sparkles,
  Headphones,
  Plane,
  MailCheck,
  Search,
  PenTool,
  MessageSquare,
  Clock,
  Target,
  FileCheck,
  Check,
  Menu,
  X,
  User,
  Building2,
  HelpCircle,
  TrendingUp,
  AlertCircle,
  FileText,
  Compass,
} from 'lucide-react';

interface LandingPageProps {
  onNavigateToLogin: () => void;
  onNavigateToSignup: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToLogin,
  onNavigateToSignup,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 1. Navigation smooth scroll handler
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 2. 7 Official CoreGuide VA Services
  const vaServices = [
    {
      title: 'Executive VA',
      description: 'Executive calendar management, meeting briefs, inbox triage, and confidential executive coordination.',
      icon: Briefcase,
    },
    {
      title: 'Social Media VA',
      description: 'Content planning, community engagement, multi-channel scheduling, and brand asset preparation.',
      icon: Sparkles,
    },
    {
      title: 'Customer Service VA',
      description: 'Ticketing triage, empathetic client communication, conflict de-escalation, and workflow support.',
      icon: Headphones,
    },
    {
      title: 'Travel Management VA',
      description: 'Complex multi-leg itineraries, flight and transit booking, lodging coordination, and contingency prep.',
      icon: Plane,
    },
    {
      title: 'Social Marketing & Cold Outreach VA',
      description: 'Prospect pipeline building, personalized outreach drafts, and campaign follow-ups.',
      icon: MailCheck,
    },
    {
      title: 'Lead Generation & Research VA',
      description: 'Targeted market research, B2B list building, data verification, and company dossiers.',
      icon: Search,
    },
    {
      title: 'Content Writing VA',
      description: 'Blog drafting, newsletter copy, business correspondence, standard operating procedures, and proofreading.',
      icon: PenTool,
    },
  ];

  // 3. 6 Progression Stages + Capstone
  const progressionStages = [
    {
      stage: 'Stage 1 — Foundation',
      days: 'Days 1–7',
      desc: 'Orientation, baseline client expectations, and fundamental communication rhythms.',
    },
    {
      stage: 'Stage 2 — Independent Execution',
      days: 'Days 8–21',
      desc: 'Handling assigned tasks independently with precision and attention to detail.',
    },
    {
      stage: 'Stage 3 — Problem Solving',
      days: 'Days 22–35',
      desc: 'Navigating incomplete instructions, ambiguity, and urgent schedule changes.',
    },
    {
      stage: 'Stage 4 — Client Management',
      days: 'Days 36–50',
      desc: 'Managing client preferences, setting expectations, and proactive updates.',
    },
    {
      stage: 'Stage 5 — Pressure & Multiple Tasks',
      days: 'Days 51–70',
      desc: 'Prioritising competing deliverables and handling tight turnaround requests.',
    },
    {
      stage: 'Stage 6 — Advanced Professional Execution',
      days: 'Days 71–89',
      desc: 'Autonomous high-stakes operations, executive briefs, and strategic support.',
    },
  ];

  // 4. Who CoreGuide Is For Points
  const targetAudiencePoints = [
    'Learn Virtual Assistance',
    'Practise before working with real clients',
    'Develop practical VA skills',
    'Improve professional communication',
    'Build confidence through practice',
    'Develop professional judgement',
    'Practise handling different client situations',
    'Become more prepared for real client work',
  ];

  // 5. 5 Universal Dimensions
  const universalDimensions = [
    { name: 'Accuracy', desc: 'Precision in deliverables, attention to brief requirements, and zero-defect execution.' },
    { name: 'Communication', desc: 'Tone, clarity, proactive updates, and professional written etiquette.' },
    { name: 'Judgement', desc: 'Sound decision-making when facing ambiguity, trade-offs, or time constraints.' },
    { name: 'Initiative', desc: 'Anticipating next steps, proposing solutions, and resourceful problem-solving.' },
    { name: 'Client Handling', desc: 'Empathy, poise under pressure, expectation setting, and managing client temperament.' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* ========================================================================= */}
      {/* 1. NAVIGATION                                                             */}
      {/* ========================================================================= */}
      <header className="h-16 bg-white/95 backdrop-blur-xs border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Brand */}
          <button
            onClick={() => scrollToSection('top')}
            className="flex items-center space-x-3 text-left focus:outline-hidden"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white tracking-tight shadow-xs text-sm">
              CG
            </div>
            <div>
              <span className="font-bold text-slate-900 tracking-tight text-sm block leading-none">
                CoreGuide Academy
              </span>
              <span className="text-[11px] text-slate-500 font-medium tracking-wide">
                Practical VA Training
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold text-slate-600">
            <button
              onClick={() => scrollToSection('top')}
              className="hover:text-indigo-600 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-indigo-600 transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('va-services')}
              className="hover:text-indigo-600 transition-colors"
            >
              VA Services
            </button>
            <button
              onClick={onNavigateToLogin}
              className="text-slate-800 hover:text-indigo-600 transition-colors"
            >
              Sign In
            </button>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            <button
              id="nav-signin-btn"
              onClick={onNavigateToLogin}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Sign In
            </button>
            <button
              id="nav-get-started-btn"
              onClick={onNavigateToSignup}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors flex items-center space-x-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 shadow-lg">
            <button
              onClick={() => scrollToSection('top')}
              className="block w-full text-left py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="block w-full text-left py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('va-services')}
              className="block w-full text-left py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600"
            >
              VA Services
            </button>
            <div className="pt-2 border-t border-slate-100 flex flex-col space-y-2">
              <button
                onClick={onNavigateToLogin}
                className="w-full py-2.5 text-center text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Sign In
              </button>
              <button
                onClick={onNavigateToSignup}
                className="w-full py-2.5 text-center text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold mb-6">
          <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
          <span>COREGUIDE ACADEMY</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
          Learn Virtual Assistance. <br className="hidden sm:inline" />
          <span className="text-indigo-600">Practise Real Client Work.</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
          CoreGuide Academy helps aspiring Virtual Assistants move beyond theory and practise real-world VA work through realistic simulated clients, practical tasks, client communication, deliverables, evaluation and feedback.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mb-12">
          <button
            id="hero-start-learning-btn"
            onClick={onNavigateToSignup}
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-xs transition-colors flex items-center justify-center space-x-2"
          >
            <span>Start Learning</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="hero-signin-btn"
            onClick={onNavigateToLogin}
            className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-sm font-semibold shadow-xs transition-colors flex items-center justify-center"
          >
            <span>Sign In</span>
          </button>
        </div>

        {/* Visual Workflow Chain */}
        <div className="pt-8 border-t border-slate-200/80 max-w-4xl mx-auto">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
            The CoreGuide Training Workflow
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-slate-700">
            <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">Learn</span>
            <span className="text-slate-300 font-bold">↓</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">Meet Your Client</span>
            <span className="text-slate-300 font-bold">↓</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">Receive a Task</span>
            <span className="text-slate-300 font-bold">↓</span>
            <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">Do the Work</span>
            <span className="text-slate-300 font-bold">↓</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">Submit</span>
            <span className="text-slate-300 font-bold">↓</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">Get Feedback</span>
            <span className="text-slate-300 font-bold">↓</span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">Improve</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. WHAT IS COREGUIDE?                                                     */}
      {/* ========================================================================= */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
              About The Academy
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              What is CoreGuide?
            </h2>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              CoreGuide is a practical Virtual Assistant training academy designed to help students develop the skills needed to work professionally with clients.
            </p>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Instead of only watching lessons or completing theoretical assignments, students practise performing realistic client tasks inside a simulated work environment.
            </p>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Students learn, communicate with their simulated client, complete tasks, submit their work, receive feedback and improve as they progress.
            </p>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-center">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-900 font-bold text-sm sm:text-base text-center">
                <span>"You don't just learn VA skills. You practise using them."</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. HOW COREGUIDE WORKS                                                    */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
              Methodology
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              How CoreGuide Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              A structured four-step journey from core principles to real client readiness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                1
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">
                Learn
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Learn the fundamentals of Virtual Assistance, positioning, client acquisition and professional VA work.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                2
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">
                Choose Your VA Service
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Choose the type of Virtual Assistant service you want to develop based on your interests and abilities.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                3
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">
                Work With Your Client
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Receive a realistic simulated business and client, then complete tasks based on your selected VA service.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                4
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">
                Submit, Get Feedback & Improve
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Submit your work, receive structured evaluation and simulated client feedback, identify weaknesses and improve through the next task.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. VA SERVICES                                                            */}
      {/* ========================================================================= */}
      <section id="va-services" className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
              Core Disciplines
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Choose Your VA Service
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Practise with realistic client workflows across the official CoreGuide service disciplines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {vaServices.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="p-5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition-all shadow-xs flex flex-col"
                >
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 mb-1">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. SIMULATED CLIENT EXPERIENCE                                            */}
      {/* ========================================================================= */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
              Realistic Relationships
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Your Training Happens Around a Client
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              CoreGuide doesn't give students random assignments disconnected from real work. Students practise inside a simulated client relationship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: What Each Client Has */}
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-sm sm:text-base text-slate-900">
                    A Complete Client Profile
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Every simulation is grounded in a specific business context with clear parameters:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-700">
                  <div className="p-2 rounded bg-white border border-slate-200 flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    <span>Business</span>
                  </div>
                  <div className="p-2 rounded bg-white border border-slate-200 flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    <span>Industry</span>
                  </div>
                  <div className="p-2 rounded bg-white border border-slate-200 flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    <span>Goals</span>
                  </div>
                  <div className="p-2 rounded bg-white border border-slate-200 flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    <span>Expectations</span>
                  </div>
                  <div className="p-2 rounded bg-white border border-slate-200 flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    <span>Communication style</span>
                  </div>
                  <div className="p-2 rounded bg-white border border-slate-200 flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    <span>Working preferences</span>
                  </div>
                  <div className="p-2 rounded bg-white border border-slate-200 flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    <span>Deadlines</span>
                  </div>
                  <div className="p-2 rounded bg-white border border-slate-200 flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    <span>Client personality</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: What The Client Does */}
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-sm sm:text-base text-slate-900">
                    Dynamic Client Interactions
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Students experience real workplace dynamics rather than static multiple-choice prompts:
                </p>
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>Give tasks and answer questions in real time</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>Provide incomplete instructions requiring clarification</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>Change requirements and request revisions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>Create urgency and realistic timeline pressures</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>Provide genuine reactions based on deliverable quality</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>Respond differently depending on how situations are handled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. 90-DAY PRACTICAL TRAINING                                              */}
      {/* ========================================================================= */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
              Curriculum Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Build Your Skills Through 90 Days of Practical Training
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              The simulation becomes progressively more challenging as students develop their skills.
            </p>
          </div>

          <div className="space-y-3 max-w-2xl mx-auto">
            {progressionStages.map((item, idx) => (
              <div
                key={item.stage}
                className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex items-start space-x-4"
              >
                <div className="w-7 h-7 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                    <h3 className="text-sm font-bold text-slate-900">{item.stage}</h3>
                    <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {item.days}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}

            {/* Day 90 Capstone */}
            <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/70 shadow-xs flex items-start space-x-4">
              <div className="w-7 h-7 rounded-md bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                ★
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                  <h3 className="text-sm font-bold text-indigo-950">Day 90 — Capstone</h3>
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md">
                    Final Assessment
                  </span>
                </div>
                <p className="text-xs text-indigo-900/80 leading-relaxed">
                  Comprehensive end-to-end client engagement demonstrating autonomous execution and professional readiness.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. EVALUATION & FEEDBACK                                                   */}
      {/* ========================================================================= */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
              Structured Assessment
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Your Work Gets Evaluated
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Students don't simply submit work and move on. Each deliverable receives detailed multidimensional evaluation and feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Universal 5 Dimensions */}
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-1">
                  5 Universal Professional Dimensions
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Evaluated across every single client task submitted:
                </p>
                <div className="space-y-3">
                  {universalDimensions.map((dim) => (
                    <div key={dim.name} className="bg-white p-3 rounded-lg border border-slate-200">
                      <div className="font-bold text-xs text-slate-900">{dim.name}</div>
                      <div className="text-[11px] text-slate-600 mt-0.5">{dim.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Service-Specific Skills & Feedback Structure */}
            <div className="space-y-6 flex flex-col">
              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 flex-1">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-1">
                  Service-Specific Skill Tracking
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  CoreGuide tracks domain-specific competencies for your chosen path:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                    <div className="text-xs font-bold text-indigo-700 mb-2">Customer Service VA</div>
                    <ul className="text-[11px] text-slate-600 space-y-1">
                      <li>• Complaint Handling</li>
                      <li>• Customer Communication</li>
                      <li>• Ticket Management</li>
                      <li>• Escalation</li>
                    </ul>
                  </div>

                  <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                    <div className="text-xs font-bold text-indigo-700 mb-2">Social Media VA</div>
                    <ul className="text-[11px] text-slate-600 space-y-1">
                      <li>• Content Planning</li>
                      <li>• Community Management</li>
                      <li>• Content Research</li>
                      <li>• Scheduling</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50">
                <h3 className="font-bold text-sm text-slate-900 mb-3">
                  What Students Receive on Every Task
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-medium text-slate-700">
                  <div className="p-2 rounded bg-white border border-slate-200 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Evaluation score</span>
                  </div>
                  <div className="p-2 rounded bg-white border border-slate-200 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Identified strengths</span>
                  </div>
                  <div className="p-2 rounded bg-white border border-slate-200 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Areas for improvement</span>
                  </div>
                  <div className="p-2 rounded bg-white border border-slate-200 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Actionable feedback</span>
                  </div>
                  <div className="p-2 rounded bg-white border border-slate-200 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Client reaction</span>
                  </div>
                  <div className="p-2 rounded bg-white border border-slate-200 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Skill progression</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. WHY COREGUIDE IS DIFFERENT                                             */}
      {/* ========================================================================= */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
              The Practical Edge
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Learn More Than What a VA Is. <br className="hidden sm:inline" />
              <span className="text-indigo-600">Learn How to Work Like One.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Traditional Learning */}
            <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Traditional Learning
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-4">
                  Passive Theory & Quizzes
                </h3>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="p-2 rounded bg-slate-50 border border-slate-100">Watch lessons</div>
                  <div className="text-center text-slate-300 font-bold">↓</div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-100">Complete theoretical assignments</div>
                  <div className="text-center text-slate-300 font-bold">↓</div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-100">Move to the next lesson</div>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-4 italic">
                Leaves students unprepared for real client communication and unexpected workplace demands.
              </p>
            </div>

            {/* CoreGuide */}
            <div className="p-6 rounded-xl border border-indigo-200 bg-white shadow-xs flex flex-col justify-between ring-1 ring-indigo-50">
              <div>
                <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">
                  CoreGuide Training
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-4">
                  Active Real-Client Simulation
                </h3>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="p-1.5 rounded bg-indigo-50/60 font-semibold text-indigo-900 border border-indigo-100">
                    Learn & Meet a client
                  </div>
                  <div className="text-center text-indigo-300 font-bold">↓</div>
                  <div className="p-1.5 rounded bg-indigo-50/60 font-semibold text-indigo-900 border border-indigo-100">
                    Receive a task & Communicate
                  </div>
                  <div className="text-center text-indigo-300 font-bold">↓</div>
                  <div className="p-1.5 rounded bg-indigo-50/60 font-semibold text-indigo-900 border border-indigo-100">
                    Do the work & Submit deliverables
                  </div>
                  <div className="text-center text-indigo-300 font-bold">↓</div>
                  <div className="p-1.5 rounded bg-emerald-50 font-semibold text-emerald-900 border border-emerald-100">
                    Get evaluated, improve & take on next challenge
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-indigo-700 text-center">
                "CoreGuide is built around practice."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. WHO COREGUIDE IS FOR                                                  */}
      {/* ========================================================================= */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
              Audience
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Who Is CoreGuide For?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Designed for aspiring professionals seeking real competence and practical confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-2xl mx-auto mb-6">
            {targetAudiencePoints.map((point) => (
              <div
                key={point}
                className="flex items-center space-x-3 p-3.5 rounded-lg bg-slate-50 border border-slate-200 shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-slate-800">{point}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-center text-slate-500 max-w-md mx-auto">
            Focused on practical preparation, skill mastery, and real-world client handling.
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. FINAL CALL TO ACTION                                                  */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 bg-slate-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
            Start Your Journey
          </span>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Start Practising?
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Learn the skills. Practise the work. Build the confidence to work professionally.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              id="cta-get-started-btn"
              onClick={onNavigateToSignup}
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-xs transition-colors flex items-center justify-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="cta-signin-btn"
              onClick={onNavigateToLogin}
              className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-sm font-semibold transition-colors"
            >
              <span>Sign In</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12. FOOTER                                                                */}
      {/* ========================================================================= */}
      <footer className="py-10 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 text-center sm:text-left">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                CG
              </div>
              <span className="font-bold text-slate-900 text-sm">CoreGuide Academy</span>
            </div>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="text-xs text-slate-500">Practical Virtual Assistant Training</span>
          </div>

          <div className="flex items-center space-x-6 text-xs font-semibold text-slate-600">
            <button onClick={() => scrollToSection('top')} className="hover:text-indigo-600 transition-colors">
              Home
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-indigo-600 transition-colors">
              How It Works
            </button>
            <button onClick={() => scrollToSection('va-services')} className="hover:text-indigo-600 transition-colors">
              VA Services
            </button>
            <button onClick={onNavigateToLogin} className="hover:text-indigo-600 transition-colors">
              Sign In
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} CoreGuide Academy. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
