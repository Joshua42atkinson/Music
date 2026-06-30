package com.voixvive.xr

import android.util.Log
import androidx.xr.arcore.Hand
import androidx.xr.arcore.HandJointType
import androidx.xr.runtime.Session
import androidx.xr.scenecore.Pose
import androidx.xr.scenecore.Vector3
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.cancel
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.launch

/**
 * HandTrackingManager — Maps real hand joints to guitar fret positions.
 *
 * Uses ARCore for Jetpack XR to track 25 hand joints per hand via the
 * XREAL Aura's world-facing cameras. The key innovation for Voix Vive:
 *
 *   LEFT HAND (fretting hand):
 *     INDEX_TIP position → maps to which fret the user is pressing
 *     THUMB_TIP position → confirms grip behind the neck
 *     The distance between INDEX_TIP and THUMB_TIP indicates which
 *     string is being fretted (based on lateral position)
 *
 *   RIGHT HAND (picking hand):
 *     INDEX_TIP position → maps to which string is being plucked
 *     WRIST position → picking hand reference point
 *
 * The fretboard is assumed to be in a fixed spatial position (anchored
 * to the real guitar via spatial anchor). Hand joint positions in
 * perception space are compared against the fretboard's known geometry
 * to determine which fret/string the user is touching.
 *
 * Fretboard geometry (in meters, relative to anchor):
 *   - 6 strings, spaced 0.018m apart (real guitar spacing)
 *   - 12 frets, logarithmic spacing (rule of 17.817)
 *   - Scale length: 0.648m (standard guitar)
 */
