use bevy::prelude::*;

#[cfg(feature = "xr")]
use bevy_mod_openxr::add_xr_plugins;

mod ipc;
mod truebadour_ai;
mod modes;
mod sensor_fusion;
mod audio_transducer;
mod fretboard;

fn main() {
    let mut app = App::new();

    #[cfg(feature = "xr")]
    {
        // Add OpenXR plugins when compiling with `--features xr`
        app.add_plugins(add_xr_plugins(DefaultPlugins));
    }

    #[cfg(not(feature = "xr"))]
    {
        // Add standard 2D/3D desktop plugins when running normally
        app.add_plugins(DefaultPlugins);
    }

    app.add_plugins(bevy_kira_audio::AudioPlugin)
       .add_plugins(ipc::IpcPlugin)
       .add_plugins(truebadour_ai::TruebadourAiPlugin)
       .add_plugins(modes::ModesPlugin)
       .add_plugins(sensor_fusion::SensorFusionPlugin)
       .add_plugins(audio_transducer::AudioTransducerPlugin)
       .add_plugins(fretboard::FretboardPlugin)
       .add_systems(Startup, setup)
       .add_systems(Update, handle_ipc_events)
       .run();
}

/// Set up a simple 3D scene to prove the engine is running
fn setup(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
) {
    // A simple cube to represent the "Nut" of the fretboard
    commands.spawn(PbrBundle {
        mesh: meshes.add(Cuboid::new(0.1, 0.1, 0.1)),
        material: materials.add(Color::srgb(0.8, 0.7, 0.6)),
        transform: Transform::from_xyz(0.0, 0.5, -0.5),
        ..default()
    });

    // Light
    commands.spawn(PointLightBundle {
        point_light: PointLight {
            shadows_enabled: true,
            ..default()
        },
        transform: Transform::from_xyz(4.0, 8.0, 4.0),
        ..default()
    });

    // Camera
    commands.spawn(Camera3dBundle {
        transform: Transform::from_xyz(-2.0, 2.5, 5.0).looking_at(Vec3::ZERO, Vec3::Y),
        ..default()
    });
}

fn handle_ipc_events(
    mut events: EventReader<ipc::IpcEvent>,
    mut materials: ResMut<Assets<StandardMaterial>>,
    query: Query<&Handle<StandardMaterial>>,
) {
    for event in events.read() {
        println!("Received IPC Event in Bevy: {:?}", event);
        
        if event.0.event == "LAUNCH_C_SCALE" {
            // Change the material color of the cube to indicate success!
            for handle in query.iter() {
                if let Some(material) = materials.get_mut(handle) {
                    material.base_color = Color::srgb(0.2, 0.8, 0.2); // Green
                }
            }
        }
    }
}
