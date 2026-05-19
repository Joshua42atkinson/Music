import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Circle } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import OrientationHub from './pages/OrientationHub';
import StudioPage from './pages/StudioPage';
import LandingScreen from './pages/LandingScreen';
import DigitalBinder from './components/DigitalBinder';
import FretboardExplorer from './components/FretboardExplorer';
import VertiscaleEngine from './game/VertiscaleEngine';
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


function AppContent() {
  return (
    <div className="min-h-screen bg-cf-void text-cf-ink relative">
      <WelcomeOnboarding />
      <AmbientPlayer />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<LandingScreen />} />
          <Route path="/song" element={<OrientationHub />} />
          <Route path="/guitar" element={<VertiscaleEngine />} />
          <Route path="/player" element={<MentorTools />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;