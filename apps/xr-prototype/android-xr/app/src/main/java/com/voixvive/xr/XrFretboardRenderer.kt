package com.voixvive.xr

import android.opengl.GLES30
import android.opengl.Matrix
import android.util.Log
import androidx.xr.scenecore.Session
import androidx.xr.scenecore.RenderCallback
import androidx.xr.scenecore.Frame
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.nio.FloatBuffer
import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.sin

/**
 * XrFretboardRenderer — Renders the holographic guitar fretboard in XR space.
 *
 * Uses OpenGL ES 3.0 to render a 3D fretboard that floats over the user's
 * physical guitar. Note "potholes" (spheres at each string/fret intersection)
 * light up when the pitch detection engine detects a matching note.
 *
 * Rendering pipeline:
 *   1. Clear frame (passthrough is composited by the XR runtime)
 *   2. Render fretboard mesh (neck, frets, strings, inlays, headstock)
 *   3. Render note potholes (instanced spheres with emissive materials)
 *   4. Render hand tracking joints (gold spheres at fingertip positions)
 *
 * Visual style matches the Bevy spatial engine fretboard:
 *   - Dark wood neck, metallic fret wires, glowing edge strip
 *   - Inlay dots at frets 3, 5, 7, 9, 12 (double at 12)
 *   - Potholes: active=bright gold, root=gold, scale=blue, inactive=dim
 */
