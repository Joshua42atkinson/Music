import React, { useMemo } from 'react';
import { useScaffolding } from '../ScaffoldingProvider';
import { useLocale } from '../../hooks/useLocale';
import { FRET_METADATA } from '../../data/dag/dagNodes';

// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : VideoLibrary.jsx                                     ║
// ║ WHAT    : Curated video archive indexed by fret/interval      ║
// ║ WHY     : Students need Bertrand's wisdom contextualized to   ║
// ║           their current position in the 12-fret journey       ║
// ║ WHO     : Student — reflective learning via video             ║
// ║ OWNS    : Video catalog, fret-aware filtering, playback       ║
// ║ NEEDS   : ScaffoldingProvider, useLocale, FRET_METADATA       ║
// ║ RULES   : Videos surface by current fret. No autoplay.        ║
// ║           Respect the "Slow Web" — no infinite scroll.        ║
// ║ ROUTE   : Embedded in PlaybookShell tab "Library"             ║
// ║ STAGE   : IMPLEMENT (ADDIECRAPEYE phase 4)                    ║
// ╚═══════════════════════════════════════════════════════════════╝

// ── Video catalog — organized by fret ──
// Each entry links to Bertrand's teaching clips.
// The 'src' field can be:
//   - A YouTube embed URL (https://www.youtube.com/embed/VIDEO_ID)
//   - A local asset path (/assets/videos/...)
//   - '#' = placeholder awaiting upload
const VIDEO_CATALOG = [
  // ── FRET 1: Root Note ──
  {
    fret: 1,
    clips: [
      {
        id: 'f1-breath',
        title: { en: 'The Breath Before the Note', fr: 'Le Souffle Avant la Note' },
        description: { en: 'Bertrand introduces the foundational breathing technique that precedes every practice session.', fr: 'Bertrand présente la technique de respiration fondamentale qui précède chaque séance.' },
        duration: '4:32',
        phase: 'be',
        src: '#',
        thumbnail: '/assets/portal_guitar.png',
      },
      {
        id: 'f1-root-listen',
        title: { en: 'Hearing the Root', fr: 'Entendre la Fondamentale' },
        description: { en: 'How to hear the E in the world around you before touching the guitar.', fr: 'Comment entendre le Mi dans le monde autour de vous avant de toucher la guitare.' },
        duration: '3:15',
        phase: 'do',
        src: '#',
        thumbnail: '/assets/portal_song.png',
      },
      {
        id: 'f1-first-note',
        title: { en: 'Your First Note', fr: 'Votre Première Note' },
        description: { en: 'Playing the open E string — tone, posture, and intention.', fr: 'Jouer la corde de Mi à vide — ton, posture et intention.' },
        duration: '5:40',
        phase: 'play',
        src: '#',
        thumbnail: '/assets/portal_player.png',
      },
    ],
  },
  // ── FRET 2: Minor 2nd ──
  {
    fret: 2,
    clips: [
      {
        id: 'f2-tension',
        title: { en: 'The Sound of Tension', fr: 'Le Son de la Tension' },
        description: { en: 'Understanding the minor 2nd — the most tense interval in music.', fr: 'Comprendre la seconde mineure — l\'intervalle le plus tendu de la musique.' },
        duration: '4:10',
        phase: 'be',
        src: '#',
        thumbnail: '/assets/portal_song.png',
      },
      {
        id: 'f2-hold',
        title: { en: 'Holding Tension Without Fear', fr: 'Tenir la Tension Sans Peur' },
        description: { en: 'Bertrand demonstrates how to sit with dissonance and let it resolve naturally.', fr: 'Bertrand montre comment rester avec la dissonance et la laisser se résoudre naturellement.' },
        duration: '2:15',
        phase: 'do',
        src: '#',
        thumbnail: '/assets/portal_guitar.png',
      },
    ],
  },
  // ── FRET 3: Major 2nd ──
  {
    fret: 3,
    clips: [
      {
        id: 'f3-vertical',
        title: { en: 'Vertical Scales Introduction', fr: 'Introduction aux Gammes Verticales' },
        description: { en: 'The Vertiscale concept — why we play up instead of across.', fr: 'Le concept de Vertiscale — pourquoi on joue vers le haut plutôt qu\'en travers.' },
        duration: '5:40',
        phase: 'do',
        src: '#',
        thumbnail: '/assets/portal_guitar.png',
      },
    ],
  },
  // ── FRET 4: Minor 3rd ──
  {
    fret: 4,
    clips: [
      {
        id: 'f4-left-hand',
        title: { en: 'Left Hand Positioning', fr: 'Positionnement de la Main Gauche' },
        description: { en: 'Thumb placement, wrist angle, and finger independence for the minor 3rd stretch.', fr: 'Placement du pouce, angle du poignet et indépendance des doigts pour l\'écart de tierce mineure.' },
        duration: '3:20',
        phase: 'play',
        src: '#',
        thumbnail: '/assets/portal_player.png',
      },
    ],
  },
  // ── FRET 5-12: Awaiting Bertrand's content ──
  ...Array.from({ length: 8 }, (_, i) => ({
    fret: i + 5,
    clips: [],
  })),
];

