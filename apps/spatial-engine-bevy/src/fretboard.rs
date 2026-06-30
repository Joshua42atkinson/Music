// ════════════════════════════════════════════════════════════
// fretboard.rs
// Voix Vive XR — 3D Holographic Guitar Fretboard
//
// 6 strings × 12 frets = 78 note positions ("potholes")
// Logarithmic fret spacing (matches real guitar geometry)
// Standard tuning: E2 A2 D3 G3 B3 E4
// Scale highlighting: root notes (gold), scale notes (blue),
//   non-scale (dimmed), active note (pulsing bright gold)
// ════════════════════════════════════════════════════════════

use bevy::prelude::*;

#[derive(Resource, Default)]
pub struct NoteDisplayState {
    pub note_name: String,
    pub cents: i32,
    pub frequency: f32,
    pub in_scale: bool,
}

pub struct FretboardPlugin;

impl Plugin for FretboardPlugin {
    fn build(&self, app: &mut App) {
        app.add_systems(Startup, spawn_holographic_fretboard)
            .add_systems(Update, update_fretboard);
    }
}

#[derive(Component)]
pub struct Pothole {
    pub string_index: usize,
    pub fret_index: usize,
    pub midi_note: i32,
    pub note_name: String,
    pub pitch_class: usize,
}

#[derive(Component)]
pub struct FretboardRoot;

#[derive(Resource, Default)]
pub struct FretboardState {
    pub root_pc: usize,
    pub scale_intervals: Vec<usize>,
    pub active_midi: Option<i32>,
}

const STRING_MIDI_BASE: [i32; 6] = [40, 45, 50, 55, 59, 64];
const NOTE_NAMES: [&str; 12] = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

fn midi_to_note_name(midi: i32) -> String {
    let pc = ((midi % 12) + 12) % 12;
    let octave = midi / 12 - 1;
    format!("{}{}", NOTE_NAMES[pc as usize], octave)
}

fn midi_to_pitch_class(midi: i32) -> usize {
    (((midi % 12) + 12) % 12) as usize
}

fn fret_position(fret: usize, scale_length: f32) -> f32 {
    let mut pos = 0.0;
    let mut remaining = scale_length;
    for _ in 0..fret {
        let fret_width = remaining / 17.817;
        pos += fret_width;
        remaining -= fret_width;
    }
    pos
}

