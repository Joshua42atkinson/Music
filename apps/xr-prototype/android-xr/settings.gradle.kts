// settings.gradle.kts
// Voix Vive XR — Android XR Project
// Target: Android XR SDK (Project Aura, Jetpack XR)

pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "VoixViveXR"
include(":app")
