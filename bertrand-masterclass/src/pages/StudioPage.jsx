import React, { useState, useRef, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Star, ExternalLink, Play, Gift, Users, Video, BookOpen, Mic, MessageCircle, ArrowLeft } from 'lucide-react';
import { SERVICES, PAYMENT_METHODS, CREDENTIALS, STYLES } from '../data/pricingData';
import { TESTIMONIALS, FAQ } from '../data/testimonialData';

// ═══════════════════════════════════════════════════════════
// STUDIO PAGE — Bertrand's Business Landing Page
// This is the revenue-generating heart of Voix Vive.
// Every element traces back to one of the 7 income streams.
// ═══════════════════════════════════════════════════════════

const SERVICE_ICONS = {
  'private-lesson': '🎸',
  'voice-coaching': '🎤',
  'quick-question': '💬',
  'mini-critique': '🎬',
  'full-review': '📹',
  'membership': '⭐',
  'group-workshop': '👥',
  'gift-certificate': '🎁',
};

export default function StudioPage() {
  const navigate = useNavigate();
  const [expandedService, setExpandedService] = useState(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const testimonialTimer = useRef(null);

  // Auto-rotate testimonials
  useEffect(() => {
    testimonialTimer.current = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(testimonialTimer.current);
  }, []);

  const handlePayment = (stripeLink) => {
    if (stripeLink) {
      window.open(stripeLink, '_blank');
    } else {
      // Scroll to payment methods section as fallback
      document.getElementById('payment-methods')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="studio-page relative">
      {/* ── NAVIGATION BAR ── */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px 0',
        maxWidth: 640,
        margin: '0 auto',
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.75rem',
            color: '#c9a96e',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            padding: '8px 0',
          }}
          aria-label="Back"
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
          aria-label="Voix Vive Home"
        >
          <img
            src="/assets/wordmark.png"
            alt="Voix Vive"
            style={{ height: 24, opacity: 0.8 }}
            draggable={false}
          />
        </button>
      </nav>

      <style>{`
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
      `}</style>

      {/* ═══ HERO ═══ */}
      <section className="studio-hero">
        <motion.img
          src="/assets/bertrand_profile.jpg"
          alt="Bertrand Laurence"
          className="studio-hero-photo"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        />
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Bertrand Laurence
        </motion.h1>
        <motion.p
          className="studio-hero-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Body-centered guitar & voice instruction for all ages and styles
        </motion.p>

        <motion.div
          className="studio-credentials"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {CREDENTIALS.slice(0, 4).map((cred, i) => (
            <span key={i} className="studio-credential">
              <span>{cred.icon}</span> {cred.label}
            </span>
          ))}
        </motion.div>

        <motion.div
          className="studio-styles"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {STYLES.map((style, i) => (
            <span key={i} className="studio-style-tag">{style}</span>
          ))}
        </motion.div>

        {/* Free curriculum banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          style={{
            marginTop: 24,
            padding: '14px 20px',
            borderRadius: 12,
            background: 'rgba(122,170,136,0.06)',
            border: '1px solid rgba(122,170,136,0.2)',
            maxWidth: 440,
            margin: '24px auto 0',
          }}
        >
          <p style={{
            fontFamily: "'EB Garamond', serif",
            fontStyle: 'italic',
            fontSize: '0.95rem',
            color: '#7aaa88',
            margin: '0 0 6px',
          }}>
            The 12-chapter curriculum, the Troubadour AI coach, and all tools are free.
          </p>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.55rem',
            color: 'rgba(122,170,136,0.5)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            margin: 0,
          }}>
            No login · No paywall · Start playing now
          </p>
        </motion.div>
      </section>

      {/* ═══ TRIAL CTA ═══ */}
      <section className="studio-section" style={{ paddingTop: 0 }}>
        <div className="cta-banner">
          <h3>🎸 Ready for the Next Step?</h3>
          <p>"Give you everything in bites... just enough to bring you to that next step."</p>
          <button className="cta-button" onClick={() => handlePayment(null)}>
            Book a Trial Lesson — $45
          </button>
        </div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section className="studio-section">
        <h2 className="studio-section-title">Support & Mentorship</h2>
        <p className="studio-section-subtitle">The curriculum is free. Deep work with Bertrand is a human investment.</p>

        {SERVICES.map(service => {
          const isExpanded = expandedService === service.id;
          const minPrice = service.pricing
            .filter(p => p.price !== null)
            .reduce((min, p) => Math.min(min, p.price), Infinity);

          return (
            <div key={service.id} className={`service-card ${isExpanded ? 'expanded' : ''}`}>
              <div
                className="service-card-header"
                onClick={() => setExpandedService(isExpanded ? null : service.id)}
              >
                <span className="service-icon">{SERVICE_ICONS[service.id] || service.icon}</span>
                <div className="service-info">
                  <h3 className="service-name">{service.name}</h3>
                  <p className="service-subtitle">{service.subtitle}</p>
                </div>
                <span className="service-from-price">
                  {minPrice < Infinity ? `$${minPrice}` : 'Custom'}
                </span>
                {isExpanded ? (
                  <ChevronUp size={18} className="service-expand-icon" />
                ) : (
                  <ChevronDown size={18} className="service-expand-icon" />
                )}
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    className="service-expanded"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="service-description">{service.description}</p>

                    <div className="service-meta">
                      <span className="service-meta-item">⏱ {service.duration}</span>
                      <span className="service-meta-item">📍 {service.delivery}</span>
                    </div>

                    <ul className="service-features">
                      {service.features.map((feat, i) => (
                        <li key={i}>{feat}</li>
                      ))}
                    </ul>

                    <div className="pricing-options">
                      {service.pricing.map((option, i) => (
                        <div
                          key={i}
                          className="pricing-option"
                          onClick={() => handlePayment(option.stripeLink)}
                        >
                          <div>
                            <div className="pricing-label">{option.label}</div>
                            {option.perUnit && (
                              <div className="pricing-per-unit">${option.perUnit}/session</div>
                            )}
                          </div>
                          <div className="pricing-right">
                            {option.badge && (
                              <span className="pricing-badge">{option.badge}</span>
                            )}
                            <span className="pricing-amount">
                              {option.price !== null ? `$${option.price}` : 'Contact'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="studio-section">
        <h2 className="studio-section-title">What Students Say</h2>
        <p className="studio-section-subtitle">
          {TESTIMONIALS.length} reviews from private students and Passim School of Music
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTestimonial}
            className="testimonial-card"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
          >
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-quote">
              "{TESTIMONIALS[activeTestimonial].quote}"
            </p>
            <div className="testimonial-author">
              — {TESTIMONIALS[activeTestimonial].author}
            </div>
            <div className="testimonial-context">
              {TESTIMONIALS[activeTestimonial].context}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="testimonial-dots">
          {TESTIMONIALS.map((_, i) => (
            <div
              key={i}
              className={`testimonial-dot ${i === activeTestimonial ? 'active' : ''}`}
              onClick={() => {
                setActiveTestimonial(i);
                clearInterval(testimonialTimer.current);
              }}
            />
          ))}
        </div>
      </section>

      {/* ═══ PAYMENT METHODS ═══ */}
      <section className="studio-section" id="payment-methods">
        <h2 className="studio-section-title">Ways to Pay</h2>
        <p className="studio-section-subtitle">Choose whichever method is easiest for you</p>

        <div className="payment-grid">
          {PAYMENT_METHODS.filter(m => m.id !== 'wire').map(method => (
            <div key={method.id} className={`payment-card ${method.primary ? 'primary' : ''}`}>
              <span className="payment-icon">{method.icon}</span>
              <span className="payment-name">{method.name}</span>
              <span className="payment-desc">{method.description}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FREE DOWNLOADS ═══ */}
      <section className="studio-section" id="free-resources">
        <h2 className="studio-section-title">Free Resources</h2>
        <p className="studio-section-subtitle">Download Bertrand's teaching materials — yours to keep</p>

        <style>{`
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
        `}</style>

        <div className="downloads-group">
          <div className="downloads-group-label">🎵 Song Sheets</div>
          {[
            { name: 'Allegro — Classical Guitar Piece', file: 'allegro-classical-piece.pdf', type: 'PDF' },
            { name: 'Auld Lang Syne — TAB', file: 'auld-lang-syne-tab.pdf', type: 'PDF' },
            { name: 'Blue Christmas — Chord Melody', file: 'blue-christmas-chord-melody.pdf', type: 'PDF' },
            { name: 'Blue Christmas — Simple TAB', file: 'blue-christmas-simple-tab.pdf', type: 'PDF' },
            { name: 'Silent Night', file: 'silent-night.pdf', type: 'PDF' },
          ].map(item => (
            <a key={item.file} className="download-item" href={`/assets/downloads/${item.file}`} download target="_blank" rel="noopener noreferrer">
              <span className="download-icon">📄</span>
              <span className="download-name">{item.name}</span>
              <span className="download-type">{item.type}</span>
              <span style={{ color: '#5a6a7a' }}>↓</span>
            </a>
          ))}
        </div>

        <div className="downloads-group">
          <div className="downloads-group-label">🗺️ Theory Maps</div>
          {[
            { name: 'E Vertiscales — Full Chart', file: 'e-vertiscales.pdf', type: 'PDF' },
            { name: 'Modes in A', file: 'modes-in-a.pdf', type: 'PDF' },
            { name: 'Modes Circle Cheat Sheet', file: 'modes-circle-cheat-sheet.pdf', type: 'PDF' },
            { name: 'Blues in A — Maps', file: 'blues-in-a-maps.png', type: 'PNG' },
          ].map(item => (
            <a key={item.file} className="download-item" href={`/assets/downloads/${item.file}`} download target="_blank" rel="noopener noreferrer">
              <span className="download-icon">🗺️</span>
              <span className="download-name">{item.name}</span>
              <span className="download-type">{item.type}</span>
              <span style={{ color: '#5a6a7a' }}>↓</span>
            </a>
          ))}
        </div>

        <div className="downloads-group">
          <div className="downloads-group-label">📊 Reference Charts</div>
          {[
            { name: 'CAGED System Introduction', file: 'caged-system-intro.png', type: 'PNG' },
            { name: 'E Vertiscales — Visual Chart', file: 'e-vertiscales-chart.png', type: 'PNG' },
            { name: 'Modes in E — Vertical', file: 'modes-in-e-vertical.png', type: 'PNG' },
            { name: 'Harmony Grid Notes', file: 'harmony-grid-notes.jpg', type: 'JPG' },
          ].map(item => (
            <a key={item.file} className="download-item" href={`/assets/downloads/${item.file}`} download target="_blank" rel="noopener noreferrer">
              <span className="download-icon">📊</span>
              <span className="download-name">{item.name}</span>
              <span className="download-type">{item.type}</span>
              <span style={{ color: '#5a6a7a' }}>↓</span>
            </a>
          ))}
        </div>

        <div className="venmo-block">
          <img src="/assets/downloads/venmo-qr.jpg" alt="Bertrand's Venmo QR" className="venmo-qr" />
          <div className="venmo-text">
            <strong>Pay via Venmo</strong>
            <span>Scan or search @Bertrand-Laurence on Venmo</span>
          </div>
        </div>
      </section>

      {/* ═══ FRENCH SECTION ═══ */}
      <section className="studio-section">
        <div className="french-section">
          <div className="french-flag">🇫🇷</div>
          <h2 className="studio-section-title" style={{ marginBottom: 12 }}>
            Éducation Francophone
          </h2>
          <p style={{ color: '#8a9aaa', fontSize: '1rem', lineHeight: 1.7, fontFamily: "'EB Garamond', serif", fontStyle: 'italic', marginBottom: 16 }}>
            Bertrand enseigne en français ! Cours de guitare, coaching vocal, théorie musicale, et l'Atelier Chanson — tout est disponible dans votre langue maternelle.
          </p>
          <p style={{ color: '#6a7a8a', fontSize: '1rem' }}>
            Guitar, voice, theory, and the signature Atelier Chanson — all available in French.
          </p>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="studio-section">
        <h2 className="studio-section-title">Questions?</h2>
        <p className="studio-section-subtitle">Everything you need to know before your first lesson</p>

        {FAQ.map((item, i) => (
          <div key={i} className="faq-item">
            <div
              className="faq-question"
              onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
            >
              <span>{item.q}</span>
              {expandedFaq === i ? (
                <ChevronUp size={16} style={{ color: '#c9a96e', flexShrink: 0 }} />
              ) : (
                <ChevronDown size={16} style={{ color: '#5a6a7a', flexShrink: 0 }} />
              )}
            </div>
            <AnimatePresence>
              {expandedFaq === i && (
                <motion.p
                  className="faq-answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.a}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ))}
      </section>

      {/* ═══ BOTTOM CTA ═══ */}
      <section className="studio-section">
        <div className="cta-banner">
          <h3>Ready to Start?</h3>
          <p>"You are an instrument playing an instrument."</p>
          <button className="cta-button" onClick={() => handlePayment(null, 'trial')}>
            Book Your First Lesson
          </button>
        </div>
      </section>

      {/* ═══ LEGAL FOOTER ═══ */}
      <footer style={{
        maxWidth: 600,
        margin: '0 auto',
        padding: '40px 20px 24px',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          marginBottom: '16px',
          flexWrap: 'wrap',
        }}>
          <a href="/privacy" style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.65rem',
            color: '#5a6a7a',
            textDecoration: 'none',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>Privacy Policy</a>
          <a href="/terms" style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.65rem',
            color: '#5a6a7a',
            textDecoration: 'none',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>Terms of Service</a>
        </div>
        <p style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: '0.8rem',
          color: '#3a4a5a',
          fontStyle: 'italic',
          margin: 0,
        }}>
          © 2026 Bertrand Laurence Guitar Studio. All rights reserved.
          <br />
          Platform developed by Joshua Atkinson.
        </p>
      </footer>
    </div>
  );
}
