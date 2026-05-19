import React from 'react';
import { useNavigate } from 'react-router-dom';

// ═══════════════════════════════════════════════════════════
// TERMS OF SERVICE — Required before launch
// Covers service descriptions, payments, cancellation,
// content ownership, and liability.
// ═══════════════════════════════════════════════════════════

export default function TermsOfService() {
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
          color: #c9a96e;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          margin-bottom: 32px;
          background: none;
          border: none;
          padding: 8px 0;
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
          color: #c9a96e;
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
          background: rgba(201,169,110,0.08);
          border-left: 3px solid rgba(201,169,110,0.3);
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

        <h1>Terms of Service</h1>
        <p className="legal-updated">Last updated: May 19, 2026</p>

        <p>
          Welcome to Voix Vive, a guitar learning platform operated by Bertrand 
          Laurence Guitar Studio. By using this platform, you agree to these terms.
        </p>

        <h2>1. The Platform</h2>
        <p>
          Voix Vive provides a free, 12-chapter guitar curriculum (the "Living 
          Textbook"), interactive practice tools, and a fretboard memory game 
          (the "Vertiscale Engine"). These features are available without 
          registration, login, or payment.
        </p>

        <h2>2. Paid Services</h2>
        <p>Bertrand Laurence offers the following paid services through this platform:</p>
        <ul>
          <li><strong>Private Guitar Lessons</strong> — Live 1-on-1 instruction via Zoom or in-studio</li>
          <li><strong>Guitar & Voice Integrated</strong> — The ©PLING! method for singing and playing</li>
          <li><strong>Quick Question</strong> — Text-based feedback within 24 hours</li>
          <li><strong>Mini Critique</strong> — Short video feedback on your practice</li>
          <li><strong>Full Video Review</strong> — Detailed critique of a 15-minute practice session</li>
          <li><strong>Inner Circle Membership</strong> — Monthly community access and coaching perks</li>
          <li><strong>Group Workshops</strong> — Small group learning sessions</li>
          <li><strong>Gift Certificates</strong> — Redeemable for any service</li>
        </ul>
        <p>
          Prices are listed on the Studio page and may change at any time. Current 
          pricing applies at the time of purchase.
        </p>

        <h2>3. Payments & Refunds</h2>
        <ul>
          <li>Payments are processed by Stripe, Inc. or through direct payment methods (Venmo, PayPal, Zelle, Cash App).</li>
          <li>Lesson packs (5-pack, 10-pack) are valid for 12 months from date of purchase.</li>
          <li>Gift certificates are valid for 12 months from date of purchase.</li>
          <li>Inner Circle memberships may be cancelled at any time. No refunds for partial months.</li>
        </ul>

        <h2>4. Cancellation Policy</h2>
        <div className="legal-highlight">
          <p><strong>24-hour notice is required for lesson cancellations.</strong> If you cancel within 24 hours of a scheduled session, the session fee is still owed. As Bertrand says: "Illness is the most heeded of doctors" — genuine emergencies are handled with understanding.</p>
        </div>

        <h2>5. Your Content</h2>
        <ul>
          <li>Practice recordings you create using the Practice Recorder are <strong>your property</strong>.</li>
          <li>Journal entries you write in the Reflect mode are <strong>your property</strong> and stored only on your device.</li>
          <li>If you submit practice recordings for async review, you grant Bertrand Laurence permission to view and respond to them for coaching purposes only.</li>
        </ul>

        <h2>6. Intellectual Property</h2>
        <ul>
          <li>All platform code, curriculum content, and intellectual property belong to Bertrand Laurence Guitar Studio. The platform was developed by Joshua Atkinson as a gift.</li>
          <li>All curriculum content — chapter text, slide content, teaching protocols (©SHEARL, ©PLING!, ©FHEAL), and the Vertiscale method — is the intellectual property of Bertrand Laurence. All rights reserved.</li>
          <li>AI-generated artwork used in the curriculum is created for this platform and may not be reproduced without permission.</li>
          <li>"Voix Vive" is a trademark of Bertrand Laurence Guitar Studio.</li>
        </ul>

        <h2>7. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Reproduce, redistribute, or sell the curriculum content</li>
          <li>Use the platform to harass, spam, or harm others</li>
          <li>Attempt to bypass any access controls or payment mechanisms</li>
          <li>Misrepresent your identity when submitting practice recordings</li>
        </ul>

        <h2>8. Disclaimer</h2>
        <p>
          Voix Vive is provided "as is." We make no guarantees about musical skill 
          improvement, career outcomes, or performance results. Learning guitar is 
          a personal journey — the platform supports that journey but cannot 
          guarantee specific outcomes.
        </p>
        <p>
          The breathing exercises and somatic techniques described in the curriculum 
          are for general wellness purposes. They are not medical advice. If you have 
          a respiratory condition or other health concern, consult a healthcare 
          professional before using breathing-based features.
        </p>

        <h2>9. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, neither Bertrand Laurence Guitar 
          Studio nor Joshua Atkinson shall be liable for any indirect, incidental, 
          special, consequential, or punitive damages arising from your use of the 
          platform, including but not limited to loss of data, loss of revenue, or 
          personal injury.
        </p>

        <h2>10. Changes to These Terms</h2>
        <p>
          We may update these terms from time to time. The "Last updated" date at 
          the top will reflect the most recent revision. Continued use of the 
          platform after changes constitutes acceptance.
        </p>

        <h2>11. Governing Law</h2>
        <p>
          These terms are governed by the laws of the State of Maine, United States, 
          without regard to conflict of law principles.
        </p>

        <h2>12. Contact</h2>
        <ul>
          <li><strong>Bertrand Laurence Guitar Studio:</strong> BertLarryMusic@gmail.com</li>
          <li><strong>Phone:</strong> 617-447-5575</li>
          <li><strong>Platform Developer:</strong> Joshua Atkinson — LDTAtkinson.com</li>
        </ul>
      </div>
    </div>
  );
}
