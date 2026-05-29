# VOIX VIVE ACADEMY — Business Model & Operations

This document defines the financial architecture of the Voix Vive Academy. The platform operates on a "Freemium + High-Touch Mentorship" model, designed to scale Bertrand's time while providing immense upfront value.

## 1. The Core Funnel

The academy separates *Information* from *Transformation*. 
Information (the curriculum) is free. Transformation (human feedback) is paid.

### The Free Tier (The Top of Funnel)
- **What they get**: Full access to the 132-node curriculum, the AI Troubadour, all 12 digital tools, the Vertiscale Game, and local progress tracking.
- **Why it's free**: This establishes Bertrand's authority, builds a habit of practice in the student, and naturally leads them to hit a "plateau" where they need human eyes on their technique.

### The Paid Tiers (Mentorship & Mastery)
Students who want human feedback must purchase a service tier. These are currently fulfilled via Stripe Payment Links.

| Tier | Price | Fulfillment | Target Audience |
|------|-------|-------------|-----------------|
| **The Tip Jar** | $5.00 | None (Donation) | Grateful free-tier users. |
| **Quick Question** | $5.00 | Asynchronous Text | Students stuck on a specific concept. |
| **Video Review** | $35.00 | Asynchronous Video | Students needing form/technique correction. |
| **Private Lesson** | $65.00 | 60-min Zoom Call | Dedicated students requiring real-time coaching. |
| **The Inner Circle** | $25/mo | Discord/Community + 1 Video/mo | Serious students looking for peer support and regular check-ins. |
| **Capstone Audition** | $100.00 | Formal Review & Certificate | Students moving from Apprentice to Journeyman. |

---

## 2. Payment Architecture (Zero-Backend)

The platform is designed to minimize server costs and maintenance. We do not use a complex e-commerce backend.

### How it works:
1. Bertrand creates **Payment Links** in his Stripe Dashboard for each of the tiers above.
2. These URLs are pasted directly into `/src/data/pricingData.js`.
3. When a student clicks "Buy" in the Studio Page, they are taken to the secure Stripe checkout.
4. Stripe handles the receipt and notifies Bertrand via email.

*(Note: Currently, the codebase contains mock Stripe URLs. Bertrand must generate real links and update `pricingData.js` to begin accepting revenue).*

---

## 3. Operational Workflow (The Mentor Dashboard)

To prevent Bertrand from burning out, asynchronous reviews are heavily prioritized over live Zoom lessons.

### The Video Review Flow:
1. **Student records**: The student uses the Coaching Portal (Fret 10) to record a practice video.
2. **Drive upload**: The video is automatically uploaded to a dedicated folder in the *student's* Google Drive (saving server storage costs), and shared with Bertrand's email.
3. **Database ping**: Metadata (the link, the fret number, the student's biometric state) is sent to Supabase.
4. **Mentor review**: Bertrand logs into the `/mentor` dashboard on the Voix Vive app.
5. **The Queue**: He sees a list of pending videos. He watches the video, records his own video response (using Loom or his phone), and types a few notes.
6. **Completion**: He marks the submission as "Reviewed" in the dashboard, triggering an email back to the student.

### The Queue Cap
To manage bandwidth, the `schedulingService.js` enforces a maximum queue depth. If Bertrand has more than 10 pending video reviews, the platform will temporarily disable the "Buy Video Review" button and suggest the "Quick Question" text tier instead. This protects the SLA (Service Level Agreement) of a 7-day turnaround.
