mod db;
mod inference;
mod server;
mod ffmpeg;
mod socratic_judge;

use std::sync::Arc;
use tokio::sync::RwLock;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|_app| {
            // Spawn the Axum DaaS server in the background
            tauri::async_runtime::spawn(async {
                // Initialize SQLite Local-First DB
                let db = Arc::new(db::Database::init().await);
                
                // Initialize LLM Inference Router
                let mut inference_router = inference::InferenceRouter::new();
                
                // Run auto-detection of local AI instances (LM Studio / Ollama)
                inference_router.auto_detect().await;
                
                let router = Arc::new(RwLock::new(inference_router));
                
                // Start DaaS Server with db and router context
                server::start_server(db, router).await;
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
