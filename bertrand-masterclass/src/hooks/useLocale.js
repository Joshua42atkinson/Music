import { useState, useCallback } from 'react';

const TRANSLATIONS = {
  en: {
    // Top Bar & Navigation
    exit: '← Exit',
    home: '← Home',
    coachPortal: 'Seeker Coach Portal',
    sovereignLocal: '🎙️ sovereign local-first',
    offlinePreview: '💤 offline preview',
    activeBrain: 'Active Local AI Brain',
    switchLanguage: 'Langue: Français',

    // Landing Screen
    choosePortal: 'Choose your portal',
    studentProfile: 'STUDENT PROFILE:',
    createNewProfile: '➕ Create New Profile...',
    adventureStories: '📚 ADVENTURE STORIES',
    learnWithBertrand: 'Learn with Bertrand →',
    privateLessons: 'Private lessons · Async coaching · Inner Circle',
    privateCoachingIntake: '⚜️ Private Coaching Intake',

    // PIN Modal
    verifyIdentity: 'Verify Identity',
    enterPinFor: 'Enter PIN for',
    incorrectPin: 'Incorrect PIN. Try again.',
    clear: 'CLEAR',
    cancel: 'Cancel',

    // Profile Modal
    createZenProfile: 'Create Zen Profile',
    studentName: 'Student Name',
    namePlaceholder: 'e.g. Jean-Luc',
    guitarStyleTarget: 'Guitar Style Target',
    acousticMelody: 'Acoustic Melody',
    classicalPolyphony: 'Classical Polyphony',
    flamencoAutonomic: 'Flamenco Autonomic',
    jazzChordFlow: 'Jazz Chord Flow',
    securityPin: 'Security PIN (Optional, 4 Digits)',
    create: 'Create',

    // Troubadour Adventure
    playAdventure: '🎭 TROUBADOUR ADVENTURE',
    adventureSubtitle: 'A pitch-gated story in Eleanor of Aquitaine\'s court',
    adventureResume: '🎭 RESUME ADVENTURE',
    adventureNewGame: 'Begin the Journey',
    adventureContinue: 'Continue from where you left off',
    advSkipPitch: 'Skip this pitch →',
    advSkipNoPenalty: 'No penalty — the story continues',
    advSkipCoaching: 'No worries — you can always come back to practice this pitch later.',
    advFindThe: '🎵 Find the ',
    advCompleteResponse: '✓ Complete Response',
    advTheCommission: '★ THE COMMISSION',
    advThePatronage: 'THE PATRONAGE',
    advAdventureComplete: 'ADVENTURE COMPLETE',
    advReturnToMenu: 'Return to Menu',
    advPitchAccuracy: 'Pitch Accuracy',
    advScenes: 'Scenes',
    advBonusPaths: 'Bonus Paths',
    advSungResponses: 'Sung Responses',

    // Mentor Dashboard
    mentorTitle: 'Sovereign Mentor Dashboard',
    mentorSubtitle: "Review student submissions, trigger Pythagoras acoustics analysis, and draft Socratic somatic responses offline.",
    selectStudent: 'Select a student submission to review:',
    noSubmissions: 'No student submissions found in local database.',
    exercise: 'Exercise',
    status: 'Status',
    date: 'Date',
    activeReview: 'Active Review Desk',
    studentVideo: 'Student Practice Video',
    triggerSocratic: 'Trigger Socratic AI Diagnostics',
    processingAI: '🧠 Running FFmpeg and Socratic AI...',
    somaticFeedback: 'Troubadour Somatic Feedback Draft',
    diagnosticScorecard: 'Pythagoras Diagnostic Scorecard',
    stampMacro: 'Somatic Stamp Macros (click to insert):',
    saveFinalReview: 'Save & Submit Somatic Review',
    stampPling: '©PLING! Stamp',
    stampShearl: '©SHEARL Stamp',
    stampFheal: '©FHEAL Stamp',

    // Vertiscale & Tavern Game
    vertiscaleEngine: '⚡ VERTISCALE ENGINE',
    howToPlay: '🎯 HOW TO PLAY',
    enableMic: '🎤 Enable Microphone',
    micActive: '🎤 Mic active — breath tracking enabled',
    vocalTrackingActive: '🎤 LISTENING FOR PITCH...',
    plingLocked: '✨ RESONANT GOLD ©PLING! LOCKED',
    tensionWarning: '⚠️ NECK TENSION DETECTED (+cents)',
    yourResponse: 'YOUR RESPONSE',
    singResponse: 'Sing your response...',
    viewSummary: 'View Journey Summary',
    exitGame: 'Exit Game',

    // Digital Binder
    fret: 'Fret',
    soon: 'Soon',
    the12Tools: '── THE 12 TOOLS ── ONE PER FRET ──',
    comingSoon: 'Coming Soon',
    troubadoursWorkshop: "Troubadour's Workshop",
    practiceToolsSubtitle: 'Your 12 practice tools — one per fret.',
    desktopService: 'Desktop Service (DaaS)',
    activeLocalAiBrain: 'Active Local AI Brain',
    probing: 'Probing...',
    redetect: '🔄 Redetect',
    activeAssignments: 'Active Assignments',
    oneDue: '1 Due',
    dueThursday: 'Due Thursday',
    recordPling: 'Record PLING! Protocol',
    recordPlingDesc: 'Record a 2-minute audio clip of yourself singing the minor 3rd interval and finding it on the A string.',
    recordAndSubmit: 'Record & Submit',
    mySubmissions: 'My Submissions',
    reviewed: 'Reviewed',
    sent: 'Sent',
    queued: 'Queued',
    prePracticeRitual: 'Pre-Practice Ritual',
    resetDaily: 'Reset Daily',
    bertrandsFeedback: "Bertrand's Feedback",
    cagedSubmission: 'CAGED Map Submission',
    feedbackDate: 'May 12, 2026',
    feedbackQuote: '"Your transition from the C-shape to the A-shape is much smoother. Keep watching that left thumb."',

    // Ambient Player
    ambientMusic: '♫ Ambient Music',
    metronome: '♩ Metronome',
    music: 'Music',
    click: 'Click',
    help: 'Help',
    nowPlaying: '♫ Now Playing',
    noAudioFile: 'No audio file found',
    tap: 'Tap',
    stop: 'Stop',
    start: 'Start',

    // Mentor Dashboard
    studentSubmissions: 'Student Submissions',
    socraticPreprocessingDesk: 'Socratic Preprocessing Desk',
    socraticDeskDesc: 'Spawn FFmpeg and run pitch auto-correlation + Gemma Socratic prompt drafting.',
    preprocessing: '🔄 Preprocessing...',
    studentVerbalStruggle: 'Student Verbal struggle',
    selectVideo: "Select a student's practice video from the left column to extract pitch metrics, run local AI Socratic analysis, and build subscription-free feedback.",

    // SlideViewer
    back: '← Back',
    swipeToRead: '← Swipe to read →',
    openFretboard: 'Open Fretboard',
    seconds: 'seconds',
    howMusicWorks: 'How Music Works',
    howGuitarWorks: 'How Guitar Works',
    launchTool: 'Launch Tool',
    practiceOnFretboard: 'Practice on Fretboard',
    openFretboardFrets: 'Open Fretboard — Frets',
    nextFret: 'Next Fret →',
    hideReferences: 'HIDE',
    viewReferences: 'VIEW',
    references: 'REFERENCES',

    // CoachingPortal
    coachingHubLabel: 'BERTRAND LAURENCE PRIVATE GUITAR HUB',
    coachingHubTitle: 'Guitar Coaching & Practice Intake',
    backToHub: '← Back to Hub',
    coachingPackagesTab: 'Coaching Packages',
    intakeFormTab: 'Lesson Intake Form',
    studentTelemetryTab: 'Student Telemetry',
    coachingPackagesTitle: 'PRIVATE GUITAR COACHING PACKAGES',
    coachingPackagesDesc: "Highly interactive personal coaching packages blending Bertrand's unique techniques, real-time pitch feedback, and fun practice tracking tools.",
    bookIntakeSession: 'Book Intake Session',
    intakeFormTitle: 'GUITAR COACHING INTAKE FORM',
    intakeFormDesc: 'This intake form helps Bertrand customize your practice routines. You can optionally scan your focus baseline using the webcam tool below.',
    intakeSubmitted: 'Intake Form Submitted',
    intakeSubmittedDesc: "Your intake details have been logged in Bertrand's local SQLite database. He will review your profile and contact you for scheduling shortly.",
    yourFullName: 'Your Full Name',
    practiceGoals: 'Your Practice Goals (Guitar styles, favorite songs)',
    practiceGoalsPlaceholder: 'Ex. Master chord transitions, learn fingerstyle, release neck strain...',
    shoulderTension: 'Shoulder Tension',
    vocalStrain: 'Vocal strain',
    thumbFatigue: 'Hand / Thumb Fatigue',
    focusScanTitle: 'OPTIONAL 15S PERFORMANCE FOCUS SCAN',
    focusScanDesc: 'Run the webcam rPPG validator to establish your practice focus index before submitting.',
    scanning: 'Scanning...',
    triggerFocusScan: 'Trigger Focus rPPG',
    calibrated: 'Successfully calibrated',
    submitProfile: 'Submit Somatic Candidate Profile',
    telemetryTitle: 'STUDENT PRACTICE & TELEMETRY PROGRESS',
    telemetryDesc: 'Review practice sessions, pitch stability improvements, and focus statistics over the course of the lessons.',
    autonomicTrendsTitle: 'Autonomic Flow Chronological Trends',
    autonomicTrendsDesc: 'Plots progressive somatic flow index metrics relative to castle performance templates.',

    // SongwritingCompanion
    troubadourQuill: "Troubadour's Quill",
    songwritingPoweredBy: 'Songwriting powered by your journal',
    connectForSongwriting: 'Connect the Voix Vive Desktop App to unlock AI songwriting. The Quill uses your local LLM to generate personalized lyrics from your practice data.',
    mood: 'Mood',
    themeOptional: 'Theme (optional)',
    themePlaceholder: 'e.g. my first song, the stars, the journey...',
    context: 'Context: ',
    min: ' min',
    daySuffix: ' day streak',
    breaths: 'breaths',
    composing: 'The Troubadour is composing...',
    invokeQuill: 'Invoke the Quill',
    songTitle: 'Title',
    lyricsEditable: 'Lyrics (editable)',
    savedToSongbook: '\u2713 Saved to Songbook!',
    saveToSongbook: 'Save to Songbook',
    untitled: 'Untitled',
    generationError: '\u26a0\ufe0f Generation error. Check DaaS connection.',
    resumeEditing: '\u270f\ufe0f Resume Editing',

    // BiometricSanctum
    flowZone: '\ud83c\udf0c Flow Zone',
    tensionSpike: '\u26a1 Tension Spike',
    somaticRest: '\ud83e\uddd8 Somatic Rest',
    somaticSanctum: 'SOMATIC FLOW SANCTUM',
    somaticSanctumSub: 'Simulated focus & vagal tone calibration',
    flowIndex: 'Flow Index',
    simulationMode: 'Simulation mode \u00b7 BLE & rPPG hardware coming soon',

    // PlaybookShell
    troubadourPlaybook: "Troubadour's Playbook",
    heroGuide: "12-Fret Hero's Guide",

    // QuestLog
    questLog: '\u2500\u2500 QUEST LOG \u2500\u2500',
    questFret: 'Fret',
    slidesLabel: 'Slides',
    masteryLabel: 'Mastery',
    reflectionsLabel: 'Reflections',
    reviewQuest: 'Review Quest',
    continueQuest: 'Continue Quest \u2192',

    // JournalEntry
    sessionReflection: 'Session Reflection',
    howAreYouFeeling: 'How are you feeling?',
    yourThoughts: 'Your thoughts...',
    skipBtn: 'Skip',
    savedReflection: '\u2713 Saved!',
    saveReflection: '\ud83d\udcdd Save Reflection',
    emptyJournal: 'Your journal is empty. Complete a tool session to write your first reflection.',
    journalTitle: '\u2500\u2500 JOURNAL \u2500\u2500',

    // CharacterSheet
    adventurer: 'Adventurer',
    streakLabel: 'Streak',
    minLabel: 'Min',
    breathsLabel: 'Breaths',
    florinsLabel: 'Florins',
    questsLabel: 'Quests',
    abilities: '\u2500\u2500 ABILITIES \u2500\u2500',
    intervalMastery: '\u2500\u2500 INTERVAL MASTERY \u2500\u2500',
    channelAttunement: '\u2500\u2500 CHANNEL ATTUNEMENT \u2500\u2500',
    // VertiscaleEngine
    ve_exit: '\u2190 Exit',
    ve_home: '\u2190 Home',
    ve_close: 'Close',
    ve_stage: 'STAGE',
    ve_studyGoldDots: 'Study the gold dots below \u2014 they show where the notes are on the fretboard.',
    ve_checkingAccuracy: 'Checking your placement accuracy...',
    ve_studyPattern: 'Study the pattern! You have a few seconds before it disappears.',
    ve_patternVanished: 'The pattern just vanished \u2014 get ready to tap!',
    ve_tapNotes: 'Tap where the notes were \u2014 trust your imagination!',
    ve_howToPlay: '\U0001f3af HOW TO PLAY',
    ve_howToPlayImagine: '\u2780 Study the gold dots \u2014 they show notes in the scale. \u2781 Tap the same positions. \u2782 Hold and breathe steadily until the timer completes.',
    ve_howToPlayFlash: '\u2780 Gold dots flash on the fretboard \u2014 study positions! \u2781 The pattern disappears. \u2782 Tap from memory. \u2783 Green = correct, Red = wrong, Orange = missed.',
    ve_preparingRound: 'Preparing next round...',
    ve_menuTitle: 'Vertiscale',
    ve_menuSubtitle: 'Train the imagination. The fingers follow.',
    ve_menuVertiscaleSubtitle: 'Train vertical scale patterns',
    ve_whatIsVertiscale: 'What is a Vertiscale?',
    ve_vertiscaleDesc1: 'A vertiscale is a vertical scale shape on the guitar neck. Instead of playing a scale horizontally (across frets), you play it vertically (across strings in the same fret area).',
    ve_vertiscaleDesc2: 'This teaches you to see patterns in all directions \u2014 the foundation of fretboard mastery.',
    ve_vertiscaleDesc3: "Don\u2019t worry if you\u2019re new \u2014 the game starts simple (just 2 strings) and gradually adds more.",
    ve_speed: 'LEVEL:',
    ve_slow: 'Kinesthetic Awakening',
    ve_slowDesc: 'Pattern stays 3.5s — kinesthetic focus',
    ve_medium: 'Applied Practice',
    ve_mediumDesc: 'Pattern stays 2.5s — applied work',
    ve_fast: 'Flow State',
    ve_fastDesc: 'Pattern stays 1.5s',
    ve_scaleType: 'SCALE TYPE:',
    ve_pentatonic: '\u266a Pentatonic',
    ve_major: '\u266b Major',
    ve_minor: '\u266d Minor',
    ve_dorian: '\u266e Dorian',
    ve_mixolydian: '\u266f Mixolydian',
    ve_blues: '\U0001f3b7 Blues',
    ve_enableMic: '\U0001f3a4 Enable Microphone (optional)',
    ve_micActive: '\U0001f3a4 Mic active \u2014 breath tracking enabled',
    ve_innerFretboard: 'THE INNER FRETBOARD',
    ve_innerFretboardDesc: 'Train your visual memory of where notes live on the guitar neck',
    ve_flashLabel: '\u26a1 FLASH \u00b7 Quick Recall',
    ve_flashDesc: 'A pattern of notes flashes on the fretboard. Study it carefully \u2014 then it disappears! Tap from your imagination to recreate where the notes were.',
    ve_imagineLabel: '\U0001fab4 IMAGINE \u00b7 Sustained Hold',
    ve_imagineDesc: 'The pattern stays visible while you place your taps. Focus on accuracy and steady breathing.',
    ve_innerEar: 'THE INNER EAR',
    ve_innerEarDesc: 'Develop your ability to hear and match pitches',
    ve_audiateLabel: '\U0001f3b5 AUDIATE \u00b7 Pling! Orbs',
    ve_audiateDesc: 'A note descends the screen. Try to hear it in your mind first, then sing it into the microphone.',
    ve_innerVoice: 'THE INNER VOICE',
    ve_innerVoiceDesc: 'Reflect on what your practice sessions reveal',
    ve_reflectLabel: '\U0001f4dd REFLECT \u00b7 Session Journal',
    ve_reflectDesc: 'Review your session performance. See where you were accurate, where you struggled, and journal about what you noticed.',
    ve_livingStory: 'THE LIVING STORY',
    ve_livingStoryDesc: 'Learn through an immersive historical narrative',
    ve_adventureLabel: '\U0001f3f0 ADVENTURE \u00b7 The Troubadour',
    ve_adventureDesc: 'Play through a historical story as a medieval troubadour. At key moments, you must match a musical pitch to unlock the next chapter.',
    ve_hearInMind: "Hear the note in your mind. Don\u2019t sing yet\u2026",
    ve_summaryTitle: 'Session Complete',
    ve_avgScore: 'AVG SCORE',
    ve_statRoot: 'Root',
    ve_statRounds: 'Rounds',
    ve_statBest: 'Best',
    ve_statStreak: 'Streak',
    ve_streakYes: '\u2713 Yes',
    ve_streakNo: 'Not yet',
    ve_roundHistory: 'ROUND HISTORY',
    ve_fhealReflection: 'FHEAL REFLECTION',
    ve_fhealPlaceholder: "What did your hands remember that your mind forgot?\nWhere was the gap between imagination and reality?\nWhat surprised you?",
    ve_again: '\u21bb Again',
    ve_done: 'Done',
  },
  fr: {
    // Top Bar & Navigation
    exit: '← Quitter',
    home: '← Accueil',
    coachPortal: 'Portail de Mentorat',
    sovereignLocal: '🎙️ souverain local',
    offlinePreview: '💤 aperçu hors-ligne',
    activeBrain: 'Cerveau IA local actif',
    switchLanguage: 'Language: English',

    // Landing Screen
    choosePortal: 'Choisissez votre portail',
    studentProfile: 'PROFIL ÉTUDIANT :',
    createNewProfile: '➕ Créer un Nouveau Profil...',
    adventureStories: '📚 HISTOIRES D\'AVENTURE',
    learnWithBertrand: 'Apprendre avec Bertrand →',
    privateLessons: 'Leçons privées · Mentorat asynchrone · Cercle restreint',
    privateCoachingIntake: '⚜️ Candidature Mentorat Privé',

    // PIN Modal
    verifyIdentity: 'Vérifier l\'Identité',
    enterPinFor: 'Saisir le PIN pour',
    incorrectPin: 'Code PIN incorrect. Réessayez.',
    clear: 'EFFACER',
    cancel: 'Annuler',

    // Profile Modal
    createZenProfile: 'Créer un Profil Zen',
    studentName: 'Nom de l\'Étudiant',
    namePlaceholder: 'ex. Jean-Luc',
    guitarStyleTarget: 'Style de Guitare Ciblé',
    acousticMelody: 'Mélodie Acoustique',
    classicalPolyphony: 'Polyphonie Classique',
    flamencoAutonomic: 'Flamenco Autonome',
    jazzChordFlow: 'Flux d\'Accords de Jazz',
    securityPin: 'Code PIN de Sécurité (Optionnel, 4 Chiffres)',
    create: 'Créer',

    // Troubadour Adventure
    playAdventure: '🎭 AVENTURE TROUBADOUR',
    adventureSubtitle: 'Une histoire à portail de ton dans la cour d\'Aliénor d\'Aquitaine',
    adventureResume: '🎭 REPRENDRE L\'AVENTURE',
    adventureNewGame: 'Commencer le Voyage',
    adventureContinue: 'Reprendre là où vous en étiez',
    advSkipPitch: 'Sauter cette note →',
    advSkipNoPenalty: 'Sans pénalité — l\'histoire continue',
    advSkipCoaching: 'Pas de soucis — vous pouvez toujours revenir pratiquer ce ton plus tard.',
    advFindThe: '🎵 Trouver le ',
    advCompleteResponse: '✓ Terminer la Réponse',
    advTheCommission: '★ LA COMMANDE',
    advThePatronage: 'LE PATRONAGE',
    advAdventureComplete: 'AVENTURE TERMINÉE',
    advReturnToMenu: 'Retour au Menu',
    advPitchAccuracy: 'Précision de Ton',
    advScenes: 'Scènes',
    advBonusPaths: 'Chemins Bonus',
    advSungResponses: 'Chants Réalisés',

    // Mentor Dashboard
    mentorTitle: 'Tableau de Mentorat Souverain',
    mentorSubtitle: "Examinez les sessions d'élèves, déclenchez l'analyse acoustique Pythagore et rédigez des retours somatiques socratiques en local.",
    selectStudent: 'Sélectionnez une session d\'élève à examiner :',
    noSubmissions: 'Aucune session d\'élève trouvée dans la base locale.',
    exercise: 'Exercice',
    status: 'Statut',
    date: 'Date',
    activeReview: 'Pupitre d\'Analyse Active',
    studentVideo: 'Vidéo de Pratique de l\'Élève',
    triggerSocratic: 'Déclencher l\'IA Socratique',
    processingAI: '🧠 Traitement FFmpeg et IA Socratique...',
    somaticFeedback: 'Brouillon Somatique du Troubadour',
    diagnosticScorecard: 'Fiche de Diagnostic de Pythagore',
    stampMacro: 'Macros de Timbres Somatiques (cliquez pour insérer) :',
    saveFinalReview: 'Enregistrer et Soumettre l\'Évaluation',
    stampPling: 'Timbre ©Le PLING!',
    stampShearl: 'Timbre ©Le CISAILLEMENT',
    stampFheal: 'Timbre ©La GUÉRISON',

    // Vertiscale & Tavern Game
    vertiscaleEngine: '⚡ MOTEUR VERTISCALE',
    howToPlay: '🎯 COMMENT JOUER',
    enableMic: '🎤 Activer le Microphone',
    micActive: '🎤 Micro actif — suivi respiratoire activé',
    vocalTrackingActive: '🎤 ANALYSE DE LA VOIX...',
    plingLocked: '✨ GOLD RESONANCE ©Le PLING! VÉRROUILLÉ',
    tensionWarning: '⚠️ TENSION DU COU DÉTECTÉE (+cents)',
    yourResponse: 'VOTRE RÉPONSE',
    singResponse: 'Chantez votre réponse...',
    viewSummary: 'Voir le Résumé du Voyage',
    exitGame: 'Quitter le Jeu',

    // Digital Binder
    fret: 'Frette',
    soon: 'Bientôt',
    the12Tools: '── LES 12 OUTILS ── UN PAR FRETTE ──',
    comingSoon: 'À Venir',
    troubadoursWorkshop: "L'Atelier du Troubadour",
    practiceToolsSubtitle: 'Vos 12 outils de pratique — un par frette.',
    desktopService: 'Service de Bureau (DaaS)',
    activeLocalAiBrain: "Cerveau d'IA Local Actif",
    probing: 'Recherche...',
    redetect: '🔄 Redétecter',
    activeAssignments: 'Devoirs Actifs',
    oneDue: '1 Requis',
    dueThursday: 'Pour Jeudi',
    recordPling: 'Enregistrer le Protocole PLING!',
    recordPlingDesc: "Enregistrez un clip audio de 2 minutes de vous-même chantant l'intervalle de tierce mineure et le trouvant sur la corde de La.",
    recordAndSubmit: 'Enregistrer & Soumettre',
    mySubmissions: 'Mes Soumissions',
    reviewed: 'Corrigé',
    sent: 'Envoyé',
    queued: 'En Attente',
    prePracticeRitual: 'Rituel de Pré-Pratique',
    resetDaily: 'Réinitialiser',
    bertrandsFeedback: 'Retours de Bertrand',
    cagedSubmission: 'Soumission de Cartographie CAGED',
    feedbackDate: '12 Mai 2026',
    feedbackQuote: '"Votre transition de la forme C à la forme A est beaucoup plus fluide. Continuez à surveiller la position de votre pouce gauche."',

    // Ambient Player
    ambientMusic: '♫ Musique Ambiante',
    metronome: '♩ Métronome',
    music: 'Musique',
    click: 'Métronome',
    help: 'Aide',
    nowPlaying: '♫ En Lecture',
    noAudioFile: 'Aucun fichier audio trouvé',
    tap: 'Taper',
    stop: 'Arrêter',
    start: 'Lancer',

    // Mentor Dashboard
    studentSubmissions: 'Sessions Éleves',
    socraticPreprocessingDesk: "Pupitre d'IA Socratique",
    socraticDeskDesc: "Déclenche FFmpeg, extrait l'analyse acoustique Pythagore et génère des propositions socratiques.",
    preprocessing: '🔄 Traitement...',
    studentVerbalStruggle: "Difficulté exprimée par l'élève",
    selectVideo: "Sélectionnez une vidéo de pratique à gauche pour analyser la justesse, exécuter le diagnostic Socratique local et rédiger un retour d'expérience.",

    // SlideViewer
    back: '← Retour',
    swipeToRead: '← Balayez pour lire →',
    openFretboard: 'Ouvrir la touche',
    seconds: 'secondes',
    howMusicWorks: 'Comment fonctionne la musique',
    howGuitarWorks: 'Comment fonctionne la guitare',
    launchTool: "Lancer l'Outil",
    practiceOnFretboard: 'Pratiquer sur la touche',
    openFretboardFrets: 'Ouvrir la touche — Frettes',
    nextFret: 'Frette Suivante →',
    hideReferences: 'MASQUER',
    viewReferences: 'VOIR',
    references: 'LES RÉFÉRENCES',

    // CoachingPortal
    coachingHubLabel: 'COURS DE GUITARE & PORTAIL INTÉGRÉ',
    coachingHubTitle: 'Cours de Guitare & Coaching Privé',
    backToHub: '← Retour au Hub',
    coachingPackagesTab: 'Forfaits de Coaching',
    intakeFormTab: "Formulaire d'Intake",
    studentTelemetryTab: 'Suivi de Pratique',
    coachingPackagesTitle: 'FORFAITS DE COACHING DE GUITARE',
    coachingPackagesDesc: "Des formules de coaching sur mesure associant la pédagogie unique de Bertrand, l'analyse de justesse en temps réel et des outils ludiques de suivi.",
    bookIntakeSession: 'Planifier une session',
    intakeFormTitle: "FORMULAIRE D'INTAKE DE GUITARE",
    intakeFormDesc: "Ce formulaire permet à Bertrand de personnaliser vos routines d'exercice. Vous pouvez optionnellement évaluer votre niveau de concentration.",
    intakeSubmitted: "Formulaire d'Intake Transmis",
    intakeSubmittedDesc: 'Vos informations ont été enregistrées localement. Bertrand vous contactera très rapidement pour planifier votre premier cours.',
    yourFullName: 'Votre Nom',
    practiceGoals: 'Vos Objectifs (Styles de Guitare, Morceaux préférés)',
    practiceGoalsPlaceholder: "Ex. Apprendre le chord melody, enchaîner mes accords sans fatigue...",
    shoulderTension: 'Tension Épaules',
    vocalStrain: 'Tension Gorge / Voix',
    thumbFatigue: 'Fatigue Pouce / Main',
    focusScanTitle: 'ÉVALUER MON NIVEAU DE CONCENTRATION (15S OPTE)',
    focusScanDesc: 'Activez la caméra ci-dessous pour capturer votre rythme cardiaque et calculer votre indice de focus de départ.',
    scanning: 'Analyse...',
    triggerFocusScan: 'Lancer le Scan rPPG',
    calibrated: 'Étalonné avec succès',
    submitProfile: 'Déposer sa Candidature Somatique',
    telemetryTitle: 'TABLEAU DE BORD DE PRATIQUE DES ÉLÈVES',
    telemetryDesc: 'Visualisez les sessions de pratique, la stabilité de la justesse et les statistiques de concentration des élèves.',
    autonomicTrendsTitle: 'Visualisation de Tendance Physiologique',
    autonomicTrendsDesc: "Affiche l'évolution de l'Index de Flow Somatique par rapport aux exercices d'Occitanie.",

    // SongwritingCompanion
    troubadourQuill: 'Plume du Troubadour',
    songwritingPoweredBy: 'Écriture de chansons alimentée par votre journal',
    connectForSongwriting: "Connectez l'application de bureau Voix Vive pour débloquer l'écriture de chansons IA. La Plume utilise votre LLM local pour générer des paroles personnalisées.",
    mood: 'Humeur',
    themeOptional: 'Thème (optionnel)',
    themePlaceholder: 'Ex: ma première chanson, les étoiles, le voyage...',
    context: 'Contexte : ',
    min: ' min',
    daySuffix: ' jours',
    breaths: 'respirations',
    composing: 'Le Troubadour compose...',
    invokeQuill: 'Invoquer la Plume',
    songTitle: 'Titre',
    lyricsEditable: 'Paroles (modifiables)',
    savedToSongbook: '\u2713 Sauvegardé dans le Recueil !',
    saveToSongbook: 'Sauvegarder dans le Recueil',
    untitled: 'Sans Titre',
    generationError: '\u26a0\ufe0f Erreur de génération. Vérifiez la connexion DaaS.',
    resumeEditing: '\u270f\ufe0f Reprendre',

    // BiometricSanctum
    flowZone: '\ud83c\udf0c Zone Flow',
    tensionSpike: '\u26a1 Tension',
    somaticRest: '\ud83e\uddd8 Sommeil',
    somaticSanctum: 'SANCTUAIRE SOMATIQUE',
    somaticSanctumSub: 'Simulateur de focus et tonus vagal',
    flowIndex: 'Index Flow',
    simulationMode: 'Mode simulation \u00b7 BLE et rPPG bient\u00f4t disponibles',

    // PlaybookShell
    troubadourPlaybook: 'Le Grimoire du Troubadour',
    heroGuide: 'Guide du h\u00e9ros en 12 frettes',

    // QuestLog
    questLog: '\u2500\u2500 JOURNAL DE QU\u00caTE \u2500\u2500',
    questFret: 'Frette',
    slidesLabel: 'Diapositives',
    masteryLabel: 'Ma\u00eetrise',
    reflectionsLabel: 'R\u00e9flexions',
    reviewQuest: 'Revoir la Qu\u00eate',
    continueQuest: 'Continuer la Qu\u00eate \u2192',

    // JournalEntry
    sessionReflection: 'R\u00e9flexion de Session',
    howAreYouFeeling: 'Comment vous sentez-vous\u00a0?',
    yourThoughts: 'Vos pens\u00e9es...',
    skipBtn: 'Passer',
    savedReflection: '\u2713 Sauvegard\u00e9\u00a0!',
    saveReflection: '\ud83d\udcdd Sauvegarder',
    emptyJournal: "Votre journal est vide. Terminez une session d'outil pour \u00e9crire votre premi\u00e8re r\u00e9flexion.",
    journalTitle: '\u2500\u2500 JOURNAL \u2500\u2500',

    // CharacterSheet
    adventurer: 'Aventurier',
    streakLabel: 'S\u00e9rie',
    minLabel: 'Min',
    breathsLabel: 'Souffles',
    florinsLabel: 'Florins',
    questsLabel: 'Qu\u00eates',
    abilities: '\u2500\u2500 COMP\u00c9TENCES \u2500\u2500',
    intervalMastery: '\u2500\u2500 MA\u00ceTRISE DES INTERVALLES \u2500\u2500',
    channelAttunement: '\u2500\u2500 ACCORD DES CANAUX \u2500\u2500',
    // VertiscaleEngine
    ve_exit: '\u2190 Quitter',
    ve_home: '\u2190 Accueil',
    ve_close: 'Fermer',
    ve_stage: '\u00c9TAPE',
    ve_studyGoldDots: '\u00c9tudiez les points dor\u00e9s ci-dessous \u2014 ils indiquent l\u2019emplacement des notes sur le manche.',
    ve_checkingAccuracy: 'V\u00e9rification de la pr\u00e9cision de votre placement...',
    ve_studyPattern: '\u00c9tudiez le motif\u00a0! Vous avez quelques secondes avant qu\u2019il ne disparaisse.',
    ve_patternVanished: 'Le motif vient de dispara\u00eetre \u2014 pr\u00e9parez-vous \u00e0 tapoter\u00a0!',
    ve_tapNotes: 'Tapez o\u00f9 se trouvaient les notes \u2014 faites confiance \u00e0 votre imagination\u00a0!',
    ve_howToPlay: '\U0001f3af COMMENT JOUER',
    ve_howToPlayImagine: '\u2780 \u00c9tudiez les points dor\u00e9s. \u2781 Tapotez les m\u00eames positions. \u2782 Maintenez votre position et respirez calmement.',
    ve_howToPlayFlash: '\u2780 Les points dor\u00e9s clignotent. \u2781 Le motif va dispara\u00eetre. \u2782 Tapotez de m\u00e9moire. \u2783 Vert = correct, Rouge = faux, Orange = manqu\u00e9.',
    ve_preparingRound: 'Pr\u00e9paration de la manche suivante...',
    ve_menuTitle: 'Vertiscale',
    ve_menuSubtitle: 'Entra\u00eenez l\u2019imagination. Les doigts suivent.',
    ve_menuVertiscaleSubtitle: 'Entra\u00eener les motifs verticaux',
    ve_whatIsVertiscale: 'Qu\u2019est-ce qu\u2019une Vertiscale\u00a0?',
    ve_vertiscaleDesc1: 'Une vertiscale est une forme de gamme verticale sur le manche de guitare.',
    ve_vertiscaleDesc2: 'Cela vous apprend \u00e0 voir les motifs dans toutes les directions \u2014 le fondement de la ma\u00eetrise du manche.',
    ve_vertiscaleDesc3: "Ne vous inqui\u00e9tez pas si vous d\u00e9butez \u2014 le jeu commence simplement et en ajoute progressivement d\u2019autres.",
    ve_speed: 'NIVEAU\u00a0:',
    ve_slow: 'Éveil Kinesthésique',
    ve_slowDesc: 'Le motif reste 3,5s — focus kinesthésique',
    ve_medium: 'Pratique Appliquée',
    ve_mediumDesc: 'Le motif reste 2,5s — travail appliqué',
    ve_fast: 'État de Flow',
    ve_fastDesc: 'Le motif reste 1,5s',
    ve_scaleType: 'TYPE DE GAMME\u00a0:',
    ve_pentatonic: '\u266a Pentatonique',
    ve_major: '\u266b Majeure',
    ve_minor: '\u266d Mineure',
    ve_dorian: '\u266e Dorien',
    ve_mixolydian: '\u266f Mixolydien',
    ve_blues: '\U0001f3b7 Blues',
    ve_enableMic: '\U0001f3a4 Activer le microphone (optionnel)',
    ve_micActive: '\U0001f3a4 Micro actif \u2014 suivi respiratoire activ\u00e9',
    ve_innerFretboard: 'LE MANCHE INT\u00c9RIEUR',
    ve_innerFretboardDesc: 'Entra\u00eenez votre m\u00e9moire visuelle de l\u2019emplacement des notes sur le manche',
    ve_flashLabel: '\u26a1 FLASH \u00b7 Rappel Rapide',
    ve_flashDesc: 'Un motif de notes clignote sur la touche. \u00c9tudiez-le \u2014 puis il dispara\u00eet\u00a0!',
    ve_imagineLabel: '\U0001fab4 IMAGINE \u00b7 Maintien Soutenu',
    ve_imagineDesc: 'Le motif reste visible pendant que vous tapotez. Concentrez-vous sur la pr\u00e9cision et une respiration stable.',
    ve_innerEar: 'L\u2019OREILLE INT\u00c9RIEURE',
    ve_innerEarDesc: 'D\u00e9veloppez votre capacit\u00e9 \u00e0 entendre et \u00e0 faire correspondre les hauteurs',
    ve_audiateLabel: '\U0001f3b5 AUDIATION \u00b7 Orbes Pling\u00a0!',
    ve_audiateDesc: 'Une note descend sur l\u2019\u00e9cran. Essayez d\u2019abord de l\u2019entendre dans votre esprit, puis chantez-la dans le micro.',
    ve_innerVoice: 'LA VOIX INT\u00c9RIEURE',
    ve_innerVoiceDesc: 'R\u00e9fl\u00e9chissez \u00e0 ce que r\u00e9v\u00e8lent vos s\u00e9ances de pratique',
    ve_reflectLabel: '\U0001f4dd R\u00c9FLEXION \u00b7 Journal de Session',
    ve_reflectDesc: 'Passez en revue les performances de votre session.',
    ve_livingStory: 'L\u2019HISTOIRE VIVANTE',
    ve_livingStoryDesc: 'Apprenez \u00e0 travers un r\u00e9cit historique immersif',
    ve_adventureLabel: '\U0001f3f0 AVENTURE \u00b7 Le Troubadour',
    ve_adventureDesc: 'Incarnez un troubadour m\u00e9di\u00e9val. Aux moments cl\u00e9s, vous devez faire correspondre une note.',
    ve_hearInMind: 'Entendez la note dans votre esprit. Ne chantez pas encore\u2026',
    ve_summaryTitle: 'Session Termin\u00e9e',
    ve_avgScore: 'SCORE MOYEN',
    ve_statRoot: 'Tonique',
    ve_statRounds: 'Manches',
    ve_statBest: 'Meilleur',
    ve_statStreak: 'S\u00e9rie',
    ve_streakYes: '\u2713 Oui',
    ve_streakNo: 'Pas encore',
    ve_roundHistory: 'HISTORIQUE DES MANCHES',
    ve_fhealReflection: 'R\u00c9FLEXION D\u2019INT\u00c9GRATION',
    ve_fhealPlaceholder: "Qu\u2019est-ce que vos mains ont m\u00e9moris\u00e9 que votre esprit a oubli\u00e9?\nO\u00f9 s\u2019est situ\u00e9 l\u2019\u00e9cart entre l\u2019imagination et la r\u00e9alit\u00e9?\nQu\u2019est-ce qui vous a surpris?",
    ve_again: '\u21bb Encore',
    ve_done: 'Termin\u00e9',
  }
};

