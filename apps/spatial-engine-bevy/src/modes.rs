use bevy::prelude::*;
use crate::environment_manager::SceneState;

#[derive(Component)]
struct TruebadourAvatar;

#[derive(States, Debug, Clone, PartialEq, Eq, Hash, Default)]
pub enum PracticeMode {
    #[default]
    Be,
    Do,
    Play,
}

pub struct ModesPlugin;

impl Plugin for ModesPlugin {
    fn build(&self, app: &mut App) {
        app.init_state::<PracticeMode>()
           .add_systems(OnEnter(PracticeMode::Be), setup_be_mode)
           .add_systems(OnEnter(PracticeMode::Do), setup_do_mode)
           .add_systems(OnEnter(PracticeMode::Play), setup_play_mode);
    }
}

fn setup_be_mode(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
    mut scene_state: ResMut<NextState<SceneState>>,
) {
    info!("[Mode] Entering BE Mode: Fretboard visualization only. Somatic focus.");
    scene_state.set(SceneState::ZenGarden);

    commands.spawn((
        Mesh3d(meshes.add(Sphere::new(0.5))),
        MeshMaterial3d(materials.add(StandardMaterial {
            base_color: Color::srgb(0.2, 0.4, 0.8),
            emissive: LinearRgba::new(0.05, 0.1, 0.3, 1.0),
            ..default()
        })),
        Transform::from_xyz(2.0, 1.0, -2.0),
        TruebadourAvatar,
    ));
}

fn setup_do_mode(
    mut scene_state: ResMut<NextState<SceneState>>,
) {
    info!("[Mode] Entering DO Mode: Zooming in on right hand mechanics (The Pling).");
    scene_state.set(SceneState::Studio);
}

fn setup_play_mode(
    mut scene_state: ResMut<NextState<SceneState>>,
) {
    info!("[Mode] Entering PLAY Mode: AI Truebadour backing band activated.");
    scene_state.set(SceneState::Stage);
}
