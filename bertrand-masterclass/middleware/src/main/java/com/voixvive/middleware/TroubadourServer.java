package com.voixvive.middleware;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.ee10.servlet.ServletContextHandler;
import org.eclipse.jetty.ee10.websocket.jakarta.server.config.JakartaWebSocketServletContainerInitializer;

/**
 * Embedded Jetty server exposing the Troubadour WebSocket endpoint.
 * Port: 8081 (configurable via PORT env var)
 *
 * Learnings from StepAudio 2.5 report reflected here:
 * - Never expose STEP_API_KEY to browser → Java holds it in env var only
 * - Dual WebSocket: browser → this server → StepFun cloud
 * - JWT validation on every inbound connection (Supabase auth)
 * - Binary + JSON mixed protocol for audio + control events
 */
public class TroubadourServer {

    public static void main(String[] args) throws Exception {
        int port = Integer.parseInt(System.getenv().getOrDefault("PORT", "8081"));

        Server server = new Server(port);

        ServletContextHandler context = new ServletContextHandler(ServletContextHandler.SESSIONS);
        context.setContextPath("/");
        server.setHandler(context);

        // Initialize Jakarta WebSocket container and register our endpoint
        JakartaWebSocketServletContainerInitializer.configure(context, (servletContext, container) ->
            container.addEndpoint(TroubadourClientEndpoint.class)
        );

        server.start();
        System.out.println("[TroubadourServer] WebSocket ready on ws://localhost:" + port + "/ws/troubadour");
        System.out.println("[TroubadourServer] Waiting for StepAudio 2.5 connections…");
        server.join();
    }
}
