import React, { useState } from 'react';
import { Text } from '@react-three/drei';
import { useXRInputSourceState } from '@react-three/xr';
import * as THREE from 'three';

// ═══════════════════════════════════════════════════════════
// PIECE 2: CalibrationUI
// Guides the user to touch the Nut and 12th Fret of their physical
// guitar to establish the spatial transform for the AR overlay.
// ═══════════════════════════════════════════════════════════

export default function CalibrationUI({ onCalibrateComplete }) {
  const [step, setStep] = useState(0); // 0: Start, 1: Nut, 2: 12th, 3: Done
  const [nutPos, setNutPos] = useState(null);
  const [, setFret12Pos] = useState(null);

  // Hook into XR input states to read joint positions
  // In v6, we can query hand joints if the user is using hands
  const leftHand = useXRInputSourceState('hand', 'left');
  const rightHand = useXRInputSourceState('hand', 'right');
  const leftController = useXRInputSourceState('controller', 'left');
  const rightController = useXRInputSourceState('controller', 'right');

  // Helper to get the position of the "pointer" (index finger or controller tip)
  const getPointerPosition = (excludeHandside = null) => {
    // Try to get the position of the hand/controller that did NOT click the button
    const sources = [
      { side: 'right', state: rightHand, type: 'hand' },
      { side: 'left', state: leftHand, type: 'hand' },
      { side: 'right', state: rightController, type: 'controller' },
      { side: 'left', state: leftController, type: 'controller' }
    ];

    for (const src of sources) {
      if (src.side === excludeHandside) continue;
      if (!src.state) continue;

      if (src.type === 'hand' && src.state.joints) {
        // Get index finger tip
        const joint = src.state.joints['index-finger-tip'];
        if (joint && joint.position) {
          return new THREE.Vector3(joint.position.x, joint.position.y, joint.position.z);
        }
      } else if (src.type === 'controller' && src.state.gripSpace) {
        const pos = new THREE.Vector3();
        pos.setFromMatrixPosition(src.state.gripSpace.matrixWorld);
        return pos;
      }
    }
    
    // Fallback if we couldn't distinguish hands (e.g. testing in emulator)
    return new THREE.Vector3(0, 0, -0.5); 
  };

  const handleRecordNut = (e) => {
    // e.source.handedness tells us which hand clicked the button
    const clickingHand = e?.source?.handedness || null;
    const pos = getPointerPosition(clickingHand);
    setNutPos(pos);
    setStep(2);
  };

  const handleRecord12th = (e) => {
    const clickingHand = e?.source?.handedness || null;
    const pos = getPointerPosition(clickingHand);
    setFret12Pos(pos);
    setStep(3);
    
    // Compute Transform!
    if (nutPos && pos) {
      computeTransform(nutPos, pos);
    }
  };

  const computeTransform = (p1, p2) => {
    // p1 = Nut (Fret 0)
    // p2 = 12th Fret
    
    // 1. Calculate the vector from Nut to 12th fret
    const neckVector = new THREE.Vector3().subVectors(p2, p1);
    const distance = neckVector.length();

    // In our digital model, the distance from Nut (x: -neckWidth/2) to 12th fret (x: -neckWidth/2 + 12*FRET_SPACING) 
    // is exactly 12 * FRET_SPACING.
    // So the required scale multiplier is:
    // Actually, it's safer to just scale the entire XRGameFretboard group
    // Digital distance for 12 frets = 12 * 0.04 = 0.48 meters.
    const digitalDistance12 = 12 * 0.04;
    const scale = distance / digitalDistance12;

    // 2. Position
    // We want the digital Nut to sit exactly at p1.
    // By default, the digital neck is centered at x=0, and the Nut is at x = -neckWidth/2.
    // We will pass the exact position and rotation back to the parent to apply to the `<group>`
    
    // 3. Rotation
    // The digital neck runs along the positive X axis (from -X to +X).
    // We need to rotate the digital X axis to align with `neckVector`.
    const defaultAxis = new THREE.Vector3(1, 0, 0);
    const targetAxis = neckVector.clone().normalize();
    const quaternion = new THREE.Quaternion().setFromUnitVectors(defaultAxis, targetAxis);

    // Because the digital model's Nut is at (-neckWidth/2, 0, 0), when we apply rotation and scale,
    // that point moves. We need to calculate the offset to ensure the Nut lands exactly on `p1`.
    // Let's assume the parent handles the centering offset, we just provide the raw data.
    
    onCalibrateComplete({
      nutPosition: p1,
      fret12Position: p2,
      scale: scale,
      quaternion: quaternion
    });
  };

  // Place the UI panel floating 0.5m in front of the user
  return (
    <group position={[0, 1.2, -0.6]}>
      {/* Background Panel */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[0.6, 0.4, 0.02]} />
        <meshStandardMaterial color="#1e1208" metalness={0.5} roughness={0.8} />
      </mesh>

      <Text position={[0, 0.12, 0]} fontSize={0.04} color="var(--cf-gold)" anchorX="center" anchorY="middle">
        Spatial Calibration
      </Text>

      {step === 0 && (
        <group>
          <Text position={[0, 0.02, 0]} fontSize={0.025} color="#e8edf2" anchorX="center" anchorY="middle" maxWidth={0.5} textAlign="center">
            To map the digital fretboard to your physical guitar, we need to record two points.
          </Text>
          <Button position={[0, -0.08, 0]} label="Start Calibration" onClick={() => setStep(1)} color="#2ed573" />
        </group>
      )}

      {step === 1 && (
        <group>
          <Text position={[0, 0.02, 0]} fontSize={0.025} color="#e8edf2" anchorX="center" anchorY="middle" maxWidth={0.5} textAlign="center">
            1. Touch the NUT of your guitar with your index finger.
            2. With your OTHER hand, click the button below.
          </Text>
          <Button position={[0, -0.08, 0]} label="Record Nut" onClick={handleRecordNut} color="#ffab00" />
        </group>
      )}

      {step === 2 && (
        <group>
          <Text position={[0, 0.02, 0]} fontSize={0.025} color="#e8edf2" anchorX="center" anchorY="middle" maxWidth={0.5} textAlign="center">
            1. Touch the 12TH FRET of your guitar with your index finger.
            2. With your OTHER hand, click the button below.
          </Text>
          <Button position={[0, -0.08, 0]} label="Record 12th Fret" onClick={handleRecord12th} color="#ffab00" />
        </group>
      )}

      {step === 3 && (
        <Text position={[0, -0.02, 0]} fontSize={0.03} color="#2ed573" anchorX="center" anchorY="middle">
          Calibration Complete!
        </Text>
      )}
    </group>
  );
}

function Button({ position, label, onClick, color }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      <mesh 
        onClick={onClick} 
        onPointerOver={() => setHovered(true)} 
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[0.25, 0.08, 0.02]} />
        <meshStandardMaterial color={hovered ? '#ffffff' : color} emissive={hovered ? color : '#000000'} emissiveIntensity={0.5} />
      </mesh>
      <Text position={[0, 0, 0.011]} fontSize={0.025} color={hovered ? "#000000" : "#ffffff"} anchorX="center" anchorY="middle">
        {label}
      </Text>
    </group>
  );
}
