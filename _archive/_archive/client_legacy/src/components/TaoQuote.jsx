import React from 'react';
import { motion } from 'framer-motion';

export default function TaoQuote({ chapter, quote, source }) {
  return (
    <section className="tao-quote-section" id="tao-quote">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="tao-quote-container"
      >
        {/* Chapter label */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="tao-chapter-label"
        >
          Chapter {chapter}
        </motion.p>

        {/* Golden glow ring */}
        <motion.div
          className="tao-glow-ring"
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Quote text */}
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="tao-quote-text"
        >
          {quote.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              {i < quote.split('\n').length - 1 && <br />}
            </span>
          ))}
        </motion.blockquote>

        {/* Source */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="tao-source"
        >
          — {source}
        </motion.p>
      </motion.div>
    </section>
  );
}
