import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { XR, createXRStore } from '@react-three/xr';
import { Environment, OrbitControls } from '@react-three/drei';
import { GuitarNeck3D } from './GuitarNeck3D';
import usePitchDetector from '../../hooks/usePitchDetector';
import { Scale, Interval } from '@tonaljs/tonal';

// Create the XR store to manage VR session
const store = createXRStore({
  // Allows the user to move around and teleport
  // We'll keep it simple for now, anchoring the guitar in front
});

const NOTE_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];

export default function VRFretboardEngine({ onClose, presetRoot = 0, presetScale }) {
  const { isListening, pitch, noteInfo, startListening, stopListening } = usePitchDetector();
  const [activeMidi, setActiveMidi] = useState(null);
  const [inScaleMidis, setInScaleMidis] = useState([]);

  // Auto-start mic when entering VR
  useEffect(() => {
    if (!isListening) {
      startListening();
    }
    return () => {
      if (isListening) stopListening(); // cleanup on unmount
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Map pitch to nearest MIDI note
  useEffect(() => {
    if (pitch && pitch > 0) {
      const midi = Math.round(69 + 12 * Math.log2(pitch / 440));
      setActiveMidi(midi);
    } else {
      setActiveMidi(null);
    }
  }, [pitch]);

  // Derive scale notes
  useEffect(() => {
    if (presetScale) {
      const rootName = NOTE_NAMES[presetRoot % 12].replace('♯', '#');
      // Hack: we assume presetScale is a tonal name like "major" or "minor pentatonic"
      const scaleData = Scale.get(`${rootName} ${presetScale}`);
      if (scaleData && scaleData.intervals) {
        const scaleSemitones = scaleData.intervals.map(ivl => Interval.semitones(ivl));
        const midis = scaleSemitones.map(st => (presetRoot + st) % 12);
        setInScaleMidis(midis);
      }
    } else {
      setInScaleMidis([]);
    }
  }, [presetRoot, presetScale]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#0a0a0f' }}>
      {/* UI Overlay */}
      <div style={{
        position: 'absolute', top: 20, left: 20, zIndex: 1,
        display: 'flex', gap: '10px', alignItems: 'center'
      }}>
        <button 
          onClick={onClose}
          style={{
            padding: '10px 20px', background: 'rgba(255,255,255,0.1)', 
            border: '1px solid rgba(255,255,255,0.2)', color: 'white',
            borderRadius: '8px', cursor: 'pointer'
          }}
        >
          Exit VR Mode
        </button>
        <button 
          onClick={() => store.enterVR()}
          style={{
            padding: '10px 20px', background: '#e74c3c', 
            border: 'none', color: 'white', fontWeight: 'bold',
            borderRadius: '8px', cursor: 'pointer'
          }}
        >
          Enter VR Headset
        </button>
        <div style={{ color: 'var(--cf-gold)', fontFamily: 'monospace' }}>
          {noteInfo?.name && pitch ? `Detected: ${noteInfo.name} (${pitch.toFixed(1)}Hz)` : 'Sing or play a note...'}
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 1.5, 2], fov: 60 }}>
        <XR store={store}>
          <color attach="background" args={['#050508']} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Environment preset="night" />
          
          <GuitarNeck3D 
            activeMidi={activeMidi} 
            rootMidi={presetRoot} 
            inScaleMidis={inScaleMidis} 
          />
          
          {/* Allow desktop/touch drag viewing when not in headset */}
          <OrbitControls makeDefault />
        </XR>
      </Canvas>
    </div>
  );
}
