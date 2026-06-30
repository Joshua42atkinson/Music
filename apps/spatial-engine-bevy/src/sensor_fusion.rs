use bevy::prelude::*;
use crate::ipc::IpcEvent;

#[cfg(feature = "xr")]
use bevy_mod_openxr::hands::{HandBoneTracker, HandBone};

pub struct SensorFusionPlugin;

impl Plugin for SensorFusionPlugin {
    fn build(&self, app: &mut App) {
        app.add_message::<FusionScore>()
           .insert_resource(RightHandMotion { velocity: Vec3::ZERO, last_pos: Vec3::ZERO })
           .add_systems(Update, (track_optical_motion, evaluate_sensor_fusion).chain());
    }
}

/// Emitted when a mechanical action (like picking) is fully evaluated
#[derive(Message, Debug)]
pub struct FusionScore {
    pub optical_velocity: f32,
    pub acoustic_latency_ms: f32, // Time between hand strike and mic transient
    pub note_name: String,
    pub evaluation: String,
}

#[derive(Resource)]
struct RightHandMotion {
    velocity: Vec3,
    last_pos: Vec3,
}

/// Tracks the physical velocity of the right hand (picking hand)
#[cfg(feature = "xr")]
fn track_optical_motion(
    time: Res<Time>,
    mut motion: ResMut<RightHandMotion>,
    // In OpenXR, we'd query the specific bone of the right hand, e.g. Index Tip or Wrist
    bone_query: Query<&Transform, With<HandBone>>,
) {
    // Scaffold: If we find a bone transform, we track its delta.
    // For V1, we assume the first tracked bone is our proxy for the picking hand.
    if let Some(transform) = bone_query.iter().next() {
        let current_pos = transform.translation;
        let delta = current_pos - motion.last_pos;
        motion.velocity = delta / time.delta_secs();
        motion.last_pos = current_pos;
    }
}

#[cfg(not(feature = "xr"))]
fn track_optical_motion(
    time: Res<Time>,
    mut motion: ResMut<RightHandMotion>,
) {
    let simulated_y = (time.elapsed_secs() * 5.0).sin() * 0.1;
    let current_pos = Vec3::new(0.0, simulated_y, 0.0);
    let delta = current_pos - motion.last_pos;
    motion.velocity = delta / time.delta_secs();
    motion.last_pos = current_pos;
}

use crate::ipc::{IpcPayload, OutgoingIpcEvent};
use serde_json::json;

/// Combines Acoustic (IPC) and Optical (Hand Tracking) to evaluate the Pling
fn evaluate_sensor_fusion(
    mut events: MessageReader<IpcEvent>,
    motion: Res<RightHandMotion>,
    mut score_writer: MessageWriter<FusionScore>,
    mut outgoing_ipc: MessageWriter<OutgoingIpcEvent>,
) {
    for event in events.read() {
        if event.0.event == "NOTE_PLAYED" {
            if let Some(data) = &event.0.data {
                if let Some(note_name) = data.get("name").and_then(|n: &serde_json::Value| n.as_str()) {
                    let speed = motion.velocity.length();
                    
                    let mut evaluation = "Perfect Pling".to_string();
                    if speed < 0.1 {
                        evaluation = "Muted Strike Detected: Acoustic note heard but physical hand velocity was low.".to_string();
                    } else if speed > 5.0 {
                        evaluation = "Aggressive Strike Detected: Hand velocity extreme.".to_string();
                    }

                    score_writer.write(FusionScore {
                        optical_velocity: speed,
                        acoustic_latency_ms: 0.0, // Scaffolded for now
                        note_name: note_name.to_string(),
                        evaluation: evaluation.clone(),
                    });

                    // Send the evaluated score back to React via IPC
                    outgoing_ipc.write(OutgoingIpcEvent(IpcPayload {
                        event: "FUSION_SCORE".to_string(),
                        archetype: Some("SensorFusion".to_string()),
                        friction: Some(0),
                        data: Some(json!({
                            "note_name": note_name,
                            "optical_velocity": speed,
                            "evaluation": evaluation,
                            "acoustic_latency_ms": 0.0
                        })),
                    }));

                    info!("[Sensor Fusion] Note: {}, Velocity: {:.2}, Eval: {}", note_name, speed, evaluation);
                }
            }
        }
    }
}
