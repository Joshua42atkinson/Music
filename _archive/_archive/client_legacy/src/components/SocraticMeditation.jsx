import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SocraticMeditation({ meditations }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [complete, setComplete] = useState(false);

  const advance = () => {
    if (currentIndex < meditations.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setComplete(true);
    }
  };

  if (complete) {
    return (
      <section className="meditation-section meditation-complete" id="meditation">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="meditation-done-container"
        >
          <p className="meditation-done-text">Continue when ready.</p>
        </motion.div>
      </section>
    );
  }

  const meditation = meditations[currentIndex];

  return (
    <section className="meditation-section" id="meditation">
      <AnimatePresence mode="wait">
        <motion.div
          key={meditation.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="meditation-card"
        >
          <p className="meditation-label">
            Socratic Meditation {currentIndex + 1} of {meditations.length}
          </p>

          <blockquote className="meditation-question">
            {meditation.question}
          </blockquote>

          <button
            onClick={advance}
            className="meditation-button"
            id={`reflect-btn-${meditation.id}`}
          >
            {currentIndex < meditations.length - 1 ? 'Continue' : 'Complete'}
          </button>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
