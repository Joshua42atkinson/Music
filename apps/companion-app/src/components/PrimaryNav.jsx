import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useTruebadour } from '../hooks/TruebadourProvider';
import { useLocale } from '../hooks/useLocale';
import { Compass, X, MessageSquare } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';

function getNavRoutes(t) {
  return [
    { path: '/dashboard', label: t('navDashboard'), icon: '🏛️', image: '/assets/wordmark.png', desc: t('navDashboardDesc') },
    { path: '/binder',    label: t('navBinder'),    icon: '📖', image: '/assets/portal_playbook.png', desc: t('navBinderDesc') },
    { path: '/riff',      label: t('navPractice'),  icon: '🎸', image: '/assets/portal_guitar.png', desc: t('navPracticeDesc') },
    { path: '/player',    label: t('navStudio'),    icon: '🎶', image: '/assets/portal_player.png', desc: t('navStudioDesc') },
    { path: '/game',      label: t('navVRPractice'), icon: '🕶️', image: '/assets/portal_song.png', desc: t('navVRPracticeDesc') },
    { path: '/adventure', label: t('navVRAdventure'), icon: '🗺️', image: '/assets/wordmark.png', desc: t('navVRAdventureDesc') },
    { path: '/community', label: t('navCommunity'), icon: '👥', image: '/assets/wordmark.png', desc: t('navCommunityDesc') }
  ];
}

const HIDDEN_PATHS = ['/', '/onboarding'];

export default function PrimaryNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { locale, t } = useLocale();
  const showNav  = !HIDDEN_PATHS.includes(location.pathname);
  const { openRift, openBinder, closeAll, activeWidget } = useTruebadour();
  const NAV_ROUTES = useMemo(() => getNavRoutes(t), [t, locale]);

  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 768 : false
  );
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (!showNav) return null;

  const riftActive   = activeWidget === 'riff';
  const binderActive = activeWidget === 'binder';

  // ── SHRINK NAV STYLES ──
  const navClass = `fixed left-0 right-0 top-4 z-[2000] flex ${isDesktop ? 'flex-row' : 'flex-col-reverse'} gap-2 justify-center items-center bg-transparent pointer-events-none`;

  const navContainerClass = `flex ${isDesktop ? 'gap-4' : 'gap-2'} bg-[rgba(5,5,8,0.85)] backdrop-blur-[16px] border border-cf-gold/15 rounded-[30px] py-1.5 px-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] pointer-events-auto`;

  const widgetBtn = (color, active) => ({
    background:    active ? `${color}1a` : 'transparent',
    border:        `1px solid ${active ? color : 'rgba(255,255,255,0.05)'}`,
    borderRadius:  24,
    cursor:        'pointer',
    display:       'flex',
    alignItems:    'center',
    justifyContent:'center',
    gap:           6,
    padding:       isDesktop ? '8px 16px' : '8px 12px',
    transition:    'all 0.2s ease',
    color:         active ? color : 'rgba(255,255,255,0.6)',
    fontFamily:    "'Inter', sans-serif",
    fontSize:      isDesktop ? '0.85rem' : '0.75rem',
    letterSpacing: '0.03em',
  });

  const handleNavToDashboard = () => {
    if (navigator.vibrate) navigator.vibrate(20);
    closeAll();
    navigate('/dashboard', { viewTransition: true });
  };

  return (
    <>
      {/* ── CONDENSED NAV BAR ── */}
      <nav className={navClass} aria-label="Primary navigation">
        {/* Beta Button (Centered Above on Mobile) */}
        {!isDesktop && (
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('voixvive:open_feedback'))}
            onKeyDown={(e) => e.key === 'Enter' && window.dispatchEvent(new CustomEvent('voixvive:open_feedback'))}
            className="rounded-3xl cursor-pointer flex items-center justify-center gap-1.5 py-1.5 px-3 border border-cf-gold/20 bg-[rgba(20,15,10,0.85)] backdrop-blur-[10px] pointer-events-auto shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
            style={{ ...widgetBtn('var(--cf-gold)', false) }}
          >
            <MessageSquare size={12} color="var(--cf-gold)" />
            <span className="text-[0.65rem] text-cf-gold uppercase">{t('betaFeedback')}</span>
          </button>
        )}

        <div className={navContainerClass}>
          {/* Guide */}
          <button
            onClick={riftActive ? closeAll : openRift}
            onKeyDown={(e) => e.key === 'Enter' && (riftActive ? closeAll() : openRift())}
            style={widgetBtn('#e0834a', riftActive)}
          >
            <div className="flex items-center gap-1">
              <span className="text-[1.2rem]">🎸</span>
              {riftActive && <X size={16} color="#4a8fe0" strokeWidth={3} />}
            </div>
            {isDesktop && <span>{t('aiMentor')}</span>}
          </button>

          {/* Compass / Home Trigger */}
          <button
            onClick={handleNavToDashboard}
            onKeyDown={(e) => e.key === 'Enter' && handleNavToDashboard()}
            className={`rounded-full flex items-center justify-center text-cf-gold cursor-pointer transition-all duration-200 shadow-[0_0_15px_rgba(var(--cf-gold-rgb),0.2)] hover:scale-110 ${isDesktop ? 'w-12 h-12' : 'w-11 h-11'}`}
            style={{
              background: 'linear-gradient(135deg, rgba(var(--cf-gold-rgb),0.2), rgba(var(--cf-gold-rgb),0.05))',
              border: '1px solid rgba(var(--cf-gold-rgb),0.3)',
            }}
          >
            <Compass size={isDesktop ? 24 : 22} />
          </button>

          {/* Binder */}
          <button
            onClick={binderActive ? closeAll : openBinder}
            onKeyDown={(e) => e.key === 'Enter' && (binderActive ? closeAll() : openBinder())}
            style={widgetBtn('#4a8fe0', binderActive)}
          >
            {isDesktop && <span>{t('navBinder')}</span>}
            <div className="flex items-center gap-1">
              <span className="text-[1.2rem]">📘</span>
              {binderActive && <X size={16} color="#e0834a" strokeWidth={3} />}
            </div>
          </button>
          
          {/* Beta Button (Inside Pill on Desktop) */}
          {isDesktop && (
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('voixvive:open_feedback'))}
              onKeyDown={(e) => e.key === 'Enter' && window.dispatchEvent(new CustomEvent('voixvive:open_feedback'))}
              className="rounded-3xl cursor-pointer flex items-center justify-center gap-1.5 py-1.5 px-2.5 border-none bg-cf-gold/5 ml-1"
              style={{ ...widgetBtn('var(--cf-gold)', false) }}
            >
              <MessageSquare size={16} />
            </button>
          )}
        </div>
      </nav>

    </>
  );
}
