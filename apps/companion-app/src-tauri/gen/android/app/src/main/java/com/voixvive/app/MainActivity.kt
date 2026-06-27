package com.voixvive.app

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import android.util.Log
import android.webkit.PermissionRequest
import android.webkit.WebChromeClient
import android.webkit.WebView
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.google.ai.edge.aicore.GenerativeModel
import com.google.ai.edge.aicore.GenerationConfig
import com.google.ai.edge.aicore.DownloadConfig
import kotlinx.coroutines.runBlocking
import kotlin.concurrent.thread

class MainActivity : TauriActivity() {
    private var generativeModel: GenerativeModel? = null
    private var aicoreReady = false
    private val RECORD_AUDIO_REQUEST_CODE = 1001

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        initGeminiNano()
        requestMicrophonePermission()
    }

    override fun onWebViewCreate(webView: WebView) {
        super.onWebViewCreate(webView)
        webView.webChromeClient = object : WebChromeClient() {
            override fun onPermissionRequest(request: PermissionRequest?) {
                request?.let {
                    val resources = it.resources
                    if (resources.contains(PermissionRequest.RESOURCE_AUDIO_CAPTURE)) {
                        it.grant(resources)
                    } else {
                        it.deny()
                    }
                }
            }
        }
    }

    private fun requestMicrophonePermission() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO)
            != PackageManager.PERMISSION_GRANTED
        ) {
            ActivityCompat.requestPermissions(
                this,
                arrayOf(Manifest.permission.RECORD_AUDIO),
                RECORD_AUDIO_REQUEST_CODE
            )
        }
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == RECORD_AUDIO_REQUEST_CODE) {
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                Log.i("VOIX_VIVE", "Microphone permission granted")
            } else {
                Log.w("VOIX_VIVE", "Microphone permission denied — voice features will not work")
            }
        }
    }

    private fun initGeminiNano() {
        try {
            Log.i("VOIX_VIVE_NANO", "Initializing Gemini Nano via AICore...")
            val config = GenerationConfig.Builder().apply {
                context = this@MainActivity
            }.build()

            generativeModel = GenerativeModel(config, DownloadConfig())
            
            thread {
                try {
                    runBlocking {
                        generativeModel?.prepareInferenceEngine()
                        aicoreReady = true
                        Log.i("VOIX_VIVE_NANO", "Gemini Nano is warmed up and ready!")
                    }
                } catch (e: Exception) {
                    Log.e("VOIX_VIVE_NANO", "Exception warming up", e)
                }
            }
        } catch (t: Throwable) {
            Log.e("VOIX_VIVE_NANO", "Failed to initialize Gemini Nano AICore", t)
        }
    }

    // Called from Rust via JNI
    fun inferGeminiNano(prompt: String): String {
        if (generativeModel == null || !aicoreReady) {
            Log.w("VOIX_VIVE_NANO", "Gemini Nano not ready or unsupported.")
            return "[NANO_UNSUPPORTED]"
        }
        
        return runBlocking {
            try {
                val response = generativeModel?.generateContent(prompt)
                response?.text ?: "[Empty response]"
            } catch (e: Exception) {
                "[Inference Error] " + e.message
            }
        }
    }
}