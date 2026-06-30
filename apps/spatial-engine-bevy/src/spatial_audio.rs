// ════════════════════════════════════════════════════════════
// spatial_audio.rs
// Voix Vive XR — Spatial Audio Feedback
//
// When a note is detected, plays a tone at the 3D position
// of the matching fretboard pothole. Uses Bevy's audio system
// with spatial positioning.
//
// In XR mode, the listener position is the XR camera.
// On desktop, the listener is the PanOrbitCamera.
// ════════════════════════════════════════════════════════════

use bevy::prelude::*;
use bevy::audio::SpatialListener;

use crate::pitch_detection::PitchDetectionState;

pub struct SpatialAudioPlugin;

impl Plugin for SpatialAudioPlugin {
    fn build(&self, app: &mut App) {
        app.add_systems(Startup, setup_spatial_listener)
            .add_systems(Update, play_note_feedback.after(crate::fretboard::update_fretboard));
    }
}

#[derive(Component)]
pub struct SpatialListenerMarker;

fn setup_spatial_listener(mut commands: Commands) {
    // Spawn the spatial audio listener at origin
    // In XR mode, this will be updated to follow the XR camera
    commands.spawn((
        SpatialListener::new(0.4),
        SpatialListenerMarker,
        Transform::from_xyz(0.0, 1.5, 4.0),
    ));
}

fn play_note_feedback(
    pitch_state: Res<PitchDetectionState>,
    time: Res<Time>,
    mut last_play: Local<f64>,
) {
    if let Some(note) = &pitch_state.current_note {
        let now = time.elapsed_secs() as f64;
        if now - *last_play < 0.08 {
            return;
        }
        *last_play = now;

        info!(
            "[SpatialAudio] Note {} ({:.1} Hz) — spatial positioning coming soon",
            note.note_name, note.frequency
        );
    }
}