// Phase colors aligned with the 3-pillar system
const PHASE_COLORS = {
  be: { bg: 'rgba(90,144,160,0.08)', border: 'rgba(90,144,160,0.25)', text: '#5a90a0', label: { en: 'BE · Imagine', fr: 'ÊTRE · Imaginer' } },
  do: { bg: 'rgba(122,170,136,0.08)', border: 'rgba(122,170,136,0.25)', text: '#7aaa88', label: { en: 'DO · Listen', fr: 'FAIRE · Écouter' } },
  play: { bg: 'rgba(123,106,170,0.08)', border: 'rgba(123,106,170,0.25)', text: '#7b6aaa', label: { en: 'PLAY · Perform', fr: 'JOUER · Performer' } },
};

export default function VideoLibrary() {
  const { traction } = useScaffolding();
  const { locale } = useLocale();
  const lang = locale;

  const currentFret = useMemo(() => {
    const nodeId = traction?.currentNodeId || 'fret-1-class-be';
    const match = nodeId.match(/fret-(\d+)/);
    return match ? parseInt(match[1]) : 1;
  }, [traction]);

  const fretMeta = FRET_METADATA[currentFret] || {};

  // Get clips for current fret + always show fret 1 fundamentals
  const relevantClips = useMemo(() => {
    const currentFretData = VIDEO_CATALOG.find(v => v.fret === currentFret);
    const fret1Data = currentFret !== 1 ? VIDEO_CATALOG.find(v => v.fret === 1) : null;

    const clips = [];
    if (currentFretData?.clips?.length > 0) {
      clips.push({ fret: currentFret, clips: currentFretData.clips });
    }
    if (fret1Data?.clips?.length > 0) {
      clips.push({ fret: 1, clips: fret1Data.clips });
    }
    return clips;
  }, [currentFret]);

  const localize = (val) => {
    if (!val) return '';
    if (typeof val === 'object') return val[lang] || val.en || '';
    return val;
  };

  const totalAvailable = VIDEO_CATALOG.reduce((sum, f) => sum + f.clips.length, 0);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>
          {lang === 'fr' ? 'Les Archives de Bertrand' : "Bertrand's Archives"}
        </h2>
        <p style={styles.subtitle}>
          {lang === 'fr'
            ? `Sagesse pour la Frette ${currentFret} — ${fretMeta.interval || 'Root'}`
            : `Wisdom for Fret ${currentFret} — ${fretMeta.interval || 'Root'}`}
        </p>
      </div>

      {/* Current Fret Clips */}
      {relevantClips.length > 0 ? (
        relevantClips.map(group => (
          <div key={group.fret} style={{ marginBottom: '24px' }}>
            {group.fret !== currentFret && (
              <p style={styles.groupLabel}>
                {lang === 'fr' ? 'Fondamentaux (Frette 1)' : 'Fundamentals (Fret 1)'}
              </p>
            )}
            <div style={styles.clipList}>
              {group.clips.map(clip => {
                const phase = PHASE_COLORS[clip.phase] || PHASE_COLORS.be;
                const isPlaceholder = clip.src === '#';

                return (
                  <div key={clip.id} style={{
                    ...styles.clipCard,
                    borderColor: phase.border,
                    opacity: isPlaceholder ? 0.7 : 1,
                  }}>
                    {/* Thumbnail */}
                    <div style={styles.thumbnailWrap}>
                      <img
                        src={clip.thumbnail || '/assets/portal_guitar.png'}
                        alt={localize(clip.title)}
                        style={styles.thumbnail}
                        draggable={false}
                      />
                      <div style={styles.thumbnailOverlay}>
                        <span style={styles.playIcon}>▶</span>
                      </div>
                      <span style={{
                        ...styles.durationBadge,
                        background: phase.bg,
                        borderColor: phase.border,
                        color: phase.text,
                      }}>
                        {clip.duration}
                      </span>
                    </div>

                    {/* Info */}
                    <div style={styles.clipInfo}>
                      <span style={{
                        ...styles.phaseBadge,
                        color: phase.text,
                        borderColor: phase.border,
                      }}>
                        {localize(phase.label)}
                      </span>
                      <h3 style={styles.clipTitle}>{localize(clip.title)}</h3>
                      <p style={styles.clipDesc}>{localize(clip.description)}</p>

                      {isPlaceholder ? (
                        <span style={styles.comingSoon}>
                          {lang === 'fr' ? '📽️ Bientôt disponible' : '📽️ Coming soon'}
                        </span>
                      ) : (
                        <button style={{
                          ...styles.watchBtn,
                          background: phase.bg,
                          borderColor: phase.border,
                          color: phase.text,
                        }}>
                          {lang === 'fr' ? '▶ Regarder' : '▶ Watch'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      ) : (
        <div style={styles.emptyState}>
          <span style={{ fontSize: '2.5rem', opacity: 0.4 }}>📽️</span>
          <p style={styles.emptyText}>
            {lang === 'fr'
              ? 'Les archives vidéo pour cette frette arrivent bientôt.'
              : 'Video archives for this fret are coming soon.'}
          </p>
        </div>
      )}

      {/* Archive Stats */}
      <div style={styles.archiveStats}>
        <span style={styles.statsText}>
          {totalAvailable} {lang === 'fr' ? 'clips dans les archives' : 'clips in archives'}
          {' · '}
          {lang === 'fr' ? 'Plus ajoutés chaque semaine' : 'More added weekly'}
        </span>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '500px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '20px',
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.4rem',
    fontWeight: 600,
    color: '#f0e6d2',
    margin: '0 0 4px',
  },
  subtitle: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.6rem',
    color: 'rgba(201,169,110,0.5)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    margin: 0,
  },
  groupLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.6rem',
    color: 'rgba(201,169,110,0.4)',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    marginBottom: '10px',
  },
  clipList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  clipCard: {
    borderRadius: '14px',
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.02)',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
  },
  thumbnailWrap: {
    position: 'relative',
    width: '100%',
    aspectRatio: '16 / 9',
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  thumbnailOverlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.3)',
    transition: 'background 0.2s',
  },
  playIcon: {
    fontSize: '2rem',
    color: 'rgba(255,255,255,0.7)',
    textShadow: '0 2px 8px rgba(0,0,0,0.5)',
  },
  durationBadge: {
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    padding: '2px 8px',
    borderRadius: '6px',
    border: '1px solid',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.6rem',
    fontWeight: 600,
  },
  clipInfo: {
    padding: '14px 16px 16px',
  },
  phaseBadge: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.55rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    padding: '2px 6px',
    borderRadius: '4px',
    border: '1px solid',
    display: 'inline-block',
    marginBottom: '8px',
  },
  clipTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#f0e6d2',
    margin: '0 0 6px',
  },
  clipDesc: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.78rem',
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 1.5,
    margin: '0 0 12px',
  },
  comingSoon: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.65rem',
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: '0.06em',
  },
  watchBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  emptyState: {
    padding: '48px 24px',
    textAlign: 'center',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.04)',
  },
  emptyText: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: '0.85rem',
    marginTop: '12px',
    fontFamily: "'Inter', sans-serif",
  },
  archiveStats: {
    textAlign: 'center',
    marginTop: '24px',
    padding: '12px',
  },
  statsText: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.55rem',
    color: 'rgba(255,255,255,0.2)',
    letterSpacing: '0.06em',
  },
};
