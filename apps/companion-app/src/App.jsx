// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : App.jsx                                             ║
// ║ WHAT    : Root router — connects every URL to its screen      ║
// ║ WHY     : Single entry point so all routes share global state ║
// ║ WHO     : Not user-facing — orchestrates for every user       ║
// ║ OWNS    : Route definitions, lazy chunk loading, LoadingScreen ║
// ║ NEEDS   : ScaffoldingProvider, TruebadourProvider, ErrorBound ║
// ║ RULES   : 5 destinations: / /song /player /binder /riff       ║
// ║           AmbientPlayer stays OUTSIDE Routes — always global  ║
// ║           ScaffoldingProvider must wrap the entire tree       ║
// ║ FIX AT  : ErrorBoundary → ScaffoldingProvider → route target  ║
// ║ STAGE   : IMPLEMENT — updated 2026-06-04 (Nemotron audit)     ║
// ╚═══════════════════════════════════════════════════════════════╝
import React, { Suspense, useEffect } from 'react';
import { setupPushNotifications, evaluateNotifications } from './data/notificationEngine';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './hooks/useAuth';
import { migrateStorage, vvGet } from './lib/storage';
import { STORAGE_KEYS } from './lib/storageKeys';
import ErrorBoundary from './components/ErrorBoundary';
import { ScaffoldingProvider, useScaffolding } from './components/ScaffoldingProvider';
import { TruebadourProvider } from './hooks/TruebadourProvider';
const TruebadourWidget = React.lazy(() => import('./features/somatic-masterclass/TruebadourWidget'));
const BookWidget       = React.lazy(() => import('./components/BookWidget'));


// ── Eagerly loaded: first paint ──
import LandingScreen from './pages/LandingScreen';

