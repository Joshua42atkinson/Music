import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import OrientationHub from './pages/OrientationHub';
import { ScaffoldingProvider } from './components/ScaffoldingProvider';

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