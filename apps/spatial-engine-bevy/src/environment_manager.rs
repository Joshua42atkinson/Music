// ════════════════════════════════════════════════════════════
// environment_manager.rs
// Ported from TRINITY OS — Adapted for Voix Vive Guitar Practice
//
// Scene state machine for practice environments:
// - ZenGarden: Calm, meditative space for BE mode
// - Studio: Focused practice space for DO mode
// - Stage: Performance environment for PLAY mode
// ════════════════════════════════════════════════════════════

use bevy::prelude::*;

pub struct EnvironmentManagerPlugin;

impl Plugin for EnvironmentManagerPlugin {
    fn build(&self, app: &mut App) {
        app.init_state::<SceneState>();
        app.add_systems(OnEnter(SceneState::ZenGarden), spawn_zen_garden);
        app.add_systems(OnExit(SceneState::ZenGarden), despawn_scene);
        app.add_systems(OnEnter(SceneState::Studio), spawn_studio);
        app.add_systems(OnExit(SceneState::Studio), despawn_scene);
        app.add_systems(OnEnter(SceneState::Stage), spawn_stage);
        app.add_systems(OnExit(SceneState::Stage), despawn_scene);
        app.add_systems(Startup, set_initial_scene);
    }
}

#[derive(States, Default, Debug, Clone, PartialEq, Eq, Hash)]
pub enum SceneState {
    #[default]
    ZenGarden,
    Studio,
    Stage,
}

#[derive(Component)]
pub struct SceneRoot;

fn set_initial_scene(mut next_state: ResMut<NextState<SceneState>>) {
    next_state.set(SceneState::ZenGarden);
}

fn despawn_scene(mut commands: Commands, query: Query<Entity, With<SceneRoot>>) {
    for entity in &query {
        commands.entity(entity).despawn();
    }
}

fn spawn_zen_garden(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
) {
    let grass_material = materials.add(StandardMaterial {
        base_color: Color::srgb(0.1, 0.5, 0.15),
        perceptual_roughness: 0.9,
        ..default()
    });

    let stone_material = materials.add(StandardMaterial {
        base_color: Color::srgb(0.4, 0.4, 0.45),
        perceptual_roughness: 0.7,
        ..default()
    });

    let trunk_material = materials.add(StandardMaterial {
        base_color: Color::srgb(0.3, 0.15, 0.05),
        ..default()
    });

    let leaves_material = materials.add(StandardMaterial {
        base_color: Color::srgb(0.15, 0.6, 0.2),
        perceptual_roughness: 0.6,
        ..default()
    });

    let root = commands
        .spawn((SceneRoot, Transform::default(), Visibility::default()))
        .id();

    // Grass floor
    let floor = commands
        .spawn((
            Mesh3d(meshes.add(Plane3d::default().mesh().size(100.0, 100.0))),
            MeshMaterial3d(grass_material),
            Transform::from_xyz(0.0, 0.0, 0.0),
        ))
        .id();
    commands.entity(root).add_child(floor);

    // Warm sun
    let sun = commands
        .spawn((
            DirectionalLight {
                illuminance: 10000.0,
                shadows_enabled: true,
                color: Color::srgb(1.0, 0.9, 0.8),
                ..default()
            },
            Transform::from_rotation(Quat::from_euler(EulerRot::XYZ, -0.5, 0.5, 0.0)),
        ))
        .id();
    commands.entity(root).add_child(sun);

    // Fill light
    let fill = commands
        .spawn((
            PointLight {
                color: Color::srgb(0.5, 0.6, 1.0),
                intensity: 8_000.0,
                range: 100.0,
                ..default()
            },
            Transform::from_xyz(0.0, 20.0, 0.0),
        ))
        .id();
    commands.entity(root).add_child(fill);

    // Trees and stones
    let positions = vec![
        Vec3::new(3.0, 0.0, -4.0),
        Vec3::new(-5.0, 0.0, -2.0),
        Vec3::new(4.0, 0.0, 5.0),
        Vec3::new(-3.0, 0.0, 4.0),
    ];

    for pos in positions {
        let trunk = commands
            .spawn((
                Mesh3d(meshes.add(Cylinder::new(0.2, 2.0))),
                MeshMaterial3d(trunk_material.clone()),
                Transform::from_translation(pos + Vec3::new(0.0, 1.0, 0.0)),
            ))
            .id();
        commands.entity(root).add_child(trunk);

        let leaves = commands
            .spawn((
                Mesh3d(meshes.add(Sphere::new(1.5))),
                MeshMaterial3d(leaves_material.clone()),
                Transform::from_translation(pos + Vec3::new(0.0, 2.5, 0.0)),
            ))
            .id();
        commands.entity(root).add_child(leaves);

        let stone = commands
            .spawn((
                Mesh3d(meshes.add(Sphere::new(0.5))),
                MeshMaterial3d(stone_material.clone()),
                Transform::from_translation(pos + Vec3::new(1.0, 0.0, 0.5))
                    .with_scale(Vec3::new(1.5, 0.5, 1.2)),
            ))
            .id();
        commands.entity(root).add_child(stone);
    }
}

