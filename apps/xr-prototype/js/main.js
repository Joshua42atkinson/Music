// ════════════════════════════════════════════════════════════
// main.js
// Voix Vive XR — Spatial Guitar Academy
// WebXR Prototype Entry Point
//
// Demonstrates the core Android XR experience:
// 1. AR passthrough with 3D holographic fretboard overlay
// 2. Real-time pitch detection (YIN algorithm)
// 3. Note visualization on the fretboard
// 4. Spatial audio feedback
// 5. BE/DO/PLAY curriculum mode system
// 6. Hand tracking (when available)
// ════════════════════════════════════════════════════════════

import * as THREE from 'three';
import { ARButton } from 'three/addons/webxr/ARButton.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { Fretboard } from './fretboard.js';
import { PitchDetector } from './pitch-detection.js';
import { SpatialAudio } from './spatial-audio.js';
import { UI } from './ui.js';

// ── Note name → pitch class mapping ──────────────────────────

const NOTE_TO_PC = {
  C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5,
  'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11,
};

const SCALE_INTERVALS = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  pentatonic: [0, 2, 4, 7, 9],
};

// ── Main Application ─────────────────────────────────────────

class VoixViveXR {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.fretboard = null;
    this.pitchDetector = null;
    this.spatialAudio = null;
    this.ui = null;
    this.clock = new THREE.Clock();
    this.isAR = false;
    this.xrSession = null;
    this.handMeshes = { left: null, right: null };
    this.currentMode = 'be';
    this.currentRoot = 'C';
    this.currentScale = 'major';
  }

  async init() {
    this.ui = new UI();
    this.ui.updateLoading('Setting up 3D scene...');

    this._setupScene();
    this._setupRenderer();
    this._setupLights();
    this._setupFretboard();
    this._setupUIHandlers();

    await this._setupWebXR();

    this.ui.showApp();
    this._startAnimationLoop();
  }

  // ── Scene Setup ─────────────────────────────────────────────

  _setupScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x050508);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 2.5, 4);
    this.camera.lookAt(0, 0.5, 0);
  }

  _setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.xr.enabled = true;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    document.getElementById('canvas-container').appendChild(this.renderer.domElement);

    // Resize handler
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  _setupLights() {
    // Ambient
    const ambient = new THREE.AmbientLight(0x404060, 0.6);
    this.scene.add(ambient);

    // Key light
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(5, 8, 5);
    this.scene.add(keyLight);

    // Fill light (cool tone)
    const fillLight = new THREE.DirectionalLight(0x6080aa, 0.5);
    fillLight.position.set(-5, 3, -2);
    this.scene.add(fillLight);

    // Rim light (gold accent)
    const rimLight = new THREE.PointLight(0xc9a84c, 0.8, 15);
    rimLight.position.set(0, 2, -3);
    this.scene.add(rimLight);
  }

  _setupFretboard() {
    this.fretboard = new Fretboard(this.scene);

    // Set initial scale (C Major)
    const rootPc = NOTE_TO_PC[this.currentRoot];
    this.fretboard.setScale(rootPc, this.currentScale);

    // Update UI scale midis
    const intervals = SCALE_INTERVALS[this.currentScale];
    const scaleMidis = intervals.map((iv) => (rootPc + iv) % 12);
    this.ui.setScaleMidis(scaleMidis);
  }

  // ── WebXR Setup ─────────────────────────────────────────────

  async _setupWebXR() {
    this.ui.updateLoading('Checking WebXR support...');

    const xrAvailable = 'xr' in navigator;

    if (xrAvailable) {
      try {
        const arSupported = await navigator.xr.isSessionSupported('immersive-ar');
        if (arSupported) {
          this._setupARButton();
          this.ui.updateLoading('Ready — AR supported!');
          return;
        }
      } catch (e) {
        console.warn('[VoixViveXR] WebXR AR check failed:', e);
      }
    }

    // No WebXR AR — set up desktop fallback
    this._setupDesktopFallback();
    this.ui.updateLoading('Ready — Desktop preview mode');
    this.ui.showDesktopHelp();
  }

  _setupARButton() {
    const button = ARButton.createButton(this.renderer, {
      optionalFeatures: ['hand-tracking', 'hit-test', 'anchors'],
      requiredFeatures: [],
    });

    document.body.appendChild(button);

    // Session events
    this.renderer.xr.addEventListener('sessionstart', () => {
      this.isAR = true;
      this.xrSession = this.renderer.xr.getSession();
      this.ui.hideDesktopHelp();

      // Init spatial audio on session start (needs user gesture)
      this._initSpatialAudio();

      // Auto-start mic in AR
      if (this.pitchDetector && !this.pitchDetector.isListening) {
        this.pitchDetector.start().catch(console.error);
        this.ui.setMicListening(true);
      }
    });

    this.renderer.xr.addEventListener('sessionend', () => {
      this.isAR = false;
      this.xrSession = null;

      // Clear hand meshes
      for (const hand of ['left', 'right']) {
        if (this.handMeshes[hand]) {
          this.scene.remove(this.handMeshes[hand]);
          this.handMeshes[hand] = null;
        }
      }
    });
  }

  _setupDesktopFallback() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 2;
    this.controls.maxDistance = 10;
    this.controls.maxPolarAngle = Math.PI / 1.8;
    this.controls.target.set(0, 0.5, 0);
    this.controls.update();
  }

  // ── Pitch Detection ─────────────────────────────────────────

  _setupPitchDetection() {
    this.pitchDetector = new PitchDetector(
      (noteInfo) => this._onNoteDetected(noteInfo),
      (volume) => this.ui.updateVolume(volume)
    );
  }

  _onNoteDetected(noteInfo) {
    // Update UI
    this.ui.updateNote(noteInfo);

    // Update fretboard
    if (noteInfo) {
      this.fretboard.setActiveNote(noteInfo.midi);

      // Spatial audio feedback
      if (this.spatialAudio && this.spatialAudio._enabled) {
        const pos = this.fretboard.getPotholePosition(noteInfo.midi);
        if (pos) {
          this.spatialAudio.playNote(noteInfo.freq, pos, 0.3);
        }
      }
    } else {
      this.fretboard.setActiveNote(null);
    }
  }

  // ── Spatial Audio ───────────────────────────────────────────

  async _initSpatialAudio() {
    if (!this.spatialAudio) {
      this.spatialAudio = new SpatialAudio();
    }
    if (!this.spatialAudio._enabled) {
      try {
        await this.spatialAudio.init();
      } catch (e) {
        console.warn('[VoixViveXR] Spatial audio init failed:', e);
      }
    }
  }

  // ── Hand Tracking ───────────────────────────────────────────

  _updateHandTracking(xrFrame) {
    if (!this.isAR || !this.xrSession) return;

    const referenceSpace = this.renderer.xr.getReferenceSpace();
    if (!referenceSpace) return;

    // Iterate over input sources to find hand tracking data
    for (const inputSource of this.xrSession.inputSources) {
      if (inputSource.hand) {
        this._renderHandJoints(inputSource.hand, inputSource.handedness, referenceSpace, xrFrame);
      }
    }
  }

  _renderHandJoints(hand, handedness, referenceSpace, xrFrame) {
    if (!this.handMeshes[handedness]) {
      const group = new THREE.Group();
      const jointGeo = new THREE.SphereGeometry(0.015, 8, 8);
      const jointMat = new THREE.MeshBasicMaterial({
        color: 0xc9a84c,
        transparent: true,
        opacity: 0.7,
      });

      // Create spheres for each joint (25 joints per hand per WebXR spec)
      for (let i = 0; i < 25; i++) {
        const mesh = new THREE.Mesh(jointGeo, jointMat.clone());
        mesh.visible = false;
        group.add(mesh);
      }

      this.scene.add(group);
      this.handMeshes[handedness] = group;
    }

    const group = this.handMeshes[handedness];

    // WebXR hand joint names (per spec)
    const jointNames = [
      'wrist',
      'thumb-metacarpal', 'thumb-phalanx-proximal', 'thumb-phalanx-distal', 'thumb-tip',
      'index-finger-metacarpal', 'index-finger-phalanx-proximal', 'index-finger-phalanx-intermediate', 'index-finger-phalanx-distal', 'index-finger-tip',
      'middle-finger-metacarpal', 'middle-finger-phalanx-proximal', 'middle-finger-phalanx-intermediate', 'middle-finger-phalanx-distal', 'middle-finger-tip',
      'ring-finger-metacarpal', 'ring-finger-phalanx-proximal', 'ring-finger-phalanx-intermediate', 'ring-finger-phalanx-distal', 'ring-finger-tip',
      'pinky-finger-metacarpal', 'pinky-finger-phalanx-proximal', 'pinky-finger-phalanx-intermediate', 'pinky-finger-phalanx-distal', 'pinky-finger-tip',
    ];

    let visibleCount = 0;
    for (let i = 0; i < jointNames.length; i++) {
      const jointSpace = hand.get(jointNames[i]);
      if (jointSpace) {
        // Use frame.getJointPose for hand joints (per WebXR spec)
        const pose = xrFrame.getJointPose(jointSpace, referenceSpace);
        if (pose) {
          group.children[i].position.set(
            pose.transform.position.x,
            pose.transform.position.y,
            pose.transform.position.z
          );
          group.children[i].visible = true;
          visibleCount++;
        } else {
          group.children[i].visible = false;
        }
      } else {
        group.children[i].visible = false;
      }
    }

    group.visible = visibleCount > 0;
  }

  // ── UI Handlers ─────────────────────────────────────────────

  _setupUIHandlers() {
    this._setupPitchDetection();

    this.ui.onModeChange((mode) => {
      this.currentMode = mode;
      this.fretboard.setMode(mode);
    });

    this.ui.onScaleChange((root, scale) => {
      this.currentRoot = root;
      this.currentScale = scale;
      const rootPc = NOTE_TO_PC[root];
      this.fretboard.setScale(rootPc, scale);

      const intervals = SCALE_INTERVALS[scale];
      const scaleMidis = intervals.map((iv) => (rootPc + iv) % 12);
      this.ui.setScaleMidis(scaleMidis);
    });

    this.ui.onMicToggle(async () => {
      if (this.pitchDetector.isListening) {
        this.pitchDetector.stop();
        this.ui.setMicListening(false);
        this.ui.updateNote(null);
        this.fretboard.setActiveNote(null);
      } else {
        try {
          // Init spatial audio on first mic activation (user gesture)
          await this._initSpatialAudio();
          await this.pitchDetector.start();
          this.ui.setMicListening(true);
        } catch (e) {
          console.error('[VoixViveXR] Failed to start mic:', e);
          alert('Microphone access denied. Please allow microphone access to use pitch detection.');
        }
      }
    });
  }

  // ── Animation Loop ──────────────────────────────────────────

  _startAnimationLoop() {
    this.renderer.setAnimationLoop((timestamp, xrFrame) => this._render(xrFrame));
  }

  _render(xrFrame) {
    const delta = this.clock.getDelta();

    // Update fretboard animations
    this.fretboard.update(delta);

    // Update controls (desktop mode)
    if (this.controls) {
      this.controls.update();
    }

    // Update hand tracking (AR mode)
    if (this.isAR && xrFrame) {
      this._updateHandTracking(xrFrame);

      // Update spatial audio listener position from XR camera
      if (this.spatialAudio && this.spatialAudio._enabled) {
        const camera = this.renderer.xr.getCamera();
        if (camera) {
          this.spatialAudio.updateListener(camera.position, camera.quaternion);
        }
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// ── Bootstrap ────────────────────────────────────────────────

const app = new VoixViveXR();
app.init().catch((err) => {
  console.error('[VoixViveXR] Failed to initialize:', err);
  document.getElementById('loading-text').textContent = 'Error: ' + err.message;
});
