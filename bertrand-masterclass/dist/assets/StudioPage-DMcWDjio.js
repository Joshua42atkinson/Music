import{k as x,r as l,j as e,m as n,A as m}from"./index-CL_oGdFf.js";const w=[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]],g=x("chevron-down",w);const k=[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]],f=x("chevron-up",k),j=[{id:"stripe",name:"Credit / Debit Card",description:"Visa, Mastercard, Amex, Apple Pay, Google Pay",icon:"💳",primary:!0,baseUrl:"https://buy.stripe.com/mock_voix_vive"},{id:"venmo",name:"Venmo",description:"Send to @BertrandLaurence",icon:"📱",primary:!0,handle:"@BertrandLaurence",qrImage:"/assets/venmo_qr.png"},{id:"paypal",name:"PayPal",description:"Pay securely via PayPal",icon:"🅿️",primary:!1,url:null},{id:"zelle",name:"Zelle",description:"Bank-to-bank transfer (US only)",icon:"🏦",primary:!1},{id:"cashapp",name:"Cash App",description:"Quick mobile payment",icon:"💵",primary:!1},{id:"wire",name:"Wire Transfer / IBAN",description:"International bank transfer (EU/France)",icon:"🌍",primary:!1,note:"Contact Bertrand for IBAN details"},{id:"kofi",name:"Ko-fi (Tips)",description:"Show your support — any amount",icon:"☕",primary:!1,url:null}],N=[{id:"private-lesson",name:"Private Guitar Lesson",subtitle:"Live 1-on-1 via Zoom",description:"Personalized instruction tailored to your level, goals, and musical interests. Choose any style — Blues, Folk, Swing, Classical, Rock, Jazz, or Songwriter.",icon:"🎸",duration:"60 min",delivery:"Zoom (nationwide) or In-Studio (Houlton, ME)",color:"#c9a96e",pricing:[{label:"Single Lesson",price:65,unit:"session",stripeLink:"https://buy.stripe.com/mock_private_lesson_65"},{label:'5-Lesson Pack — "Onward"',price:275,unit:"5 sessions",stripeLink:"https://buy.stripe.com/mock_private_lesson_5pack_275",badge:"Save $50",perUnit:55},{label:'10-Lesson Pack — "Onward Forward"',price:500,unit:"10 sessions",stripeLink:"https://buy.stripe.com/mock_private_lesson_10pack_500",badge:"Best Value",perUnit:50}],features:["Body-centered, somatic approach","All ages: elementary school to seniors","All styles: Blues, Folk, Jazz, Rock, Classical, Songwriter","Applied theory — learn how songs actually work","Animated charts, on-screen TAB & notation","Teaching material to download and print"]},{id:"voice-coaching",name:"Guitar & Voice Integrated",subtitle:"The ©PLING! Method",description:"The guitar becomes your voice coach and the voice your guitar instructor. Playing and singing become one thing — second nature.",icon:"🎤",duration:"60 min",delivery:"Zoom or In-Studio",color:"#7aaa88",pricing:[{label:"Single Session",price:65,unit:"session",stripeLink:"https://buy.stripe.com/mock_voice_coaching_65"},{label:"5-Session Pack",price:275,unit:"5 sessions",stripeLink:"https://buy.stripe.com/mock_voice_coaching_5pack_275",badge:"Save $50",perUnit:55}],features:["Vocal pitch training with guitar as coach","Ear training, range expansion, breath work","Fun vocal warm-ups and improvisation games","Based on Berklee vocal pedagogy","No prior singing experience needed"]},{id:"quick-question",name:"Quick Question",subtitle:"Level 1 — Text Feedback",description:"Send me a question about technique, theory, or practice strategy. I will send you a thoughtful text reply within 24 hours. The easiest way to get personalized guidance — no video required.",icon:"💬",duration:"Text reply within 24hr",delivery:"In-App Message",color:"#5a8aaa",pricing:[{label:"Single Question",price:5,unit:"question",stripeLink:"https://buy.stripe.com/mock_quick_question_5"},{label:"5-Question Pack",price:20,unit:"5 questions",stripeLink:"https://buy.stripe.com/mock_quick_question_5pack_20",badge:"Save $5",perUnit:4}],features:["Ask anything — technique, theory, gear, practice tips","Thoughtful text reply within 24 hours","No video or scheduling required","Perfect first step before committing to lessons","I often include diagrams and references"]},{id:"mini-critique",name:"Mini Critique",subtitle:"Level 2 — Quick Video Feedback",description:"Record a short clip (up to 3 minutes) and I will send back a focused video with one key thing to work on. Quick, affordable, and encouraging.",icon:"🎬",duration:"3-5 min feedback video",delivery:"In-App Submission → Video Response",color:"#6a7aaa",pricing:[{label:"Single Mini Critique",price:15,unit:"submission",stripeLink:"https://buy.stripe.com/mock_mini_critique_15"},{label:"5-Pack",price:60,unit:"5 critiques",stripeLink:"https://buy.stripe.com/mock_mini_critique_5pack_60",badge:"Save $15",perUnit:12}],features:["Submit up to 3 minutes of video","I will reply with focused feedback (one key improvement)","Encouraging, low-pressure format","Great for checking form, posture, or a tricky passage","Response within 48 hours"]},{id:"full-review",name:"Full Video Review",subtitle:"Level 3 — Deep Critique",description:"Play for 15 minutes. I will watch the entire session and record myself reacting in real time — giving you a detailed video of my recommendations, corrections, and encouragement. Like having me in the room.",icon:"📹",duration:"15-min watch + detailed reaction video",delivery:"In-App Submission → Video Response",color:"#7b6aaa",pricing:[{label:"Single Full Review",price:35,unit:"submission",stripeLink:"https://buy.stripe.com/mock_full_review_35"},{label:"5-Review Pack",price:150,unit:"5 reviews",stripeLink:"https://buy.stripe.com/mock_full_review_5pack_150",badge:"Save $25",perUnit:30},{label:"10-Review Pack",price:250,unit:"10 reviews",stripeLink:"https://buy.stripe.com/mock_full_review_10pack_250",badge:"Best Value",perUnit:25}],features:["Submit up to 15 minutes of practice footage","I will record myself watching and reacting in real time","Detailed timestamped feedback on technique, musicality, and expression","Personalized practice plan for what to work on next","The closest thing to a private lesson — without scheduling","Response within 48 hours"]},{id:"membership",name:"Inner Circle Membership",subtitle:"Community + Coaching Perks",description:"Monthly live group Q&A with me, priority async review queue, downloadable practice materials, and community access. The textbook is always free — this is for students who want direct access to my ongoing guidance.",icon:"⭐",duration:"Monthly recurring",delivery:"Zoom Group Q&A + Priority Access",color:"#d4a84b",pricing:[{label:"Monthly",price:25,unit:"month",stripeLink:"https://buy.stripe.com/mock_membership_monthly_25",recurring:!0},{label:"Annual",price:199,unit:"year",stripeLink:"https://buy.stripe.com/mock_membership_annual_199",recurring:!0,badge:"Save 34%",perUnit:16.58}],features:["Monthly live group Q&A with me (Zoom)","Priority queue for async video reviews","Downloadable practice materials (Vertiscales, chord maps, TABs)","Community forum access","Early access to new content and workshops","Discounts on private lessons and workshops"]},{id:"group-workshop",name:"Group Workshop",subtitle:"Small Group Learning",description:"Intimate group sessions (8-15 students) in the Passim School tradition. Learn together, play together, grow together.",icon:"👥",duration:"90 min",delivery:"Zoom (scheduled)",color:"#5a8aaa",pricing:[{label:"Single Workshop",price:35,unit:"person",stripeLink:"https://buy.stripe.com/mock_group_workshop_35"},{label:"4-Workshop Series",price:120,unit:"person/series",stripeLink:"https://buy.stripe.com/mock_group_workshop_series_120",badge:"Save $20",perUnit:30}],features:["Small group (8-15 students max)","Topic-focused: Fingerstyle, Blues, CAGED, Vocal","Interactive — bring your guitar and play along","Meet other students and jam partners","Modeled after Passim School of Music format"]},{id:"gift-certificate",name:"Gift Certificate",subtitle:"Give the Gift of Music",description:"A beautiful digital gift certificate for lessons, workshops, or course access. Perfect for holidays, birthdays, and anyone who deserves to play guitar.",icon:"🎁",duration:"Valid 12 months",delivery:"PDF emailed to you or recipient",color:"#aa5a7a",pricing:[{label:"1 Private Lesson",price:65,unit:"gift",stripeLink:"https://buy.stripe.com/mock_gift_certificate_65"},{label:"5-Lesson Pack",price:275,unit:"gift",stripeLink:"https://buy.stripe.com/mock_gift_certificate_5pack_275",badge:"Popular"},{label:"10-Lesson Pack",price:500,unit:"gift",stripeLink:"https://buy.stripe.com/mock_gift_certificate_10pack_500"},{label:"Custom Amount",price:null,unit:"custom",stripeLink:"https://buy.stripe.com/mock_gift_certificate_custom"}],features:["Beautiful PDF certificate emailed instantly","Valid for 12 months","Redeemable for any service","Personal message included"]}],S=[{icon:"⭐",label:"Thumbtack Top Pro — Multi-Year Award"},{icon:"🎵",label:"Instructor — Passim School of Music, Harvard Sq."},{icon:"🇫🇷",label:"Bilingual — English & French (Éducation Francophone)"},{icon:"🎬",label:"Live Film Scorer — Harvard Film Archive / Carpenter Center"},{icon:"📰",label:'"Boston French Blues guitar wizard" — Elijah Wald, Boston Globe'},{icon:"🎸",label:"6-string, 12-string, Dobro Slide, Electric — Cambridge / Somerville MA"}],B=["Blues","Folk","Swing","Classical","Rock","Songwriter","Jazz","Ragtime","Fingerstyle"],s=[{id:1,quote:"Bertrand is an excellent instructor. He teaches the 'why' behind the 'how'. I have been able to apply that knowledge to learn songs outside of the class lessons. When a student has a question, Bertrand will ask questions of the student, leading them on a path toward their own discovery.",author:"J.W.",context:"Passim Group Class",rating:5},{id:2,quote:"I've studied guitar with Bertrand for one year. He is an exceptional teacher. He treats you as a unique individual, and the lessons are tailored for you. I have failed in learning how to play the guitar with several teachers in the past. Now, I am writing songs and playing the guitar again. This time I believe in myself and the power of songs.",author:"Limin",context:"Private Student",rating:5},{id:3,quote:"Just started working with Bertrand; already super impressed with his teaching style! He gives you everything in bites... Not too much to overwhelm; just enough to bring you to that next step.",author:"B.P.",context:"New Student",rating:5},{id:4,quote:"You are an excellent voice teacher! Who knew? It wasn't just the information but from the very first class your energy. It set me straight on my own priorities from that very first class. Let's just say it was transformative for me and I am so very grateful.",author:"N.B.",context:"Guitar & Voice Course",rating:5},{id:5,quote:"He is an excellent teacher who brings a high level of commitment and enthusiasm to his sessions. He uses a holistic approach covering the theoretical, technical and even the ergonomic aspects of guitar playing. I particularly enjoyed his harmony class which gave me a solid rudimentary understanding of how chord progressions are built, allowing me to begin improvising. Highly recommended.",author:"Chris H.",context:"Passim & Private Studio",rating:5},{id:6,quote:"Bertrand's teaching style is contagious. His passion, knowledge and curiosity guide his lessons. Classes always start with a plan but often divert to different areas of musicianship. In the end each student is enriched and challenged.",author:"Lee K.",context:"Passim Group Class",rating:5},{id:7,quote:"Now we're moving into singing and hearing, and hearing and singing, developing a full understanding of the guitar and voice together through playing simple songs very carefully. Quite good stuff. As a teacher, Bertrand's commitment to holistic teaching and learning is quite appealing.",author:"K.McC.",context:"Guitar & Voice Course",rating:5},{id:8,quote:"He is an amazing guitar player. He communicates his deep knowledge of and passion for music at a level that people with a range of skills can understand. He is playful, flexible, fun, and challenges us without being intense. A wonderful teacher who I highly recommend!",author:"Polly H.",context:"Group Class Student",rating:5},{id:9,quote:"He is an amazing guitar player, a wonderful teacher and a great person! He really geared my individual lessons to my level so I could learn the type of music I taught. I would recommend him as a great teacher.",author:"Emily S.",context:"Passim & Private Student",rating:5},{id:10,quote:"Bertrand is fantastic. His knowledge and skill are immense, and his style of teaching is laid back and approachable.",author:"David S.",context:"Private Student",rating:5},{id:11,quote:"Great musician. Excellent teacher for all levels.",author:"John P.",context:"Student",rating:5},{id:12,quote:"Bertrand is a fantastic teacher who's expanded my understanding of music and guitar more than any other teacher, book, or reference that I've ever come across before.",author:"Michael L.",context:"Private Student",rating:5},{id:13,quote:"This was by far the best class I have had at Passim. Thanks Bertrand.",author:"J.W.",context:"Passim School of Music",rating:5}],_=[{q:"What do I need for online lessons?",a:"A guitar, a computer or phone with a camera, and a Zoom account (free). Bertrand provides all teaching materials digitally."},{q:"Do I need any musical experience?",a:"Absolutely not. Bertrand teaches complete beginners through advanced players. Every lesson is tailored to your level and goals."},{q:"What styles does Bertrand teach?",a:"Blues, Folk, Swing, Classical, Rock, Songwriter Arrangements, elements of Jazz, Accompaniment, and Electric guitar. You choose songs and styles you love."},{q:"What ages do you teach?",a:"All ages — from young children (using Ukulele as a starting instrument) to seniors. Guitar is for everyone."},{q:"What is the cancellation policy?",a:'24-hour notice is required for cancellations. If you cancel within 24 hours, the session fee is still owed. As Bertrand notes: "Illness is the most heeded of doctors."'},{q:"How much does a private lesson cost?",a:'A single 60-minute lesson is $65 (walk-in rate). Save with the "Onward" 5-lesson pack at $55/session ($275 total), or the "Onward Forward" 10-lesson pack at $50/session ($500 total). Tips are always welcome via Venmo.'},{q:"Do you offer lessons in French?",a:"Oui! Bertrand is bilingual and offers full instruction in French — guitar, voice, theory, and his signature Atelier-Chanson (Song Workshop) for French-speaking classes and communities."},{q:"Does Bertrand teach voice as well as guitar?",a:'Yes — his "Guitar & Voice Integrated" course is one of his signature offerings: "The guitar becomes your voice coach and the voice your guitar instructor. The act of playing and singing will become one thing and second nature."'},{q:"How does async video coaching work?",a:"Record yourself practicing (30–90 seconds), submit it through the app, and receive a personalized video critique from Bertrand. Great for checking form, posture, or a tricky passage between live sessions."},{q:"Can I buy lessons as a gift?",a:"Yes! Bertrand offers gift certificates for lessons. Contact him directly at BertLarryMusic@gmail.com or 617-447-5575."}],q={"private-lesson":"🎸","voice-coaching":"🎤","quick-question":"💬","mini-critique":"🎬","full-review":"📹",membership:"⭐","group-workshop":"👥","gift-certificate":"🎁"};function C(){const[y,b]=l.useState(null),[o,u]=l.useState(0),[c,v]=l.useState(null),d=l.useRef(null);l.useEffect(()=>(d.current=setInterval(()=>{u(i=>(i+1)%s.length)},6e3),()=>clearInterval(d.current)),[]);const p=(i,a)=>{i?window.open(i,"_blank"):document.getElementById("payment-methods")?.scrollIntoView({behavior:"smooth"})};return e.jsxs("div",{className:"studio-page relative",children:[e.jsx("style",{children:`
        .studio-page {
          background: linear-gradient(180deg, #0d0d14 0%, #1a120b 30%, #0a0a14 100%);
          color: #e8dcc8;
          font-family: 'Inter', sans-serif;
          padding-bottom: 100px;
        }

        /* ── Hero Section ── */
        .studio-hero {
          position: relative;
          padding: 48px 24px 40px;
          text-align: center;
          overflow: hidden;
        }
        .studio-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at top, rgba(201,169,110,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .studio-hero-photo {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid rgba(201,169,110,0.4);
          margin: 0 auto 20px;
          box-shadow: 0 0 40px rgba(201,169,110,0.15);
        }
        .studio-hero h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 7vw, 2.8rem);
          font-weight: 400;
          color: #f0e6d2;
          margin: 0 0 8px;
          letter-spacing: 0.02em;
        }
        .studio-hero-subtitle {
          font-family: 'EB Garamond', serif;
          font-style: italic;
          color: #7aaa88;
          font-size: 1.05rem;
          margin: 0 0 20px;
        }
        .studio-credentials {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
          margin-bottom: 24px;
        }
        .studio-credential {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 12px;
          border-radius: 20px;
          background: rgba(201,169,110,0.08);
          border: 1px solid rgba(201,169,110,0.15);
          font-size: 0.72rem;
          color: #c9a96e;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          font-family: 'JetBrains Mono', monospace;
        }
        .studio-styles {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 6px;
          max-width: 400px;
          margin: 0 auto;
        }
        .studio-style-tag {
          padding: 3px 10px;
          border-radius: 12px;
          background: rgba(122,170,136,0.08);
          border: 1px solid rgba(122,170,136,0.2);
          font-size: 0.7rem;
          color: #7aaa88;
          letter-spacing: 0.03em;
        }

        /* ── Section Headers ── */
        .studio-section {
          padding: 40px 20px;
          max-width: 600px;
          margin: 0 auto;
        }
        .studio-section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem;
          font-weight: 400;
          color: #f0e6d2;
          text-align: center;
          margin: 0 0 8px;
        }
        .studio-section-subtitle {
          text-align: center;
          color: #6a7a8a;
          font-size: 0.85rem;
          margin: 0 0 28px;
          font-style: italic;
          font-family: 'EB Garamond', serif;
        }

        /* ── Service Cards ── */
        .service-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(201,169,110,0.12);
          border-radius: 16px;
          margin-bottom: 12px;
          overflow: hidden;
          transition: all 0.3s;
        }
        .service-card:hover, .service-card.expanded {
          border-color: rgba(201,169,110,0.3);
          background: rgba(255,255,255,0.05);
        }
        .service-card-header {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px 20px;
          cursor: pointer;
          user-select: none;
        }
        .service-icon {
          font-size: 1.8rem;
          flex-shrink: 0;
        }
        .service-info {
          flex: 1;
          min-width: 0;
        }
        .service-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          color: #f0e6d2;
          margin: 0;
          line-height: 1.2;
        }
        .service-subtitle {
          font-size: 0.75rem;
          color: #6a7a8a;
          margin: 2px 0 0;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-family: 'JetBrains Mono', monospace;
        }
        .service-from-price {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
          color: #c9a96e;
          flex-shrink: 0;
        }
        .service-expand-icon {
          color: #5a6a7a;
          flex-shrink: 0;
          transition: transform 0.2s;
        }

        /* ── Expanded Service ── */
        .service-expanded {
          padding: 0 20px 20px;
        }
        .service-description {
          font-size: 0.9rem;
          color: #a0a8b8;
          line-height: 1.7;
          margin: 0 0 16px;
          font-family: 'EB Garamond', serif;
          font-size: 1rem;
        }
        .service-meta {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .service-meta-item {
          font-size: 0.72rem;
          color: #7a8a9a;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-family: 'JetBrains Mono', monospace;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .service-features {
          list-style: none;
          padding: 0;
          margin: 0 0 20px;
        }
        .service-features li {
          font-size: 0.85rem;
          color: #8a9aaa;
          padding: 4px 0;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }
        .service-features li::before {
          content: '✓';
          color: #7aaa88;
          font-weight: bold;
          flex-shrink: 0;
        }

        /* ── Pricing Options ── */
        .pricing-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .pricing-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          background: rgba(201,169,110,0.05);
          border: 1px solid rgba(201,169,110,0.15);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .pricing-option:hover {
          background: rgba(201,169,110,0.12);
          border-color: rgba(201,169,110,0.3);
        }
        .pricing-option:active {
          transform: scale(0.98);
        }
        .pricing-label {
          font-size: 0.85rem;
          color: #e0d8c8;
        }
        .pricing-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .pricing-badge {
          padding: 2px 8px;
          border-radius: 6px;
          background: rgba(122,170,136,0.15);
          color: #7aaa88;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-family: 'JetBrains Mono', monospace;
        }
        .pricing-amount {
          font-family: 'JetBrains Mono', monospace;
          font-size: 1rem;
          color: #c9a96e;
          font-weight: 600;
        }
        .pricing-per-unit {
          font-size: 0.65rem;
          color: #6a7a8a;
          margin-top: 2px;
        }

        /* ── Testimonials ── */
        .testimonial-card {
          background: rgba(201,169,110,0.05);
          border: 1px solid rgba(201,169,110,0.15);
          border-radius: 16px;
          padding: 28px 24px;
          text-align: center;
          min-height: 200px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .testimonial-stars {
          color: #c9a96e;
          font-size: 1rem;
          margin-bottom: 16px;
          letter-spacing: 4px;
        }
        .testimonial-quote {
          font-family: 'EB Garamond', serif;
          font-style: italic;
          font-size: 1.05rem;
          line-height: 1.7;
          color: #c8c0b0;
          margin: 0 0 16px;
        }
        .testimonial-author {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.72rem;
          color: #c9a96e;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .testimonial-context {
          font-size: 0.7rem;
          color: #5a6a7a;
          margin-top: 4px;
        }
        .testimonial-dots {
          display: flex;
          justify-content: center;
          gap: 6px;
          margin-top: 20px;
        }
        .testimonial-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          cursor: pointer;
          transition: all 0.3s;
        }
        .testimonial-dot.active {
          width: 20px;
          border-radius: 3px;
          background: #c9a96e;
        }

        /* ── Payment Methods ── */
        .payment-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        .payment-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          text-align: center;
          transition: all 0.2s;
        }
        .payment-card.primary {
          border-color: rgba(201,169,110,0.25);
          background: rgba(201,169,110,0.05);
        }
        .payment-icon {
          font-size: 1.6rem;
          margin-bottom: 6px;
        }
        .payment-name {
          font-size: 0.8rem;
          color: #d0c8b8;
          font-weight: 500;
          margin-bottom: 2px;
        }
        .payment-desc {
          font-size: 0.65rem;
          color: #5a6a7a;
        }

        /* ── FAQ ── */
        .faq-item {
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .faq-question {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 0;
          cursor: pointer;
          user-select: none;
        }
        .faq-question span {
          font-size: 0.95rem;
          color: #d0c8b8;
          font-family: 'EB Garamond', serif;
        }
        .faq-answer {
          font-size: 0.85rem;
          color: #8a9aaa;
          line-height: 1.7;
          padding: 0 0 18px;
        }

        /* ── CTA Banner ── */
        .cta-banner {
          background: linear-gradient(135deg, rgba(201,169,110,0.15), rgba(122,170,136,0.1));
          border: 1px solid rgba(201,169,110,0.25);
          border-radius: 16px;
          padding: 28px 24px;
          text-align: center;
        }
        .cta-banner h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem;
          color: #f0e6d2;
          margin: 0 0 8px;
        }
        .cta-banner p {
          font-size: 0.85rem;
          color: #8a9aaa;
          margin: 0 0 20px;
          font-family: 'EB Garamond', serif;
          font-style: italic;
        }
        .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 32px;
          border-radius: 12px;
          background: #c9a96e;
          color: #0d0d14;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
        }
        .cta-button:hover {
          background: #e0d0aa;
          box-shadow: 0 0 30px rgba(201,169,110,0.3);
        }
        .cta-button:active {
          transform: scale(0.97);
        }
        .cta-button-secondary {
          background: transparent;
          border: 1px solid rgba(201,169,110,0.3);
          color: #c9a96e;
          margin-left: 8px;
        }
        .cta-button-secondary:hover {
          background: rgba(201,169,110,0.1);
        }

        /* ── French Section ── */
        .french-section {
          background: rgba(0,50,120,0.08);
          border: 1px solid rgba(100,150,255,0.12);
          border-radius: 16px;
          padding: 24px;
          text-align: center;
        }
        .french-flag {
          font-size: 2rem;
          margin-bottom: 12px;
        }
      `}),e.jsxs("section",{className:"studio-hero",children:[e.jsx(n.img,{src:"/assets/bertrand_profile.jpg",alt:"Bertrand Laurence",className:"studio-hero-photo",initial:{opacity:0,scale:.8},animate:{opacity:1,scale:1},transition:{duration:.6}}),e.jsx(n.h1,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.2,duration:.5},children:"Bertrand Laurence"}),e.jsx(n.p,{className:"studio-hero-subtitle",initial:{opacity:0},animate:{opacity:1},transition:{delay:.4},children:"Body-centered guitar & voice instruction for all ages and styles"}),e.jsx(n.div,{className:"studio-credentials",initial:{opacity:0},animate:{opacity:1},transition:{delay:.5},children:S.slice(0,4).map((i,a)=>e.jsxs("span",{className:"studio-credential",children:[e.jsx("span",{children:i.icon})," ",i.label]},a))}),e.jsx(n.div,{className:"studio-styles",initial:{opacity:0},animate:{opacity:1},transition:{delay:.6},children:B.map((i,a)=>e.jsx("span",{className:"studio-style-tag",children:i},a))})]}),e.jsx("section",{className:"studio-section",style:{paddingTop:0},children:e.jsxs("div",{className:"cta-banner",children:[e.jsx("h3",{children:"🎸 First Lesson — Special Rate"}),e.jsx("p",{children:'"Give you everything in bites... just enough to bring you to that next step."'}),e.jsx("button",{className:"cta-button",onClick:()=>p(null),children:"Book Trial Lesson — $45"})]})}),e.jsxs("section",{className:"studio-section",children:[e.jsx("h2",{className:"studio-section-title",children:"Services & Pricing"}),e.jsx("p",{className:"studio-section-subtitle",children:"Choose what works for your schedule and learning style"}),N.map(i=>{const a=y===i.id,h=i.pricing.filter(t=>t.price!==null).reduce((t,r)=>Math.min(t,r.price),1/0);return e.jsxs("div",{className:`service-card ${a?"expanded":""}`,children:[e.jsxs("div",{className:"service-card-header",onClick:()=>b(a?null:i.id),children:[e.jsx("span",{className:"service-icon",children:q[i.id]||i.icon}),e.jsxs("div",{className:"service-info",children:[e.jsx("h3",{className:"service-name",children:i.name}),e.jsx("p",{className:"service-subtitle",children:i.subtitle})]}),e.jsx("span",{className:"service-from-price",children:h<1/0?`$${h}`:"Custom"}),a?e.jsx(f,{size:18,className:"service-expand-icon"}):e.jsx(g,{size:18,className:"service-expand-icon"})]}),e.jsx(m,{children:a&&e.jsxs(n.div,{className:"service-expanded",initial:{height:0,opacity:0},animate:{height:"auto",opacity:1},exit:{height:0,opacity:0},transition:{duration:.25},children:[e.jsx("p",{className:"service-description",children:i.description}),e.jsxs("div",{className:"service-meta",children:[e.jsxs("span",{className:"service-meta-item",children:["⏱ ",i.duration]}),e.jsxs("span",{className:"service-meta-item",children:["📍 ",i.delivery]})]}),e.jsx("ul",{className:"service-features",children:i.features.map((t,r)=>e.jsx("li",{children:t},r))}),e.jsx("div",{className:"pricing-options",children:i.pricing.map((t,r)=>e.jsxs("div",{className:"pricing-option",onClick:()=>p(t.stripeLink),children:[e.jsxs("div",{children:[e.jsx("div",{className:"pricing-label",children:t.label}),t.perUnit&&e.jsxs("div",{className:"pricing-per-unit",children:["$",t.perUnit,"/session"]})]}),e.jsxs("div",{className:"pricing-right",children:[t.badge&&e.jsx("span",{className:"pricing-badge",children:t.badge}),e.jsx("span",{className:"pricing-amount",children:t.price!==null?`$${t.price}`:"Contact"})]})]},r))})]})})]},i.id)})]}),e.jsxs("section",{className:"studio-section",children:[e.jsx("h2",{className:"studio-section-title",children:"What Students Say"}),e.jsxs("p",{className:"studio-section-subtitle",children:[s.length," reviews from private students and Passim School of Music"]}),e.jsx(m,{mode:"wait",children:e.jsxs(n.div,{className:"testimonial-card",initial:{opacity:0,x:30},animate:{opacity:1,x:0},exit:{opacity:0,x:-30},transition:{duration:.4},children:[e.jsx("div",{className:"testimonial-stars",children:"★★★★★"}),e.jsxs("p",{className:"testimonial-quote",children:['"',s[o].quote,'"']}),e.jsxs("div",{className:"testimonial-author",children:["— ",s[o].author]}),e.jsx("div",{className:"testimonial-context",children:s[o].context})]},o)}),e.jsx("div",{className:"testimonial-dots",children:s.map((i,a)=>e.jsx("div",{className:`testimonial-dot ${a===o?"active":""}`,onClick:()=>{u(a),clearInterval(d.current)}},a))})]}),e.jsxs("section",{className:"studio-section",id:"payment-methods",children:[e.jsx("h2",{className:"studio-section-title",children:"Ways to Pay"}),e.jsx("p",{className:"studio-section-subtitle",children:"Choose whichever method is easiest for you"}),e.jsx("div",{className:"payment-grid",children:j.filter(i=>i.id!=="wire").map(i=>e.jsxs("div",{className:`payment-card ${i.primary?"primary":""}`,children:[e.jsx("span",{className:"payment-icon",children:i.icon}),e.jsx("span",{className:"payment-name",children:i.name}),e.jsx("span",{className:"payment-desc",children:i.description})]},i.id))})]}),e.jsxs("section",{className:"studio-section",id:"free-resources",children:[e.jsx("h2",{className:"studio-section-title",children:"Free Resources"}),e.jsx("p",{className:"studio-section-subtitle",children:"Download Bertrand's teaching materials — yours to keep"}),e.jsx("style",{children:`
          .downloads-group { margin-bottom: 24px; }
          .downloads-group-label {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.55rem;
            letter-spacing: 0.25em;
            text-transform: uppercase;
            color: rgba(201,169,110,0.5);
            margin-bottom: 10px;
          }
          .download-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 13px 16px;
            background: rgba(255,255,255,0.02);
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 10px;
            margin-bottom: 8px;
            text-decoration: none;
            color: #d0c8b8;
            transition: all 0.2s;
          }
          .download-item:hover {
            background: rgba(201,169,110,0.07);
            border-color: rgba(201,169,110,0.2);
            color: #f0e6d2;
          }
          .download-icon { font-size: 1.2rem; flex-shrink: 0; }
          .download-name { flex: 1; font-size: 0.85rem; font-family: 'EB Garamond', serif; }
          .download-type {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.55rem;
            letter-spacing: 0.1em;
            color: #7aaa88;
            text-transform: uppercase;
            background: rgba(122,170,136,0.1);
            padding: 2px 7px;
            border-radius: 4px;
          }
          .venmo-block {
            display: flex; align-items: center; gap: 16px;
            padding: 16px; border-radius: 12px;
            background: rgba(201,169,110,0.05);
            border: 1px solid rgba(201,169,110,0.15);
            margin-top: 8px;
          }
          .venmo-qr { width: 80px; height: 80px; border-radius: 8px; object-fit: cover; border: 1px solid rgba(201,169,110,0.2); }
          .venmo-text strong { display: block; color: #f0e6d2; font-size: 0.9rem; margin-bottom: 4px; }
          .venmo-text span { color: #6a7a8a; font-size: 0.78rem; font-family: 'EB Garamond', serif; }
        `}),e.jsxs("div",{className:"downloads-group",children:[e.jsx("div",{className:"downloads-group-label",children:"🎵 Song Sheets"}),[{name:"Allegro — Classical Guitar Piece",file:"allegro-classical-piece.pdf",type:"PDF"},{name:"Auld Lang Syne — TAB",file:"auld-lang-syne-tab.pdf",type:"PDF"},{name:"Blue Christmas — Chord Melody",file:"blue-christmas-chord-melody.pdf",type:"PDF"},{name:"Blue Christmas — Simple TAB",file:"blue-christmas-simple-tab.pdf",type:"PDF"},{name:"Silent Night",file:"silent-night.pdf",type:"PDF"}].map(i=>e.jsxs("a",{className:"download-item",href:`/assets/downloads/${i.file}`,download:!0,target:"_blank",rel:"noopener noreferrer",children:[e.jsx("span",{className:"download-icon",children:"📄"}),e.jsx("span",{className:"download-name",children:i.name}),e.jsx("span",{className:"download-type",children:i.type}),e.jsx("span",{style:{color:"#5a6a7a"},children:"↓"})]},i.file))]}),e.jsxs("div",{className:"downloads-group",children:[e.jsx("div",{className:"downloads-group-label",children:"🗺️ Theory Maps"}),[{name:"E Vertiscales — Full Chart",file:"e-vertiscales.pdf",type:"PDF"},{name:"Modes in A",file:"modes-in-a.pdf",type:"PDF"},{name:"Modes Circle Cheat Sheet",file:"modes-circle-cheat-sheet.pdf",type:"PDF"},{name:"Blues in A — Maps",file:"blues-in-a-maps.png",type:"PNG"}].map(i=>e.jsxs("a",{className:"download-item",href:`/assets/downloads/${i.file}`,download:!0,target:"_blank",rel:"noopener noreferrer",children:[e.jsx("span",{className:"download-icon",children:"🗺️"}),e.jsx("span",{className:"download-name",children:i.name}),e.jsx("span",{className:"download-type",children:i.type}),e.jsx("span",{style:{color:"#5a6a7a"},children:"↓"})]},i.file))]}),e.jsxs("div",{className:"downloads-group",children:[e.jsx("div",{className:"downloads-group-label",children:"📊 Reference Charts"}),[{name:"CAGED System Introduction",file:"caged-system-intro.png",type:"PNG"},{name:"E Vertiscales — Visual Chart",file:"e-vertiscales-chart.png",type:"PNG"},{name:"Modes in E — Vertical",file:"modes-in-e-vertical.png",type:"PNG"},{name:"Harmony Grid Notes",file:"harmony-grid-notes.jpg",type:"JPG"}].map(i=>e.jsxs("a",{className:"download-item",href:`/assets/downloads/${i.file}`,download:!0,target:"_blank",rel:"noopener noreferrer",children:[e.jsx("span",{className:"download-icon",children:"📊"}),e.jsx("span",{className:"download-name",children:i.name}),e.jsx("span",{className:"download-type",children:i.type}),e.jsx("span",{style:{color:"#5a6a7a"},children:"↓"})]},i.file))]}),e.jsxs("div",{className:"venmo-block",children:[e.jsx("img",{src:"/assets/downloads/venmo-qr.jpg",alt:"Bertrand's Venmo QR",className:"venmo-qr"}),e.jsxs("div",{className:"venmo-text",children:[e.jsx("strong",{children:"Pay via Venmo"}),e.jsx("span",{children:"Scan or search @Bertrand-Laurence on Venmo"})]})]})]}),e.jsx("section",{className:"studio-section",children:e.jsxs("div",{className:"french-section",children:[e.jsx("div",{className:"french-flag",children:"🇫🇷"}),e.jsx("h2",{className:"studio-section-title",style:{marginBottom:12},children:"Éducation Francophone"}),e.jsx("p",{style:{color:"#8a9aaa",fontSize:"1rem",lineHeight:1.7,fontFamily:"'EB Garamond', serif",fontStyle:"italic",marginBottom:16},children:"Bertrand enseigne en français ! Cours de guitare, coaching vocal, théorie musicale, et l'Atelier Chanson — tout est disponible dans votre langue maternelle."}),e.jsx("p",{style:{color:"#6a7a8a",fontSize:"1rem"},children:"Guitar, voice, theory, and the signature Atelier Chanson — all available in French."})]})}),e.jsxs("section",{className:"studio-section",children:[e.jsx("h2",{className:"studio-section-title",children:"Questions?"}),e.jsx("p",{className:"studio-section-subtitle",children:"Everything you need to know before your first lesson"}),_.map((i,a)=>e.jsxs("div",{className:"faq-item",children:[e.jsxs("div",{className:"faq-question",onClick:()=>v(c===a?null:a),children:[e.jsx("span",{children:i.q}),c===a?e.jsx(f,{size:16,style:{color:"#c9a96e",flexShrink:0}}):e.jsx(g,{size:16,style:{color:"#5a6a7a",flexShrink:0}})]}),e.jsx(m,{children:c===a&&e.jsx(n.p,{className:"faq-answer",initial:{height:0,opacity:0},animate:{height:"auto",opacity:1},exit:{height:0,opacity:0},transition:{duration:.2},children:i.a})})]},a))]}),e.jsx("section",{className:"studio-section",children:e.jsxs("div",{className:"cta-banner",children:[e.jsx("h3",{children:"Ready to Start?"}),e.jsx("p",{children:'"You are an instrument playing an instrument."'}),e.jsx("button",{className:"cta-button",onClick:()=>p(null),children:"Book Your First Lesson"})]})}),e.jsxs("footer",{style:{maxWidth:600,margin:"0 auto",padding:"40px 20px 24px",textAlign:"center",borderTop:"1px solid rgba(255,255,255,0.06)"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"center",gap:"24px",marginBottom:"16px",flexWrap:"wrap"},children:[e.jsx("a",{href:"/privacy",style:{fontFamily:"'JetBrains Mono', monospace",fontSize:"0.65rem",color:"#5a6a7a",textDecoration:"none",letterSpacing:"0.06em",textTransform:"uppercase"},children:"Privacy Policy"}),e.jsx("a",{href:"/terms",style:{fontFamily:"'JetBrains Mono', monospace",fontSize:"0.65rem",color:"#5a6a7a",textDecoration:"none",letterSpacing:"0.06em",textTransform:"uppercase"},children:"Terms of Service"})]}),e.jsxs("p",{style:{fontFamily:"'EB Garamond', serif",fontSize:"0.8rem",color:"#3a4a5a",fontStyle:"italic",margin:0},children:["© 2026 Bertrand Laurence Guitar Studio. All rights reserved.",e.jsx("br",{}),"Platform developed by Joshua Atkinson."]})]})]})}export{C as default};
