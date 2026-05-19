// Adventure I — The Troubadour of Occitania
// Eleanor of Aquitaine's court, Poitiers, 1165 CE
// Mentor: Bernard de Ventadorn
//
// Three-part gate per scene:
//   1. breathState === 'free'  → composure bonus
//   2. pitch within ±20¢       → gate passes
//   3. sung response (>2s)     → bonus branch unlocks
//
// Breath maps to character power:
//   free    = "your voice fills the hall"
//   shallow = "your voice wavers but holds"
//   held    = "Eleanor frowns — she hears the fear"

export const TROUBADOUR = {
  id: 'troubadour-occitania',
  title: 'The Troubadour of Occitania',
  subtitle: 'Eleanor of Aquitaine\'s court · Poitiers · 1165 CE',
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
      intervalName: 'Unison',
      targetNote: 'A4',
      targetFreq: 440,
      pitchLabel: 'A · 440 Hz · The tuning note',
      setting: 'The gates of Poitiers. Dust on the road. You have walked three weeks to reach Eleanor\'s court. A guard asks your name and your purpose.',
      art: '/assets/adventures/troubadour/arrival.png',
      atmosphere: 'amber-dusk',
      mentorLine: 'Before you enter, find your note. Every troubadour must first know where they stand.',
      coachingCues: {
        onSceneEnter: 'The road ends here. The court begins.',
        onPitchPass: 'Bernard nods. "That is you. Now do not lose it inside."',
        onPitchStruggle: 'Bernard waits. "The note is already in you. You are just not listening yet."',
        onSingBonus: '"You announced yourself in song. The guard will remember that."',
        onBreathFree: 'Your shoulders drop. The tension of the road leaves your body.',
        onBreathHeld: 'Bernard touches your arm. "Breathe. You have already arrived."',
      },
      choices: [
        {
          id: 'arrival-speak',
          label: 'State your name and purpose',
          mode: 'speak',
          description: 'You speak your name to the guard. He writes it in his ledger.',
          leadsTo: 'great-hall',
          requiresPitchGate: true,
          bonusCondition: null,
          bonusLeadsTo: null,
        },
        {
          id: 'arrival-sing',
          label: '★ Sing your name to the guard',
          mode: 'sing',
          description: 'You sing your introduction — name, origin, purpose — on one note.',
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
      intervalName: 'Major 2nd',
      targetNote: 'B4',
      targetFreq: 493.88,
      pitchLabel: 'B · One step above A · 9:8 ratio',
      setting: 'The great hall of Poitiers. Eleanor sits elevated on a carved stone chair. Forty courtiers watch as you approach. A rival troubadour — Peire d\'Alvernha — stands to her left, already smiling at your discomfort.',
      art: '/assets/adventures/troubadour/great-hall.png',
      atmosphere: 'cool-stone',
      mentorLine: 'Step one note higher. Just one. That is all the court requires of you right now.',
      coachingCues: {
        onSceneEnter: 'Eleanor does not look at you yet. That is information.',
        onPitchPass: '"She looked up," Bernard whispers. "One note was enough."',
        onPitchStruggle: '"The court hears everything. Your silence is also a sound."',
        onSingBonus: '"Peire\'s smile has changed. He did not expect that from you."',
        onBreathFree: 'The courtiers settle. Your calm has set the room\'s temperature.',
        onBreathHeld: 'Peire notices. He will use this later.',
      },
      choices: [
        {
          id: 'hall-bow',
          label: 'Bow and wait to be addressed',
          mode: 'speak',
          description: 'You bow deeply. A safe, correct move. Eleanor nods permission to approach.',
          leadsTo: 'eleanor-question',
          requiresPitchGate: true,
          bonusCondition: null,
          bonusLeadsTo: null,
        },
        {
          id: 'hall-challenge',
          label: '★ Meet Peire\'s eyes and sing one note',
          mode: 'sing',
          description: 'You hold the B. Just one note, directed at Peire. A statement, not an attack.',
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
      intervalName: 'Major 2nd',
      targetNote: 'B4',
      targetFreq: 493.88,
      pitchLabel: 'B · One step above A · 9:8 ratio',
      setting: 'The guard announced your arrival with a description: "A troubadour who sings their own name." Eleanor is already watching the door when you enter.',
      art: '/assets/adventures/troubadour/great-hall-recognized.png',
      atmosphere: 'warm-gold',
      mentorLine: 'She is already listening. Step one note higher — carefully.',
      coachingCues: {
        onSceneEnter: 'This is the bonus of your first choice. Eleanor\'s attention is already yours.',
        onPitchPass: '"Good. You have not wasted what you earned at the gate."',
        onPitchStruggle: '"She is patient. But attention is not infinite."',
        onSingBonus: '"Bernard laughs quietly. You are making this look easy."',
        onBreathFree: 'Eleanor leans forward slightly.',
        onBreathHeld: 'You tighten. Even the favorable start can be lost.',
      },
      choices: [
        {
          id: 'recognized-bow',
          label: 'Bow and let her speak first',
          mode: 'speak',
          description: 'A wise move — you give the court back to Eleanor.',
          leadsTo: 'eleanor-question',
          requiresPitchGate: true,
          bonusCondition: null,
          bonusLeadsTo: null,
        },
        {
          id: 'recognized-offer',
          label: '★ Offer the second note of your song',
          mode: 'sing',
          description: 'You began with your name at the gate. You offer the next phrase now.',
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
      intervalName: 'Minor 3rd',
      targetNote: 'C5',
      targetFreq: 523.25,
      pitchLabel: 'C · Minor 3rd above A · 6:5 ratio',
      setting: 'Eleanor speaks: "Every troubadour who comes to my court tells me they have found something new. What have you found?" The room is silent. Peire watches.',
      art: '/assets/adventures/troubadour/eleanor-question.png',
      atmosphere: 'deep-violet',
      mentorLine: 'The minor third. The sound of longing. Answer her from there.',
      coachingCues: {
        onSceneEnter: 'This is the real entrance examination. Not the gate. This.',
        onPitchPass: '"The minor third," Bernard murmurs. "You felt it before you named it."',
        onPitchStruggle: '"Do not think. What are you longing for? Find that — the note follows."',
        onSingBonus: '"Eleanor sits back. That is the posture of someone who has heard something true."',
        onBreathFree: 'Your answer will come from a still place. That is rare in this hall.',
        onBreathHeld: 'Breathe first. The answer you give from a held breath will be smaller than you are.',
      },
      choices: [
        {
          id: 'eleanor-q-speak',
          label: 'I have found that the voice is the instrument',
          mode: 'speak',
          description: 'You speak your answer. It lands cleanly. Eleanor considers it.',
          leadsTo: 'bernards-lesson',
          requiresPitchGate: true,
          bonusCondition: { streak: 3 },
          bonusLeadsTo: 'eleanor-private',
        },
        {
          id: 'eleanor-q-sing',
          label: '★ Sing your answer to her question',
          mode: 'sing',
          description: 'You do not speak. You sing the answer — whatever the song is, it is yours.',
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
      intervalName: 'Minor 3rd',
      targetNote: 'C5',
      targetFreq: 523.25,
      pitchLabel: 'C · Minor 3rd above A · 6:5 ratio',
      setting: 'Eleanor raises her hand for silence. "Leave us," she says to the court. She keeps you. And Bernard. And sends everyone else away.',
      art: '/assets/adventures/troubadour/eleanor-private-early.png',
      atmosphere: 'amber-intimate',
      mentorLine: 'She has given you something rare. Speak from the minor third — the note of honest longing.',
      coachingCues: {
        onSceneEnter: 'This scene is only reached by those who sang when they could have spoken.',
        onPitchPass: 'Bernard exhales. You have earned the room.',
        onPitchStruggle: '"Even here, the note must be found. Especially here."',
        onSingBonus: '"Eleanor smiles. Not the court smile. A real one."',
        onBreathFree: 'The room is small. Your breath fills it.',
        onBreathHeld: '"Breathe," Eleanor says. "I did not keep you here to watch you shrink."',
      },
      choices: [
        {
          id: 'impressed-speak',
          label: 'Ask what she wants to hear',
          mode: 'speak',
          description: 'A honest question. Eleanor appreciates the directness.',
          leadsTo: 'bernards-lesson',
          requiresPitchGate: true,
          bonusCondition: null,
          bonusLeadsTo: null,
        },
        {
          id: 'impressed-sing',
          label: '★ Begin the song without being asked',
          mode: 'sing',
          description: 'You simply begin. Whatever the song is.',
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
      intervalName: 'Perfect 4th',
      targetNote: 'D5',
      targetFreq: 587.33,
      pitchLabel: 'D · Perfect 4th above A · 4:3 ratio',
      setting: 'That evening, Bernard finds you in the courtyard. "You did well enough," he says. "Now let me show you why \'well enough\' is not why we came here." He hums a note and waits.',
      art: '/assets/adventures/troubadour/bernards-lesson.png',
      atmosphere: 'cool-night',
      mentorLine: 'The Perfect Fourth. The foundation. The tuning of every string on your instrument. Find it.',
      coachingCues: {
        onSceneEnter: 'This is where the real teaching begins. The court was the entrance exam.',
        onPitchPass: '"Yes. That is the architecture. Everything else is built on that."',
        onPitchStruggle: '"Listen to the distance. It is exactly 4:3. Let your body measure it."',
        onSingBonus: '"Bernard stops walking. He listens to all of it before he responds."',
        onBreathFree: '"Good. Now you are an instrument, not a person trying to be one."',
        onBreathHeld: '"You are gripping the note. Release it. Let it vibrate."',
      },
      choices: [
        {
          id: 'lesson-ask-why',
          label: 'Ask why the Perfect 4th matters',
          mode: 'speak',
          description: 'Bernard explains: every lute string is tuned in Perfect 4ths. The instrument is Pythagorean.',
          leadsTo: 'rival-encounter',
          requiresPitchGate: true,
          bonusCondition: { streak: 4 },
          bonusLeadsTo: 'bernards-secret',
        },
        {
          id: 'lesson-sing-response',
          label: '★ Sing the interval back — and add one more note',
          mode: 'sing',
          description: 'You echo the D, then move somewhere. An improvised phrase.',
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
      intervalName: 'Tritone',
      targetNote: 'Eb5',
      targetFreq: 622.25,
      pitchLabel: 'Eb · Tritone · The devil in music',
      setting: 'Peire d\'Alvernha corners you in the corridor. "You don\'t belong here," he says. "Your accent is wrong. Your tuning is rough. Eleanor is being polite." He is not entirely wrong.',
      art: '/assets/adventures/troubadour/rival-encounter.png',
      atmosphere: 'red-tension',
      mentorLine: 'The tritone. The forbidden interval. It is not your enemy — it is the engine of all resolution. Find it without flinching.',
      coachingCues: {
        onSceneEnter: 'Peire is testing you. The tritone is the test. Both want the same thing: your response.',
        onPitchPass: '"The dissonance did not break you. That tells Peire everything he needs to know."',
        onPitchStruggle: '"Do not avoid the tension. Sit in it. It will resolve — but only if you hold it."',
        onSingBonus: '"Peire goes silent. You sang where he expected argument."',
        onBreathFree: 'You hold the tritone steady. Your breath is the anchor.',
        onBreathHeld: 'The tension of the interval meets the tension of your body. One of them will break.',
      },
      choices: [
        {
          id: 'rival-speak',
          label: 'Agree with him — partially',
          mode: 'speak',
          description: '"You\'re right about the accent. Wrong about the rest." Peire is disarmed by agreement.',
          leadsTo: 'eleanor-test',
          requiresPitchGate: true,
          bonusCondition: { streak: 5 },
          bonusLeadsTo: 'rival-ally',
        },
        {
          id: 'rival-sing',
          label: '★ Respond by singing the tritone directly at him',
          mode: 'sing',
          description: 'You hold the Eb — the devil\'s interval — and let it ring between you.',
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
      intervalName: 'Perfect 5th',
      targetNote: 'E5',
      targetFreq: 659.25,
      pitchLabel: 'E · Perfect 5th above A · 3:2 ratio',
      setting: 'Eleanor summons you. "Tonight there is a feast. I want you to perform. One song. Your own — not Bernard\'s. Not anything you learned on the road. Yours." She leaves no room for argument.',
      art: '/assets/adventures/troubadour/eleanor-test.png',
      atmosphere: 'deep-gold',
      mentorLine: 'The Perfect Fifth. 3:2. The first overtone above the octave. It was always in the string. Your song was always in you.',
      coachingCues: {
        onSceneEnter: 'This is what you came for. The interval is the same. The stakes are different.',
        onPitchPass: '"Bernard says nothing. He smiles. That is his standing ovation."',
        onPitchStruggle: '"Breathe. The 3:2 ratio is not difficult. You have been doing it all week."',
        onSingBonus: '"The hall goes quiet before you finish. That quiet is the real applause."',
        onBreathFree: 'Your voice carries to the back of the hall without effort.',
        onBreathHeld: '"Release," Bernard whispers. "The song is bigger than your fear."',
      },
      choices: [
        {
          id: 'test-speak',
          label: 'Ask Bernard what song to perform',
          mode: 'speak',
          description: 'Bernard shakes his head. "Eleanor said yours. Not mine. I cannot give you this one."',
          leadsTo: 'final-performance',
          requiresPitchGate: true,
          bonusCondition: null,
          bonusLeadsTo: null,
        },
        {
          id: 'test-sing',
          label: '★ Begin composing the song right now',
          mode: 'sing',
          description: 'You do not wait for the feast. The song starts here, in Eleanor\'s anteroom, unrehearsed.',
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
      intervalName: 'Octave',
      targetNote: 'A5',
      targetFreq: 880,
      pitchLabel: 'A · Octave · 2:1 ratio · The return',
      setting: 'The feast. Forty courtiers. Eleanor in the center. Peire watching from the side. Bernard standing at the back, arms folded. You have the floor.',
      art: '/assets/adventures/troubadour/final-performance.png',
      atmosphere: 'warm-firelight',
      mentorLine: 'The octave. The same note, one level higher. You began here. You return here — transformed.',
      coachingCues: {
        onSceneEnter: 'Every interval you have found this week is in this moment.',
        onPitchPass: '"The octave rings. The hall hears their own breathing stop."',
        onPitchStruggle: '"It is the same A you found at the gate. You already know it."',
        onSingBonus: 'Eleanor stands. In her court, this means something specific: she is moved.',
        onBreathFree: 'Your breath moves the room. This is *voix vive* — the living voice.',
        onBreathHeld: '"Release everything," Bernard says from the back. "All of it."',
      },
      choices: [
        {
          id: 'final-speak',
          label: 'Perform the song as prepared',
          mode: 'speak',
          description: 'You sing the song you have been building all week. The court listens.',
          leadsTo: 'ending-patronage',
          requiresPitchGate: true,
          bonusCondition: { streak: 6 },
          bonusLeadsTo: 'ending-commission',
        },
        {
          id: 'final-sing',
          label: '★ Improvise — let the audience complete the song',
          mode: 'sing',
          description: 'You begin, and you leave a phrase unfinished — an open question for Eleanor to answer.',
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
      intervalName: 'Octave',
      targetNote: 'A5',
      targetFreq: 880,
      pitchLabel: 'A · The return home',
      setting: 'Eleanor grants you winter quarters at Poitiers. Not a commission — something better. Time. Space. The court will hear you again in spring.',
      art: '/assets/adventures/troubadour/ending-patronage.png',
      atmosphere: 'ember-warm',
      mentorLine: 'Bernard says: "You did not come here to be given a song. You came to find out you already had one."',
      coachingCues: {
        onSceneEnter: 'This is a real ending. Not all endings are commissions.',
        onPitchPass: 'The session is complete.',
        onPitchStruggle: 'Even at the end, the note matters.',
        onSingBonus: 'You sing the last note of the adventure. It rings longer than expected.',
        onBreathFree: 'You breathe easily for the first time since the gate.',
        onBreathHeld: 'Let it go. The story is done.',
      },
      choices: [],
      isEnding: true,
      endingType: 'patronage',
    },

    'ending-commission': {
      id: 'ending-commission',
      act: 3,
      intervalName: 'Octave',
      targetNote: 'A5',
      targetFreq: 880,
      pitchLabel: 'A · The return, transformed',
      setting: 'Eleanor commissions a canso — a full song cycle — for the court of spring. She hands you a sealed letter for the court of Bordeaux. You are no longer a visitor. You are a troubadour of Occitania.',
      art: '/assets/adventures/troubadour/ending-commission.png',
      atmosphere: 'luminous-gold',
      mentorLine: '"Now," Bernard says, "write the song about where you came from. That is always the second one."',
      coachingCues: {
        onSceneEnter: 'This ending is only available to those who sang their choices. Well done.',
        onPitchPass: 'The adventure is complete. Adventure II unlocks.',
        onPitchStruggle: 'Even now.',
        onSingBonus: 'The living voice. It was always yours.',
        onBreathFree: 'Free breath. Free voice. The same thing.',
        onBreathHeld: 'One last time: release.',
      },
      choices: [],
      isEnding: true,
      endingType: 'commission',
      unlocksAdventure: 'pythagorean-brotherhood',
    },
  },
};

export default TROUBADOUR;
