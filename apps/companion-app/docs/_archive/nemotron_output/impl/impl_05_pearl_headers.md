---
title: impl_05_pearl_headers
status: archive
tags: []
date: 2026-06-14
---
# IMPL 05: PEARL Headers

// ╔══ VOIX VIVE ═══════════════════════════════════════════════════╗
// ║ FILE    : OrientationHub.jsx                                   ║
// ║ WHAT    : Render the Orientation Hub landing page that presents course chapters as interactive frets on a guitar neck   ║
// ║ WHY     : Provide an engaging, metaphor‑driven entry point so students can navigate lessons via the familiar “neck” UI   ║
// ║ WHO     : student                                              ║
// ║ OWNS    : UI state for chapter progress, navigation, and locale settings                                            ║
// ║ NEEDS   : React, useState, useNavigate, lucide-icons (ArrowLeft, Home, BookOpen, Guitar, X, ShieldAlert, Award, Menu), frets data, SlideViewer, NeckMenu, generateSlides, getChapterProgress, AuthButton, useScaffolding, useLocale, DailyCalibration   ║
// ║ RULES   : Never replace the guitar‑neck metaphor with a generic list; chapter order must always derive from the frets data   ║
// ║ FIX AT  : Check frets import and SlideViewer props if chapters do not render                                      ║
// ║ STAGE   : IMPLEMENT                                            ║
// ╚═══════════════════════════════════════════════════════════════╝
// ╔══ VOIX VIVE ═══════════════════════════════════════════════════╗
// ║ FILE    : useTroubadourAI.js                                   ║
// ║ WHAT    : Provide a unified React hook that manages AI chat state, TTS, voice input, and backend selection for the Troubadour conversational agent   ║
// ║ WHY     : Centralize all AI‑related logic so UI components stay simple and the student experiences a consistent “living voice” (Bertrand’s) across the app   ║
// ║ WHO     : developer                                            ║
// ║ OWNS    : AI interaction state (isReady, isLoading, error, backend) and refs for remote/Wllama/Kokoro/voice services                     ║
// ║ NEEDS   : React hooks useState, useCallback, useRef; prompt builders buildCompressedPrompt, buildChatPrompt, enforceOver from ../data/troubadourPrompt   ║
// ║ RULES   : Never expose raw API keys; always read them from import.meta.env and fallback to offline mode if remote fails                     ║
// ║ FIX AT  : Verify REMOTE_URL and VITE_TROUBADOUR_API_KEY env vars and abortRef if the AI does not respond                                   ║
// ║ STAGE   : IMPLEMENT                                            ║
// ╚═══════════════════════════════════════════════════════════════╝
// ╔══ VOIX VIVE ═══════════════════════════════════════════════════╗
// ║ FILE    : saveState.js                                         ║
// ║ WHAT    : Export and import the complete Voix Vive app state (localStorage, IndexedDB tables, RAG vectors) as a portable .voixvive file   ║
// ║ WHY     : Allow students to back up their progress, migrate devices, or share learning journals without losing any data                     ║
// ║ WHO     : student                                              ║
// ║ OWNS    : Persisted app state – localStorage keys, all IndexedDB tables via db, and RAG database via exportRagData/importRagData            ║
// ║ NEEDS   : IndexedDB wrapper db from ./localDatabase; rag store functions exportRagData, importRagData from ./ragStore                     ║
// ║ RULES   : Never include sensitive credentials (API keys, tokens) in the exported file; increment the version number whenever the schema changes   ║
// ║ FIX AT  : If export/import fails, confirm that db.tables are defined and that exportRagData/importRagData resolve                         ║
// ║ STAGE   : IMPLEMENT                                            ║
// ╚═══════════════════════════════════════════════════════════════╝