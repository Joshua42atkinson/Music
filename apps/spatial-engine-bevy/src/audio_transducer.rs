use bevy::prelude::*;
use crate::ipc::IpcEvent;

pub struct AudioTransducerPlugin;

impl Plugin for AudioTransducerPlugin {
    fn build(&self, app: &mut App) {
        app.add_systems(Startup, load_soundfonts)
           .add_systems(Update, transcribe_json_to_audio);
    }
}

#[derive(Resource)]
struct SynthesizerBank {
    pluck_handle: Handle<bevy::audio::AudioSource>,
}

fn load_soundfonts(mut commands: Commands, asset_server: Res<AssetServer>) {
    let audio_path = "audio/placeholder_bass_pluck.ogg";
    if std::path::Path::new(&format!("assets/{}", audio_path)).exists() {
        let pluck_handle = asset_server.load(audio_path);
        commands.insert_resource(SynthesizerBank { pluck_handle });
        info!("[Audio Transducer] Soundfont loaded: {}", audio_path);
    } else {
        warn!("[Audio Transducer] Audio asset '{}' not found — audio feedback disabled (coming soon)", audio_path);
    }
}

fn transcribe_json_to_audio(
    mut events: MessageReader<IpcEvent>,
    bank: Option<Res<SynthesizerBank>>,
    mut commands: Commands,
) {
    let Some(bank) = bank else { return };
    for event in events.read() {
        if event.0.event == "GEMMA_TOKEN" || event.0.event == "NOTE_PLAYED" {
            if let Some(data) = &event.0.data {
                if let Some(note_name) = data.get("name").and_then(|n: &serde_json::Value| n.as_str()) {
                    let pitch_multiplier = match note_name {
                        "C2" => 0.5,
                        "E2" => 0.63,
                        "G2" => 0.75,
                        _ => 1.0,
                    };

                    // Bevy 0.18: spawn an audio sink with playback settings
                    commands.spawn((
                        bevy::audio::AudioPlayer(bank.pluck_handle.clone()),
                        bevy::audio::PlaybackSettings::ONCE
                            .with_speed(pitch_multiplier),
                    ));
                     
                    info!("[Audio Transducer] Translated JSON token '{}' into raw audio playback.", note_name);
                }
            }
        }
    }
}
