// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : CharacterSheet.jsx (REDIRECT)                       ║
// ║ WHAT    : Re-exports the canonical playbook CharacterSheet    ║
// ║ WHY     : TruebadourLoom was importing the old 133-line stub  ║
// ║           when the full 617-line version lives in playbook/   ║
// ║           This redirect keeps imports working everywhere      ║
// ║ FIX     : May 29, 2026 — merged duplicate CharacterSheets    ║
// ╚═══════════════════════════════════════════════════════════════╝

// The canonical CharacterSheet lives in playbook/CharacterSheet.jsx
// This file exists so that `import CharacterSheet from './CharacterSheet'`
// continues to work in TruebadourLoom.jsx and anywhere else.
export { default } from './playbook/CharacterSheet';
