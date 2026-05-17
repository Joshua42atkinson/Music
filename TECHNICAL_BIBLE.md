# Voix Vive: Technical Bible & Architecture

## The Desktop-as-a-Server (DaaS) Paradigm
Voix Vive has abandoned traditional centralized cloud infrastructure (e.g., Supabase, AWS, Firebase). Instead, it operates on a "WhatsApp-style" peer-to-peer/client-server relationship where the Instructor's personal computer acts as the master node for the entire ecosystem.

### Why DaaS?
1. **Data Sovereignty & Privacy:** All student data, direct messages, and video homework submissions reside entirely on the Instructor's local hard drive.
2. **Zero Cloud Storage Fees:** Bypassing expensive cloud buckets for large video files.
3. **Local AI Automation:** Direct, zero-latency access to offline Large Language Models (LLMs) running on the Instructor's GPU via LM Studio.

---

## 1. The Technology Stack

### 1.1 The Frontend (Student Web App)
- **Repository Location:** `/daydream-website/bertrand-masterclass`
- **Framework:** React + Vite
- **Deployment:** Vercel (Static Hosting)
- **Role:** The public-facing "Living Textbook" and Mentorship Dashboard for students. Connects to the Instructor's DaaS backend via WebSockets/REST over a secure tunnel.

### 1.2 The Backend (Instructor Hub / Desktop App)
- **Repository Location:** `/daydream-website/voix-vive-desktop`
- **Framework:** Tauri + Rust (Tokio) + React
- **Role:** A desktop application running on Bertrand's machine. 
  - The React UI acts as the Instructor CRM (viewing students, reviewing videos).
  - The Rust core spawns the actual backend web server.

### 1.3 The Core Server (Rust + Axum)
- When the Tauri app launches, it uses `tauri::async_runtime::spawn` to boot an asynchronous `axum` web server on `0.0.0.0:8080`.
- **Database:** Local SQLite database (via `sqlx` or `rusqlite`) stored in the Tauri app data directory.

---

## 2. Networking & Communication

### The Tunnel (Bypassing NAT/Firewalls)
Because the Rust backend runs locally on the Instructor's PC (e.g., `192.168.x.x`), students on the public internet cannot reach it directly.
- **Solution:** A secure tunnel (e.g., Cloudflare Tunnels `cloudflared` or `ngrok`).
- When the Tauri app boots, the Rust server initializes and the tunnel daemon exposes `localhost:8080` to a public URL (e.g., `https://api.voix-vive.com`).
- The Vercel frontend is configured to send all API requests to this tunnel URL.

### Video Homework Submissions
1. Student records a video in the browser via the Mentorship Hub UI.
2. Video is chunked and streamed directly to the Axum server via the secure tunnel.
3. Rust writes the video chunks directly to Bertrand's local file system.

---

## 3. Local AI Automation (LM Studio)
A core feature of the DaaS architecture is the ability to leverage AI for grading and Socratic dialogues without paying for OpenAI API calls.

### The Pipeline
1. Instructor runs **LM Studio** locally, starting the Local Inference Server on port `1234`.
2. A student submits a text reflection or asks a theory question on the web app.
3. The request hits the Rust Axum server via the tunnel.
4. The Axum server has a dedicated proxy endpoint (`/api/lmstudio/chat`).
5. Rust uses `reqwest` to send the payload to `http://localhost:1234/v1/chat/completions`.
6. The local LLM processes the request, and Rust streams the response back through the tunnel to the student's browser.

```rust
// The core Axum proxy logic for LM Studio
let res = state.http_client
    .post("http://localhost:1234/v1/chat/completions")
    .json(&payload)
    .send()
    .await;
```

---

## 4. Maintenance & Deployment Rules
1. **Frontend Updates:** Push changes in `daydream-website/bertrand-masterclass` to GitHub. Vercel automatically redeploys.
2. **Backend/Tauri Updates:** Modifications to `voix-vive-desktop` require a new Tauri build (`npm run tauri build`), which generates a new binary/installer for the Instructor to run on their machine.
