package com.voixvive.xr

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.runtime.mutableStateOf

/**
 * VoixViveXrApp — Main Compose for XR spatial UI.
 *
 * Renders two spatial elements in the XR activity space:
 *   1. Note Display Panel — floating panel showing detected note info
 *   2. Fretboard Status — shows which fret/string the user's fingers are on
 *
 * In production on XREAL Aura, these would be spatial panels positioned
 * in the user's field of view via Jetpack XR SDK's spatial UI APIs.
 * On non-XR devices, they render as a standard Android overlay.
 */

// Voix Vive brand colors
private val GoldPrimary = Color(0xFFD4A843)
private val GoldBright = Color(0xFFFFD66B)
private val BlueScale = Color(0xFF4A7AFF)
private val DarkBg = Color(0x99050810)
private val TextPrimary = Color(0xFFF0E8D0)
private val TextSecondary = Color(0xFF8B8B9E)

@Composable
fun VoixViveXrApp(
    noteState: State<DetectedNote?>,
    fretState: State<FretPosition?>,
    handTrackingReady: Boolean
) {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.BottomStart
    ) {
        Column(
            modifier = Modifier
                .padding(24.dp)
                .width(320.dp)
        ) {
            // Title
            Text(
                text = "VOIX VIVE XR",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = GoldPrimary,
                modifier = Modifier.padding(bottom = 12.dp)
            )

            // Note Display Card
            val note = noteState.value
            NoteDisplayCard(note)

            Spacer(modifier = Modifier.height(12.dp))

            // Fret Position Card (from hand tracking)
            val fret = fretState.value
            if (fret != null && fret.fretIndex >= 0) {
                FretPositionCard(fret)
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Hand tracking status
            HandTrackingStatusCard(handTrackingReady)
        }
    }
}

@Composable
private fun NoteDisplayCard(note: DetectedNote?) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = DarkBg)
    ) {
        Column(
            modifier = Modifier.padding(20.dp)
        ) {
            if (note != null) {
                // Large note name
                Text(
                    text = note.name,
                    fontSize = 72.sp,
                    fontWeight = FontWeight.Bold,
                    color = GoldBright,
                    modifier = Modifier.padding(bottom = 4.dp)
                )

                // Frequency
                Text(
                    text = "${String.format("%.1f", note.frequency)} Hz",
                    fontSize = 20.sp,
                    color = BlueScale,
                    modifier = Modifier.padding(bottom = 2.dp)
                )

                // Cents deviation (tuning indicator)
                val centsText = when {
                    note.cents == 0 -> "IN TUNE"
                    note.cents > 0 -> "+${note.cents}¢ sharp"
                    else -> "${note.cents}¢ flat"
                }
                val centsColor = when {
                    note.cents == 0 -> Color(0xFF4ADE80)
                    Math.abs(note.cents) <= 5 -> GoldBright
                    else -> Color(0xFFEF4444)
                }
                Text(
                    text = centsText,
                    fontSize = 16.sp,
                    color = centsColor
                )
            } else {
                Text(
                    text = "—",
                    fontSize = 72.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextSecondary
                )
                Text(
                    text = "Play a note...",
                    fontSize = 16.sp,
                    color = TextSecondary
                )
            }
        }
    }
}

@Composable
private fun FretPositionCard(fret: FretPosition) {
    val stringNames = arrayOf("Low E", "A", "D", "G", "B", "High E")
    val stringName = if (fret.stringIndex in 0..5) stringNames[fret.stringIndex] else "?"

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = DarkBg)
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = "Fret ${fret.fretIndex}",
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Bold,
                    color = GoldPrimary
                )
                Text(
                    text = "$stringName string",
                    fontSize = 14.sp,
                    color = TextSecondary
                )
            }
            // Confidence indicator
            if (fret.confidence > 0.5f) {
                Box(
                    modifier = Modifier
                        .size(12.dp)
                        .background(GoldBright, RoundedCornerShape(50))
                )
            }
        }
    }
}

@Composable
private fun HandTrackingStatusCard(ready: Boolean) {
    val statusText = if (ready) "Hand tracking active" else "Hand tracking initializing..."
    val statusColor = if (ready) Color(0xFF4ADE80) else TextSecondary

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(8.dp),
        colors = CardDefaults.cardColors(containerColor = DarkBg)
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(8.dp)
                    .background(statusColor, RoundedCornerShape(50))
            )
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = statusText,
                fontSize = 13.sp,
                color = statusColor
            )
        }
    }
}

@Composable
fun FallbackScreen() {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = "Voix Vive XR",
                fontSize = 32.sp,
                fontWeight = FontWeight.Bold,
                color = GoldPrimary
            )
            Text(
                text = "XR session unavailable — running in fallback mode",
                fontSize = 16.sp,
                color = TextSecondary,
                modifier = Modifier.padding(top = 8.dp)
            )
            Text(
                text = "This app requires an Android XR device (XREAL Aura)",
                fontSize = 14.sp,
                color = TextSecondary,
                modifier = Modifier.padding(top = 4.dp)
            )
        }
    }
}
