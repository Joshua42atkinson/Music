import{c as a,j as e}from"./index-CNmSeRp3.js";function n(){const r=a();return e.jsxs("div",{className:"legal-page",children:[e.jsx("style",{children:`
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
      `}),e.jsxs("div",{className:"legal-container",children:[e.jsx("button",{className:"legal-back",onClick:()=>r(-1),children:"← Back"}),e.jsx("h1",{children:"Privacy Policy"}),e.jsx("p",{className:"legal-updated",children:"Last updated: May 19, 2026"}),e.jsx("p",{children:"Voix Vive is a guitar learning platform created by Joshua Atkinson for Bertrand Laurence Guitar Studio. We believe your practice is private. This policy explains what data we access, what stays on your device, and what (if anything) leaves it."}),e.jsx("div",{className:"legal-highlight",children:e.jsxs("p",{children:[e.jsx("strong",{children:"The short version:"})," Almost everything stays on your device. We don't track you, we don't sell your data, and we don't use cookies."]})}),e.jsx("h2",{children:"1. What We Access"}),e.jsx("p",{children:e.jsx("strong",{children:"Microphone (Optional)"})}),e.jsxs("ul",{children:[e.jsx("li",{children:"Several tools (PLING! Trainer, Microtonal Tracker, Vertiscale Engine Phase 2) request access to your device's microphone."}),e.jsxs("li",{children:["Audio is processed ",e.jsx("em",{children:"entirely in your browser"})," using the Web Audio API. It is used for real-time pitch detection only."]}),e.jsxs("li",{children:["Audio is ",e.jsx("strong",{children:"never recorded, transmitted, or stored on any server"}),"."]}),e.jsx("li",{children:"You can use the entire platform without a microphone — Flash, Imagine, and Reflect modes work without one."})]}),e.jsx("p",{children:e.jsx("strong",{children:"Camera (Optional)"})}),e.jsxs("ul",{children:[e.jsx("li",{children:"The Practice Recorder tool allows you to record video of your practice sessions."}),e.jsxs("li",{children:["Recordings are stored ",e.jsx("strong",{children:"locally on your device"})," in your browser's IndexedDB database."]}),e.jsx("li",{children:"Recordings are never automatically uploaded. If and when the async review feature launches, you will explicitly choose to submit a recording."})]}),e.jsx("h2",{children:"2. Data Stored on Your Device"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"localStorage:"})," Practice progress, Bard Level, scaffolding state, ambient player preferences, and game session scores. This data persists between visits but never leaves your browser."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"IndexedDB (via Dexie.js):"})," Practice recordings, session journals, and submission history. All stored locally."]})]}),e.jsx("p",{children:"To delete all locally stored data, clear your browser's site data for this domain."}),e.jsx("h2",{children:"3. What We Do NOT Collect"}),e.jsxs("ul",{children:[e.jsx("li",{children:"We do not use cookies."}),e.jsx("li",{children:"We do not use analytics trackers (no Google Analytics, no Mixpanel, no tracking pixels)."}),e.jsx("li",{children:"We do not collect your name, email, or personal information unless you voluntarily provide it (e.g., when contacting Bertrand for lessons)."}),e.jsx("li",{children:"We do not serve advertisements."}),e.jsx("li",{children:"We do not sell, share, or transfer any data to third parties."})]}),e.jsx("h2",{children:"4. Payments"}),e.jsxs("p",{children:["When payment processing is active, payments are handled by Stripe, Inc. Stripe collects payment information directly — we never see or store your credit card number. Stripe's privacy policy applies to payment transactions:",e.jsx("a",{href:"https://stripe.com/privacy",style:{color:"#c9a96e"},target:"_blank",rel:"noopener noreferrer",children:"stripe.com/privacy"}),"."]}),e.jsx("p",{children:"Alternative payment methods (Venmo, PayPal, Zelle, Cash App) are handled directly between you and Bertrand through those platforms' own privacy policies."}),e.jsx("h2",{children:"5. Children"}),e.jsx("p",{children:"Voix Vive is designed primarily for adult learners (ages 30–65). We do not knowingly collect personal information from children under 13. If you believe a child under 13 has provided us with personal information, please contact us so we can take appropriate action."}),e.jsx("h2",{children:"6. Open Source"}),e.jsx("p",{children:"The licensing terms for the Voix Vive platform are to be determined by Bertrand Laurence. The platform was developed by Joshua Atkinson as a gift for Bertrand Laurence Guitar Studio."}),e.jsx("h2",{children:"7. Changes to This Policy"}),e.jsx("p",{children:'If we make material changes to this policy, we will update the "Last updated" date at the top. Continued use of the platform after changes constitutes acceptance of the updated policy.'}),e.jsx("h2",{children:"8. Contact"}),e.jsx("p",{children:"For privacy questions or data deletion requests:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Bertrand Laurence Guitar Studio:"})," BertLarryMusic@gmail.com"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Platform Developer:"})," Joshua Atkinson — LDTAtkinson.com"]})]})]})]})}export{n as default};
