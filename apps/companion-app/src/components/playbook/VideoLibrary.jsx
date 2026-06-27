import React, { useMemo, useState } from 'react';
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
  // ── FRET 1: Root Note (Rhythm & Foundation) ──
  {
    fret: 1,
    clips: [
      {
        id: 'f1-eugene-strut',
        title: { en: 'The Eugene Strut (Live)', fr: 'La Démarche d\'Eugene (En Direct)' },
        description: { en: 'A masterclass in foundational rhythm and groove. Watch how Bertrand establishes the root pulse.', fr: 'Une classe de maître sur le rythme fondamental et le groove. Regardez comment Bertrand établit la pulsation.' },
        duration: '4:22',
        phase: 'play',
        src: 'https://www.youtube.com/embed/R3fR8XwjevY',
        thumbnail: '/assets/portal_player.png',
      },
      {
        id: 'f1-no-thanks',
        title: { en: 'No Thanks, I\'ll Walk', fr: 'Non Merci, Je Vais Marcher' },
        description: { en: 'Acoustic Blues performance showing the power of the walking bass line and steady root motion.', fr: 'Performance de blues acoustique montrant la puissance de la ligne de basse marchante.' },
        duration: '3:04',
        phase: 'do',
        src: 'https://www.youtube.com/embed/cvy5U8itTTA',
        thumbnail: '/assets/portal_guitar.png',
      },
    ],
  },
  // ── FRET 2: Minor 2nd (Tension & Movement) ──
  {
    fret: 2,
    clips: [
      {
        id: 'f2-coal-burner',
        title: { en: 'Coal Burner', fr: 'Le Brûleur de Charbon' },
        description: { en: 'Listen to the tension in the driving rhythm and the half-step bends simulating a train whistle.', fr: 'Écoutez la tension dans le rythme entraînant et les bends d\'un demi-ton simulant un sifflet de train.' },
        duration: '3:45',
        phase: 'be',
        src: 'https://www.youtube.com/embed/6h-k1vjD1Jw',
        thumbnail: '/assets/portal_song.png',
      },
    ],
  },
  // ── FRET 3: Major 2nd (Forward Motion) ──
  {
    fret: 3,
    clips: [
      {
        id: 'f3-capacitor',
        title: { en: 'Capacitor Boogie (Live)', fr: 'Capacitor Boogie (En Direct)' },
        description: { en: 'Live at Blackstone River Theater. Notice the relentless forward motion and fingerpicking mastery.', fr: 'En direct au Blackstone River Theater. Remarquez le mouvement constant vers l\'avant et la maîtrise du fingerpicking.' },
        duration: '5:28',
        phase: 'play',
        src: 'https://www.youtube.com/embed/3NAahYlwZJQ',
        thumbnail: '/assets/portal_guitar.png',
      },
      {
        id: 'f3-sky-river',
        title: { en: 'Sky River Grass', fr: 'Sky River Grass' },
        description: { en: 'An exploration of open strings and major intervals, providing a sense of journey and flow.', fr: 'Une exploration des cordes à vide et des intervalles majeurs, donnant un sentiment de voyage.' },
        duration: '2:56',
        phase: 'do',
        src: 'https://www.youtube.com/embed/t6TBgEMf6hY',
        thumbnail: '/assets/portal_player.png',
      },
    ],
  },
  // ── FRET 4: Minor 3rd (The Blues) ──
  {
    fret: 4,
    clips: [
      {
        id: 'f4-pays-du-blues',
        title: { en: 'Au Pays du Blues (Live)', fr: 'Au Pays du Blues (En Direct)' },
        description: { en: 'Live at the Narrows. A definitive demonstration of acoustic blues phrasing and the minor 3rd.', fr: 'En direct au Narrows. Une démonstration définitive du phrasé blues acoustique et de la tierce mineure.' },
        duration: '5:13',
        phase: 'play',
        src: 'https://www.youtube.com/embed/w_FA7gZnqRo',
        thumbnail: '/assets/portal_song.png',
      },
      {
        id: 'f4-tous-les-jours',
        title: { en: 'Tous les jours, J\'ai des Bleus', fr: 'Tous les jours, J\'ai des Bleus' },
        description: { en: 'Everyday I have the blues. Watch Bertrand channel deep emotion through the fretboard.', fr: 'Chaque jour j\'ai le blues. Regardez Bertrand canaliser une émotion profonde à travers le manche.' },
        duration: '4:15',
        phase: 'be',
        src: 'https://www.youtube.com/embed/KL2NUJgYh8o',
        thumbnail: '/assets/portal_player.png',
      },
    ],
  },
  // ── FRET 5-12: Awaiting remaining contextual mapping ──
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
  const { locale, t } = useLocale();
  const lang = locale;
  const [activeVideo, setActiveVideo] = useState(null);

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
    <div className="p-5 max-w-[500px] mx-auto">
      {/* Header */}
      <div className="mb-5">
        <h2 className="font-heading text-[1.4rem] font-semibold text-[#f0e6d2] mb-1">
          {t('bertrandsArchives')}
        </h2>
        <p className="font-mono text-[0.6rem] text-[rgba(var(--cf-gold-rgb),0.5)] tracking-[0.1em] uppercase m-0">
          {lang === 'fr'
            ? `Sagesse pour la Frette ${currentFret} — ${fretMeta.interval || 'Root'}`
            : `Wisdom for Fret ${currentFret} — ${fretMeta.interval || 'Root'}`}
        </p>
      </div>

      {/* Current Fret Clips */}
      {relevantClips.length > 0 ? (
        relevantClips.map(group => (
          <div key={group.fret} className="mb-6">
            {group.fret !== currentFret && (
              <p className="font-mono text-[0.6rem] text-[rgba(var(--cf-gold-rgb),0.4)] tracking-[0.12em] uppercase mb-2.5">
                {t('fundamentalsFret1')}
              </p>
            )}
            <div className="flex flex-col gap-3">
              {group.clips.map(clip => {
                const phase = PHASE_COLORS[clip.phase] || PHASE_COLORS.be;
                const isPlaceholder = clip.src === '#';

                return (
                  <div
                    key={clip.id}
                    className="rounded-[14px] border border-white/[0.08] bg-white/[0.02] overflow-hidden transition-all duration-200 ease-out"
                    style={{ borderColor: phase.border, opacity: isPlaceholder ? 0.7 : 1 }}
                  >
                    {/* Thumbnail or Video Player */}
                    <div className="relative w-full aspect-video overflow-hidden">
                      {activeVideo === clip.id ? (
                        <iframe
                          className="w-full h-full object-cover block"
                          src={`${clip.src}?autoplay=1`}
                          title={localize(clip.title)}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      ) : (
                        <>
                          <img
                            src={clip.thumbnail || '/assets/portal_guitar.png'}
                            alt={localize(clip.title)}
                            className="w-full h-full object-cover block"
                            draggable={false}
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors duration-200">
                            <span className="text-[2rem] text-white/70 drop-shadow-md">▶</span>
                          </div>
                          <span
                            className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md border font-mono text-[0.6rem] font-semibold"
                            style={{ background: phase.bg, borderColor: phase.border, color: phase.text }}
                          >
                            {clip.duration}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Info */}
                    <div className="px-4 pt-3.5 pb-4">
                      <span
                        className="font-mono text-[0.55rem] tracking-[0.1em] uppercase px-1.5 py-0.5 rounded border inline-block mb-2"
                        style={{ color: phase.text, borderColor: phase.border }}
                      >
                        {localize(phase.label)}
                      </span>
                      <h3 className="font-heading text-[1.1rem] font-semibold text-[#f0e6d2] mb-1.5">{localize(clip.title)}</h3>
                      <p className="font-body text-[0.78rem] text-white/50 leading-normal mb-3">{localize(clip.description)}</p>

                      {isPlaceholder ? (
                        <span className="font-mono text-[0.65rem] text-white/30 tracking-[0.06em]">
                          {t('comingSoon_')}
                        </span>
                      ) : (
                        <button
                          onClick={() => setActiveVideo(activeVideo === clip.id ? null : clip.id)}
                          className="px-4 py-2 rounded-lg border font-mono text-[0.75rem] cursor-pointer transition-all duration-200"
                          style={{ background: phase.bg, borderColor: phase.border, color: phase.text }}
                        >
                          {activeVideo === clip.id
                            ? (t('close'))
                            : (t('watch'))}
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
        <div className="py-12 px-6 text-center bg-white/[0.02] rounded-2xl border border-white/[0.04]">
          <span className="text-[2.5rem] opacity-40">📽️</span>
          <p className="text-white/35 text-[0.85rem] mt-3 font-body">
            {t('videoArchivesForThis')}
          </p>
        </div>
      )}

      {/* Archive Stats */}
      <div className="text-center mt-6 p-3">
        <span className="font-mono text-[0.55rem] text-white/20 tracking-[0.06em]">
          {totalAvailable} {t('clipsInArchives')}
          {' · '}
          {t('moreAddedWeekly')}
        </span>
      </div>
    </div>
  );
}

