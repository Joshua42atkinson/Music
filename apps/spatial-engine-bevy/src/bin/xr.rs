// ════════════════════════════════════════════════════════════
// bin/xr.rs
// Voix Vive XR — Native OpenXR Entry Point (XREAL Aura)
//
// Run with: cargo run --bin voix-vive-xr --features xr
//
// Target device: XREAL Aura (Android XR, optical see-through)
//   - 70° FOV optical see-through (no camera passthrough delay)
//   - World-facing cameras for hand tracking (XR_EXT_hand_tracking)
//   - 6DoF spatial anchoring for fretboard alignment
//   - Snapdragon Reality Elite + X1S Spatial Coprocessor
//
// The user sees their real guitar through the glass. The holographic
// fretboard overlays on top. Hand tracking maps actual fingertips
// to fret positions.
//
// Also works with Monado runtime on Linux (Vive Elite Pro, etc.)
// ════════════════════════════════════════════════════════════

use bevy::prelude::*;
use bevy::render::pipelined_rendering::PipelinedRenderingPlugin;
use bevy_mod_openxr::{add_xr_plugins, resources::OxrSessionConfig, types::EnvironmentBlendMode};
use voix_vive_xr::{VoixViveXrPlugin, XrShellPlugin};

fn main() {
    tracing_subscriber::fmt().init();

    info!("Voix Vive XR — Launching for XREAL Aura (optical see-through)");

    App::new()
        .add_plugins(add_xr_plugins(
            DefaultPlugins.build().disable::<PipelinedRenderingPlugin>(),
        ))
        // XREAL Aura is optical see-through — ALPHA_BLEND is the primary mode
        // The user sees the real world directly through glass, not camera passthrough
        .insert_resource(OxrSessionConfig {
            blend_mode_preference: vec![
                EnvironmentBlendMode::ALPHA_BLEND,
            ],
            ..default()
        })
        // Transparent background — only digital overlays are visible
        // The real guitar and hands are seen through the glass
        .insert_resource(ClearColor(Color::NONE))
        .add_plugins(VoixViveXrPlugin)
        .add_plugins(XrShellPlugin)
        .run();
}
