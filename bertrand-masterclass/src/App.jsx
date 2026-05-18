import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Circle } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import OrientationHub from './pages/OrientationHub';
import StudioPage from './pages/StudioPage';
import LandingScreen from './pages/LandingScreen';
import DigitalBinder from './components/DigitalBinder';
import FretboardExplorer from './components/FretboardExplorer';
import MentorTools from './components/MentorTools';
import { ScaffoldingProvider } from './components/ScaffoldingProvider';
import AmbientPlayer from './components/AmbientPlayer';
import WelcomeOnboarding from './components/WelcomeOnboarding';

function App() {
  return (
    <Router>
      <ScaffoldingProvider>
        <AppContent />
      </ScaffoldingProvider>
    </Router>
  );
}

function PortalLayout({ children }) {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen bg-cf-void text-cf-ink pb-24">
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 right-6 z-50 text-cf-gold hover:text-cf-gold/80 transition-colors"
        aria-label="Return to center"
      >
        <Circle size={32} strokeWidth={1} />
      </button>
      <div className="pt-16">
        {children}
      </div>
    </div>
  );
}

function AppContent() {
  return (
    <div className="min-h-screen bg-cf-void text-cf-ink relative">
      <WelcomeOnboarding />
      <AmbientPlayer />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<LandingScreen />} />
          <Route path="/song" element={<OrientationHub />} />
          <Route path="/guitar" element={<PortalLayout><FretboardExplorer /></PortalLayout>} />
          <Route path="/player" element={<PortalLayout><MentorTools /></PortalLayout>} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;