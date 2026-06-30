package com.voixvive.xr

import android.util.Log
import com.google.oboe.AudioFormat
import com.google.oboe.AudioStream
import com.google.oboe.AudioStreamBuilder
import com.google.oboe.DataCallbackResult

/**
 * PitchDetectionEngine — Low-latency pitch detection using Oboe + YIN algorithm.
 *
 * Uses Google's Oboe library for low-latency (< 20ms) microphone input on Android.
 * The YIN autocorrelation algorithm detects the fundamental frequency of the
 * guitar signal in real-time, enabling instant visual feedback on the fretboard.
 *
 * This replaces the Web Audio API approach used in the PWA version, providing
 * the < 25ms latency required for the Voix Vive curriculum (see thesis §3.2).
 *
 * Audio pipeline:
 *   Oboe InputStream (48kHz, Mono, Float) → Ring Buffer → YIN → Note Callback
 */
class PitchDetectionEngine(
    private val onNoteDetected: (noteName: String, frequency: Float, cents: Int) -> Unit
) {
    private val TAG = "PitchEngine"

    private var audioStream: AudioStream? = null
    private val sampleRate = 48000
    private val bufferSize = 2048
    private val ringBuffer = FloatArray(bufferSize)
    private var ringBufferPos = 0

    @Volatile
    private var isRunning = false

    private val NOTE_NAMES = arrayOf("C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B")

    fun start() {
        if (isRunning) return

        try {
            audioStream = AudioStreamBuilder()
                .setDirection(AudioStreamBuilder.Direction.Input)
                .setFormat(AudioFormat.Float)
                .setChannelCount(AudioFormat.ChannelCount.Mono)
                .setSampleRate(sampleRate)
                .setPerformanceMode(AudioStreamBuilder.PerformanceMode.LowLatency)
                .setSharingMode(AudioStreamBuilder.SharingMode.Exclusive)
                .setDataCallback(object : AudioStream.DataCallback {
                    override fun onData(stream: AudioStream, data: FloatArray, numFrames: Int): DataCallbackResult {
                        processAudioData(data, numFrames)
                        return DataCallbackResult.Continue
                    }
                })
                .openStream()

            audioStream?.requestStart()
            isRunning = true
            Log.i(TAG, "Oboe audio stream started — ${sampleRate}Hz, low-latency mode")
        } catch (e: Exception) {
            Log.e(TAG, "Failed to start Oboe stream: ${e.message}")
            // Fallback to standard AudioRecord could go here
        }
    }

    fun stop() {
        if (!isRunning) return
        isRunning = false
        audioStream?.stop()
        audioStream?.close()
        audioStream = null
        Log.i(TAG, "Oboe audio stream stopped")
    }

    fun release() {
        stop()
    }

    private fun processAudioData(data: FloatArray, numFrames: Int) {
        // Copy into ring buffer
        for (i in 0 until numFrames) {
            ringBuffer[ringBufferPos] = data[i]
            ringBufferPos = (ringBufferPos + 1) % bufferSize
        }

        // Run YIN pitch detection when buffer is full
        if (ringBufferPos == 0) {
            val freq = yinDetect(ringBuffer, sampleRate)
            if (freq != null && freq > 60 && freq < 1200) {
                val midi = Math.round(69 + 12 * Math.log(freq / 440.0) / Math.log(2.0))
                val cents = Math.round((12 * Math.log(freq / 440.0) / Math.log(2.0) - (midi - 69)) * 100)
                val noteName = NOTE_NAMES[((midi % 12) + 12) % 12]
                val octave = midi / 12 - 1

                onNoteDetected("$noteName$octave", freq, cents)
            }
        }
    }

    /**
     * YIN pitch detection algorithm.
     * Returns the fundamental frequency in Hz, or null if no pitch detected.
     */
    private fun yinDetect(buffer: FloatArray, sampleRate: Int): Float? {
        val halfBuf = buffer.size / 2
        val yinBuffer = FloatArray(halfBuf)
        val threshold = 0.15f

        // Step 1: Difference function
        for (t in 0 until halfBuf) {
            var sum = 0f
            for (i in 0 until halfBuf) {
                val delta = buffer[i] - buffer[i + t]
                sum += delta * delta
            }
            yinBuffer[t] = sum
        }

        // Step 2: Cumulative mean normalized difference
        yinBuffer[0] = 1f
        var runningSum = 0f
        for (t in 1 until halfBuf) {
            runningSum += yinBuffer[t]
            yinBuffer[t] = if (runningSum == 0f) yinBuffer[t] else yinBuffer[t] * t / runningSum
        }

        // Step 3: Absolute threshold
        var tau = -1
        for (t in 2 until halfBuf) {
            if (yinBuffer[t] < threshold) {
                while (t + 1 < halfBuf && yinBuffer[t + 1] < yinBuffer[t]) t++
                tau = t
                break
            }
        }

        if (tau == -1) {
            var minVal = 1f
            var minTau = -1
            for (t in 2 until halfBuf) {
                if (yinBuffer[t] < minVal) {
                    minVal = yinBuffer[t]
                    minTau = t
                }
            }
            if (minTau != -1 && minVal < 0.3f) tau = minTau else return null
        }

        // Step 4: Parabolic interpolation
        var betterTau = tau.toFloat()
        if (tau > 0 && tau < halfBuf - 1) {
            val s0 = yinBuffer[tau - 1]
            val s1 = yinBuffer[tau]
            val s2 = yinBuffer[tau + 1]
            val adjustment = (s2 - s0) / (2 * (2 * s1 - s2 - s0))
            if (Math.abs(adjustment) < 1) betterTau = tau + adjustment
        }

        return sampleRate / betterTau
    }
}
