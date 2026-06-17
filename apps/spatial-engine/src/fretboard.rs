use bevy::prelude::*;
use crate::ipc::IpcEvent;

pub struct FretboardPlugin;

impl Plugin for FretboardPlugin {
    fn build(&self, app: &mut App) {
        app.add_systems(Startup, spawn_holographic_fretboard)
           .add_systems(Update, pulse_potholes_on_ipc);
    }
}

#[derive(Component)]
pub struct Pothole {
    pub string_index: usize,
    pub fret_index: usize,
    pub note_name: String, // e.g. "E2", "A2"
    pub is_active: bool,
}

fn get_note_name(string_index: usize, fret_index: usize) -> String {
    let open_notes = ["E4", "B3", "G3", "D3", "A2", "E2"];
    let note_str = open_notes[string_index];
    
    let pitch_classes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    
    // Parse pitch class and octave from open string definition
    let split_idx = note_str.find(|c: char| c.is_ascii_digit()).unwrap_or(note_str.len());
    let pitch = &note_str[..split_idx];
    let octave: i32 = note_str[split_idx..].parse().unwrap_or(4);
    
    let pitch_idx = pitch_classes.iter().position(|&x| x == pitch).unwrap_or(0);
    
    let total_semitones = pitch_idx as i32 + fret_index as i32;
    
    let new_pitch_idx = (total_semitones % 12) as usize;
    let octave_shift = total_semitones / 12;
    
    let new_octave = octave + octave_shift;
    
    format!("{}{}", pitch_classes[new_pitch_idx], new_octave)
}

fn spawn_holographic_fretboard(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
) {
    let pothole_mesh = meshes.add(Sphere::new(0.015).mesh().ico(5).unwrap());
    
    // A dim, glowing neon material for the inactive potholes
    let inactive_material = materials.add(StandardMaterial {
        base_color: Color::srgb(0.1, 0.3, 0.8), // Deep blue
        emissive: LinearRgba::new(0.0, 0.1, 0.5, 1.0),
        ..default()
    });

    let strings = 6;
    let frets = 24;

    let string_spacing = 0.01; // 1cm between strings
    let fret_spacing = 0.035;  // 3.5cm average fret width

    // The entire fretboard is grouped under a spatial bundle
    commands.spawn((
        SpatialBundle {
            // Position the fretboard floating in front of the user (e.g. at chest height)
            transform: Transform::from_xyz(0.0, 1.0, -0.4),
            ..default()
        },
        Name::new("Holographic_Fretboard")
    )).with_children(|parent| {
        for string in 0..strings {
            for fret in 0..frets {
                let note_name = get_note_name(string, fret);

                // Calculate local offset
                // Strings go across the Y/X axis, frets go down the X/Z axis
                let x_pos = (fret as f32) * fret_spacing - (frets as f32 * fret_spacing / 2.0);
                let y_pos = (string as f32) * string_spacing - (strings as f32 * string_spacing / 2.0);

                parent.spawn((
                    PbrBundle {
                        mesh: pothole_mesh.clone(),
                        material: inactive_material.clone(),
                        transform: Transform::from_xyz(x_pos, y_pos, 0.0),
                        ..default()
                    },
                    Pothole {
                        string_index: string,
                        fret_index: fret,
                        note_name,
                        is_active: false,
                    },
                ));
            }
        }
    });

    println!("[Fretboard] Holographic Fretboard Generated with {} Potholes.", strings * frets);
}

fn pulse_potholes_on_ipc(
    mut events: EventReader<IpcEvent>,
    mut potholes: Query<(&Pothole, &mut Transform)>,
) {
    for event in events.read() {
        if event.0.event == "NOTE_PLAYED" || event.0.event == "GEMMA_TOKEN" {
            if let Some(data) = &event.0.data {
                if let Some(played_note) = data.get("name").and_then(|n| n.as_str()) {
                    
                    // For scaffolding, we pulse any pothole that exactly matches the note.
                    for (pothole, mut transform) in potholes.iter_mut() {
                        // We check exact match instead of starts_with, since get_note_name now generates accurate pitch strings
                        if pothole.note_name == played_note {
                            // Pulse animation trigger
                            transform.scale = Vec3::splat(2.5);
                        }
                    }
                }
            }
        }
    }

    // Decay the scale back to normal (1.0)
    for (_, mut transform) in potholes.iter_mut() {
        if transform.scale.x > 1.01 {
            transform.scale = transform.scale.lerp(Vec3::splat(1.0), 0.1);
        } else {
            transform.scale = Vec3::splat(1.0);
        }
    }
}
