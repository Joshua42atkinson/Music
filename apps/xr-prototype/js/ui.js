// ════════════════════════════════════════════════════════════
// ui.js
// UI Overlay Manager
// Handles all DOM updates for the HUD overlay.
// ════════════════════════════════════════════════════════════

export class UI {
  constructor() {
    this._els = {
      loadingScreen: document.getElementById('loading-screen'),
      loadingText: document.getElementById('loading-text'),
      topBar: document.getElementById('top-bar'),
      modeBar: document.getElementById('mode-bar'),
      scaleBar: document.getElementById('scale-bar'),
      infoPanel: document.getElementById('info-panel'),
      desktopHelp: document.getElementById('desktop-help'),
      noteName: document.getElementById('note-name'),
      noteOctave: document.getElementById('note-octave'),
      noteFreq: document.getElementById('note-freq'),
      micToggle: document.getElementById('mic-toggle'),
      micLabel: document.getElementById('mic-label'),
      infoNote: document.getElementById('info-note'),
      infoCents: document.getElementById('info-cents'),
      infoInScale: document.getElementById('info-in-scale'),
      volumeFill: document.getElementById('volume-fill'),
    };

    this._onModeChange = null;
    this._onScaleChange = null;
    this._onMicToggle = null;
    this._currentScaleMidis = [];

    this._bindEvents();
  }

  _bindEvents() {
    // Mode buttons
    document.querySelectorAll('.mode-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.mode-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        if (this._onModeChange) this._onModeChange(btn.dataset.mode);
      });
    });

    // Scale buttons
    document.querySelectorAll('.scale-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.scale-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        if (this._onScaleChange) {
          this._onScaleChange(btn.dataset.root, btn.dataset.scale);
        }
      });
    });

    // Mic toggle
    this._els.micToggle.addEventListener('click', () => {
      if (this._onMicToggle) this._onMicToggle();
    });
  }

  // ── Callbacks ───────────────────────────────────────────────

  onModeChange(cb) { this._onModeChange = cb; }
  onScaleChange(cb) { this._onScaleChange = cb; }
  onMicToggle(cb) { this._onMicToggle = cb; }

  // ── State Updates ───────────────────────────────────────────

  showApp() {
    this._els.loadingScreen.classList.add('fade-out');
    setTimeout(() => {
      this._els.loadingScreen.classList.add('hidden');
    }, 600);

    this._els.topBar.classList.remove('hidden');
    this._els.modeBar.classList.remove('hidden');
    this._els.scaleBar.classList.remove('hidden');
    this._els.infoPanel.classList.remove('hidden');
  }

  showDesktopHelp() {
    this._els.desktopHelp.classList.remove('hidden');
  }

  hideDesktopHelp() {
    this._els.desktopHelp.classList.add('hidden');
  }

  updateLoading(text) {
    if (this._els.loadingText) {
      this._els.loadingText.textContent = text;
    }
  }

  setMicListening(isListening) {
    if (isListening) {
      this._els.micToggle.classList.add('listening');
      this._els.micLabel.textContent = 'Stop';
    } else {
      this._els.micToggle.classList.remove('listening');
      this._els.micLabel.textContent = 'Start Listening';
    }
  }

  updateNote(noteInfo) {
    if (!noteInfo) {
      this._els.noteName.textContent = '—';
      this._els.noteName.className = 'note-name';
      this._els.noteOctave.textContent = '';
      this._els.noteFreq.textContent = 'Sing or play a note...';
      this._els.infoNote.textContent = '—';
      this._els.infoCents.textContent = '0¢';
      this._els.infoInScale.textContent = '—';
      this._els.infoInScale.style.color = '';
      return;
    }

    const { name, octave, cents, freq, midi } = noteInfo;

    this._els.noteName.textContent = name;
    this._els.noteOctave.textContent = octave;
    this._els.noteFreq.textContent = `${freq.toFixed(1)} Hz`;

    this._els.infoNote.textContent = `${name}${octave}`;
    this._els.infoCents.textContent = `${cents > 0 ? '+' : ''}${cents}¢`;

    // Tuning color
    const absCents = Math.abs(cents);
    if (absCents < 5) {
      this._els.noteName.className = 'note-name in-tune';
    } else if (absCents < 15) {
      this._els.noteName.className = 'note-name';
    } else {
      this._els.noteName.className = 'note-name off-tune';
    }

    // In-scale check
    const inScale = this._currentScaleMidis.includes(midi % 12);
    if (inScale) {
      this._els.infoInScale.textContent = '✓ Yes';
      this._els.infoInScale.style.color = 'var(--green)';
    } else {
      this._els.infoInScale.textContent = '✗ No';
      this._els.infoInScale.style.color = 'var(--text-faint)';
    }
  }

  updateVolume(volume) {
    this._els.volumeFill.style.width = `${volume}%`;
  }

  setScaleMidis(midis) {
    this._currentScaleMidis = midis;
  }
}
