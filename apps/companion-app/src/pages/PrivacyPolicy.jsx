import React from 'react';
import { useNavigate } from 'react-router-dom';

// ═══════════════════════════════════════════════════════════
// PRIVACY POLICY — Required before launch
// Discloses microphone access, localStorage, IndexedDB,
// and payment processing. Written in plain English.
// ═══════════════════════════════════════════════════════════

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="legal-page">
      <style>{`
        .legal-page {
          min-height: 100vh;
          background: #0a0a0f;
          color: #c8c8d0;
          font-family: 'Inter', sans-serif;
          padding: max(24px, env(safe-area-inset-top)) 20px 80px;
        }
        .legal-container {
          max-width: 640px;
          margin: 0 auto;
        }
        .legal-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: var(--cf-gold);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          margin-bottom: 32px;
          background: none;
          border: none;
          padding: 8px 0;
          margin-left: 52px;
        }
        .legal-back:hover { opacity: 0.7; }
        .legal-page h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 6vw, 2.4rem);
          font-weight: 400;
          color: #f0e6d2;
          margin: 0 0 8px;
        }
        .legal-updated {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          color: #5a6a7a;
          letter-spacing: 0.06em;
          margin-bottom: 32px;
        }
        .legal-page h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem;
          font-weight: 400;
          color: var(--cf-gold);
          margin: 32px 0 12px;
        }
        .legal-page p, .legal-page li {
          font-family: 'EB Garamond', serif;
          font-size: 1rem;
          line-height: 1.75;
          color: #a0a8b8;
          margin: 0 0 12px;
        }
        .legal-page ul {
          padding-left: 20px;
          margin: 0 0 16px;
        }
        .legal-page li { margin-bottom: 6px; }
        .legal-highlight {
          background: rgba(var(--cf-gold-rgb),0.08);
          border-left: 3px solid rgba(var(--cf-gold-rgb),0.3);
          padding: 12px 16px;
          border-radius: 0 8px 8px 0;
          margin: 16px 0;
        }
        .legal-highlight p { margin: 0; color: #c8c0b0; }
      `}</style>

      <div className="legal-container">
        <button className="legal-back" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h1>Privacy Policy</h1>
        <p className="legal-updated">Last updated: May 29, 2026</p>

        <p>
          Voix Vive is a guitar learning platform created by Joshua Atkinson for
          Bertrand Laurence Guitar Studio. We believe your practice is private.
          This policy explains what data we access, what stays on your device,
          and what is synced securely to the cloud.
        </p>

        <div className="legal-highlight">
          <p><strong>The short version:</strong> Core practice happens on your device. If you create an account, we securely sync your progress using Supabase so you can resume on any device. We don't track you for ads, we don't sell your data, and we don't use third-party marketing cookies.</p>
        </div>

        <h2>1. What We Access</h2>

        <p><strong>Microphone (Optional)</strong></p>
        <ul>
          <li>Several tools (PLING! Trainer, Microtonal Tracker, Vertiscale Engine Phase 2) request access to your device's microphone.</li>
          <li>Audio is processed <em>entirely in your browser</em> using the Web Audio API. It is used for real-time pitch detection only.</li>
          <li>Audio is <strong>never recorded, transmitted, or stored on any server</strong>.</li>
          <li>You can use the entire platform without a microphone — Flash, Imagine, and Reflect modes work without one.</li>
        </ul>

        <p><strong>Camera (Optional)</strong></p>
        <ul>
          <li>The Practice Recorder tool allows you to record video of your practice sessions.</li>
          <li>Recordings are stored <strong>locally on your device</strong> in your browser's IndexedDB database.</li>
          <li>Recordings are never automatically uploaded. If and when the async review feature launches, you will explicitly choose to submit a recording.</li>
        </ul>

        <h2>2. Data Storage & Accounts</h2>
        <p><strong>Anonymous Users (Offline Mode)</strong></p>
        <ul>
          <li><strong>localStorage:</strong> Practice progress, Bard Level, scaffolding state, ambient player preferences, and game session scores persist on your device.</li>
          <li><strong>IndexedDB:</strong> Practice recordings, session journals, and submission history are stored locally.</li>
        </ul>
        <p><strong>Registered Users (Cloud Sync)</strong></p>
        <ul>
          <li><strong>Google OAuth:</strong> If you sign in with Google, we receive your basic profile information (email address and name) to create your account. We do not access your Google data beyond the basic authentication profile.</li>
          <li><strong>Supabase:</strong> Your practice progress and traction data are securely synced to our Supabase database. This allows you to pick up where you left off on any device. Your video recordings currently remain entirely local.</li>
        </ul>

        <p>To delete all locally stored data, clear your browser's site data for this domain. To request account deletion, please contact us.</p>

        <h2>3. What We Do NOT Collect</h2>
        <ul>
          <li>We do not use cookies.</li>
          <li>We do not use analytics trackers (no Google Analytics, no Mixpanel, no tracking pixels).</li>
          <li>We do not collect your name, email, or personal information unless you voluntarily provide it (e.g., when contacting Bertrand for lessons).</li>
          <li>We do not serve advertisements.</li>
          <li>We do not sell, share, or transfer any data to third parties.</li>
        </ul>

        <h2>4. Payments</h2>
        <p>
          When payment processing is active, payments are handled by Stripe, Inc. 
          Stripe collects payment information directly — we never see or store your 
          credit card number. Stripe's privacy policy applies to payment transactions: 
          <a href="https://stripe.com/privacy" className="text-cf-gold" target="_blank" rel="noopener noreferrer">stripe.com/privacy</a>.
        </p>
        <p>
          Alternative payment methods (Venmo, PayPal, Zelle, Cash App) are handled 
          directly between you and Bertrand through those platforms' own privacy policies.
        </p>

        <h2>5. Children</h2>
        <p>
          Voix Vive is designed primarily for adult learners (ages 30–65). We do not 
          knowingly collect personal information from children under 13. If you believe 
          a child under 13 has provided us with personal information, please contact us 
          so we can take appropriate action.
        </p>

        <h2>6. Open Source</h2>
        <p>
          The licensing terms for the Voix Vive platform are to be determined by 
          Bertrand Laurence. The platform was developed by Joshua Atkinson as a 
          gift for Bertrand Laurence Guitar Studio.
        </p>

        <h2>7. Changes to This Policy</h2>
        <p>
          If we make material changes to this policy, we will update the "Last updated" 
          date at the top. Continued use of the platform after changes constitutes 
          acceptance of the updated policy.
        </p>

        <h2>8. Contact</h2>
        <p>
          For privacy questions or data deletion requests:
        </p>
        <ul>
          <li><strong>Bertrand Laurence Guitar Studio:</strong> BertLarryMusic@gmail.com</li>
          <li><strong>Platform Developer:</strong> Joshua Atkinson — LDTAtkinson.com</li>
        </ul>
      </div>
    </div>
  );
}
