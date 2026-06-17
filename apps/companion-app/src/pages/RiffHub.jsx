// ╔══ VOIX VIVE ════════════════════════════════════════════════════╗
// ║ FILE    : RiffHub.jsx                                          ║
// ║ WHAT    : Landing page for the RIFF destination — hero + four  ║
// ║           sub-experience cards (Game, Adventure, Studio, Theory)║
// ║ WHY     : Provides a beautiful entry point to the RIFF creative ║
// ║           hub, consolidating /game /adventure /studio/prompter  ║
// ║           and /guitar/map under one destination                 ║
// ║ WHO     : student                                               ║
// ║ OWNS    : Card hover CSS, route links to RIFF sub-experiences   ║
// ║ NEEDS   : react-router-dom Link                                 ║
// ║ RULES   : Dark aesthetic (#050508 bg, var(--cf-gold) gold). Must be    ║
// ║           fully responsive ≥375px. No framer-motion dependency. ║
// ║ FIX AT  : Check Link paths match App.jsx route definitions      ║
// ║ STAGE   : IMPLEMENT                                             ║
// ╚════════════════════════════════════════════════════════════════╝

import { Link } from 'react-router-dom';

const RiffHub = () => {
  return (
    <div className="bg-[#050508] min-h-screen p-8 text-white font-heading">
      <style>{`
        .riff-hub-card {
          background-color: rgba(255,255,255,0.03);
          border: 1px solid rgba(var(--cf-gold-rgb),0.4);
          border-radius: 12px;
          padding: 2rem 1.5rem;
          transition: all 0.3s ease;
          cursor: pointer;
          text-align: center;
          flex: 1 1 200px;
          max-width: 280px;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .riff-hub-card:hover {
          transform: translateY(-4px) scale(1.02);
          background-color: rgba(201, 169, 110, 0.07);
          border-color: var(--cf-gold);
          box-shadow: 0 8px 32px rgba(var(--cf-gold-rgb),0.15);
        }
        .riff-hub-icon {
          font-size: 3rem;
          margin-bottom: 0.75rem;
          display: block;
        }
        .riff-hub-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--cf-gold);
          margin: 0 0 0.5rem 0;
        }
        .riff-hub-description {
          font-size: 0.85rem;
          color: #999;
          line-height: 1.5;
          margin: 0;
        }
        .riff-hub-cards-container {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          justify-content: center;
          margin-top: 3rem;
        }
        .riff-coming-soon {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background: rgba(var(--cf-gold-rgb),0.1);
          border: 1px solid rgba(var(--cf-gold-rgb),0.3);
          border-radius: 20px;
          font-size: 0.7rem;
          color: var(--cf-gold);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 1rem;
        }
        @media (max-width: 639px) {
          .riff-hub-card {
            flex: 1 1 100%;
            max-width: none;
          }
        }
      `}</style>

      {/* Hero */}
      <div className="text-center pt-12 mb-4">
        <div className="text-[5rem] font-black tracking-tight leading-none mb-4"
          style={{
            background: 'linear-gradient(135deg, var(--cf-gold) 0%, #fff 50%, var(--cf-gold) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
          RIFF
        </div>
        <p className="text-[1.1rem] text-[#888] max-w-[480px] mx-auto leading-[1.7] italic">
          Where individual riffs become collective harmony.
          <br />
          The creative edge of Voix Vive.
        </p>
      </div>

      {/* 4 Experience Cards */}
      <div className="riff-hub-cards-container">
        <Link to="/game" className="riff-hub-card">
          <span className="riff-hub-icon">🎮</span>
          <h3 className="riff-hub-title">Game Mode</h3>
          <p className="riff-hub-description">Vertiscale Engine — play through fret challenges and earn traction points.</p>
        </Link>

        <Link to="/adventure" className="riff-hub-card">
          <span className="riff-hub-icon">🗺️</span>
          <h3 className="riff-hub-title">Adventure</h3>
          <p className="riff-hub-description">Narrative-driven practice sessions through sonic landscapes.</p>
        </Link>

        <Link to="/studio/prompter" className="riff-hub-card">
          <span className="riff-hub-icon">🎬</span>
          <h3 className="riff-hub-title">Somatic Studio</h3>
          <p className="riff-hub-description">Guided Be → Do → Play → Produce recording sessions.</p>
        </Link>

        <Link to="/guitar/map" className="riff-hub-card">
          <span className="riff-hub-icon">🌐</span>
          <h3 className="riff-hub-title">Theory Map</h3>
          <p className="riff-hub-description">Maturation Map — explore the isomorphic fretboard galaxy.</p>
        </Link>
      </div>

      {/* Community Jam — Coming Soon */}
      <div className="text-center mt-20 pt-12 border-t border-cf-gold/15">
        <span className="riff-coming-soon">Coming Soon</span>
        <h2 className="text-cf-gold mb-3 text-[1.75rem] font-semibold">
          Community Jam
        </h2>
        <p className="text-[#666] max-w-[440px] mx-auto leading-[1.7] text-[0.95rem]">
          Live jam sessions, duet challenges, and global musical conversations.
          The Human Octave — all voices in harmony.
        </p>
      </div>
    </div>
  );
};

export default RiffHub;
