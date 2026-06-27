import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PORTALS = [
  {
    id: 'c-scale',
    name: { en: 'The C-Scale Journey', fr: 'Le Voyage en Gamme de Do' },
    subtitle: { en: '12 Chapters · Begin Here', fr: '12 Chapitres · Commencer ici' },
    path: '/c-scale',
    color: 'var(--cf-gold)',
    image: '/assets/portal_song.png',
    description: { en: 'The foundation of all Western music. 12 chapters, BE → DO → PLAY.', fr: 'Le fondement de toute la musique occidentale. 12 chapitres, BE → DO → PLAY.' },
  },
  {
    id: 'player',
    name: { en: 'The Player', fr: 'Le Joueur' },
    subtitle: { en: 'Bertrand\'s Library', fr: 'La Bibliothèque de Bertrand' },
    path: '/player',
    color: '#3498db',
    image: '/assets/portal_player.png',
    description: { en: 'Master classes, music history, and the chromatic scale philosophy course.', fr: 'Master classes, histoire de la musique et le cours de philosophie de la gamme chromatique.' },
  },
  {
    id: 'binder',
    name: { en: 'The Binder', fr: 'Le Classeur' },
    subtitle: { en: 'Your Progress', fr: 'Votre Progrès' },
    path: '/binder',
    color: '#9b59b6',
    image: '/assets/portal_playbook.png',
    description: { en: 'Your character sheet, XP, quest log, interval badges, and practice journal.', fr: 'Votre fiche de personnage, XP, journal de quêtes, badges d\'intervalles et journal de pratique.' },
  },
  {
    id: 'riff',
    name: { en: 'The Riff', fr: 'Le Riff' },
    subtitle: { en: 'Create & Explore', fr: 'Créer & Explorer' },
    path: '/riff',
    color: '#e74c3c',
    image: '/assets/portal_guitar.png',
    description: { en: 'Songwriting studio, theory games, and creative practice tools.', fr: 'Studio d\'écriture, jeux de théorie et outils de pratique créative.' },
  },
];

export default function PortalGrid({ localize }) {
  const navigate = useNavigate();

  return (
    <div className="portals-grid">
      {PORTALS.map((portal, idx) => (
        <motion.div
          key={portal.id}
          className="portal-card"
          style={{ '--portal-color': portal.color }}
          onClick={() => navigate(portal.path)}
          onKeyDown={(e) => e.key === 'Enter' && navigate(portal.path)}
          tabIndex={0}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + idx * 0.12, duration: 0.6, ease: 'easeOut' }}
        >
          <img
            src={portal.image}
            alt={localize(portal.name)}
            className="portal-art"
            draggable={false}
          />
          <div className="portal-info">
            <div className="portal-text">
              <span className="portal-tag">{localize(portal.subtitle)}</span>
              <span className="portal-name">{localize(portal.name)}</span>
              <span className="portal-desc">{localize(portal.description)}</span>
            </div>
            <span className="portal-arrow">›</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
