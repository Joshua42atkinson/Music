// ════════════════════════════════════════════════════════════
// system_menu.rs
// Ported from TRINITY OS — Adapted for Voix Vive BE/DO/PLAY
//
// Third-eye anchored menu that expands/collapses.
// Provides BE / DO / PLAY mode switching and scale selection.
// ════════════════════════════════════════════════════════════

use crate::spatial_ui::create_spatial_panel;
use crate::widgets::{COLOR_TEXT_HIGHLIGHT, COLOR_TEXT_PRIMARY};
use crate::VoixViveState;
use bevy::prelude::*;

pub struct SystemMenuPlugin;

impl Plugin for SystemMenuPlugin {
    fn build(&self, app: &mut App) {
        app.init_state::<SystemMenuState>();
        app.add_systems(OnEnter(SystemMenuState::Collapsed), spawn_collapsed_widget);
        app.add_systems(OnExit(SystemMenuState::Collapsed), despawn_system_menu);
        app.add_systems(OnEnter(SystemMenuState::Expanded), spawn_expanded_menu);
        app.add_systems(OnExit(SystemMenuState::Expanded), despawn_system_menu);
        app.add_observer(handle_system_menu_interaction);
        app.add_observer(handle_system_menu_actions);
        app.add_systems(Update, animate_system_menu_anchor.after(crate::spatial_ui::apply_panel_inertia));
    }
}

#[derive(Component)]
pub struct SystemMenuAnchor;

#[derive(Component)]
pub struct SystemMenu;

#[derive(Component)]
pub enum SystemMenuAction {
    Be,
    Do,
    Play,
    Collapse,
}

#[derive(States, Default, Debug, Clone, PartialEq, Eq, Hash)]
pub enum SystemMenuState {
    #[default]
    Collapsed,
    Expanded,
}

fn spawn_collapsed_widget(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
    mut images: ResMut<Assets<Image>>,
    camera_query: Query<&GlobalTransform, With<Camera3d>>,
) {
    let size = Vec2::new(40.0, 40.0);

    let transform = if let Some(cam) = camera_query.iter().next() {
        let pos = cam.translation() + cam.forward() * 0.5;
        Transform::from_translation(pos).looking_at(cam.translation(), Vec3::Y)
    } else {
        Transform::from_xyz(0.0, 1.5, 0.5).looking_at(Vec3::new(0.0, 1.5, 0.0), Vec3::Y)
    };

    let (panel_entity, camera_entity) = create_spatial_panel(
        &mut commands,
        &mut meshes,
        &mut images,
        &mut materials,
        Vec2::new(size.x / 1000.0, size.y / 1000.0),
        size,
        transform,
    );

    commands
        .entity(panel_entity)
        .insert((SystemMenuAnchor, SystemMenu, Interaction::default()));

    commands
        .spawn((
            Node {
                width: Val::Percent(100.0),
                height: Val::Percent(100.0),
                justify_content: JustifyContent::Center,
                align_items: AlignItems::Center,
                ..default()
            },
            bevy::ui::UiTargetCamera(camera_entity),
        ))
        .with_children(|root_camera| {
            crate::widgets::spawn_glass_panel(root_camera, size, 10.0, |root| {
                root.spawn((
                    Text::new("VV"),
                    TextFont {
                        font_size: 24.0,
                        ..default()
                    },
                    TextColor(COLOR_TEXT_HIGHLIGHT),
                    Node::default(),
                ));
            });
        });
}

fn handle_system_menu_interaction(
    trigger: On<Pointer<Click>>,
    query: Query<&SystemMenu>,
    state: Res<State<SystemMenuState>>,
    mut next_state: ResMut<NextState<SystemMenuState>>,
) {
    if query.contains(trigger.entity) {
        match state.get() {
            SystemMenuState::Collapsed => next_state.set(SystemMenuState::Expanded),
            SystemMenuState::Expanded => next_state.set(SystemMenuState::Collapsed),
        }
    }
}

