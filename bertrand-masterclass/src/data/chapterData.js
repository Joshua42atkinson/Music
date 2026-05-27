// ═══════════════════════════════════════════════════════════
// THE BARD'S HANDBOOK — 12-Fret Monomyth Curriculum
// Maps the Hero's Journey to the Western Chromatic Scale
// Each chapter = 1 semitone = 1 Hero's Journey stage
// Fully localized in English [en] and French [fr]
// ═══════════════════════════════════════════════════════════

const frets = [
  {
    id: 1, fret: 1, note: 'Root', interval: { en: 'Unison', fr: 'Unisson' },
    heroStage: { en: 'Call to Adventure', fr: "L'Appel à l'Aventure" },
    title: { en: 'The Root Note', fr: 'La Note Racine' },
    subtitle: { en: 'Relax your body before you play', fr: 'Détendez votre corps avant de jouer' },
    act: { en: 'Part 1: Finding Your Voice', fr: 'Partie 1 : Trouver Votre Voix' },
    icon: '🌱', color: '#ff6b6b', pillar: { en: 'Technique & Body Intelligence', fr: 'Technique & Intelligence Corporelle' },
    coreMessage: {
      en: 'Trauma creates and keeps tension. You are fighting the instrument.',
      fr: "Le trauma crée et retient la tension. Vous combattez l'instrument."
    },
    westernTheory: {
      musicGrammar: {
        en: 'The Root note is the foundation of Western Music. It is the center of gravity, the "home base" from which all other notes pull or push. Without a root, harmony has no context.',
        fr: "La note Racine est le fondement de la musique occidentale. C'est le centre de gravité, la « maison » depuis laquelle toutes les autres notes tirent ou poussent. Sans racine, l'harmonie n'a pas de contexte."
      },
      guitarGrammar: {
        en: 'On the guitar, the root can be moved anywhere. Unlike a piano where "Middle C" is fixed, the guitar is a transposing instrument relative to its tuning. The open strings are just pre-fretted notes at Fret 0.',
        fr: "Sur la guitare, la racine peut être déplacée n'importe où. Contrairement à un piano où le « Do central » est fixe, la guitare est un instrument transpositeur par rapport à son accordage. Les cordes à vide ne sont que des notes pré-frettées à la frette 0."
      }
    },
    yin: {
      title: { en: 'The Grip of Tension', fr: "L'Emprise de la Tension" },
      philosophy: {
        en: `You are an instrument playing an instrument. Before you tune the wooden box, you must tune the biological one. The body is your first instrument — your fascia, your breath, your nervous system. Physical tension on the fretboard is trapped psychological trauma. Every hunched shoulder, every locked jaw, every shallow breath is a wall between you and the music.\n\nThe ancient alchemists called this stage "Nigredo" — the blackening. You must first confront the chaos within before transmutation can begin. In the practice nook, this means sitting with the guitar and doing... nothing. Not playing. Breathing. Scanning. Listening to the silence between your heartbeats.`,
        fr: `Vous êtes un instrument qui joue d'un instrument. Avant d'accorder la boîte en bois, vous devez accorder la boîte biologique. Le corps est votre premier instrument — votre fascia, votre souffle, votre système nerveux. La tension physique sur le manche est un traumatisme psychologique piégé. Chaque épaule haussée, chaque mâchoire serrée, chaque respiration superficielle est un mur entre vous et la musique.\n\nLes anciens alchimistes appelaient cette étape « Nigredo » — le noircissement. Vous devez d'abord affronter le chaos intérieur avant que la transmutation ne puisse commencer. Dans le coin de pratique, cela signifie s'asseoir avec la guitare et ne... rien faire. Ne pas jouer. Respirer. Scanner. Écouter le silence entre les battements de votre cœur.`
      },
      quote: {
        text: { en: 'The wound is the place where the Light enters you.', fr: 'La blessure est l\'endroit par lequel la Lumière entre en vous.' },
        author: 'Rumi'
      },
      meditation: {
        prompt: { en: 'Close your eyes. Hold the guitar against your body. Where do you feel resistance?', fr: 'Fermez les yeux. Tenez la guitare contre votre corps. Où ressentez-vous de la résistance ?' },
        duration: 60
      },
      concepts: [
        {
          term: { en: 'Kinesthesis', fr: 'Kinesthésie' },
          definition: { en: 'The awareness of the position and movement of the parts of the body by means of sensory organs in the muscles and joints.', fr: 'La conscience de la position et du mouvement des parties du corps au moyen d\'organes sensoriels dans les muscles et les articulations.' }
        },
        {
          term: { en: 'Fascia', fr: 'Fascia' },
          definition: { en: 'The connective tissue web that surrounds every muscle, bone, and organ. It records and stores physical patterns — including tension from stress and trauma.', fr: 'Le réseau de tissu conjonctif qui entoure chaque muscle, os et organe. Il enregistre et stocke les schémas physiques — y compris la tension due au stress et aux traumatismes.' }
        },
        {
          term: { en: 'Ventral Vagal State', fr: 'État Vagal Ventral' },
          definition: { en: 'The "rest and digest" state. Social engagement, calm breathing, relaxed muscles. This is the prerequisite for Flow.', fr: 'L\'état de « repos et digestion ». Engagement social, respiration calme, muscles détendus. C\'est le prérequis absolu pour le Flow.' }
        }
      ]
    },
    yang: {
      title: { en: 'The Pre-Flight Check', fr: 'Le Contrôle Pré-Vol' },
      instruction: {
        en: `Before your fingers touch the strings, your body must be calibrated. This is not optional — it is the foundation upon which every note is built.`,
        fr: `Avant que vos doigts ne touchent les cordes, votre corps doit être calibré. Ce n'est pas une option — c'est le fondement sur lequel chaque note est construite.`
      },
      exercises: [
        {
          name: { en: 'The Body Scan', fr: 'Le Scan Corporel' },
          steps: [
            { en: 'Sit with your guitar', fr: 'Asseyez-vous avec votre guitare' },
            { en: 'Close eyes, breathe deeply', fr: 'Fermez les yeux, respirez profondément' },
            { en: 'Scan from crown to toes', fr: 'Scannez du sommet de la tête aux orteils' },
            { en: 'Release tension', fr: 'Relâchez la tension' },
            { en: 'Open eyes. Shoulders dropped.', fr: 'Ouvrez les yeux. Épaules relâchées.' }
          ]
        },
        {
          name: { en: 'The Single Note Test', fr: 'Le Test de la Note Unique' },
          steps: [
            { en: 'Play one open E string', fr: 'Jouez une corde de Mi à vide' },
            { en: 'Listen to decay', fr: 'Écoutez la résonance s\'éteindre' },
            { en: 'Play again — notice shoulders', fr: 'Jouez à nouveau — observez vos épaules' },
            { en: 'Play without tension', fr: 'Jouez sans aucune tension' }
          ]
        }
      ],
      fretboardFocus: { startFret: 0, endFret: 0, strings: [1, 2, 3, 4, 5, 6], pattern: 'open-strings' }
    }
  },
  {
    id: 2, fret: 2, note: 'C/C♯', interval: { en: 'Minor 2nd', fr: 'Seconde Mineure' },
    heroStage: { en: 'Refusal of the Call', fr: 'Le Refus de l\'Appel' },
    title: { en: 'The Refusal', fr: 'Le Refus' },
    subtitle: { en: 'Notice your habits and tension', fr: 'Observez vos habitudes et vos tensions' },
    act: { en: 'Part 1: Finding Your Voice', fr: 'Partie 1 : Trouver Votre Voix' },
    icon: '📯', color: '#ff8e53', pillar: { en: 'Body & Mind Intelligence', fr: 'Intelligence du Corps & de l\'Esprit' },
    coreMessage: {
      en: 'You are an instrument playing an instrument. If I am playing the guitar, who is playing me?',
      fr: "Vous êtes un instrument jouant d'un instrument. Si je joue de la guitare, qui joue de moi ?"
    },
    westernTheory: {
      musicGrammar: {
        en: 'The Minor 2nd (one semitone) is the smallest interval in Western music and creates the sharpest dissonance. It is the "rub" that demands resolution.',
        fr: "La seconde mineure (un demi-ton) est le plus petit intervalle de la musique occidentale et crée la dissonance la plus aiguë. C'est le « frottement » qui exige une résolution."
      },
      guitarGrammar: {
        en: 'On the guitar, one fret equals one semitone (a Minor 2nd). This geometric absolute means any chord shape moved up one fret is raised by exactly one semitone.',
        fr: "Sur la guitare, une frette égale un demi-ton (une seconde mineure). Cet absolu géométrique signifie que toute forme d'accord déplacée d'une frette vers le haut est élevée d'exactement un demi-ton."
      }
    },
    yin: {
      title: { en: 'The Observer Within', fr: "L'Observateur Intérieur" },
      philosophy: {
        en: 'The Minor 2nd is dissonance — the first friction. It is the moment you realize something is wrong with how you have been practicing.',
        fr: "La seconde mineure est la dissonance — la première friction. C'est le moment où vous réalisez que quelque chose ne va pas dans votre façon de pratiquer."
      },
      quote: {
        text: { en: 'The unexamined life is not worth living.', fr: 'Une vie sans examen ne vaut pas la peine d\'être vécue.' },
        author: 'Socrates'
      },
      meditation: {
        prompt: { en: 'Who is the one watching you play?', fr: 'Qui est celui qui vous regarde jouer ?' },
        duration: 45
      },
      concepts: [
        {
          term: { en: 'Semitone', fr: 'Demi-ton' },
          definition: { en: 'The smallest step between two notes in Western music. On a guitar, one fret = one semitone.', fr: 'Le plus petit intervalle entre deux notes dans la musique occidentale. Sur une guitare, une frette = un demi-ton.' }
        },
        {
          term: { en: 'Dissonance', fr: 'Dissonance' },
          definition: { en: 'When two notes clash or "rub" against each other. It creates tension that wants to resolve.', fr: 'Lorsque deux notes s\'entrechoquent ou se frottent. Cela crée une tension qui cherche à se résoudre.' }
        },
        {
          term: { en: 'Body Awareness', fr: 'Conscience Corporelle' },
          definition: { en: 'Noticing what your body is doing while you play — hunched shoulders, locked jaw, shallow breathing. Awareness is the first step to change.', fr: 'Remarquer ce que fait votre corps pendant que vous jouez — épaules haussées, mâchoire serrée, respiration superficielle. La conscience est le premier pas vers le changement.' }
        }
      ]
    },
    yang: {
      title: { en: 'The Breathing Fretboard', fr: 'La Touche Respirante' },
      instruction: {
        en: 'Apply the Breath Override while fretting your first note on Fret 1.',
        fr: 'Appliquez le contrôle respiratoire tout en frettant votre première note sur la frette 1.'
      },
      exercises: [
        {
          name: { en: 'Tension Comparison Test', fr: 'Test de Comparaison de Tension' },
          steps: [
            { en: 'Hunch shoulders deliberately', fr: 'Haussez délibérément les épaules' },
            { en: 'Play Low E Fret 1', fr: 'Jouez la frette 1 de la corde de Mi grave' },
            { en: 'Drop shoulders, repeat', fr: 'Relâchez les épaules, répétez' },
            { en: 'Compare sounds', fr: 'Comparez les sons' }
          ]
        }
      ],
      fretboardFocus: { startFret: 0, endFret: 2, strings: [1, 6], pattern: 'octave-e' }
    }
  },
  {
    id: 3, fret: 3, note: 'D', interval: { en: 'Major 2nd', fr: 'Seconde Majeure' },
    heroStage: { en: 'Meeting the Mentor', fr: 'La Rencontre avec le Mentor' },
    title: { en: 'The Mentor', fr: 'Le Mentor' },
    subtitle: { en: 'Let go of the fear of wrong notes', fr: 'Lâchez la peur des fausses notes' },
    act: { en: 'Part 1: Finding Your Voice', fr: 'Partie 1 : Trouver Votre Voix' },
    icon: '🚫', color: '#feca57', pillar: { en: 'Creativity', fr: 'Créativité' },
    coreMessage: {
      en: 'Judgment and anticipation destroy flow. The ego must be silenced.',
      fr: 'Le jugement et l\'anticipation détruisent le flow. L\'ego doit être réduit au silence.'
    },
    westernTheory: {
      musicGrammar: {
        en: 'The Major 2nd (two semitones, or a whole step) forms the building blocks of most diatonic scales (Major and Minor scales).',
        fr: "La seconde majeure (deux demi-tons, ou un ton entier) constitue la brique de base de la plupart des gammes diatoniques (gammes majeures et mineures)."
      },
      guitarGrammar: {
        en: 'A whole step is two frets. Visually seeing whole steps and half steps on a single string is crucial to understanding scale architecture linearly before vertically.',
        fr: "Un ton entier correspond à deux frettes. Visualiser les tons et les demi-tons sur une seule corde est crucial pour comprendre la structure des gammes de façon linéaire avant de l'aborder verticalement."
      }
    },
    yin: {
      title: { en: 'Silencing the Critic', fr: 'Faire Taire le Critique' },
      philosophy: {
        en: 'The Major 2nd steps further from home. The Left-Brain Interpreter floods you with doubt.',
        fr: "La seconde majeure s'éloigne de la maison. L'interprète de votre cerveau gauche vous inonde de doutes."
      },
      quote: {
        text: { en: 'It is not the critic who counts.', fr: 'Ce n\'est pas le critique qui compte.' },
        author: 'Theodore Roosevelt'
      },
      meditation: {
        prompt: { en: 'Play a note. Notice the voice that judges it.', fr: 'Jouez une note. Observez la voix qui la juge.' },
        duration: 45
      },
      concepts: [
        {
          term: { en: 'Whole Step', fr: 'Ton Entier' },
          definition: { en: 'Two semitones (two frets). The building block of most scales. On a guitar, skip one fret to move a whole step.', fr: 'Deux demi-tons (deux frettes). La brique de construction de la plupart des gammes. Sur une guitare, sautez une frette pour monter d\'un ton.' }
        },
        {
          term: { en: 'Inner Critic', fr: 'Critique Intérieur' },
          definition: { en: 'The voice in your head that says "that was wrong" or "you are bad at this." Learning to quiet it is a real skill.', fr: 'La voix dans votre tête qui dit « c\'était faux » ou « tu es nul à ça ». Apprendre à la calmer est une compétence essentielle.' }
        },
        {
          term: { en: 'Wu Wei', fr: 'Wu Wei' },
          definition: { en: 'A Chinese concept meaning "effortless action." Doing without forcing. Letting the music happen instead of making it happen.', fr: 'Concept chinois signifiant « l\'action sans effort ». Faire sans forcer. Laisser la musique se produire au lieu de la forcer.' }
        }
      ]
    },
    yang: {
      title: { en: 'Wu Wei — The Art of Non-Action', fr: 'Wu Wei — L\'Art de la Non-Action' },
      instruction: {
        en: 'Practice letting "wrong" notes exist without flinching.',
        fr: 'Entraînez-vous à laisser exister les notes « fausses » sans broncher.'
      },
      exercises: [
        {
          name: { en: 'The Deliberate Miss', fr: 'La Faute Délibérée' },
          steps: [
            { en: 'Play a scale', fr: 'Jouez une gamme' },
            { en: 'Deliberately miss a note', fr: 'Manquez délibérément une note' },
            { en: 'Notice body reaction', fr: 'Observez la réaction de votre corps' },
            { en: 'Hold the wrong note without judgment', fr: 'Maintenez la fausse note sans aucun jugement' }
          ]
        }
      ],
      fretboardFocus: { startFret: 0, endFret: 3, strings: [1, 2, 5, 6], pattern: 'natural-notes' }
    }
  },
  {
    id: 4, fret: 4, note: 'D♯/E♭', interval: { en: 'Minor 3rd', fr: 'Tierce Mineure' },
    heroStage: { en: 'Crossing the Threshold', fr: 'Le Passage du Seuil' },
    title: { en: 'The Threshold', fr: 'Le Seuil' },
    subtitle: { en: 'Hear a note, then find it on the guitar', fr: 'Entendez une note, puis trouvez-la sur la guitare' },
    act: { en: 'Part 1: Finding Your Voice', fr: 'Partie 1 : Trouver Votre Voix' },
    icon: '🧙', color: '#48dbfb', pillar: { en: 'All Five Pillars', fr: 'Les Cinq Piliers Réunis' },
    coreMessage: {
      en: 'Trust and obey. Follow the unfolding story. The mentor shows the path but cannot walk it for you.',
      fr: "Faites confiance et obéissez. Suivez l'histoire qui se déroule. Le mentor montre le chemin mais ne peut le parcourir pour vous."
    },
    westernTheory: {
      musicGrammar: {
        en: 'The Minor 3rd (three semitones) is the defining interval of minor chords and the blues scale. It carries the emotional weight of melancholy or tension.',
        fr: "La tierce mineure (trois demi-tons) est l'intervalle caractéristique des accords mineurs et de la gamme de blues. Elle porte le poids émotionnel de la mélancolie ou de la tension."
      },
      guitarGrammar: {
        en: 'The minor third spans three frets on a single string, or an offset diagonal across adjacent strings (depending on the tuning interval of the strings).',
        fr: "La tierce mineure s'étend sur trois frettes sur une seule corde, ou en diagonale décalée sur deux cordes adjacentes (selon l'intervalle d'accordage des cordes)."
      }
    },
    yin: {
      title: { en: 'Trust and Obey', fr: 'Confiance et Obéissance' },
      philosophy: {
        en: 'The Minor 3rd introduces emotion — it is the sound of melancholy, of depth.',
        fr: "La tierce mineure introduit l'émotion — c'est le son de la mélancolie, de la profondeur."
      },
      quote: {
        text: { en: 'When the student is ready, the teacher appears.', fr: 'Quand l\'élève est prêt, le maître apparaît.' },
        author: 'Lao Tzu'
      },
      meditation: {
        prompt: { en: 'What brought you to the guitar? The feeling you are chasing.', fr: 'Qu\'est-ce qui vous a amené à la guitare ? La sensation que vous poursuivez.' },
        duration: 60
      },
      concepts: [
        {
          term: { en: 'Minor 3rd', fr: 'Tierce Mineure' },
          definition: { en: 'An interval of three semitones. It gives minor chords their sad, moody, or mysterious sound.', fr: 'Un intervalle de trois demi-tons. Il donne aux accords mineurs leur sonorité triste, sombre ou mystérieuse.' }
        },
        {
          term: { en: '©PLING!', fr: '©PLING!' },
          definition: { en: 'Sing then Play. A practice method: first hear the note in your mind, then sing it out loud, then find it on the guitar. Trains your inner ear.', fr: 'Chantez puis Jouez. Une méthode de pratique : entendez d\'abord la note dans votre esprit, chantez-la à haute voix, puis trouvez-la sur la guitare. Entraîne votre oreille interne.' }
        },
        {
          term: { en: 'Interval', fr: 'Intervalle' },
          definition: { en: 'The distance between two notes, measured in semitones. Each interval has a unique sound and feeling.', fr: 'La distance entre deux notes, mesurée en demi-tons. Chaque intervalle a un son et un sentiment uniques.' }
        }
      ]
    },
    yang: {
      title: { en: 'The Minor Third Interval', fr: 'L\'Intervalle de Tierce Mineure' },
      instruction: {
        en: 'Learn the sound and shape of the Minor 3rd on all six strings.',
        fr: 'Apprenez le son et la forme de la tierce mineure sur les six cordes.'
      },
      exercises: [
        {
          name: { en: 'Sing Then Find (PLING!)', fr: 'Chanter puis Trouver (PLING!)' },
          steps: [
            { en: 'Play open Low E', fr: 'Jouez la corde de Mi grave à vide' },
            { en: 'Sing the note 3 frets higher', fr: 'Chantez la note 3 frettes plus haut' },
            { en: 'Fret it and check accuracy', fr: 'Frettez-la et vérifiez la précision' }
          ]
        }
      ],
      fretboardFocus: { startFret: 0, endFret: 4, strings: [1, 2, 3, 4, 5, 6], pattern: 'minor-third' }
    }
  },
  {
    id: 5, fret: 5, note: 'E', interval: { en: 'Major 3rd', fr: 'Tierce Majeure' },
    heroStage: { en: 'Tests, Allies, Enemies', fr: 'Épreuves, Alliés, Ennemis' },
    title: { en: 'The Tests', fr: 'Les Épreuves' },
    subtitle: { en: 'How notes become chords and songs', fr: 'Comment les notes deviennent des accords et des chansons' },
    act: { en: 'Part 2: Learning the Language', fr: 'Partie 2 : Apprendre la Langue' },
    icon: '🚪', color: '#0abde3', pillar: { en: 'Music Theory', fr: 'Théorie Musicale' },
    coreMessage: {
      en: 'Theory is not rules; it is the geometry of sound. The fretboard is the grid where this geometry manifests.',
      fr: "La théorie n'est pas un ensemble de règles ; c'est la géométrie du son. La touche est la grille où se manifeste cette géométrie."
    },
    westernTheory: {
      musicGrammar: {
        en: 'The Major 3rd (four semitones) defines Major chords. It is the interval of brightness and resolution. A major chord is Root + Major 3rd + Perfect 5th.',
        fr: "La tierce majeure (quatre demi-tons) définit les accords majeurs. C'est l'intervalle de la clarté et de la résolution. Un accord majeur est composé d'une Racine + Tierce Majeure + Quinte Parfaite."
      },
      guitarGrammar: {
        en: 'Due to Standard Tuning (E-A-D-G-B-E), the guitar is tuned in Perfect 4ths EXCEPT between the G and B strings, which is a Major 3rd. This specific "warp" is what allows for ergonomic chord shapes.',
        fr: "En raison de l'accordage standard (Mi-La-Ré-Sol-Si-Mi), la guitare est accordée en quartes parfaites SAUF entre les cordes de Sol et Si, qui forment une tierce majeure. Cette « distorsion » spécifique permet des formes d'accords ergonomiques."
      }
    },
    yin: {
      title: { en: 'The Universal Geometry', fr: 'La Géométrie Universelle' },
      philosophy: {
        en: 'The Major 3rd is brightness, resolution, warmth. You cross the threshold from "noodling" into understanding.',
        fr: "La tierce majeure est luminosité, résolution, chaleur. Vous passez le seuil du simple « griffonnage » à la compréhension."
      },
      quote: {
        text: { en: 'Music is the arithmetic of sounds as optics is the geometry of light.', fr: 'La musique est l\'arithmétique des sons comme l\'optique est la géométrie de la lumière.' },
        author: 'Claude Debussy'
      },
      meditation: {
        prompt: { en: 'Listen to a major chord. Where in your body do you feel its warmth?', fr: 'Écoutez un accord majeur. Où ressentez-vous sa chaleur dans votre corps ?' },
        duration: 30
      },
      concepts: [
        {
          term: { en: 'Major 3rd', fr: 'Tierce Majeure' },
          definition: { en: 'An interval of four semitones. It gives major chords their bright, happy, warm sound.', fr: 'Un intervalle de quatre demi-tons. Il donne aux accords majeurs leur sonorité brillante, joyeuse et chaleureuse.' }
        },
        {
          term: { en: 'Chord', fr: 'Accord' },
          definition: { en: 'Three or more notes played at the same time. The most basic chord (a "triad") is built from a Root + 3rd + 5th.', fr: 'Trois notes ou plus jouées simultanément. L\'accord le plus simple (une « triade ») est construit à partir d\'une Racine + Tierce + Quinte.' }
        },
        {
          term: { en: 'Standard Tuning', fr: 'Accordage Standard' },
          definition: { en: 'The normal tuning of a guitar: E-A-D-G-B-E (low to high). The strings are tuned in Perfect 4ths, except G to B which is a Major 3rd.', fr: 'L\'accordage normal d\'une guitare : Mi-La-Ré-Sol-Si-Mi (du grave à l\'aigu). Les cordes sont accordées en quartes parfaites, sauf de Sol à Si qui est une tierce majeure.' }
        }
      ]
    },
    yang: {
      title: { en: 'Notes → Chords → Songs', fr: 'Notes → Accords → Chansons' },
      instruction: {
        en: 'Build your first Major chord from individual intervals.',
        fr: 'Construisez votre premier accord majeur à partir d\'intervalles individuels.'
      },
      exercises: [
        {
          name: { en: 'Build a Major Chord by Ear', fr: 'Construire un Accord Majeur à l\'Oreille' },
          steps: [
            { en: 'Play Root', fr: 'Jouez la note Racine' },
            { en: 'Play Major 3rd (brightness)', fr: 'Jouez la tierce majeure (luminosité)' },
            { en: 'Play Perfect 5th (power)', fr: 'Jouez la quinte parfaite (puissance)' },
            { en: 'Strum together', fr: 'Grattez le tout ensemble' }
          ]
        }
      ],
      fretboardFocus: { startFret: 0, endFret: 5, strings: [1, 2, 3, 4, 5, 6], pattern: 'major-chord-tones' }
    }
  },
  {
    id: 6, fret: 6, note: 'F', interval: { en: 'Perfect 4th', fr: 'Quarte Parfaite' },
    heroStage: { en: 'Approach to the Inmost Cave', fr: 'L\'Approche de la Caverne la plus Profonde' },
    title: { en: 'The Approach', fr: 'L\'Approche' },
    subtitle: { en: 'See patterns on the fretboard', fr: 'Visualisez les schémas sur la touche' },
    act: { en: 'Part 2: Learning the Language', fr: 'Partie 2 : Apprendre la Langue' },
    icon: '⚔️', color: '#5f27cd', pillar: { en: 'Music Theory & SHEARL', fr: 'Théorie Musicale & SHEARL' },
    coreMessage: {
      en: 'See how music shows up on the guitar. The SHEARL protocol: See it, Hear it, Feel it.',
      fr: "Voyez comment la musique s'inscrit sur la guitare. Le protocole SHEARL : Voir, Entendre, Ressentir."
    },
    westernTheory: {
      musicGrammar: {
        en: 'The Perfect 4th (five semitones) is a highly stable, "open" interval. In classical counterpoint, it was often considered a dissonance requiring resolution, but in modern music it is the basis of quartal harmony.',
        fr: "La quarte parfaite (cinq demi-tons) est un intervalle « ouvert » et très stable. Dans le contrepoint classique, elle était souvent considérée comme une dissonance nécessitant une résolution, mais dans la musique moderne, elle est la base de l'harmonie quartale."
      },
      guitarGrammar: {
        en: 'The guitar is fundamentally a quartal instrument (tuned in fourths). Moving vertically (across strings) up the neck by one string at the same fret yields a Perfect 4th (except the G-to-B string warp).',
        fr: "La guitare est fondamentalement un instrument quartal (accordé en quartes). Monter verticalement (à travers les cordes) d'une corde sur la même frette produit une quarte parfaite (sauf pour la transition Sol-Si)."
      }
    },
    yin: {
      title: { en: 'The SHEARL Protocol', fr: 'Le Protocole SHEARL' },
      philosophy: {
        en: 'The Perfect 4th is the foundation of power chords and the backbone of rock. Here you face the Tests — the fretboard seems impossibly complex.',
        fr: "La quarte parfaite est le fondement des power chords et l'épine dorsale du rock. Ici, vous affrontez les Épreuves — la touche semble d'une complexité impossible."
      },
      quote: {
        text: { en: 'Simplicity is the ultimate sophistication.', fr: 'La simplicité est la sophistication suprême.' },
        author: 'Leonardo da Vinci'
      },
      meditation: {
        prompt: { en: 'Look at the fretboard. Try to see shapes. Patterns.', fr: 'Regardez la touche. Essayez de voir des formes. Des schémas.' },
        duration: 30
      },
      concepts: [
        {
          term: { en: '©SHEARL', fr: '©SHEARL' },
          definition: { en: 'See, Hear, Feel. A 3-step protocol: first SEE the pattern on the fretboard, then HEAR it in your mind, then FEEL it in your fingers. Study before you play.', fr: 'Voir, Entendre, Ressentir. Un protocole en 3 étapes : d\'abord VOIR le schéma sur la touche, puis l\'ENTENDRE dans votre esprit, enfin le RESSENTIR dans vos doigts. Étudiez avant de jouer.' }
        },
        {
          term: { en: 'CAGED System', fr: 'Système CAGED' },
          definition: { en: 'Five basic chord shapes (C, A, G, E, D) that repeat up and down the entire neck. Once you see them, the fretboard stops being random.', fr: 'Cinq formes d\'accords de base (Do, La, Sol, Mi, Ré) qui se répètent tout le long du manche. Une fois que vous les voyez, la touche cesse d\'être aléatoire.' }
        },
        {
          term: { en: 'Perfect 4th', fr: 'Quarte Parfaite' },
          definition: { en: 'Five semitones. The tuning interval between most guitar strings. It is the backbone of the guitar\'s geometry.', fr: 'Cinq demi-tons. L\'intervalle d\'accordage entre la plupart des cordes de guitare. C\'est l\'épine dorsale de la géométrie de la guitare.' }
        }
      ]
    },
    yang: {
      title: { en: 'The CAGED System', fr: 'Le Système CAGED' },
      instruction: {
        en: 'The fretboard is built on five repeating chord shapes: C, A, G, E, D.',
        fr: 'Le manche est construit sur cinq formes d\'accords répétitives : C, A, G, E, D.'
      },
      exercises: [
        {
          name: { en: 'The Five Neighborhoods', fr: 'Les Cinq Quartiers' },
          steps: [
            { en: 'Play open C', fr: 'Jouez l\'accord de Do à vide' },
            { en: 'Barre up 2 frets', fr: 'Faites un barré 2 frettes plus haut' },
            { en: 'Play A, G, E, D shapes', fr: 'Jouez les formes de La, Sol, Mi, Ré' }
          ]
        }
      ],
      fretboardFocus: { startFret: 0, endFret: 7, strings: [1, 2, 3, 4, 5, 6], pattern: 'caged-c-shape' }
    }
  },
  {
    id: 7, fret: 7, note: 'F♯/G♭', interval: { en: 'Tritone', fr: 'Triton' },
    heroStage: { en: 'The Ordeal', fr: 'L\'Épreuve Suprême' },
    title: { en: 'The Ordeal', fr: 'L\'Épreuve' },
    subtitle: { en: 'Train your ear to hear before you play', fr: 'Entraînez votre oreille à entendre avant de jouer' },
    act: { en: 'Part 2: Learning the Language', fr: 'Partie 2 : Apprendre la Langue' },
    icon: '🕳️', color: '#8854d0', pillar: { en: 'Ear Training & PLING!', fr: 'Entraînement de l\'Oreille & PLING!' },
    coreMessage: {
      en: 'The Third Ear and musical imagination. If you cannot sing it, you cannot play it.',
      fr: "La Troisième Oreille et l'imagination musicale. Si vous ne pouvez pas le chanter, vous ne pouvez pas le jouer."
    },
    westernTheory: {
      musicGrammar: {
        en: 'The Tritone (six semitones) exactly splits the octave in half. Often called the "Devil in Music" historically, its extreme dissonance is the engine that drives Dominant 7th chords to resolve back home.',
        fr: "Le triton (six demi-tons) divise exactement l'octave en deux. Historiquement appelé le « Diable dans la Musique », sa dissonance extrême est le moteur qui pousse les accords de 7ème de dominante à se résoudre vers la tonique."
      },
      guitarGrammar: {
        en: 'Because it splits the octave, the tritone shape is highly symmetrical on the fretboard. It is easily identifiable as a diagonal spanning adjacent strings.',
        fr: "Parce qu'il divise l'octave, la forme du triton est hautement symétrique sur la touche. Il est facilement identifiable comme une diagonale enjambant deux cordes adjacentes."
      }
    },
    yin: {
      title: { en: 'The Third Ear', fr: 'La Troisième Oreille' },
      philosophy: {
        en: 'The Tritone is the exact midpoint of the octave. Maximum tension. Maximum dissonance. This is the Inmost Cave.',
        fr: "Le triton est le point médian exact de l'octave. Tension maximale. Dissonance maximale. C'est la Caverne la plus Profonde."
      },
      quote: {
        text: { en: 'Music is the space between the notes.', fr: 'La musique est l\'espace entre les notes.' },
        author: 'Claude Debussy'
      },
      meditation: {
        prompt: { en: 'Hum a note. Try to hear the note one step higher in your mind.', fr: 'Fredonnez une note. Essayez d\'entendre la note un ton plus haut dans votre esprit.' },
        duration: 45
      },
      concepts: [
        {
          term: { en: 'Tritone', fr: 'Triton' },
          definition: { en: 'An interval of six semitones — exactly half an octave. It was historically called the "Devil in Music" because of its extreme tension.', fr: 'Un intervalle de six demi-tons — exactement la moitié d\'une octave. Appelé historiquement le « Diable dans la Musique » en raison de son extrême tension.' }
        },
        {
          term: { en: 'Audiation', fr: 'Audiation' },
          definition: { en: 'Hearing music in your mind without any external sound. Like reading a sentence silently in your head, but with pitch and rhythm.', fr: 'Entendre de la musique dans votre esprit sans aucun son externe. Comme lire une phrase silencieusement dans votre tête, mais avec de la hauteur et du rythme.' }
        },
        {
          term: { en: 'Third Ear', fr: 'Troisième Oreille' },
          definition: { en: 'Your ability to hear notes in your imagination. The goal is to hear a note before you play it — not after.', fr: 'Votre capacité à entendre les notes dans votre imagination. Le but est d\'entendre une note avant de la jouer — pas après.' }
        }
      ]
    },
    yang: {
      title: { en: 'The PLING! Protocol', fr: 'Le Protocole PLING!' },
      instruction: {
        en: 'Sing it, then play it. Play what you sing, sing what you play.',
        fr: 'Chantez-le, puis jouez-le. Jouez ce que vous chantez, chantez ce que vous jouez.'
      },
      exercises: [
        {
          name: { en: 'Play What You Sing', fr: 'Jouer ce que l\'on Chante' },
          steps: [
            { en: 'Hum a note', fr: 'Fredonnez une note' },
            { en: 'Find it on the guitar', fr: 'Trouvez-la sur la guitare' },
            { en: 'Eliminate beating', fr: 'Éliminez les battements' }
          ]
        }
      ],
      fretboardFocus: { startFret: 0, endFret: 7, strings: [1, 2, 3, 4, 5, 6], pattern: 'tritone' }
    }
  },
  {
    id: 8, fret: 8, note: 'G', interval: { en: 'Perfect 5th', fr: 'Quinte Parfaite' },
    heroStage: { en: 'The Reward', fr: 'La Récompense' },
    title: { en: 'The Reward', fr: 'La Récompense' },
    subtitle: { en: 'Play with confidence, not force', fr: 'Jouez avec confiance, pas avec force' },
    act: { en: 'Part 2: Learning the Language', fr: 'Partie 2 : Apprendre la Langue' },
    icon: '🔥', color: '#e74c3c', pillar: { en: 'Technique', fr: 'Technique' },
    coreMessage: {
      en: 'Overcoming the fear of a wrong note. The friction of the True Move.',
      fr: "Surmonter la peur d'une fausse note. La friction du Geste Vrai."
    },
    westernTheory: {
      musicGrammar: {
        en: 'The Perfect 5th (seven semitones) is the most consonant interval after the octave. It is structurally integral, forming the power chord and anchoring the overtone series.',
        fr: "La quinte parfaite (sept demi-tons) est l'intervalle le plus consonant après l'octave. Elle est structurellement essentielle, formant le power chord et ancrant la série des harmoniques."
      },
      guitarGrammar: {
        en: 'On the lower strings, the Perfect 5th is the classic "Power Chord" shape (Root + two frets up on the next string). This shape is a physical anchor for modern guitar playing.',
        fr: "Sur les cordes graves, la quinte parfaite est la forme classique du « Power Chord » (Racine + deux frettes plus haut sur la corde suivante). Cette forme est une ancre physique pour le jeu de guitare moderne."
      }
    },
    yin: {
      title: { en: 'The Art of the True Move', fr: 'L\'Art du Geste Vrai' },
      philosophy: {
        en: 'The Perfect 5th is resolution, power, clarity. The Supreme Ordeal is confronting your fear of mistakes.\n\nThe storm does not break because you are ready. It breaks because it must. Every power chord ever played was born from the collision of fear and will — the moment the guitarist stops asking permission and takes the stage inside their own body. The Perfect 5th is not merely an interval; it is a declaration. Resolution is not the absence of tension; it is the decision to stand inside it and transform it into sound.',
        fr: "La quinte parfaite est résolution, puissance, clarté. L'épreuve suprême consiste à affronter votre peur de l'erreur.\n\nL'orage n'éclate pas parce que vous êtes prêt. Il éclate parce qu'il le faut. Chaque power chord jamais joué est né de la collision entre la peur et la volonté — le moment où le guitariste cesse de demander la permission et prend possession de la scène à l'intérieur de son propre corps. La quinte parfaite n'est pas simplement un intervalle ; c'est une déclaration. La résolution n'est pas l'absence de tension ; c'est la décision de se tenir au milieu d'elle et de la transformer en son."
      },
      quote: {
        text: { en: 'The master has failed more times than the beginner has tried.', fr: 'Le maître a échoué plus de fois que le débutant n\'a essayé.' },
        author: 'Stephen McCranie'
      },
      meditation: {
        prompt: { en: 'Recall your worst musical mistake. Realize it taught you.', fr: 'Rappelez-vous de votre pire erreur musicale. Réalisez qu\'elle vous a instruit.' },
        duration: 45
      },
      concepts: [
        {
          term: { en: 'Perfect 5th', fr: 'Quinte Parfaite' },
          definition: { en: 'Seven semitones. The most powerful and stable interval after the octave. The basis of the "power chord" used in rock and metal.', fr: 'Sept demi-tons. L\'intervalle le plus puissant et stable après l\'octave. La base du « power chord » utilisé dans le rock et le métal.' }
        },
        {
          term: { en: 'Power Chord', fr: 'Power Chord' },
          definition: { en: 'A two-note chord: Root + Perfect 5th. Simple, strong, and the foundation of most rock guitar.', fr: 'Un accord à deux notes : Racine + Quinte Parfaite. Simple, puissant, et la fondation de la plupart des musiques rock.' }
        },
        {
          term: { en: 'Resolution', fr: 'Résolution' },
          definition: { en: 'When a tense, dissonant sound moves to a stable, consonant sound. Like the feeling of arriving home after a journey.', fr: 'Lorsqu\'un son tendu et dissonant évolue vers un son stable et consonant. Comme le sentiment de rentrer chez soi après un long voyage.' }
        }
      ]
    },
    yang: {
      title: { en: 'Tension and Resolution', fr: 'Tension et Résolution' },
      instruction: {
        en: 'Play a dissonant interval. Hold it. Feel the tension. Now resolve it.',
        fr: 'Jouez un intervalle dissonant. Maintenez-le. Ressentez la tension. Maintenant, résolvez-le.'
      },
      exercises: [
        {
          name: { en: 'The Power Chord Ladder', fr: 'L\'Échelle de Power Chords' },
          steps: [
            { en: 'Play E5 power chord', fr: 'Jouez le power chord E5' },
            { en: 'Slide up 1 fret at a time', fr: 'Glissez d\'une frette à la fois vers le haut' },
            { en: 'Breathe at each fret', fr: 'Respirez à chaque frette' }
          ]
        },
        {
          name: { en: 'The Resolution Breath', fr: 'La Respiration de Résolution' },
          steps: [
            { en: 'Play a Tritone (dissonant)', fr: 'Jouez un triton (dissonant)' },
            { en: 'Hold it for 4 slow breaths', fr: 'Maintenez-le pendant 4 respirations lentes' },
            { en: 'Resolve to the Perfect 5th', fr: 'Résolvez vers la quinte parfaite' },
            { en: 'Feel the tension dissolve', fr: 'Ressentez la tension se dissoudre' }
          ]
        }
      ],
      fretboardFocus: { startFret: 0, endFret: 8, strings: [1, 2, 3, 4, 5, 6], pattern: 'power-chord' }
    }
  },
  {
    id: 9, fret: 9, note: 'G♯/A♭', interval: { en: 'Minor 6th', fr: 'Sixte Mineure' },
    heroStage: { en: 'The Road Back', fr: 'Le Chemin du Retour' },
    title: { en: 'The Road Back', fr: 'Le Chemin du Retour' },
    subtitle: { en: 'Play with the least effort possible', fr: 'Jouez avec le moins d\'effort possible' },
    act: { en: 'Part 3: Playing Free', fr: 'Partie 3 : Jouer Libre' },
    icon: '⚡', color: '#2ecc71', pillar: { en: 'Technique & Creativity', fr: 'Technique & Créativité' },
    coreMessage: {
      en: 'Somatize the music. Be effortlessness and emotional honesty.',
      fr: "Somatisez la musique. Incarnez la fluidité sans effort et l'honnêteté émotionnelle."
    },
    westernTheory: {
      musicGrammar: {
        en: 'The Minor 6th (eight semitones) is an inversion of the Major 3rd. It has a beautiful, searching quality used frequently in romantic classical themes and cinematic scores.',
        fr: "La sixte mineure (huit demi-tons) est le renversement de la tierce majeure. Elle possède une qualité de recherche expressive, fréquemment utilisée dans les thèmes romantiques classiques et les musiques de film."
      },
      guitarGrammar: {
        en: 'Interval inversions mean you can find a Minor 6th by either going up 8 frets, or going down a Major 3rd (4 frets) and jumping up an octave. The guitar allows spatial manipulation of these intervals.',
        fr: "Les renversements d'intervalles signifient que vous pouvez trouver une sixte mineure soit en montant de 8 frettes, soit en descendant d'une tierce majeure (4 frettes) et en montant d'une octave. La guitare permet cette manipulation spatiale."
      }
    },
    yin: {
      title: { en: 'Effortless Mastery', fr: 'La Maîtrise Sans Effort' },
      philosophy: {
        en: 'The Minor 6th is bittersweet beauty. This is not about playing harder or faster. It is about playing with the absolute minimum necessary force.\n\nEffortlessness is not the absence of effort — it is the disappearance of struggle. The master does not try less; she has refined her trying into something invisible, like a swan gliding while its legs work furiously beneath the surface. Your fingers already know the way. Your breath already knows the rhythm. The only thing left to remove is your doubt.',
        fr: "La sixte mineure est une beauté douce-amère. Il ne s'agit pas de jouer plus fort ou plus vite. Il s'agit de jouer avec le minimum absolu de force nécessaire.\n\nL'absence d'effort n'est pas l'absence d'effort — c'est la disparition de la lutte. Le maître n'essaie pas moins ; il a affiné son effort en quelque chose d'invisible, comme un cygne qui glisse pendant que ses pattes s'activent furieusement sous la surface. Vos doigts connaissent déjà le chemin. Votre souffle connaît déjà le rythme. La seule chose qu'il reste à enlever est votre doute."
      },
      quote: {
        text: { en: 'Mastery is not about adding, but about removing.', fr: 'La maîtrise ne consiste pas à ajouter, mais à enlever.' },
        author: 'Kenny Werner'
      },
      meditation: {
        prompt: { en: 'Play a chord. Use half the pressure. Find the threshold.', fr: 'Jouez un accord. Utilisez la moitié de la pression. Trouvez le seuil.' },
        duration: 30
      },
      concepts: [
        {
          term: { en: 'Kinesthesis', fr: 'Kinesthésie' },
          definition: { en: 'The sense of how your body is positioned and moving. On the guitar, it means feeling the fretboard without looking.', fr: 'Le sens de la position et du mouvement de votre corps. Sur la guitare, cela signifie ressentir la touche sans regarder.' }
        },
        {
          term: { en: 'Minimum Force', fr: 'Force Minimale' },
          definition: { en: 'Using only as much finger pressure as needed to make a clean note. More pressure = more tension = worse sound.', fr: 'N\'utiliser que la pression de doigt minimale requise pour obtenir une note propre. Plus de pression = plus de tension = moins bon son.' }
        }
      ]
    },
    yang: {
      title: { en: 'The Microscopic Dance', fr: 'La Danse Microscopique' },
      instruction: {
        en: 'Minimum force, maximum clarity. This is proper kinesthesis.',
        fr: 'Force minimale, clarté maximale. C\'est la véritable kinesthésie.'
      },
      exercises: [
        {
          name: { en: 'The Pressure Threshold', fr: 'Le Seuil de Pression' },
          steps: [
            { en: 'Fret note hard', fr: 'Frettez fortement la note' },
            { en: 'Release until buzzing', fr: 'Relâchez jusqu\'au grésillement' },
            { en: 'Add tiny amount of pressure', fr: 'Ajoutez une quantité infime de pression' }
          ]
        },
        {
          name: { en: 'The Weightless Note', fr: 'La Note Sans Poids' },
          steps: [
            { en: 'Fret any note with full pressure', fr: 'Frettez n\'importe quelle note avec pleine pression' },
            { en: 'Release slowly until it buzzes', fr: 'Relâchez lentement jusqu\'au grésillement' },
            { en: 'Add back the smallest amount', fr: 'Ajoutez la quantité minimale' },
            { en: 'Play 10 notes at this threshold', fr: 'Jouez 10 notes à ce seuil' }
          ]
        }
      ],
      fretboardFocus: { startFret: 0, endFret: 9, strings: [1, 2, 3, 4, 5, 6], pattern: 'economy-picking' }
    }
  },
  {
    id: 10, fret: 10, note: 'A', interval: { en: 'Major 6th', fr: 'Sixte Majeure' },
    heroStage: { en: 'The Resurrection', fr: 'La Résurrection' },
    title: { en: 'The Resurrection', fr: 'La Résurrection' },
    subtitle: { en: 'Play with feeling and intention', fr: 'Jouez avec sensibilité et intention' },
    act: { en: 'Part 3: Playing Free', fr: 'Partie 3 : Jouer Libre' },
    icon: '🛤️', color: '#f39c12', pillar: { en: 'Performing', fr: 'Performance Scénique' },
    coreMessage: {
      en: 'Conditioning the performance. What is the story? Who is your audience?',
      fr: "Conditionner la performance. Quelle est l'histoire ? Qui est votre public ?"
    },
    westernTheory: {
      musicGrammar: {
        en: 'The Major 6th (nine semitones) provides a feeling of wistful longing or expansive openness. It is famously the opening interval of the "NBC Chimes" or "My Bonnie Lies Over the Ocean".',
        fr: "La sixte majeure (neuf demi-tons) procure un sentiment de nostalgie ou d'ouverture expansive. C'est le célèbre intervalle d'ouverture des carillons de la NBC ou de « My Bonnie Lies Over the Ocean »."
      },
      guitarGrammar: {
        en: 'Major 6th chords (Root, 3rd, 5th, 6th) are staples in jazz, swing, and country guitar. They function as stable "home" chords but with added color compared to a plain major triad.',
        fr: "Les accords de sixte majeure (Racine, Tierce, Quinte, Sixte) sont des incontournables de la guitare jazz, swing et country. Ils font office d'accords stables mais avec une couleur supplémentaire par rapport à la triade majeure simple."
      }
    },
    yin: {
      title: { en: 'The Story Behind the Sound', fr: 'L\'Histoire Derrière le Son' },
      philosophy: {
        en: 'The Major 6th evokes nostalgia. Music without story is just organized noise. Every performance needs emotional intention.\n\nNostalgia is not weakness — it is the evidence that you have lived. The Major 6th carries the weight of memory: a room, a face, a moment you thought you had forgotten. When you play with that memory in your hands, the notes become messengers. The audience does not hear your technique; they feel your history. This is the resurrection: not raising the dead, but raising what is true.',
        fr: "La sixte majeure évoque la nostalgie. La musique sans histoire n'est que du bruit organisé. Chaque performance a besoin d'une intention émotionnelle.\n\nLa nostalgie n'est pas une faiblesse — c'est la preuve que vous avez vécu. La sixte majeure porte le poids de la mémoire : une pièce, un visage, un moment que vous pensiez avoir oublié. Quand vous jouez avec ce souvenir dans les mains, les notes deviennent des messagères. Le public n'entend pas votre technique ; il ressent votre histoire. C'est la résurrection : non pas ressusciter les morts, mais ressusciter ce qui est vrai."
      },
      quote: {
        text: { en: 'Where words fail, music speaks.', fr: 'Là où les mots échouent, la musique parle.' },
        author: 'Hans Christian Andersen'
      },
      meditation: {
        prompt: { en: 'Play a melody for someone you love.', fr: 'Jouez une mélodie pour quelqu\'un que vous aimez.' },
        duration: 45
      },
      concepts: [
        {
          term: { en: 'Emotional Intention', fr: 'Intention Émotionnelle' },
          definition: { en: 'Choosing a feeling before you play — sadness, joy, longing — and letting it shape your touch, tempo, and dynamics.', fr: 'Choisir un sentiment avant de jouer — tristesse, joie, nostalgie — et le laisser façonner votre toucher, votre tempo et vos nuances.' }
        },
        {
          term: { en: 'Dynamics', fr: 'Nuances (Dynamique)' },
          definition: { en: 'How loud or quiet you play. Playing softly (piano) vs. loudly (forte) changes the emotional impact of the same notes.', fr: 'Le volume sonore de votre jeu. Jouer doucement (piano) vs. fort (forte) modifie l\'impact émotionnel des mêmes notes.' }
        }
      ]
    },
    yang: {
      title: { en: 'Emotional Conditioning', fr: 'Conditionnement Émotionnel' },
      instruction: {
        en: 'Same notes — different story. This is the performing pillar in action.',
        fr: 'Mêmes notes — histoire différente. C\'est le pilier de la performance en action.'
      },
      exercises: [
        {
          name: { en: 'The Dedication', fr: 'La Dédicace' },
          steps: [
            { en: 'Pick a person', fr: 'Choisissez une personne' },
            { en: 'Dedicate melody to them', fr: 'Dédiez-leur une mélodie' },
            { en: 'Notice touch/tempo changes', fr: 'Observez les changements de toucher/tempo' }
          ]
        },
        {
          name: { en: 'The Three Faces', fr: 'Les Trois Visages' },
          steps: [
            { en: 'Choose 3 emotions: grief, anger, joy', fr: 'Choisissez 3 émotions : chagrin, colère, joie' },
            { en: 'Play the same 4 notes for each', fr: 'Jouez les mêmes 4 notes pour chacune' },
            { en: 'Change only touch and tempo', fr: 'Changez seulement le toucher et le tempo' },
            { en: 'Record and listen back', fr: 'Enregistrez et écoutez' }
          ]
        }
      ],
      fretboardFocus: { startFret: 0, endFret: 10, strings: [1, 2, 3, 4, 5, 6], pattern: 'chord-progression' }
    }
  },
  {
    id: 11, fret: 11, note: 'A♯/B♭', interval: { en: 'Minor 7th', fr: 'Septième Mineure' },
    heroStage: { en: 'Return with the Elixir', fr: 'Le Retour avec l\'Élixir' },
    title: { en: 'The Elixir', fr: 'L\'Élixir' },
    subtitle: { en: 'Perform for others without fear', fr: 'Jouez pour les autres sans crainte' },
    act: { en: 'Part 3: Playing Free', fr: 'Partie 3 : Jouer Libre' },
    icon: '🪞', color: '#e056a0', pillar: { en: 'Performing & Conditioning', fr: 'Performance & Préparation' },
    coreMessage: {
      en: 'Delivery and unshakable confidence. Performance anxiety is the final boss.',
      fr: "Interprétation et confiance inébranlable. Le trac est le boss final."
    },
    westernTheory: {
      musicGrammar: {
        en: 'The Minor 7th (ten semitones) is the crucial ingredient in Dominant 7th chords. It creates the bluesy "pull" that demands to resolve back to the root.',
        fr: "La septième mineure (dix demi-tons) est l'ingrédient crucial des accords de 7ème de dominante. Elle crée l'attraction bluesy qui exige de se résoudre vers la tonique."
      },
      guitarGrammar: {
        en: 'Visually, a Minor 7th is a whole step (2 frets) DOWN from the octave. This makes it incredibly easy to locate on the fretboard simply by finding the octave root and stepping back.',
        fr: "Visuellement, une septième mineure se situe un ton (2 frettes) en DESSOUS de l'octave. Cela la rend extrêmement facile à localiser en trouvant simplement l'octave et en reculant."
      }
    },
    yin: {
      title: { en: 'The Social Forge', fr: 'La Forge Sociale' },
      philosophy: {
        en: 'The Minor 7th is the penultimate tension. The audience is not your enemy — it is a mirror reflecting your emotional truth.\n\nThe mirror does not lie, but it also does not judge. When you step before an audience, you are not facing a wall of eyes — you are facing a thousand versions of yourself, each one hoping you will be honest. The Minor 7th is the final tension because it is the threshold between hiding and revealing. Cross it, and you stop performing. You start being.',
        fr: "La septième mineure est l'avant-dernière tension. Le public n'est pas votre ennemi — c'est un miroir reflétant votre vérité émotionnelle.\n\nLe miroir ne ment pas, mais il ne juge pas non plus. Quand vous vous tenez devant un public, vous ne faites pas face à un mur de regards — vous faites face à mille versions de vous-même, chacune espérant que vous serez honnête. La septième mineure est la tension finale parce qu'elle est le seuil entre se cacher et se révéler. Franchissez-le, et vous cessez de jouer. Vous commencez à être."
      },
      quote: {
        text: { en: 'Stage fright is the ego\'s last stand.', fr: 'Le trac est le dernier baroud d\'honneur de l\'ego.' },
        author: 'Bertrand Laurence'
      },
      meditation: {
        prompt: { en: 'Imagine an audience. Feel the fear. Give them permission to feel.', fr: 'Imaginez un public. Ressentez la peur. Donnez-leur la permission de ressentir.' },
        duration: 60
      },
      concepts: [
        {
          term: { en: 'Stage Fright', fr: 'Le Trac' },
          definition: { en: 'The fear and anxiety of performing in front of others. It is not a sign of weakness — it is the ego protecting itself. You overcome it with practice, not willpower.', fr: 'La peur et l\'anxiété de se produire devant les autres. Ce n\'est pas un signe de faiblesse — c\'est l\'ego qui se protège. On le surmonte par la pratique, pas par la volonté.' }
        },
        {
          term: { en: 'Dominant 7th', fr: '7ème de Dominante' },
          definition: { en: 'A chord built from Root + Major 3rd + Perfect 5th + Minor 7th. It creates strong tension that pulls the ear back "home" to the root chord.', fr: 'Un accord construit à partir de Racine + Tierce Majeure + Quinte Parfaite + Septième Mineure. Il crée une tension forte qui ramène l\'oreille à la Racine.' }
        }
      ]
    },
    yang: {
      title: { en: 'Performing Under Fire', fr: 'Jouer Sous le Feu' },
      instruction: {
        en: 'Maintain your flow despite the chaos. Performance anxiety is the final dragon.',
        fr: 'Maintenez votre flow malgré le chaos. Le trac est le dragon final.'
      },
      exercises: [
        {
          name: { en: 'The Distraction Protocol', fr: 'Le Protocole de Distraction' },
          steps: [
            { en: 'Play from your inner ear', fr: 'Jouez depuis votre oreille interne' },
            { en: 'Turn on TV midway', fr: 'Allumez la télévision au milieu du jeu' },
            { en: 'Do not stop playing', fr: 'Ne vous arrêtez sous aucun prétexte' }
          ]
        },
        {
          name: { en: 'The Unstoppable Song', fr: 'La Chanson Inarrêtable' },
          steps: [
            { en: 'Choose one song, 2 minutes', fr: 'Choisissez une chanson, 2 minutes' },
            { en: 'Play without stopping', fr: 'Jouez sans vous arrêter' },
            { en: 'If you make a mistake, breathe and continue', fr: 'Si vous faites une erreur, respirez et continuez' },
            { en: 'Bow at the end', fr: 'Saluez à la fin' }
          ]
        }
      ],
      fretboardFocus: { startFret: 0, endFret: 11, strings: [1, 2, 3, 4, 5, 6], pattern: 'full-scale' }
    }
  },
  {
    id: 12, fret: 12, note: 'B', interval: { en: 'Major 7th / Octave', fr: 'Septième Majeure / Octave' },
    heroStage: { en: 'Master of Two Worlds', fr: 'Maître des Deux Mondes' },
    title: { en: 'The Master', fr: 'Le Maître' },
    subtitle: { en: 'Let the music play through you', fr: 'Laissez la musique jouer à travers vous' },
    act: { en: 'Part 3: Playing Free', fr: 'Partie 3 : Jouer Libre' },
    icon: '♾️', color: '#00d2d3', pillar: { en: 'All Five Pillars United', fr: 'Les Cinq Piliers Réunis et Unis' },
    coreMessage: {
      en: 'Surrender humbly to be "played" by the guitar. Welcome to the Flow State.',
      fr: "Abandonnez-vous humblement pour être « joué » par la guitare. Bienvenue dans l'État de Flow."
    },
    westernTheory: {
      musicGrammar: {
        en: 'The Major 7th (eleven semitones) is severe dissonance pulling heavily to the octave. Once the Octave (12 semitones) is reached, the cycle is complete. The frequency is doubled, and a new world begins.',
        fr: "La septième majeure (onze demi-tons) est une dissonance sévère qui attire fortement vers l'octave. Une fois l'octave (12 demi-tons) atteinte, le cycle est complet. La fréquence est doublée, et un nouveau monde commence."
      },
      guitarGrammar: {
        en: 'Fret 12 on the guitar is the physical midpoint of the string. Every note and shape that existed between Fret 0 and Fret 11 perfectly repeats itself from Fret 12 onwards.',
        fr: "La frette 12 de la guitare est le milieu physique de la corde. Chaque note et chaque forme qui existait entre les frettes 0 et 11 se répète parfaitement à partir de la frette 12."
      }
    },
    yin: {
      title: { en: 'Metaphysical Surrender', fr: 'L\'Abandon Métaphysique' },
      philosophy: {
        en: 'The Octave is the same note you started with — but vibrating at twice the frequency. You no longer play the guitar; the guitar plays through you.\n\nThe octave is the spiral, not the circle. You return to the root, but the root has grown. What was once a single note is now a universe — twelve frets of experience, twelve stages of becoming. The guitar does not play through you because you have mastered it. It plays through you because you have finally stopped trying to control the music and started serving it.',
        fr: "L'octave est la même note que celle par laquelle vous avez commencé — mais vibrant à une fréquence double. Vous ne jouez plus de la guitare ; la guitare joue à travers vous.\n\nL'octave est la spirale, non pas le cercle. Vous revenez à la racine, mais la racine a grandi. Ce qui n'était qu'une note unique est désormais un univers — douze frettes d'expérience, douze étapes de devenir. La guitare ne joue pas à travers vous parce que vous l'avez maîtrisée. Elle joue à travers vous parce que vous avez finalement cessé d'essayer de contrôler la musique et avez commencé à la servir."
      },
      quote: {
        text: { en: 'It does not shoot; It shoots.', fr: 'Ça ne tire pas ; Ça tire.' },
        author: 'Eugen Herrigel'
      },
      meditation: {
        prompt: { en: 'Feel how far you have come. Pick up the guitar and just play.', fr: 'Ressentez le chemin parcouru. Prenez la guitare et jouez, tout simplement.' },
        duration: 90
      },
      concepts: [
        {
          term: { en: 'Octave', fr: 'Octave' },
          definition: { en: 'The interval of 12 semitones. The same note name, but at double the frequency. On the guitar, fret 12 is always the octave of the open string.', fr: 'L\'intervalle de 12 demi-tons. Le même nom de note, mais à une fréquence double. Sur la guitare, la frette 12 est toujours l\'octave de la corde à vide.' }
        },
        {
          term: { en: 'Flow State', fr: 'État de Flow' },
          definition: { en: 'A state of total absorption where action and awareness merge. You stop thinking about what to play and just play. This is the goal of all the practice.', fr: 'Un état d\'absorption totale où l\'action et la conscience fusionnent. Vous arrêtez de penser à quoi jouer et jouez, tout simplement. C\'est le but de toute pratique.' }
        }
      ]
    },
    yang: {
      title: { en: 'The Elixir — Free Play', fr: 'L\'Élixir — Le Jeu Libre' },
      instruction: {
        en: 'No exercises. No rules. No fretboard map. Just you, the guitar, and the sound.',
        fr: 'Aucun exercice. Aucune règle. Aucune carte de touche. Juste vous, la guitare et le son.'
      },
      exercises: [
        {
          name: { en: 'The Infinite Loop', fr: 'La Boucle Infinie' },
          steps: [
            { en: 'Set a timer for 5 minutes', fr: 'Réglez un minuteur pour 5 minutes' },
            { en: 'Play without scales or chords', fr: 'Jouez sans gammes ni accords' },
            { en: 'Let your fingers lead', fr: 'Laissez vos doigts guider' },
            { en: 'When the timer ends, play one more note', fr: 'Quand le minuteur sonne, jouez une note de plus' }
          ]
        }
      ],
      fretboardFocus: { startFret: 0, endFret: 12, strings: [1, 2, 3, 4, 5, 6], pattern: 'full-chromatic' }
    }
  }
];

export default frets;
export { frets };
