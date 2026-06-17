import React, { useCallback, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { FLASH_STATES } from '../hooks/useFlashTimer';
import { STRING_TUNING, NOTE_NAMES } from '../data/vertiscalePatterns';

// ═══════════════════════════════════════════════════════════
// PIECE 1: XRGameFretboard (WebXR 3D spatial equivalent of GameFretboard)
// ═══════════════════════════════════════════════════════════

const FRET_SPACING = 0.04;   // 4cm between frets
const STRING_SPACING = 0.012; // 1.2cm between strings

function XRGameFretboard({
  correctPositions = [],
  playerTaps       = [],
  flashState,
  onTap,
  maxFret          = 7,
  disabled         = false,
  holdProgressPct  = 0,
  breathState: _breathState      = 'free',
  detectedNoteName: _detectedNoteName = null,
  cents: _cents            = 0,
  pitch: _pitch            = 0,
}) {
  const fretCount = maxFret + 1;

  const getCellState = useCallback((stringIdx, fret) => {
    const isCorrect = correctPositions.some(p => p.stringIdx === stringIdx && p.fret === fret);
    const isTapped  = playerTaps.some(p => p.stringIdx === stringIdx && p.fret === fret);

    switch (flashState) {
      case FLASH_STATES.REVEAL:
        return isCorrect ? 'pattern' : 'idle';
      case FLASH_STATES.DARK:
        return 'dark';
      case FLASH_STATES.TAP:
        if (isTapped && isCorrect) return 'hit';
        if (isTapped && !isCorrect) return 'phantom';
        return 'tappable';
      case FLASH_STATES.RESULT:
      case FLASH_STATES.HOLD_RESULT:
        if (isCorrect && isTapped)  return 'hit';
        if (isCorrect && !isTapped) return 'missed';
        if (!isCorrect && isTapped) return 'phantom';
        return 'idle';
      case FLASH_STATES.HOLD:
        if (isCorrect && isTapped)  return 'hold-hit';
        if (isCorrect && !isTapped) return 'hold-pattern';
        if (!isCorrect && isTapped) return 'hold-phantom';
        return 'hold-idle';
      default:
        return 'idle';
    }
  }, [correctPositions, playerTaps, flashState]);

  const getNoteName = (stringIdx, fret) => {
    const midi = STRING_TUNING[stringIdx].midiBase + fret;
    return NOTE_NAMES[midi % 12];
  };

  const isTappable = flashState === FLASH_STATES.TAP || flashState === FLASH_STATES.HOLD;

  const handleCellClick = (stringIdx, fret) => {
    if (disabled || !isTappable) return;
    onTap?.(stringIdx, fret);
  };

  // Center the neck at origin
  const neckWidth = maxFret * FRET_SPACING;
  const startX = -neckWidth / 2;
  const neckDepth = 5 * STRING_SPACING; // strings 0 to 5
  const startZ = -neckDepth / 2;

  return (
    <group>
      {/* Draw the strings */}
      {STRING_TUNING.map((str, sIdx) => {
        const z = startZ + sIdx * STRING_SPACING;
        const thickness = 0.0005 + (sIdx * 0.0002); // THicker low strings
        return (
          <mesh key={`string-${sIdx}`} position={[0, 0, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[thickness, thickness, neckWidth + FRET_SPACING, 8]} />
            <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
          </mesh>
        );
      })}

      {/* Draw the frets */}
      {Array.from({ length: maxFret }, (_, i) => {
        const fretIdx = i + 1; // fret 1 to maxFret
        const x = startX + fretIdx * FRET_SPACING;
        return (
          <mesh key={`fret-${fretIdx}`} position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.001, 0.001, neckDepth + 0.004, 8]} />
            <meshStandardMaterial color="#cccccc" metalness={0.9} roughness={0.1} />
          </mesh>
        );
      })}

      {/* Draw the cells */}
      {STRING_TUNING.map((str, sIdx) => {
        const z = startZ + sIdx * STRING_SPACING;
        
        return Array.from({ length: fretCount }, (_, fret) => {
          const x = startX + fret * FRET_SPACING - FRET_SPACING/2; // center between frets
          if (fret === 0) return null; // Skip drawing interactive dot for Open string for now in 3D

          const state = getCellState(sIdx, fret);
          const isRoot = correctPositions.some(p => p.stringIdx === sIdx && p.fret === fret && p.isRoot);
          const cellNoteName = getNoteName(sIdx, fret);
          
          return (
            <FretDot
              key={`${sIdx}-${fret}`}
              position={[x, 0.005, z]}
              state={state}
              isRoot={isRoot}
              noteName={cellNoteName}
              onClick={() => handleCellClick(sIdx, fret)}
              isTappable={isTappable}
              holdProgressPct={state === 'hold-hit' ? holdProgressPct : 0}
            />
          );
        });
      })}
    </group>
  );
}

