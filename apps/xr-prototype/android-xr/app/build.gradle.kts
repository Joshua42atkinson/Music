// app/build.gradle.kts
// Voix Vive XR — Android XR Application Module
// Target: XREAL Aura (Android XR, optical see-through glasses)
// Built with: Jetpack XR SDK (Developer Preview 4) + ARCore for Jetpack XR

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.voixvive.xr"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.voixvive.xr"
        minSdk = 30
        targetSdk = 36
        versionCode = 1
        versionName = "0.1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        compose = true
    }

    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.15"
    }
}

dependencies {
    // ── Jetpack XR SDK (Developer Preview 4) ──────────────────
    // Spatial computing: sessions, scenes, spatial UI, panels
    implementation("androidx.xr:scenecore:1.0.0-alpha04")
    // ARCore for Jetpack XR: hand tracking, spatial anchors, perception
    implementation("androidx.xr:arcore:1.0.0-alpha04")
    // XR runtime
    implementation("androidx.xr:runtime:1.0.0-alpha04")

    // ── AndroidX core ─────────────────────────────────────────
    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.activity:activity-compose:1.9.3")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.7")
    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.8.7")

    // ── Jetpack Compose (for spatial UI panels) ───────────────
    implementation(platform("androidx.compose:compose-bom:2024.12.01"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.ui:ui-tooling-preview")

    // ── Coroutines (for hand tracking state collection) ───────
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.9.0")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-guava:1.9.0")

    // ── Oboe audio (low-latency microphone for pitch detection) ──
    implementation("com.google.oboe:oboe:1.9.0")

    // ── ML Kit GenAI (Gemini Nano — coming soon) ──────────────
    // implementation("com.google.mlkit:genai:1.0.0")

    // ── Testing ───────────────────────────────────────────────
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.2.1")
}
