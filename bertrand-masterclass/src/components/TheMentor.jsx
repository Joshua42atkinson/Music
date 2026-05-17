import React from 'react';
import { Video, MessageSquare, ExternalLink, Calendar } from 'lucide-react';

// ═══════════════════════════════════════════════════════════
// THE MENTOR — Bertrand Laurence Bio & Coaching
// Mobile-first single-column layout
// Combines the "Somatic Mystic" branding with 1-on-1 tutoring tools
// ═══════════════════════════════════════════════════════════

const TheMentor = () => {
  return (
    <div className="mentor-page pb-32">
      <style>{`
        .mentor-page {
          font-family: 'Inter', sans-serif;
          color: #e0e0ff;
        }

        /* ── Photo Hero ── */
        .mentor-photo-hero {
          position: relative;
          width: 100%;
          height: 340px;
          overflow: hidden;
        }
        .mentor-photo-hero img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 20%;
        }
        .mentor-photo-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            transparent 10%,
            rgba(13, 13, 20, 0.7) 60%,
            #0d0d14 100%
          );
        }

        /* ── Name & Identity ── */
        .mentor-identity {
          position: relative;
          z-index: 10;
          margin-top: -80px;
          padding: 0 24px;
          text-align: center;
        }
        .mentor-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.4rem, 9vw, 3rem);
          font-weight: 400;
          color: #f0e6d2;
          margin: 0 0 4px;
          line-height: 1.1;
          text-shadow: 0 4px 20px rgba(0,0,0,0.8);
        }
        .mentor-title-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #c9a96e;
          margin: 0;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }

        /* ── Core Content Area ── */
        .mentor-content {
          padding: 32px 24px 0;
        }

        /* ── Coaching Actions (The Business Pivot) ── */
        .coaching-card {
          background: linear-gradient(145deg, rgba(201,169,110,0.1), rgba(0,0,0,0.4));
          border: 1px solid rgba(201,169,110,0.2);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 32px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          position: relative;
          overflow: hidden;
        }
        .coaching-card::before {
          content: '';
          position: absolute;
          top: -50%; left: -50%; width: 200%; height: 200%;
          background: radial-gradient(circle at 50% 50%, rgba(201,169,110,0.05), transparent 60%);
          pointer-events: none;
        }

        /* ── Sections ── */
        .mentor-section {
          margin-bottom: 32px;
        }
        .mentor-section-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #5a6a80;
          margin-bottom: 12px;
        }
        .mentor-section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 400;
          color: #e8edf2;
          margin: 0 0 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .mentor-text {
          font-size: 0.95rem;
          line-height: 1.8;
          color: #b0b8c8;
          margin: 0 0 16px;
        }
        .mentor-text strong { color: #c9a96e; }
        .mentor-text em { color: #7aaa88; }
        
        .mentor-quote-block {
          border-left: 2px solid #c9a96e;
          padding-left: 16px;
          margin: 24px 0;
        }
        .mentor-quote-block p {
          font-family: 'EB Garamond', serif;
          font-style: italic;
          font-size: 1.1rem;
          color: #c9a96e;
          margin: 0;
        }

        /* ── Contact Links ── */
        .mentor-link {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          color: #e8edf2;
          text-decoration: none;
          font-size: 0.95rem;
          margin-bottom: 12px;
          transition: all 0.2s;
        }
        .mentor-link:active {
          background: rgba(201,169,110,0.1);
          border-color: rgba(201,169,110,0.3);
        }
      `}</style>

      {/* ── Photo Hero ── */}
      <div className="mentor-photo-hero">
        <img src="/assets/bertrand_profile.jpg" alt="Bertrand Laurence" />
        <div className="mentor-photo-gradient" />
      </div>

      {/* ── Identity ── */}
      <div className="mentor-identity">
        <h1 className="mentor-name">Bertrand Laurence</h1>
        <p className="mentor-title-label">Master Instructor · Somatic Mystic</p>
      </div>

      <div className="mentor-content">
        
        {/* ── Gamified Coaching Portal ── */}
        <div className="coaching-card">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-mono tracking-widest text-cf-gold uppercase bg-cf-gold/10 px-2 py-1 rounded">1-on-1 Mentoring</span>
            <Calendar size={16} className="text-white/40" />
          </div>
          
          <h3 className="font-cormorant text-2xl text-white mb-2">Technique Review</h3>
          <p className="text-sm text-cf-whisper mb-6">Your next live video session is scheduled for Thursday, 4:00 PM EST.</p>
          
          <div className="space-y-3 relative z-10">
            <button className="w-full py-3.5 rounded-xl bg-cf-gold text-[#0d0d14] font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(201,169,110,0.3)] active:scale-95 transition-transform">
              <Video size={18} /> Enter Video Room
            </button>
            <button className="w-full py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold flex items-center justify-center gap-2 active:bg-white/10 transition-colors">
              <MessageSquare size={18} /> Message Bertrand
            </button>
          </div>
        </div>

        {/* ── The Philosophy ── */}
        <div className="mentor-section">
          <p className="mentor-section-label">☽ The Somatic Approach</p>
          <h2 className="mentor-section-title">Music as the Mind/Body Connection</h2>
          
          <div className="mentor-quote-block">
            <p>"Not just quality guitar lessons — professional music lessons on the guitar."</p>
          </div>

          <p className="mentor-text">
            <strong>How:</strong> Learn two things at once: how music works, and how guitars work. We explore the wonder-world of the fingerboard with easy-to-read maps derived directly from the songs you pick. Harmony, Ear Training, and Technique are covered in games that actually teach. <em>Notes → Chords → Songs.</em>
          </p>
          <p className="mentor-text">
            <strong>Why:</strong> Because it is so much easier to remember something when you fundamentally understand it. When you choose the songs or styles you love, learning how your favorite music is made becomes an exciting challenge rather than a chore.
          </p>
        </div>

        {/* ── Official Links ── */}
        <div className="mentor-section">
          <p className="mentor-section-label">Contact & Booking</p>
          
          <a href="https://bertrandguitarstudio.duetpartner.com/" target="_blank" rel="noopener noreferrer" className="mentor-link">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-cf-sage/20 flex items-center justify-center text-cf-sage">
                <Calendar size={14} />
              </div>
              <span>Book a New Session</span>
            </div>
            <ExternalLink size={16} className="text-white/30" />
          </a>

          <a href="http://bertrandlaurence.net/" target="_blank" rel="noopener noreferrer" className="mentor-link">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                <ExternalLink size={14} />
              </div>
              <span>Official Website</span>
            </div>
            <ExternalLink size={16} className="text-white/30" />
          </a>
        </div>

      </div>
    </div>
  );
};

export default TheMentor;
