package com.voixvive.middleware;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Instant;
import java.util.UUID;
import java.util.logging.Logger;

/**
 * Writes audio session + paralinguistic telemetry to Supabase REST API.
 * Uses SERVICE_ROLE_KEY (bypasses RLS) — never exposed to browser.
 *
 * Report reflection: "The Java middleware should asynchronously write session
 * summaries and paralinguistic metadata directly to Supabase via its REST API."
 */
public class SupabaseTelemetry {

    private static final Logger logger = Logger.getLogger(SupabaseTelemetry.class.getName());
    private static final String SUPABASE_URL = System.getenv().getOrDefault(
        "SUPABASE_URL", "https://fmaaihxhfgmqdmtmckmc.supabase.co"
    );
    private static final String SERVICE_KEY = System.getenv("SUPABASE_SERVICE_ROLE_KEY");
    private static final HttpClient HTTP = HttpClient.newHttpClient();
    private static final ObjectMapper MAPPER = new ObjectMapper();

    private final String userId;
    private UUID sessionId;
    private Instant startTime;

    SupabaseTelemetry(String userId) {
        this.userId = userId;
    }

    void startSession() {
        this.sessionId = UUID.randomUUID();
        this.startTime = Instant.now();

        if (SERVICE_KEY == null) {
            logger.warning("[Telemetry] SUPABASE_SERVICE_ROLE_KEY not set — skipping writes");
            return;
        }

        // Fire-and-forget: write session start
        asyncPost("/rest/v1/troubadour_audio_sessions", new java.util.HashMap<String, Object>() {{
            put("id", sessionId.toString());
            put("user_id", userId);
            put("start_time", startTime.toString());
            put("persona_used", "troubadour");
        }});
    }

    void endSession() {
        if (sessionId == null || SERVICE_KEY == null) return;

        long duration = java.time.Duration.between(startTime, Instant.now()).getSeconds();
        asyncPatch("/rest/v1/troubadour_audio_sessions?id=eq." + sessionId, new java.util.HashMap<String, Object>() {{
            put("duration_seconds", (int) duration);
        }});
    }

    void flushSession(String uid) {
        // Called on disconnect to ensure session is closed
        endSession();
    }

    void writeParalinguistic(String emotion, double confidence, int timestampOffset, boolean intervention) {
        if (sessionId == null || SERVICE_KEY == null) return;

        asyncPost("/rest/v1/paralinguistic_events", new java.util.HashMap<String, Object>() {{
            put("session_id", sessionId.toString());
            put("timestamp_offset", timestampOffset);
            put("detected_emotion", emotion);
            put("confidence_score", confidence);
            put("intervention_triggered", intervention);
        }});
    }

    // ── HTTP helpers ──

    private void asyncPost(String path, java.util.Map<String, Object> body) {
        try {
            String json = MAPPER.writeValueAsString(body);
            HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(SUPABASE_URL + path))
                .header("apikey", SERVICE_KEY)
                .header("Authorization", "Bearer " + SERVICE_KEY)
                .header("Content-Type", "application/json")
                .header("Prefer", "return=minimal")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();

            HTTP.sendAsync(req, HttpResponse.BodyHandlers.discarding())
                .thenAccept(resp -> {
                    if (resp.statusCode() >= 400) {
                        logger.warning("[Telemetry] POST " + path + " failed: " + resp.statusCode());
                    }
                })
                .exceptionally(ex -> {
                    logger.warning("[Telemetry] POST error: " + ex.getMessage());
                    return null;
                });
        } catch (Exception e) {
            logger.warning("[Telemetry] Serialize error: " + e.getMessage());
        }
    }

    private void asyncPatch(String path, java.util.Map<String, Object> body) {
        try {
            String json = MAPPER.writeValueAsString(body);
            HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(SUPABASE_URL + path))
                .header("apikey", SERVICE_KEY)
                .header("Authorization", "Bearer " + SERVICE_KEY)
                .header("Content-Type", "application/json")
                .method("PATCH", HttpRequest.BodyPublishers.ofString(json))
                .build();

            HTTP.sendAsync(req, HttpResponse.BodyHandlers.discarding())
                .thenAccept(resp -> {
                    if (resp.statusCode() >= 400) {
                        logger.warning("[Telemetry] PATCH " + path + " failed: " + resp.statusCode());
                    }
                })
                .exceptionally(ex -> {
                    logger.warning("[Telemetry] PATCH error: " + ex.getMessage());
                    return null;
                });
        } catch (Exception e) {
            logger.warning("[Telemetry] Serialize error: " + e.getMessage());
        }
    }
}
