// ═══════════════════════════════════════════════════════════
// THE TIMELESS SONG — Historical Slide Content
// Three slides per fret. Each one a window into the same
// eternal truth: the song was always already playing.
// You are not learning music. You are remembering it.
//
// Slide structure:
// {
//   id:        string  — unique slide id
//   type:      'timeless-song'
//   label:     string  — small top label
//   title:     string  — main heading
//   body:      string  — POV body text (first person, present tense)
//   subtext:   string  — historical context line
//   quote:     string  — attributed quote
//   author:    string  — quote attribution
//   ratio:     string  — Pythagorean ratio for this fret
//   image:     string  — path to generated artwork
//   accent:    string  — fret color
// }
// ═══════════════════════════════════════════════════════════

export const TIMELESS_SONG_SLIDES = {

  // ════════════════════════════════════════════
  // FRET 1 — The Root Note · Unison · 1:1
  // ════════════════════════════════════════════
  1: [
    {
      id: '1-timeless-0',
      type: 'timeless-song',
      label: '∞ THE TIMELESS SONG · I',
      title: 'The Philosopher in the Forge',
      body: `I am walking through a city in ancient Greece when I hear it — a sound from a blacksmith's forge that stops me mid-step. One hammer rings high and clear. Another rings low and warm. And something in me knows, before my mind can name it: these two sounds belong together.\n\nPythagoras walked into that forge and didn't hear noise. He heard a ratio. He heard 1:1 — the universe talking to itself. He had to measure the hammers to prove what his body already felt.`,
      subtext: 'Samos, Greece · c. 570 BCE · The birth of acoustic physics',
      quote: 'There is geometry in the humming of the strings. There is music in the spacing of the spheres.',
      author: 'Pythagoras',
      ratio: '1:1 — Unison',
      image: '/assets/slides/ch1/timeless/pythagoras.png',
      accent: '#ff6b6b',
    },
    {
      id: '1-timeless-1',
      type: 'timeless-song',
      label: '∞ THE TIMELESS SONG · II',
      title: 'Before the First Note',
      body: `In 12th-century Occitania — the south of France — a poet-musician called a troubadour would sit before his lute and do something radical: nothing. He would hold the silence. He believed the song was already present in the air, and that his first job was not to play it, but to listen for it.\n\nThe troubadours called their art the "living voice" — *voix vive*. Not music written on a page. Music breathed from a living body. They were the first to say: the voice comes before the note. The self comes before the song.`,
      subtext: 'Occitania, France · c. 1100–1300 CE · The troubadour tradition',
      quote: 'To sing is to pray twice.',
      author: 'Saint Augustine of Hippo',
      ratio: '1:1 — The unplayed note is also music',
      image: '/assets/slides/ch1/timeless/troubadour.png',
      accent: '#ff6b6b',
    },
    {
      id: '1-timeless-2',
      type: 'timeless-song',
      label: '∞ THE TIMELESS SONG · III',
      title: 'I Am the Root',
      body: `The root note is not a note on the guitar. It is a position in space. It is the place I stand from which all other notes pull or push — toward me, away from me, in tension or in rest.\n\nI am the root. Not because I declare it, but because I am the one listening. Every song I will ever play has me at its center. The 1:1 ratio — the unison — is not two strings vibrating together. It is me recognizing myself in the sound.\n\nThis is *Voix Vive*: the living voice. It was always mine.`,
      subtext: 'The Timeless Song · The Self as Tonic · The Living Voice',
      quote: 'You are an instrument playing an instrument. If I am playing the guitar — who is playing me?',
      author: 'Bertrand Laurence',
      ratio: '1:1 — I am the reference point',
      image: '/assets/slides/ch1/timeless/self.png',
      accent: '#ff6b6b',
    },
  ],

  // ════════════════════════════════════════════
  // FRET 2 — The Refusal · Minor 2nd · 16:15
  // ════════════════════════════════════════════
  2: [
    {
      id: '2-timeless-0',
      type: 'timeless-song',
      label: '∞ THE TIMELESS SONG · I',
      title: 'The Rule of Silence',
      body: `In the school of Pythagoras, newcomers were not allowed to speak. For five years. The practice was called *echemythia* — the discipline of closed lips. You could listen. You could observe. But you could not voice a single question or opinion until you had learned to hear without the interference of your own noise.\n\nThis was not punishment. It was the first lesson: your mind's chatter is louder than any instrument. Until you can sit in silence without flinching, you cannot hear the ratios that hold the universe together. The 16:15 ratio — the Minor 2nd — is the smallest step. It begins with not speaking.`,
      subtext: 'Crotone, Southern Italy · c. 530 BCE · The Pythagorean Brotherhood',
      quote: 'The first step toward wisdom is silence. The second is listening.',
      author: 'Attributed to Pythagoras, via Iamblichus',
      ratio: '16:15 — Minor 2nd',
      image: '/assets/slides/ch2/timeless/silence.png',
      accent: '#ff8e53',
      references: [
        { title: 'Life of Pythagoras', author: 'Iamblichus', date: 'c. 300 CE', context: 'Primary source on the echemythia practice and the five-year rule of silence.' },
        { title: 'The School of Athens', author: 'Raphael (Raffaello Sanzio)', date: '1509–1511', context: 'Fresco in the Vatican depicting Pythagoras writing while a student holds a harmonic ratio tablet.' }
      ]
    },
    {
      id: '2-timeless-1',
      type: 'timeless-song',
      label: '∞ THE TIMELESS SONG · II',
      title: 'The Stove-Heated Room',
      body: `On November 10, 1619, René Descartes — a young French soldier wintering in Neuburg, Germany — locked himself in a small room heated by a ceramic stove. He sat alone for an entire day. No books, no conversation, no distraction. Just himself and his own mind.\n\nBy nightfall, he had arrived at the foundation of modern philosophy: *Cogito, ergo sum* — "I think, therefore I am." The one thing he could not doubt was the existence of the doubter. Descartes did not discover this by reading or arguing. He discovered it by sitting still and observing his own awareness — exactly what Pythagoras had demanded of his students two thousand years earlier.`,
      subtext: 'Neuburg an der Donau, Germany · November 10, 1619 · The birth of modern self-reflection',
      quote: 'It is not enough to have a good mind; the main thing is to use it well.',
      author: 'René Descartes, Discourse on the Method (1637)',
      ratio: '16:15 — The smallest interval reveals the largest truth',
      image: '/assets/slides/ch2/timeless/descartes.png',
      accent: '#ff8e53',
      references: [
        { title: 'Discourse on the Method', author: 'René Descartes', date: '1637', context: 'Describes the stove-heated room and the method of radical doubt.' },
        { title: 'Meditations on First Philosophy', author: 'René Descartes', date: '1641', context: 'Contains the full cogito argument and the method of self-observation.' }
      ]
    },
    {
      id: '2-timeless-2',
      type: 'timeless-song',
      label: '∞ THE TIMELESS SONG · III',
      title: 'The Observer',
      body: `There is a version of me that watches me play. It hovers just above my shoulder, noticing everything — the tension in my jaw, the shallow breath, the way my left thumb grips the neck like a fist instead of resting like a thumb.\n\nThis observer is not the critic. The critic judges. The observer simply sees. The Minor 2nd — one fret, one semitone, the smallest distance possible — is the space between "playing" and "watching myself play." When I learn to occupy both positions at once, I am no longer fighting the instrument. I am tuning myself.\n\nDescartes found the observer in a heated room. Pythagoras found it in five years of silence. You can find it right now, in the space of one fret.`,
      subtext: 'The Timeless Song · The Observer · The Smallest Step Inward',
      quote: 'You are an instrument playing an instrument. If I am playing the guitar — who is playing me?',
      author: 'Bertrand Laurence',
      ratio: '16:15 — One fret. One semitone. One step inward.',
      image: '/assets/slides/ch2/timeless/observer.png',
      accent: '#ff8e53',
      references: [
        { title: 'Utriusque Cosmi Historia', author: 'Robert Fludd', date: '1617', context: 'Rosicrucian text depicting the divine monochord — God as the cosmic tuner, the human as the string.' },
        { title: 'Inner Game of Music', author: 'Barry Green & W. Timothy Gallwey', date: '1986', context: 'Modern application of the observer principle to musical performance.' }
      ]
    },
  ],

  // ════════════════════════════════════════════
  // FRET 3 — The Mentor · Major 2nd · 9:8
  // ════════════════════════════════════════════
  3: [
    {
      id: '3-timeless-0',
      type: 'timeless-song',
      label: '∞ THE TIMELESS SONG · I',
      title: 'The Consolation of Music',
      body: `In 523 CE, the Roman philosopher Boethius sat in a prison cell in Pavia, Italy, awaiting execution. He had served as consul to the Ostrogothic king Theodoric — and had been betrayed. He had lost everything: position, family, freedom.\n\nIn that cell, he wrote *The Consolation of Philosophy* — and its most enduring argument was about music. Boethius divided all music into three kinds: *musica mundana* (the music of the cosmos), *musica humana* (the harmony of body and soul), and *musica instrumentalis* (the sounds we actually play). The third kind — the one you hear with your ears — was the least important. The real music, he said, is the one holding you together right now.`,
      subtext: 'Pavia, Italy · 523 CE · The last philosopher of Rome',
      quote: 'Music is so naturally united with us that we cannot be free from it even if we so desired.',
      author: 'Boethius, De Institutione Musica (c. 505 CE)',
      ratio: '9:8 — Major 2nd',
      image: '/assets/slides/ch3/timeless/boethius.png',
      accent: '#feca57',
      references: [
        { title: 'De Institutione Musica', author: 'Boethius', date: 'c. 505 CE', context: 'Foundational music theory text defining the three categories of music. Transmitted Pythagorean tuning to the medieval West.' },
        { title: 'The Consolation of Philosophy', author: 'Boethius', date: '523 CE', context: 'Written in prison. Argues that philosophy (and music) is the true medicine of the soul.' }
      ]
    },
    {
      id: '3-timeless-1',
      type: 'timeless-song',
      label: '∞ THE TIMELESS SONG · II',
      title: 'The Monks Who Saved Music',
      body: `After Rome fell, Boethius's book nearly vanished. What saved it — and with it, the entire Pythagorean theory of harmony — were Carolingian monks in French monasteries.\n\nIn the 9th century, under Charlemagne's patronage, monks in scriptoria across France began systematically copying every ancient text they could find. They copied Boethius's *De Institutione Musica* by hand, preserving the ratios, the monochord diagrams, the three-fold division of music. They also invented something new: *neumes* — the first written music notation in Western history, scratched above Latin hymn texts to remind singers where the melody went.\n\nWithout these French monks, the Pythagorean tradition would have died. The living voice needed a written memory.`,
      subtext: 'France · 9th Century CE · The Carolingian Renaissance',
      quote: 'To write is to make a time capsule for the voice.',
      author: 'Attributed to Alcuin of York, advisor to Charlemagne',
      ratio: '9:8 — A whole step forward from silence',
      image: '/assets/slides/ch3/timeless/scriptorium.png',
      accent: '#feca57',
      references: [
        { title: 'Chansonnier du Roi', author: 'Anonymous', date: 'c. 1270', context: 'BnF ms. fr. 844 — one of the oldest surviving songbooks, preserved in the Bibliothèque nationale de France.' },
        { title: 'Atalanta Fugiens', author: 'Michael Maier', date: '1617', context: 'Rosicrucian emblem book containing 50 musical fugues paired with alchemical illustrations — music as transformation.' }
      ]
    },
    {
      id: '3-timeless-2',
      type: 'timeless-song',
      label: '∞ THE TIMELESS SONG · III',
      title: 'The Inner Critic Is Not the Mentor',
      body: `There is a voice in my head that tells me I played that wrong. It speaks before the note has even finished ringing. It is fast, certain, and relentless.\n\nThis voice is not the mentor. The mentor is the one who says: "Play it again, and this time, listen to what happened instead of what you expected." The critic anticipates failure. The mentor witnesses the process.\n\nThe Major 2nd — two frets, a whole step — is the first time I leave the safety of the root and land somewhere unfamiliar. The critic screams. The mentor waits. The Timeless Song asks: which one will I follow?\n\nBoethius, in his prison cell, chose the mentor. He could have raged. Instead, he wrote music theory.`,
      subtext: 'The Timeless Song · The Mentor vs. The Critic · A Whole Step Into Trust',
      quote: 'It is not the critic who counts; not the man who points out how the strong man stumbles.',
      author: 'Theodore Roosevelt, "Citizenship in a Republic" (1910)',
      ratio: '9:8 — The whole step requires trust',
      image: '/assets/slides/ch3/timeless/critic.png',
      accent: '#feca57',
      references: [
        { title: 'Effortless Mastery', author: 'Kenny Werner', date: '1996', context: 'Jazz pianist on silencing the inner critic through surrender — the musical application of Boethius\'s philosophy.' }
      ]
    },
  ],

  // ════════════════════════════════════════════
  // FRET 4 — The Threshold · Minor 3rd · 6:5
  // ════════════════════════════════════════════
  4: [
    {
      id: '4-timeless-0',
      type: 'timeless-song',
      label: '∞ THE TIMELESS SONG · I',
      title: 'The Hand That Taught Europe to Sing',
      body: `Around 1025 CE, an Italian Benedictine monk named Guido d'Arezzo solved a problem that had haunted music for centuries: how do you teach someone a melody they have never heard?\n\nHis answer was the *Guidonian Hand* — a method where each joint of the left hand corresponded to a specific pitch. A choirmaster could point to his own palm and the monks would sing the correct note. He also invented solfège — *ut, re, mi, fa, sol, la* — by taking the first syllables of each line of a Latin hymn to Saint John: "Ut queant laxis / Resonare fibris / Mira gestorum / Famuli tuorum..."\n\nFor the first time, music could be learned without hearing it first. The body became the textbook.`,
      subtext: 'Arezzo, Italy · c. 1025 CE · The birth of solfège',
      quote: 'Of all the things that can be sung, no melody is learned more easily than that which is sung by rule.',
      author: 'Guido d\'Arezzo, Micrologus (c. 1026 CE)',
      ratio: '6:5 — Minor 3rd',
      image: '/assets/slides/ch4/timeless/guido.png',
      accent: '#48dbfb',
      references: [
        { title: 'Micrologus', author: 'Guido d\'Arezzo', date: 'c. 1026 CE', context: 'The foundational medieval music pedagogy text. Introduced solmization and the staff system.' },
        { title: 'Epistola de ignoto cantu', author: 'Guido d\'Arezzo', date: 'c. 1028 CE', context: 'Letter describing the Guidonian Hand method and the Hymn to St. John source of solfège syllables.' }
      ]
    },
    {
      id: '4-timeless-1',
      type: 'timeless-song',
      label: '∞ THE TIMELESS SONG · II',
      title: 'The Voice That Crossed the Alps',
      body: `Guido's system did not stay in Italy. French cathedral schools adopted it within a generation. By the 12th century, Notre-Dame de Paris was training choirboys using the Guidonian Hand — and those choirboys grew up to become the first polyphonic composers in history.\n\nThe *École de Notre-Dame* — Léonin and Pérotin — stacked voices on top of each other for the first time, creating harmony where there had only been melody. They could do this because Guido had given them a reliable way to teach pitch. Without the hand, there would be no harmony. Without solfège, there would be no chord.\n\nThe Minor 3rd — the sound of melancholy, of depth — was born in these stone cathedrals, carried by the living voices of French choirboys who learned to sing by pointing at their own hands.`,
      subtext: 'Paris, France · 12th Century · The birth of polyphony at Notre-Dame',
      quote: 'Harmony is not the absence of tension. It is the architecture of tension.',
      author: 'Pérotin (attrib.), via 13th-century treatise tradition',
      ratio: '6:5 — The interval that introduced emotion to music',
      image: '/assets/slides/ch4/timeless/solfege.png',
      accent: '#48dbfb',
      references: [
        { title: 'De Musica cum Tonario', author: 'Anonymous (Notre-Dame school)', date: 'c. 1200 CE', context: 'Treatise describing the polyphonic practices of the Notre-Dame school.' }
      ]
    },
    {
      id: '4-timeless-2',
      type: 'timeless-song',
      label: '∞ THE TIMELESS SONG · III',
      title: 'The Body Knows First',
      body: `Guido's genius was not the syllables. It was the hand.\n\nHe understood that the body learns faster than the mind. When a monk pointed to the base of his index finger and a student sang "re," the student was not reading — they were feeling. The pitch lived in a place on the body. It had a location, a texture, a physical home.\n\nThis is what Bertrand teaches: sing the note before you find it on the fretboard. Your voice knows the pitch before your fingers do. The Minor 3rd — three frets of melancholy — lives in your throat before it lives on the guitar. Guido knew this a thousand years ago.\n\nThe body is the first instrument. The hand is the first fretboard.`,
      subtext: 'The Timeless Song · The Body as Instrument · Somatic Knowledge',
      quote: 'When the student is ready, the teacher appears.',
      author: 'Lao Tzu',
      ratio: '6:5 — The body crosses the threshold before the mind',
      image: '/assets/slides/ch4/timeless/body.png',
      accent: '#48dbfb',
      references: [
        { title: 'De Vita Libri Tres', author: 'Marsilio Ficino', date: '1489', context: 'Renaissance text connecting musical intervals to bodily states — the philosophical descendant of Guido\'s somatic approach.' }
      ]
    },
  ],

  // ════════════════════════════════════════════
  // FRET 5 — The Tests · Major 3rd · 5:4
  // ════════════════════════════════════════════
  5: [
    {
      id: '5-timeless-0',
      type: 'timeless-song',
      label: '∞ THE TIMELESS SONG · I',
      title: 'The Planets Sing',
      body: `In 1619, Johannes Kepler published *Harmonices Mundi* — "The Harmony of the World." In it, he made an extraordinary claim: the planets, as they orbit the sun at varying speeds, produce intervals that correspond to the Pythagorean ratios.\n\nSaturn, the slowest, hums a low drone. Jupiter sings a major third above it. Mars, with its eccentric orbit, sweeps through a perfect fifth. Earth oscillates between mi and fa — a semitone — which Kepler interpreted as the Earth singing "misery" (*miseria*) and "famine" (*fames*).\n\nKepler was not being poetic. He was a mathematician. He derived his Third Law of Planetary Motion from this musical investigation. The math that describes how planets orbit is the same math that describes why a major chord sounds bright.`,
      subtext: 'Linz, Austria · 1619 · Harmonices Mundi, Book V',
      quote: 'The heavenly motions are nothing but a continuous song for several voices, perceived not by the ear but by the intellect.',
      author: 'Johannes Kepler, Harmonices Mundi (1619)',
      ratio: '5:4 — Major 3rd',
      image: '/assets/slides/ch5/timeless/kepler.png',
      accent: '#0abde3',
      references: [
        { title: 'Harmonices Mundi', author: 'Johannes Kepler', date: '1619', context: 'Book V contains the planetary music theory and the derivation of the Third Law.' },
        { title: 'The School of Athens', author: 'Raphael', date: '1509–1511', context: 'Shows Pythagoras at bottom left with a harmonic ratio diagram — the ancestor of Kepler\'s cosmic music.' }
      ]
    },
    {
      id: '5-timeless-1',
      type: 'timeless-song',
      label: '∞ THE TIMELESS SONG · II',
      title: 'The Friar Who Measured Everything',
      body: `Seventeen years after Kepler, a French Minim friar named Marin Mersenne sat in his Paris cell surrounded by every instrument he could find — lutes, viols, trumpets, organs — and measured them all.\n\nMersenne's *Harmonie Universelle* (1636) was the first comprehensive study of acoustics. He was the first person to accurately measure the speed of sound. He mapped the overtone series. He proved that a vibrating string produces not just its fundamental pitch but a cascade of higher frequencies — the overtones — in exact mathematical ratios.\n\nMersenne was also the postal hub of European science: he corresponded with Descartes, Galileo, Pascal, and Fermat. The Pythagorean thread ran through his cell in Paris like a wire connecting ancient Greece to the Scientific Revolution.`,
      subtext: 'Paris, France · 1636 · Harmonie Universelle',
      quote: 'The string contains within itself all the harmony it will ever produce.',
      author: 'Marin Mersenne, Harmonie Universelle (1636)',
      ratio: '5:4 — The Major 3rd is the 5th overtone — it was always in the string',
      image: '/assets/slides/ch5/timeless/mersenne.png',
      accent: '#0abde3',
      references: [
        { title: 'Harmonie Universelle', author: 'Marin Mersenne', date: '1636', context: 'First systematic treatise on acoustics. Measured string vibrations, sound speed, and the overtone series.' }
      ]
    },
    {
      id: '5-timeless-2',
      type: 'timeless-song',
      label: '∞ THE TIMELESS SONG · III',
      title: 'The Cosmos Is Already Singing',
      body: `Kepler heard it in the orbits. Mersenne found it in the string. Pythagoras heard it in the forge. They were all describing the same thing: the universe is structured by ratios, and those ratios are audible.\n\nThe Major 3rd — 5:4 — is the interval of warmth, of brightness, of resolution. It is the sound of a major chord. It is the sound of sunlight. And it is not an invention. It is a discovery. The ratio 5:4 exists whether or not anyone plays it. It existed before there were guitars, before there were humans, before there was an Earth.\n\nWhen you play a major chord and feel that warmth, you are not creating beauty. You are resonating with a pattern that predates you by fourteen billion years.`,
      subtext: 'The Timeless Song · The Cosmos Sings · You Are Resonating',
      quote: 'Music is the arithmetic of sounds as optics is the geometry of light.',
      author: 'Claude Debussy',
      ratio: '5:4 — The warmth was always there',
      image: '/assets/slides/ch5/timeless/cosmos.png',
      accent: '#0abde3',
      references: [
        { title: 'Utriusque Cosmi Historia', author: 'Robert Fludd', date: '1617', context: 'Rosicrucian cosmology depicting God tuning a divine monochord that spans the entire universe — each planetary sphere a note.' }
      ]
    },
  ],

  // ════════════════════════════════════════════
  // FRET 6 — The Approach · Perfect 4th · 4:3
  // ════════════════════════════════════════════
  6: [
    {
      id: '6-timeless-0',
      type: 'timeless-song',
      label: '∞ THE TIMELESS SONG · I',
      title: 'The Luthier\'s Secret',
      body: `In 16th-century France, luthiers — the craftsmen who built lutes and early guitars — tuned their instruments in fourths: 4:3, 4:3, 4:3. This was not arbitrary. It was Pythagorean.\n\nThe Perfect Fourth is the most stable interval after the octave and the fifth. When you tune a guitar string to the one below it by matching the fifth fret, you are performing an act that connects you directly to the workshop of a French luthier 500 years ago, who was performing the same act using the same ratio that Pythagoras measured on his monochord 2,000 years before that.\n\nThe guitar is a quartal instrument. It is built on fourths. And every time you tune it, you are participating in an unbroken chain of acoustic tradition that spans three millennia.`,
      subtext: 'France · 16th Century · The luthier tradition and quartal tuning',
      quote: 'Simplicity is the ultimate sophistication.',
      author: 'Leonardo da Vinci',
      ratio: '4:3 — Perfect 4th',
      image: '/assets/slides/ch6/timeless/instrument.png',
      accent: '#5f27cd',
      references: [
        { title: 'Harmonie Universelle', author: 'Marin Mersenne', date: '1636', context: 'Contains detailed measurements and tuning instructions for lutes and early guitars, confirming the quartal tuning tradition.' }
      ]
    },
    {
      id: '6-timeless-1',
      type: 'timeless-song',
      label: '∞ THE TIMELESS SONG · II',
      title: 'The First Complete Voice',
      body: `Around 1360, Guillaume de Machaut — a French poet, diplomat, and composer — created the *Messe de Nostre Dame* in Reims Cathedral. It was the first known complete polyphonic setting of the Ordinary of the Mass by a single composer.\n\nFour voices — superius, contratenor, tenor, bassus — woven together in a structure so intricate that modern scholars still debate its mathematical architecture. Machaut used the Perfect Fourth extensively as a structural pillar, stacking voices at intervals that Pythagoras would have recognized instantly.\n\nMachaut was not just a musician. He was a poet of courtly love, a survivor of the Black Plague, a canon of Reims Cathedral. He composed until his death at approximately 77 — in an era when life expectancy was 35. Music kept him alive.`,
      subtext: 'Reims, France · c. 1360 · Messe de Nostre Dame',
      quote: 'He who would learn to pray, let him go to sea. He who would learn to sing, let him go to the cathedral.',
      author: 'Medieval French proverb',
      ratio: '4:3 — The foundation on which voices are stacked',
      image: '/assets/slides/ch6/timeless/machaut.png',
      accent: '#5f27cd',
      references: [
        { title: 'Messe de Nostre Dame', author: 'Guillaume de Machaut', date: 'c. 1360', context: 'First complete polyphonic mass by a single composer. Manuscript preserved at the Bibliothèque nationale de France.' }
      ]
    },
    {
      id: '6-timeless-2',
      type: 'timeless-song',
      label: '∞ THE TIMELESS SONG · III',
      title: 'The Instrument Is the Lesson',
      body: `The guitar is tuned in fourths. This is not a design choice — it is a lesson built into the instrument's body.\n\nEvery time you move from one string to the next, you cross a Perfect Fourth. The fretboard is a grid of fourths. The shapes you learn — the chord voicings, the scale patterns, the arpeggios — are all consequences of this one tuning decision made centuries ago by French luthiers who inherited Pythagorean ratios from Boethius who inherited them from the Brotherhood.\n\nYou do not need to memorize this history. You are playing it. Every time your hand moves vertically across the strings, the 4:3 ratio moves through your fingers. The instrument is not a tool you use to make music. The instrument *is* the music, patiently teaching you its geometry every time you pick it up.`,
      subtext: 'The Timeless Song · The Guitar as Teacher · The 4:3 Grid',
      quote: 'See how music shows up on the guitar. The SHEARL protocol: See it, Hear it, Feel it.',
      author: 'Bertrand Laurence',
      ratio: '4:3 — The grid is the lesson',
      image: '/assets/slides/ch6/timeless/instrument.png',
      accent: '#5f27cd',
      references: [
        { title: 'Atalanta Fugiens', author: 'Michael Maier', date: '1617', context: 'Rosicrucian emblem book: 50 fugues paired with alchemical emblems. Music as the medium of transformation — the instrument transforms the player.' }
      ]
    },
  ],

  // ════════════════════════════════════════════
  // FRET 7 — The Ordeal · Tritone · √2:1
  // ════════════════════════════════════════════
  7: [
    {
      id: '7-timeless-0', type: 'timeless-song',
      label: '∞ THE TIMELESS SONG · I', title: 'The Devil in Music',
      body: `In medieval Europe, one interval was feared above all others: the tritone — three whole tones, exactly half the octave. The Church called it *diabolus in musica* — the devil in music. Singers were warned never to produce it. Composers avoided it. Treatises condemned it.\n\nThe fear was mathematical: the tritone is the only interval that divides the octave perfectly in half. It has no resolution. It pulls in both directions equally. It is the sound of maximum tension, maximum ambiguity — and for a medieval world that needed certainty, that was genuinely terrifying.\n\nBut the tritone is also the engine of all dominant harmony. Without it, the V7 chord cannot resolve to the I. Without the devil, there is no homecoming.`,
      subtext: 'Medieval Europe · c. 9th–14th Century · The forbidden interval',
      quote: 'Mi contra fa est diabolus in musica.',
      author: 'Medieval treatise tradition (attributed to various authors)',
      ratio: '√2:1 — Tritone', image: '/assets/slides/ch7/timeless/diabolus.png', accent: '#8854d0',
      references: [
        { title: 'Musica Enchiriadis', author: 'Anonymous', date: 'c. 850 CE', context: 'One of the earliest treatises to discuss parallel organum and interval classification.' },
        { title: 'Gradus ad Parnassum', author: 'Johann Joseph Fux', date: '1725', context: 'Codified the rules of counterpoint including tritone avoidance.' }
      ]
    },
    {
      id: '7-timeless-1', type: 'timeless-song',
      label: '∞ THE TIMELESS SONG · II', title: 'The Banned Sound',
      body: `The medieval Church did not ban the tritone because it sounded bad. They banned it because it sounded *unresolved* — and in a theology built on certainty, an unresolved sound was a theological problem.\n\nBut the ban created a paradox. By forbidding the tritone, the Church ensured that every musician in Europe knew exactly what it sounded like. The forbidden interval became the most recognized interval in Western music. Composers began hiding it in their work — not as defiance, but as expression. The tritone became the secret language of tension, longing, and the unsayable.\n\nEvery blues riff you have ever heard uses the tritone. Every dominant seventh chord contains it. The thing the Church feared most became the engine of all modern harmony.`,
      subtext: 'Medieval France · The paradox of prohibition',
      quote: 'Music is the space between the notes.',
      author: 'Claude Debussy',
      ratio: '√2:1 — The banned interval became the most important one', image: '/assets/slides/ch7/timeless/ban.png', accent: '#8854d0',
      references: [
        { title: 'De Institutione Musica', author: 'Boethius', date: 'c. 505 CE', context: 'Classified intervals by consonance — the tritone sat at the boundary, neither consonant nor simply dissonant.' }
      ]
    },
    {
      id: '7-timeless-2', type: 'timeless-song',
      label: '∞ THE TIMELESS SONG · III', title: 'The Avoided Thing Is the Engine',
      body: `In my practice, there is always one thing I avoid. One chord shape my hand resists. One interval my ear flinches from. One exercise I skip.\n\nThat thing — the avoided thing — is the tritone of my development. It is the exact point where my growth is waiting. The medieval Church avoided the tritone for centuries, and the result was that all of Western harmony was delayed until someone had the courage to play it.\n\nThe Timeless Song does not ask me to be comfortable. It asks me to play the interval I have been avoiding. The dissonance is not the enemy. The dissonance is the door.`,
      subtext: 'The Timeless Song · The Avoided Thing · The Door Through Dissonance',
      quote: 'If you cannot sing it, you cannot play it.',
      author: 'Bertrand Laurence',
      ratio: '√2:1 — What you avoid is where you grow', image: '/assets/slides/ch7/timeless/avoided.png', accent: '#8854d0',
      references: []
    },
  ],

  // ════════════════════════════════════════════
  // FRET 8 — The Reward · Perfect 5th · 3:2
  // ════════════════════════════════════════════
  8: [
    {
      id: '8-timeless-0', type: 'timeless-song',
      label: '∞ THE TIMELESS SONG · I', title: 'The Treatise That Named the Overtones',
      body: `In 1722, Jean-Philippe Rameau — a 39-year-old French organist who had spent years in obscurity — published the *Traité de l'harmonie réduite à ses principes naturels*. It changed everything.\n\nRameau argued that harmony was not a set of arbitrary rules but a consequence of physics. When you pluck a string tuned to C, it does not produce only C. It produces a cascade of overtones — an octave above, then a fifth, then another octave, then a major third — in diminishing brightness. The Perfect Fifth is the first non-octave overtone: ratio 3:2.\n\nRameau proved that the chord is not a human invention. It is a physical fact. The major triad exists inside every single vibrating string, waiting to be heard.`,
      subtext: 'Paris, France · 1722 · Traité de l\'harmonie',
      quote: 'Music is a science which should have certain rules; these rules should be drawn from a self-evident principle.',
      author: 'Jean-Philippe Rameau, Traité de l\'harmonie (1722)',
      ratio: '3:2 — Perfect 5th', image: '/assets/slides/ch8/timeless/rameau.png', accent: '#e74c3c',
      references: [
        { title: 'Traité de l\'harmonie', author: 'Jean-Philippe Rameau', date: '1722', context: 'Founded modern harmonic theory on the overtone series. Replaced medieval counterpoint rules with acoustic physics.' }
      ]
    },
    {
      id: '8-timeless-1', type: 'timeless-song',
      label: '∞ THE TIMELESS SONG · II', title: 'The Invisible Tower',
      body: `Every vibrating string is a tower of sound.\n\nThe fundamental rings loudest — that is the note you name. But above it, at exact mathematical intervals, the overtones stack upward like invisible floors. The second harmonic is the octave (2:1). The third is the Perfect Fifth (3:2). The fourth is another octave. The fifth is the Major Third (5:4). The sixth is another Fifth. The seventh is the Minor Seventh.\n\nYou have never heard a single isolated pitch in your life. Every note you have ever heard was a chord — a tower of ratios embedded in the physics of vibration. The overtone series is not theory. It is the acoustic structure of reality.\n\nPythagoras heard it in the forge. Mersenne measured it. Rameau named it. You are playing it right now.`,
      subtext: 'The Overtone Series · The chord inside every note',
      quote: 'The master has failed more times than the beginner has tried.',
      author: 'Stephen McCranie',
      ratio: '3:2 — The Fifth is the first overtone you can actually hear', image: '/assets/slides/ch8/timeless/overtone.png', accent: '#e74c3c',
      references: [
        { title: 'Harmonie Universelle', author: 'Marin Mersenne', date: '1636', context: 'First empirical measurement of the overtone series in vibrating strings.' }
      ]
    },
    {
      id: '8-timeless-2', type: 'timeless-song',
      label: '∞ THE TIMELESS SONG · III', title: 'The Reward Was in the String',
      body: `The Perfect Fifth — 3:2 — is the most consonant interval after the octave. It is the sound of power chords, of open tunings, of resolution. It is the reward.\n\nBut here is the secret: the reward was always there. The 3:2 ratio existed in the string before you plucked it. The overtone was present before the fundamental sounded. The harmony was waiting inside the physics.\n\nYou did not earn the Perfect Fifth. You uncovered it. Every hour of practice, every scale, every fumbled chord change — none of it created the beauty. It was always there. Practice simply removed the obstacles between you and the sound that was already present.\n\nThis is the Supreme Ordeal's reward: the realization that you were never building something. You were clearing a path to something that already existed.`,
      subtext: 'The Timeless Song · The Reward Was Always There',
      quote: 'The friction of the True Move overcomes the fear of a wrong note.',
      author: 'Bertrand Laurence',
      ratio: '3:2 — The string already contains the answer', image: '/assets/slides/ch8/timeless/reward.png', accent: '#e74c3c',
      references: []
    },
  ],

  // ════════════════════════════════════════════
  // FRET 9 — The Road Back · Minor 6th · 8:5
  // ════════════════════════════════════════════
  9: [
    {
      id: '9-timeless-0', type: 'timeless-song',
      label: '∞ THE TIMELESS SONG · I', title: 'The Body That Knows Itself',
      body: `In his treatise *De Anima* (On the Soul), Aristotle identified a sense that had no organ: *kinesthesis* — the body's awareness of its own position and movement. You do not need to look at your hand to know where it is. Something deeper than sight tells you.\n\nAristotle taught while walking — the Peripatetic method — because he believed that the body in motion thinks differently than the body at rest. His students played lyres while walking through the Lyceum gardens, learning that music is not produced by the fingers alone but by the entire body's relationship to gravity, balance, and breath.\n\nThe Minor 6th — eight semitones — is the interval of bittersweet searching. It is the sound of the body reaching for something it can almost feel.`,
      subtext: 'Athens, Greece · c. 335 BCE · The Lyceum · De Anima',
      quote: 'The soul is in a way all existing things; for existing things are either sensible or thinkable.',
      author: 'Aristotle, De Anima, Book III',
      ratio: '8:5 — Minor 6th', image: '/assets/slides/ch9/timeless/aristotle.png', accent: '#2ecc71',
      references: [
        { title: 'De Anima', author: 'Aristotle', date: 'c. 350 BCE', context: 'First systematic treatment of kinesthetic awareness — the body\'s self-perception.' }
      ]
    },
    {
      id: '9-timeless-1', type: 'timeless-song',
      label: '∞ THE TIMELESS SONG · II', title: 'The Art of Not Trying',
      body: `Claude Debussy did not practice scales. He sat at his piano in Paris and listened.\n\nHis contemporaries described his method as bewildering: he would play a single chord, then wait — sometimes for minutes — listening to its decay, its overtones, the way the sound changed as it faded. He was not composing. He was receiving.\n\nDebussy's music — *Clair de Lune*, *La Mer*, *Prélude à l'après-midi d'un faune* — sounds effortless because it was created with minimum force. He did not push notes into place. He found them. The bittersweet searching of the Minor 6th runs through his work like a golden thread.\n\nProper kinesthesis is not about trying harder. It is about trying less — and listening more.`,
      subtext: 'Paris, France · Early 1900s · The Impressionist revolution',
      quote: 'Works of art make rules; rules do not make works of art.',
      author: 'Claude Debussy',
      ratio: '8:5 — Minimum force, maximum clarity', image: '/assets/slides/ch9/timeless/debussy.png', accent: '#2ecc71',
      references: [
        { title: 'Monsieur Croche', author: 'Claude Debussy', date: '1921 (posthumous)', context: 'Collected criticism revealing Debussy\'s philosophy: music as sensation, not construction.' }
      ]
    },
    {
      id: '9-timeless-2', type: 'timeless-song',
      label: '∞ THE TIMELESS SONG · III', title: 'The Threshold of Clarity',
      body: `There is a precise amount of pressure — exactly enough, no more — that produces a clean note on the guitar. Below it: buzzing. Above it: muted tension. At the threshold: clarity.\n\nThis threshold is different for every fret, every string, every guitar. It cannot be taught in words. It can only be felt. Your fingertip must learn it through thousands of repetitions until the body knows the threshold without thinking.\n\nThis is proper kinesthesis: the body calibrating itself to the minimum force required. Aristotle named the sense. Debussy embodied it. Bertrand teaches it as the core of his method.\n\nThe Minor 6th is the interval of effortless mastery — not because it is easy, but because it has been practiced until the effort disappears.`,
      subtext: 'The Timeless Song · Minimum Force · The Body Calibrates Itself',
      quote: 'Mastery is not about adding, but about removing.',
      author: 'Kenny Werner, Effortless Mastery (1996)',
      ratio: '8:5 — The threshold between effort and ease', image: '/assets/slides/ch9/timeless/force.png', accent: '#2ecc71',
      references: []
    },
  ],

  // ════════════════════════════════════════════
  // FRET 10 — The Resurrection · Major 6th · 5:3
  // ════════════════════════════════════════════
  10: [
    {
      id: '10-timeless-0', type: 'timeless-song',
      label: '∞ THE TIMELESS SONG · I', title: 'Music as Medicine',
      body: `In 1489, Marsilio Ficino — priest, philosopher, physician, and head of the Platonic Academy in Florence — published *De Vita Libri Tres* (Three Books on Life). In Book III, he made an extraordinary claim: specific musical intervals could heal specific ailments.\n\nFicino was not being metaphorical. He believed that the human body contained "spirits" — subtle vapors connecting body and soul — and that these spirits vibrated at frequencies that could be tuned by music, just as a string is tuned by tension. A melancholic patient needed solar intervals (bright major thirds, expansive sixths). A manic patient needed lunar intervals (cool minor seconds, grounding fourths).\n\nFicino played the lira da braccio for his patients in the gardens of Lorenzo de' Medici. Music was his prescription.`,
      subtext: 'Florence, Italy · 1489 · The Platonic Academy',
      quote: 'Musical sound, more than anything else, carries emotion and transports it to the body as well as the soul.',
      author: 'Marsilio Ficino, De Vita Libri Tres (1489)',
      ratio: '5:3 — Major 6th', image: '/assets/slides/ch10/timeless/ficino.png', accent: '#f39c12',
      references: [
        { title: 'De Vita Libri Tres', author: 'Marsilio Ficino', date: '1489', context: 'Book III: "De Vita Coelitus Comparanda" — on obtaining life from the heavens through music and astrological medicine.' }
      ]
    },
    {
      id: '10-timeless-1', type: 'timeless-song',
      label: '∞ THE TIMELESS SONG · II', title: 'The Dedication',
      body: `In 1875, Georges Bizet sat at his piano in Paris and played the Habanera from *Carmen* for his wife Geneviève. She was the only audience. He played it not as a performance but as a gift — every note shaped by the knowledge of who was listening.\n\nBizet died three months after Carmen's premiere, at age 36. He never knew the opera would become one of the most performed works in history. But in that private moment, playing for one person, every note carried its full emotional weight because it was dedicated.\n\nThe Major 6th — 5:3 — is the interval of wistful longing, of nostalgia, of reaching across a distance. It is the opening interval of countless love songs. It is the sound of playing for someone.`,
      subtext: 'Paris, France · 1875 · Carmen',
      quote: 'Where words fail, music speaks.',
      author: 'Hans Christian Andersen',
      ratio: '5:3 — Every note is played for someone', image: '/assets/slides/ch10/timeless/bizet.png', accent: '#f39c12',
      references: [
        { title: 'Carmen', author: 'Georges Bizet', date: '1875', context: 'Premiered at the Opéra-Comique, Paris. Initially controversial; now the most performed French opera.' }
      ]
    },
    {
      id: '10-timeless-2', type: 'timeless-song',
      label: '∞ THE TIMELESS SONG · III', title: 'Every Note for Someone',
      body: `Ficino played for his patients. Bizet played for his wife. The troubadours played for Eleanor.\n\nEvery great performance in history was directed at someone. Not at an abstract audience, but at a specific human being whose presence changed the way the musician played. The dedication is not decoration. It is the mechanism by which music acquires emotional truth.\n\nWhen Bertrand asks you to play a melody "for someone you love," he is not being sentimental. He is activating the same neural pathways that Ficino described as "spirits" — the connection between musical intention and physical expression. Your touch changes. Your tempo breathes. Your dynamics become personal.\n\nThe Major 6th reaches across space. It is the interval of connection. Play it for someone.`,
      subtext: 'The Timeless Song · The Dedication · Connection as Technique',
      quote: 'What is the story? Who is your audience?',
      author: 'Bertrand Laurence',
      ratio: '5:3 — Music becomes real when it is given away', image: '/assets/slides/ch10/timeless/everynote.png', accent: '#f39c12',
      references: []
    },
  ],

  // ════════════════════════════════════════════
  // FRET 11 — The Elixir · Minor 7th · 16:9
  // ════════════════════════════════════════════
  11: [
    {
      id: '11-timeless-0', type: 'timeless-song',
      label: '∞ THE TIMELESS SONG · I', title: 'The Conductor Who Died for Music',
      body: `On January 8, 1687, Jean-Baptiste Lully — the most powerful musician in France, master of the king's music at Versailles — conducted a Te Deum celebrating Louis XIV's recovery from surgery. In that era, conductors kept time by striking a long wooden staff against the floor.\n\nLully struck his own foot with the staff. The wound became gangrenous. His doctors urged amputation. Lully refused — a dancer, he said, cannot lose a foot. He died two months later, at 54, of gangrene that spread from a conducting injury.\n\nLully died because he would not stop making music, even when music was killing him. The Minor 7th — one step from the octave, one step from home — is the interval of almost-there. Of commitment so total that retreat is impossible.`,
      subtext: 'Versailles, France · January 8, 1687 · The death of Lully',
      quote: 'He who serves two masters will disappoint one. I have only ever served music.',
      author: 'Attributed to Jean-Baptiste Lully',
      ratio: '16:9 — Minor 7th', image: '/assets/slides/ch11/timeless/lully.png', accent: '#e056a0',
      references: [
        { title: 'The Life of Lully', author: 'Le Cerf de la Viéville', date: '1705', context: 'Contemporary account of Lully\'s death by conducting injury at the Te Deum performance.' }
      ]
    },
    {
      id: '11-timeless-1', type: 'timeless-song',
      label: '∞ THE TIMELESS SONG · II', title: 'One Step from Home',
      body: `The Minor 7th is ten semitones — two frets shy of the octave. It is the dominant seventh's pull. It is the blues note that aches to resolve. It is one step from home.\n\nEvery practice session has this moment: the point where you can feel that the breakthrough is close. Your fingers almost know the pattern. Your ear almost hears the interval before you play it. You are standing at the edge of the spotlight, and all your practice sessions — hundreds of them — are lined up behind you like ghostly afterimages.\n\nThis is the moment most people stop. The Minor 7th is uncomfortable precisely because it is so close to resolution. The tension of almost-arriving is harder to bear than the tension of being far away.\n\nDo not stop here. One more step.`,
      subtext: 'The Timeless Song · The Penultimate Tension · Almost Home',
      quote: 'Stage fright is the ego\'s last stand.',
      author: 'Bertrand Laurence',
      ratio: '16:9 — One step. Do not stop here.', image: '/assets/slides/ch11/timeless/onestep.png', accent: '#e056a0',
      references: []
    },
    {
      id: '11-timeless-2', type: 'timeless-song',
      label: '∞ THE TIMELESS SONG · III', title: 'The Mirror of the Audience',
      body: `Stage fright is not fear of failure. It is fear of being seen.\n\nThe audience is a mirror. When you play for them, they do not hear your technique — they hear your emotional truth. If you are hiding, they hear hiding. If you are present, they hear presence. The Minor 7th — the penultimate tension — is the moment before you are fully exposed.\n\nLully could not stop conducting even when it was killing him because the music had become more real than his body. That is not recklessness. That is surrender. The ego dissolves when the music is more important than the musician.\n\nThe audience is not your enemy. They are the reason the song exists. Step into the light.`,
      subtext: 'The Timeless Song · Stage Fright · The Ego Dissolves',
      quote: 'Imagine an audience. Feel the fear. Give them permission to feel.',
      author: 'Bertrand Laurence',
      ratio: '16:9 — The audience is the mirror you have been avoiding', image: '/assets/slides/ch11/timeless/stagefright.png', accent: '#e056a0',
      references: []
    },
  ],

  // ════════════════════════════════════════════
  // FRET 12 — The Master · Octave · 2:1
  // ════════════════════════════════════════════
  12: [
    {
      id: '12-timeless-0', type: 'timeless-song',
      label: '∞ THE TIMELESS SONG · I', title: 'The Concert at the End of Time',
      body: `On January 15, 1941, in Stalag VIII-A — a German prisoner-of-war camp in Görlitz, Silesia — Olivier Messiaen performed his *Quatuor pour la fin du temps* (Quartet for the End of Time) for an audience of 400 prisoners and guards.\n\nThe instruments were broken. The cello had only three strings. The clarinet was cracked. The piano keys stuck. Messiaen composed the piece in captivity, writing on the only paper he could find, in freezing barracks by candlelight.\n\nFour hundred people — starving, freezing, imprisoned — listened in absolute silence. The music lasted fifty minutes. When it ended, no one moved. A guard later wrote: "Never before have I heard music of such purity."\n\nThe octave — 2:1 — is the return. The same note, doubled in frequency. You arrive where you began, but everything has changed.`,
      subtext: 'Stalag VIII-A, Görlitz · January 15, 1941 · Quatuor pour la fin du temps',
      quote: 'I have never been listened to with such concentration and understanding.',
      author: 'Olivier Messiaen, on the Stalag premiere',
      ratio: '2:1 — Octave', image: '/assets/slides/ch12/timeless/messiaen.png', accent: '#00d2d3',
      references: [
        { title: 'Quatuor pour la fin du temps', author: 'Olivier Messiaen', date: '1941', context: 'Composed and premiered in a POW camp. Eight movements inspired by the Book of Revelation.' },
        { title: 'For the End of Time: The Story of the Messiaen Quartet', author: 'Rebecca Rischin', date: '2003', context: 'Definitive account of the Stalag premiere, based on interviews with the surviving performers.' }
      ]
    },
    {
      id: '12-timeless-1', type: 'timeless-song',
      label: '∞ THE TIMELESS SONG · II', title: 'To See a World in a Grain of Sand',
      body: `William Blake — poet, painter, visionary — wrote:\n\n*To see a World in a Grain of Sand,\nAnd a Heaven in a Wild Flower,\nHold Infinity in the palm of your hand,\nAnd Eternity in an hour.*\n\nThe octave is Blake's grain of sand. It is the smallest complete cycle in music — one note returning to itself at double the frequency. Everything that will ever happen in music happens within this single span of twelve semitones. Every scale, every chord, every melody, every harmony is a subset of this one journey from root to octave.\n\nYou have traveled all twelve frets. You have met Pythagoras in his forge, Boethius in his cell, Guido with his hand raised, Debussy at his piano, Messiaen in his prison camp. The song was always the same song. The voice was always your voice.`,
      subtext: 'London · c. 1803 · Auguries of Innocence',
      quote: 'To see a World in a Grain of Sand, and a Heaven in a Wild Flower, hold Infinity in the palm of your hand, and Eternity in an hour.',
      author: 'William Blake, Auguries of Innocence (c. 1803)',
      ratio: '2:1 — The complete cycle', image: '/assets/slides/ch12/timeless/messiaen.png', accent: '#00d2d3',
      references: [
        { title: 'Auguries of Innocence', author: 'William Blake', date: 'c. 1803', context: 'Visionary poem. Unpublished in Blake\'s lifetime. First printed 1863.' }
      ]
    },
    {
      id: '12-timeless-2', type: 'timeless-song',
      label: '∞ THE TIMELESS SONG · III', title: 'Return Transformed',
      body: `The octave is the same note you began with.\n\nBut you are not the same person. Twelve frets ago, you were gripping the guitar. Now, the guitar plays through you. Twelve frets ago, the Pythagorean ratios were numbers on a page. Now, they live in your fingers, your breath, your ear.\n\nThe Timeless Song was never a lesson. It was a remembering. The music was always already playing. You were always already a musician. The root note and the octave are the same frequency — one simply vibrates twice as fast. The beginning and the end are the same place, seen from a higher perspective.\n\nThis is *Voix Vive* — the living voice. It was always yours. It was always playing. You just had to get quiet enough to hear it.\n\nWelcome home.`,
      subtext: 'The Timeless Song · The Octave · Welcome Home',
      quote: 'It does not shoot; It shoots.',
      author: 'Eugen Herrigel, Zen in the Art of Archery (1948)',
      ratio: '2:1 — You are the root and the octave', image: '/assets/slides/ch12/timeless/eternity.png', accent: '#00d2d3',
      references: [
        { title: 'Utriusque Cosmi Historia', author: 'Robert Fludd', date: '1617', context: 'The divine monochord — the octave as the span between earth and heaven, tuned by the hand of God.' },
        { title: 'Zen in the Art of Archery', author: 'Eugen Herrigel', date: '1948', context: 'The dissolution of the boundary between practitioner and practice — the exact state Bertrand describes as "being played by the guitar."' }
      ]
    },
  ],

};

export default TIMELESS_SONG_SLIDES;
