package com.voixvive.middleware;

import okhttp3.*;
import okio.ByteString;

import java.nio.ByteBuffer;
import java.util.concurrent.TimeUnit;
import java.util.logging.Logger;

/**
 * Outbound WebSocket client to StepFun StepAudio 2.5 Realtime API.
 * Each browser session gets one of these.
 *
 * Report reflection:
 * - STEP_API_KEY loaded from env var only (never in frontend)
 * - wss://api.stepfun.com/v1/realtime endpoint
 * - Bearer token in Authorization header
 * - Binary audio + JSON text mixed protocol
 * - getAsyncRemote() equivalent via OkHttp async WebSocket
 */
public class StepAudioClient {

    private static final Logger logger = Logger.getLogger(StepAudioClient.class.getName());
    private static final String STEP_API_URL = "wss://api.stepfun.com/v1/realtime";
    private static final String STEP_API_KEY = System.getenv("STEP_API_KEY");

    private final String browserSessionId;
    private final jakarta.websocket.Session browserSession;
    private final SupabaseTelemetry telemetry;
    private final ParalinguisticInterceptor interceptor;
    private WebSocket stepSocket;
    private okhttp3.OkHttpClient httpClient;

    StepAudioClient(jakarta.websocket.Session browserSession, SupabaseTelemetry telemetry) {
        this.browserSession = browserSession;
        this.browserSessionId = browserSession.getId();
        this.telemetry = telemetry;
        this.interceptor = new ParalinguisticInterceptor(telemetry);
    }

    void connect() {
        if (STEP_API_KEY == null || STEP_API_KEY.isBlank()) {
            logger.severe("[StepAudio] STEP_API_KEY not set in environment");
            sendToBrowser("{\"type\":\"error\",\"message\":\"Server misconfigured: missing API key\"}");
            return;
        }

        httpClient = new okhttp3.OkHttpClient.Builder()
                .connectTimeout(10, TimeUnit.SECONDS)
                .readTimeout(30, TimeUnit.SECONDS)
                .pingInterval(15, TimeUnit.SECONDS)
                .build();

        Request request = new Request.Builder()
                .url(STEP_API_URL)
                .header("Authorization", "Bearer " + STEP_API_KEY)
                .header("OpenAI-Beta", "realtime=v1")
                .build();

        stepSocket = httpClient.newWebSocket(request, new StepAudioListener());
        logger.info("[StepAudio] Connecting to StepFun for session: " + browserSessionId);
    }

    void sendText(String text) {
        if (stepSocket != null) {
            stepSocket.send(text);
            logger.fine("[StepAudio] → " + text.substring(0, Math.min(120, text.length())) + "…");
        }
    }

    void sendBinary(ByteBuffer data) {
        if (stepSocket != null) {
            byte[] bytes = new byte[data.remaining()];
            data.get(bytes);
            stepSocket.send(ByteString.of(bytes));
        }
    }

    void disconnect() {
        if (stepSocket != null) {
            stepSocket.close(1000, "Client disconnected");
            stepSocket = null;
        }
        if (httpClient != null) {
            httpClient.dispatcher().executorService().shutdown();
            httpClient.connectionPool().evictAll();
        }
    }

    private void sendToBrowser(String text) {
        TroubadourClientEndpoint.relayToBrowser(browserSessionId, text);
    }

    private void sendToBrowser(ByteBuffer binary) {
        TroubadourClientEndpoint.relayToBrowser(browserSessionId, binary);
    }

    // ── StepFun listener ──
    private class StepAudioListener extends WebSocketListener {
        @Override
        public void onOpen(WebSocket webSocket, Response response) {
            logger.info("[StepAudio] Connected for session: " + browserSessionId);
            telemetry.startSession();
        }

        @Override
        public void onMessage(WebSocket webSocket, String text) {
            // JSON event from StepFun → parse, intercept paralinguistic, forward to browser
            interceptor.inspect(text);
            sendToBrowser(text);
        }

        @Override
        public void onMessage(WebSocket webSocket, ByteString bytes) {
            // Binary audio from StepFun → forward to browser for playback
            sendToBrowser(ByteBuffer.wrap(bytes.toByteArray()));
        }

        @Override
        public void onClosing(WebSocket webSocket, int code, String reason) {
            logger.info("[StepAudio] Closing: " + code + " " + reason);
        }

        @Override
        public void onClosed(WebSocket webSocket, int code, String reason) {
            logger.info("[StepAudio] Closed: " + code + " " + reason);
            telemetry.endSession();
        }

        @Override
        public void onFailure(WebSocket webSocket, Throwable t, Response response) {
            logger.severe("[StepAudio] Failure: " + t.getMessage());
            sendToBrowser("{\"type\":\"error\",\"message\":\"StepAudio connection failed: " + t.getMessage().replace("\"", "'") + "\"}");
        }
    }
}
