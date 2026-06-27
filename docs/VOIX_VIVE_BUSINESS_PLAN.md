# Voix Vive — Business & Financial Plan
> **Status:** Living document. Updated with market research 2026-06-25.
> **Owner:** Joshua Atkinson (developer) + Bertrand Laurence (content/teacher)
> **Relationship:** Joshua builds the platform as academic thesis work. Bertrand provides teaching content and revenue through his student base.

---

## 1. The Product (Plain English)

Voix Vive is a bilingual (EN/FR) guitar masterclass platform built on Google's ecosystem. It combines:
- A **12-chapter video curriculum** (Bertrand's teaching, progressively recorded)
- An **AI guide** (the Truebadour, powered by Gemini)
- **Pitch detection** (real-time audio feedback via microphone)
- **Progress tracking** (DAG-enforced chapter progression, XP, practice journal)
- **Somatic practice method** (BE → DO → PLAY — breath, technique, free expression)

The app works on any phone, tablet, or laptop today (PWA). A native Android build via Tauri is configured. A future AR/spatial mode targets Google Android XR / XREAL Project Aura when consumer glasses ship (late 2026).

---

## 2. Market Size & Reality

### The Guitar Learning Market
- **Guitar practice software market:** $305M (2025) → $379M (2034), 3.2% CAGR
- **Online music learning market:** ~$399B (2022) → $764B (2033), 8.5% CAGR
- **Key competitors:** Fender Play (5M+ users), Yousician, JustinGuitar, Guitar Tricks, Simply Guitar

### Where Voix Vive Fits
We are NOT competing with Fender Play or Yousician. Those are mass-market gamified apps with VC funding. We are a **premium niche course** — closer to TrueFire or a private conservatory, delivered through an app instead of a classroom.

**Our differentiators (things competitors don't have):**
1. Somatic/body-centered pedagogy (unique to Bertrand)
2. AI guide with a specific persona (Gemini-powered Truebadour)
3. Bilingual EN/FR (Bertrand teaches in both languages)
4. DAG-enforced progression (can't skip ahead — creates commitment)
5. Google ecosystem integration (Drive, Calendar, OAuth, Gemini)
6. Future AR/spatial mode (Android XR — first-mover in guitar education)

### What Online Course Creators Actually Earn
Source: Tevello, SamCart, LearnWorlds industry data (2025-2026)

| Level | Course Price | Monthly Sales | Monthly Income | Annual Income |
|---|---|---|---|---|
| Starting out | $50 | 10 | $500 | $6,000 |
| Mid-range (established audience) | $200 | 50 | $10,000 | $120,000 |
| High-end (large following + marketing) | $500 | 100 | $50,000 | $600,000 |

**Our realistic position:** Starting out → Mid-range over 2 years. Bertrand has an existing student base but no online audience. Conversion will start small and grow through word-of-mouth and Bertrand's in-person network.

---

## 3. Revenue Streams

### The Mentorship Monetization Model
> **Core thesis:** AI makes content free. Human attention is the premium.
> Content (curriculum, tools, AI) is the funnel — free or $5/month.
> Mentorship (Bertrand's eyes on your work) is the product — $100 to $1000/month.
> This is a template for keeping any human SME employed in the AI era.

### The Funnel: Curriculum → AI Habit → Mentorship Anchor

```
Chapter completion (free) → emotional peak → upgrade prompt
AI coaching (free/$5) → daily habit → "this needs human eyes"
Mentorship review ($100+) → Bertrand confirms/corrects AI
Student feels seen → stays subscribed → next chapter → cycle
```

**Key insight:** Students don't practice every day. They don't submit videos every day. They pay for **access** — the option to get Bertrand's eyes on their work when they're ready. Like a gym membership: you don't go daily, but you keep paying because you *might*.

**The business metric isn't Bertrand's hourly rate. It's LTV and churn.** A student who stays subscribed for 18 months at $100/mo generates $1,800 — even if they only submit 8 videos total. Retention > transaction count.

### Subscription Tiers (Primary Revenue — Recurring Monthly)
> Defined in `pricingData.js` as `SUBSCRIPTION_TIERS`.

| Tier | Price | What You Get | Bertrand's Time/mo | Revenue (100% his) | His Effective Rate |
|---|---|---|---|---|---|
| **Free** | $0 | All 12 chapters + wllama AI + all tools | 0 | $0 | — |
| **Community** | $5/mo | Gemini AI (cloud) + Guild community + Inner Circle blog + sync | 0 (blog is shared) | $5 | — |
| **Apprentice** | $100/mo | Access to Bertrand's reviews — submit when ready (up to 4/mo). AI pre-screens, Bertrand adds judgment. | ~20 min (with AI pre-screening) | $100 | **$300/hr** |
| **Journeyman** | $500/mo | 4 scheduled live Zoom sessions + 4 async reviews + unlimited questions | ~3.3 hrs | $500 | **$150/hr** |
| **Master** | $1000/mo | 8 live sessions (2/week) + direct messaging + quarterly assessment | ~7.3 hrs | $1000 | **$137/hr** |

> **AI Pre-Screening:** Gemini analyzes every video submission first — flags timing, pitch, posture issues, generates a draft review with timestamps. Bertrand reviews the AI analysis, adds his judgment, records 2-3 min of personalized feedback. His time drops from 12 min to ~5 min per review. This is the scale solution.

### Revenue: 100% to Bertrand

Voix Vive is built by Joshua Atkinson as a gift to Bertrand. **All subscription revenue — every tier, every à la carte service, every tip — goes to Bertrand.** Joshua's income comes from his own separate projects (daydream, Trinity, phonethagoras.com).

If Bertrand chooses to pay Joshua after the platform is generating revenue, that is entirely at Bertrand's discretion. It is not encoded in the pricing structure, not contractually obligated, and not expected.

This is not a partnership. This is a developer building a tool for a teacher, for free, because the teacher's method deserves to reach more people.

### Why $100 / $500 / $1000?

**$100/mo (Apprentice)** is **access, not a quota.** Students submit practice demos whenever they're ready (up to 4/month). AI pre-screens each video, Bertrand adds his judgment and personalized feedback within 48 hours. In months where a student doesn't submit, they still get: unlimited Gemini AI coaching, community accountability, Bertrand's blog, and the *option* to submit whenever they're ready. Cheaper than weekly in-person lessons ($65 × 4 = $260/mo). This is the "no-brainer" tier for any serious student.

**$500/mo (Journeyman)** is the **accountability tier.** 4 scheduled live Zoom sessions — use them or lose them. The scheduling is the point: it forces practice. At a music school, this would cost $400-800/month. This is the "I was going to take lessons anyway" tier.

**$1000/mo (Master)** is a **relationship, not a service.** 2 live sessions/week + direct messaging. This targets: professionals preparing for performances, guitar teachers studying with Bertrand, serious adult learners with disposable income. Even 1-2 Master subscribers = $1000-2000/month for Bertrand.

### Why a $5 Community Tier (Instead of Just Free)?

- **Skin in the game:** $5/month filters out spam and creates commitment
- **Daily engagement:** Cloud AI (Gemini) gives students a reason to open the app every day — ask questions, get instant feedback, practice with AI. This is the YouTube-style engagement loop.
- **Passive income for Bertrand:** 200 community members = $1,000/mo for Bertrand — for writing a blog post he'd write anyway
- **Upsell funnel:** Community members see Apprentice tier reviews in the feed → "I want that"
- **Retention anchor:** Even when students don't submit videos, they keep paying $5/mo because the AI coaching + community + blog keep them engaged daily

### What Keeps People Paying (Even When They Don't Practice)?

| Tier | Retention Driver |
|---|---|
| **Free** | Curriculum progress, offline AI, tools — habit formation |
| **Community ($5)** | Cloud AI (unlimited), community accountability, Bertrand's blog, sync — **daily engagement** |
| **Apprentice ($100)** | All above + **access to Bertrand's reviews when ready**. Not a quota — an option. AI pre-screens, Bertrand adds judgment. |
| **Journeyman ($500)** | All above + **scheduled live sessions**. Use them or lose them — the commitment is fixed. Accountability tier. |
| **Master ($1000)** | All above + **Bertrand is your mentor**. Direct messaging, twice weekly, quarterly assessment. A relationship, not a service. |

### Conversion Strategy: Emotional Peaks, Not Pricing Pages

Don't show a pricing table and hope people pick a tier. Show upgrade prompts at emotional peaks:
- Student completes a chapter → "Want Bertrand to review your journey?"
- AI flags a technique issue → "This needs human eyes. Submit to Bertrand?"
- Student posts in community → "Apprentice members get priority responses"
- Student has been free for 30 days → "You've practiced 12 times. Ready for mentorship?"

### Key Business Metrics

| Metric | Target (Year 1) | Target (Year 2) |
|---|---|---|
| Free → Community conversion | 10%+ | 15%+ |
| Community → Apprentice conversion | 10%+ | 5%+ |
| Monthly churn | <10% | <8% |
| Average subscriber lifetime | 12+ months | 18+ months |
| Apprentice LTV | $1,200/yr | $1,800+ |
| Community LTV | $60/yr | $90+ |

### Market Comparison

| Competitor | Price | Human Feedback? | Live Sessions? | Our Advantage |
|---|---|---|---|---|
| Fender Play | $20/mo | No | No | We have Bertrand |
| Yousician | $20/mo | No | No | We have human reviews |
| TrueFire | $29/mo | No | No | We have interactive tools + AI |
| ArtistWorks | $35-50/mo | Yes (video exchange) | No | We have AI + live sessions + bilingual |
| Lessonface | $30-100+/lesson | Yes | Yes (per lesson) | We offer subscription (predictable) + AI tools |
| **Voix Vive Apprentice** | **$100/mo** | **Yes (4 reviews)** | No | **Cheaper than weekly lessons, includes AI** |
| **Voix Vive Journeyman** | **$500/mo** | **Yes (4+4)** | **Yes (4 Zoom)** | **Like having a private teacher on retainer** |
| **Voix Vive Master** | **$1000/mo** | **Yes (8+8)** | **Yes (8 Zoom)** | **Intensive mentorship, direct access** |

### À la Carte Services (Non-subscribers — Bertrand's Revenue)

| Stream | Price | Who Pays | Notes |
|---|---|---|---|
| Tip jar | $5 / $15 / $50 | Happy users | Street performer model |
| Quick Question (text) | $5 | Non-subscribers | Subscribers can use reviews instead |
| Mini Critique (video) | $15 | Non-subscribers | Free for Apprentice+ (1/mo) |
| Full Video Review | $35 | Non-subscribers | Free for Journeyman+ (4/mo) |
| Private lesson (Zoom) | $65 | Anyone | Not included in any tier |
| 5-lesson pack | $275 | Anyone | Save $50 |
| 10-lesson pack | $500 | Anyone | Save $150 |
| Group workshop | $35 | Non-subscribers | Free for Master subscribers |
| Gift certificate | $65-$500 | Gift givers | Redeemable for any service |

### Revenue Split

| Recipient | All Subscriptions | À la carte | Tips |
|---|---|---|---|
| **Bertrand** | 100% | 100% | 100% |
| **Joshua** | 0% | 0% | 0% |

> **Voix Vive is a gift.** Joshua builds for free. All revenue goes to Bertrand. If Bertrand chooses to pay Joshua after it's working, that's between them.

---

## 4. Realistic Revenue Projections

> **Honest assessment:** The mentorship model is about **retention, not transactions.** A student at $100/mo might submit 1 video in February and 3 in March — they're paying for access, not per review. The business metric is LTV and churn, not Bertrand's hourly rate. **100% of revenue goes to Bertrand. Joshua builds for free.**

### Year 1 (Launch → Traction)

| Scenario | Community ($5) | Apprentice ($100) | Journeyman ($500) | Master ($1000) | À la carte | Bertrand's total |
|---|---|---|---|---|---|---|
| **Pessimistic** | 10 | 1 | 0 | 0 | $200 | **$350/mo** |
| **Realistic** | 50 | 5 | 1 | 0 | $500 | **$1,750/mo** |
| **Optimistic** | 150 | 15 | 3 | 1 | $1,000 | **$7,250/mo** |

**Year 1 realistic:**
- Bertrand earns: $250 (community) + $500 (apprentice) + $500 (journeyman) + $500 (à la carte) = **$1,750/mo → $21,000/yr**
- Bertrand's time: 5 × 20 min + 1 × 3.3 hrs = ~5 hrs/mo (with AI pre-screening)
- Joshua earns: $0 (builds for free)

### Year 2 (Growth — word of mouth, Google Play Store, Bertrand's network)

| Scenario | Community ($5) | Apprentice ($100) | Journeyman ($500) | Master ($1000) | À la carte | Bertrand's total |
|---|---|---|---|---|---|---|
| **Pessimistic** | 100 | 5 | 2 | 0 | $500 | **$2,500/mo** |
| **Realistic** | 300 | 15 | 5 | 1 | $1,500 | **$8,500/mo** |
| **Optimistic** | 800 | 40 | 15 | 5 | $3,000 | **$29,500/mo** |

**Year 2 realistic:**
- Bertrand earns: $1,500 + $1,500 + $2,500 + $1,000 + $1,500 = **$8,000/mo → $96,000/yr**
- Bertrand's time: 15 × 20 min + 5 × 3.3 hrs + 1 × 7.3 hrs = ~18 hrs/mo (with AI pre-screening)
- Joshua earns: $0 (builds for free)

> **Year 2 realistic: Bertrand earns ~$96K/yr for ~18 hrs/mo of work.** That's nearly double his in-person income potential, for part-time hours from home. AI pre-screening makes this sustainable — without it, the same subscriber count would require ~28 hrs/mo.

### The Scale Problem (Honest)

| Subscribers | Bertrand's monthly time (with AI pre-screening) | Sustainable? |
|---|---|---|
| 5 Apprentice + 1 Journeyman | ~5 hrs/mo | Easy — spare time |
| 15 Apprentice + 5 Journeyman + 1 Master | ~18 hrs/mo | Yes — part-time, ~4.5 hrs/week |
| 40 Apprentice + 15 Journeyman + 5 Master | ~48 hrs/mo | Borderline — needs to reduce in-person lessons |
| 100+ Apprentice | ~33 hrs/mo (reviews alone, AI-assisted) | Yes with AI pre-screening — would be ~80 hrs without |

> **AI pre-screening is the scale solution.** Gemini watches the demo first, flags issues, generates a draft response with timestamps. Bertrand reviews and records the final 2-3 min video. This cuts his time per review from 12 min to 5 min — 2.4x throughput. Without this, 100+ Apprentice subscribers is unsustainable. With it, 100+ is manageable in ~33 hrs/mo.

### Year 3+ (Scale — Google Play Store, AR launch, possible Google partnership)

Too speculative to model precisely. Key drivers:
- Google Play Store distribution (3B+ Android users)
- Android XR / Project Aura launch (AR guitar overlay = press + differentiation)
- Google AI Futures Fund investment (if accepted)
- Bertrand's YouTube/social media content strategy
- **The mentorship model scales with Bertrand's reputation, not with content production.** He doesn't need to make more videos — he needs more students who want his attention.
- **AI-assisted review prep** (Gemini pre-screens demos) could 2-3x Bertrand's throughput without lowering quality.
- **The platform is replicable.** The same model could work for any SME — voice coach, yoga teacher, painting instructor. Voix Vive could become a **mentorship monetization platform**, not just a guitar app.

---

## 5. Cost Structure

### One-Time Costs

| Item | Cost | When |
|---|---|---|
| LLC registration | ~$50-$150 (varies by state) | Week 1 |
| Domain name (voixvive.com or similar) | ~$12/yr | Week 1 |
| Stripe account setup | $0 | Week 2 |

### Monthly Costs (Without Google Credits)

| Item | Cost | Notes |
|---|---|---|
| Netlify hosting | $0 (free tier) | Sufficient for launch |
| Gemini API (Truebadour) | ~$0.075 per 1M tokens | ~$0.50/user/month for heavy users |
| Firebase | $0 (free tier) | Auth + Firestore, sufficient for <10K users |
| Google Drive storage | $0 (free 15GB) | Student video submissions via their own accounts |
| **Total monthly** | **~$0-$20** | Until usage scales |

### Monthly Costs (With Google Cloud Credits — $350K over 2 years)

| Item | Cost | Notes |
|---|---|---|
| Everything above | **$0** | Covered by credits |
| **Total monthly** | **$0** | For 2 years |

### What Google Cloud Credits Cover
- Gemini API calls (Truebadour AI)
- Firebase (Auth, Firestore, hosting)
- Google Cloud Storage (video hosting if needed)
- Cloud CDN (fast content delivery globally)
- Cloud Run (if backend services needed)

**Bottom line: Your infrastructure is free for 2 years if you get the credits. Every dollar earned is profit.**

---

## 6. Funding Paths

### Path A: Bootstrapped (No External Funding)
- **Cost to start:** ~$100 (LLC + domain)
- **Revenue starts:** When first student pays $97
- **Risk:** Low — no debt, no investors, no equity given away
- **Growth rate:** Slow — limited by organic word-of-mouth
- **Best for:** Proving the model, thesis validation, keeping full ownership

### Path B: Google Cloud for Startups (Credits, No Equity)
- **What:** Up to $350,000 in Cloud credits over 2 years
- **Requirements:** Registered business, website, using/planning to use Google Cloud
- **What it gives you:** Free infrastructure for 2 years
- **What it doesn't give you:** Cash in your pocket
- **Apply at:** cloud.google.com/startup/ai
- **Best for:** Eliminating infrastructure costs while you grow

### Path C: Google AI Futures Fund (Equity Investment)
- **What:** Equity investment + early access to DeepMind models + Google engineer support + Cloud credits
- **Requirements:** Startup using Gemini as foundation of product (we qualify)
- **Application:** Rolling, no deadline, at blog.google (AI Futures Fund)
- **What it gives you:** Cash + credibility + technical support
- **What it costs:** Equity (percentage of company — negotiable)
- **Best for:** Accelerating growth after initial traction (not for starting)

### Path D: SBA Veteran Programs (Loans + Training)
- **SBA Microloan:** Up to $50,000, 6-9% interest, 7-year terms
- **Boots to Business:** Free entrepreneurship training for veterans
- **SDVOSB Certification:** Federal contracting preference (3% set-aside)
- **Apply at:** sba.gov/business-guide/grow-your-business/veteran-owned-businesses
- **Best for:** Learning civilian business basics, funding initial costs

### Recommended Sequence
1. **Register LLC** ($100) — enables everything
2. **Apply for Google Cloud credits** (free) — eliminates infrastructure costs
3. **Ship the subscription gate** (2-3 hours code) — enables revenue
4. **Get first paying customer** — proves the model
5. **Apply to AI Futures Fund** (free) — with traction, application is stronger
6. **Take SBA Boots to Business** (free) — learn what you don't know
7. **Consider SBA microloan** only if you need equipment or marketing budget

---

## 7. The Google-First Strategy

### Why Google
The app already uses 7 Google technologies. Leaning into this is not a pivot — it's documenting what already exists.

| Google Service | Our Usage | File |
|---|---|---|
| Gemini AI | Truebadour AI guide (cloud mode) | `useGeminiTruebadour.js` |
| Google OAuth | Sign-in (one tap for Android users) | `useAuth.js` |
| Firebase | Auth + Firestore (optional cloud sync) | `firebase.js` |
| Google Drive | Student video submissions | `driveService.js` |
| Google Calendar | Lesson scheduling | `calendarService.js` |
| PWA | Installable on Android, manifest configured | `vite.config.js` |
| Tauri Android | Native APK build target configured | `src-tauri/tauri.conf.json` |

### The Narrative (for Google, investors, thesis)

> Google explored music education with the Les Paul Guitar Doodle (2011), conversational AI with Bard (2023, now Gemini), and spatial computing with Daydream (2016-2021). Voix Vive converges all three: a Gemini-powered AI guitar guide, delivered through a PWA/Android app, with a path to Android XR for spatial fretboard overlay. It is the Google-native guitar masterclass.

### Android Deployment Path

| Stage | What | When | Effort |
|---|---|---|---|
| **Now** | PWA — installable on Android via browser | Already works | 0 |
| **Next** | Tauri Android APK — native wrapper | When ready for Play Store | Medium (Tauri Android build + signing) |
| **Future** | Android XR app — spatial fretboard | When Project Aura ships (late 2026) | Large (Rust/Bevy port to Android OpenXR) |

### Android XR / Project Aura Timeline
- Google I/O 2026: Android XR announced, Developer Preview 3 available
- XREAL Project Aura: Consumer launch before end of 2026
- Developer program: Early access available now via XREAL
- **Opportunity:** Be one of the first education apps on Android XR. "Learn guitar through your AR glasses" is a category-defining use case.

---

## 8. Bilingual Advantage (EN/FR)

Bertrand is bilingual (English/French). The app already has i18n infrastructure (`useLocale` hook, `en.json`, `fr.json` locale files).

### Market Opportunity
- **French-speaking guitar market:** Underserved. Most guitar apps are English-only.
- **Target regions:** Quebec, France, Belgium, Switzerland, Francophone Africa, Louisiana
- **Competitive moat:** Fender Play, Yousician, JustinGuitar — none have native French teaching content
- **Bertrand's credibility:** "Boston French Blues guitar wizard" (Boston Globe), Passim School instructor, French heritage

### Content Strategy
- Bertrand records each chapter video **twice** — once in English, once in French
- Same curriculum, same DAG, same app — language toggle switches everything
- The Truebadour AI responds in the user's selected language (Gemini is multilingual)
- Marketing: French content reaches a market with zero competition

---

## 9. What Needs to Happen (Priority Order)

### Phase 0 — Ship & Sell (Weeks 1-2)
> Goal: First paying subscriber. Everything else is secondary.

| Task | Effort | Who | Blocks revenue? |
|---|---|---|---|
| Register LLC | 1 hour + $100 | Joshua | Yes (needed for Stripe, Google) |
| Create Stripe account | 30 min | Joshua or Bertrand | Yes |
| Set up Stripe Subscriptions (3 tiers) | 1 hour | Joshua | Yes |
| Replace mock Stripe URLs in `pricingData.js` | 1 hour | Joshua | Yes |
| Add subscription state to auth context | 2 hours | Joshua | Yes |
| Add video review submission UI | 3 hours | Joshua | Yes (core value prop) |
| Bertrand records 3 chapter videos (EN + FR) | 3 hours | Bertrand | No (but needed for retention) |
| Deploy to Netlify with domain | 30 min | Joshua | No (but blocks credibility) |
| Bertrand tells his in-person students | 1 conversation | Bertrand | No (but blocks first sale) |

### Phase 1 — Google Ecosystem (Weeks 2-4)
> Goal: Free infrastructure + Google relationship

| Task | Effort | Who |
|---|---|---|
| Apply for Google Cloud for Startups | 1 hour | Joshua |
| Apply to Google AI Futures Fund | 2 hours (application) | Joshua |
| Apply for SBA Boots to Business | 30 min | Joshua |
| Register as SDVOSB | 1 hour | Joshua |
| Set up Gemini API billing (or use credits) | 30 min | Joshua |

### Phase 2 — Content & Marketing (Months 2-6)
> Goal: 30 paying students

| Task | Effort | Who |
|---|---|---|
| Bertrand records remaining 9 chapters (EN + FR) | Ongoing | Bertrand |
| Record 2-minute demo video | 1 hour | Joshua |
| Bertrand creates YouTube Shorts (SHEARL method) | Ongoing | Bertrand |
| Post in guitar forums / Reddit / French communities | Ongoing | Both |
| Apply for Google Play Store listing (Tauri APK) | 1 day | Joshua |

### Phase 3 — Android & AR (Months 6-18)
> Goal: Google Play Store presence + AR readiness

| Task | Effort | Who |
|---|---|---|
| Build Tauri Android APK | 1-2 days | Joshua |
| Google Play Store submission | 1 day | Joshua |
| Port spatial engine to Android OpenXR | Large (ongoing) | Joshua |
| Apply for XREAL developer program | 1 hour | Joshua |
| Build AR fretboard prototype on XREAL | Large | Joshua |

---

## 10. Revenue Agreement

> This is not a contract. It's a statement of intent.

**Voix Vive is built by Joshua Atkinson as a gift to Bertrand Laurence.**

- **All revenue** — subscriptions, à la carte services, tips — **goes to Bertrand.**
- Joshua's income comes from his own separate projects (daydream, Trinity, phonethagoras.com).
- If Bertrand chooses to compensate Joshua after the platform is generating revenue, that is entirely at Bertrand's discretion.
- Both parties retain their own IP (Joshua: code, Bertrand: teaching content/method).
- Either party may walk away at any time.

---

## 11. Key Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Bertrand doesn't record videos | Medium | Fatal to mentorship model | Start with 3 chapter intros only (5-10 min each). Prove revenue before asking for 12. |
| No one subscribes | Medium | No revenue | Free chapters as funnel. Bertrand's existing students as first subscribers. Upgrade prompts at emotional peaks. |
| Gemini API costs exceed revenue | Low | Eats into profit | Google Cloud credits cover this for 2 years. Price AI sub at $9.99, cost is ~$0.50/user. |
| Google rejects all applications | Low | No free infrastructure | Bootstrapped mode costs ~$0-20/month anyway. Credits are bonus, not requirement. |
| Competitor copies the somatic method | Low | Reduces differentiation | The method is Bertrand's IP. The code is Joshua's. Copying either is hard. |
| Android XR / Project Aura delays | Medium | AR story stalls | AR is Phase 3, not Phase 0. Revenue doesn't depend on it. |
| Joshua can't sustain development | Medium | Platform stagnates | The app is already built. Maintenance is minimal. New features are optional. |

---

## 12. Success Metrics

| Metric | Target (Year 1) | Target (Year 2) |
|---|---|---|
| Community subscribers ($5/mo) | 50 | 300 |
| Apprentice subscribers ($100/mo) | 5 | 15 |
| Journeyman subscribers ($500/mo) | 1 | 5 |
| Master subscribers ($1000/mo) | 0 | 1 |
| Total paying subscribers | 56 | 321 |
| Monthly recurring revenue (MRR) | ~$1,250/mo | ~$8,500/mo |
| Bertrand's annual income | ~$21,000 | ~$96,000 |
| Bertrand's time commitment (AI-assisted) | ~5 hrs/mo | ~18 hrs/mo |
| Free → Community conversion | 10%+ | 15%+ |
| Community → Apprentice conversion | 10%+ | 5%+ |
| Monthly subscriber churn | <10% | <8% |
| Average subscriber lifetime | 12+ months | 18+ months |
| Apprentice LTV | $1,200/yr | $1,800+ |
| App store rating | 4.5+ | 4.5+ |
| Bilingual users (FR) | 20% of users | 30% of users |

---

*This document is the financial source of truth for Voix Vive. Update after every major milestone.*
