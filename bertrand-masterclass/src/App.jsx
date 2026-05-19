import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ErrorBoundary from './components/ErrorBoundary';
import { ScaffoldingProvider } from './components/ScaffoldingProvider';
import AmbientPlayer from './components/AmbientPlayer';
import WelcomeOnboarding from './components/WelcomeOnboarding';

// ── Eagerly loaded: first paint ──
import LandingScreen from './pages/LandingScreen';

// ── Lazy loaded: per-route chunks ──
const OrientationHub = React.lazy(() => import('./pages/OrientationHub'));
const StudioPage = React.lazy(() => import('./pages/StudioPage'));
const VertiscaleEngine = React.lazy(() => import('./game/VertiscaleEngine'));
const MentorTools = React.lazy(() => import('./components/MentorTools'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = React.lazy(() => import('./pages/TermsOfService'));

// ── On-brand loading fallback ──
function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh',
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
    <div className="min-h-screen bg-cf-void text-cf-ink relative">
      <WelcomeOnboarding />
      <AmbientPlayer />
      <Suspense fallback={<LoadingScreen />}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<LandingScreen />} />
            <Route path="/song" element={<OrientationHub />} />
            <Route path="/guitar" element={<ErrorBoundary><VertiscaleEngine /></ErrorBoundary>} />
            <Route path="/player" element={<ErrorBoundary><MentorTools /></ErrorBoundary>} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/studio" element={<ErrorBoundary><StudioPage /></ErrorBoundary>} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </div>
  );
}

export default App;