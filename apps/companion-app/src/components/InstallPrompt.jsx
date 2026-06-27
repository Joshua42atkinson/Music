import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  if (!isInstallable || isInstalled) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#0a0a0f]/90 backdrop-blur-md border border-[var(--vv-gold)]/30 px-4 py-3 rounded-full flex items-center gap-3 shadow-lg shadow-[var(--vv-gold)]/5 animate-in fade-in slide-in-from-top-4 duration-500">
      <span className="font-mono text-[0.7rem] text-white/80 uppercase tracking-widest whitespace-nowrap">
        Install Voix Vive
      </span>
      <button 
        onClick={handleInstallClick}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--vv-gold)]/20 hover:bg-[var(--vv-gold)]/30 text-[var(--vv-gold)] transition-colors border border-[var(--vv-gold)]/40 cursor-pointer"
      >
        <Download size={12} />
        <span className="font-mono text-[0.7rem] font-bold uppercase tracking-wider">Install</span>
      </button>
    </div>
  );
}
