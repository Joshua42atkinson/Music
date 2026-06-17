use bevy::prelude::*;
use bevy_kira_audio::prelude::*;
use bevy_kira_audio::AudioSource;
use crate::ipc::IpcEvent;

pub struct AudioTransducerPlugin;

impl Plugin for AudioTransducerPlugin {
    fn build(&self, app: &mut App) {
        // We will initialize the audio plugin from `bevy_kira_audio` in main.rs
        // to avoid duplicate additions if other plugins also need audio.
        app.add_systems(Startup, load_soundfonts)
           .add_systems(Update, transcribe_json_to_audio);
    }
}

#[derive(Resource)]
struct SynthesizerBank {
    // Scaffold: In production, this holds the parsed .sf2 SoundFonts or raw PCM buffer handles.
    // For V1, we just load a basic synthesized pluck sound.
    pluck_handle: Handle<AudioSource>,
}

fn load_soundfonts(mut commands: Commands, asset_server: Res<AssetServer>) {
    // Normally we would load a realistic bass `.ogg` or `.wav` sample here,
    // or initialize a procedural synth generator.
    // We will just use a placeholder handle for now to satisfy the compiler.
    // We will need a placeholder audio file in `assets/` eventually.
    let pluck_handle = asset_server.load("audio/placeholder_bass_pluck.ogg");
    commands.insert_resource(SynthesizerBank { pluck_handle });
}

fn transcribe_json_to_audio(
    mut events: EventReader<IpcEvent>,
    audio: Res<Audio>,
    bank: Res<SynthesizerBank>,
) {
    for event in events.read() {
        // Scaffold: Assuming the JSON comes in with `event == "GEMMA_TOKEN"`
        // or for now, we just intercept the `NOTE_PLAYED` from the Truebadour AI prediction.
        if event.0.event == "GEMMA_TOKEN" || event.0.event == "NOTE_PLAYED" {
            if let Some(data) = &event.0.data {
                if let Some(note_name) = data.get("name").and_then(|n| n.as_str()) {
                    // TRANSDUCER LOGIC:
                    // 1. JSON Token -> Note Name (e.g., "E2")
                    // 2. Map Note Name to playback speed/pitch shift
                    let pitch_multiplier = match note_name {
                        "C2" => 0.5,
                        "E2" => 0.63,
                        "G2" => 0.75,
                        _ => 1.0,
                    };

                    // 3. Play the audio buffer instantly!
                    // This bypasses the cloud entirely, playing directly on the Strix Halo
                    // and outputting through OpenXR.
                    audio.play(bank.pluck_handle.clone())
                         .with_playback_rate(pitch_multiplier);
                         
                    println!("[Audio Transducer] Translated JSON token '{}' into raw audio playback.", note_name);
                }
            }
        }
    }
}
