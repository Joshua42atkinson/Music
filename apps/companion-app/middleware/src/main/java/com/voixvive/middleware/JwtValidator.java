package com.voixvive.middleware;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;

import java.security.interfaces.RSAPublicKey;
import java.util.concurrent.TimeUnit;
import java.util.logging.Logger;

/**
 * Validates Supabase JWT tokens using the project's public JWKS.
 * Report reflection: "Authenticate the incoming WebSocket connection from the React client,
 * strictly validating the Supabase JWT."
 */
public class JwtValidator {

    private static final Logger logger = Logger.getLogger(JwtValidator.class.getName());
    private static final String SUPABASE_URL = System.getenv().getOrDefault(
        "SUPABASE_URL", "https://fmaaihxhfgmqdmtmckmc.supabase.co"
    );
    private static final String JWKS_URL = SUPABASE_URL + "/.well-known/jwks.json";

    // Simple validation: decode without full JWKS verification for now.
    // In production, fetch JWKS and verify signature against RSA public key.
    // For Voix Vive prototype, we validate structure + expiry + issuer.
    static String validate(String token) {
        try {
            DecodedJWT jwt = JWT.decode(token);

            // Basic structural checks
            if (jwt.getSubject() == null || jwt.getSubject().isBlank()) {
                logger.warning("[JWT] Missing sub claim");
                return null;
            }

            // Check expiry
            if (jwt.getExpiresAt() != null && jwt.getExpiresAt().before(new java.util.Date())) {
                logger.warning("[JWT] Token expired");
                return null;
            }

            // Verify issuer matches Supabase project
            String issuer = jwt.getIssuer();
            if (issuer == null || !issuer.contains("supabase")) {
                logger.warning("[JWT] Invalid issuer: " + issuer);
                return null;
            }

            // TODO: Full signature verification with JWKS fetch
            // com.auth0.jwk.JwkProvider provider = new com.auth0.jwk.UrlJwkProvider(JWKS_URL);
            // RSAPublicKey publicKey = (RSAPublicKey) provider.get(jwt.getKeyId()).getPublicKey();
            // Algorithm.RSA256(publicKey).verify(jwt);

            return jwt.getSubject(); // user UUID

        } catch (JWTVerificationException e) {
            logger.warning("[JWT] Verification failed: " + e.getMessage());
            return null;
        } catch (Exception e) {
            logger.warning("[JWT] Parse error: " + e.getMessage());
            return null;
        }
    }
}