fn spawn_expanded_menu(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
    mut images: ResMut<Assets<Image>>,
    camera_query: Query<&GlobalTransform, With<Camera3d>>,
) {
    let size = Vec2::new(500.0, 400.0);

    let transform = if let Some(cam) = camera_query.iter().next() {
        let pos = cam.translation() + cam.up() * 0.15 + cam.forward() * 0.4;
        Transform::from_translation(pos).looking_at(cam.translation(), Vec3::Y)
    } else {
        Transform::from_xyz(0.0, 1.65, 0.4).looking_at(Vec3::new(0.0, 1.5, 0.0), Vec3::Y)
    };

    let (panel_entity, camera_entity) = create_spatial_panel(
        &mut commands,
        &mut meshes,
        &mut images,
        &mut materials,
        Vec2::new(size.x / 1000.0, size.y / 1000.0),
        size,
        transform,
    );

    commands
        .entity(panel_entity)
        .insert((SystemMenuAnchor, SystemMenu, Interaction::default()));

    commands
        .spawn((
            Node {
                width: Val::Percent(100.0),
                height: Val::Percent(100.0),
                justify_content: JustifyContent::Center,
                align_items: AlignItems::Center,
                ..default()
            },
            bevy::ui::UiTargetCamera(camera_entity),
        ))
        .with_children(|root_camera| {
            crate::widgets::spawn_glass_panel(root_camera, size, 20.0, |root| {
                root.spawn((
                    Text::new("VOIX VIVE XR"),
                    TextFont {
                        font_size: 28.0,
                        ..default()
                    },
                    TextColor(COLOR_TEXT_PRIMARY),
                    Node {
                        margin: UiRect::bottom(Val::Px(16.0)),
                        ..default()
                    },
                ));

                root.spawn((
                    Text::new("Spatial Guitar Academy"),
                    TextFont {
                        font_size: 16.0,
                        ..default()
                    },
                    TextColor(COLOR_TEXT_HIGHLIGHT),
                    Node {
                        margin: UiRect::bottom(Val::Px(24.0)),
                        ..default()
                    },
                ));

                crate::widgets::spawn_holographic_button(
                    root,
                    "BE — Observe & Breathe",
                    400.0,
                    50.0,
                    SystemMenuAction::Be,
                );
                crate::widgets::spawn_holographic_button(
                    root,
                    "DO — Mechanics & The Pling",
                    400.0,
                    50.0,
                    SystemMenuAction::Do,
                );
                crate::widgets::spawn_holographic_button(
                    root,
                    "PLAY — Flow with AI Band",
                    400.0,
                    50.0,
                    SystemMenuAction::Play,
                );
                crate::widgets::spawn_holographic_button(
                    root,
                    "Collapse",
                    400.0,
                    40.0,
                    SystemMenuAction::Collapse,
                );
            });
        });
}

fn despawn_system_menu(
    mut commands: Commands,
    anchor_query: Query<(Entity, &crate::spatial_ui::SpatialPanel), With<SystemMenuAnchor>>,
) {
    for (entity, panel) in &anchor_query {
        commands.entity(panel.camera_entity).despawn();
        commands.entity(entity).despawn();
    }
}

fn handle_system_menu_actions(
    trigger: On<Pointer<Click>>,
    query: Query<&SystemMenuAction>,
    mut os_state: ResMut<NextState<VoixViveState>>,
    mut menu_state: ResMut<NextState<SystemMenuState>>,
) {
    if let Ok(action) = query.get(trigger.entity) {
        match action {
            SystemMenuAction::Be => os_state.set(VoixViveState::BeMode),
            SystemMenuAction::Do => os_state.set(VoixViveState::DoMode),
            SystemMenuAction::Play => os_state.set(VoixViveState::PlayMode),
            SystemMenuAction::Collapse => {}
        }

        menu_state.set(SystemMenuState::Collapsed);
    }
}

fn animate_system_menu_anchor(
    state: Res<State<SystemMenuState>>,
    camera_query: Query<&GlobalTransform, With<Camera3d>>,
    anchor_query: Query<Entity, With<SystemMenuAnchor>>,
    mut transforms: ParamSet<(
        Query<&mut Transform, With<crate::spatial_ui::UiVelocity>>,
        Query<&mut Transform, With<SystemMenuAnchor>>,
    )>,
) {
    let Some(camera_transform) = camera_query.iter().next() else {
        return;
    };

    let target_pos = match state.get() {
        SystemMenuState::Collapsed => {
            camera_transform.translation() + camera_transform.up() * 0.15 + camera_transform.forward() * 0.4
        }
        SystemMenuState::Expanded => {
            camera_transform.translation() + camera_transform.forward() * 0.5
        }
    };

    // Only animate if we have anchor entities
    if anchor_query.iter().next().is_none() {
        return;
    }

    let mut anchor_transforms = transforms.p1();
    for mut transform in anchor_transforms.iter_mut() {
        transform.translation = transform.translation.lerp(target_pos, 0.1);
        transform.look_at(camera_transform.translation(), Vec3::Y);
    }
}
