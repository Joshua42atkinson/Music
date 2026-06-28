import { devWarn } from '../../lib/devLog';
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useScaffolding } from '../ScaffoldingProvider';
import { useLocale } from '../../hooks/useLocale';
import { useAuth } from '../../hooks/useAuth';
import {
  getXpForNextLevel, CORE_STATS, computeStatValue,
  INTERVAL_BADGES, MASTERY_LEVELS, getIntervalMastery,
  TRUEBADOUR_TYPES, computeTruebadourProfile,
} from '../../data/playbookData';
import { getBardicTitle } from '../../data/bardicTitles';
import { COMMITMENT_TIERS, getProgressionTimeline } from '../../data/gameProgression';
import { exportVoixViveFile, importVoixViveFile } from '../../data/saveState';
import { vvGet, vvSet } from '../../lib/storage';
import { STORAGE_KEYS } from '../../lib/storageKeys';

// ╔══ VOIX VIVE ════════════════════════════════════════════════════╗
// ║ FILE    : CharacterSheet.jsx                                    ║
// ║ P · Perspective  : Student identity — shows who the student    ║
// ║                    is becoming through their practice journey   ║
// ║ E · Engineering  : Renders Bard Level, stats, interval badges, ║
// ║                    and Truebadour Type profile from traction    ║
// ║ A · Aesthetic    : Dark parchment, gold accents, esoteric bard ║
// ║ R · Research     : docs/03_TRUEBADOUR.md §Four Truebadour Types║
// ║ L · Layout       : Used by: PlaybookShell                      ║
// ║                    Uses: playbookData, useScaffolding, useLocale║
// ╠═════════════════════════════════════════════════════════════════╣
// ║ STAGE   : IMPLEMENT (ADDIECRAPEYE phase 4)                      ║
// ║ IP      : No Florins, no Great Game stats, no Trinity Channels  ║
// ║ RULES   : Truebadour Types are the identity system — not CAGED ║
// ║ FIX AT  : playbookData.js → computeTruebadourProfile           ║
// ╚═════════════════════════════════════════════════════════════════╝

