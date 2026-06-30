// ════════════════════════════════════════════════════════════
// xr_shell.rs
// Ported from TRINITY OS — XR Environment Shell
//
// Sets up the XR environment: floor, lighting, and tonemapping.
// In OpenXR mode, the camera rig is spawned automatically by
// bevy_mod_openxr — we do NOT spawn a Camera3d here.
// ════════════════════════════════════════════════════════════

use bevy::prelude::*;

pub struct XrShellPlugin;

impl Plugin for XrShellPlugin {
    fn build(&self, app: &mut App) {
        app.add_systems(Startup, setup_xr_shell)
            .add_systems(Update, attach_tonemapping_to_xr_camera);
    }
}

fn setup_xr_shell(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
) {
    // Floor
    commands.spawn((
        Mesh3d(meshes.add(Plane3d::default().mesh().size(200.0, 200.0))),
        MeshMaterial3d(materials.add(StandardMaterial {
            base_color: Color::srgb(0.01, 0.03, 0.06),
            perceptual_roughness: 0.1,
            metallic: 0.8,
            ..default()
        })),
        Transform::from_xyz(0.0, 0.0, 0.0),
    ));

    // Directional sunlight
    commands.spawn((
        DirectionalLight {
            illuminance: 3000.0,
            shadows_enabled: true,
            ..default()
        },
        Transform::from_rotation(Quat::from_euler(EulerRot::XYZ, -0.8, 0.4, 0.0)),
    ));

    // Fill light (cool tone)
    commands.spawn((
        PointLight {
            color: Color::srgb(0.4, 0.45, 0.6),
            intensity: 5_000.0,
            range: 100.0,
            ..default()
        },
        Transform::from_xyz(0.0, 30.0, 0.0),
    ));

    // Gold accent rim light
    commands.spawn((
        PointLight {
            color: Color::srgb(0.9, 0.75, 0.25),
            intensity: 3_000.0,
            range: 50.0,
            ..default()
        },
        Transform::from_xyz(0.0, 2.0, -3.0),
    ));
}

pub fn attach_tonemapping_to_xr_camera(
    mut commands: Commands,
    camera_query: Query<
        Entity,
        (
            With<Camera3d>,
            Without<bevy::core_pipeline::tonemapping::Tonemapping>,
        ),
    >,
) {
    for entity in camera_query.iter() {
        commands
            .entity(entity)
            .insert((bevy::core_pipeline::tonemapping::Tonemapping::TonyMcMapface,));
    }
}
