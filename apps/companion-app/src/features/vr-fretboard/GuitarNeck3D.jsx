import React, { useMemo } from 'react';
import { Box, Cylinder, Text } from '@react-three/drei';
import * as THREE from 'three';

const TOTAL_FRETS = 14;
const STRING_COUNT = 6;
const NECK_LENGTH = 10;
const NECK_WIDTH = 1.2;
const NECK_DEPTH = 0.2;

// Fret positions (approximated logarithmically)
const getFretPosition = (fret) => {
  if (fret === 0) return -NECK_LENGTH / 2;
  const scale = 24; // scale length
  const distFromNut = scale - (scale / Math.pow(2, fret / 12));
  return -NECK_LENGTH / 2 + (distFromNut / scale) * NECK_LENGTH;
};

// Standard tuning: E2 A2 D3 G3 B3 E4
const STRING_TUNING = [
  { name: 'E', midiBase: 64 }, // High E
  { name: 'B', midiBase: 59 },
  { name: 'G', midiBase: 55 },
  { name: 'D', midiBase: 50 },
  { name: 'A', midiBase: 45 },
  { name: 'E', midiBase: 40 }, // Low E
];

export function GuitarNeck3D({ activeMidi, rootMidi, inScaleMidis = [] }) {
  // Generate fret lines
  const frets = useMemo(() => {
    const f = [];
    for (let i = 1; i <= TOTAL_FRETS; i++) {
      f.push(getFretPosition(i));
    }
    return f;
  }, []);

  // Fret markers (dots)
  const dots = useMemo(() => {
    const d = [];
    const dotFrets = [3, 5, 7, 9, 12];
    dotFrets.forEach(fret => {
      const pos1 = getFretPosition(fret - 1);
      const pos2 = getFretPosition(fret);
      const mid = (pos1 + pos2) / 2;
      
      if (fret === 12) {
        d.push({ z: mid, x: -NECK_WIDTH / 4 });
        d.push({ z: mid, x: NECK_WIDTH / 4 });
      } else {
        d.push({ z: mid, x: 0 });
      }
    });
    return d;
  }, []);

  return (
    <group rotation={[-Math.PI / 4, 0, 0]} position={[0, 1.2, -1]}>
      {/* Neck base */}
      <Box args={[NECK_WIDTH, NECK_DEPTH, NECK_LENGTH]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#3d2b1a" roughness={0.9} />
      </Box>

      {/* Fretboard (slightly raised) */}
      <Box args={[NECK_WIDTH, 0.05, NECK_LENGTH]} position={[0, NECK_DEPTH / 2 + 0.025, 0]}>
        <meshStandardMaterial color="#1a110a" roughness={0.8} />
      </Box>

      {/* Frets (metal wires) */}
      {frets.map((zPos, i) => (
        <Cylinder 
          key={i} 
          args={[0.015, 0.015, NECK_WIDTH]} 
          rotation={[0, 0, Math.PI / 2]} 
          position={[0, NECK_DEPTH / 2 + 0.05, zPos]}
        >
          <meshStandardMaterial color="#aaaaaa" metalness={0.8} roughness={0.2} />
        </Cylinder>
      ))}

      {/* Fret Markers */}
      {dots.map((dot, i) => (
        <Cylinder 
          key={`dot-${i}`} 
          args={[0.04, 0.04, 0.01]} 
          position={[dot.x, NECK_DEPTH / 2 + 0.051, dot.z]}
        >
          <meshBasicMaterial color="#e0e0e0" />
        </Cylinder>
      ))}

      {/* Strings */}
      {STRING_TUNING.map((str, sIdx) => {
        const xPos = -NECK_WIDTH / 2 + 0.1 + (sIdx * (NECK_WIDTH - 0.2)) / 5;
        const thickness = 0.005 + (5 - sIdx) * 0.003; // thicker for lower strings
        
        return (
          <group key={`string-${sIdx}`}>
            <Cylinder 
              args={[thickness, thickness, NECK_LENGTH]} 
              rotation={[Math.PI / 2, 0, 0]} 
              position={[xPos, NECK_DEPTH / 2 + 0.08, 0]}
            >
              <meshStandardMaterial color="#cccccc" metalness={0.9} roughness={0.1} />
            </Cylinder>
            
            {/* Note indicators on this string */}
            {frets.map((zPos, fretIdx) => {
              const fretNum = fretIdx + 1;
              const noteMidi = str.midiBase + fretNum;
              const isActive = noteMidi === activeMidi;
              const isRoot = noteMidi % 12 === rootMidi % 12;
              const inScale = inScaleMidis.includes(noteMidi % 12);

              const pos1 = getFretPosition(fretNum - 1);
              const pos2 = getFretPosition(fretNum);
              const midZ = (pos1 + pos2) / 2;

              if (!isActive && !isRoot && !inScale) return null;

              let color = '#3498db'; // Scale note
              if (isRoot) color = '#e74c3c'; // Root note
              if (isActive) color = '#f1c40f'; // Currently playing

              return (
                <mesh key={`note-${sIdx}-${fretNum}`} position={[xPos, NECK_DEPTH / 2 + 0.1, midZ]}>
                  <sphereGeometry args={[isActive ? 0.08 : 0.05]} />
                  <meshBasicMaterial color={color} transparent opacity={isActive ? 1 : 0.7} />
                </mesh>
              );
            })}
          </group>
        );
      })}
    </group>
  );
}
