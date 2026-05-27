package com.voixvive.middleware;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.logging.Logger;

/**
 * Parses StepAudio 2.5 server events for paralinguistic metadata.
 * When emotion is detected (frustration, fatigue, etc.), writes to Supabase
 * and optionally triggers pedagogical routing.
 *
 * Report reflection:
 * "StepAudio 2.5 possesses profound paralinguistic comprehension capabilities.
 * The Java middleware can be programmed to actively parse JSON-based server events."
 *
 * Emotions mapped to Voix Vive pedagogy:
 *   frustration  → Suggest easier fret, FHEAL free play, or rest
 *   fatigue      → Pause → redirect to Breathing Gate or Journal
 *   hesitation   → Offer simpler exercise, reduce cognitive load
 *   confidence   → Unlock next fret, offer challenge
 *   excitement   → Celebrate, reinforce, deepen engagement
 *   calm         → Maintain current activity, gentle encouragement
 */
public class ParalinguisticInterceptor {

    private static final Logger logger = Logger.getLogger(ParalinguisticInterceptor.class.getName());
    private static final ObjectMapper MAPPER = new ObjectMapper();
    private final SupabaseTelemetry telemetry;
    private int sessionSeconds = 0;

    ParalinguisticInterceptor(SupabaseTelemetry telemetry) {
        this.telemetry = telemetry;
    }

    void inspect(String json) {
        try {
            JsonNode root = MAPPER.readTree(json);
            String type = root.path("type").asText();

            // StepAudio server events that may contain paralinguistic data
            switch (type) {
                case "response.audio_transcript.done":
                case "conversation.item.input_audio_transcription.completed":
                    // Transcript events may have emotional annotations in future
                    break;

                case "response.done":
                    // End of AI turn — could include turn summary with emotion tags
                    JsonNode output = root.path("response").path("output");
                    if (output.isArray()) {
                        for (JsonNode item : output) {
                            parseEmotionNode(item);
                        }
                    }
                    break;

                case "session.updated":
                    // Session config ack
                    break;

                case "error":
                    logger.warning("[Paralinguistic] StepAudio error: " + root.path("error").path("message").asText());
                    break;

                default:
                    // StepAudio 2.5 may emit custom paralinguistic events
                    if (type.contains("paralinguistic") || type.contains("emotion")) {
                        parseEmotionNode(root);
                    }
            }
        } catch (Exception e) {
            // Not JSON or unknown format — ignore
            logger.fine("[Paralinguistic] Non-JSON or unparseable: " + e.getMessage());
        }
    }

    private void parseEmotionNode(JsonNode node) {
        JsonNode emotionNode = node.path("emotion");
        if (emotionNode.isMissingNode()) emotionNode = node.path("paralinguistic");
        if (emotionNode.isMissingNode()) return;

        String emotion = emotionNode.path("type").asText("unknown");
        double confidence = emotionNode.path("confidence").asDouble(0.0);
        int offset = emotionNode.path("timestamp_offset").asInt(sessionSeconds);

        boolean shouldIntervene = shouldIntervene(emotion, confidence);

        logger.info(String.format(
            "[Paralinguistic] Detected %s (%.2f) at %ds — intervention=%s",
            emotion, confidence, offset, shouldIntervene
        ));

        telemetry.writeParalinguistic(emotion, confidence, offset, shouldIntervene);

        if (shouldIntervene) {
            logger.info("[Pedagogical] Triggering fallback for: " + emotion);
            // Future: emit control event back to browser to route student
        }
    }

    private boolean shouldIntervene(String emotion, double confidence) {
        return switch (emotion.toLowerCase()) {
            case "frustration" -> confidence > 0.6;
            case "fatigue" -> confidence > 0.5;
            case "hesitation" -> confidence > 0.7;
            default -> false;
        };
    }

    void tick(int seconds) {
        this.sessionSeconds = seconds;
    }
}
