// ════════════════════════════════════════════════════════════
// pitch_detection.rs
// Voix Vive XR — Real-Time Pitch Detection (YIN Algorithm)
//
// Uses cpal for cross-platform low-latency microphone input.
// The YIN autocorrelation algorithm detects the fundamental
// frequency of the guitar signal in real-time.
//
// Ported from the WebXR prototype's pitch-detection.js,
// which was ported from the companion app's pitchDetection.js.
//
// Pipeline: cpal InputStream → Ring Buffer → YIN → MIDI → Fretboard
// ════════════════════════════════════════════════════════════

use bevy::prelude::*;
use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
use cpal::StreamConfig;
use crossbeam_channel::{unbounded, Receiver, Sender};
use std::sync::Arc;
use std::sync::atomic::{AtomicBool, Ordering};

use crate::fretboard::FretboardState;

pub struct PitchDetectionPlugin;

impl Plugin for PitchDetectionPlugin {
    fn build(&self, app: &mut App) {
        app.insert_resource(PitchDetectionState::default())
            .insert_resource(AudioChannel { tx: None, rx: None, is_running: Arc::new(AtomicBool::new(false)) })
            .add_systems(Startup, init_pitch_detection)
            .add_systems(Update, poll_pitch_results);
    }
}

#[derive(Resource, Default)]
pub struct PitchDetectionState {
    pub current_note: Option<DetectedNote>,
    pub volume: f32,
}

#[derive(Debug, Clone)]
pub struct DetectedNote {
    pub midi: i32,
    pub note_name: String,
    pub frequency: f32,
    pub cents: i32,
}

#[derive(Resource)]
pub struct AudioChannel {
    pub tx: Option<Sender<f32>>,
    pub rx: Option<Receiver<DetectedNote>>,
    pub is_running: Arc<AtomicBool>,
}

const SAMPLE_RATE: usize = 48000;
const BUFFER_SIZE: usize = 2048;
const YIN_THRESHOLD: f32 = 0.15;
const MIN_FREQ: f32 = 60.0;
const MAX_FREQ: f32 = 1200.0;

const NOTE_NAMES: [&str; 12] = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

fn init_pitch_detection(
    mut channel: ResMut<AudioChannel>,
) {
    let (freq_tx, freq_rx) = unbounded::<DetectedNote>();
    let (audio_tx, audio_rx) = unbounded::<f32>();

    let audio_tx_for_stream = audio_tx.clone();
    channel.tx = Some(audio_tx);
    channel.rx = Some(freq_rx);

    // Spawn the audio processing thread
    let is_running = channel.is_running.clone();
    std::thread::spawn(move || {
        audio_processing_loop(audio_rx, freq_tx, is_running);
    });

    // Try to start cpal audio input
    let host = cpal::default_host();
    let device = match host.default_input_device() {
        Some(d) => d,
        None => {
            warn!("[PitchDetection] No audio input device found");
            return;
        }
    };

    let config = StreamConfig {
        channels: 1,
        sample_rate: cpal::SampleRate(SAMPLE_RATE as u32),
        buffer_size: cpal::BufferSize::Default,
    };

    let stream = match device.build_input_stream(
        &config,
        move |data: &[f32], _: &cpal::InputCallbackInfo| {
            for &sample in data {
                let _ = audio_tx_for_stream.send(sample);
            }
        },
        |err| error!("[PitchDetection] Audio stream error: {}", err),
        None,
    ) {
        Ok(s) => s,
        Err(e) => {
            error!("[PitchDetection] Failed to build input stream: {}", e);
            return;
        }
    };

    if let Err(e) = stream.play() {
        error!("[PitchDetection] Failed to start audio stream: {}", e);
        return;
    }

    info!("[PitchDetection] Audio input started — {}Hz, mono", SAMPLE_RATE);

    // Keep the stream alive
    std::mem::forget(stream);
}