function FretDot({ position, state, isRoot, noteName, onClick, isTappable: _isTappable, holdProgressPct }) {
  const meshRef = useRef();

  // Determine colors based on state (matching GameFretboard.jsx)
  let color = '#ffffff';
  let emissive = '#000000';
  let emissiveIntensity = 0;
  let opacity = 0.8;
  let scale = 1;

  if (state === 'pattern' || state === 'hold-pattern') {
    color = 'var(--cf-gold)'; // Gold
    emissive = 'var(--cf-gold)';
    emissiveIntensity = isRoot ? 2 : 1;
    scale = isRoot ? 1.2 : 1.0;
  } else if (state === 'hit' || state === 'hold-hit') {
    color = '#2ed573'; // Green
    emissive = '#2ed573';
    emissiveIntensity = 2;
    scale = 1.2;
  } else if (state === 'missed') {
    color = '#ffab00'; // Amber
    emissive = '#ffab00';
    emissiveIntensity = 1;
  } else if (state === 'phantom' || state === 'hold-phantom') {
    color = '#ff4757'; // Red
    emissive = '#ff4757';
    emissiveIntensity = 1.5;
  } else if (state === 'tappable') {
    color = '#ffffff';
    opacity = 0.1; // faint hint
  } else {
    // idle, dark, hold-idle
    color = '#ffffff';
    opacity = 0.0; // completely invisible
  }

  // Animation pulse (simple rotation/scale in useFrame as placeholder for framer-motion)
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    if (state.startsWith('hold-') || state === 'pattern') {
      const t = clock.getElapsedTime();
      // slow breath pulse
      const pulse = 1 + Math.sin(t * 3) * 0.05;
      meshRef.current.scale.setScalar(scale * pulse);
    } else {
      meshRef.current.scale.setScalar(scale);
    }
  });

  const showLabel = ['pattern', 'hit', 'missed', 'hold-pattern', 'hold-hit'].includes(state);

  return (
    <group position={position}>
      {/* The interactive hit box (invisible, larger for easy grabbing/touching) */}
      <mesh onClick={onClick} visible={false}>
        <boxGeometry args={[0.035, 0.02, 0.015]} />
        <meshBasicMaterial />
      </mesh>

      {/* The visual dot */}
      {opacity > 0 && (
        <mesh ref={meshRef}>
          <cylinderGeometry args={[0.005, 0.005, 0.002, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={emissive}
            emissiveIntensity={emissiveIntensity}
            transparent
            opacity={opacity}
          />
        </mesh>
      )}

      {/* Text Label */}
      {showLabel && (
        <Text
          position={[0, 0.002, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.005}
          color="#000000"
          anchorX="center"
          anchorY="middle"
        >
          {noteName}
        </Text>
      )}

      {/* Progress ring for hold-hit */}
      {holdProgressPct > 0 && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.008, 0.0005, 16, 32, holdProgressPct * Math.PI * 2]} />
          <meshBasicMaterial color="#2ed573" />
        </mesh>
      )}
    </group>
  );
}

export default XRGameFretboard;
