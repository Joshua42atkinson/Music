// ════════════════════════════════════════════════════════════
// fretboard.js
// 3D Holographic Guitar Fretboard for WebXR
// Renders a 6-string × 12-fret fretboard with note potholes,
// scale highlighting, and real-time note activation.
// ════════════════════════════════════════════════════════════

import * as THREE from 'three';

// ── Constants ────────────────────────────────────────────────

const STRING_COUNT = 6;
const FRET_COUNT = 12;
const NECK_LENGTH = 10;
const NECK_WIDTH = 1.4;
const NECK_DEPTH = 0.25;

// Standard tuning: Low E, A, D, G, B, High E
// Array index 0 = Low E (thickest), 5 = High E (thinnest)
const STRING_MIDI_BASES = [40, 45, 50, 55, 59, 64];
const STRING_NAMES = ['E', 'A', 'D', 'G', 'B', 'e'];

// Scale intervals (semitones from root)
const SCALE_INTERVALS = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  pentatonic: [0, 2, 4, 7, 9],
};

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// ── Fret position calculation (logarithmic, like real guitar) ──

function getFretPosition(fret) {
  if (fret === 0) return -NECK_LENGTH / 2;
  const scaleLength = 25.5;
  const distFromNut = scaleLength - scaleLength / Math.pow(2, fret / 12);
  return -NECK_LENGTH / 2 + (distFromNut / scaleLength) * NECK_LENGTH;
}

function getNoteName(stringIdx, fret) {
  const midi = STRING_MIDI_BASES[stringIdx] + fret;
  const noteIdx = midi % 12;
  const octave = Math.floor(midi / 12) - 1;
  return `${NOTE_NAMES[noteIdx]}${octave}`;
}

// ── Fretboard class ──────────────────────────────────────────

export class Fretboard {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.potholes = []; // { mesh, stringIdx, fretIdx, midi, noteName, baseMaterial }
    this.activePotholes = new Map(); // midi -> pothole
    this.currentScaleMidis = []; // MIDI note classes (0-11) in current scale
    this.rootPc = 0; // root pitch class
    this.activeMidi = null;

