use bevy::prelude::*;
use crate::truebadour_ai::TruebadourAvatar;

#[derive(States, Debug, Clone, PartialEq, Eq, Hash, Default)]
pub enum PracticeMode {
    #[default]
    Be,   // Observation & Somatic Check-in
    Do,   // Mechanics, Picking, & The Pling
    Play, // Truebadour Backup Band & Flow State
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
) {
    println!("[Mode] Entering BE Mode: Fretboard visualization only. Somatic focus.");
    
    // Spawn Truebadour Avatar
    commands.spawn((
        PbrBundle {
            mesh: meshes.add(Sphere::new(0.5)),
            material: materials.add(Color::srgb(0.2, 0.4, 0.8)),
            transform: Transform::from_xyz(2.0, 1.0, -2.0),
            ..default()
        },
        TruebadourAvatar,
    ));
}

fn setup_do_mode() {
    println!("[Mode] Entering DO Mode: Zooming in on right hand mechanics (The Pling).");
}

fn setup_play_mode() {
    println!("[Mode] Entering PLAY Mode: AI Truebadour backing band activated.");
}
