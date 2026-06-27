// ═══════════════════════════════════════════════════════════
// PRICING & REVENUE DATA — Bertrand's Income Streams
//
// STRATEGY: MENTORSHIP MONETIZATION
// AI makes content free. Human attention is the premium.
// The 12-chapter Living Textbook is 100% FREE — no content gate.
// Revenue comes from monthly subscriptions that buy ACCESS to
// Bertrand's judgment — not a quota of reviews.
//
// THE FUNNEL (Google-style engagement model):
//   Chapter completion (free) → emotional peak → upgrade prompt
//   AI coaching (free/$5) → daily habit → "this needs human eyes"
//   Mentorship review ($100+) → Bertrand confirms/corrects AI
//   Student feels seen → stays subscribed → next chapter → cycle
//
// KEY INSIGHT: Students don't practice every day. They don't submit
// videos every day. They pay for ACCESS — the option to get
// Bertrand's eyes on their work when they're ready. Like a gym
// membership: you don't go daily, but you keep paying because you MIGHT.
//
// AI PRE-SCREENING: Gemini analyzes every video submission first —
// flags timing, pitch, posture issues, generates a draft review with
// timestamps. Bertrand reviews the AI analysis, adds his judgment,
// records 2-3 min of personalized feedback. His time drops from
// 12 min to ~5 min per review. This is the scale solution.
//
// The model:
//   Free     = Content + offline AI (the funnel — habit formation)
//   $5/mo    = Cloud AI + community + blog (daily engagement)
//   $100/mo  = Access to Bertrand's reviews when ready (mentorship entry)
//   $500/mo  = Scheduled live sessions + async (accountability tier)
//   $1000/mo = Bertrand is your mentor — relationship, not service
//
// REVENUE: 100% to Bertrand. Joshua builds for free.
// Joshua's income comes from his own projects (daydream, Trinity,
// phonethagoras.com). Voix Vive is a gift to Bertrand.
// If Bertrand chooses to pay Joshua after it's working, that's
// between them — not encoded in the pricing structure.
//
// This is a template for keeping any human SME working in the AI era.
// ═══════════════════════════════════════════════════════════