// ── Lazy loaded: per-route chunks ──
const OrientationHub = React.lazy(() => import('./pages/OrientationHub'));
const CScaleHub = React.lazy(() => import('./pages/CScaleHub'));
const StudioPage = React.lazy(() => import('./pages/StudioPage'));
const GuitarWorkbench = React.lazy(() => import('./components/GuitarWorkbench'));
const PlayerPortal = React.lazy(() => import('./components/PlayerPortal'));
const PlaybookShell = React.lazy(() => import('./components/playbook/PlaybookShell'));
const Binder = React.lazy(() => import('./components/Binder'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = React.lazy(() => import('./pages/TermsOfService'));
const AIDeveloperChat = React.lazy(() => import('./components/AIDeveloperChat'));
const CurriculumSummary = React.lazy(() => import('./components/CurriculumSummary'));
const VertiscaleEngine = React.lazy(() => import('./game/VertiscaleEngine'));
const AdventurePlayer = React.lazy(() => import('./game/AdventurePlayer'));
const ChromaticMonomyth = React.lazy(() => import('./features/somatic-masterclass/ChromaticMonomyth'));
const MentorDashboard = React.lazy(() => import('./pages/MentorDashboard'));
const MaturationMap = React.lazy(() => import('./components/MaturationMap'));
const StudentDashboard = React.lazy(() => import('./pages/StudentDashboard'));
const FeedbackButton = React.lazy(() => import('./components/FeedbackButton'));
const StreakToast    = React.lazy(() => import('./components/StreakToast'));
const OnboardingModal = React.lazy(() => import('./components/OnboardingModal'));

const ResonantMirrorPOC = React.lazy(() => import('./components/ResonantMirrorPOC'));
const WalkingModeEngine = React.lazy(() => import('./game/WalkingModeEngine'));
const SomaticStudioPrompter = React.lazy(() => import('./features/somatic-masterclass/SomaticStudioPrompter'));
const HumanOctaveLibrary = React.lazy(() => import('./components/HumanOctaveLibrary'));
const CommunityHub = React.lazy(() => import('./components/CommunityHub'));
const MentorshipBlog = React.lazy(() => import('./features/somatic-masterclass/MentorshipBlog'));
const Bible12M = React.lazy(() => import('./pages/Bible12M'));
const RiffHub  = React.lazy(() => import('./pages/RiffHub'));
const AITestPage = React.lazy(() => import('./pages/AITestPage'));
const BlueprintHub = React.lazy(() => import('./pages/BlueprintHub'));
const ArchetypePage = React.lazy(() => import('./pages/ArchetypePage'));
import PrimaryNav from './components/PrimaryNav';

// ── On-brand loading fallback ──
function LoadingScreen() {
  return (
    <div className="min-h-[100svh] bg-[#050508] flex flex-col items-center justify-center gap-4">
      <div className="w-7 h-7 rounded-full border border-cf-gold/30"
        style={{ animation: 'loadBreath 3s ease-in-out infinite' }}
      />
      <style>{`
        @keyframes loadBreath {
          0%, 100% { opacity: 0.3; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-[100svh] bg-[#050508] flex flex-col items-center justify-center text-[#e8dcc8] font-sans text-center p-8">
      <h1 className="text-[6rem] m-0 text-cf-gold/30 font-heading">404</h1>
      <p className="text-[1.2rem] text-white/50 mb-8">This path does not exist in the curriculum.</p>
      <a href="/" className="text-cf-gold no-underline border-b border-cf-gold/30 pb-0.5">Return to the Beginning</a>
    </div>
  );
}

function FreePlayGuard({ children }) {
  const { traction } = useScaffolding();
  const [showOnboarding, setShowOnboarding] = React.useState(false);

  // Check if onboarding is needed — shown as overlay widget, never blocks
  React.useEffect(() => {
    const onboardingComplete = vvGet(STORAGE_KEYS.ONBOARDED);
    if (!onboardingComplete) {
      setShowOnboarding(true);
    }
  }, []);
  
  if (traction?.gameMode !== false) return <Navigate to="/dashboard" replace />;
  
  return (
    <>
      {children}
      {showOnboarding && (
        <React.Suspense fallback={null}>
          <OnboardingModal onClose={() => setShowOnboarding(false)} />
        </React.Suspense>
      )}
    </>
  );
}

function MentorAuthGuard({ children }) {
  // Auth disabled — Supabase removed; mentor route always accessible locally
  return children;
}

import { BevyIPCProvider } from './hooks/useBevyIPC';

function App() {
  // One-time localStorage key migration (idempotent)
  React.useEffect(() => {
    migrateStorage();
  }, []);

  return (
    <Router>
      <ErrorBoundary>
        <ScaffoldingProvider>
          <BevyIPCProvider>
            <AppContent />
          </BevyIPCProvider>
        </ScaffoldingProvider>
      </ErrorBoundary>
    </Router>
  );
}

function RootRedirector() {
  // Auth disabled — always show landing
  return <LandingScreen />;
}


function AppContent() {
  useEffect(() => {
    // 1. Request permission and register SW
    setupPushNotifications();

    // 2. Background evaluator loop (every minute)
    const interval = setInterval(() => {
      const notification = evaluateNotifications();
      if (notification) {
        // Display using browser Notifications if permitted
        if (Notification.permission === 'granted') {
          new Notification(notification.title, { body: notification.body, icon: '/assets/app-icon.png' });
        }
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const { aiEnabled } = useScaffolding();

  return (
    <TruebadourProvider>
    {/* nav-app-root: CSS class handles desktop paddingTop + mobile paddingBottom via media query */}
    <div className="min-h-[100svh] bg-cf-void text-[#f0e6d2] relative nav-app-root">
        {/* Scroll to top on every route change */}
        <ScrollToTop />
        {/* 5-destination persistent navigation */}
        <PrimaryNav />
        {/* 🔴 Riff — Practice & Play (top-left) */}
        {aiEnabled && <Suspense fallback={null}><TruebadourWidget /></Suspense>}
        {/* 📘 Binder — Study & Learn (top-right) */}
        <Suspense fallback={null}><BookWidget /></Suspense>
        {/* Beta feedback pill */}
        <Suspense fallback={null}><FeedbackButton /></Suspense>
        {/* Streak protect toast */}
        <Suspense fallback={null}><StreakToast /></Suspense>
      <main role="main">
      <Suspense fallback={<LoadingScreen />}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<RootRedirector />} />
            <Route path="/dashboard" element={<ErrorBoundary><StudentDashboard /></ErrorBoundary>} />
            <Route path="/onboarding" element={<ErrorBoundary><OnboardingModal onClose={() => window.history.back()} /></ErrorBoundary>} />

            <Route path="/c-scale" element={<ErrorBoundary><CScaleHub /></ErrorBoundary>} />
            <Route path="/contemplative" element={<OrientationHub />} />
            <Route path="/song" element={<Navigate to="/contemplative" replace />} />
            <Route path="/guitar" element={<Navigate to="/workbook" replace />} />
            <Route path="/guitar/map" element={<ErrorBoundary><MaturationMap /></ErrorBoundary>} />
            <Route path="/player" element={<ErrorBoundary><PlayerPortal /></ErrorBoundary>} />
            {/* ── 5 Primary Destinations ───────────────────────── */}
            <Route path="/binder" element={<ErrorBoundary><Binder /></ErrorBoundary>} />
            <Route path="/riff"   element={<ErrorBoundary><RiffHub /></ErrorBoundary>} />
            
            {/* ── New Features ────────────────────────────────── */}
            <Route path="/blueprint" element={<ErrorBoundary><FreePlayGuard><BlueprintHub /></FreePlayGuard></ErrorBoundary>} />
            <Route path="/archetype" element={<ErrorBoundary><FreePlayGuard><ArchetypePage /></FreePlayGuard></ErrorBoundary>} />

            {/* ── Legacy aliases → redirect to primary destinations */}
            <Route path="/playbook" element={<Navigate to="/binder" replace />} />
            <Route path="/workbook" element={<Navigate to="/binder" replace />} />
            <Route path="/summary"  element={<Navigate to="/binder" replace />} />
            <Route path="/inner-circle" element={<Navigate to="/riff" replace />} />
            <Route path="/rift"         element={<Navigate to="/riff" replace />} />

            {/* ── Still-active sub-routes ──────────────────────── */}
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/studio" element={<ErrorBoundary><StudioPage /></ErrorBoundary>} />
            <Route path="/studio/prompter" element={<ErrorBoundary><SomaticStudioPrompter /></ErrorBoundary>} />
            <Route path="/game" element={<ErrorBoundary><FreePlayGuard><VertiscaleEngine /></FreePlayGuard></ErrorBoundary>} />
            <Route path="/adventure" element={<ErrorBoundary><FreePlayGuard><AdventurePlayer /></FreePlayGuard></ErrorBoundary>} />
            <Route path="/mentor" element={<ErrorBoundary><MentorAuthGuard><MentorDashboard /></MentorAuthGuard></ErrorBoundary>} />
            <Route path="/community" element={<ErrorBoundary><CommunityHub /></ErrorBoundary>} />
            <Route path="/12m" element={<ErrorBoundary><Bible12M /></ErrorBoundary>} />

            {/* ── Dev-only routes (hidden from nav) ────────────── */}
            <Route path="/ai-developer" element={<ErrorBoundary><FreePlayGuard><AIDeveloperChat /></FreePlayGuard></ErrorBoundary>} />
            <Route path="/poc" element={<ErrorBoundary><FreePlayGuard><ResonantMirrorPOC /></FreePlayGuard></ErrorBoundary>} />
            <Route path="/walking" element={<ErrorBoundary><FreePlayGuard><WalkingModeEngine /></FreePlayGuard></ErrorBoundary>} />
            <Route path="/monomyth" element={<ErrorBoundary><FreePlayGuard><ChromaticMonomyth /></FreePlayGuard></ErrorBoundary>} />
            <Route path="/human-octave" element={<ErrorBoundary><FreePlayGuard><HumanOctaveLibrary /></FreePlayGuard></ErrorBoundary>} />
            <Route path="/ai-test" element={<FreePlayGuard><AITestPage /></FreePlayGuard>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
      </main>
    </div>
    </TruebadourProvider>
  );
}

export default App;