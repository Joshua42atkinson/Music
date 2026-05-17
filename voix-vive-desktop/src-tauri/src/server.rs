use axum::{
    routing::{get, post},
    Router,
    Json,
    extract::State,
};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::sync::Arc;

#[derive(Clone)]
struct AppState {
    http_client: Client,
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

pub async fn start_server() {
    let state = AppState {
        http_client: Client::new(),
    };

    let app = Router::new()
        .route("/api/health", get(health_check))
        .route("/api/lmstudio/chat", post(proxy_to_lmstudio))
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();
    println!("DaaS Axum Server running on 0.0.0.0:8080");
    axum::serve(listener, app).await.unwrap();
}

async fn health_check() -> &'static str {
    "Voix Vive DaaS Server is running!"
}

async fn proxy_to_lmstudio(
    State(state): State<AppState>,
    Json(payload): Json<LMStudioRequest>,
) -> Json<serde_json::Value> {
    // Forward the request to the local LM Studio instance running on 1234
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