// ── Subscription Tiers ──
// Free = funnel. Community = daily habit. Mentorship = access + accountability.
export const SUBSCRIPTION_TIERS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    unit: 'forever',
    icon: '🎵',
    color: 'var(--vv-cream, #f0e6d2)',
    tagline: 'The whole curriculum. No credit card.',
    features: [
      'All 12 chapters — full curriculum, no gate',
      'Truebadour AI (offline wllama mode)',
      'All tools: pitch detector, fretboard, journal',
      'Progress tracking on-device',
      'Bilingual EN/FR',
    ],
    videoReviewsPerMonth: 0,
    liveSessionsPerMonth: 0,
    aiMode: 'wllama',
  },
  {
    id: 'community',
    name: 'Community',
    price: 5,
    unit: 'month',
    icon: '�️',
    color: '#6a8a6a',
    tagline: 'Cloud AI + community + mentorship blog',
    stripeLink: 'https://buy.stripe.com/mock_community_monthly',
    recurring: true,
    features: [
      'Everything in Free, plus:',
      'Truebadour AI (Gemini cloud — unlimited, instant)',
      'The Guild — community hub & discussion boards',
      'The Inner Circle — Bertrand\'s mentorship blog',
      'Progress sync across devices (Firebase)',
      'Support the platform — keep Voix Vive alive',
    ],
    videoReviewsPerMonth: 0,
    liveSessionsPerMonth: 0,
    aiMode: 'gemini',
  },
  {
    id: 'apprentice',
    name: 'Apprentice',
    price: 100,
    unit: 'month',
    icon: '🎸',
    color: 'var(--vv-gold, #c9a96e)',
    tagline: 'Access to Bertrand\'s reviews — submit when you\'re ready',
    stripeLink: 'https://buy.stripe.com/mock_apprentice_monthly',
    recurring: true,
    badge: 'Most Popular',
    features: [
      'Everything in Community, plus:',
      'Submit practice demos whenever you\'re ready (up to 4/month)',
      'AI pre-screens your video → Bertrand adds his judgment + personalized feedback',
      'Bertrand responds within 48 hours',
      'Priority Q&A — Bertrand answers your questions first',
      'Personalized practice plan after each review',
      'Cheaper than weekly in-person lessons ($260/mo at $65/lesson)',
    ],
    videoReviewsPerMonth: 4,
    liveSessionsPerMonth: 0,
    aiMode: 'gemini',
    aiPreScreening: true,
    bertrandTimePerMonth: '~20 min (4 × 5 min with AI pre-screening)',
    bertrandEffectiveRate: '$300/hr',
  },
  {
    id: 'journeyman',
    name: 'Journeyman',
    price: 500,
    unit: 'month',
    icon: '⭐',
    color: '#7b6aaa',
    tagline: 'Scheduled live sessions — the accountability tier',
    stripeLink: 'https://buy.stripe.com/mock_journeyman_monthly',
    recurring: true,
    features: [
      'Everything in Apprentice, plus:',
      '4 live 1-on-1 Zoom sessions with Bertrand every month (45 min each)',
      'Use them or lose them — scheduled accountability keeps you practicing',
      'Unlimited async questions between sessions',
      'Bertrand watches you play in real time — corrects technique instantly',
      'Personalized weekly practice plan + session recordings',
    ],
    videoReviewsPerMonth: 4,
    liveSessionsPerMonth: 4,
    aiMode: 'gemini',
    aiPreScreening: true,
    bertrandTimePerMonth: '~3.3 hrs (4×45min live + 4×5min async with AI + 30min Q&A)',
    bertrandEffectiveRate: '$150/hr',
  },
  {
    id: 'master',
    name: 'Master',
    price: 1000,
    unit: 'month',
    icon: '👑',
    color: '#d4a84b',
    tagline: 'Bertrand is your mentor — a relationship, not a service',
    stripeLink: 'https://buy.stripe.com/mock_master_monthly',
    recurring: true,
    features: [
      'Everything in Journeyman, plus:',
      '8 live 1-on-1 sessions with Bertrand every month (2/week, 45 min)',
      'Direct messaging — Bertrand is on call for you',
      'Quarterly assessment (in-person if geography allows, or extended video)',
      'Early access to new chapters & features',
      'For serious students, professionals, and guitar teachers studying with Bertrand',
    ],
    videoReviewsPerMonth: 8,
    liveSessionsPerMonth: 8,
    aiMode: 'gemini',
    aiPreScreening: true,
    bertrandTimePerMonth: '~7.3 hrs (8×45min live + 8×5min async with AI + 60min messaging)',
    bertrandEffectiveRate: '$137/hr',
  },
];

// ── Payment Methods ──
// Bertrand accepts multiple payment options for maximum flexibility
export const PAYMENT_METHODS = [
  {
    id: 'stripe',
    name: 'Credit / Debit Card',
    description: 'Visa, Mastercard, Amex, Apple Pay, Google Pay',
    icon: '💳',
    primary: true,
    // Replace with actual Stripe Payment Link URLs after Bertrand creates Stripe account
    baseUrl: 'https://buy.stripe.com/mock_voix_vive', // e.g., 'https://buy.stripe.com/...'
  },
  {
    id: 'venmo',
    name: 'Venmo',
    description: 'Send to @BertrandLaurence',
    icon: '📱',
    primary: true,
    // ⚠️ Verify exact Venmo handle with Bertrand — his QR (BLVenmo.jpg) is on his resources page
    handle: '@BertrandLaurence',
    qrImage: '/assets/venmo_qr.svg',
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Pay securely via PayPal',
    icon: '🅿️',
    primary: false,
    // Replace with actual PayPal.me link
    url: null,
  },
  {
    id: 'zelle',
    name: 'Zelle',
    description: 'Bank-to-bank transfer (US only)',
    icon: '🏦',
    primary: false,
  },
  {
    id: 'cashapp',
    name: 'Cash App',
    description: 'Quick mobile payment',
    icon: '💵',
    primary: false,
  },
  {
    id: 'wire',
    name: 'Wire Transfer / IBAN',
    description: 'International bank transfer (EU/France)',
    icon: '🌍',
    primary: false,
    note: 'Contact Bertrand for IBAN details',
  },
  {
    id: 'kofi',
    name: 'Ko-fi (Tips)',
    description: 'Show your support — any amount',
    icon: '☕',
    primary: false,
    // Replace with actual Ko-fi URL
    url: null,
  },
];

