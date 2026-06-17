// ═══════════════════════════════════════════════════════════
// useMobileDetect — Reactive window width check
// ═══════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';

export default function useMobileDetect(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);

  return isMobile;
}
