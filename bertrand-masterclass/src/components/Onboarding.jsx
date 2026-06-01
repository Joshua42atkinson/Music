// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : Onboarding.jsx                                      ║
// ║ WHAT    : Optional guided orientation for new students        ║
// ║ WHY     : Consent-based entry. The student CHOOSES every step.║
// ║           Nothing is forced. Nothing is assumed.              ║
// ║ WHO     : Optional at /onboarding. Skippable anytime.         ║
// ║ OWNS    : Welcome, consent-gated breathing, commitment tier,  ║
// ║           journey start date, orientation recommendations       ║
// ║ NEEDS   : ScaffoldingProvider (updateTraction), gameProgression║
// ║ RULES   : CONSENT FIRST. Every exercise is opt-in.            ║
// ║           The home screen is NEVER gated.                     ║
// ║           Breathing requires explicit consent.                ║
// ║           Commitment tier can be changed later.                ║
// ║           Sets journeyStartDate which drives graduation ETA   ║
// ║ STAGE   : IMPLEMENT (ADDIECRAPEYE phase 4)                    ║
// ╚═══════════════════════════════════════════════════════════════╝

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { COMMITMENT_TIERS } from '../data/gameProgression';
import { useScaffolding } from './ScaffoldingProvider';

export default function Onboarding() {
  const navigate = useNavigate();
  const { updateTraction } = useScaffolding();
  const [step, setStep] = useState(0); // 0=welcome, 1=consent, 2=breath, 3=tier, 4=ready
  const [selectedTier, setSelectedTier] = useState(null);
  const [breathPhase, setBreathPhase] = useState('inhale');
  const [breathCount, setBreathCount] = useState(0);
  const [breathScale, setBreathScale] = useState(1);
  const [breathConsent, setBreathConsent] = useState(false);
  const breathRef = useRef(null);

  // ── Complete onboarding and go home ──
  const handleComplete = (tierId) => {
    updateTraction(prev => ({
      ...prev,
      onboardingComplete: true,
      commitmentTier: tierId,
      journeyStartDate: new Date().toISOString(),
      breathingSessions: (prev.breathingSessions || 0) + 1,
    }));
    navigate('/');
  };

  // ── Skip onboarding anytime ──
  const handleSkip = () => {
    updateTraction(prev => ({
      ...prev,
      onboardingComplete: true, // Mark as seen so we don't nag
    }));
    navigate('/');
  };

  // ── Breathing animation (step 1) ──
  useEffect(() => {
    if (step !== 1) return;
    let frame;
    let startTime = Date.now();
    const cycleDuration = 6000; // 6 seconds per breath cycle

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed % cycleDuration) / cycleDuration;

      if (progress < 0.4) {
        // Inhale (0-40%)
        setBreathPhase('inhale');
        setBreathScale(1 + (progress / 0.4) * 0.3);
      } else if (progress < 0.5) {
        // Hold (40-50%)
        setBreathPhase('hold');
        setBreathScale(1.3);
      } else if (progress < 0.9) {
        // Exhale (50-90%)
        setBreathPhase('exhale');
        setBreathScale(1.3 - ((progress - 0.5) / 0.4) * 0.3);
      } else {
        // Rest (90-100%)
        setBreathPhase('rest');
        setBreathScale(1);
      }

      // Count completed cycles
      const cycles = Math.floor(elapsed / cycleDuration);
      setBreathCount(cycles);

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [step]);

  // ── Step 0: Welcome ──
  if (step === 0) {
    return (
      <div style={styles.container}>
        <button onClick={handleSkip} style={styles.skipBtn} aria-label="Skip onboarding">
          <X size={20} /> Skip
        </button>
        <div style={styles.content}>
          <div style={styles.logoGlyph}>♾️</div>
          <h1 style={styles.title}>Welcome to Voix Vive</h1>
          <p style={styles.subtitle}>
            You are about to begin a journey that has no wrong notes.
          </p>
          <p style={styles.body}>
            This guided orientation will help you set your pace. Everything is optional.
          </p>
          <button onClick={() => setStep(1)} style={styles.primaryBtn}>
            Continue
          </button>
        </div>
      </div>
    );
  }

  // ── Step 1: Consent for centering exercise ──
  if (step === 1) {
    return (
      <div style={styles.container}>
        <button onClick={handleSkip} style={styles.skipBtn} aria-label="Skip onboarding">
          <X size={20} /> Skip
        </button>
        <div style={styles.content}>
          <div style={styles.logoGlyph}>🌬️</div>
          <h2 style={styles.stepTitle}>Centering Exercise</h2>
          <p style={styles.stepSubtitle}>
            Bertrand teaches that tension is the enemy of music.
          </p>
          <p style={styles.body}>
            We can begin with three slow breaths to ground your body before practice.
            This takes 18 seconds. You are free to skip this at any time.
          </p>
          <div style={{ display: 'flex', gap: 12, width: '100%', maxWidth: 360 }}>
            <button
              onClick={() => { setBreathConsent(true); setStep(2); }}
              style={{ ...styles.primaryBtn, flex: 1 }}
            >
              Yes, center me
            </button>
            <button
              onClick={() => { setBreathConsent(false); setStep(3); }}
              style={styles.secondaryBtn}
            >
              Skip to settings
            </button>
          </div>
          <p style={{ ...styles.body, fontSize: '0.75rem', marginTop: 8 }}>
            You can always find breathing tools in The Player portal.
          </p>
        </div>
      </div>
    );
  }

  // ── Step 2: First Breath (consent required) ──
  if (step === 2) {
    const phaseText = {
      inhale: 'Breathe in…',
      hold: 'Hold…',
      exhale: 'Breathe out…',
      rest: '…',
    };
    const canAdvance = breathCount >= 3;

    return (
      <div style={styles.container}>
        <button onClick={handleSkip} style={styles.skipBtn} aria-label="Skip onboarding">
          <X size={20} /> Skip
        </button>
        <div style={styles.content}>
          <p style={styles.breathLabel}>{phaseText[breathPhase]}</p>
          <div
            ref={breathRef}
            style={{
              ...styles.breathCircle,
              transform: `scale(${breathScale})`,
              borderColor: breathPhase === 'inhale' ? 'rgba(96,165,250,0.5)' :
                           breathPhase === 'exhale' ? 'rgba(52,211,153,0.5)' :
                           'rgba(201,169,110,0.3)',
            }}
          />
          <p style={styles.breathCounter}>
            {canAdvance
              ? 'Three breaths complete. Your body is ready.'
              : `Breath ${Math.min(breathCount + 1, 3)} of 3`
            }
          </p>
          {canAdvance && (
            <button onClick={() => setStep(3)} style={styles.primaryBtn}>
              Continue
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Step 3: Commitment Tier ──
  if (step === 3) {
    return (
      <div style={styles.container}>
        <button onClick={handleSkip} style={styles.skipBtn} aria-label="Skip onboarding">
          <X size={20} /> Skip
        </button>
        <div style={{ ...styles.content, maxWidth: 520 }}>
          <h2 style={styles.stepTitle}>How would you like to walk this path?</h2>
          <p style={styles.stepSubtitle}>
            Choose the pace that fits your life. You can change this anytime.
          </p>
          <div style={styles.tierGrid}>
            {Object.values(COMMITMENT_TIERS).map(tier => (
              <button
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                style={{
                  ...styles.tierCard,
                  borderColor: selectedTier === tier.id ? tier.color : 'rgba(255,255,255,0.08)',
                  background: selectedTier === tier.id
                    ? `${tier.color}10`
                    : 'rgba(255,255,255,0.02)',
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{tier.icon}</span>
                <h3 style={{ ...styles.tierName, color: selectedTier === tier.id ? tier.color : '#f0e6d2' }}>
                  {tier.name.en}
                </h3>
                <p style={styles.tierSub}>{tier.subtitle.en}</p>
                <p style={styles.tierWeeks}>
                  ~{tier.totalWeeks} weeks to graduation
                </p>
                <p style={styles.tierDesc}>{tier.description.en}</p>
              </button>
            ))}
          </div>
          {selectedTier && (
            <button onClick={() => setStep(4)} style={styles.primaryBtn}>
              Choose {COMMITMENT_TIERS[selectedTier].name.en}
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Step 4: Ready ──
  if (step === 4) {
    const tier = COMMITMENT_TIERS[selectedTier];
    const graduationDate = new Date();
    graduationDate.setDate(graduationDate.getDate() + tier.totalWeeks * 7);
    const gradFormatted = graduationDate.toLocaleDateString(undefined, {
      month: 'long', year: 'numeric',
    });

    return (
      <div style={styles.container}>
        <button onClick={handleSkip} style={styles.skipBtn} aria-label="Skip onboarding">
          <X size={20} /> Skip
        </button>
        <div style={styles.content}>
          <div style={styles.logoGlyph}>🎸</div>
          <h2 style={styles.stepTitle}>Your journey begins now.</h2>
          <p style={styles.body}>
            Your goal: compose and perform <strong>three original songs</strong>.
          </p>
          <div style={styles.goalGrid}>
            <div style={styles.goalItem}>
              <span style={styles.goalNum}>1</span>
              <div>
                <p style={styles.goalTitle}>The Root</p>
                <p style={styles.goalSub}>After Fret 4 — your first song, from the heart</p>
              </div>
            </div>
            <div style={styles.goalItem}>
              <span style={styles.goalNum}>2</span>
              <div>
                <p style={styles.goalTitle}>The Bridge</p>
                <p style={styles.goalSub}>After Fret 8 — a melody from your imagination</p>
              </div>
            </div>
            <div style={styles.goalItem}>
              <span style={styles.goalNum}>3</span>
              <div>
                <p style={styles.goalTitle}>The Return</p>
                <p style={styles.goalSub}>After Fret 12 — a free performance, no stopping</p>
              </div>
            </div>
          </div>
          <p style={styles.etaText}>
            On {tier.name.en}, you could graduate by <strong>{gradFormatted}</strong>.
          </p>
          <button
            onClick={() => handleComplete(selectedTier)}
            style={styles.primaryBtn}
          >
            Let's Begin
          </button>
        </div>
      </div>
    );
  }

  return null;
}

// ═══════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════

const styles = {
  container: {
    minHeight: '100svh',
    background: '#050508',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
    color: '#f0e6d2',
    position: 'relative',
  },
  skipBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: 'none',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: '8px 14px',
    color: 'rgba(255,255,255,0.4)',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.8rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    zIndex: 10,
  },
  content: {
    maxWidth: 440,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
    textAlign: 'center',
  },
  logoGlyph: {
    fontSize: '2.5rem',
    marginBottom: 8,
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 'clamp(1.6rem, 5vw, 2.2rem)',
    fontWeight: 600,
    color: '#f0e6d2',
    margin: 0,
    lineHeight: 1.2,
  },
  subtitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 'clamp(1rem, 3vw, 1.2rem)',
    color: 'rgba(255,255,255,0.55)',
    fontStyle: 'italic',
    margin: 0,
    lineHeight: 1.5,
  },
  body: {
    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
    color: 'rgba(255,255,255,0.5)',
    margin: 0,
    lineHeight: 1.6,
    maxWidth: 360,
  },
  secondaryBtn: {
    marginTop: 12,
    padding: '14px 28px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'rgba(255,255,255,0.04)',
    color: 'rgba(255,255,255,0.5)',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.85rem',
    letterSpacing: '0.08em',
    cursor: 'pointer',
    transition: 'all 0.2s',
    minHeight: 48,
  },
  primaryBtn: {
    marginTop: 12,
    padding: '14px 32px',
    borderRadius: 12,
    background: 'rgba(201,169,110,0.12)',
    border: '1px solid rgba(201,169,110,0.35)',
    color: '#c9a96e',
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    letterSpacing: '0.03em',
  },
  // Breathing
  breathLabel: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
    color: 'rgba(255,255,255,0.5)',
    margin: 0,
    minHeight: 32,
    fontStyle: 'italic',
  },
  breathCircle: {
    width: 120,
    height: 120,
    borderRadius: '50%',
    border: '2px solid rgba(201,169,110,0.3)',
    transition: 'transform 0.3s ease, border-color 0.5s ease',
    margin: '20px 0',
  },
  breathCounter: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.35)',
    margin: 0,
  },
  // Tier selection
  stepTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 'clamp(1.2rem, 4vw, 1.6rem)',
    fontWeight: 600,
    color: '#f0e6d2',
    margin: 0,
  },
  stepSubtitle: {
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.4)',
    margin: 0,
  },
  tierGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    width: '100%',
    marginTop: 8,
  },
  tierCard: {
    width: '100%',
    padding: '18px 20px',
    borderRadius: 14,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.02)',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  tierName: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.1rem',
    fontWeight: 600,
    margin: 0,
  },
  tierSub: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.7rem',
    color: 'rgba(255,255,255,0.4)',
    margin: 0,
  },
  tierWeeks: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.65rem',
    color: '#fbbf24',
    margin: '4px 0 0',
  },
  tierDesc: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.35)',
    margin: '4px 0 0',
    lineHeight: 1.4,
  },
  // Ready step
  goalGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    width: '100%',
    textAlign: 'left',
    margin: '8px 0',
  },
  goalItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 14,
    padding: '14px 16px',
    borderRadius: 12,
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  goalNum: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.4rem',
    fontWeight: 700,
    color: '#c9a96e',
    minWidth: 28,
    textAlign: 'center',
    lineHeight: 1,
    paddingTop: 2,
  },
  goalTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1rem',
    fontWeight: 600,
    color: '#f0e6d2',
    margin: 0,
  },
  goalSub: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.4)',
    margin: '2px 0 0',
    lineHeight: 1.4,
  },
  etaText: {
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.45)',
    margin: 0,
  },
};
