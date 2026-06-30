// ════════════════════════════════════════════════════════════
// lib.rs
// Voix Vive XR — Spatial Guitar Academy
// Bevy OpenXR Engine — Module Registration + Plugin
//
// Two paths to XREAL Aura:
//   1. Kotlin + Jetpack XR SDK (native Android XR) — see apps/xr-prototype/android-xr/
//   2. Bevy + OpenXR (this engine) — desktop emulator + native XR binary
//
// Active plugins (demo-ready):
//   Fretboard, PitchDetection, HandTracking, SpatialAudio,
//   EnvironmentManager, Modes, XrShell
//
// Coming soon (code exists, needs Bevy 0.18 ParamSet fixes):
//   SystemMenu, HolographicUi, SensorFusion, TruebadourAi
// ════════════════════════════════════════════════════════════

pub mod environment_manager;
pub mod fretboard;
pub mod hand_tracking;
pub mod modes;
pub mod pitch_detection;
pub mod spatial_audio;
pub mod xr_shell;

// Coming soon — gated behind "extras" feature to avoid dep issues
#[cfg(feature = "extras")]
pub mod audio_transducer;
#[cfg(feature = "extras")]
pub mod holographic_ui;
#[cfg(feature = "extras")]
pub mod interaction;
#[cfg(feature = "extras")]
pub mod ipc;
#[cfg(feature = "extras")]
pub mod sensor_fusion;
#[cfg(feature = "extras")]
pub mod spatial_ui;
#[cfg(feature = "extras")]
pub mod system_menu;
#[cfg(feature = "extras")]
pub mod truebadour_ai;
#[cfg(feature = "extras")]
pub mod widgets;

pub use environment_manager::EnvironmentManagerPlugin;
pub use fretboard::FretboardPlugin;
pub use hand_tracking::HandTrackingPlugin;
pub use modes::ModesPlugin;
pub use pitch_detection::PitchDetectionPlugin;
pub use spatial_audio::SpatialAudioPlugin;
pub use xr_shell::XrShellPlugin;

use bevy::prelude::*;

#[derive(States, Default, Debug, Hash, Eq, PartialEq, Clone)]
pub enum VoixViveState {
    #[default]
    Idle,
    BeMode,
    DoMode,
    PlayMode,
}

pub struct VoixViveXrPlugin;

impl Plugin for VoixViveXrPlugin {
    fn build(&self, app: &mut App) {
        app.init_state::<VoixViveState>()
            .add_plugins(EnvironmentManagerPlugin)
            .add_plugins(FretboardPlugin)
            .add_plugins(HandTrackingPlugin)
            .add_plugins(ModesPlugin)
            .add_plugins(PitchDetectionPlugin)
            .add_plugins(SpatialAudioPlugin);
    }
}

// ── Android Entry Point (cdylib) ─────────────────────────────

#[cfg(target_os = "android")]
#[bevy_main]
fn main() {
    android_logger::init_once(
        android_logger::Config::default().with_max_level(log::LevelFilter::Info),
    );

    #[cfg(feature = "xr")]
    {
        use bevy::render::pipelined_rendering::PipelinedRenderingPlugin;
        use bevy_mod_openxr::{add_xr_plugins, resources::OxrSessionConfig, types::EnvironmentBlendMode};

        App::new()
            .add_plugins(add_xr_plugins(
                DefaultPlugins.build().disable::<PipelinedRenderingPlugin>(),
            ))
            .insert_resource(OxrSessionConfig {
                blend_mode_preference: vec![
                    EnvironmentBlendMode::ALPHA_BLEND,
                    EnvironmentBlendMode::OPAQUE,
                ],
                ..default()
            })
            .insert_resource(ClearColor(Color::NONE))
            .add_plugins(VoixViveXrPlugin)
            .add_plugins(XrShellPlugin)
            .run();
    }

    #[cfg(not(feature = "xr"))]
    {
        App::new()
            .add_plugins(DefaultPlugins)
            .add_plugins(VoixViveXrPlugin)
            .run();
    }
}
