import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Landing from './pages/Landing';
import VideoHub from './pages/VideoHub';
import StagePage from './pages/StagePage';
import JournalManifesto from './pages/JournalManifesto';
import OrientationHub from './pages/OrientationHub';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  return (
    <div className="min-h-screen bg-cf-void text-cf-ink">
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<OrientationHub />} />
          <Route path="/orientation" element={<OrientationHub />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;