export default function CharacterSheet() {
  const { traction, updateTraction, bardLevel, practiceMinutes, streak, breathingSessions, userId } = useScaffolding();
  const { locale, t } = useLocale();
  const { user } = useAuth();
  const lang = locale;

  const xpCurrent = traction?.xp || 0;
  const xpNext = getXpForNextLevel(bardLevel);
  const xpProgress = xpNext > 0 ? Math.min(1, xpCurrent / xpNext) : 1;
  const completedFrets = Object.values(traction?.frets || {}).filter(f => (f.traction || 0) >= 60).length;

  // Multi-tiered certifications status
  const [coachingTier, setCoachingTier] = useState('free');
  const [selectedCert, setSelectedCert] = useState(null); // 'apprentice' | 'journeyman' | 'master' | null
  const [showCertModal, setShowCertModal] = useState(false);

  // Camera photo for shareable card
  const [capturedPhoto, setCapturedPhoto] = useState(() => {
    try { return vvGet(STORAGE_KEYS.PROFILE_PHOTO) || null; } catch { return null; }
  });
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const photoCanvasRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } }
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setShowCamera(true);
    } catch (err) {
      devWarn('[CharacterSheet] Camera denied:', err);
      alert(t('cameraAccessDenied_'));
    }
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = photoCanvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 640;
    const ctx2d = canvas.getContext('2d');
    ctx2d.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedPhoto(dataUrl);
    try { vvSet(STORAGE_KEYS.PROFILE_PHOTO, dataUrl); } catch { /* ignore */ }
    // Stop stream
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setShowCamera(false);
  };

  const cancelCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setShowCamera(false);
  };

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
  }, []);

  // Commitment Tier Timeline
  const currentTierId = traction?.commitmentTier || 'committed';
  const startDate = traction?.firstSessionDate || new Date().toISOString();
  const timeline = useMemo(() => getProgressionTimeline(currentTierId, startDate), [currentTierId, startDate]);

  // Badge system — interval mastery from Adventure
  const intervalMastery = useMemo(() => getIntervalMastery(), []);
  const profile = useMemo(() => computeTruebadourProfile(traction), [traction]);
  const overriddenType = useMemo(() => 
    traction?.truebadourTypeOverride ? TRUEBADOUR_TYPES.find(t => t.id === traction.truebadourTypeOverride) : null
  , [traction?.truebadourTypeOverride]);
  const displayType = overriddenType || profile.dominantType;

  // Use Google user data when logged in, fallback to localStorage profile
  const isLoggedIn = !!userId;
  const googleName = user?.user_metadata?.full_name || user?.email?.split('@')[0];
  const googleAvatar = user?.user_metadata?.avatar_url;
  const studentName = (() => {
    if (googleName) return googleName;
    try { return vvGet(STORAGE_KEYS.ACTIVE_PROFILE) || t('adventurer'); }
    catch { return t('adventurer'); }
  })();

  // Synchronize coaching_tier dynamically from the DaaS server
  useEffect(() => {
    const fetchTier = async () => {
      try {
        const resp = await fetch(`http://localhost:8080/api/db/profile?name=${encodeURIComponent(studentName)}`);
        if (resp.ok) {
          const data = await resp.json();
          if (data.profile) {
            setCoachingTier(data.profile.coaching_tier || 'free');
          }
        }
      } catch (e) {
        devWarn('Failed to load profile tier in CharacterSheet:', e);
      }
    };
    if (studentName) {
      fetchTier();
    }
  }, [studentName]);

  const fileInputRef = useRef(null);

  const handleExport = async () => {
    await exportVoixViveFile(studentName);
  };

  // ── Shareable Character Card ──
  const handleShareCard = async () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const W = 1200;
    const H = 675;
    canvas.width = W;
    canvas.height = H;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const title = getBardicTitle(bardLevel);
    const typeName = displayType?.name?.[lang] || displayType?.name?.en || '';
    const typeIcon = displayType?.icon || '🎸';

    // Background
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#0a0a0f');
    grad.addColorStop(0.5, '#12121a');
    grad.addColorStop(1, '#0a0a0f');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Border glow
    ctx.strokeStyle = 'rgba(201, 169, 110, 0.15)';
    ctx.lineWidth = 4;
    ctx.strokeRect(12, 12, W - 24, H - 24);
    ctx.strokeStyle = 'rgba(201, 169, 110, 0.05)';
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 20, W - 40, H - 40);

    // Radial glow center-top
    const glow = ctx.createRadialGradient(W / 2, H * 0.35, 0, W / 2, H * 0.35, 500);
    glow.addColorStop(0, 'rgba(201, 169, 110, 0.08)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // Top brand
    ctx.font = "600 18px 'JetBrains Mono', monospace";
    ctx.fillStyle = 'rgba(201, 169, 110, 0.6)';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '0.3em';
    ctx.fillText('VOIX VIVE', W / 2, 55);
    ctx.font = "400 13px 'JetBrains Mono', monospace";
    ctx.fillStyle = 'rgba(201, 169, 110, 0.35)';
    ctx.fillText('YOUR MUSICAL JOURNEY', W / 2, 80);

    // Portrait
    const portraitSize = 100;
    const portraitY = 100;
    const portraitX = (W - portraitSize) / 2;
    ctx.save();
    ctx.beginPath();
    ctx.arc(W / 2, portraitY + portraitSize / 2, portraitSize / 2, 0, Math.PI * 2);
    ctx.clip();
    if (capturedPhoto) {
      const img = new Image();
      img.src = capturedPhoto;
      try { ctx.drawImage(img, portraitX, portraitY, portraitSize, portraitSize); } catch {
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.fillRect(portraitX, portraitY, portraitSize, portraitSize);
        ctx.font = "400 48px 'Inter', sans-serif";
        ctx.textAlign = 'center';
        ctx.fillText('🎸', W / 2, portraitY + portraitSize / 2 + 16);
      }
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.fillRect(portraitX, portraitY, portraitSize, portraitSize);
      ctx.font = "400 48px 'Inter', sans-serif";
      ctx.textAlign = 'center';
      ctx.fillText('🎸', W / 2, portraitY + portraitSize / 2 + 16);
    }
    ctx.restore();

    // Name
    ctx.font = "300 64px 'Cormorant Garamond', serif";
    ctx.fillStyle = '#f0e6d2';
    ctx.fillText(studentName, W / 2, 230);

    // Title
    ctx.font = "600 28px 'Cormorant Garamond', serif";
    ctx.fillStyle = '#c9a96e';
    ctx.fillText(`${title.title}`, W / 2, 250);

    // Epithet
    ctx.font = "400 20px 'JetBrains Mono', monospace";
    ctx.fillStyle = 'rgba(240, 230, 210, 0.6)';
    ctx.fillText(title.epithet, W / 2, 285);

    // Divider
    ctx.strokeStyle = 'rgba(201, 169, 110, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 180, 310);
    ctx.lineTo(W / 2 + 180, 310);
    ctx.stroke();

    // Stats row
    const stats = [
      { icon: '🔥', label: 'Streak', value: String(streak) },
      { icon: '⏱️', label: 'Minutes', value: String(practiceMinutes) },
      { icon: '🏔️', label: 'Chapters', value: `${completedFrets}/12` },
      { icon: typeIcon, label: 'Type', value: typeName },
    ];
    const statY = 370;
    const colW = W / stats.length;
    stats.forEach((s, i) => {
      const x = i * colW + colW / 2;
      ctx.font = "400 32px 'Inter', sans-serif";
      ctx.fillStyle = '#f0e6d2';
      ctx.textAlign = 'center';
      ctx.fillText(s.icon, x, statY);
      ctx.font = "700 28px 'JetBrains Mono', monospace";
      ctx.fillStyle = '#c9a96e';
      ctx.fillText(s.value, x, statY + 42);
      ctx.font = "400 14px 'JetBrains Mono', monospace";
      ctx.fillStyle = 'rgba(240, 230, 210, 0.45)';
      ctx.fillText(s.label.toUpperCase(), x, statY + 68);
    });

    // Core stat bars (compact)
    const barY = 500;
    const barW = 700;
    const barH = 10;
    const barX = (W - barW) / 2;
    CORE_STATS.forEach((stat, i) => {
      const val = computeStatValue(stat.id, traction);
      const pct = val / 20;
      const y = barY + i * 36;
      const label = (stat.name[lang] || stat.name.en).toUpperCase();
      ctx.font = "400 13px 'JetBrains Mono', monospace";
      ctx.fillStyle = 'rgba(240, 230, 210, 0.5)';
      ctx.textAlign = 'left';
      ctx.fillText(label, barX, y);
      ctx.fillStyle = 'rgba(240, 230, 210, 0.25)';
      ctx.fillRect(barX + 140, y - 8, barW - 180, barH);
      ctx.fillStyle = `rgba(201, 169, 110, ${0.4 + pct * 0.6})`;
      ctx.fillRect(barX + 140, y - 8, (barW - 180) * pct, barH);
      ctx.font = "700 13px 'JetBrains Mono', monospace";
      ctx.fillStyle = '#c9a96e';
      ctx.textAlign = 'right';
      ctx.fillText(String(val), barX + barW, y);
    });

    // Footer URL
    ctx.font = "400 14px 'JetBrains Mono', monospace";
    ctx.fillStyle = 'rgba(201, 169, 110, 0.35)';
    ctx.textAlign = 'center';
    ctx.fillText('voixvive.app · The Chromatic Monomyth', W / 2, H - 35);

    // Export
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    const file = new File([blob], `voix-vive-${studentName.replace(/\s+/g, '-').toLowerCase()}.png`, { type: 'image/png' });

    const text = `${studentName} — ${title.title} (${title.epithet})\n` +
      `🔥 ${streak} streak · ⏱️ ${practiceMinutes} min · 🏔️ ${completedFrets}/12 chapters\n` +
      `${typeIcon} ${typeName}\n` +
      `voixvive.app`;

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: 'My Voix Vive Journey', text });
        return;
      } catch (err) {
        if (err.name !== 'AbortError') devWarn('Share failed:', err);
      }
    }

    // Fallback: download PNG + copy text
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);

    try {
      await navigator.clipboard.writeText(text);
      alert(t('imageDownloadedTextCopied'));
    } catch {
      alert(t('imageDownloaded'));
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await importVoixViveFile(file);
      window.location.reload();
    } catch {
      alert(t('invalidSaveFile'));
    }
    
    // Reset file input so same file can be uploaded again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Determine certification lock states
  const isApprenticeUnlocked = completedFrets >= 4;
  const isJourneymanUnlocked = completedFrets >= 8 && (coachingTier === 'journeyman' || coachingTier === 'master');
  const isMasterUnlocked = completedFrets >= 12 && coachingTier === 'master';

  return (
    <div className="p-5 max-w-[500px] mx-auto text-[#e8edf2]">
      {/* Academy Degrees & Certifications Section */}
      <div className="p-6 rounded-2xl mb-6 text-center text-[#f3e5c8] bg-[linear-gradient(135deg,rgba(212,175,55,0.15),rgba(167,139,250,0.15))] border-[2px_double_#d4af37] shadow-[0_0_30px_rgba(212,175,55,0.25)]">
        <div className="text-[2.5rem] mb-2">🎓 🏆 📜</div>
        <h3 className="font-heading text-[1.4rem] text-[#d4af37] m-0 mb-2.5 font-bold uppercase tracking-[0.05em]">
          {t('academyDegreesCertifications')}
        </h3>
        <p className="font-sans text-[0.8rem] text-[rgba(243,229,200,0.85)] leading-[1.5] m-0 mb-5">
          {t('downloadOfficialScrolls') || `View and download your official printed scrolls certified and signed by Master Truebadour Bertrand Laurence as you mature your somatic guitar skills.`}
        </p>
        
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 w-full max-w-[800px] mt-4 mx-auto text-left">
          {/* Tier 1: Apprentice Bard */}
          <div className={`bg-white/2 rounded-xl p-4 flex flex-col justify-between gap-3 ${isApprenticeUnlocked ? 'border border-cf-gold/30' : 'border border-white/5'}`}>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className={`text-[0.9rem] font-bold ${isApprenticeUnlocked ? 'text-[#e0d0aa]' : 'text-white/40'}`}>
                  Apprentice Bard
                </span>
                <span>{isApprenticeUnlocked ? '⭐' : '🔒'}</span>
              </div>
              <p className="text-[0.65rem] text-white/50 leading-[1.4]">
                {t('unlockedAtFret14')}
              </p>
            </div>
            {isApprenticeUnlocked ? (
              <button 
                onClick={() => { setSelectedCert('apprentice'); setShowCertModal(true); }}
                className="w-full py-2 px-3 rounded-lg font-mono text-[0.75rem] font-bold tracking-[0.05em] uppercase cursor-pointer bg-[linear-gradient(135deg,var(--cf-gold),#8a6f3e)] text-[#1a120b] shadow-[0_4px_12px_rgba(212,175,55,0.3)] transition-all duration-200 hover:brightness-110"
              >
                📜 {t('viewScroll')}
              </button>
            ) : (
              <div className="flex flex-col gap-1.5">
                <div className="text-[0.7rem] text-white/30 font-mono text-center">
                  {completedFrets} / 4 {t('fretsMastered')}
                </div>
                <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                  <div className="h-full bg-cf-gold/30 rounded-full" style={{ width: `${(Math.min(completedFrets, 4) / 4) * 100}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* Tier 2: Journeyman Bard */}
          <div className={`bg-white/2 rounded-xl p-4 flex flex-col justify-between gap-3 ${isJourneymanUnlocked ? 'border border-cf-gold/30' : 'border border-white/5'}`}>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className={`text-[0.9rem] font-bold ${isJourneymanUnlocked ? '#d4af37' : 'text-white/40'}`}>
                  Journeyman Bard
                </span>
                <span>{isJourneymanUnlocked ? '🌟' : '🔒'}</span>
              </div>
              <p className="text-[0.65rem] text-white/50 leading-[1.4]">
                {t('unlockedAtFret18')}
              </p>
            </div>
            {isJourneymanUnlocked ? (
              <button 
                onClick={() => { setSelectedCert('journeyman'); setShowCertModal(true); }}
                className="w-full py-2 px-3 rounded-lg font-mono text-[0.75rem] font-bold tracking-[0.05em] uppercase cursor-pointer bg-[linear-gradient(135deg,#d4af37,#aa7c11)] text-[#1a120b] shadow-[0_4px_12px_rgba(212,175,55,0.3)] transition-all duration-200 hover:brightness-110"
              >
                📜 {t('viewScroll')}
              </button>
            ) : (
              <div className="flex flex-col gap-1.5">
                <div className="text-[0.7rem] text-white/30 font-mono text-center">
                  {completedFrets} / 8 {t('fretsMastered')}
                </div>
                <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                  <div className="h-full bg-cf-gold/30 rounded-full" style={{ width: `${(Math.min(completedFrets, 8) / 8) * 100}%` }} />
                </div>
                {(coachingTier === 'free' || coachingTier === 'apprentice') && (
                  <a href="https://buy.stripe.com/4gw2ad9jK5C95P2cMO" target="_blank" rel="noopener noreferrer"
                    className="w-full py-1.5 px-2 rounded-lg font-mono text-[0.65rem] font-bold tracking-[0.05em] uppercase cursor-pointer text-center no-underline bg-white/5 border border-white/10 text-white/80 shadow-[0_4px_12px_rgba(212,175,55,0.3)] transition-all duration-200 hover:brightness-110"
                  >
                    🎸 {t('bookAudition45')}
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Tier 3: Master Bard */}
          <div className={`bg-white/2 rounded-xl p-4 flex flex-col justify-between gap-3 ${isMasterUnlocked ? 'border border-cf-gold/30' : 'border border-white/5'}`}>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className={`text-[0.9rem] font-bold ${isMasterUnlocked ? 'text-[#d4af37]' : 'text-white/40'}`}>
                  Master Bard
                </span>
                <span>{isMasterUnlocked ? '👑' : '🔒'}</span>
              </div>
              <p className="text-[0.65rem] text-white/50 leading-[1.4]">
                {t('unlockedAtFret112')}
              </p>
            </div>
            {isMasterUnlocked ? (
              <button 
                onClick={() => { setSelectedCert('master'); setShowCertModal(true); }}
                className="w-full py-2 px-3 rounded-lg font-mono text-[0.75rem] font-bold tracking-[0.05em] uppercase cursor-pointer bg-[linear-gradient(135deg,#d4af37,#aa7c11)] text-[#1a120b] shadow-[0_4px_12px_rgba(212,175,55,0.3)] transition-all duration-200 hover:brightness-110"
              >
                📜 {t('viewScroll')}
              </button>
            ) : (
              <div className="flex flex-col gap-1.5">
                <div className="text-[0.7rem] text-white/30 font-mono text-center">
                  {completedFrets} / 12 {t('fretsMastered')}
                </div>
                <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                  <div className="h-full bg-cf-gold/30 rounded-full" style={{ width: `${(Math.min(completedFrets, 12) / 12) * 100}%` }} />
                </div>
                {coachingTier !== 'master' && (
                  <a href="https://buy.stripe.com/4gw2ad9jK5C95P2cMO" target="_blank" rel="noopener noreferrer"
                    className="w-full py-1.5 px-2 rounded-lg font-mono text-[0.65rem] font-bold tracking-[0.05em] uppercase cursor-pointer text-center no-underline bg-white/5 border border-white/10 text-white/80 shadow-[0_4px_12px_rgba(212,175,55,0.3)] transition-all duration-200 hover:brightness-110"
                  >
                    🎸 {t('bookMasterReview')}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Stats Header */}
      <div className="flex items-center gap-4 mb-6 p-5 rounded-2xl bg-[linear-gradient(135deg,rgba(var(--cf-gold-rgb),0.08)_0%,rgba(var(--cf-gold-rgb),0.02)_100%)] border border-cf-gold/20">
        <div className="relative">
          <div className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 bg-cf-gold/10 border-2 border-cf-gold/30">
            {googleAvatar || capturedPhoto ? (
              <img 
                src={capturedPhoto || googleAvatar} 
                alt="Portrait" 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-[2rem] font-serif">🎸</span>
            )}
          </div>
          <button 
            onClick={startCamera}
            title={t('takePhoto')}
            className="absolute bottom-[-4px] right-[-4px] w-7 h-7 rounded-full bg-[#c9a96e]/90 border-2 border-[#0a0a0f] text-[#0a0a0f] text-xs flex items-center justify-center cursor-pointer p-0"
          >
            📸
          </button>
        </div>
        <div className="flex-1">
          <h2 className="font-heading text-[1.6rem] font-semibold m-0 mb-0.5 text-[#f0e6d2]">{studentName}</h2>
          <p className="font-mono text-[0.75rem] text-cf-gold tracking-[0.1em] m-0">
            Masterclass Learner Profile
          </p>
          {isLoggedIn && (
            <p className="font-mono text-[0.6rem] text-green-400 tracking-[0.08em] mt-1 opacity-80">☁️ {t('synced') || 'Cloud sync active'}</p>
          )}
        </div>
        <button
          onClick={handleShareCard}
          className="ml-auto py-2 px-[18px] rounded-lg bg-[linear-gradient(135deg,rgba(var(--cf-gold-rgb),0.2),rgba(var(--cf-gold-rgb),0.05))] border border-cf-gold/40 text-cf-gold font-mono text-[0.7rem] font-semibold tracking-[0.1em] uppercase cursor-pointer transition-all duration-300 flex items-center gap-1.5 hover:brightness-110"
        >
          📤 {t('share')}
        </button>
      </div>

      {/* Quick Stats Row */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <div className="flex-1 min-w-[60px] py-2.5 px-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col items-center gap-0.5">
          <span className="text-[1.1rem]">🔥</span>
          <span className="font-mono text-[1rem] font-bold text-[#f0e6d2]">{streak}</span>
          <span className="font-mono text-[0.55rem] text-white/30 tracking-[0.08em] uppercase">{t('streakLabel')}</span>
        </div>
        <div className="flex-1 min-w-[60px] py-2.5 px-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col items-center gap-0.5">
          <span className="text-[1.1rem]">⏱️</span>
          <span className="font-mono text-[1rem] font-bold text-[#f0e6d2]">{practiceMinutes}</span>
          <span className="font-mono text-[0.55rem] text-white/30 tracking-[0.08em] uppercase">{t('minLabel')}</span>
        </div>
        <div className="flex-1 min-w-[60px] py-2.5 px-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col items-center gap-0.5">
          <span className="text-[1.1rem]">🫁</span>
          <span className="font-mono text-[1rem] font-bold text-[#f0e6d2]">{breathingSessions}</span>
          <span className="font-mono text-[0.55rem] text-white/30 tracking-[0.08em] uppercase">{t('breathsLabel')}</span>
        </div>
        <div className="flex-1 min-w-[60px] py-2.5 px-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col items-center gap-0.5">
          <span className="text-[1.1rem]">🏔️</span>
          <span className="font-mono text-[1rem] font-bold text-[#f0e6d2]">{completedFrets}/12</span>
          <span className="font-mono text-[0.55rem] text-white/30 tracking-[0.08em] uppercase">Modules</span>
        </div>
      </div>

      {/* Commitment Tier Section */}
      <div className="mb-5">
        <h3 className="font-mono text-[0.65rem] text-[rgba(var(--cf-gold-rgb),0.5)] tracking-[0.25em] uppercase text-center mb-4">
          {t('yourPath')}
        </h3>
        <p className="text-center mb-4 opacity-60 text-[0.75rem] font-mono">
          {t('targetPracticeGraduation', { min: timeline.tier.dailyMinutes, date: timeline.graduationFormatted }) || `Target practice: ${timeline.tier.dailyMinutes} min/day. Graduation ETA: ${timeline.graduationFormatted}`}
        </p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2">
          {Object.values(COMMITMENT_TIERS).map(tier => (
            <button
              key={tier.id}
              onClick={() => updateTraction({ commitmentTier: tier.id })}
              className="rounded-lg p-3 text-center cursor-pointer transition-all duration-200"
              style={{
                background: currentTierId === tier.id ? `${tier.color}20` : 'rgba(255,255,255,0.02)',
                border: currentTierId === tier.id ? `1px solid ${tier.color}` : '1px solid rgba(255,255,255,0.1)',
                opacity: currentTierId === tier.id ? 1 : 0.6
              }}
            >
              <div className="text-[1.5rem] mb-1">{tier.icon}</div>
              <div className="text-[0.8rem] font-bold" style={{ color: currentTierId === tier.id ? tier.color : '#e8edf2' }}>
                {tier.name[lang]}
              </div>
              <div className="text-[0.6rem] text-white/50 mt-1">
                {tier.subtitle[lang]}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Stat Block — 5 Core Abilities */}
      <div className="mb-5">
        <h3 className="font-mono text-[0.65rem] text-[rgba(var(--cf-gold-rgb),0.5)] tracking-[0.25em] uppercase text-center mb-4">
          Core Competencies
        </h3>
        <div className="flex flex-col gap-2">
          {CORE_STATS.map(stat => {
            const value = computeStatValue(stat.id, traction);
            const statName = stat.name[lang] || stat.name.en;
            return (
              <div key={stat.id} className="grid grid-cols-[32px_36px_1fr] grid-rows-[auto_auto] items-center gap-x-2.5 gap-y-0 py-3 px-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <span className="text-[1.2rem] row-span-2 text-center">{stat.icon}</span>
                <span className="font-mono text-[1.1rem] font-bold text-cf-gold">{value}</span>
                <span className="font-sans text-[0.8rem] text-white/60">{statName}</span>
                <div className="col-span-2 h-[3px] rounded-sm bg-white/[0.06] overflow-hidden mt-1">
                  <div className="h-full rounded-sm" style={{ width: `${(value / 20) * 100}%`, background: 'linear-gradient(90deg, rgba(var(--cf-gold-rgb),0.6), rgba(var(--cf-gold-rgb),0.3))', transition: 'width 0.5s ease' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interval Mastery Badges */}
      <div className="mb-5">
        <h3 className="font-mono text-[0.65rem] text-[rgba(var(--cf-gold-rgb),0.5)] tracking-[0.25em] uppercase text-center mb-4">
          {t('intervalMastery')}
        </h3>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-2">
          {INTERVAL_BADGES.map(badge => {
            const level = intervalMastery[badge.id] || 'none';
            const masteryDef = MASTERY_LEVELS.find(m => m.id === level);
            const isLocked = level === 'none';
            return (
              <div key={badge.id} className="flex flex-col items-center gap-[3px] py-3 px-1.5 pb-2.5 rounded-xl border transition-all duration-300 relative"
                style={{
                  borderColor: isLocked ? 'rgba(255,255,255,0.06)' : `${badge.color}40`,
                  background: isLocked ? 'rgba(255,255,255,0.02)' : `${badge.color}0a`,
                  opacity: isLocked ? 0.45 : 1,
                }}
              >
                <span className="text-[1.4rem] leading-none" style={{ color: isLocked ? '#3a3a4a' : badge.color }}>
                  {badge.symbol}
                </span>
                <span className="font-mono text-[0.85rem] font-bold" style={{ color: isLocked ? '#3a3a4a' : '#e8edf2' }}>
                  {badge.note}
                </span>
                <span className="font-mono text-[0.5rem] tracking-[0.05em] uppercase" style={{ color: isLocked ? '#2a2a3a' : 'rgba(255,255,255,0.5)' }}>
                  {badge.interval[lang]}
                </span>
                <span className="font-mono text-[0.55rem]" style={{ color: isLocked ? '#2a2a3a' : `${badge.color}80` }}>
                  {badge.ratio}
                </span>
                {masteryDef && (
                  <span className="font-mono text-[0.55rem] mt-0.5" style={{ color: masteryDef.color }}>
                    {masteryDef.icon} {masteryDef.stars}
                  </span>
                )}
                {isLocked && <span className="text-[0.7rem] mt-0.5">🔒</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Truebadour Type — Four Archetypes */}
      <div className="mb-5">
        <h3 className="font-mono text-[0.65rem] text-[rgba(var(--cf-gold-rgb),0.5)] tracking-[0.25em] uppercase text-center mb-4">
          Student Archetype
        </h3>
        <div className="text-center mb-4">
          <select 
            value={traction?.truebadourTypeOverride || ''}
            onChange={(e) => updateTraction({ truebadourTypeOverride: e.target.value || null })}
            className="bg-black/30 text-[#e0d0aa] border border-cf-gold/30 py-1.5 px-3 rounded-lg font-mono text-[0.75rem] outline-none cursor-pointer appearance-none"
          >
            <option value="">{t('autodetect')}</option>
            {TRUEBADOUR_TYPES.map(type => (
              <option key={type.id} value={type.id}>
                {type.icon} {type.name[lang]}
              </option>
            ))}
          </select>
        </div>
        {displayType && (
          <p className="font-heading text-[1.3rem] font-normal text-[#e0d0aa] text-center mb-4 italic">
            {displayType.icon} {displayType.name[lang]}
            {overriddenType && <span className="text-[0.75rem] not-italic text-white/40 font-mono">{t('chosen')}</span>}
          </p>
        )}
        <div className="flex flex-col gap-2.5">
          {TRUEBADOUR_TYPES.map(type => {
            const val = profile[type.id] || 0;
            return (
              <div key={type.id} className="flex items-center gap-2.5">
                <span className="text-[1rem] w-6 text-center">{type.icon}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-mono text-[0.6rem] tracking-[0.08em] uppercase" style={{ color: type.color }}>
                      {type.name[lang]}
                    </span>
                    <span className="font-mono text-[0.6rem] text-white/35">{Math.round(val * 100)}%</span>
                  </div>
                  <div className="h-1 rounded-sm bg-white/[0.06] overflow-hidden">
                    <div className="h-full rounded-sm transition-[width] duration-500 ease-out"
                      style={{
                        width: `${val * 100}%`,
                        background: type.color,
                        boxShadow: `0 0 8px ${type.color}40`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Memory Card System */}
      <div className="mb-5 mt-8">
        <h3 className="font-mono text-[0.65rem] text-[rgba(var(--cf-gold-rgb),0.5)] tracking-[0.25em] uppercase text-center mb-4">
          {t('theTruebadoursJournal')}
        </h3>
        <p className="text-center mb-4 opacity-60 text-[0.65rem] normal-case tracking-normal font-sans">
          {t('youAreTheSole')}
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button 
            onClick={handleExport}
            className="py-2.5 px-4 rounded-lg font-mono text-[0.75rem] cursor-pointer transition-all duration-200 bg-cf-gold/10 border border-cf-gold/30 text-[#e0d0aa] hover:bg-cf-gold/20"
          >
            💾 {t('sealTheJournal')}
          </button>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="py-2.5 px-4 rounded-lg font-mono text-[0.75rem] cursor-pointer transition-all duration-200 bg-white/5 border border-white/10 text-white/80 hover:bg-white/10"
          >
            📜 {t('presentYourJournal')}
          </button>
          <input 
            type="file" 
            accept=".voixvive,.json"
            ref={fileInputRef}
            onChange={handleImport}
            className="hidden"
          />
        </div>
      </div>

      {/* Camera overlay */}
      {showCamera && (
        <div className="fixed inset-0 z-[2000] bg-black/90 flex flex-col items-center justify-center gap-4 p-5">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-[min(320px,80vw)] h-[min(320px,80vw)] rounded-full object-cover border-2 border-cf-gold/40"
          />
          <canvas ref={photoCanvasRef} className="hidden" />
          <div className="flex gap-3">
            <button
              onClick={takePhoto}
              className="py-2.5 px-7 rounded-full bg-cf-gold text-[#0a0a0f] font-mono text-xs font-bold tracking-[0.1em] uppercase border-none cursor-pointer"
            >
              📸 {t('capture')}
            </button>
            <button
              onClick={cancelCamera}
              className="py-2.5 px-6 rounded-full bg-white/10 text-white font-mono text-xs border border-white/20 cursor-pointer"
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      )}

      {showCertModal && selectedCert && (
        <div className="fixed inset-0 bg-black/85 z-[1000] flex items-center justify-center p-5 backdrop-blur-[5px] no-print">
          <style>{`
            @media print {
              body * {
                visibility: hidden;
              }
              #printable-certificate, #printable-certificate * {
                visibility: visible;
              }
              #printable-certificate {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background: #fbf8f0 !important;
                color: #2c1a04 !important;
                border: 8px double #8a6f3e !important;
                padding: 50px !important;
                box-sizing: border-box;
                display: flex !important;
                flex-direction: column !important;
                justify-content: space-between !important;
              }
              .no-print {
                display: none !important;
              }
            }
          `}</style>
          
          <div className={`p-[30px] max-w-[650px] w-full rounded-lg text-center shadow-[0_0_40px_rgba(0,0,0,0.6)] relative text-[#f3e5c8] bg-[#1c1510] border-[3px] border-double ${selectedCert === 'master' ? 'border-[#d4af37]' : selectedCert === 'journeyman' ? 'border-[var(--cf-gold)]' : 'border-[#8a8a8a]'}`}>
            <button 
              onClick={() => { setShowCertModal(false); setSelectedCert(null); }}
              className="absolute top-[15px] right-[15px] bg-transparent border-none text-[#d4af37] text-[1.2rem] cursor-pointer"
            >
              ✕
            </button>
            
            {/* Printable Certificate Frame */}
            <div id="printable-certificate" className={`border-2 py-8 px-6 rounded bg-[#1f1812] ${selectedCert === 'master' ? 'border-[#d4af37]/60 shadow-[inset_0_0_20px_rgba(212,175,55,0.15)] bg-[radial-gradient(circle,rgba(212,175,55,0.08)_0%,transparent_80%)]' : selectedCert === 'journeyman' ? 'border-[rgba(var(--cf-gold-rgb),0.4)] bg-[radial-gradient(circle,rgba(var(--cf-gold-rgb),0.05)_0%,transparent_80%)]' : 'border-white/20'}`}>
              {/* Emblem */}
              <div className="text-[2.5rem] mb-3">
                {selectedCert === 'master' ? '👑' : selectedCert === 'journeyman' ? '🌟' : '⭐'}
              </div>
              
              {/* Header Title */}
              <h2 className={`font-serif text-[1.8rem] md:text-[2.2rem] tracking-[0.06em] m-0 mb-2 uppercase ${selectedCert === 'master' ? 'text-[#d4af37]' : 'text-[#e0d0aa]'}`}>
                {selectedCert === 'master' 
                  ? (t('bertrandApprovedTruebadourMaster'))
                  : selectedCert === 'journeyman'
                  ? (t('truebadourJourneymanCertificate'))
                  : (t('truebadourApprenticeCertificate'))
                }
              </h2>
              
              <div className={`text-xs font-mono uppercase tracking-[0.15em] mb-6 ${selectedCert === 'master' ? 'text-[#d4af37]' : 'text-white/40'}`}>
                {t('voixViveMusicAcademy')}
              </div>
              
              <p className="italic text-[0.9rem] m-0 mb-[15px] text-white/70">
                {t('thisIsToCertify')}
              </p>
              
              {/* Student Name */}
              <h3 className="font-serif text-[2.4rem] text-white m-[10px_0_20px] shadow-[0_2px_4px_rgba(0,0,0,0.5)] border-b border-[#d4af37]/30 pb-2.5 inline-block min-w-[320px]">
                {studentName}
              </h3>
              
              {/* Detailed Somatic Text */}
              <p className="text-[0.85rem] leading-[1.6] max-w-[520px] mx-auto mb-6 text-white/85">
                {selectedCert === 'master' ? (
                  t('hasSuccessfullyDemonstratedAbsolute')
                ) : selectedCert === 'journeyman' ? (
                  t('hasCompletedSomaticGuitar')
                ) : (
                  t('hasSuccessfullyUnlockedSomatic')
                )}
              </p>
              
              {/* Seals and signatures */}
              <div className="flex justify-between items-center mt-[35px] px-5">
                <div className="text-left">
                  <div className="text-[0.8rem] font-serif border-b border-white/20 pb-1 w-[140px] italic">
                    {new Date().toLocaleDateString(t('enus'))}
                  </div>
                  <div className="text-[0.6rem] text-white/40 font-mono uppercase mt-1">
                    {t('dateOfAward')}
                  </div>
                </div>
                
                {/* Wax Seal Graphic for Premium Feel */}
                <div className="flex flex-col items-center">
                  <svg width="50" height="50" viewBox="0 0 100 100" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                    <circle cx="50" cy="50" r="42" fill={selectedCert === 'master' ? '#b22222' : selectedCert === 'journeyman' ? '#a0522d' : '#4682b4'} opacity="0.9" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#d4af37" strokeWidth="2" strokeDasharray="3,3" />
                    <text x="50" y="55" textAnchor="middle" fill="#d4af37" fontSize="12" fontWeight="bold" fontFamily="'Cormorant Garamond', serif">
                      {selectedCert === 'master' ? 'MASTER' : selectedCert === 'journeyman' ? 'BARD' : 'APPR'}
                    </text>
                  </svg>
                  <span className="text-[0.5rem] text-white/40 font-mono uppercase mt-1">
                    {t('officialSeal')}
                  </span>
                </div>
                
                <div className="text-right">
                  <div className="text-[1rem] font-serif text-[#d4af37] border-b border-white/20 pb-1 w-[140px] italic font-semibold">
                    Bertrand Laurence
                  </div>
                  <div className="text-[0.6rem] text-white/40 font-mono uppercase mt-1">
                    {t('mentorshipSeal')}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-[15px] justify-center mt-[25px]">
              <button 
                onClick={() => window.print()}
                className="py-2.5 px-5 rounded-lg font-mono text-[0.7rem] font-bold tracking-[0.05em] uppercase cursor-pointer bg-[linear-gradient(135deg,#10b981,#059669)] text-white shadow-[0_4px_12px_rgba(212,175,55,0.3)] transition-all duration-200"
              >
                🖨️ {t('printSavePdf')}
              </button>
              <button 
                onClick={() => { setShowCertModal(false); setSelectedCert(null); }}
                className="py-2.5 px-5 rounded-lg font-mono text-[0.7rem] font-bold tracking-[0.05em] uppercase cursor-pointer bg-white/10 border border-white/20 text-white shadow-[0_4px_12px_rgba(212,175,55,0.3)] transition-all duration-200"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
