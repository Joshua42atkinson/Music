import React from 'react';
import { motion } from 'framer-motion';

export default function ScenarioReader({ title, content }) {
  return (
    <section className="scenario-section" id="scenario">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="scenario-container"
      >
        <p className="scenario-label">The Scenario</p>
        <h3 className="scenario-title">{title}</h3>

        <div className="scenario-content">
          {content.split('\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
