// ═══════════════════════════════════════════════════════════
// PRICING & REVENUE DATA — Bertrand's Income Streams
//
// STRATEGY: The 12-chapter Living Textbook is 100% FREE.
// It's the culture-building marketing funnel that creates
// long-term students. Revenue comes from live coaching,
// async feedback, community membership, and the future
// VR/AI Masterclass product.
// ═══════════════════════════════════════════════════════════

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
    subtitle: 'Level 2 — Quick Video Feedback',
    description: 'Record a short clip (up to 3 minutes) and I will send back a focused video with one key thing to work on. Quick, affordable, and encouraging.',
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
    ],
  },
  {
    id: 'full-review',
    name: 'Full Video Review',
    subtitle: 'Level 3 — Deep Critique',
    description: 'Play for 15 minutes. I will watch the entire session and record myself reacting in real time — giving you a detailed video of my recommendations, corrections, and encouragement. Like having me in the room.',
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
    ],
  },
  {
    id: 'guild-membership',
    name: 'The Guild',
    subtitle: 'Online Community Hub',
    description: 'The curriculum, tools, and AI coach are free. Join The Guild to connect with a community of fellow learners, share your recordings, and practice in a safe, encouraging environment.',
    icon: '⭐',
    duration: 'Monthly recurring',
    delivery: 'In-App Community Hub Access',
    color: '#d4a84b',
    pricing: [
      { label: 'Monthly Subscription', price: 1.00, unit: 'month', stripeLink: 'https://buy.stripe.com/mock_community_1', recurring: true },
    ],
    features: [
      'Access to the online community hub & discussion boards',
      'Share practice recordings & progress with fellow students',
      'Find virtual jam partners and learning buddies',
      'Structured accountability challenges & community feedback',
    ],
  },
  {
    id: 'inner-circle-membership',
    name: 'The Inner Circle',
    subtitle: 'Mentorship Blog & Insights',
    description: 'Direct access to Bertrand\'s daily mentorship feed. Get interesting daily guitar news, historical context, practice meditations, and exclusive technique videos directly from Bertrand.',
    icon: '👑',
    duration: 'Monthly recurring',
    delivery: 'Mentorship Blog Feed + Q&A Priority',
    color: '#7b6aaa',
    pricing: [
      { label: 'Monthly Subscription', price: 5.00, unit: 'month', stripeLink: 'https://buy.stripe.com/mock_inner_circle_5', recurring: true },
    ],
    features: [
      'Daily blog feed with guitar history, theory, and advice',
      'Daily practice reflections and somatic meditations',
      'Exclusive bite-sized video lessons & technique checks',
      'Priority comment Q&A directly with Bertrand on the feed',
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
