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
    baseUrl: null, // e.g., 'https://buy.stripe.com/...'
  },
  {
    id: 'venmo',
    name: 'Venmo',
    description: 'Send to @BertrandLaurence',
    icon: '📱',
    primary: true,
    // ⚠️ Verify exact Venmo handle with Bertrand — his QR (BLVenmo.jpg) is on his resources page
    handle: '@BertrandLaurence',
    qrImage: '/assets/venmo_qr.png',
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
    id: 'private-lesson',
    name: 'Private Guitar Lesson',
    subtitle: 'Live 1-on-1 via Zoom',
    description: 'Personalized instruction tailored to your level, goals, and musical interests. Choose any style — Blues, Folk, Swing, Classical, Rock, Jazz, or Songwriter.',
    icon: '🎸',
    duration: '60 min',
    delivery: 'Zoom (nationwide) or In-Studio (Houlton, ME)',
    color: '#c9a96e',
    pricing: [
      // Prices verified: bertrandguitarstudio.duetpartner.com (May 2026)
      // Walk-in: $65 | "Onward" 5-pack: $55×5=$275 | "Onward Forward" 10-pack: $50×10=$500
      { label: 'Single Lesson', price: 65, unit: 'session', stripeLink: null },
      { label: '5-Lesson Pack — "Onward"', price: 275, unit: '5 sessions', stripeLink: null, badge: 'Save $50', perUnit: 55 },
      { label: '10-Lesson Pack — "Onward Forward"', price: 500, unit: '10 sessions', stripeLink: null, badge: 'Best Value', perUnit: 50 },
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
      { label: 'Single Session', price: 65, unit: 'session', stripeLink: null },
      { label: '5-Session Pack', price: 275, unit: '5 sessions', stripeLink: null, badge: 'Save $50', perUnit: 55 },
    ],
    features: [
      'Vocal pitch training with guitar as coach',
      'Ear training, range expansion, breath work',
      'Fun vocal warm-ups and improvisation games',
      'Based on Berklee vocal pedagogy',
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
      { label: 'Single Question', price: 5, unit: 'question', stripeLink: null },
      { label: '5-Question Pack', price: 20, unit: '5 questions', stripeLink: null, badge: 'Save $5', perUnit: 4 },
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
      { label: 'Single Mini Critique', price: 15, unit: 'submission', stripeLink: null },
      { label: '5-Pack', price: 60, unit: '5 critiques', stripeLink: null, badge: 'Save $15', perUnit: 12 },
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
      { label: 'Single Full Review', price: 35, unit: 'submission', stripeLink: null },
      { label: '5-Review Pack', price: 150, unit: '5 reviews', stripeLink: null, badge: 'Save $25', perUnit: 30 },
      { label: '10-Review Pack', price: 250, unit: '10 reviews', stripeLink: null, badge: 'Best Value', perUnit: 25 },
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
    id: 'membership',
    name: 'Inner Circle Membership',
    subtitle: 'Community + Coaching Perks',
    description: 'Monthly live group Q&A with me, priority async review queue, downloadable practice materials, and community access. The textbook is always free — this is for students who want direct access to my ongoing guidance.',
    icon: '⭐',
    duration: 'Monthly recurring',
    delivery: 'Zoom Group Q&A + Priority Access',
    color: '#d4a84b',
    pricing: [
      { label: 'Monthly', price: 25, unit: 'month', stripeLink: null, recurring: true },
      { label: 'Annual', price: 199, unit: 'year', stripeLink: null, recurring: true, badge: 'Save 34%', perUnit: 16.58 },
    ],
    features: [
      'Monthly live group Q&A with me (Zoom)',
      'Priority queue for async video reviews',
      'Downloadable practice materials (Vertiscales, chord maps, TABs)',
      'Community forum access',
      'Early access to new content and workshops',
      'Discounts on private lessons and workshops',
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
      { label: 'Single Workshop', price: 35, unit: 'person', stripeLink: null },
      { label: '4-Workshop Series', price: 120, unit: 'person/series', stripeLink: null, badge: 'Save $20', perUnit: 30 },
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
      { label: '1 Private Lesson', price: 65, unit: 'gift', stripeLink: null },
      { label: '5-Lesson Pack', price: 275, unit: 'gift', stripeLink: null, badge: 'Popular' },
      { label: '10-Lesson Pack', price: 500, unit: 'gift', stripeLink: null },
      { label: 'Custom Amount', price: null, unit: 'custom', stripeLink: null },
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