class HandTrackingManager(
    private val session: Session,
    private val onFretDetected: (FretPosition) -> Unit,
    private val onHandJointsUpdated: ((FloatArray) -> Unit)? = null
) {
    private val TAG = "HandTracking"
    private val scope = CoroutineScope(Dispatchers.Default)
    private var leftHandJob: Job? = null
    private var rightHandJob: Job? = null

    companion object {
        // Guitar fretboard geometry constants (in meters)
        const val STRING_COUNT = 6
        const val FRET_COUNT = 12
        const val STRING_SPACING = 0.018f  // ~18mm between strings
        const val SCALE_LENGTH = 0.648f    // standard guitar scale length

        // Standard tuning MIDI bases: E2, A2, D3, G3, B3, E4
        val STRING_MIDI_BASES = intArrayOf(40, 45, 50, 55, 59, 64)

        // Detection threshold — how close fingertip must be to a fret position
        const val FRET_PROXIMITY_THRESHOLD = 0.025f  // 2.5cm
    }

    /**
     * Start tracking both hands.
     * Collects hand state updates from ARCore and maps joint positions
     * to fret/string positions on the virtual fretboard.
     */
    fun start() {
        // Track left hand (fretting hand)
        leftHandJob = scope.launch {
            Hand.left(session).state.collect { handState ->
                if (handState.trackingState == androidx.xr.arcore.TrackingState.Tracking) {
                    val indexTip = handState.handJoints[HandJointType.INDEX_TIP]
                    val thumbTip = handState.handJoints[HandJointType.THUMB_TIP]

                    // Collect all joint positions for renderer
                    val jointPositions = collectJointPositions(handState, isLeft = true)
                    onHandJointsUpdated?.invoke(jointPositions)

                    if (indexTip != null) {
                        // Transform fingertip pose from perception space to activity space
                        val transformedPose = session.scene.perceptionSpace.transformPoseTo(
                            indexTip,
                            session.scene.activitySpace
                        )

                        // Map the fingertip position to a fret/string on the virtual fretboard
                        val fretPos = mapPositionToFret(transformedPose.translation)
                        if (fretPos != null) {
                            onFretDetected(fretPos)
                        }
                    }
                }
            }
        }

        // Track right hand (picking hand) — used for string detection
        rightHandJob = scope.launch {
            Hand.right(session).state.collect { handState ->
                if (handState.trackingState == androidx.xr.arcore.TrackingState.Tracking) {
                    val indexTip = handState.handJoints[HandJointType.INDEX_TIP]

                    // Collect all joint positions for renderer
                    val jointPositions = collectJointPositions(handState, isLeft = false)
                    onHandJointsUpdated?.invoke(jointPositions)

                    if (indexTip != null) {
                        val transformedPose = session.scene.perceptionSpace.transformPoseTo(
                            indexTip,
                            session.scene.activitySpace
                        )

                        // The right hand position determines which string is being plucked
                        val stringIdx = mapPositionToString(transformedPose.translation)
                        if (stringIdx != null) {
                            onFretDetected(FretPosition(
                                stringIndex = stringIdx,
                                fretIndex = -1,  // right hand doesn't determine fret
                                confidence = 0.8f
                            ))
                        }
                    }
                }
            }
        }

        Log.i(TAG, "Hand tracking started — left (fretting) + right (picking)")
    }

    fun stop() {
        leftHandJob?.cancel()
        rightHandJob?.cancel()
        Log.i(TAG, "Hand tracking stopped")
    }

    fun release() {
        stop()
        scope.cancel()
    }

    /**
     * Collect all hand joint positions transformed to activity space.
     * Returns a flat FloatArray [x0, y0, z0, x1, y1, z1, ...] for renderer instancing.
     */
    private fun collectJointPositions(
        handState: androidx.xr.arcore.HandState,
        isLeft: Boolean
    ): FloatArray {
        val positions = mutableListOf<Float>()
        for ((jointType, pose) in handState.handJoints) {
            val transformed = session.scene.perceptionSpace.transformPoseTo(
                pose,
                session.scene.activitySpace
            )
            positions.add(transformed.translation.x)
            positions.add(transformed.translation.y)
            positions.add(transformed.translation.z)
        }
        return positions.toFloatArray()
    }

    /**
     * Map a 3D position in activity space to a fret index on the virtual fretboard.
     *
     * The fretboard is positioned at a known location in activity space.
     * This function calculates which fret the fingertip is closest to
     * using logarithmic fret spacing (rule of 17.817).
     *
     * @param tipPosition The fingertip position in activity space (meters)
     * @return FretPosition if the fingertip is close enough to the fretboard, null otherwise
     */
    private fun mapPositionToFret(tipPosition: Vector3): FretPosition? {
        // The fretboard is anchored at a fixed position in activity space.
        // In production, this would come from a spatial anchor.
        // For now, assume the fretboard root is at (0, 1.0, -0.3) —
        // roughly at waist height, 30cm in front of the user.

        val fretboardRootX = 0.0f
        val fretboardRootY = 1.0f
        val fretboardRootZ = -0.3f

        // Convert tip position to fretboard-local coordinates
        val localX = tipPosition.x - fretboardRootX  // along the neck
        val localZ = tipPosition.z - fretboardRootZ  // across the strings

        // Check if the fingertip is within the fretboard's bounds
        val neckLength = fretPosition(FRET_COUNT, SCALE_LENGTH)
        if (localX < -0.05f || localX > neckLength + 0.05f) return null

        // Find which fret the fingertip is closest to
        var bestFret = -1
        var bestDist = Float.MAX_VALUE
        for (fret in 0..FRET_COUNT) {
            val fretX = fretPosition(fret, SCALE_LENGTH)
            val dist = Math.abs(localX - fretX)
            if (dist < bestDist) {
                bestDist = dist
                bestFret = fret
            }
        }

        // Find which string the fingertip is closest to
        val stringIdx = mapPositionToString(tipPosition) ?: return null

        // Check proximity threshold
        if (bestDist > FRET_PROXIMITY_THRESHOLD) return null

        val confidence = 1.0f - (bestDist / FRET_PROXIMITY_THRESHOLD)
        return FretPosition(
            stringIndex = stringIdx,
            fretIndex = bestFret,
            confidence = confidence
        )
    }

    /**
     * Map a 3D position to a string index based on lateral position.
     * String 0 (low E) is at the bottom, string 5 (high E) at the top.
     */
    private fun mapPositionToString(tipPosition: Vector3): Int? {
        val fretboardRootZ = -0.3f
        val localZ = tipPosition.z - fretboardRootZ

        // Strings are centered around z=0 on the fretboard
        val halfWidth = STRING_SPACING * (STRING_COUNT - 1) / 2.0f
        val normalizedZ = localZ + halfWidth

        val stringIdx = (normalizedZ / STRING_SPACING).toInt()
        if (stringIdx < 0 || stringIdx >= STRING_COUNT) return null

        return stringIdx
    }

    /**
     * Calculate fret position using the rule of 17.817 (logarithmic spacing).
     * This matches real guitar geometry — frets get closer together as you go up the neck.
     */
    private fun fretPosition(fret: Int, scaleLength: Float): Float {
        var pos = 0.0f
        var remaining = scaleLength
        for (i in 0 until fret) {
            val fretWidth = remaining / 17.817f
            pos += fretWidth
            remaining -= fretWidth
        }
        return pos
    }
}
