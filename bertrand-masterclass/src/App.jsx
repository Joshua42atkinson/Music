import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import OrientationHub from './pages/OrientationHub';
import StudioPage from './pages/StudioPage';
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
          <Route path="/" element={<OrientationHub />} />
          <Route path="/orientation" element={<OrientationHub />} />
          <Route path="/studio" element={<StudioPage />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;