// ── Service Definitions ──
export const SERVICES = [
  {
    id: 'truebadour-tip',
    name: 'Support the Truebadour',
    subtitle: 'Pay what you want · No obligation',
    description: 'The curriculum, the AI coach, and all twelve tools are free — always. If this work has helped you, consider a tip. Like a street performer, Bertrand shares his art first and trusts the audience.',
    icon: '☕',
    duration: 'Instant',
    delivery: 'Ko-fi or any payment method below',
    color: 'var(--cf-gold)',
    pricing: [
      { label: 'Small Tip', price: 5, unit: 'one-time', stripeLink: 'https://buy.stripe.com/mock_tip_5' },
      { label: 'Generous Tip', price: 15, unit: 'one-time', stripeLink: 'https://buy.stripe.com/mock_tip_15' },
      { label: 'Patron', price: 50, unit: 'one-time', stripeLink: 'https://buy.stripe.com/mock_tip_50' },
    ],
    features: [
      'All curriculum content remains free forever',
      'Truebadour AI coach remains free forever',
      'All 12 digital tools remain free forever',
      'Tips directly support Bertrand\'s teaching',
      'No account or login required to learn',
    ],
  },
  {
    id: 'private-lesson',
    name: 'Private Guitar Lesson',
    subtitle: 'Live 1-on-1 via Zoom',
    description: 'Personalized instruction tailored to your level, goals, and musical interests. Choose any style — Blues, Folk, Swing, Classical, Rock, Jazz, or Songwriter.',
    icon: '🎸',
    duration: '60 min',
    delivery: 'Zoom (nationwide) or In-Studio (Houlton, ME)',
    color: 'var(--cf-gold)',
    pricing: [
      // Prices verified: bertrandguitarstudio.duetpartner.com (May 2026)
      // Walk-in: $65 | "Onward" 5-pack: $55×5=$275 | "Onward Forward" 10-pack: $50×10=$500
      { label: 'Single Lesson', price: 65, unit: 'session', stripeLink: 'https://buy.stripe.com/mock_private_lesson_65' },
      { label: '5-Lesson Pack — "Onward"', price: 275, unit: '5 sessions', stripeLink: 'https://buy.stripe.com/mock_private_lesson_5pack_275', badge: 'Save $50', perUnit: 55 },
      { label: '10-Lesson Pack — "Onward Forward"', price: 500, unit: '10 sessions', stripeLink: 'https://buy.stripe.com/mock_private_lesson_10pack_500', badge: 'Best Value', perUnit: 50 },
    ],
    features: [
      'Body-centered, somatic approach',
      'All ages: elementary school to seniors',
      'All styles: Blues, Folk, Jazz, Rock, Classical, Songwriter',
      'Applied theory — learn how songs actually work',
      'Animated charts, on-screen TAB & notation',
      'Teaching material to download and print',
    ],
  },
  {
    id: 'voice-coaching',
    name: 'Guitar & Voice Integrated',
    subtitle: 'The ©PLING! Method',
    description: 'The guitar becomes your voice coach and the voice your guitar instructor. Playing and singing become one thing — second nature.',
    icon: '🎤',
    duration: '60 min',
    delivery: 'Zoom or In-Studio',
    color: '#7aaa88',
    pricing: [
      { label: 'Single Session', price: 65, unit: 'session', stripeLink: 'https://buy.stripe.com/mock_voice_coaching_65' },
      { label: '5-Session Pack', price: 275, unit: '5 sessions', stripeLink: 'https://buy.stripe.com/mock_voice_coaching_5pack_275', badge: 'Save $50', perUnit: 55 },
    ],
    features: [
      'Vocal pitch training with guitar as coach',
      'Ear training, range expansion, breath work',
      'Fun vocal warm-ups and improvisation games',
      'Vocal-motor integration through guitar-singing synthesis',
      'No prior singing experience needed',
    ],
  },
  {
    id: 'quick-question',
    name: 'Quick Question',
    subtitle: 'Level 1 — Text Feedback',
    description: 'Send me a question about technique, theory, or practice strategy. I will send you a thoughtful text reply within 24 hours. The easiest way to get personalized guidance — no video required.',
    icon: '💬',
    duration: 'Text reply within 24hr',
    delivery: 'In-App Message',
    color: '#5a8aaa',
    pricing: [
      { label: 'Single Question', price: 5, unit: 'question', stripeLink: 'https://buy.stripe.com/mock_quick_question_5' },
      { label: '5-Question Pack', price: 20, unit: '5 questions', stripeLink: 'https://buy.stripe.com/mock_quick_question_5pack_20', badge: 'Save $5', perUnit: 4 },
    ],
    features: [
      'Ask anything — technique, theory, gear, practice tips',
      'Thoughtful text reply within 24 hours',
      'No video or scheduling required',
      'Perfect first step before committing to lessons',
      'I often include diagrams and references',
    ],
  },
  {
    id: 'mini-critique',
    name: 'Mini Critique',
    subtitle: 'Quick Video Feedback (À la carte)',
    description: 'Record a short clip (up to 3 minutes) and I will send back a focused video with one key thing to work on. Quick, affordable, and encouraging. Included in Apprentice+ subscriptions.',
    icon: '🎬',
    duration: '3-5 min feedback video',
    delivery: 'In-App Submission → Video Response',
    color: '#6a7aaa',
    pricing: [
      { label: 'Single Mini Critique', price: 15, unit: 'submission', stripeLink: 'https://buy.stripe.com/mock_mini_critique_15' },
      { label: '5-Pack', price: 60, unit: '5 critiques', stripeLink: 'https://buy.stripe.com/mock_mini_critique_5pack_60', badge: 'Save $15', perUnit: 12 },
    ],
    features: [
      'Submit up to 3 minutes of video',
      'I will reply with focused feedback (one key improvement)',
      'Encouraging, low-pressure format',
      'Great for checking form, posture, or a tricky passage',
      'Response within 48 hours',
      'Free for Apprentice subscribers (1/mo), Journeyman (4/mo), Master (8/mo)',
    ],
  },
  {
    id: 'full-review',
    name: 'Full Video Review',
    subtitle: 'Deep Critique (À la carte)',
    description: 'Play for 15 minutes. I will watch the entire session and record myself reacting in real time — giving you a detailed video of my recommendations, corrections, and encouragement. Like having me in the room. Included in Journeyman+ subscriptions.',
    icon: '📹',
    duration: '15-min watch + detailed reaction video',
    delivery: 'In-App Submission → Video Response',
    color: '#7b6aaa',
    pricing: [
      { label: 'Single Full Review', price: 35, unit: 'submission', stripeLink: 'https://buy.stripe.com/mock_full_review_35' },
      { label: '5-Review Pack', price: 150, unit: '5 reviews', stripeLink: 'https://buy.stripe.com/mock_full_review_5pack_150', badge: 'Save $25', perUnit: 30 },
      { label: '10-Review Pack', price: 250, unit: '10 reviews', stripeLink: 'https://buy.stripe.com/mock_full_review_10pack_250', badge: 'Best Value', perUnit: 25 },
    ],
    features: [
      'Submit up to 15 minutes of practice footage',
      'I will record myself watching and reacting in real time',
      'Detailed timestamped feedback on technique, musicality, and expression',
      'Personalized practice plan for what to work on next',
      'The closest thing to a private lesson — without scheduling',
      'Response within 48 hours',
      'Free for Journeyman subscribers (4/mo), Master (8/mo)',
    ],
  },

  {
    id: 'group-workshop',
    name: 'Group Workshop',
    subtitle: 'Small Group Learning',
    description: 'Intimate group sessions (8-15 students) in the Passim School tradition. Learn together, play together, grow together.',
    icon: '👥',
    duration: '90 min',
    delivery: 'Zoom (scheduled)',
    color: '#5a8aaa',
    pricing: [
      { label: 'Single Workshop', price: 35, unit: 'person', stripeLink: 'https://buy.stripe.com/mock_group_workshop_35' },
      { label: '4-Workshop Series', price: 120, unit: 'person/series', stripeLink: 'https://buy.stripe.com/mock_group_workshop_series_120', badge: 'Save $20', perUnit: 30 },
    ],
    features: [
      'Small group (8-15 students max)',
      'Topic-focused: Fingerstyle, Blues, CAGED, Vocal',
      'Interactive — bring your guitar and play along',
      'Meet other students and jam partners',
      'Modeled after Passim School of Music format',
    ],
  },
  {
    id: 'gift-certificate',
    name: 'Gift Certificate',
    subtitle: 'Give the Gift of Music',
    description: 'A beautiful digital gift certificate for lessons, workshops, or course access. Perfect for holidays, birthdays, and anyone who deserves to play guitar.',
    icon: '🎁',
    duration: 'Valid 12 months',
    delivery: 'PDF emailed to you or recipient',
    color: '#aa5a7a',
    pricing: [
      { label: '1 Private Lesson', price: 65, unit: 'gift', stripeLink: 'https://buy.stripe.com/mock_gift_certificate_65' },
      { label: '5-Lesson Pack', price: 275, unit: 'gift', stripeLink: 'https://buy.stripe.com/mock_gift_certificate_5pack_275', badge: 'Popular' },
      { label: '10-Lesson Pack', price: 500, unit: 'gift', stripeLink: 'https://buy.stripe.com/mock_gift_certificate_10pack_500' },
      { label: 'Custom Amount', price: null, unit: 'custom', stripeLink: 'https://buy.stripe.com/mock_gift_certificate_custom' },
    ],
    features: [
      'Beautiful PDF certificate emailed instantly',
      'Valid for 12 months',
      'Redeemable for any service',
      'Personal message included',
    ],
  },
];