fn spawn_holographic_fretboard(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
) {
    // Scaled up 3x for visibility — potholes are glowing orbs
    let pothole_mesh = meshes.add(Sphere::new(0.035).mesh().ico(5).unwrap());

    let inactive_material = materials.add(StandardMaterial {
        base_color: Color::srgb(0.05, 0.08, 0.2),
        emissive: LinearRgba::new(0.02, 0.04, 0.15, 1.0),
        perceptual_roughness: 0.3,
        metallic: 0.5,
        ..default()
    });

    let strings = 6;
    let frets = 12;
    let string_spacing = 0.075;
    let scale_length = 1.8;

    // Tilt the fretboard toward the viewer like a real guitar on a stand
    let fretboard_root = commands
        .spawn((
            Transform::from_xyz(-0.9, 0.9, -0.2)
                .with_rotation(Quat::from_euler(EulerRot::XYZ, -0.15, 0.15, 0.0)),
            Visibility::default(),
            FretboardRoot,
            Name::new("Holographic_Fretboard"),
        ))
        .id();

    let neck_length = fret_position(frets, scale_length);
    let neck_width = string_spacing * (strings as f32 + 1.5);

    // Rich dark wood fretboard
    let neck = commands
        .spawn((
            Mesh3d(meshes.add(Cuboid::new(neck_length, 0.02, neck_width))),
            MeshMaterial3d(materials.add(StandardMaterial {
                base_color: Color::srgb(0.12, 0.06, 0.03),
                perceptual_roughness: 0.7,
                metallic: 0.1,
                ..default()
            })),
            Transform::from_xyz(neck_length / 2.0, 0.0, 0.0),
        ))
        .id();
    commands.entity(fretboard_root).add_child(neck);

    // Glowing edge strip along the fretboard
    let edge_strip = commands
        .spawn((
            Mesh3d(meshes.add(Cuboid::new(neck_length, 0.003, neck_width + 0.01))),
            MeshMaterial3d(materials.add(StandardMaterial {
                base_color: Color::srgb(0.2, 0.15, 0.05),
                emissive: LinearRgba::new(0.15, 0.1, 0.02, 1.0),
                perceptual_roughness: 0.4,
                ..default()
            })),
            Transform::from_xyz(neck_length / 2.0, -0.012, 0.0),
        ))
        .id();
    commands.entity(fretboard_root).add_child(edge_strip);

    // Fret wires — thicker, more visible
    for fret in 0..=frets {
        let x = fret_position(fret, scale_length);
        let fret_wire = commands
            .spawn((
                Mesh3d(meshes.add(Cuboid::new(0.004, 0.025, neck_width))),
                MeshMaterial3d(materials.add(StandardMaterial {
                    base_color: Color::srgb(0.85, 0.85, 0.88),
                    metallic: 1.0,
                    perceptual_roughness: 0.15,
                    ..default()
                })),
                Transform::from_xyz(x, 0.015, 0.0),
            ))
            .id();
        commands.entity(fretboard_root).add_child(fret_wire);
    }

    // Inlay dots at frets 3, 5, 7, 9, 12 (double dot at 12)
    let inlay_frets = [3, 5, 7, 9, 12];
    for fret in inlay_frets {
        let x = fret_position(fret, scale_length) - fret_position(fret - 1, scale_length);
        let mid_x = fret_position(fret - 1, scale_length) + x / 2.0;

        if fret == 12 {
            // Double dot
            for z_offset in [-0.04, 0.04] {
                let inlay = commands
                    .spawn((
                        Mesh3d(meshes.add(Sphere::new(0.012))),
                        MeshMaterial3d(materials.add(StandardMaterial {
                            base_color: Color::srgb(0.7, 0.65, 0.5),
                            emissive: LinearRgba::new(0.1, 0.08, 0.03, 1.0),
                            perceptual_roughness: 0.3,
                            ..default()
                        })),
                        Transform::from_xyz(mid_x, 0.011, z_offset),
                    ))
                    .id();
                commands.entity(fretboard_root).add_child(inlay);
            }
        } else {
            let inlay = commands
                .spawn((
                    Mesh3d(meshes.add(Sphere::new(0.012))),
                    MeshMaterial3d(materials.add(StandardMaterial {
                        base_color: Color::srgb(0.7, 0.65, 0.5),
                        emissive: LinearRgba::new(0.1, 0.08, 0.03, 1.0),
                        perceptual_roughness: 0.3,
                        ..default()
                    })),
                    Transform::from_xyz(mid_x, 0.011, 0.0),
                ))
                .id();
            commands.entity(fretboard_root).add_child(inlay);
        }
    }

    // Note potholes — glowing orbs at each string/fret position
    for string in 0..strings {
        for fret in 0..=frets {
            let midi = STRING_MIDI_BASE[string] + fret as i32;
            let note_name = midi_to_note_name(midi);
            let pitch_class = midi_to_pitch_class(midi);

            let x = fret_position(fret, scale_length);
            let z = (string as f32) * string_spacing - (strings as f32 - 1.0) * string_spacing / 2.0;

            let pothole = commands
                .spawn((
                    Mesh3d(pothole_mesh.clone()),
                    MeshMaterial3d(inactive_material.clone()),
                    Transform::from_xyz(x, 0.04, z),
                    Pothole {
                        string_index: string,
                        fret_index: fret,
                        midi_note: midi,
                        note_name,
                        pitch_class,
                    },
                ))
                .id();
            commands.entity(fretboard_root).add_child(pothole);
        }
    }

    // Guitar strings — thicker, metallic, catching light
    let string_thicknesses = [0.0015, 0.0012, 0.001, 0.0008, 0.0007, 0.0006];
    for string in 0..strings {
        let z = (string as f32) * string_spacing - (strings as f32 - 1.0) * string_spacing / 2.0;
        let string_mesh = commands
            .spawn((
                Mesh3d(meshes.add(Cylinder::new(string_thicknesses[string], neck_length))),
                MeshMaterial3d(materials.add(StandardMaterial {
                    base_color: Color::srgb(0.9, 0.88, 0.8),
                    metallic: 1.0,
                    perceptual_roughness: 0.2,
                    ..default()
                })),
                Transform::from_xyz(neck_length / 2.0, 0.02, z)
                    .with_rotation(Quat::from_rotation_z(std::f32::consts::FRAC_PI_2)),
            ))
            .id();
        commands.entity(fretboard_root).add_child(string_mesh);
    }

    // Headstock — small block at the end
    let headstock = commands
        .spawn((
            Mesh3d(meshes.add(Cuboid::new(0.15, 0.025, neck_width * 0.9))),
            MeshMaterial3d(materials.add(StandardMaterial {
                base_color: Color::srgb(0.1, 0.05, 0.02),
                perceptual_roughness: 0.6,
                ..default()
            })),
            Transform::from_xyz(-0.08, 0.0, 0.0),
        ))
        .id();
    commands.entity(fretboard_root).add_child(headstock);

    commands.insert_resource(FretboardState {
        root_pc: 0,
        scale_intervals: vec![0, 2, 4, 5, 7, 9, 11],
        active_midi: None,
    });

    info!("[Fretboard] Holographic Fretboard spawned: {} potholes, {} frets", strings * (frets + 1), frets);
}

