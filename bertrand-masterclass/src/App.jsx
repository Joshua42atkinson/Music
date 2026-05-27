// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : App.jsx                                             ║
// ║ WHAT    : Root router — connects every URL to its screen      ║
// ║ WHY     : Single entry point so all routes share global state ║
// ║ WHO     : Not user-facing — orchestrates for every user       ║
// ║ OWNS    : Route definitions, lazy chunk loading, LoadingScreen ║
// ║ NEEDS   : ScaffoldingProvider, AmbientPlayer, ErrorBoundary   ║
// ║ RULES   : AmbientPlayer stays OUTSIDE Routes — always global  ║
// ║           3 portals only (/song /guitar /player) + admin      ║
// ║           ScaffoldingProvider must wrap the entire tree       ║
// ║ FIX AT  : ErrorBoundary → ScaffoldingProvider → route target  ║
// ║ STAGE   : IMPLEMENT (ADDIECRAPEYE phase 4)                    ║
// ╚═══════════════════════════════════════════════════════════════╝
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ErrorBoundary from './components/ErrorBoundary';
import { ScaffoldingProvider } from './components/ScaffoldingProvider';
import AmbientPlayer from './components/AmbientPlayer';

// ── Eagerly loaded: first paint ──
import LandingScreen from './pages/LandingScreen';

// ── Lazy loaded: per-route chunks ──
const OrientationHub = React.lazy(() => import('./pages/OrientationHub'));
const StudioPage = React.lazy(() => import('./pages/StudioPage'));
const GuitarWorkbench = React.lazy(() => import('./components/GuitarWorkbench'));
const PlayerPortal = React.lazy(() => import('./components/PlayerPortal'));
const PlaybookShell = React.lazy(() => import('./components/playbook/PlaybookShell'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = React.lazy(() => import('./pages/TermsOfService'));
const AIDeveloperChat = React.lazy(() => import('./components/AIDeveloperChat'));
const CurriculumSummary = React.lazy(() => import('./components/CurriculumSummary'));
const VertiscaleEngine = React.lazy(() => import('./game/VertiscaleEngine'));
const AdventurePlayer = React.lazy(() => import('./game/AdventurePlayer'));

// ── On-brand loading fallback ──
function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100svh',
      background: '#050508',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
    }}>
      <div style={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        border: '1px solid rgba(201,169,110,0.3)',
        animation: 'loadBreath 3s ease-in-out infinite',
      }} />
      <style>{`
        @keyframes loadBreath {
          0%, 100% { opacity: 0.3; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <ScaffoldingProvider>
          <AppContent />
        </ScaffoldingProvider>
      </ErrorBoundary>
    </Router>
  );
}


function AppContent() {
  return (
    <div className="min-h-[100svh] bg-cf-void text-cf-ink relative">
      <AmbientPlayer />
      <Suspense fallback={<LoadingScreen />}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<LandingScreen />} />
            <Route path="/song" element={<OrientationHub />} />
            <Route path="/guitar" element={<ErrorBoundary><GuitarWorkbench /></ErrorBoundary>} />
            <Route path="/player" element={<ErrorBoundary><PlayerPortal /></ErrorBoundary>} />
            <Route path="/playbook" element={<ErrorBoundary><PlaybookShell /></ErrorBoundary>} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/studio" element={<ErrorBoundary><StudioPage /></ErrorBoundary>} />
            <Route path="/summary" element={<ErrorBoundary><CurriculumSummary /></ErrorBoundary>} />
            <Route path="/ai-developer" element={<ErrorBoundary><AIDeveloperChat /></ErrorBoundary>} />
            <Route path="/game" element={<ErrorBoundary><VertiscaleEngine /></ErrorBoundary>} />
            <Route path="/adventure" element={<ErrorBoundary><AdventurePlayer /></ErrorBoundary>} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </div>
  );
}

export default App;