class XrFretboardRenderer(
    private val session: Session
) : RenderCallback {

    private val TAG = "FretboardRenderer"

    companion object {
        const val STRING_COUNT = 6
        const val FRET_COUNT = 12
        const val SCALE_LENGTH = 1.8f
        const val STRING_SPACING = 0.075f
        const val NECK_HEIGHT = 0.02f
        const val NECK_WIDTH = STRING_SPACING * (STRING_COUNT + 1.5f)
        const val POTHOLE_RADIUS = 0.035f
        const val HAND_JOINT_RADIUS = 0.015f

        val STRING_MIDI_BASES = intArrayOf(40, 45, 50, 55, 59, 64)

        val COLOR_ACTIVE = floatArrayOf(5.0f, 3.5f, 0.8f)
        val COLOR_ROOT = floatArrayOf(1.2f, 0.9f, 0.2f)
        val COLOR_SCALE = floatArrayOf(0.1f, 0.4f, 1.2f)
        val COLOR_INACTIVE = floatArrayOf(0.02f, 0.04f, 0.12f)
        val COLOR_HAND = floatArrayOf(0.8f, 0.6f, 0.1f)

        const val COORDS_PER_VERTEX = 3
        const val BYTES_PER_FLOAT = 4
        const val SPHERE_LAT_SEGMENTS = 12
        const val SPHERE_LON_SEGMENTS = 16
    }

    // ── State ──────────────────────────────────────────────────

    @Volatile private var activeMidi: Int = -1
    @Volatile private var scalePitchClasses: IntArray = IntArray(0)
    @Volatile private var rootPc: Int = 0
    @Volatile private var handJoints: FloatArray = FloatArray(0)

    // ── GL Handles ─────────────────────────────────────────────

    private var program: Int = 0
    private var fretboardVao: IntArray = IntArray(1)
    private var fretboardVbo: IntArray = IntArray(1)
    private var fretboardVertexCount: Int = 0

    private var potholeVao: IntArray = IntArray(1)
    private var sphereVbo: IntArray = IntArray(1)
    private var potholeInstanceVbo: IntArray = IntArray(1)
    private var potholeColorVbo: IntArray = IntArray(1)
    private var sphereVertexCount: Int = 0

    private var handVao: IntArray = IntArray(1)
    private var handInstanceVbo: IntArray = IntArray(1)

    // Uniform locations
    private var uMvpLoc: Int = 0
    private var uColorLoc: Int = 0
    private var uEmissiveLoc: Int = 0
    private var uTimeLoc: Int = 0
    private var uIsInstancedLoc: Int = 0

    // Matrices
    private val modelMatrix = FloatArray(16)
    private val viewMatrix = FloatArray(16)
    private val projMatrix = FloatArray(16)
    private val mvpMatrix = FloatArray(16)
    private val tempMatrix = FloatArray(16)

    private var startTime: Long = 0
    private val potholeCount = STRING_COUNT * (FRET_COUNT + 1)

    // ── Public API ─────────────────────────────────────────────

    fun setActiveNote(noteName: String, frequency: Float) {
        activeMidi = frequencyToMidi(frequency)
    }

    fun setScale(root: Int, intervals: IntArray) {
        rootPc = root
        scalePitchClasses = intervals.map { (root + it) % 12 }.toIntArray()
    }

    fun updateHandJoints(positions: FloatArray) {
        handJoints = positions
    }

    // ── RenderCallback ─────────────────────────────────────────

    override fun onSurfaceCreated() {
        Log.i(TAG, "OpenGL ES surface created — compiling shaders + building geometry")
        startTime = System.currentTimeMillis()

        GLES30.glEnable(GLES30.GL_DEPTH_TEST)
        GLES30.glEnable(GLES30.GL_BLEND)
        GLES30.glBlendFunc(GLES30.GL_SRC_ALPHA, GLES30.GL_ONE_MINUS_SRC_ALPHA)

        program = compileShaderProgram()
        uMvpLoc = GLES30.glGetUniformLocation(program, "u_mvp")
        uColorLoc = GLES30.glGetUniformLocation(program, "u_color")
        uEmissiveLoc = GLES30.glGetUniformLocation(program, "u_emissive")
        uTimeLoc = GLES30.glGetUniformLocation(program, "u_time")
        uIsInstancedLoc = GLES30.glGetUniformLocation(program, "u_isInstanced")

        buildFretboardGeometry()
        buildPotholeGeometry()
        buildHandGeometry()

        Log.i(TAG, "Geometry built — fretboard verts: $fretboardVertexCount, sphere verts: $sphereVertexCount, potholes: $potholeCount")
    }

    override fun onDrawFrame(frame: Frame) {
        GLES30.glClear(GLES30.GL_DEPTH_BUFFER_BIT)

        val time = (System.currentTimeMillis() - startTime) / 1000.0f

        // Set up camera matrices (perspective view of the fretboard)
        setupCameraMatrices()

        // Fretboard model transform — tilted toward viewer like a guitar on a stand
        Matrix.setIdentityM(modelMatrix, 0)
        Matrix.translateM(modelMatrix, 0, -0.9f, 0.9f, -0.2f)
        Matrix.rotateM(modelMatrix, 0, -8.6f, 1f, 0f, 0f)  // -0.15 rad ≈ -8.6°
        Matrix.rotateM(modelMatrix, 0, 8.6f, 0f, 1f, 0f)   // 0.15 rad ≈ 8.6°

        renderFretboard(time)
        renderPotholes(time)
        renderHands(time)
    }

    // ── Render Methods ─────────────────────────────────────────

    private fun setupCameraMatrices() {
        Matrix.setLookAtM(viewMatrix, 0,
            0f, 1.2f, 2.5f,    // eye
            0f, 0.9f, 0f,     // center
            0f, 1f, 0f)        // up

        val aspect = 1.0f
        Matrix.perspectiveM(projMatrix, 0, 60f * PI.toFloat() / 180f, aspect, 0.1f, 100f)
    }

    private fun computeMvp() {
        Matrix.multiplyMM(tempMatrix, 0, viewMatrix, 0, modelMatrix, 0)
        Matrix.multiplyMM(mvpMatrix, 0, projMatrix, 0, tempMatrix, 0)
    }

    private fun renderFretboard(time: Float) {
        computeMvp()
        GLES30.glUseProgram(program)
        GLES30.glUniformMatrix4fv(uMvpLoc, 1, false, mvpMatrix, 0)
        GLES30.glUniform1i(uIsInstancedLoc, 0)
        GLES30.glUniform1f(uTimeLoc, time)

        GLES30.glBindVertexArray(fretboardVao[0])
        GLES30.glDrawArrays(GLES30.GL_TRIANGLES, 0, fretboardVertexCount)
        GLES30.glBindVertexArray(0)
    }

    private fun renderPotholes(time: Float) {
        // Update per-instance colors based on scale/active state
        val colors = FloatArray(potholeCount * 3)
        val midiBase = STRING_MIDI_BASES

        for (string in 0 until STRING_COUNT) {
            for (fret in 0..FRET_COUNT) {
                val idx = string * (FRET_COUNT + 1) + fret
                val midi = midiBase[string] + fret
                val pc = ((midi % 12) + 12) % 12
                val isActive = midi == activeMidi
                val isRoot = pc == rootPc
                val inScale = scalePitchClasses.contains(pc)

                val color = when {
                    isActive -> COLOR_ACTIVE
                    isRoot -> COLOR_ROOT
                    inScale -> COLOR_SCALE
                    else -> COLOR_INACTIVE
                }

                // Active potholes pulse brighter
                val pulse = if (isActive) 1.0f + 0.3f * sin(time * 6.0f) else 1.0f
                colors[idx * 3] = color[0] * pulse
                colors[idx * 3 + 1] = color[1] * pulse
                colors[idx * 3 + 2] = color[2] * pulse
            }
        }

        // Upload updated colors
        GLES30.glBindBuffer(GLES30.GL_ARRAY_BUFFER, potholeColorVbo[0])
        GLES30.glBufferSubData(GLES30.GL_ARRAY_BUFFER, 0,
            colors.size * BYTES_PER_FLOAT,
            floatBuffer(colors))
        GLES30.glBindBuffer(GLES30.GL_ARRAY_BUFFER, 0)

        computeMvp()
        GLES30.glUseProgram(program)
        GLES30.glUniformMatrix4fv(uMvpLoc, 1, false, mvpMatrix, 0)
        GLES30.glUniform1i(uIsInstancedLoc, 1)
        GLES30.glUniform1f(uTimeLoc, time)

        GLES30.glBindVertexArray(potholeVao[0])
        GLES30.glDrawArraysInstanced(GLES30.GL_TRIANGLES, 0, sphereVertexCount, potholeCount)
        GLES30.glBindVertexArray(0)
    }

    private fun renderHands(time: Float) {
        if (handJoints.isEmpty()) return

        val jointCount = handJoints.size / 3

        // Upload joint positions as instance data
        GLES30.glBindBuffer(GLES30.GL_ARRAY_BUFFER, handInstanceVbo[0])
        GLES30.glBufferSubData(GLES30.GL_ARRAY_BUFFER, 0,
            handJoints.size * BYTES_PER_FLOAT,
            floatBuffer(handJoints))
        GLES30.glBindBuffer(GLES30.GL_ARRAY_BUFFER, 0)

        computeMvp()
        GLES30.glUseProgram(program)
        GLES30.glUniformMatrix4fv(uMvpLoc, 1, false, mvpMatrix, 0)
        GLES30.glUniform3f(uColorLoc, COLOR_HAND[0], COLOR_HAND[1], COLOR_HAND[2])
        GLES30.glUniform1f(uEmissiveLoc, 1.5f)
        GLES30.glUniform1i(uIsInstancedLoc, 1)
        GLES30.glUniform1f(uTimeLoc, time)

        GLES30.glBindVertexArray(handVao[0])
        GLES30.glDrawArraysInstanced(GLES30.GL_TRIANGLES, 0, sphereVertexCount, jointCount)
        GLES30.glBindVertexArray(0)
    }

    // ── Shader Compilation ─────────────────────────────────────

    private fun compileShaderProgram(): Int {
        val vertexSrc = """
            #version 300 es
            precision highp float;

            layout(location = 0) in vec3 a_position;
            layout(location = 1) in vec3 a_normal;
            layout(location = 2) in vec3 a_instancePos;
            layout(location = 3) in vec3 a_instanceColor;
            layout(location = 4) in float a_instanceScale;

            uniform mat4 u_mvp;
            uniform int u_isInstanced;
            uniform float u_time;

            out vec3 v_color;
            out vec3 v_normal;
            out float v_emissive;

            void main() {
                vec3 pos = a_position;
                vec3 color = vec3(0.6, 0.5, 0.2);
                float scale = 1.0;
                float emissive = 0.3;

                if (u_isInstanced == 1) {
                    pos = a_position * a_instanceScale + a_instancePos;
                    color = a_instanceColor;
                    emissive = 1.0;
                }

                gl_Position = u_mvp * vec4(pos, 1.0);
                v_color = color;
                v_normal = a_normal;
                v_emissive = emissive;
            }
        """.trimIndent()

        val fragmentSrc = """
            #version 300 es
            precision highp float;

            in vec3 v_color;
            in vec3 v_normal;
            in float v_emissive;

            uniform vec3 u_color;
            uniform float u_emissive;

            out vec4 fragColor;

            void main() {
                vec3 baseColor = v_color * u_color;
                vec3 finalColor = baseColor * (0.4 + v_emissive * 1.5);
                fragColor = vec4(finalColor, 0.95);
            }
        """.trimIndent()

        val vs = compileShader(GLES30.GL_VERTEX_SHADER, vertexSrc)
        val fs = compileShader(GLES30.GL_FRAGMENT_SHADER, fragmentSrc)

        val program = GLES30.glCreateProgram()
        GLES30.glAttachShader(program, vs)
        GLES30.glAttachShader(program, fs)
        GLES30.glLinkProgram(program)

        val linkStatus = IntArray(1)
        GLES30.glGetProgramiv(program, GLES30.GL_LINK_STATUS, linkStatus, 0)
        if (linkStatus[0] != GLES30.GL_TRUE) {
            Log.e(TAG, "Shader link failed: ${GLES30.glGetProgramInfoLog(program)}")
            GLES30.glDeleteProgram(program)
            return 0
        }

        GLES30.glDeleteShader(vs)
        GLES30.glDeleteShader(fs)
        Log.i(TAG, "Shader program compiled + linked successfully")
        return program
    }

    private fun compileShader(type: Int, source: String): Int {
        val shader = GLES30.glCreateShader(type)
        GLES30.glShaderSource(shader, source)
        GLES30.glCompileShader(shader)

        val status = IntArray(1)
        GLES30.glGetShaderiv(shader, GLES30.GL_COMPILE_STATUS, status, 0)
        if (status[0] != GLES30.GL_TRUE) {
            Log.e(TAG, "Shader compile failed: ${GLES30.glGetShaderInfoLog(shader)}")
            GLES30.glDeleteShader(shader)
            return 0
        }
        return shader
    }

    // ── Geometry Builders ──────────────────────────────────────

    private fun buildFretboardGeometry() {
        val vertices = mutableListOf<Float>()

        val neckLength = fretPosition(FRET_COUNT, SCALE_LENGTH)

        // Neck (dark wood box)
        addBox(vertices,
            cx = neckLength / 2f, cy = 0f, cz = 0f,
            sx = neckLength, sy = NECK_HEIGHT, sz = NECK_WIDTH,
            color = floatArrayOf(0.12f, 0.06f, 0.03f))

        // Glowing edge strip
        addBox(vertices,
            cx = neckLength / 2f, cy = -NECK_HEIGHT * 0.6f, cz = 0f,
            sx = neckLength, sy = 0.003f, sz = NECK_WIDTH + 0.01f,
            color = floatArrayOf(0.2f, 0.15f, 0.05f))

        // Headstock
        addBox(vertices,
            cx = -0.08f, cy = 0f, cz = 0f,
            sx = 0.15f, sy = 0.025f, sz = NECK_WIDTH * 0.9f,
            color = floatArrayOf(0.1f, 0.05f, 0.02f))

        // Fret wires (metallic thin boxes)
        for (fret in 0..FRET_COUNT) {
            val x = fretPosition(fret, SCALE_LENGTH)
            addBox(vertices,
                cx = x, cy = NECK_HEIGHT * 0.75f, cz = 0f,
                sx = 0.004f, sy = 0.025f, sz = NECK_WIDTH,
                color = floatArrayOf(0.85f, 0.85f, 0.88f))
        }

        // Inlay dots at frets 3, 5, 7, 9, 12 (double at 12)
        val inlayFrets = intArrayOf(3, 5, 7, 9, 12)
        for (fret in inlayFrets) {
            val prevX = fretPosition(fret - 1, SCALE_LENGTH)
            val currX = fretPosition(fret, SCALE_LENGTH)
            val midX = (prevX + currX) / 2f

            if (fret == 12) {
                addSphere(vertices, midX, NECK_HEIGHT * 0.55f, -0.04f, 0.012f,
                    floatArrayOf(0.7f, 0.65f, 0.5f))
                addSphere(vertices, midX, NECK_HEIGHT * 0.55f, 0.04f, 0.012f,
                    floatArrayOf(0.7f, 0.65f, 0.5f))
            } else {
                addSphere(vertices, midX, NECK_HEIGHT * 0.55f, 0f, 0.012f,
                    floatArrayOf(0.7f, 0.65f, 0.5f))
            }
        }

        // Guitar strings (thin cylinders along the neck)
        val stringThicknesses = floatArrayOf(0.0015f, 0.0012f, 0.001f, 0.0008f, 0.0007f, 0.0006f)
        for (string in 0 until STRING_COUNT) {
            val z = string * STRING_SPACING - (STRING_COUNT - 1) * STRING_SPACING / 2f
            addCylinder(vertices,
                cx = neckLength / 2f, cy = NECK_HEIGHT, cz = z,
                length = neckLength, radius = stringThicknesses[string],
                color = floatArrayOf(0.9f, 0.88f, 0.8f))
        }

        // Upload to GPU
        fretboardVertexCount = vertices.size / (COORDS_PER_VERTEX + 3) // pos + color per vertex

        GLES30.glGenVertexArrays(1, fretboardVao, 0)
        GLES30.glGenBuffers(1, fretboardVbo, 0)

        GLES30.glBindVertexArray(fretboardVao[0])
        GLES30.glBindBuffer(GLES30.GL_ARRAY_BUFFER, fretboardVbo[0])

        val buf = floatBuffer(vertices.toFloatArray())
        GLES30.glBufferData(GLES30.GL_ARRAY_BUFFER, buf.capacity() * BYTES_PER_FLOAT, buf, GLES30.GL_STATIC_DRAW)

        val stride = (COORDS_PER_VERTEX + 3) * BYTES_PER_FLOAT
        // position (location 0)
        GLES30.glEnableVertexAttribArray(0)
        GLES30.glVertexAttribPointer(0, COORDS_PER_VERTEX, GLES30.GL_FLOAT, false, stride, 0)
        // color (location 1 — reusing normal slot for per-vertex color on non-instanced draws)
        GLES30.glEnableVertexAttribArray(1)
        GLES30.glVertexAttribPointer(1, 3, GLES30.GL_FLOAT, false, stride, COORDS_PER_VERTEX * BYTES_PER_FLOAT)

        GLES30.glBindVertexArray(0)
        GLES30.glBindBuffer(GLES30.GL_ARRAY_BUFFER, 0)
    }

    private fun buildPotholeGeometry() {
        // Build UV sphere mesh for potholes
        val sphereVerts = generateSphereVertices(POTHOLE_RADIUS)
        sphereVertexCount = sphereVerts.size / (COORDS_PER_VERTEX + 3)

        // Per-instance positions (6 strings × 13 frets = 78)
        val positions = FloatArray(potholeCount * 3)
        for (string in 0 until STRING_COUNT) {
            for (fret in 0..FRET_COUNT) {
                val idx = string * (FRET_COUNT + 1) + fret
                val x = fretPosition(fret, SCALE_LENGTH)
                val z = string * STRING_SPACING - (STRING_COUNT - 1) * STRING_SPACING / 2f
                positions[idx * 3] = x
                positions[idx * 3 + 1] = NECK_HEIGHT * 2f
                positions[idx * 3 + 2] = z
            }
        }

        // Initial colors (all inactive)
        val colors = FloatArray(potholeCount * 3)
        for (i in 0 until potholeCount) {
            colors[i * 3] = COLOR_INACTIVE[0]
            colors[i * 3 + 1] = COLOR_INACTIVE[1]
            colors[i * 3 + 2] = COLOR_INACTIVE[2]
        }

        GLES30.glGenVertexArrays(1, potholeVao, 0)
        GLES30.glGenBuffers(1, sphereVbo, 0)
        GLES30.glGenBuffers(1, potholeInstanceVbo, 0)
        GLES30.glGenBuffers(1, potholeColorVbo, 0)

        GLES30.glBindVertexArray(potholeVao[0])

        // Sphere vertex data (position + normal)
        GLES30.glBindBuffer(GLES30.GL_ARRAY_BUFFER, sphereVbo[0])
        val sphereBuf = floatBuffer(sphereVerts)
        GLES30.glBufferData(GLES30.GL_ARRAY_BUFFER, sphereBuf.capacity() * BYTES_PER_FLOAT, sphereBuf, GLES30.GL_STATIC_DRAW)
        val sphereStride = (COORDS_PER_VERTEX + 3) * BYTES_PER_FLOAT
        GLES30.glEnableVertexAttribArray(0)
        GLES30.glVertexAttribPointer(0, COORDS_PER_VERTEX, GLES30.GL_FLOAT, false, sphereStride, 0)
        GLES30.glEnableVertexAttribArray(1)
        GLES30.glVertexAttribPointer(1, 3, GLES30.GL_FLOAT, false, sphereStride, COORDS_PER_VERTEX * BYTES_PER_FLOAT)

        // Instance positions (location 2)
        GLES30.glBindBuffer(GLES30.GL_ARRAY_BUFFER, potholeInstanceVbo[0])
        val posBuf = floatBuffer(positions)
        GLES30.glBufferData(GLES30.GL_ARRAY_BUFFER, posBuf.capacity() * BYTES_PER_FLOAT, posBuf, GLES30.GL_STATIC_DRAW)
        GLES30.glEnableVertexAttribArray(2)
        GLES30.glVertexAttribPointer(2, 3, GLES30.GL_FLOAT, false, 0, 0)
        GLES30.glVertexAttribDivisor(2, 1)

        // Instance colors (location 3) — dynamic, updated each frame
        GLES30.glBindBuffer(GLES30.GL_ARRAY_BUFFER, potholeColorVbo[0])
        GLES30.glBufferData(GLES30.GL_ARRAY_BUFFER, colors.size * BYTES_PER_FLOAT, floatBuffer(colors), GLES30.GL_DYNAMIC_DRAW)
        GLES30.glEnableVertexAttribArray(3)
        GLES30.glVertexAttribPointer(3, 3, GLES30.GL_FLOAT, false, 0, 0)
        GLES30.glVertexAttribDivisor(3, 1)

        // Instance scale (location 4) — static, all 1.0 (active scaling done in shader via color pulse)
        val scales = FloatArray(potholeCount) { 1.0f }
        val scaleVbo = IntArray(1)
        GLES30.glGenBuffers(1, scaleVbo, 0)
        GLES30.glBindBuffer(GLES30.GL_ARRAY_BUFFER, scaleVbo[0])
        GLES30.glBufferData(GLES30.GL_ARRAY_BUFFER, scales.size * BYTES_PER_FLOAT, floatBuffer(scales), GLES30.GL_STATIC_DRAW)
        GLES30.glEnableVertexAttribArray(4)
        GLES30.glVertexAttribPointer(4, 1, GLES30.GL_FLOAT, false, 0, 0)
        GLES30.glVertexAttribDivisor(4, 1)

        GLES30.glBindVertexArray(0)
        GLES30.glBindBuffer(GLES30.GL_ARRAY_BUFFER, 0)
    }

    private fun buildHandGeometry() {
        // Reuse sphere mesh but at smaller radius
        val handVerts = generateSphereVertices(HAND_JOINT_RADIUS)
        val handVertexCount = handVerts.size / (COORDS_PER_VERTEX + 3)

        GLES30.glGenVertexArrays(1, handVao, 0)

        val handSphereVbo = IntArray(1)
        GLES30.glGenBuffers(1, handSphereVbo, 0)
        GLES30.glGenBuffers(1, handInstanceVbo, 0)

        GLES30.glBindVertexArray(handVao[0])

        // Sphere vertex data
        GLES30.glBindBuffer(GLES30.GL_ARRAY_BUFFER, handSphereVbo[0])
        val sphereBuf = floatBuffer(handVerts)
        GLES30.glBufferData(GLES30.GL_ARRAY_BUFFER, sphereBuf.capacity() * BYTES_PER_FLOAT, sphereBuf, GLES30.GL_STATIC_DRAW)
        val stride = (COORDS_PER_VERTEX + 3) * BYTES_PER_FLOAT
        GLES30.glEnableVertexAttribArray(0)
        GLES30.glVertexAttribPointer(0, COORDS_PER_VERTEX, GLES30.GL_FLOAT, false, stride, 0)
        GLES30.glEnableVertexAttribArray(1)
        GLES30.glVertexAttribPointer(1, 3, GLES30.GL_FLOAT, false, stride, COORDS_PER_VERTEX * BYTES_PER_FLOAT)

        // Instance positions (up to 50 joints, dynamic)
        val maxJoints = 50
        GLES30.glBindBuffer(GLES30.GL_ARRAY_BUFFER, handInstanceVbo[0])
        GLES30.glBufferData(GLES30.GL_ARRAY_BUFFER, maxJoints * 3 * BYTES_PER_FLOAT, null, GLES30.GL_DYNAMIC_DRAW)
        GLES30.glEnableVertexAttribArray(2)
        GLES30.glVertexAttribPointer(2, 3, GLES30.GL_FLOAT, false, 0, 0)
        GLES30.glVertexAttribDivisor(2, 1)

        // Static color for all hand joints (gold)
        val handColors = FloatArray(maxJoints * 3)
        for (i in 0 until maxJoints) {
            handColors[i * 3] = COLOR_HAND[0]
            handColors[i * 3 + 1] = COLOR_HAND[1]
            handColors[i * 3 + 2] = COLOR_HAND[2]
        }
        val handColorVbo = IntArray(1)
        GLES30.glGenBuffers(1, handColorVbo, 0)
        GLES30.glBindBuffer(GLES30.GL_ARRAY_BUFFER, handColorVbo[0])
        GLES30.glBufferData(GLES30.GL_ARRAY_BUFFER, handColors.size * BYTES_PER_FLOAT, floatBuffer(handColors), GLES30.GL_STATIC_DRAW)
        GLES30.glEnableVertexAttribArray(3)
        GLES30.glVertexAttribPointer(3, 3, GLES30.GL_FLOAT, false, 0, 0)
        GLES30.glVertexAttribDivisor(3, 1)

        // Static scale for hand joints
        val handScales = FloatArray(maxJoints) { 1.0f }
        val handScaleVbo = IntArray(1)
        GLES30.glGenBuffers(1, handScaleVbo, 0)
        GLES30.glBindBuffer(GLES30.GL_ARRAY_BUFFER, handScaleVbo[0])
        GLES30.glBufferData(GLES30.GL_ARRAY_BUFFER, handScales.size * BYTES_PER_FLOAT, floatBuffer(handScales), GLES30.GL_STATIC_DRAW)
        GLES30.glEnableVertexAttribArray(4)
        GLES30.glVertexAttribPointer(4, 1, GLES30.GL_FLOAT, false, 0, 0)
        GLES30.glVertexAttribDivisor(4, 1)

        GLES30.glBindVertexArray(0)
        GLES30.glBindBuffer(GLES30.GL_ARRAY_BUFFER, 0)
    }

    // ── Primitive Generators ───────────────────────────────────

    private fun addBox(list: MutableList<Float>,
                       cx: Float, cy: Float, cz: Float,
                       sx: Float, sy: Float, sz: Float,
                       color: FloatArray) {
        val hx = sx / 2f, hy = sy / 2f, hz = sz / 2f
        val c = color

        // 6 faces × 2 triangles × 3 vertices = 36 vertices
        val faces = arrayOf(
            // +X
            floatArrayOf(cx+hx, cy-hy, cz-hz, cx+hx, cy+hy, cz-hz, cx+hx, cy+hy, cz+hz, cx+hx, cy-hy, cz-hz, cx+hx, cy+hy, cz+hz, cx+hx, cy-hy, cz+hz),
            // -X
            floatArrayOf(cx-hx, cy-hy, cz+hz, cx-hx, cy+hy, cz+hz, cx-hx, cy+hy, cz-hz, cx-hx, cy-hy, cz+hz, cx-hx, cy+hy, cz-hz, cx-hx, cy-hy, cz-hz),
            // +Y
            floatArrayOf(cx-hx, cy+hy, cz-hz, cx-hx, cy+hy, cz+hz, cx+hx, cy+hy, cz+hz, cx-hx, cy+hy, cz-hz, cx+hx, cy+hy, cz+hz, cx+hx, cy+hy, cz-hz),
            // -Y
            floatArrayOf(cx-hx, cy-hy, cz+hz, cx-hx, cy-hy, cz-hz, cx+hx, cy-hy, cz-hz, cx-hx, cy-hy, cz+hz, cx+hx, cy-hy, cz-hz, cx+hx, cy-hy, cz+hz),
            // +Z
            floatArrayOf(cx-hx, cy-hy, cz+hz, cx+hx, cy-hy, cz+hz, cx+hx, cy+hy, cz+hz, cx-hx, cy-hy, cz+hz, cx+hx, cy+hy, cz+hz, cx-hx, cy+hy, cz+hz),
            // -Z
            floatArrayOf(cx+hx, cy-hy, cz-hz, cx-hx, cy-hy, cz-hz, cx-hx, cy+hy, cz-hz, cx+hx, cy-hy, cz-hz, cx-hx, cy+hy, cz-hz, cx+hx, cy+hy, cz-hz)
        )

        for (face in faces) {
            var i = 0
            while (i < face.size) {
                list.add(face[i]); list.add(face[i+1]); list.add(face[i+2])
                list.add(c[0]); list.add(c[1]); list.add(c[2])
                i += 3
            }
        }
    }

    private fun addSphere(list: MutableList<Float>,
                          cx: Float, cy: Float, cz: Float,
                          radius: Float, color: FloatArray) {
        for (lat in 0 until SPHERE_LAT_SEGMENTS) {
            val theta1 = (lat.toFloat() / SPHERE_LAT_SEGMENTS) * PI.toFloat()
            val theta2 = ((lat + 1).toFloat() / SPHERE_LAT_SEGMENTS) * PI.toFloat()

            for (lon in 0 until SPHERE_LON_SEGMENTS) {
                val phi1 = (lon.toFloat() / SPHERE_LON_SEGMENTS) * 2f * PI.toFloat()
                val phi2 = ((lon + 1).toFloat() / SPHERE_LON_SEGMENTS) * 2f * PI.toFloat()

                val x1 = cx + radius * sin(theta1) * cos(phi1)
                val y1 = cy + radius * cos(theta1)
                val z1 = cz + radius * sin(theta1) * sin(phi1)
                val x2 = cx + radius * sin(theta1) * cos(phi2)
                val y2 = cy + radius * cos(theta1)
                val z2 = cz + radius * sin(theta1) * sin(phi2)
                val x3 = cx + radius * sin(theta2) * cos(phi2)
                val y3 = cy + radius * cos(theta2)
                val z3 = cz + radius * sin(theta2) * sin(phi2)
                val x4 = cx + radius * sin(theta2) * cos(phi1)
                val y4 = cy + radius * cos(theta2)
                val z4 = cz + radius * sin(theta2) * sin(phi1)

                // Triangle 1
                list.addAll(listOf(x1, y1, z1, color[0], color[1], color[2]))
                list.addAll(listOf(x2, y2, z2, color[0], color[1], color[2]))
                list.addAll(listOf(x3, y3, z3, color[0], color[1], color[2]))
                // Triangle 2
                list.addAll(listOf(x1, y1, z1, color[0], color[1], color[2]))
                list.addAll(listOf(x3, y3, z3, color[0], color[1], color[2]))
                list.addAll(listOf(x4, y4, z4, color[0], color[1], color[2]))
            }
        }
    }

    private fun addCylinder(list: MutableList<Float>,
                            cx: Float, cy: Float, cz: Float,
                            length: Float, radius: Float,
                            color: FloatArray) {
        val segments = 8
        val hx = length / 2f

        for (i in 0 until segments) {
            val a1 = (i.toFloat() / segments) * 2f * PI.toFloat()
            val a2 = ((i + 1).toFloat() / segments) * 2f * PI.toFloat()

            val x1 = cx - hx
            val x2 = cx + hx
            val y1a = cy + radius * cos(a1)
            val z1a = cz + radius * sin(a1)
            val y1b = cy + radius * cos(a2)
            val z1b = cz + radius * sin(a2)

            // Side quad (2 triangles)
            list.addAll(listOf(x1, y1a, z1a, color[0], color[1], color[2]))
            list.addAll(listOf(x2, y1a, z1a, color[0], color[1], color[2]))
            list.addAll(listOf(x2, y1b, z1b, color[0], color[1], color[2]))

            list.addAll(listOf(x1, y1a, z1a, color[0], color[1], color[2]))
            list.addAll(listOf(x2, y1b, z1b, color[0], color[1], color[2]))
            list.addAll(listOf(x1, y1b, z1b, color[0], color[1], color[2]))
        }
    }

    private fun generateSphereVertices(radius: Float): FloatArray {
        val list = mutableListOf<Float>()
        for (lat in 0 until SPHERE_LAT_SEGMENTS) {
            val theta1 = (lat.toFloat() / SPHERE_LAT_SEGMENTS) * PI.toFloat()
            val theta2 = ((lat + 1).toFloat() / SPHERE_LAT_SEGMENTS) * PI.toFloat()

            for (lon in 0 until SPHERE_LON_SEGMENTS) {
                val phi1 = (lon.toFloat() / SPHERE_LON_SEGMENTS) * 2f * PI.toFloat()
                val phi2 = ((lon + 1).toFloat() / SPHERE_LON_SEGMENTS) * 2f * PI.toFloat()

                val x1 = radius * sin(theta1) * cos(phi1)
                val y1 = radius * cos(theta1)
                val z1 = radius * sin(theta1) * sin(phi1)
                val x2 = radius * sin(theta1) * cos(phi2)
                val y2 = radius * cos(theta1)
                val z2 = radius * sin(theta1) * sin(phi2)
                val x3 = radius * sin(theta2) * cos(phi2)
                val y3 = radius * cos(theta2)
                val z3 = radius * sin(theta2) * sin(phi2)
                val x4 = radius * sin(theta2) * cos(phi1)
                val y4 = radius * cos(theta2)
                val z4 = radius * sin(theta2) * sin(phi1)

                // Normal = normalized position (sphere centered at origin)
                val n1x = sin(theta1) * cos(phi1); val n1y = cos(theta1); val n1z = sin(theta1) * sin(phi1)
                val n2x = sin(theta1) * cos(phi2); val n2y = cos(theta1); val n2z = sin(theta1) * sin(phi2)
                val n3x = sin(theta2) * cos(phi2); val n3y = cos(theta2); val n3z = sin(theta2) * sin(phi2)
                val n4x = sin(theta2) * cos(phi1); val n4y = cos(theta2); val n4z = sin(theta2) * sin(phi1)

                // Triangle 1: pos + normal
                list.addAll(listOf(x1, y1, z1, n1x, n1y, n1z))
                list.addAll(listOf(x2, y2, z2, n2x, n2y, n2z))
                list.addAll(listOf(x3, y3, z3, n3x, n3y, n3z))
                // Triangle 2
                list.addAll(listOf(x1, y1, z1, n1x, n1y, n1z))
                list.addAll(listOf(x3, y3, z3, n3x, n3y, n3z))
                list.addAll(listOf(x4, y4, z4, n4x, n4y, n4z))
            }
        }
        return list.toFloatArray()
    }

    // ── Utilities ──────────────────────────────────────────────

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

    private fun frequencyToMidi(freq: Float): Int {
        return Math.round(69 + 12 * Math.log(freq / 440.0) / Math.log(2.0))
    }

    private fun floatBuffer(array: FloatArray): FloatBuffer {
        val buf = ByteBuffer.allocateDirect(array.size * BYTES_PER_FLOAT)
            .order(ByteOrder.nativeOrder())
            .asFloatBuffer()
        buf.put(array).position(0)
        return buf
    }
}
