import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';

function Fretboard({ activeStage }) {
  const neckRef = useRef();

  // Basic guitar neck dimensions
  const neckWidth = 3;
  const neckLength = 12;
  const neckDepth = 0.5;

  // 6 strings (Low E to High E)
  // Our array: strings[0] is Low E (thickest), strings[5] is High E (thinnest)
  const stringSpacing = neckWidth / 5;
  const strings = Array.from({ length: 6 }).map((_, i) => {
    return (i * stringSpacing) - (neckWidth / 2);
  });

  // 5 Frets for C Scale Seed
  const frets = Array.from({ length: 6 }).map((_, i) => {
    return (neckLength / 2) - (i * (neckLength / 5)); // Linear spacing for abstract viz
  });

  return (
    <group ref={neckRef}>
      {/* Wood Neck */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[neckWidth + 0.5, neckLength, neckDepth]} />
        <meshStandardMaterial color="#3d2b1a" roughness={0.8} />
      </mesh>

      {/* Frets */}
      {frets.map((y, i) => (
        <group key={`fret-${i}`}>
          <mesh position={[0, y, neckDepth / 2 + 0.05]}>
            <boxGeometry args={[neckWidth + 0.5, 0.05, 0.1]} />
            <meshStandardMaterial color="#c0c0c0" metalness={0.8} />
          </mesh>
          <Text 
            position={[-neckWidth/2 - 0.5, y, neckDepth / 2]} 
            fontSize={0.4} 
            color="var(--cf-gold)"
            anchorX="right"
            font="https://fonts.gstatic.com/s/jetbrainsmono/v13/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxTOlOV.woff"
          >
            {i === 0 ? 'Open' : i}
          </Text>
        </group>
      ))}

      {/* Strings */}
      {strings.map((x, i) => (
        <mesh key={`string-${i}`} position={[x, 0, neckDepth / 2 + 0.1]}>
          <cylinderGeometry args={[0.01 + ((5 - i) * 0.005), 0.01 + ((5 - i) * 0.005), neckLength, 8]} />
          <meshStandardMaterial color="#e0e0e0" metalness={0.9} />
        </mesh>
      ))}

      {/* Stage Visualizations */}
      {activeStage === 'stage-1' && (
        <>
          {/* Highlight 5th fret match between E and A strings */}
          <mesh position={[strings[0], frets[5], neckDepth / 2 + 0.2]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#e74c3c" emissive="#e74c3c" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[strings[1], frets[0], neckDepth / 2 + 0.2]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#e74c3c" emissive="#e74c3c" emissiveIntensity={0.5} />
          </mesh>
          {/* Highlight Pothole: 4th fret match between G and B strings */}
          <mesh position={[strings[3], frets[4], neckDepth / 2 + 0.2]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#f39c12" emissive="#f39c12" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[strings[4], frets[0], neckDepth / 2 + 0.2]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#f39c12" emissive="#f39c12" emissiveIntensity={0.5} />
          </mesh>
        </>
      )}

      {activeStage === 'stage-2' && (
        // Abstract C Scale root on A string, 3rd fret
        <mesh position={[strings[1], frets[3], neckDepth / 2 + 0.2]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#3498db" emissive="#3498db" emissiveIntensity={0.8} />
        </mesh>
      )}
    </group>
  );
}

export default function CScaleVisualizer({ activeStage }) {
  return (
    <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden bg-[#020202] border border-white/[0.05]">
      <Canvas camera={{ position: [0, -8, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Fretboard activeStage={activeStage} />
        <OrbitControls enableZoom={true} enablePan={false} maxPolarAngle={Math.PI / 2} />
      </Canvas>
      <div className="absolute bottom-4 left-4 bg-black/60 py-1 px-2 rounded font-mono text-[0.6rem] text-cf-gold">
        Interactive WebXR Canvas
      </div>
    </div>
  );
}
