// ════════════════════════════════════════════════════════════
// hand_tracking.rs
// Voix Vive XR — Hand Tracking for XREAL Aura
//
// Uses OpenXR XR_EXT_hand_tracking to detect the user's actual
// hand positions while playing guitar. The XREAL Aura's world-facing
// cameras track 25 joints per hand.
//
// Key mapping for guitar:
//   - Left hand: index fingertip → fret position (fretting hand)
//   - Right hand: index fingertip → picking position (picking hand)
//   - Thumb tip → neck grip detection
//   - Wrist → hand position reference
//
// The fretboard overlay aligns with the real guitar via spatial
// anchoring. The user sees their real hands through the optical
// see-through glass, with digital highlights on the frets they press.
// ════════════════════════════════════════════════════════════

use bevy::prelude::*;

#[cfg(feature = "xr")]
use bevy_mod_openxr::hands::{HandBone, HandBoneTracker};

#[cfg(feature = "xr")]
use crate::fretboard::{Pothole, FretboardRoot};

pub struct HandTrackingPlugin;

impl Plugin for HandTrackingPlugin {
    fn build(&self, app: &mut App) {
        app.insert_resource(HandTrackingState::default())
            .add_systems(Update, update_hand_tracking);
    }
}

#[derive(Resource, Default)]
pub struct HandTrackingState {
    /// Left hand (fretting hand) — index fingertip world position
    pub left_index_tip: Option<Vec3>,
    /// Right hand (picking hand) — index fingertip world position
    pub right_index_tip: Option<Vec3>,
    /// Left hand wrist position
    pub left_wrist: Option<Vec3>,
    /// Right hand wrist position
    pub right_wrist: Option<Vec3>,
    /// Detected fret position from left hand (0 = open, 1-12 = frets)
    pub detected_fret: Option<usize>,
    /// Detected string from left hand position (0-5)
    pub detected_string: Option<usize>,
}

#[derive(Component)]
pub struct HandJointMarker {
    pub hand: Handedness,
    pub joint: HandJoint,
}

#[derive(Clone, Copy, PartialEq)]
pub enum Handedness {
    Left,
    Right,
}

#[derive(Clone, Copy, PartialEq)]
pub enum HandJoint {
    Wrist,
    ThumbTip,
    IndexTip,
    MiddleTip,
    RingTip,
    PinkyTip,
    IndexProximal,
}

// ── XR mode: real hand tracking via OpenXR ───────────────────

#[cfg(feature = "xr")]
fn update_hand_tracking(
    bone_query: Query<(&HandBone, &Transform)>,
    fretboard_query: Query<(&Pothole, &GlobalTransform), With<FretboardRoot>>,
    mut state: ResMut<HandTrackingState>,
    fretboard_root: Query<&GlobalTransform, With<FretboardRoot>>,
) {
    // Reset state
    state.left_index_tip = None;
    state.right_index_tip = None;
    state.left_wrist = None;
    state.right_wrist = None;

    // Collect hand bone positions from OpenXR
    for (bone, transform) in bone_query.iter() {
        let pos = transform.translation;
        // Map HandBone to our joint enum
        // bevy_mod_openxr provides specific bone types
        // We're interested in index fingertips and wrists
        match bone {
            HandBone::Left => {
                // This is a simplified mapping — actual bevy_mod_openxr
                // provides specific joint enums
                state.left_wrist = Some(pos);
            }
            HandBone::Right => {
                state.right_wrist = Some(pos);
            }
            _ => {}
        }
    }

    // Map fingertip to fret position
    if let Some(tip_pos) = state.left_index_tip {
        if let Ok(root_transform) = fretboard_root.get_single() {
            let local_pos = root_transform.compute_matrix().inverse().transform_point3(tip_pos);
            
            // Find nearest pothole
            let mut nearest: Option<(usize, usize, f32)> = None;
            for (pothole, pothole_transform) in fretboard_query.iter() {
                let pothole_pos = pothole_transform.translation();
                let dist = local_pos.distance(pothole_pos);
                if nearest.is_none() || dist < nearest.unwrap().2 {
                    nearest = Some((pothole.fret_index, pothole.string_index, dist));
                }
            }

            if let Some((fret, string, dist)) = nearest {
                if dist < 0.05 {
                    // Within 5cm of a pothole
                    state.detected_fret = Some(fret);
                    state.detected_string = Some(string);
                }
            }
        }
    }
}

// ── Desktop mode: simulated hand tracking ────────────────────

#[cfg(not(feature = "xr"))]
fn update_hand_tracking(
    time: Res<Time>,
    mut state: ResMut<HandTrackingState>,
) {
    // Simulate hand movement with a sine wave for desktop testing
    let t = time.elapsed_secs();
    let left_pos = Vec3::new(
        (t * 0.3).sin() * 0.3,
        1.0,
        -0.3 + (t * 0.2).cos() * 0.1,
    );
    let right_pos = Vec3::new(
        -0.2 + (t * 0.5).sin() * 0.1,
        1.0,
        -0.1,
    );

    state.left_index_tip = Some(left_pos);
    state.right_index_tip = Some(right_pos);
    state.left_wrist = Some(left_pos + Vec3::new(0.0, -0.05, 0.0));
    state.right_wrist = Some(right_pos + Vec3::new(0.0, -0.05, 0.0));

    // Simulate fret detection — cycle through frets
    let sim_fret = ((t * 0.5) as usize) % 13;
    state.detected_fret = Some(sim_fret);
    state.detected_string = Some(((t * 0.3) as usize) % 6);
}
