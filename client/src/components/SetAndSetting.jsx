import React from 'react';
import { motion } from 'framer-motion';

export default function SetAndSetting({ description, imagePath, stageTitle }) {
  return (
    <section className="set-and-setting-section" id="set-and-setting">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="set-and-setting-container"
      >
        {/* Scene Image */}
        <div className="set-image-wrapper">
          <img
            src={imagePath}
            alt={`Set and Setting: ${stageTitle}`}
            className="set-image"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling?.classList.add('no-image');
            }}
          />
          {/* Fallback gradient when no image */}
          <div className="set-image-fallback" />
        </div>

        {/* Description overlay */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="set-description-overlay"
        >
          <p className="set-label">Set & Setting</p>
          <p className="set-description">{description}</p>
        </motion.div>

        {/* Video placeholder slot */}
        <div className="video-slot" style={{ display: 'none' }}>
          {/* Reserved for future video embed */}
        </div>
      </motion.div>
    </section>
  );
}
