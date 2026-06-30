// ════════════════════════════════════════════════════════════
// bin/desktop.rs
// Voix Vive XR — Desktop Emulator Entry Point
//
// Run with: cargo run --bin voix-vive-desktop --features desktop
// Provides a mouse-controlled 3D preview of the spatial guitar
// academy without requiring an XR headset.
// ════════════════════════════════════════════════════════════

use bevy::prelude::*;
#[cfg(feature = "desktop")]
use bevy_panorbit_camera::{PanOrbitCamera, PanOrbitCameraPlugin};
use voix_vive_xr::VoixViveXrPlugin;
use voix_vive_xr::pitch_detection::PitchDetectionState;

fn main() {
    tracing_subscriber::fmt().init();

    let mut app = App::new();

    app.add_plugins(DefaultPlugins.set(WindowPlugin {
        primary_window: Some(Window {
            title: "Voix Vive XR — Desktop Emulator".to_string(),
            resolution: (1280, 800).into(),
            ..default()
        }),
        ..default()
    }));

    #[cfg(feature = "desktop")]
    {
        app.add_plugins(PanOrbitCameraPlugin);
    }

    app.add_plugins(VoixViveXrPlugin);
    app.add_systems(Startup, (setup_desktop_camera, setup_note_overlay));
    app.add_systems(Update, update_note_overlay);
    app.run();
}

#[cfg(feature = "desktop")]
fn setup_desktop_camera(mut commands: Commands) {
    commands.spawn((
        Camera3d::default(),
        bevy::core_pipeline::tonemapping::Tonemapping::TonyMcMapface,
        Transform::from_xyz(0.0, 1.2, 2.5).looking_at(Vec3::new(0.0, 0.9, 0.0), Vec3::Y),
        PanOrbitCamera {
            focus: Vec3::new(0.0, 0.9, 0.0),
            radius: Some(2.5),
            button_orbit: MouseButton::Right,
            button_pan: MouseButton::Middle,
            ..default()
        },
    ));
}

// ── On-Screen Note Display Overlay ───────────────────────────
// Large text overlay showing detected note for demo recording

#[derive(Component)]
struct NoteDisplayText;

#[derive(Component)]
struct FreqDisplayText;

#[derive(Component)]
struct CentsDisplayText;

#[derive(Component)]
struct ScaleDisplayText;

#[derive(Component)]
struct TitleText;

fn setup_note_overlay(mut commands: Commands) {
    // Title
    commands.spawn((
        Text::new("VOIX VIVE XR — Guitar Academy"),
        TextFont {
            font_size: 28.0,
            ..default()
        },
        TextColor(Color::srgb(0.9, 0.75, 0.2)),
        Node {
            position_type: PositionType::Absolute,
            top: Val::Px(20.0),
            left: Val::Px(20.0),
            ..default()
        },
        TitleText,
    ));

    // Detected note — large, center-bottom
    commands.spawn((
        Text::new("—"),
        TextFont {
            font_size: 96.0,
            ..default()
        },
        TextColor(Color::srgb(1.0, 0.85, 0.3)),
        Node {
            position_type: PositionType::Absolute,
            bottom: Val::Px(120.0),
            left: Val::Px(40.0),
            ..default()
        },
        NoteDisplayText,
    ));

    // Frequency
    commands.spawn((
        Text::new(""),
        TextFont {
            font_size: 24.0,
            ..default()
        },
        TextColor(Color::srgb(0.7, 0.8, 1.0)),
        Node {
            position_type: PositionType::Absolute,
            bottom: Val::Px(80.0),
            left: Val::Px(40.0),
            ..default()
        },
        FreqDisplayText,
    ));

    // Cents deviation
    commands.spawn((
        Text::new(""),
        TextFont {
            font_size: 20.0,
            ..default()
        },
        TextColor(Color::srgb(0.6, 0.6, 0.6)),
        Node {
            position_type: PositionType::Absolute,
            bottom: Val::Px(50.0),
            left: Val::Px(40.0),
            ..default()
        },
        CentsDisplayText,
    ));

    // Scale indicator
    commands.spawn((
        Text::new(""),
        TextFont {
            font_size: 18.0,
            ..default()
        },
        TextColor(Color::srgb(0.3, 0.5, 0.8)),
        Node {
            position_type: PositionType::Absolute,
            bottom: Val::Px(20.0),
            left: Val::Px(40.0),
            ..default()
        },
        ScaleDisplayText,
    ));
}

fn update_note_overlay(
    pitch_state: Res<PitchDetectionState>,
    mut texts: Query<(&mut Text, Option<&NoteDisplayText>, Option<&FreqDisplayText>, Option<&CentsDisplayText>, Option<&ScaleDisplayText>)>,
) {
    if let Some(note) = &pitch_state.current_note {
        for (mut text, note_marker, freq_marker, cents_marker, scale_marker) in texts.iter_mut() {
            if note_marker.is_some() {
                text.0 = note.note_name.clone();
            } else if freq_marker.is_some() {
                text.0 = format!("{:.1} Hz", note.frequency);
            } else if cents_marker.is_some() {
                text.0 = if note.cents.abs() < 5 {
                    format!("{} cents — IN TUNE", note.cents)
                } else if note.cents > 0 {
                    format!("+{} cents — sharp", note.cents)
                } else {
                    format!("{} cents — flat", note.cents)
                };
            } else if scale_marker.is_some() {
                text.0 = format!("C Major Scale — root note highlighted");
            }
        }
    } else {
        for (mut text, note_marker, freq_marker, _, _) in texts.iter_mut() {
            if note_marker.is_some() {
                text.0 = "—".to_string();
            } else if freq_marker.is_some() {
                text.0 = "Play a note...".to_string();
            }
        }
    }
}

#[cfg(not(feature = "desktop"))]
fn setup_desktop_camera(mut commands: Commands) {
    commands.spawn((
        Camera3d::default(),
        bevy::core_pipeline::tonemapping::Tonemapping::TonyMcMapface,
        Transform::from_xyz(0.0, 1.5, 4.0).looking_at(Vec3::new(0.0, 1.0, 0.0), Vec3::Y),
    ));
}
