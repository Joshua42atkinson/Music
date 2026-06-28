use bevy::prelude::*;
use crate::ipc::IpcEvent;

pub struct TruebadourAiPlugin;

impl Plugin for TruebadourAiPlugin {
    fn build(&self, app: &mut App) {
        app.insert_resource(ContextWindow { notes: vec![] })
           .add_systems(Update, predict_bass_response);
    }
}

/// A rolling context window of the last notes the user played, akin to an LLM token window.
#[derive(Resource)]
pub struct ContextWindow {
    pub notes: Vec<String>,
}

/// The Truebadour Avatar marker component
#[derive(Component)]
pub struct TruebadourAvatar;

fn predict_bass_response(
    mut events: EventReader<IpcEvent>,
    mut context: ResMut<ContextWindow>,
    mut avatars: Query<&mut Transform, With<TruebadourAvatar>>,
) {
    for event in events.read() {
        if event.0.event == "NOTE_PLAYED" {
            if let Some(data) = &event.0.data {
                if let Some(note_name) = data.get("name").and_then(|n| n.as_str()) {
                    // 1. Add to context window
                    context.notes.push(note_name.to_string());
                    if context.notes.len() > 8 {
                        context.notes.remove(0); // Keep last 8 tokens
                    }

                    // 2. ACE / AI Audio Generative Pipeline
                    // Scaffold: We package the context window and trigger an asynchronous
                    // request to the local ONNX or Cloud API endpoint.
                    let context_string = context.notes.join(", ");
                    println!("[AiAudioEngine] Sending context to AI Audio Model: [{}]", context_string);
                    
                    // Simulate receiving the generated audio buffer
                    let predicted_bass_note = format!("{}2", note_name);
                    println!("[AiAudioEngine] Received generated audio buffer for base backing track matching: {}", predicted_bass_note);

                    // 3. Somatic/Visual Feedback (Bounce the Truebadour Avatar)
                    for mut transform in avatars.iter_mut() {
                        transform.scale = Vec3::splat(1.5);
                    }
                }
            }
        }
    }

    // Decay the bounce back to normal size
    for mut transform in avatars.iter_mut() {
        transform.scale = transform.scale.lerp(Vec3::splat(1.0), 0.1);
    }
}