// ── Bertrand's Credentials (Social Proof) ──
// All credentials verified from bertrandguitarstudio.duetpartner.com (May 2026)
// ⚠️ Do NOT add credentials without verifying against the website or asking Bertrand directly.
export const CREDENTIALS = [
  { icon: '⭐', label: 'Thumbtack Top Pro — Multi-Year Award' },
  { icon: '🎵', label: 'Instructor — Passim School of Music, Harvard Sq.' },
  { icon: '🇫🇷', label: 'Bilingual — English & French (Éducation Francophone)' },
  { icon: '🎬', label: 'Live Film Scorer — Harvard Film Archive / Carpenter Center' },
  { icon: '📰', label: '"Boston French Blues guitar wizard" — Elijah Wald, Boston Globe' },
  { icon: '🎸', label: '6-string, 12-string, Dobro Slide, Electric — Cambridge / Somerville MA' },
];

// ── Quick Access: All accepted styles ──
export const STYLES = [
  'Blues', 'Folk', 'Swing', 'Classical', 'Rock', 
  'Songwriter', 'Jazz', 'Ragtime', 'Fingerstyle',
];

// ── Quick Access: Age ranges ──
export const AGE_RANGES = [
  'Kids (8+)', 'Teens', 'Adults', 'Seniors', 'All Ages Welcome',
];
