package com.voixvive.middleware;

import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;
import java.nio.ByteBuffer;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;

/**
 * Inbound WebSocket endpoint from the React frontend.
 * One instance per browser tab.
 *
 * Report reflection:
 * - authenticateSession() validates Supabase JWT before allowing data flow
 * - onBinaryMessage() forwards mic audio → StepFun (100ms chunks)
 * - onTextMessage() forwards JSON control events → StepFun
 * - Each client gets a paired StepAudioClient outbound connection
 */
@ServerEndpoint("/ws/troubadour")
public class TroubadourClientEndpoint {

    private static final Logger logger = Logger.getLogger(TroubadourClientEndpoint.class.getName());

    // Map: browser session → paired StepFun client
    private static final Map<String, SessionPair> pairs = new ConcurrentHashMap<>();

    @OnOpen
    public void onOpen(Session session) {
        logger.info("[Client] Opened: " + session.getId());
        // Auth deferred until first text message (client sends JWT in auth event)
    }

    @OnMessage
    public void onTextMessage(String message, Session session) {
        SessionPair pair = pairs.get(session.getId());

        // First message might be auth
        if (pair == null) {
            if (handleAuth(message, session)) return;
            // Not auth and not authenticated → close
            closeQuietly(session);
            return;
        }

        // Forward JSON control events to StepFun
        pair.stepAudio.sendText(message);
    }

    @OnMessage
    public void onBinaryMessage(ByteBuffer audioData, Session session) {
        SessionPair pair = pairs.get(session.getId());
        if (pair == null) {
            logger.warning("[Client] Binary from unauthenticated session: " + session.getId());
            return;
        }
        // Forward mic audio → StepFun
        pair.stepAudio.sendBinary(audioData);
    }

    @OnClose
    public void onClose(Session session) {
        logger.info("[Client] Closed: " + session.getId());
        SessionPair pair = pairs.remove(session.getId());
        if (pair != null) {
            pair.stepAudio.disconnect();
            pair.telemetry.flushSession(pair.userId);
        }
    }

    @OnError
    public void onError(Session session, Throwable err) {
        logger.severe("[Client] Error on " + session.getId() + ": " + err.getMessage());
    }

    // ── Auth handling ──

    private boolean handleAuth(String message, Session session) {
        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            com.fasterxml.jackson.databind.JsonNode node = mapper.readTree(message);
            if (!"auth".equals(node.get("type").asText())) return false;

            String token = node.get("token").asText();
            String userId = JwtValidator.validate(token);

            if (userId == null) {
                logger.warning("[Auth] Invalid JWT from " + session.getId());
                closeQuietly(session);
                return true;
            }

            logger.info("[Auth] Success for user: " + userId);

            // Spawn outbound StepFun connection paired to this browser session
            SupabaseTelemetry telemetry = new SupabaseTelemetry(userId);
            StepAudioClient stepAudio = new StepAudioClient(session, telemetry);
            stepAudio.connect();

            pairs.put(session.getId(), new SessionPair(session, stepAudio, telemetry, userId));

            // Acknowledge auth success to browser
            session.getAsyncRemote().sendText("{\"type\":\"auth.success\"}");
            return true;

        } catch (Exception e) {
            logger.warning("[Auth] Parse error: " + e.getMessage());
            return false;
        }
    }

    // Called by StepAudioClient to relay audio/text back to browser
    static void relayToBrowser(String browserSessionId, String text) {
        SessionPair pair = pairs.get(browserSessionId);
        if (pair != null && pair.browser.isOpen()) {
            pair.browser.getAsyncRemote().sendText(text);
        }
    }

    static void relayToBrowser(String browserSessionId, ByteBuffer binary) {
        SessionPair pair = pairs.get(browserSessionId);
        if (pair != null && pair.browser.isOpen()) {
            pair.browser.getAsyncRemote().sendBinary(binary);
        }
    }

    private void closeQuietly(Session session) {
        try { session.close(); } catch (Exception ignored) {}
    }

    // ── Internal pair struct ──
    static class SessionPair {
        final Session browser;
        final StepAudioClient stepAudio;
        final SupabaseTelemetry telemetry;
        final String userId;

        SessionPair(Session browser, StepAudioClient stepAudio, SupabaseTelemetry telemetry, String userId) {
            this.browser = browser;
            this.stepAudio = stepAudio;
            this.telemetry = telemetry;
            this.userId = userId;
        }
    }
}