fn audio_processing_loop(
    audio_rx: Receiver<f32>,
    freq_tx: Sender<DetectedNote>,
    is_running: Arc<AtomicBool>,
) {
    let mut ring_buffer = vec![0.0f32; BUFFER_SIZE];
    let mut ring_pos = 0usize;
    let mut buffer_full = false;

    is_running.store(true, Ordering::SeqCst);

    while is_running.load(Ordering::SeqCst) {
        // Collect samples from the audio channel
        while let Ok(sample) = audio_rx.try_recv() {
            ring_buffer[ring_pos] = sample;
            ring_pos = (ring_pos + 1) % BUFFER_SIZE;
            if ring_pos == 0 {
                buffer_full = true;
            }
        }

        // Run YIN when buffer is full
        if buffer_full {
            let buffer_copy = ring_buffer.clone();
            if let Some(freq) = yin_detect(&buffer_copy, SAMPLE_RATE) {
                if freq >= MIN_FREQ && freq <= MAX_FREQ {
                    let midi = (69.0 + 12.0 * (freq / 440.0).log2()).round() as i32;
                    let exact_midi = 69.0 + 12.0 * (freq / 440.0).log2();
                    let cents = ((exact_midi - midi as f32) * 100.0).round() as i32;
                    let pc = ((midi % 12) + 12) % 12;
                    let octave = midi / 12 - 1;
                    let note_name = format!("{}{}", NOTE_NAMES[pc as usize], octave);

                    let _ = freq_tx.send(DetectedNote {
                        midi,
                        note_name,
                        frequency: freq,
                        cents,
                    });
                }
            }
            buffer_full = false;
        }

        // Small sleep to avoid busy-waiting
        std::thread::sleep(std::time::Duration::from_millis(1));
    }
}

fn poll_pitch_results(
    channel: Res<AudioChannel>,
    mut state: ResMut<PitchDetectionState>,
    mut fretboard_state: ResMut<FretboardState>,
) {
    if let Some(rx) = &channel.rx {
        while let Ok(note) = rx.try_recv() {
            state.current_note = Some(note.clone());
            fretboard_state.active_midi = Some(note.midi);
        }
    }
}

/// YIN pitch detection algorithm
/// Returns the fundamental frequency in Hz, or None if no pitch detected
fn yin_detect(buffer: &[f32], sample_rate: usize) -> Option<f32> {
    let half_buf = buffer.len() / 2;
    let mut yin_buffer = vec![0.0f32; half_buf];

    // Step 1: Difference function
    for t in 0..half_buf {
        let mut sum = 0.0;
        for i in 0..half_buf {
            let delta = buffer[i] - buffer[i + t];
            sum += delta * delta;
        }
        yin_buffer[t] = sum;
    }

    // Step 2: Cumulative mean normalized difference
    yin_buffer[0] = 1.0;
    let mut running_sum = 0.0;
    for t in 1..half_buf {
        running_sum += yin_buffer[t];
        yin_buffer[t] = if running_sum == 0.0 { yin_buffer[t] } else { yin_buffer[t] * t as f32 / running_sum };
    }

    // Step 3: Absolute threshold
    let mut tau = -1i32;
    for t in 2..half_buf {
        if yin_buffer[t] < YIN_THRESHOLD {
            while (t + 1) < half_buf && yin_buffer[t + 1] < yin_buffer[t] {
                tau = (t + 1) as i32;
            }
            if tau == -1 {
                tau = t as i32;
            }
            break;
        }
    }

    if tau == -1 {
        // No confident pitch — find global minimum
        let mut min_val = 1.0f32;
        let mut min_tau = -1i32;
        for t in 2..half_buf {
            if yin_buffer[t] < min_val {
                min_val = yin_buffer[t];
                min_tau = t as i32;
            }
        }
        if min_tau != -1 && min_val < 0.3 {
            tau = min_tau;
        } else {
            return None;
        }
    }

    // Step 4: Parabolic interpolation
    let tau_usize = tau as usize;
    let mut better_tau = tau as f32;
    if tau_usize > 0 && tau_usize < half_buf - 1 {
        let s0 = yin_buffer[tau_usize - 1];
        let s1 = yin_buffer[tau_usize];
        let s2 = yin_buffer[tau_usize + 1];
        let adjustment = (s2 - s0) / (2.0 * (2.0 * s1 - s2 - s0));
        if adjustment.abs() < 1.0 {
            better_tau = tau as f32 + adjustment;
        }
    }

    Some(sample_rate as f32 / better_tau)
}
