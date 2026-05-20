use std::process::Command;
use std::fs::File;
use std::io::{Read, Seek, SeekFrom};
use std::path::Path;
use serde::{Serialize, Deserialize};
use tracing::info;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PitchPoint {
    pub time: f64,
    pub frequency: f64,
    pub note: String,
    pub deviation_cents: f64,
    pub amplitude: f64,
}

/// Helper mapping frequency to scientific pitch notation
pub fn frequency_to_note(freq: f64) -> (String, f64) {
    if freq <= 10.0 {
        return ("Silence".to_string(), 0.0);
    }
    let midi = 12.0 * (freq / 440.0).log2() + 69.0;
    let rounded_midi = midi.round();
    let note_names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    let note_idx = (rounded_midi as i32) % 12;
    let octave = (rounded_midi as i32) / 12 - 1;
    
    let note_name = if note_idx >= 0 && note_idx < 12 {
        format!("{}{}", note_names[note_idx as usize], octave)
    } else {
        "??".to_string()
    };
    
    let deviation = (midi - rounded_midi) * 100.0;
    (note_name, deviation)
}

/// Spawns local ffmpeg command to extract mono 16kHz WAV from video
pub fn extract_audio_ffmpeg(video_path: &str, wav_output_path: &str) -> anyhow::Result<()> {
    info!("🎬 Spawning FFmpeg to extract audio: {} -> {}", video_path, wav_output_path);
    
    let status = Command::new("ffmpeg")
        .args(&[
            "-y",
            "-i", video_path,
            "-vn",
            "-acodec", "pcm_s16le",
            "-ar", "16000",
            "-ac", "1",
            wav_output_path
        ])
        .status()?;
        
    if !status.success() {
        return Err(anyhow::anyhow!("FFmpeg audio extraction failed with status {:?}", status));
    }
    
    info!("✅ FFmpeg audio extraction successful!");
    Ok(())
}

/// Performs a lightweight autocorrelation-based pitch tracking on mono 16kHz WAV data
pub fn analyze_wav_pitch(wav_path: &str) -> anyhow::Result<Vec<PitchPoint>> {
    let mut file = File::open(wav_path)?;
    
    // Skip standard 44-byte WAV header
    file.seek(SeekFrom::Start(44))?;
    
    let mut buffer = Vec::new();
    file.read_to_end(&mut buffer)?;
    
    // Convert raw i16 bytes into f64 samples normalized to [-1.0, 1.0]
    let samples: Vec<f64> = buffer
        .chunks_exact(2)
        .map(|chunk| {
            let sample_i16 = i16::from_le_bytes([chunk[0], chunk[1]]);
            sample_i16 as f64 / 32768.0
        })
        .collect();
        
    let sample_rate = 16000.0;
    let frame_size = 1024;
    let stride = 512;
    let min_lag = (sample_rate / 659.0) as usize; // ~E5
    let max_lag = (sample_rate / 82.0) as usize;  // ~E2
    let silence_threshold = 0.015; // RMS threshold

    let mut pitch_points = Vec::new();
    
    let mut i = 0;
    while i + frame_size < samples.len() {
        let frame = &samples[i..i+frame_size];
        
        // Calculate frame energy (RMS)
        let mut sum_sq = 0.0;
        for &s in frame {
            sum_sq += s * s;
        }
        let rms = (sum_sq / frame_size as f64).sqrt();
        
        let time = i as f64 / sample_rate;
        
        if rms >= silence_threshold {
            // Autocorrelation Pitch Detection
            let mut best_lag = 0;
            let mut best_r = -1.0;
            
            for lag in min_lag..=max_lag {
                let mut r = 0.0;
                for t in 0..(frame_size - lag) {
                    r += frame[t] * frame[t + lag];
                }
                
                if r > best_r {
                    best_r = r;
                    best_lag = lag;
                }
            }
            
            if best_lag > 0 {
                let freq = sample_rate / best_lag as f64;
                if freq >= 75.0 && freq <= 700.0 {
                    let (note, cents) = frequency_to_note(freq);
                    pitch_points.push(PitchPoint {
                        time,
                        frequency: freq,
                        note,
                        deviation_cents: cents,
                        amplitude: rms,
                    });
                }
            }
        }
        
        i += stride;
    }
    
    info!("🎼 Extracted {} pitch telemetry points from audio", pitch_points.len());
    Ok(pitch_points)
}

/// Combined processing utility: processes video, extracts pitch telemetry and saves to DB
pub fn preprocess_video(video_path: &str) -> anyhow::Result<(String, Vec<PitchPoint>)> {
    let video_dir = Path::new(video_path).parent().unwrap_or_else(|| Path::new("."));
    let file_stem = Path::new(video_path).file_stem().and_then(|s| s.to_str()).unwrap_or("temp");
    
    let wav_path = video_dir.join(format!("{}.wav", file_stem));
    let wav_path_str = wav_path.to_string_lossy().to_string();
    
    extract_audio_ffmpeg(video_path, &wav_path_str)?;
    let points = analyze_wav_pitch(&wav_path_str)?;
    
    Ok((wav_path_str, points))
}
