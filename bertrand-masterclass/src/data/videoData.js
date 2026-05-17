// ═══════════════════════════════════════════════════════════
// VIDEO DATA — Bertrand Masterclass
// Replaces legacy Conscious Framework imports
// ═══════════════════════════════════════════════════════════

const videoModules = [
  {
    id: 'muscle-memory',
    title: 'The Philosophy of Muscle Memory',
    description: 'Bertrand explains why 10,000 hours of mindless practice creates mastery of mistakes, and how myelination builds lightning-fast neural highways only when you practice TOO SLOW.',
    videoUrl: null, // To be populated with actual Bertrand video URL
    duration: null,
    chapter: 1
  },
  {
    id: 'body-scan',
    title: 'The Pre-Flight Body Scan',
    description: 'A guided somatic check-in ritual. Before tuning the wooden instrument, tune the biological one.',
    videoUrl: null,
    duration: null,
    chapter: 1
  },
  {
    id: 'fretboard-organization',
    title: 'The Architecture of Sound',
    description: 'How music shows up on the guitar — the CAGED system, Vertiscales, and visual mapping of the fretboard continent.',
    videoUrl: null,
    duration: null,
    chapter: 6
  }
];

export function getVideoById(id) {
  return videoModules.find(v => v.id === id) || null;
}

export function getVideosByChapter(chapterId) {
  return videoModules.filter(v => v.chapter === chapterId);
}

export default videoModules;
