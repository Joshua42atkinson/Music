---
title: impl_03_primary_nav
status: archive
tags: []
date: 2026-06-14
---
# IMPL 03: PrimaryNav.jsx

// ╔══ VOIX VIVE ═══════════════════════════════════════════════════╗
// ║ FILE    : PrimaryNav.jsx                                       ║
// ║ WHAT    : Persistent bottom/top navigation with 5 core destinations   ║
// ║ WHY     : Provides consistent access to Home, Song lessons, Player practice,
//             Binder/Academy, and RIFT jam while hiding on full‑screen landing pages.
// ║ WHO     : student / Bertrand                                   ║
// ║ OWNS    : Navigation state, active highlighting, visibility logic   ║
// ║ NEEDS   : react-router-dom (useLocation, Link), React hooks       ║
// ║ RULES   : - Hide on '/' and '/onboarding' routes                ║
//             - Active item colored gold #c9a96e                     ║
//             - Dark glass background with backdrop-filter blur      ║
//             - Responsive: fixed bottom on mobile, top bar on desktop≥768px   ║
// ║ FIX AT  : Check pathname matching logic if sub‑routes change    ║
// ║ STAGE   : IMPLEMENT                                            ║
// ╚════════════════════════════════════════════════════════════════╝

import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function PrimaryNav() {
  const location = useLocation();
  // Hide navigation on landing and onboarding pages
  const [showNav, setShowNav] = useState(true);
  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '/onboarding') {
      setShowNav(false);
    } else {
      setShowNav(true);
    }
  }, [location.pathname]);

  // Detect desktop (≥768px) for top bar vs mobile bottom bar
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 768 : false
  );
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Container styling: dark glass, responsive positioning
  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)', // Safari
    padding: isDesktop ? '8px 0' : '12px 0',
    position: 'fixed',
    left: 0,
    right: 0,
    top: isDesktop ? 0 : 'auto',
    bottom: isDesktop ? 'auto' : 0,
    zIndex: 1000,
    transition: 'background-color 0.3s, backdrop-filter 0.3s',
  };

  // Navigation items
  const routes = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/song', label: 'Song', icon: '🎵' },
    { path: '/player', label: 'Play', icon: '🎸' },
    { path: '/binder', label: 'Binder', icon: '📖' },
    { path: '/rift', label: 'Rift', icon: '⚡' }
  ];

  return (
    <>
      {showNav && (
        <div style={containerStyle}>
          {routes.map(({ path, label, icon }) => {
            // Determine active state
            const isActive =
              path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

            const itemStyle = {
              color: isActive ? '#c9a96e' : '#fff',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              fontSize: isDesktop ? '0.9rem' : '0.8rem',
              transition: 'color 0.3s'
            };

            return (
              <a key={path} href={path} style={itemStyle}>
                {/* Icon wrapper for size control */}
                <div
                  style={{
                    fontSize: isDesktop ? '1.5rem' : '1.2rem',
                    marginBottom: 4
                  }}
                >
                  {icon}
                </div>
                <span>{label}</span>
              </a>
            );
          })}
        </div>
      )}
    </>
  );
}