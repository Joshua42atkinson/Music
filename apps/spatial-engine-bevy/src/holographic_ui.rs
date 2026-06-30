// ════════════════════════════════════════════════════════════
// holographic_ui.rs
// Ported from TRINITY OS — Adapted for Voix Vive Curriculum
//
// Holographic panels that appear in XR space during practice:
// - Note display panel (shows detected note + cents deviation)
// - Scale info panel (shows current scale + in-scale indicator)
// - Troubadour AI panel (Socratic dialogue with Bertrand)
// ════════════════════════════════════════════════════════════

use crate::spatial_ui::create_spatial_panel;
use crate::widgets::{COLOR_TEXT_HIGHLIGHT, COLOR_TEXT_PRIMARY};
use crate::VoixViveState;
use bevy::prelude::*;

pub struct HolographicUiPlugin;

impl Plugin for HolographicUiPlugin {
    fn build(&self, app: &mut App) {
        app.add_systems(OnEnter(VoixViveState::BeMode), spawn_note_panel);
        app.add_systems(OnExit(VoixViveState::BeMode), despawn_note_panel);
        app.add_systems(Update, update_note_display);
    }
}

#[derive(Component)]
pub struct NotePanel;

#[derive(Component)]
pub struct NoteDisplayText;

#[derive(Component)]
pub struct CentsDisplayText;

#[derive(Component)]
pub struct FreqDisplayText;

#[derive(Resource, Default)]
pub struct NoteDisplayState {
    pub note_name: String,
    pub cents: i32,
    pub frequency: f32,
    pub in_scale: bool,
}

fn spawn_note_panel(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
    mut images: ResMut<Assets<Image>>,
    camera_query: Query<&GlobalTransform, With<Camera3d>>,
) {
    let panel_size = Vec2::new(600.0, 400.0);

    let transform = if let Some(cam) = camera_query.iter().next() {
        let pos = cam.translation() + cam.left() * 0.8 + cam.forward() * 0.6;
        Transform::from_translation(pos).looking_at(cam.translation(), Vec3::Y)
    } else {
        Transform::from_xyz(-1.0, 1.5, -0.5).looking_at(Vec3::new(0.0, 1.5, 0.0), Vec3::Y)
    };

    let (panel_entity, camera_entity) = create_spatial_panel(
        &mut commands,
        &mut meshes,
        &mut images,
        &mut materials,
        Vec2::new(panel_size.x / 1000.0, panel_size.y / 1000.0),
        panel_size,
        transform,
    );

    commands.entity(panel_entity).insert(NotePanel);

    commands
        .spawn((
            Node {
                width: Val::Percent(100.0),
                height: Val::Percent(100.0),
                ..default()
            },
            bevy::ui::UiTargetCamera(camera_entity),
        ))
        .with_children(|root_camera| {
            crate::widgets::spawn_glass_panel(root_camera, panel_size, 40.0, |root| {
                // Title
                root.spawn((
                    Text::new("NOW PLAYING"),
                    TextFont {
                        font_size: 24.0,
                        ..default()
                    },
                    TextColor(COLOR_TEXT_HIGHLIGHT),
                    Node {
                        margin: UiRect::bottom(Val::Px(20.0)),
                        ..default()
                    },
                ));

                // Note name (large)
                root.spawn((
                    Text::new("—"),
                    TextFont {
                        font_size: 96.0,
                        ..default()
                    },
                    TextColor(COLOR_TEXT_PRIMARY),
                    Node {
                        margin: UiRect::bottom(Val::Px(10.0)),
                        ..default()
                    },
                    NoteDisplayText,
                ));

                // Cents deviation
                root.spawn((
                    Text::new("0¢"),
                    TextFont {
                        font_size: 36.0,
                        ..default()
                    },
                    TextColor(COLOR_TEXT_PRIMARY),
                    Node {
                        margin: UiRect::bottom(Val::Px(10.0)),
                        ..default()
                    },
                    CentsDisplayText,
                ));

                // Frequency
                root.spawn((
                    Text::new("Sing or play a note..."),
                    TextFont {
                        font_size: 20.0,
                        ..default()
                    },
                    TextColor(COLOR_TEXT_HIGHLIGHT),
                    Node::default(),
                    FreqDisplayText,
                ));
            });
        });

    commands.insert_resource(NoteDisplayState {
        note_name: "—".to_string(),
        cents: 0,
        frequency: 0.0,
        in_scale: false,
    });
}

fn despawn_note_panel(
    mut commands: Commands,
    query: Query<(Entity, &crate::spatial_ui::SpatialPanel), With<NotePanel>>,
) {
    for (entity, panel) in &query {
        commands.entity(panel.camera_entity).despawn();
        commands.entity(entity).despawn();
    }
}

fn update_note_display(
    state: Res<NoteDisplayState>,
    mut note_query: Query<&mut Text, With<NoteDisplayText>>,
    mut cents_query: Query<&mut Text, With<CentsDisplayText>>,
    mut freq_query: Query<&mut Text, With<FreqDisplayText>>,
) {
    if state.is_changed() {
        for mut text in note_query.iter_mut() {
            text.0 = state.note_name.clone();
        }
        for mut text in cents_query.iter_mut() {
            let prefix = if state.cents > 0 { "+" } else { "" };
            text.0 = format!("{}{}¢", prefix, state.cents);
        }
        for mut text in freq_query.iter_mut() {
            if state.frequency > 0.0 {
                let scale_status = if state.in_scale { " ✓ In Scale" } else { " ✗ Out of Scale" };
                text.0 = format!("{:.1} Hz{}", state.frequency, scale_status);
            } else {
                text.0 = "Sing or play a note...".to_string();
            }
        }
    }
}
