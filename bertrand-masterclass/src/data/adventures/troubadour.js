// Adventure I — The Troubadour of Occitania
// Eleanor of Aquitaine's court, Poitiers, 1165 CE
// Mentor: Bernard de Ventadorn

export const TROUBADOUR = {
  id: 'troubadour-occitania',
  title: {
    en: 'The Troubadour of Occitania',
    fr: "Le Troubadour d'Occitanie"
  },
  subtitle: {
    en: "Eleanor of Aquitaine's court · Poitiers · 1165 CE",
    fr: "La cour d'Aliénor d'Aquitaine · Poitiers · 1165 ap. J.-C."
  },
  mentor: 'Bernard de Ventadorn',
  startSceneId: 'arrival',
  premiumRequired: false,
  art: '/assets/adventures/troubadour/banner.png',

  // Fine-tune model id (populated after training)
  modelId: 'voix-vive/bernard-de-ventadorn-v1',

  scenes: {

    // ─────────────────────────────────────────────
    // ACT I — THE ARRIVAL
    // ─────────────────────────────────────────────

    arrival: {
      id: 'arrival',
      act: 1,
      intervalName: {
        en: 'Unison',
        fr: 'Unisson'
      },
      targetNote: 'A4',
      targetFreq: 440,
      pitchLabel: {
        en: 'A · 440 Hz · The tuning note',
        fr: 'La · 440 Hz · La note de référence'
      },
      setting: {
        en: "The gates of Poitiers. Dust on the road. You have walked three weeks to reach Eleanor's court. A guard asks your name and your purpose.",
        fr: "Les portes de Poitiers. De la poussière sur le chemin. Vous avez marché trois semaines pour rejoindre la cour d'Aliénor. Un garde vous demande votre nom et le but de votre voyage."
      },
      art: '/assets/adventures/troubadour/arrival.png',
      atmosphere: 'amber-dusk',
      mentorLine: {
        en: "Before you enter, find your note. Every troubadour must first know where they stand.",
        fr: "Avant d'entrer, trouvez votre note. Chaque troubadour doit d'abord savoir où il se situe."
      },
      coachingCues: {
        onSceneEnter: {
          en: 'The road ends here. The court begins.',
          fr: "La route s'achève ici. La cour commence."
        },
        onPitchPass: {
          en: 'Bernard nods. "That is you. Now do not lose it inside."',
          fr: 'Bernard acquiesce. "C\'est vous. À présent, ne la perdez pas à l\'intérieur."'
        },
        onPitchStruggle: {
          en: 'Bernard waits. "The note is already in you. You are just not listening yet."',
          fr: 'Bernard patiente. "La note est déjà en vous. Vous n\'écoutez pas encore."'
        },
        onSingBonus: {
          en: '"You announced yourself in song. The guard will remember that."',
          fr: '"Vous vous êtes annoncé en chanson. Le garde s\'en souviendra."'
        },
        onBreathFree: {
          en: 'Your shoulders drop. The tension of the road leaves your body.',
          fr: 'Vos épaules se relâchent. La tension de la route quitte votre corps.'
        },
        onBreathHeld: {
          en: 'Bernard touches your arm. "Breathe. You have already arrived."',
          fr: 'Bernard vous touche le bras. "Respirez. Vous êtes déjà arrivé."'
        },
      },
      choices: [
        {
          id: 'arrival-speak',
          label: {
            en: 'State your name and purpose',
            fr: 'Déclarez votre nom et votre but'
          },
          mode: 'speak',
          description: {
            en: 'You speak your name to the guard. He writes it in his ledger.',
            fr: "Vous dites votre nom au garde. Il l'inscrit sur son registre."
          },
          leadsTo: 'great-hall',
          requiresPitchGate: true,
          bonusCondition: null,
          bonusLeadsTo: null,
        },
        {
          id: 'arrival-sing',
          label: {
            en: '★ Sing your name to the guard',
            fr: '★ Chantez votre nom au garde'
          },
          mode: 'sing',
          description: {
            en: 'You sing your introduction — name, origin, purpose — on one note.',
            fr: 'Vous chantez votre présentation — nom, origine, but — sur une seule note.'
          },
          leadsTo: 'great-hall',
          requiresPitchGate: true,
          bonusCondition: { singingScore: 0.5 },
          bonusLeadsTo: 'great-hall-recognized',
        },
      ],
    },

    'great-hall': {
      id: 'great-hall',
      act: 1,
      intervalName: {
        en: 'Major 2nd',
        fr: 'Seconde Majeure'
      },
      targetNote: 'B4',
      targetFreq: 493.88,
      pitchLabel: {
        en: 'B · One step above A · 9:8 ratio',
        fr: 'Si · Un ton au-dessus du La · Rapport 9:8'
      },
      setting: {
        en: "The great hall of Poitiers. Eleanor sits elevated on a carved stone chair. Forty courtiers watch as you approach. A rival troubadour — Peire d'Alvernha — stands to her left, already smiling at your discomfort.",
        fr: "La grande salle de Poitiers. Aliénor siège sur un fauteuil en pierre sculptée. Quarante courtisans vous observent approcher. Un troubadour rival — Peire d'Alvernha — se tient à sa gauche, souriant déjà de votre embarras."
      },
      art: '/assets/adventures/troubadour/great-hall.png',
      atmosphere: 'cool-stone',
      mentorLine: {
        en: "Step one note higher. Just one. That is all the court requires of you right now.",
        fr: "Montez d'une note. Une seule. C'est tout ce que la cour exige de vous à cet instant."
      },
      coachingCues: {
        onSceneEnter: {
          en: 'Eleanor does not look at you yet. That is information.',
          fr: "Aliénor ne vous regarde pas encore. C'est une information."
        },
        onPitchPass: {
          en: '"She looked up," Bernard whispers. "One note was enough."',
          fr: '"Elle a levé les yeux," chuchote Bernard. "Une seule note a suffi."'
        },
        onPitchStruggle: {
          en: '"The court hears everything. Your silence is also a sound."',
          fr: '"La cour entend tout. Votre silence est également un son."'
        },
        onSingBonus: {
          en: '"Peire\'s smile has changed. He did not expect that from you."',
          fr: '"Le sourire de Peire a changé. Il ne s\'attendait pas à cela de votre part."'
        },
        onBreathFree: {
          en: 'The courtiers settle. Your calm has set the room\'s temperature.',
          fr: "Les courtisans s'apaisent. Votre calme a réglé la température de la pièce."
        },
        onBreathHeld: {
          en: 'Peire notices. He will use this later.',
          fr: "Peire le remarque. Il l'utilisera plus tard."
        },
      },
      choices: [
        {
          id: 'hall-bow',
          label: {
            en: 'Bow and wait to be addressed',
            fr: 'Inclinez-vous et attendez d\'être invité à parler'
          },
          mode: 'speak',
          description: {
            en: 'You bow deeply. A safe, correct move. Eleanor nods permission to approach.',
            fr: "Vous vous inclinez profondément. Un geste sûr et correct. Aliénor fait signe d'approcher."
          },
          leadsTo: 'eleanor-question',
          requiresPitchGate: true,
          bonusCondition: null,
          bonusLeadsTo: null,
        },
        {
          id: 'hall-challenge',
          label: {
            en: '★ Meet Peire\'s eyes and sing one note',
            fr: '★ Croisez le regard de Peire et chantez une note'
          },
          mode: 'sing',
          description: {
            en: 'You hold the B. Just one note, directed at Peire. A statement, not an attack.',
            fr: "Vous tenez le Si. Une seule note, dirigée vers Peire. Une déclaration, pas une attaque."
          },
          leadsTo: 'eleanor-question',
          requiresPitchGate: true,
          bonusCondition: { singingScore: 0.6 },
          bonusLeadsTo: 'eleanor-impressed',
        },
      ],
    },

    'great-hall-recognized': {
      id: 'great-hall-recognized',
      act: 1,
      intervalName: {
        en: 'Major 2nd',
        fr: 'Seconde Majeure'
      },
      targetNote: 'B4',
      targetFreq: 493.88,
      pitchLabel: {
        en: 'B · One step above A · 9:8 ratio',
        fr: 'Si · Un ton au-dessus du La · Rapport 9:8'
      },
      setting: {
        en: 'The guard announced your arrival with a description: "A troubadour who sings their own name." Eleanor is already watching the door when you enter.',
        fr: 'Le garde a annoncé votre arrivée par ces mots : "Un troubadour qui chante son propre nom." Aliénor regarde déjà vers la porte quand vous entrez.'
      },
      art: '/assets/adventures/troubadour/great-hall-recognized.png',
      atmosphere: 'warm-gold',
      mentorLine: {
        en: 'She is already listening. Step one note higher — carefully.',
        fr: "Elle écoute déjà. Montez d'un ton — avec soin."
      },
      coachingCues: {
        onSceneEnter: {
          en: 'This is the bonus of your first choice. Eleanor\'s attention is already yours.',
          fr: "C'est la récompense de votre premier choix. L'attention d'Aliénor vous appartient déjà."
        },
        onPitchPass: {
          en: '"Good. You have not wasted what you earned at the gate."',
          fr: '"Bien. Vous n\'avez pas gaspillé ce que vous avez gagné aux portes."'
        },
        onPitchStruggle: {
          en: '"She is patient. But attention is not infinite."',
          fr: '"Elle est patiente. Mais l\'attention n\'est pas infinie."'
        },
        onSingBonus: {
          en: '"Bernard laughs quietly. You are making this look easy."',
          fr: '"Bernard rit doucement. Vous rendez cela presque trop facile."'
        },
        onBreathFree: {
          en: 'Eleanor leans forward slightly.',
          fr: "Aliénor se penche légèrement en avant."
        },
        onBreathHeld: {
          en: 'You tighten. Even the favorable start can be lost.',
          fr: "Vous vous crispez. Même un départ idéal peut être gâché."
        },
      },
      choices: [
        {
          id: 'recognized-bow',
          label: {
            en: 'Bow and let her speak first',
            fr: 'Inclinez-vous et laissez-la parler en premier'
          },
          mode: 'speak',
          description: {
            en: 'A wise move — you give the court back to Eleanor.',
            fr: "Un choix judicieux — vous laissez la préséance de la cour à Aliénor."
          },
          leadsTo: 'eleanor-question',
          requiresPitchGate: true,
          bonusCondition: null,
          bonusLeadsTo: null,
        },
        {
          id: 'recognized-offer',
          label: {
            en: '★ Offer the second note of your song',
            fr: '★ Offrez la deuxième note de votre chant'
          },
          mode: 'sing',
          description: {
            en: 'You began with your name at the gate. You offer the next phrase now.',
            fr: "Vous avez commencé avec votre nom à la porte. Vous offrez la phrase suivante à présent."
          },
          leadsTo: 'eleanor-impressed',
          requiresPitchGate: true,
          bonusCondition: { singingScore: 0.5 },
          bonusLeadsTo: 'eleanor-riveted',
        },
      ],
    },

    'eleanor-question': {
      id: 'eleanor-question',
      act: 1,
      intervalName: {
        en: 'Minor 3rd',
        fr: 'Tierce Mineure'
      },
      targetNote: 'C5',
      targetFreq: 523.25,
      pitchLabel: {
        en: 'C · Minor 3rd above A · 6:5 ratio',
        fr: 'Do · Tierce mineure au-dessus du La · Rapport 6:5'
      },
      setting: {
        en: 'Eleanor speaks: "Every troubadour who comes to my court tells me they have found something new. What have you found?" The room is silent. Peire watches.',
        fr: 'Aliénor prend la parole : "Chaque troubadour qui vient dans ma cour me dit avoir trouvé quelque chose de nouveau. Qu\'avez-vous trouvé ?" La salle est silencieuse. Peire observe.'
      },
      art: '/assets/adventures/troubadour/eleanor-question.png',
      atmosphere: 'deep-violet',
      mentorLine: {
        en: 'The minor third. The sound of longing. Answer her from there.',
        fr: "La tierce mineure. Le son de la nostalgie et du désir. Répondez-lui depuis cet espace."
      },
      coachingCues: {
        onSceneEnter: {
          en: 'This is the real entrance examination. Not the gate. This.',
          fr: "C'est le véritable examen d'entrée. Pas la porte extérieure. Celui-ci."
        },
        onPitchPass: {
          en: '"The minor third," Bernard murmurs. "You felt it before you named it."',
          fr: '"La tierce mineure," murmure Bernard. "Vous l\'avez ressentie avant de la nommer."'
        },
        onPitchStruggle: {
          en: '"Do not think. What are you longing for? Find that — the note follows."',
          fr: '"Ne réfléchissez pas. De quoi languissez-vous ? Trouvez cela — la note suivra."'
        },
        onSingBonus: {
          en: '"Eleanor sits back. That is the posture of someone who has heard something true."',
          fr: '"Aliénor se rassied. C\'est l\'attitude de quelqu\'un qui vient d\'entendre une vérité."'
        },
        onBreathFree: {
          en: 'Your answer will come from a still place. That is rare in this hall.',
          fr: "Votre réponse viendra d'un endroit serein. C'est si rare dans cette salle."
        },
        onBreathHeld: {
          en: 'Breathe first. The answer you give from a held breath will be smaller than you are.',
          fr: "Respirez d'abord. Une réponse donnée le souffle bloqué sera plus petite que vous."
        },
      },
      choices: [
        {
          id: 'eleanor-q-speak',
          label: {
            en: 'I have found that the voice is the instrument',
            fr: 'J\'ai découvert que la voix elle-même est l\'instrument'
          },
          mode: 'speak',
          description: {
            en: 'You speak your answer. It lands cleanly. Eleanor considers it.',
            fr: "Vous dites votre réponse à voix haute. Elle résonne avec clarté. Aliénor y réfléchit."
          },
          leadsTo: 'bernards-lesson',
          requiresPitchGate: true,
          bonusCondition: { streak: 3 },
          bonusLeadsTo: 'eleanor-private',
        },
        {
          id: 'eleanor-q-sing',
          label: {
            en: '★ Sing your answer to her question',
            fr: '★ Chantez votre réponse à sa question'
          },
          mode: 'sing',
          description: {
            en: 'You do not speak. You sing the answer — whatever the song is, it is yours.',
            fr: "Vous ne parlez pas. Vous chantez votre réponse — quelle que soit la chanson, elle est vôtre."
          },
          leadsTo: 'bernards-lesson',
          requiresPitchGate: true,
          bonusCondition: { singingScore: 0.65 },
          bonusLeadsTo: 'eleanor-private',
        },
      ],
    },

    'eleanor-impressed': {
      id: 'eleanor-impressed',
      act: 1,
      intervalName: {
        en: 'Minor 3rd',
        fr: 'Tierce Mineure'
      },
      targetNote: 'C5',
      targetFreq: 523.25,
      pitchLabel: {
        en: 'C · Minor 3rd above A · 6:5 ratio',
        fr: 'Do · Tierce mineure au-dessus du La · Rapport 6:5'
      },
      setting: {
        en: 'Eleanor raises her hand for silence. "Leave us," she says to the court. She keeps you. And Bernard. And sends everyone else away.',
        fr: 'Aliénor lève la main pour réclamer le silence. "Laissez-nous," dit-elle à la cour. Elle vous retient. Vous et Bernard. Elle congédie tous les autres.'
      },
      art: '/assets/adventures/troubadour/eleanor-private-early.png',
      atmosphere: 'amber-intimate',
      mentorLine: {
        en: 'She has given you something rare. Speak from the minor third — the note of honest longing.',
        fr: "Elle vous offre un instant rare. Parlez depuis la tierce mineure — la note du désir sincère."
      },
      coachingCues: {
        onSceneEnter: {
          en: 'This scene is only reached by those who sang when they could have spoken.',
          fr: "Cette scène n'est offerte qu'à ceux qui ont osé chanter au lieu de parler."
        },
        onPitchPass: {
          en: 'Bernard exhales. You have earned the room.',
          fr: "Bernard expire de soulagement. Vous avez conquis la pièce."
        },
        onPitchStruggle: {
          en: '"Even here, the note must be found. Especially here."',
          fr: '"Même ici, la note doit être trouvée. Surtout ici."'
        },
        onSingBonus: {
          en: '"Eleanor smiles. Not the court smile. A real one."',
          fr: '"Aliénor sourit. Pas son sourire de cour. Un vrai sourire."'
        },
        onBreathFree: {
          en: 'The room is small. Your breath fills it.',
          fr: "La pièce est intime. Votre souffle l'emplit tout entière."
        },
        onBreathHeld: {
          en: '"Breathe," Eleanor says. "I did not keep you here to watch you shrink."',
          fr: '"Respirez," dit Aliénor. "Je ne vous ai pas gardé ici pour vous regarder vous recroqueviller."'
        },
      },
      choices: [
        {
          id: 'impressed-speak',
          label: {
            en: 'Ask what she wants to hear',
            fr: 'Demandez-lui ce qu\'elle souhaite entendre'
          },
          mode: 'speak',
          description: {
            en: 'A honest question. Eleanor appreciates the directness.',
            fr: "Une question honnête. Aliénor apprécie cette franchise directe."
          },
          leadsTo: 'bernards-lesson',
          requiresPitchGate: true,
          bonusCondition: null,
          bonusLeadsTo: null,
        },
        {
          id: 'impressed-sing',
          label: {
            en: '★ Begin the song without being asked',
            fr: '★ Entonnez le chant sans attendre d\'invitation'
          },
          mode: 'sing',
          description: {
            en: 'You simply begin. Whatever the song is.',
            fr: "Vous commencez tout simplement. Quel que soit ce chant."
          },
          leadsTo: 'eleanor-riveted',
          requiresPitchGate: true,
          bonusCondition: { singingScore: 0.6 },
          bonusLeadsTo: 'eleanor-commission',
        },
      ],
    },

    // ─────────────────────────────────────────────
    // ACT II — THE TEACHING
    // ─────────────────────────────────────────────

    'bernards-lesson': {
      id: 'bernards-lesson',
      act: 2,
      intervalName: {
        en: 'Perfect 4th',
        fr: 'Quarte Juste'
      },
      targetNote: 'D5',
      targetFreq: 587.33,
      pitchLabel: {
        en: 'D · Perfect 4th above A · 4:3 ratio',
        fr: 'Ré · Quarte juste au-dessus du La · Rapport 4:3'
      },
      setting: {
        en: 'That evening, Bernard finds you in the courtyard. "You did well enough," he says. "Now let me show you why \'well enough\' is not why we came here." He hums a note and waits.',
        fr: 'Le soir même, Bernard vous retrouve dans la cour. "Vous vous en êtes bien sorti," dit-il. "Mais laissez-moi vous montrer pourquoi \'bien s\'en sortir\' n\'est pas la raison de notre voyage." Il fredonne une note et attend.'
      },
      art: '/assets/adventures/troubadour/bernards-lesson.png',
      atmosphere: 'cool-night',
      mentorLine: {
        en: 'The Perfect Fourth. The foundation. The tuning of every string on your instrument. Find it.',
        fr: "La quarte juste. La fondation. L'accordage de chaque corde de votre instrument. Trouvez-la."
      },
      coachingCues: {
        onSceneEnter: {
          en: 'This is where the real teaching begins. The court was the entrance exam.',
          fr: "C'est ici que le véritable enseignement commence. La cour n'était qu'un filtre."
        },
        onPitchPass: {
          en: '"Yes. That is the architecture. Everything else is built on that."',
          fr: '"Oui. Voilà l\'architecture. Tout le reste est bâti là-dessus."'
        },
        onPitchStruggle: {
          en: '"Listen to the distance. It is exactly 4:3. Let your body measure it."',
          fr: '"Écoutez la distance. C\'est exactement 4:3. Laissez votre corps la mesurer."'
        },
        onSingBonus: {
          en: '"Bernard stops walking. He listens to all of it before he responds."',
          fr: '"Bernard s\'arrête de marcher. Il écoute l\'ensemble avant de répondre."'
        },
        onBreathFree: {
          en: '"Good. Now you are an instrument, not a person trying to be one."',
          fr: '"Bien. À présent vous êtes un instrument, pas quelqu\'un qui s\'efforce d\'en être un."'
        },
        onBreathHeld: {
          en: '"You are gripping the note. Release it. Let it vibrate."',
          fr: '"Vous agrippez la note. Relâchez-la. Laissez-la vibrer librement."'
        },
      },
      choices: [
        {
          id: 'lesson-ask-why',
          label: {
            en: 'Ask why the Perfect 4th matters',
            fr: 'Demandez pourquoi la quarte juste est si importante'
          },
          mode: 'speak',
          description: {
            en: 'Bernard explains: every lute string is tuned in Perfect 4ths. The instrument is Pythagorean.',
            fr: "Bernard vous explique : chaque corde du luth est accordée en quartes justes. L'instrument est pythagoricien."
          },
          leadsTo: 'rival-encounter',
          requiresPitchGate: true,
          bonusCondition: { streak: 4 },
          bonusLeadsTo: 'bernards-secret',
        },
        {
          id: 'lesson-sing-response',
          label: {
            en: '★ Sing the interval back — and add one more note',
            fr: '★ Chantez l\'intervalle en retour — et ajoutez une note de plus'
          },
          mode: 'sing',
          description: {
            en: 'You echo the D, then move somewhere. An improvised phrase.',
            fr: "Vous faites écho au Ré, puis vous glissez vers une autre note. Une phrase improvisée."
          },
          leadsTo: 'rival-encounter',
          requiresPitchGate: true,
          bonusCondition: { singingScore: 0.7 },
          bonusLeadsTo: 'bernards-secret',
        },
      ],
    },

    'rival-encounter': {
      id: 'rival-encounter',
      act: 2,
      intervalName: {
        en: 'Tritone',
        fr: 'Triton'
      },
      targetNote: 'Eb5',
      targetFreq: 622.25,
      pitchLabel: {
        en: 'Eb · Tritone · The devil in music',
        fr: 'Mi bémol · Le Triton · Le diable dans la musique'
      },
      setting: {
        en: 'Peire d\'Alvernha corners you in the corridor. "You don\'t belong here," he says. "Your accent is wrong. Your tuning is rough. Eleanor is being polite." He is not entirely wrong.',
        fr: 'Peire d\'Alvernha vous coince dans le couloir. "Vous n\'avez rien à faire ici," lance-t-il. "Votre accent est faux. Votre accordage est approximatif. Aliénor est juste polie." Il n\'a pas tout à fait tort.'
      },
      art: '/assets/adventures/troubadour/rival-encounter.png',
      atmosphere: 'red-tension',
      mentorLine: {
        en: 'The tritone. The forbidden interval. It is not your enemy — it is the engine of all resolution. Find it without flinching.',
        fr: "Le triton. L'intervalle interdit. Ce n'est pas votre ennemi — c'est le moteur de toute résolution. Trouvez-le sans ciller."
      },
      coachingCues: {
        onSceneEnter: {
          en: 'Peire is testing you. The tritone is the test. Both want the same thing: your response.',
          fr: "Peire vous teste. Le triton est l'épreuve. Tous deux cherchent la même chose : votre réponse."
        },
        onPitchPass: {
          en: '"The dissonance did not break you. That tells Peire everything he needs to know."',
          fr: '"La dissonance ne vous a pas brisé. Cela dit à Peire tout ce qu\'il a besoin de savoir."'
        },
        onPitchStruggle: {
          en: '"Do not avoid the tension. Sit in it. It will resolve — but only if you hold it."',
          fr: '"Ne fuyez pas la tension. Habitez-la. Elle se résoudra — mais seulement si vous la tenez."'
        },
        onSingBonus: {
          en: '"Peire goes silent. You sang where he expected argument."',
          fr: '"Peire se tait. Vous avez chanté là où il s\'attendait à une dispute."'
        },
        onBreathFree: {
          en: 'You hold the tritone steady. Your breath is the anchor.',
          fr: "Vous tenez le triton avec stabilité. Votre souffle est l'ancre."
        },
        onBreathHeld: {
          en: 'The tension of the interval meets the tension of your body. One of them will break.',
          fr: "La tension de l'intervalle rencontre la tension de votre corps. L'une d'elles finira par rompre."
        },
      },
      choices: [
        {
          id: 'rival-speak',
          label: {
            en: 'Agree with him — partially',
            fr: 'Accordez-lui raison — en partie'
          },
          mode: 'speak',
          description: {
            en: '"You\'re right about the accent. Wrong about the rest." Peire is disarmed by agreement.',
            fr: '"Tu as raison pour l\'accent. Tort pour le reste." Peire est désarmé par cet accord inattendu.'
          },
          leadsTo: 'eleanor-test',
          requiresPitchGate: true,
          bonusCondition: { streak: 5 },
          bonusLeadsTo: 'rival-ally',
        },
        {
          id: 'rival-sing',
          label: {
            en: '★ Respond by singing the tritone directly at him',
            fr: '★ Répondez en chantant le triton directement vers lui'
          },
          mode: 'sing',
          description: {
            en: 'You hold the Eb — the devil\'s interval — and let it ring between you.',
            fr: "Vous soutenez le Mi bémol — l'intervalle du diable — et le laissez résonner entre vous deux."
          },
          leadsTo: 'eleanor-test',
          requiresPitchGate: true,
          bonusCondition: { singingScore: 0.65 },
          bonusLeadsTo: 'rival-ally',
        },
      ],
    },

    // ─────────────────────────────────────────────
    // ACT III — THE PERFORMANCE
    // ─────────────────────────────────────────────

    'eleanor-test': {
      id: 'eleanor-test',
      act: 3,
      intervalName: {
        en: 'Perfect 5th',
        fr: 'Quinte Juste'
      },
      targetNote: 'E5',
      targetFreq: 659.25,
      pitchLabel: {
        en: 'E · Perfect 5th above A · 3:2 ratio',
        fr: 'Mi · Quinte juste au-dessus du La · Rapport 3:2'
      },
      setting: {
        en: 'Eleanor summons you. "Tonight there is a feast. I want you to perform. One song. Your own — not Bernard\'s. Not anything you learned on the road. Yours." She leaves no room for argument.',
        fr: 'Aliénor vous fait appeler. "Ce soir a lieu un banquet. Je veux que vous chantiez. Une chanson. La vôtre — pas celle de Bernard. Pas un air appris en chemin. La vôtre." Elle ne laisse place à aucune négociation.'
      },
      art: '/assets/adventures/troubadour/eleanor-test.png',
      atmosphere: 'deep-gold',
      mentorLine: {
        en: 'The Perfect Fifth. 3:2. The first overtone above the octave. It was always in the string. Your song was always in you.',
        fr: "La quinte juste. Rapport 3:2. Le premier harmonique au-dessus de l'octave. Elle a toujours été dans la corde. Votre chant a toujours été en vous."
      },
      coachingCues: {
        onSceneEnter: {
          en: 'This is what you came for. The interval is the same. The stakes are different.',
          fr: "C'est pour cela que vous êtes venu. L'intervalle est le même. Les enjeux sont tout autres."
        },
        onPitchPass: {
          en: '"Bernard says nothing. He smiles. That is his standing ovation."',
          fr: '"Bernard ne dit rien. Il sourit. C\'est son ovation debout à lui."'
        },
        onPitchStruggle: {
          en: '"Breathe. The 3:2 ratio is not difficult. You have been doing it all week."',
          fr: '"Respirez. Le rapport 3:2 n\'est pas difficile. Vous l\'avez pratiqué toute la semaine."'
        },
        onSingBonus: {
          en: '"The hall goes quiet before you finish. That quiet is the real applause."',
          fr: '"La salle fait silence avant même que vous n\'ayez fini. Ce silence est le vrai applaudissement."'
        },
        onBreathFree: {
          en: 'Your voice carries to the back of the hall without effort.',
          fr: "Votre voix porte jusqu'au fond de la grande salle sans aucun effort."
        },
        onBreathHeld: {
          en: '"Release," Bernard whispers. "The song is bigger than your fear."',
          fr: '"Relâchez," chuchote Bernard. "La chanson est bien plus grande que votre peur."'
        },
      },
      choices: [
        {
          id: 'test-speak',
          label: {
            en: 'Ask Bernard what song to perform',
            fr: 'Demandez à Bernard quelle chanson interpréter'
          },
          mode: 'speak',
          description: {
            en: 'Bernard shakes his head. "Eleanor said yours. Not mine. I cannot give you this one."',
            fr: 'Bernard secoue la tête. "Aliénor a dit la vôtre. Pas la mienne. Je ne peux pas vous la donner."'
          },
          leadsTo: 'final-performance',
          requiresPitchGate: true,
          bonusCondition: null,
          bonusLeadsTo: null,
        },
        {
          id: 'test-sing',
          label: {
            en: '★ Begin composing the song right now',
            fr: '★ Commencez à composer la chanson dès maintenant'
          },
          mode: 'sing',
          description: {
            en: 'You do not wait for the feast. The song starts here, in Eleanor\'s anteroom, unrehearsed.',
            fr: "Vous n'attendez pas le banquet. Le chant commence ici, dans l'antichambre d'Aliénor, sans répétition."
          },
          leadsTo: 'final-performance',
          requiresPitchGate: true,
          bonusCondition: { singingScore: 0.6 },
          bonusLeadsTo: 'final-performance-legendary',
        },
      ],
    },

    'final-performance': {
      id: 'final-performance',
      act: 3,
      intervalName: {
        en: 'Octave',
        fr: 'Octave'
      },
      targetNote: 'A5',
      targetFreq: 880,
      pitchLabel: {
        en: 'A · Octave · 2:1 ratio · The return',
        fr: 'La · Octave · Rapport 2:1 · Le retour'
      },
      setting: {
        en: 'The feast. Forty courtiers. Eleanor in the center. Peire watching from the side. Bernard standing at the back, arms folded. You have the floor.',
        fr: 'Le banquet. Quarante courtisans. Aliénor au centre. Peire observe depuis le côté. Bernard se tient au fond, les bras croisés. La parole — et le chant — sont à vous.'
      },
      art: '/assets/adventures/troubadour/final-performance.png',
      atmosphere: 'warm-firelight',
      mentorLine: {
        en: 'The octave. The same note, one level higher. You began here. You return here — transformed.',
        fr: "L'octave. La même note, à l'étage supérieur. Vous avez débuté ici. Vous y retournez — métamorphosé."
      },
      coachingCues: {
        onSceneEnter: {
          en: 'Every interval you have found this week is in this moment.',
          fr: "Chaque intervalle trouvé cette semaine converge vers cet instant précis."
        },
        onPitchPass: {
          en: '"The octave rings. The hall hears their own breathing stop."',
          fr: '"L\'octave résonne. La salle entière sent son propre souffle se suspendre."'
        },
        onPitchStruggle: {
          en: '"It is the same A you found at the gate. You already know it."',
          fr: '"C\'est le même La que vous avez trouvé à la porte. Vous le connaissez déjà."'
        },
        onSingBonus: {
          en: 'Eleanor stands. In her court, this means something specific: she is moved.',
          fr: "Aliénor se lève. Dans sa cour, cela a un sens précis : elle est profondément touchée."
        },
        onBreathFree: {
          en: 'Your breath moves the room. This is *voix vive* — the living voice.',
          fr: "Votre souffle anime toute la pièce. C'est cela, la *voix vive*."
        },
        onBreathHeld: {
          en: '"Release everything," Bernard says from the back. "All of it."',
          fr: '"Relâchez tout," dit Bernard depuis le fond. "Absolument tout."'
        },
      },
      choices: [
        {
          id: 'final-speak',
          label: {
            en: 'Perform the song as prepared',
            fr: 'Interprétez la chanson telle que préparée'
          },
          mode: 'speak',
          description: {
            en: 'You sing the song you have been building all week. The court listens.',
            fr: "Vous chantez l'œuvre que vous avez bâtie toute la semaine. La cour écoute."
          },
          leadsTo: 'ending-patronage',
          requiresPitchGate: true,
          bonusCondition: { streak: 6 },
          bonusLeadsTo: 'ending-commission',
        },
        {
          id: 'final-sing',
          label: {
            en: '★ Improvise — let the audience complete the song',
            fr: '★ Improvisez — laissez l\'audience achever le chant'
          },
          mode: 'sing',
          description: {
            en: 'You begin, and you leave a phrase unfinished — an open question for Eleanor to answer.',
            fr: "Vous commencez, puis vous laissez une phrase en suspens — une question ouverte à laquelle Aliénor devra répondre."
          },
          leadsTo: 'ending-patronage',
          requiresPitchGate: true,
          bonusCondition: { singingScore: 0.75 },
          bonusLeadsTo: 'ending-commission',
        },
      ],
    },

    // ─────────────────────────────────────────────
    // ENDINGS
    // ─────────────────────────────────────────────

    'ending-patronage': {
      id: 'ending-patronage',
      act: 3,
      intervalName: {
        en: 'Octave',
        fr: 'Octave'
      },
      targetNote: 'A5',
      targetFreq: 880,
      pitchLabel: {
        en: 'A · The return home',
        fr: 'La · Le retour au port'
      },
      setting: {
        en: 'Eleanor grants you winter quarters at Poitiers. Not a commission — something better. Time. Space. The court will hear you again in spring.',
        fr: "Aliénor vous accorde vos quartiers d'hiver à Poitiers. Pas une simple commande — mieux encore. Du temps. De l'espace. La cour vous entendra à nouveau au printemps."
      },
      art: '/assets/adventures/troubadour/ending-patronage.png',
      atmosphere: 'ember-warm',
      mentorLine: {
        en: 'Bernard says: "You did not come here to be given a song. You came to find out you already had one."',
        fr: 'Bernard vous dit : "Vous n\'êtes pas venu pour qu\'on vous donne un chant. Vous êtes venu pour découvrir que vous en portiez déjà un en vous."'
      },
      coachingCues: {
        onSceneEnter: {
          en: 'This is a real ending. Not all endings are commissions.',
          fr: "C'est un véritable dénouement. Les plus beaux lauriers ne sont pas toujours des commandes."
        },
        onPitchPass: {
          en: 'The session is complete.',
          fr: "La session est accomplie."
        },
        onPitchStruggle: {
          en: 'Even at the end, the note matters.',
          fr: "Même à la fin, la note garde toute son importance."
        },
        onSingBonus: {
          en: 'You sing the last note of the adventure. It rings longer than expected.',
          fr: "Vous chantez la note finale de l'aventure. Elle résonne plus longuement que prévu."
        },
        onBreathFree: {
          en: 'You breathe easily for the first time since the gate.',
          fr: "Vous respirez avec aisance pour la première fois depuis les portes."
        },
        onBreathHeld: {
          en: 'Let it go. The story is done.',
          fr: "Lâchez prise. L'histoire est accomplie."
        },
      },
      choices: [],
      isEnding: true,
      endingType: 'patronage',
    },

    'ending-commission': {
      id: 'ending-commission',
      act: 3,
      intervalName: {
        en: 'Octave',
        fr: 'Octave'
      },
      targetNote: 'A5',
      targetFreq: 880,
      pitchLabel: {
        en: 'A · The return, transformed',
        fr: 'La · Le retour, transformé'
      },
      setting: {
        en: 'Eleanor commissions a canso — a full song cycle — for the court of spring. She hands you a sealed letter for the court of Bordeaux. You are no longer a visitor. You are a troubadour of Occitania.',
        fr: "Aliénor vous commande une canso — un cycle complet de chants — pour sa cour printanière. Elle vous remet une lettre scellée pour la cour de Bordeaux. Vous n'êtes plus un simple visiteur. Vous êtes un troubadour d'Occitanie."
      },
      art: '/assets/adventures/troubadour/ending-commission.png',
      atmosphere: 'luminous-gold',
      mentorLine: {
        en: '"Now," Bernard says, "write the song about where you came from. That is always the second one."',
        fr: '"À présent," dit Bernard, "écris la chanson sur l\'endroit d\'où tu viens. C\'est toujours la seconde."'
      },
      coachingCues: {
        onSceneEnter: {
          en: 'This ending is only available to those who sang their choices. Well done.',
          fr: "Cette fin n'était accessible qu'à ceux qui ont osé chanter leurs choix. Bravo."
        },
        onPitchPass: {
          en: 'The adventure is complete. Adventure II unlocks.',
          fr: "L'aventure est achevée. L'Aventure II est déverrouillée."
        },
        onPitchStruggle: {
          en: 'Even now.',
          fr: "Même maintenant."
        },
        onSingBonus: {
          en: 'The living voice. It was always yours.',
          fr: "La voix vivante. Elle a toujours été vôtre."
        },
        onBreathFree: {
          en: 'Free breath. Free voice. The same thing.',
          fr: "Souffle libre. Voix libre. C'est la même et unique chose."
        },
        onBreathHeld: {
          en: 'One last time: release.',
          fr: "Une dernière fois : relâchez."
        },
      },
      choices: [],
      isEnding: true,
      endingType: 'commission',
      unlocksAdventure: 'pythagorean-brotherhood',
    },
  },
};

export default TROUBADOUR;
