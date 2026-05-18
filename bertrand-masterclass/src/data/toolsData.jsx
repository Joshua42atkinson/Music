import React from 'react';
import { BookOpen, Play, Music, Clock, Settings, Wrench, Activity, Mic, Video, Maximize, Wind, Timer } from 'lucide-react';

export const TOOLS_CATALOG = [
  { 
    id: 1, 
    name: 'Breathing Gate', 
    desc: 'Somatic Baseline', 
    telemetry: 'Physical readiness and deep breathing protocol',
    status: 'available', 
    icon: <Wind size={18} /> 
  },
  { 
    id: 2, 
    name: 'Practice Timer', 
    desc: 'Tension Mitigation', 
    telemetry: 'Pomodoro-style session tracking with "Too Slow" reminders',
    status: 'available', 
    icon: <Timer size={18} /> 
  },
  { 
    id: 3, 
    name: 'Pitch Room', 
    desc: 'Listening & Pitch Alignment', 
    telemetry: 'Interval ear training game and pitch accuracy checks',
    status: 'available', 
    icon: <Wrench size={18} /> 
  },
  { 
    id: 4, 
    name: 'Metronome', 
    desc: 'Tactile Fretboard Contact', 
    telemetry: 'Tap tempo, BPM control, and rhythmic alignment',
    status: 'available', 
    icon: <Clock size={18} /> 
  },
  { 
    id: 5, 
    name: 'Interval Visualizer', 
    desc: 'Interval Visualization', 
    telemetry: 'Tracking intervals via visual prompts',
    status: 'planned', 
    icon: <Maximize size={18} /> 
  },
  { 
    id: 6, 
    name: 'Vertiscape Map', 
    desc: 'Spatial Chord Shifting', 
    telemetry: 'Tracking spatial movement across CAGED chord shapes',
    status: 'available', 
    icon: <BookOpen size={18} /> 
  },
  { 
    id: 7, 
    name: 'PLING! Trainer', 
    desc: 'Vocal-Motor Integration', 
    telemetry: 'Dual audio tracking to check vocal and guitar alignment',
    status: 'available', 
    icon: <Mic size={18} /> 
  },
  { 
    id: 8, 
    name: 'Microtonal Tracker', 
    desc: 'Expressive Interpretation', 
    telemetry: 'Pitch-bending tracking and microtonal variance detection',
    status: 'planned', 
    icon: <Activity size={18} /> 
  },
  { 
    id: 9, 
    name: 'Speed-Gate Engine', 
    desc: 'Spatial Integration', 
    telemetry: 'Speed-gated vertical and horizontal scale tracking',
    status: 'planned', 
    icon: <Activity size={18} /> 
  },
  { 
    id: 10, 
    name: 'Async Assessor', 
    desc: 'Async Mastery Assessment', 
    telemetry: 'Audio/video capture of performance for evaluation',
    status: 'available', 
    icon: <Video size={18} /> 
  },
  { 
    id: 11, 
    name: 'Multi-Key Hub', 
    desc: 'Multi-Key Fluency', 
    telemetry: 'Advanced scale transitions across CAGED positions',
    status: 'planned', 
    icon: <BookOpen size={18} /> 
  },
  { 
    id: 12, 
    name: 'Rhythm Engine', 
    desc: 'Dynamic Creative Agency', 
    telemetry: 'Free-form improvisation tracking over backing tracks',
    status: 'available', 
    icon: <Play size={18} /> 
  }
];
