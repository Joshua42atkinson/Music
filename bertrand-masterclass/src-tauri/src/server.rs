use axum::{
    routing::{get, post},
    Router,
    Json,
    extract::State,
    error_handling::HandleErrorLayer,
    http::StatusCode,
    BoxError,
};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::RwLock;
use tower_http::cors::{CorsLayer, Any};
use tower::{ServiceBuilder, timeout::TimeoutLayer};
use std::time::Duration;
use tokio::signal;
use tracing::{info, error};

use crate::db::{Database, StudentProfile, PracticeLog, StudentSubmission};
use crate::inference::InferenceRouter;
use crate::ffmpeg::preprocess_video;
use crate::socratic_judge::{
    run_socratic_evaluation, SocraticEvaluation,
    generate_offline_pythagoras_scorecard, generate_offline_troubadour_draft
};

#[derive(Clone)]
pub struct AppState {
    pub db: Arc<Database>,
    pub router: Arc<RwLock<InferenceRouter>>,
    pub http_client: Client,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct LMStudioRequest {
    pub messages: Vec<Message>,
    pub temperature: f32,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct Message {
    pub role: String,
    pub content: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct SwitchBackendRequest {
    pub name: String,
}

pub async fn start_server(db: Arc<Database>, router: Arc<RwLock<InferenceRouter>>) {
    let state = AppState {
        db,
        router,
        http_client: Client::new(),
    };

    // CORS: Whitelist known origins only
    let allowed_origins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:4173",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ];
    let cors = CorsLayer::new()
        .allow_origin(
            allowed_origins
                .iter()
                .filter_map(|o| o.parse().ok())
                .collect::<Vec<axum::http::HeaderValue>>(),
        )
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        // Core System
        .route("/api/health", get(health_check))
        .route("/api/health/deep", get(deep_health_check))
        
        // Inference Router APIs
        .route("/api/inference/status", get(get_inference_status))
        .route("/api/inference/switch", post(switch_inference_backend))
        .route("/api/inference/detect", post(detect_inference_backends))
        
        // LLM Proxies
        .route("/api/lmstudio/chat", post(proxy_to_lmstudio))
        .route("/api/chat/completions", post(proxy_to_active_llm))
        
        // Database API Routes
        .route("/api/db/profiles", get(get_all_student_profiles))
        .route("/api/db/profile", get(get_student_profile).post(upsert_student_profile))
        .route("/api/db/profiles/earn", post(earn_student_florins))
        .route("/api/db/profiles/spend", post(spend_student_florins))
        .route("/api/db/logs", get(get_practice_logs).post(insert_practice_log))
        .route("/api/troubadour/generate", post(generate_troubadour_book))
        
        // Mentor Dashboard DaaS Routes
        .route("/api/mentor/submissions", get(get_submissions).post(insert_submission))
        .route("/api/mentor/evaluate", post(evaluate_submission))
        .route("/api/mentor/submit_review", post(submit_review))
        
        .layer(
            ServiceBuilder::new()
                .layer(HandleErrorLayer::new(|err: BoxError| async move {
                    if err.is::<tower::timeout::error::Elapsed>() {
                        Ok(StatusCode::REQUEST_TIMEOUT)
                    } else {
                        Err((StatusCode::INTERNAL_SERVER_ERROR, format!("Unhandled error: {}", err)))
                    }
                }))
                .layer(TimeoutLayer::new(Duration::from_secs(60)))
        )
        .layer(cors)
        .with_state(state);

    match tokio::net::TcpListener::bind("0.0.0.0:8080").await {
        Ok(listener) => {
            info!("🎙️ DaaS Axum Server running on 0.0.0.0:8080");
            if let Err(e) = axum::serve(listener, app)
                .with_graceful_shutdown(shutdown_signal())
                .await 
            {
                error!("❌ Failed to serve Axum application: {}", e);
            }
        }
        Err(e) => {
            error!("❌ Failed to bind DaaS Axum Server to 0.0.0.0:8080. Port might already be in use! Error: {}", e);
            println!("⚠️ WARNING: DaaS Axum Server failed to bind to port 8080: {}. Is another instance running?", e);
        }
    }
}

async fn shutdown_signal() {
    let ctrl_c = async {
        signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        signal::unix::signal(signal::unix::SignalKind::terminate())
            .expect("failed to install signal handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {},
        _ = terminate => {},
    }
    info!("🛑 Shutdown signal received, draining connections gracefully...");
}

async fn health_check() -> &'static str {
    "Voix Vive DaaS Server is running!"
}

async fn deep_health_check(
    State(state): State<AppState>,
) -> Json<serde_json::Value> {
    let profiles = state.db.get_all_profiles().await;
    let logs = state.db.get_logs().await;

    let router_guard = state.router.read().await;
    let backends = router_guard.get_status();
    let active = router_guard.active_backend();
    drop(router_guard);

    Json(serde_json::json!({
        "status": "healthy",
        "version": env!("CARGO_PKG_VERSION"),
        "profiles_count": profiles.len(),
        "logs_count": logs.len(),
        "active_llm": active.name,
        "available_llms": backends.len(),
        "sqlite": "connected",
    }))
}

// --- Inference router APIs ---

async fn get_inference_status(
    State(state): State<AppState>,
) -> Json<serde_json::Value> {
    let router = state.router.read().await;
    Json(serde_json::json!({
        "active_backend": router.active_backend(),
        "backends": router.get_status(),
    }))
}

async fn switch_inference_backend(
    State(state): State<AppState>,
    Json(payload): Json<SwitchBackendRequest>,
) -> Json<serde_json::Value> {
    let mut router = state.router.write().await;
    let success = router.set_active_by_name(&payload.name);
    Json(serde_json::json!({ "success": success, "active_backend": router.active_backend() }))
}

async fn detect_inference_backends(
    State(state): State<AppState>,
) -> Json<serde_json::Value> {
    let mut router = state.router.write().await;
    router.auto_detect().await;
    Json(serde_json::json!({ "success": true, "backends": router.get_status() }))
}

// --- LLM Proxies ---

async fn proxy_to_lmstudio(
    State(state): State<AppState>,
    Json(payload): Json<LMStudioRequest>,
) -> Json<serde_json::Value> {
    let res = state.http_client
        .post("http://localhost:1234/v1/chat/completions")
        .json(&payload)
        .send()
        .await;

    match res {
        Ok(response) => {
            if let Ok(json) = response.json::<serde_json::Value>().await {
                Json(json)
            } else {
                Json(serde_json::json!({ "error": "Failed to parse LM Studio response" }))
            }
        }
        Err(e) => {
            Json(serde_json::json!({ "error": format!("LM Studio connection failed: {}", e) }))
        }
    }
}

async fn proxy_to_active_llm(
    State(state): State<AppState>,
    Json(payload): Json<serde_json::Value>,
) -> Json<serde_json::Value> {
    let active_url = {
        let router = state.router.read().await;
        router.active_url()
    };
    
    let target_url = format!("{}/v1/chat/completions", active_url);
    info!("🤖 Proxying chat completion to active LLM: {}", target_url);

    let res = state.http_client
        .post(&target_url)
        .json(&payload)
        .send()
        .await;

    match res {
        Ok(response) => {
            if let Ok(json) = response.json::<serde_json::Value>().await {
                Json(json)
            } else {
                Json(serde_json::json!({ "error": "Failed to parse LLM response" }))
            }
        }
        Err(e) => {
            error!("❌ Active LLM proxy failed: {}", e);
            Json(serde_json::json!({ "error": format!("Connection to active LLM failed: {}", e) }))
        }
    }
}

// --- Database operations ---

#[derive(Deserialize)]
struct ProfileQuery {
    name: Option<String>,
}

#[derive(Deserialize)]
struct LogQuery {
    student_name: Option<String>,
}

async fn get_all_student_profiles(
    State(state): State<AppState>,
) -> Json<serde_json::Value> {
    let profiles = state.db.get_all_profiles().await;
    Json(serde_json::json!({ "profiles": profiles }))
}

async fn get_student_profile(
    State(state): State<AppState>,
    axum::extract::Query(params): axum::extract::Query<ProfileQuery>,
) -> Json<serde_json::Value> {
    if let Some(name) = params.name {
        match state.db.get_profile_by_name(&name).await {
            Some(profile) => Json(serde_json::json!({ "profile": profile })),
            None => Json(serde_json::json!({ "profile": null })),
        }
    } else {
        match state.db.get_profile().await {
            Some(profile) => Json(serde_json::json!({ "profile": profile })),
            None => Json(serde_json::json!({ "profile": null })),
        }
    }
}

async fn upsert_student_profile(
    State(state): State<AppState>,
    Json(profile): Json<StudentProfile>,
) -> Json<serde_json::Value> {
    match state.db.upsert_profile(&profile).await {
        Ok(_) => Json(serde_json::json!({ "success": true })),
        Err(e) => Json(serde_json::json!({ "success": false, "error": e.to_string() })),
    }
}
async fn get_practice_logs(
    State(state): State<AppState>,
    axum::extract::Query(params): axum::extract::Query<LogQuery>,
) -> Json<serde_json::Value> {
    let logs = if let Some(student) = params.student_name {
        state.db.get_logs_by_student(&student).await
    } else {
        state.db.get_logs().await
    };
    Json(serde_json::json!({ "logs": logs }))
}

async fn insert_practice_log(
    State(state): State<AppState>,
    Json(log): Json<PracticeLog>,
) -> Json<serde_json::Value> {
    match state.db.insert_log(&log).await {
        Ok(_) => Json(serde_json::json!({ "success": true })),
        Err(e) => Json(serde_json::json!({ "success": false, "error": e.to_string() })),
    }
}

// --- Mentor Dashboard Operations ---

#[derive(Deserialize)]
struct EvaluateRequest {
    id: String,
    language: Option<String>,
}

#[derive(Deserialize)]
struct SubmitReviewRequest {
    id: String,
    pythagoras_scorecard: String,
    troubadour_draft: String,
}

async fn get_submissions(
    State(state): State<AppState>,
) -> Json<serde_json::Value> {
    let subs = state.db.get_submissions().await;
    Json(serde_json::json!({ "submissions": subs }))
}

async fn insert_submission(
    State(state): State<AppState>,
    Json(sub): Json<StudentSubmission>,
) -> Json<serde_json::Value> {
    match state.db.upsert_submission(&sub).await {
        Ok(_) => Json(serde_json::json!({ "success": true })),
        Err(e) => Json(serde_json::json!({ "success": false, "error": e.to_string() })),
    }
}

async fn evaluate_submission(
    State(state): State<AppState>,
    Json(payload): Json<EvaluateRequest>,
) -> Json<serde_json::Value> {
    info!("🔍 Request to evaluate submission ID: {}", payload.id);
    
    let mut sub = match state.db.get_submission_by_id(&payload.id).await {
        Some(s) => s,
        None => return Json(serde_json::json!({ "success": false, "error": "Submission not found" })),
    };

    // 1. Spawns FFmpeg and analyze pitch
    let (audio_path, pitch_points) = match preprocess_video(&sub.video_path).await {
        Ok(res) => (Some(res.0), res.1),
        Err(e) => {
            error!("FFmpeg preprocessing failed: {:?}", e);
            (None, vec![])
        }
    };
    
    let telemetry_str = serde_json::to_string(&pitch_points).unwrap_or_default();
    sub.audio_path = audio_path;
    sub.telemetry_json = Some(telemetry_str.clone());

    // 2. Load active LLM URL to query Socratic evaluation
    let active_url = {
        let router = state.router.read().await;
        router.active_url()
    };

    // Default transcript to student's name/struggle if Whisper is offline
    let student_struggle = sub.transcript.clone().unwrap_or_else(|| "Struggling with note transitions.".to_string());
    let lang = payload.language.unwrap_or_else(|| "en".to_string());

    // 3. Trigger dual Pythagoras & Troubadour evaluation
    let socratic = match run_socratic_evaluation(
        &active_url,
        &sub.student_name,
        &sub.exercise_name,
        &student_struggle,
        &telemetry_str,
        &lang,
    ).await {
        Ok(eval) => eval,
        Err(e) => {
            error!("Socratic AI evaluation failed: {:?}", e);
            let is_french = lang == "fr" || lang == "French";
            SocraticEvaluation {
                pythagoras_scorecard: generate_offline_pythagoras_scorecard(&telemetry_str, is_french),
                troubadour_draft: generate_offline_troubadour_draft(&telemetry_str, &sub.student_name, &sub.exercise_name, &student_struggle, is_french),
            }
        }
    };

    sub.pythagoras_scorecard = Some(socratic.pythagoras_scorecard);
    sub.troubadour_draft = Some(socratic.troubadour_draft);
    sub.status = "drafting".to_string();

    // 4. Save to DB
    match state.db.upsert_submission(&sub).await {
        Ok(_) => Json(serde_json::json!({ "success": true, "submission": sub })),
        Err(e) => Json(serde_json::json!({ "success": false, "error": format!("Failed to save to database: {}", e) })),
    }
}

async fn submit_review(
    State(state): State<AppState>,
    Json(payload): Json<SubmitReviewRequest>,
) -> Json<serde_json::Value> {
    let mut sub = match state.db.get_submission_by_id(&payload.id).await {
        Some(s) => s,
        None => return Json(serde_json::json!({ "success": false, "error": "Submission not found" })),
    };

    sub.pythagoras_scorecard = Some(payload.pythagoras_scorecard);
    sub.troubadour_draft = Some(payload.troubadour_draft);
    sub.status = "reviewed".to_string();

    match state.db.upsert_submission(&sub).await {
        Ok(_) => Json(serde_json::json!({ "success": true, "submission": sub })),
        Err(e) => Json(serde_json::json!({ "success": false, "error": e.to_string() })),
    }
}

#[derive(Deserialize)]
struct FlorinTransaction {
    name: String,
    amount: i32,
}

#[derive(Deserialize)]
struct BookGenerationRequest {
    style_target: String,
    book_title: String,
}

async fn earn_student_florins(
    State(state): State<AppState>,
    Json(payload): Json<FlorinTransaction>,
) -> Json<serde_json::Value> {
    match state.db.earn_florins(&payload.name, payload.amount).await {
        Ok(new_total) => Json(serde_json::json!({ "success": true, "florins": new_total })),
        Err(e) => Json(serde_json::json!({ "success": false, "error": e.to_string() })),
    }
}

async fn spend_student_florins(
    State(state): State<AppState>,
    Json(payload): Json<FlorinTransaction>,
) -> Json<serde_json::Value> {
    match state.db.spend_florins(&payload.name, payload.amount).await {
        Ok(new_total) => Json(serde_json::json!({ "success": true, "florins": new_total })),
        Err(e) => Json(serde_json::json!({ "success": false, "error": e.to_string() })),
    }
}

async fn generate_troubadour_book(
    State(state): State<AppState>,
    Json(payload): Json<BookGenerationRequest>,
) -> Json<serde_json::Value> {
    let active_url = {
        let router = state.router.read().await;
        router.active_url()
    };
    
    let target_url = format!("{}/v1/chat/completions", active_url);
    info!("🤖 Generation request to active LLM: {}", target_url);

    let system_prompt = "You are a medieval troubadour bard and master historian. Create a beautiful 3-chapter historical fiction troubadour story in JSON format. The user style is Classical, Flamenco, Acoustic, or Jazz guitar. Respond ONLY with valid raw JSON matching this EXACT structure:
{
  \"title\": \"Name of the Book\",
  \"chapters\": [
    {
      \"number\": 1,
      \"title\": \"Chapter Title\",
      \"setting\": \"Prose describing the location\",
      \"prose\": \"Rich narrative of the troubadour matching the user style target\",
      \"lesson\": \"Vocal practice instructions (e.g. humming an E4 to soothe the vagal nerve)\"
    }
  ]
}
No Markdown wrappers, no backticks, no extra text.";

    let user_prompt = format!(
        "Create a troubadour adventure book titled '{}' themed around the '{}' guitar style target.",
        payload.book_title, payload.style_target
    );

    let request_body = serde_json::json!({
        "model": "local-model",
        "messages": [
            { "role": "system", "content": system_prompt },
            { "role": "user", "content": user_prompt }
        ],
        "temperature": 0.7,
        "response_format": { "type": "json_object" }
    });

    let res = state.http_client
        .post(&target_url)
        .json(&request_body)
        .send()
        .await;

    let generated_json = match res {
        Ok(response) => {
            if let Ok(json) = response.json::<serde_json::Value>().await {
                if let Some(content) = json["choices"][0]["message"]["content"].as_str() {
                    if let Ok(parsed) = serde_json::from_str::<serde_json::Value>(content) {
                        Some(parsed)
                    } else {
                        None
                    }
                } else {
                    None
                }
            } else {
                None
            }
        }
        Err(_) => None,
    };

    let final_book = if let Some(book) = generated_json {
        book
    } else {
        info!("⚠️ LM Studio offline or returned invalid response. Serving premium pre-authored fallback troubadour book.");
        
        let fallback_prose_1 = match payload.style_target.as_str() {
            "Flamenco" => "The scent of cedarwood and orange blossoms fills the air as the fire crackles. Your fingers brush the strings, producing the quick, dry pulse of a Spanish Soleá. Master Bertrand watches in silence, then whispers: 'To control the flame of flamenco, one must first master the breath.'",
            "Classical" => "Beneath the high stone archways of the abbey, the natural reverb swells. You tune your gut strings, letting the slow, polyphonic lines of a Renaissance Pavane float into the rafters. Master Bertrand nods: 'Complexity is born of stillness.'",
            "Jazz" => "In the corner of a dimly lit Occitan tavern, you slide between walking basslines and extended chord structures. The patrons stop clinking their goblets, drawn to the modern swing of the lute. Master Bertrand grins: 'Improvisation is the ultimate freedom, but only for the prepared ear.'",
            _ => "A cool breeze sweeps through the Occitan pine trees. You sit on a granite boulder, playing a soft, resonant melody. The strings sing with the pure acoustic resonance of the hills. Master Bertrand sighs with satisfaction: 'Simplicity is the truest mirror of the soul.'"
        };

        serde_json::json!({
            "title": payload.book_title,
            "chapters": [
                {
                    "number": 1,
                    "title": "The Autumn Gathering",
                    "setting": "A rustic stone tavern in the hills of Languedoc",
                    "prose": fallback_prose_1,
                    "lesson": "Hum a steady, low E2 note for 4 seconds to relax the throat and align with the guitar fundamental."
                },
                {
                    "number": 2,
                    "title": "The Breath in the Chapel",
                    "setting": "The hollow ruins of a 12th-century chapel",
                    "prose": "As the sun sets, you practice the acoustic intervals of a perfect fifth. Bertrand tells you that perfect pitch is not a gift, but an intimate relationship between your vocal cords and the acoustic chamber of your body.",
                    "lesson": "Sing a steady A2 note for 6 seconds on a warm 'Ah' vowel to warm up your chest register."
                },
                {
                    "number": 3,
                    "title": "The Troubadour's Flight",
                    "setting": "A campfire under the starry canopy of the Pyrenees",
                    "prose": "You have found your voice. The chords and melody flow as one. As the final notes of your chanson fade into the mountain night, Bertrand presents you with the ancient seal of the Occitan Troubadours.",
                    "lesson": "Match a clear D3 note for 8 seconds, transitioning smoothly from a closed 'Mmm' hum to an open 'Oh' vowel."
                }
            ]
        })
    };

    Json(serde_json::json!({ "success": true, "book": final_book }))
}

