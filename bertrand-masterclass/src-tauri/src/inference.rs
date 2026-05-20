use serde::{Deserialize, Serialize};
use tracing::{info, warn};
use reqwest::Client;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum BackendKind {
    LmStudio,
    Ollama,
    LlamaServer,
    Custom,
}

impl BackendKind {
    pub fn default_url(&self) -> &'static str {
        match self {
            BackendKind::LmStudio => "http://127.0.0.1:1234",
            BackendKind::Ollama => "http://127.0.0.1:11434",
            BackendKind::LlamaServer => "http://127.0.0.1:8081", // 8080 is DaaS, use 8081
            BackendKind::Custom => "http://127.0.0.1:1234",
        }
    }

    pub fn display_name(&self) -> &'static str {
        match self {
            BackendKind::LmStudio => "LM Studio",
            BackendKind::Ollama => "Ollama",
            BackendKind::LlamaServer => "llama-server",
            BackendKind::Custom => "Custom",
        }
    }

    pub fn health_path(&self) -> &'static str {
        match self {
            BackendKind::Ollama => "/api/tags",
            BackendKind::LmStudio => "/v1/models",
            _ => "/health",
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InferenceBackend {
    pub name: String,
    pub kind: BackendKind,
    pub base_url: String,
    pub healthy: bool,
    pub active: bool,
}

pub struct InferenceRouter {
    pub backends: Vec<InferenceBackend>,
    pub active_idx: usize,
    client: Client,
}

impl InferenceRouter {
    pub fn new() -> Self {
        let backends = vec![
            InferenceBackend {
                name: "lm-studio".to_string(),
                kind: BackendKind::LmStudio,
                base_url: BackendKind::LmStudio.default_url().to_string(),
                healthy: false,
                active: true,
            },
            InferenceBackend {
                name: "ollama".to_string(),
                kind: BackendKind::Ollama,
                base_url: BackendKind::Ollama.default_url().to_string(),
                healthy: false,
                active: false,
            },
            InferenceBackend {
                name: "llama-server".to_string(),
                kind: BackendKind::LlamaServer,
                base_url: BackendKind::LlamaServer.default_url().to_string(),
                healthy: false,
                active: false,
            },
        ];

        Self {
            backends,
            active_idx: 0,
            client: Client::new(),
        }
    }

    pub async fn auto_detect(&mut self) {
        info!("🔍 Probing local LLM backends...");
        let mut first_healthy_idx = None;

        for (idx, backend) in self.backends.iter_mut().enumerate() {
            let health_url = format!("{}{}", backend.base_url, backend.kind.health_path());
            
            backend.healthy = match self.client.get(&health_url).send().await {
                Ok(resp) => resp.status().is_success(),
                Err(_) => false,
            };

            if backend.healthy {
                info!("  ✅ {} detected at {}", backend.kind.display_name(), backend.base_url);
                if first_healthy_idx.is_none() {
                    first_healthy_idx = Some(idx);
                }
            } else {
                info!("  ⬚  {} at {} - unreachable", backend.kind.display_name(), backend.base_url);
            }
        }

        // Auto-switch to first healthy backend if our current active one is unhealthy
        if !self.backends[self.active_idx].healthy {
            if let Some(healthy_idx) = first_healthy_idx {
                info!("🔄 Switching active backend to healthy: {}", self.backends[healthy_idx].name);
                self.backends[self.active_idx].active = false;
                self.active_idx = healthy_idx;
                self.backends[self.active_idx].active = true;
            } else {
                warn!("⚠️ No healthy local LLM backends detected. Make sure LM Studio or Ollama is running!");
            }
        }
    }

    pub fn active_url(&self) -> String {
        self.backends[self.active_idx].base_url.clone()
    }

    pub fn active_backend(&self) -> InferenceBackend {
        self.backends[self.active_idx].clone()
    }

    pub fn set_active_by_name(&mut self, name: &str) -> bool {
        if let Some(idx) = self.backends.iter().position(|b| b.name == name) {
            self.backends[self.active_idx].active = false;
            self.active_idx = idx;
            self.backends[self.active_idx].active = true;
            true
        } else {
            false
        }
    }

    pub fn get_status(&self) -> Vec<InferenceBackend> {
        self.backends.clone()
    }
}