const SOMATIC_TERMS = {
  en: {
    PLING: '©PLING!',
    SHEARL: '©SHEARL',
    FHEAL: '©FHEAL'
  },
  fr: {
    PLING: '©Le PLING!',
    SHEARL: '©Le CISAILLEMENT',
    FHEAL: '©La GUÉRISON'
  }
};

export function useLocale() {
  const [locale, setLocaleState] = useState(() => {
    try {
      const saved = localStorage.getItem('voixvive_locale');
      return saved === 'fr' ? 'fr' : 'en';
    } catch {
      return 'en';
    }
  });

  const setLocale = useCallback((newLocale) => {
    const loc = newLocale === 'fr' ? 'fr' : 'en';
    setLocaleState(loc);
    try {
      localStorage.setItem('voixvive_locale', loc);
    } catch {
      // Ignore localStorage errors in sandboxed/restricted environments
    }
  }, []);

  const toggleLocale = useCallback(() => {
    setLocaleState(currentLocale => {
      const newLocale = currentLocale === 'en' ? 'fr' : 'en';
      try {
        localStorage.setItem('voixvive_locale', newLocale);
      } catch {
        // Ignore localStorage errors
      }
      return newLocale;
    });
  }, []);

  // Translation helper
  const t = useCallback((key) => {
    try {
      const activeDict = TRANSLATIONS[locale] || TRANSLATIONS.en;
      return activeDict[key] || TRANSLATIONS.en[key] || key;
    } catch (error) {
      console.error('[useLocale] Translation error:', error);
      return key;
    }
  }, [locale]);

  // Localized somatic concepts
  const somatic = useCallback((term) => {
    try {
      const activeSomatic = SOMATIC_TERMS[locale] || SOMATIC_TERMS.en;
      return activeSomatic[term] || SOMATIC_TERMS.en[term] || term;
    } catch (error) {
      console.error('[useLocale] Somatic translation error:', error);
      return term;
    }
  }, [locale]);

  return {
    locale,
    setLocale,
    toggleLocale,
    t,
    somatic,
    isFrench: locale === 'fr',
  };
}