pub fn update_fretboard(
    state: Res<FretboardState>,
    mut potholes: Query<(&Pothole, &mut Transform, &MeshMaterial3d<StandardMaterial>)>,
    mut materials: ResMut<Assets<StandardMaterial>>,
    time: Res<Time>,
    note_display: Option<ResMut<NoteDisplayState>>,
) {
    let scale_pcs: Vec<usize> = state.scale_intervals.iter().map(|&iv| (state.root_pc + iv) % 12).collect();

    for (pothole, mut transform, mat_handle) in potholes.iter_mut() {
        let is_active = state.active_midi == Some(pothole.midi_note);
        let is_root = pothole.pitch_class == state.root_pc;
        let in_scale = scale_pcs.contains(&pothole.pitch_class);

        // Scale animation
        let target_scale = if is_active { 3.0 } else { 1.0 };
        if transform.scale.x > 1.01 || is_active {
            transform.scale = transform.scale.lerp(Vec3::splat(target_scale), 10.0 * time.delta_secs());
        } else {
            transform.scale = Vec3::splat(1.0);
        }

        // Material color — bright emissive for holographic look
        if let Some(mat) = materials.get_mut(mat_handle) {
            if is_active {
                mat.emissive = LinearRgba::new(5.0, 3.5, 0.8, 1.0);
                mat.base_color = Color::srgb(1.0, 0.9, 0.4);
            } else if is_root {
                mat.emissive = LinearRgba::new(1.2, 0.9, 0.2, 1.0);
                mat.base_color = Color::srgb(0.6, 0.5, 0.15);
            } else if in_scale {
                mat.emissive = LinearRgba::new(0.1, 0.4, 1.2, 1.0);
                mat.base_color = Color::srgb(0.15, 0.3, 0.6);
            } else {
                mat.emissive = LinearRgba::new(0.02, 0.04, 0.12, 1.0);
                mat.base_color = Color::srgb(0.05, 0.08, 0.15);
            }
        }
    }

    // Update note display
    if let Some(mut note_display) = note_display {
        if let Some(active_midi) = state.active_midi {
            if let Some(pothole) = potholes.iter().map(|(p, _, _)| p).find(|p| p.midi_note == active_midi) {
                let in_scale = scale_pcs.contains(&pothole.pitch_class);
                note_display.note_name = pothole.note_name.clone();
                note_display.cents = 0;
                note_display.frequency = 440.0 * 2.0_f32.powf((active_midi as f32 - 69.0) / 12.0);
                note_display.in_scale = in_scale;
            }
        }
    }
}
