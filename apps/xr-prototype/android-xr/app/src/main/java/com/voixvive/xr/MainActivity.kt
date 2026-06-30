package com.voixvive.xr

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.runtime.mutableStateOf
import androidx.core.content.ContextCompat
import androidx.xr.arcore.HandTrackingMode
import androidx.xr.runtime.Config
import androidx.xr.runtime.Session
import androidx.xr.runtime.SessionCreateResult

/**
 * Voix Vive XR — Spatial Guitar Academy for XREAL Aura
 *
 * Target: XREAL Aura (Android XR, optical see-through glasses)
 * Built with: Jetpack XR SDK + ARCore for Jetpack XR
 *
 * Core experience:
 *   1. User puts on XREAL Aura glasses — sees real world through optical glass
 *   2. A holographic fretboard overlay floats in space, anchored to the real guitar
 *   3. ARCore hand tracking detects the user's actual fingertips on the guitar neck
 *   4. Oboe pitch detection confirms which note is being played via microphone
 *   5. The fretboard overlay highlights the detected note in real-time
 *   6. A spatial UI panel shows note name, frequency, cents deviation, scale info
 *
 * The user sees their real hands on their real guitar, with digital overlays
 * enhancing the learning experience. No camera passthrough delay — optical
 * see-through means zero latency between reality and overlay.
 */
class MainActivity : ComponentActivity() {

    private val TAG = "VoixViveXR"

    private var xrSession: Session? = null
    private var pitchEngine: PitchDetectionEngine? = null
    private var handTracker: HandTrackingManager? = null

    // Compose state for UI updates
    private val noteState = mutableStateOf<DetectedNote?>(null)
    private val fretState = mutableStateOf<FretPosition?>(null)
    private val handTrackingReady = mutableStateOf(false)

    // Permission launcher
    private val permissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val handTrackingGranted = permissions[Manifest.permission.HAND_TRACKING] ?: false
        val audioGranted = permissions[Manifest.permission.RECORD_AUDIO] ?: false
        Log.i(TAG, "Permissions — hand tracking: $handTrackingGranted, audio: $audioGranted")
        if (handTrackingGranted && audioGranted) {
            initializeXrSession()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Log.i(TAG, "Voix Vive XR — Spatial Guitar Academy starting...")

        requestPermissions()
    }

    private fun requestPermissions() {
        val permissions = arrayOf(
            Manifest.permission.HAND_TRACKING,
            Manifest.permission.RECORD_AUDIO
        )

        val needsPermission = permissions.any {
            ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED
        }

        if (needsPermission) {
            permissionLauncher.launch(permissions)
        } else {
            initializeXrSession()
        }
    }

    private fun initializeXrSession() {
        try {
            val sessionResult = Session.create(this)
            when (sessionResult) {
                is SessionCreateResult.Success -> {
                    xrSession = sessionResult.session
                    Log.i(TAG, "XR Session created successfully")

                    setupHandTracking()
                    setupPitchDetection()
                    setupComposeUi()
                }
                is SessionCreateResult.Failure -> {
                    Log.e(TAG, "XR Session creation failed: ${sessionResult.reason}")
                    setupFallbackUi()
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "XR Session initialization error: ${e.message}")
            setupFallbackUi()
        }
    }

    /**
     * Configure ARCore hand tracking with HandTrackingMode.BOTH.
     * This enables the XREAL Aura's world-facing cameras to detect
     * the user's hand joints (25 joints per hand, OpenXR standard).
     *
     * Key joints for guitar:
     *   - Left hand INDEX_TIP → fretting position on the neck
     *   - Left hand THUMB_TIP → neck grip (behind the neck)
     *   - Right hand INDEX_TIP → picking position (near strings)
     *   - Both WRIST → hand position reference
     */
    private fun setupHandTracking() {
        val session = xrSession ?: return

        val config = Config.Builder(session.config)
            .setHandTracking(HandTrackingMode.BOTH)
            .build()

        when (val result = session.configure(config)) {
            is Config.ConfigResult.Success -> {
                Log.i(TAG, "Hand tracking configured — both hands enabled")
                handTracker = HandTrackingManager(session) { fretPos ->
                    fretState.value = fretPos
                    Log.d(TAG, "Fret detected: string ${fretPos.stringIndex}, fret ${fretPos.fretIndex}")
                }
                handTracker?.start()
                handTrackingReady.value = true
            }
            else -> {
                Log.e(TAG, "Hand tracking configuration failed")
            }
        }
    }

    /**
     * Initialize Oboe low-latency pitch detection.
     * When a note is detected, update the UI state so the spatial
     * fretboard overlay can highlight the matching pothole.
     */
    private fun setupPitchDetection() {
        pitchEngine = PitchDetectionEngine(
            onNoteDetected = { noteName, frequency, cents ->
                val note = DetectedNote(noteName, frequency, cents)
                noteState.value = note
                Log.d(TAG, "Note: $noteName (${String.format("%.1f", frequency)}Hz, ${cents}¢)")
            }
        )
        pitchEngine?.start()
        Log.i(TAG, "Pitch detection engine started — Oboe 48kHz low-latency")
    }

    private fun setupComposeUi() {
        setContent {
            VoixViveXrApp(
                noteState = noteState,
                fretState = fretState,
                handTrackingReady = handTrackingReady.value
            )
        }
    }

    private fun setupFallbackUi() {
        setContent {
            FallbackScreen()
        }
    }

    override fun onResume() {
        super.onResume()
        xrSession?.resume()
        pitchEngine?.start()
        handTracker?.start()
    }

    override fun onPause() {
        super.onPause()
        pitchEngine?.stop()
        handTracker?.stop()
        xrSession?.pause()
    }

    override fun onDestroy() {
        super.onDestroy()
        pitchEngine?.release()
        handTracker?.release()
        xrSession?.close()
    }
}

data class DetectedNote(
    val name: String,
    val frequency: Float,
    val cents: Int
)

data class FretPosition(
    val stringIndex: Int,
    val fretIndex: Int,
    val confidence: Float
)
