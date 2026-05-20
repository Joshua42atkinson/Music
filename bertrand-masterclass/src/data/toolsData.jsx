import React from 'react';
import { Wind, Timer, Music, Feather, Grid3x3, BookOpen, Mic, Activity, Zap, Video, Layers, Play } from 'lucide-react';

// Fret marker positions — mirroring standard guitar dot inlays
export const FRET_INLAY_POSITIONS = new Set([3, 5, 7, 9, 12]);

export const TOOLS_CATALOG = [
  {
    id: 1, name: 'Breathing Gate', shortName: 'Breathe', desc: 'Somatic Scan',
    telemetry: 'Clearing physical and mental Distortion before playing',
    protocol: 'SHEARL', phase: 'Prepare', chromatic: 'C', monomyth: 'Call to Adventure',
    status: 'available', icon: <Wind size={20} />,
  },
  {
    id: 2, name: 'Practice Timer', shortName: 'Timer', desc: 'Tuning The Player',
    telemetry: 'Pomodoro-style session tracking — Practice TOO SLOW',
    protocol: 'SHEARL', phase: 'Prepare', chromatic: 'C#', monomyth: 'Refusal of the Call',
    status: 'available', icon: <Timer size={20} />,
  },
  {
    id: 3, name: 'Pitch Room', shortName: 'Pitch', desc: 'Listening & Pitch Alignment',
    telemetry: 'Interval ear training — hear two notes, name the interval',
    protocol: 'PLING!', phase: 'Listen', chromatic: 'D', monomyth: 'Meeting the Mentor',
    status: 'available', icon: <Music size={20} />,
  },
  {
    id: 4, name: "Troubadour's Quill", shortName: 'Quill', desc: 'Reflective Songwriting',
    telemetry: 'AI-assisted songwriting from your practice journals and somatic reflections',
    protocol: 'FHEAL', phase: 'Create', chromatic: 'D#', monomyth: 'Crossing the Threshold',
    status: 'available', icon: <Feather size={20} />,
  },
  {
    id: 5, name: 'Interval Visualizer', shortName: 'Intervals', desc: 'Interval Visualization',
    telemetry: 'Tap two notes — see and hear the interval between them',
    protocol: 'SHEARL', phase: 'See', chromatic: 'E', monomyth: 'Tests, Allies, Enemies',
    status: 'available', icon: <Grid3x3 size={20} />,
  },
  {
    id: 6, name: 'The Grid Map', shortName: 'Grid', desc: 'Spatial Chord Shifting',
    telemetry: 'Illuminating The Grid — explore CAGED geometry interactively',
    protocol: 'SHEARL', phase: 'See', chromatic: 'F', monomyth: 'Approach to the Inmost Cave',
    status: 'available', icon: <BookOpen size={20} />,
  },
  {
    id: 7, name: 'PLING! Trainer', shortName: 'PLING!', desc: 'Vocal-Motor Integration',
    telemetry: 'Sing a note into the mic — see if your voice matches the guitar',
    protocol: 'PLING!', phase: 'Sing & Play', chromatic: 'F#', monomyth: 'The Ordeal',
    status: 'available', icon: <Mic size={20} />,
  },
  {
    id: 8, name: 'Microtonal Tracker', shortName: 'Micro', desc: 'Expressive Interpretation',
    telemetry: 'Real-time cents deviation — perfect for vibrato and bending intonation',
    protocol: 'FHEAL', phase: 'Feel', chromatic: 'G', monomyth: 'The Reward',
    status: 'available', icon: <Activity size={20} />,
  },
  {
    id: 9, name: 'Playable Guitar', shortName: 'Guitar', desc: 'Interactive Fretboard',
    telemetry: 'Full 12-fret interactive guitar map — tap notes to explore intervals and scales',
    protocol: 'SHEARL', phase: 'Play', chromatic: 'G#', monomyth: 'The Road Back',
    status: 'available', icon: <Zap size={20} />,
  },
  {
    id: 10, name: 'Async Assessor', shortName: 'Submit', desc: 'Mentor Feedback',
    telemetry: "Capture your performance for Bertrand's asynchronous review",
    protocol: 'FHEAL', phase: 'Perform', chromatic: 'A', monomyth: 'The Resurrection',
    status: 'available', icon: <Video size={20} />,
  },
  {
    id: 11, name: 'Multi-Key Hub', shortName: 'Multi-Key', desc: 'Multi-Key Fluency',
    telemetry: 'See any scale across all 12 keys at once — tap to explore each pattern',
    protocol: 'FHEAL', phase: 'Transcend', chromatic: 'A#', monomyth: 'Return with the Elixir',
    status: 'available', icon: <Layers size={20} />,
  },
  {
    id: 12, name: 'Rhythm Engine', shortName: 'Rhythm', desc: 'Channeling The Song',
    telemetry: 'Free-form improvisation over backing tracks — reach Rubedo',
    protocol: 'FHEAL', phase: 'Create', chromatic: 'B', monomyth: 'Master of Two Worlds',
    status: 'available', icon: <Play size={20} />,
  },
];