fn spawn_studio(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
) {
    let floor_material = materials.add(StandardMaterial {
        base_color: Color::srgb(0.08, 0.08, 0.1),
        perceptual_roughness: 0.3,
        metallic: 0.5,
        ..default()
    });

    let root = commands
        .spawn((SceneRoot, Transform::default(), Visibility::default()))
        .id();

    // Studio floor
    let floor = commands
        .spawn((
            Mesh3d(meshes.add(Plane3d::default().mesh().size(50.0, 50.0))),
            MeshMaterial3d(floor_material),
            Transform::from_xyz(0.0, 0.0, 0.0),
        ))
        .id();
    commands.entity(root).add_child(floor);

    // Focused spotlight
    let spot = commands
        .spawn((
            SpotLight {
                intensity: 50_000.0,
                color: Color::srgb(1.0, 0.95, 0.85),
                shadows_enabled: true,
                inner_angle: 0.6,
                outer_angle: 1.0,
                range: 30.0,
                ..default()
            },
            Transform::from_xyz(0.0, 5.0, 2.0).looking_at(Vec3::new(0.0, 1.0, 0.0), Vec3::Y),
        ))
        .id();
    commands.entity(root).add_child(spot);

    // Ambient fill
    let ambient = commands
        .spawn((
            PointLight {
                color: Color::srgb(0.3, 0.35, 0.5),
                intensity: 3_000.0,
                range: 50.0,
                ..default()
            },
            Transform::from_xyz(0.0, 3.0, 0.0),
        ))
        .id();
    commands.entity(root).add_child(ambient);
}

fn spawn_stage(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
) {
    let stage_material = materials.add(StandardMaterial {
        base_color: Color::srgb(0.05, 0.05, 0.08),
        perceptual_roughness: 0.2,
        metallic: 0.8,
        ..default()
    });

    let root = commands
        .spawn((SceneRoot, Transform::default(), Visibility::default()))
        .id();

    // Stage floor
    let floor = commands
        .spawn((
            Mesh3d(meshes.add(Plane3d::default().mesh().size(30.0, 20.0))),
            MeshMaterial3d(stage_material),
            Transform::from_xyz(0.0, 0.5, 0.0),
        ))
        .id();
    commands.entity(root).add_child(floor);

    // Stage lights (gold + blue)
    let light_positions = [
        (Vec3::new(-3.0, 5.0, 2.0), Color::srgb(0.9, 0.75, 0.25)),
        (Vec3::new(3.0, 5.0, 2.0), Color::srgb(0.25, 0.5, 0.9)),
        (Vec3::new(0.0, 5.0, -2.0), Color::srgb(0.9, 0.3, 0.3)),
    ];

    for (pos, color) in light_positions {
        let light = commands
            .spawn((
                SpotLight {
                    intensity: 80_000.0,
                    color,
                    shadows_enabled: true,
                    inner_angle: 0.4,
                    outer_angle: 0.8,
                    range: 20.0,
                    ..default()
                },
                Transform::from_translation(pos).looking_at(Vec3::new(0.0, 1.0, 0.0), Vec3::Y),
            ))
            .id();
        commands.entity(root).add_child(light);
    }

    // Backdrop
    let backdrop = commands
        .spawn((
            Mesh3d(meshes.add(Plane3d::default().mesh().size(30.0, 15.0))),
            MeshMaterial3d(materials.add(StandardMaterial {
                base_color: Color::srgb(0.02, 0.02, 0.05),
                perceptual_roughness: 1.0,
                ..default()
            })),
            Transform::from_xyz(0.0, 7.5, -8.0),
        ))
        .id();
    commands.entity(root).add_child(backdrop);
}