    this._build();
    scene.add(this.group);
  }

  _build() {
    // Position the fretboard floating in front of the user, tilted
    this.group.rotation.set(-Math.PI / 3.5, 0, 0);
    this.group.position.set(0, 1.0, -0.8);

    this._buildNeck();
    this._buildFrets();
    this._buildFretMarkers();
    this._buildStrings();
    this._buildPotholes();
  }

  _buildNeck() {
    // Wooden neck base
    const neckGeo = new THREE.BoxGeometry(NECK_WIDTH, NECK_DEPTH, NECK_LENGTH);
    const neckMat = new THREE.MeshStandardMaterial({
      color: 0x3d2b1a,
      roughness: 0.85,
      metalness: 0.05,
    });
    const neck = new THREE.Mesh(neckGeo, neckMat);
    this.group.add(neck);

    // Fretboard surface (slightly raised, darker)
    const fbGeo = new THREE.BoxGeometry(NECK_WIDTH, 0.04, NECK_LENGTH);
    const fbMat = new THREE.MeshStandardMaterial({
      color: 0x1a110a,
      roughness: 0.7,
      metalness: 0.1,
    });
    const fretboard = new THREE.Mesh(fbGeo, fbMat);
    fretboard.position.y = NECK_DEPTH / 2 + 0.02;
    this.group.add(fretboard);
  }

  _buildFrets() {
    const fretMat = new THREE.MeshStandardMaterial({
      color: 0xaaaaaa,
      metalness: 0.9,
      roughness: 0.15,
    });

    for (let i = 1; i <= FRET_COUNT; i++) {
      const zPos = getFretPosition(i);
      const fretGeo = new THREE.CylinderGeometry(0.018, 0.018, NECK_WIDTH, 8);
      const fret = new THREE.Mesh(fretGeo, fretMat);
      fret.rotation.z = Math.PI / 2;
      fret.position.set(0, NECK_DEPTH / 2 + 0.04, zPos);
      this.group.add(fret);
    }

    // Nut (at fret 0)
    const nutGeo = new THREE.BoxGeometry(NECK_WIDTH, 0.06, 0.04);
    const nutMat = new THREE.MeshStandardMaterial({
      color: 0xe0e0e0,
      roughness: 0.3,
    });
    const nut = new THREE.Mesh(nutGeo, nutMat);
    nut.position.set(0, NECK_DEPTH / 2 + 0.04, getFretPosition(0));
    this.group.add(nut);
  }

  _buildFretMarkers() {
    const dotFrets = [3, 5, 7, 9, 12];
    const dotMat = new THREE.MeshStandardMaterial({
      color: 0xe0e0e0,
      roughness: 0.4,
    });

    for (const fret of dotFrets) {
      const pos1 = getFretPosition(fret - 1);
      const pos2 = getFretPosition(fret);
      const midZ = (pos1 + pos2) / 2;

      if (fret === 12) {
        // Double dot
        for (const xOffset of [-NECK_WIDTH / 4, NECK_WIDTH / 4]) {
          const dotGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.01, 16);
          const dot = new THREE.Mesh(dotGeo, dotMat);
          dot.position.set(xOffset, NECK_DEPTH / 2 + 0.041, midZ);
          this.group.add(dot);
        }
      } else {
        const dotGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.01, 16);
        const dot = new THREE.Mesh(dotGeo, dotMat);
        dot.position.set(0, NECK_DEPTH / 2 + 0.041, midZ);
        this.group.add(dot);
      }
    }
  }

  _buildStrings() {
    const stringSpacing = (NECK_WIDTH - 0.2) / (STRING_COUNT - 1);

    for (let i = 0; i < STRING_COUNT; i++) {
      const xPos = -NECK_WIDTH / 2 + 0.1 + i * stringSpacing;
      const thickness = 0.006 + (5 - i) * 0.003;

      const strGeo = new THREE.CylinderGeometry(thickness, thickness, NECK_LENGTH, 8);
      const strMat = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        metalness: 0.95,
        roughness: 0.1,
      });
      const string = new THREE.Mesh(strGeo, strMat);
      string.rotation.x = Math.PI / 2;
      string.position.set(xPos, NECK_DEPTH / 2 + 0.07, 0);
      this.group.add(string);
    }
  }

  _buildPotholes() {
    const stringSpacing = (NECK_WIDTH - 0.2) / (STRING_COUNT - 1);

    // Materials
    const inactiveMat = new THREE.MeshStandardMaterial({
      color: 0x1a3a6a,
      emissive: 0x0a1a3a,
      emissiveIntensity: 0.3,
      roughness: 0.4,
      metalness: 0.2,
      transparent: true,
      opacity: 0.0, // Hidden by default — only show scale notes
    });

    const potholeGeo = new THREE.SphereGeometry(0.06, 16, 16);

    for (let stringIdx = 0; stringIdx < STRING_COUNT; stringIdx++) {
      const xPos = -NECK_WIDTH / 2 + 0.1 + stringIdx * stringSpacing;

      for (let fretIdx = 0; fretIdx <= FRET_COUNT; fretIdx++) {
        const midi = STRING_MIDI_BASES[stringIdx] + fretIdx;
        const noteName = getNoteName(stringIdx, fretIdx);

        const pos1 = getFretPosition(fretIdx - 1);
        const pos2 = getFretPosition(fretIdx);
        const midZ = fretIdx === 0 ? getFretPosition(0) + 0.15 : (pos1 + pos2) / 2;

        const mat = inactiveMat.clone();
        const mesh = new THREE.Mesh(potholeGeo, mat);
        mesh.position.set(xPos, NECK_DEPTH / 2 + 0.1, midZ);
        mesh.scale.setScalar(0.5); // Start small

        const pothole = {
          mesh,
          stringIdx,
          fretIdx,
          midi,
          noteName,
          pitchClass: midi % 12,
          baseOpacity: 0.0,
          targetScale: 0.5,
          isActive: false,
        };

        this.potholes.push(pothole);
        this.group.add(mesh);
      }
    }
  }

  // ── Scale Management ────────────────────────────────────────

  setScale(rootPc, scaleName) {
    this.rootPc = rootPc;
    const intervals = SCALE_INTERVALS[scaleName] || SCALE_INTERVALS.major;
    this.currentScaleMidis = intervals.map((iv) => (rootPc + iv) % 12);
    this._updatePotholeVisibility();
  }

  _updatePotholeVisibility() {
    for (const p of this.potholes) {
      const inScale = this.currentScaleMidis.includes(p.pitchClass);
      const isRoot = p.pitchClass === this.rootPc;

      if (inScale) {
        p.baseOpacity = isRoot ? 0.9 : 0.5;
        p.targetScale = isRoot ? 0.8 : 0.6;

        // Color: gold for root, blue for scale notes
        if (isRoot) {
          p.mesh.material.color.setHex(0xc9a84c);
          p.mesh.material.emissive.setHex(0x6a4a1a);
          p.mesh.material.emissiveIntensity = 0.6;
        } else {
          p.mesh.material.color.setHex(0x2a6aaa);
          p.mesh.material.emissive.setHex(0x0a2a5a);
          p.mesh.material.emissiveIntensity = 0.4;
        }
      } else {
        p.baseOpacity = 0.0;
        p.targetScale = 0.3;
      }
    }
  }

  // ── Note Activation ─────────────────────────────────────────

  setActiveNote(midi) {
    this.activeMidi = midi;

    // Deactivate all previously active potholes
    for (const p of this.potholes) {
      p.isActive = false;
    }

    if (midi !== null) {
      // Activate all potholes matching this MIDI note
      for (const p of this.potholes) {
        if (p.midi === midi) {
          p.isActive = true;
        }
      }
    }
  }

  // ── Animation Update ────────────────────────────────────────

  update(deltaTime) {
    for (const p of this.potholes) {
      const mat = p.mesh.material;

      if (p.isActive) {
        // Active note: bright gold, large, pulsing
        mat.color.setHex(0xf1c40f);
        mat.emissive.setHex(0xc9a84c);
        mat.emissiveIntensity = 1.5;
        mat.opacity = 1.0;
        p.mesh.scale.lerp(new THREE.Vector3(1.4, 1.4, 1.4), 0.15);
      } else {
        // Decay back to base state
        const inScale = this.currentScaleMidis.includes(p.pitchClass);
        const isRoot = p.pitchClass === this.rootPc;

        if (inScale) {
          mat.opacity += (p.baseOpacity - mat.opacity) * 0.1;
          if (isRoot) {
            mat.color.lerp(new THREE.Color(0xc9a84c), 0.1);
            mat.emissive.lerp(new THREE.Color(0x6a4a1a), 0.1);
            mat.emissiveIntensity += (0.6 - mat.emissiveIntensity) * 0.1;
          } else {
            mat.color.lerp(new THREE.Color(0x2a6aaa), 0.1);
            mat.emissive.lerp(new THREE.Color(0x0a2a5a), 0.1);
            mat.emissiveIntensity += (0.4 - mat.emissiveIntensity) * 0.1;
          }
        } else {
          mat.opacity += (0.0 - mat.opacity) * 0.1;
        }

        const targetScale = p.targetScale;
        p.mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      }
    }
  }

  // ── Mode Visual Changes ─────────────────────────────────────

  setMode(mode) {
    switch (mode) {
      case 'be':
        // Observation: fretboard visible, dim lighting, focus on breathing
        this.group.position.y = 1.0;
        break;
      case 'do':
        // Mechanics: zoom in slightly, focus on right hand area
        this.group.position.y = 0.7;
        this.group.rotation.x = -Math.PI / 4;
        break;
      case 'play':
        // Flow state: fretboard at comfortable playing position
        this.group.position.y = 1.2;
        this.group.rotation.x = -Math.PI / 3.5;
        break;
    }
  }

  // ── Get pothole world position (for spatial audio) ──────────

  getPotholePosition(midi) {
    for (const p of this.potholes) {
      if (p.midi === midi) {
        const worldPos = new THREE.Vector3();
        p.mesh.getWorldPosition(worldPos);
        return worldPos;
      }
    }
    return null;
  }
}
