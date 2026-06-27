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
      <div className="p-6 rounded-2xl mb-6 text-center text-[#f3e5c8]" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(167,139,250,0.15))', border: '2px double #d4af37', boxShadow: '0 0 30px rgba(212,175,55,0.25)' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🎓 🏆 📜</div>
        <h3 className="font-heading text-[1.4rem] text-[#d4af37] m-0 mb-2.5 font-bold uppercase tracking-[0.05em]">
          {t('academyDegreesCertifications')}
        </h3>
        <p className="font-sans text-[0.8rem] text-[rgba(243,229,200,0.85)] leading-[1.5] m-0 mb-5">
          {lang === 'fr' 
            ? `Consultez et téléchargez vos diplômes officiels signés par Maître Bertrand Laurence au fur et à mesure de votre progression somatique.`
            : `View and download your official printed scrolls certified and signed by Master Truebadour Bertrand Laurence as you mature your somatic guitar skills.`}
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          width: '100%',
          maxWidth: '800px',
          margin: '16px auto 0',
          textAlign: 'left'
        }}>
          {/* Tier 1: Apprentice Bard */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: isApprenticeUnlocked ? '1px solid rgba(var(--cf-gold-rgb),0.3)' : '1px solid rgba(255,255,255,0.05)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: isApprenticeUnlocked ? '#e0d0aa' : 'rgba(255,255,255,0.4)' }}>
                  Apprentice Bard
                </span>
                <span>{isApprenticeUnlocked ? '⭐' : '🔒'}</span>
              </div>
              <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.4' }}>
                {t('unlockedAtFret14')}
              </p>
            </div>
            {isApprenticeUnlocked ? (
              <button 
                onClick={() => { setSelectedCert('apprentice'); setShowCertModal(true); }}
                className="w-full py-2 px-3 rounded-lg font-mono text-[0.75rem] font-bold tracking-[0.05em] uppercase cursor-pointer" style={{ background: 'linear-gradient(135deg, #d4af37, #aa7c11)', color: '#1a120b', boxShadow: '0 4px 12px rgba(212,175,55,0.3)', transition: 'all 0.2s' }}
              >
                📜 {t('viewScroll')}
              </button>
            ) : (
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace", textAlign: 'center', padding: '8px 0' }}>
                {completedFrets}/4 Frets Complete
              </div>
            )}
          </div>

          {/* Tier 2: Journeyman Bard */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: isJourneymanUnlocked ? '1px solid rgba(var(--cf-gold-rgb),0.5)' : '1px solid rgba(255,255,255,0.05)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: isJourneymanUnlocked ? '#e0d0aa' : 'rgba(255,255,255,0.4)' }}>
                  Journeyman Bard
                </span>
                <span>{isJourneymanUnlocked ? '🌟' : '🔒'}</span>
              </div>
              <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.4' }}>
                {t('requiresFret18Complete_')}
              </p>
            </div>
            {isJourneymanUnlocked ? (
              <button 
                onClick={() => { setSelectedCert('journeyman'); setShowCertModal(true); }}
                className="w-full py-2 px-3 rounded-lg font-mono text-[0.75rem] font-bold tracking-[0.05em] uppercase cursor-pointer" style={{ background: 'linear-gradient(135deg, var(--cf-gold), #8a6f3e)', color: '#1a120b', boxShadow: '0 4px 12px rgba(212,175,55,0.3)', transition: 'all 0.2s' }}
              >
                📜 {t('viewScroll')}
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace", textAlign: 'center' }}>
                  {completedFrets}/8 Frets Complete
                </div>
                <a
                  href="https://bertrandguitarstudio.duetpartner.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-1.5 px-2 rounded-lg font-mono text-[0.65rem] font-bold tracking-[0.05em] uppercase cursor-pointer text-center no-underline" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', boxShadow: '0 4px 12px rgba(212,175,55,0.3)', transition: 'all 0.2s' }}
                >
                  🎸 {t('bookAudition45')}
                </a>
              </div>
            )}
          </div>

          {/* Tier 3: Bertrand Approved Truebadour */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: isMasterUnlocked ? '1px solid rgba(212,175,55,0.5)' : '1px solid rgba(255,255,255,0.05)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: isMasterUnlocked ? '#d4af37' : 'rgba(255,255,255,0.4)' }}>
                  Truebadour Master
                </span>
                <span>{isMasterUnlocked ? '👑' : '🔒'}</span>
              </div>
              <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.4' }}>
                {t('requiresAll12Modules_')}
              </p>
            </div>
            {isMasterUnlocked ? (
              <button 
                onClick={() => { setSelectedCert('master'); setShowCertModal(true); }}
                className="w-full py-2 px-3 rounded-lg font-mono text-[0.75rem] font-bold tracking-[0.05em] uppercase cursor-pointer" style={{ background: 'linear-gradient(135deg, #d4af37, #aa7c11)', color: '#1a120b', boxShadow: '0 4px 12px rgba(212,175,55,0.3)', transition: 'all 0.2s' }}
              >
                📜 {t('viewScroll')}
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace", textAlign: 'center' }}>
                  {completedFrets}/12 Frets Complete
                </div>
                <a
                  href="https://bertrandguitarstudio.duetpartner.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-1.5 px-2 rounded-lg font-mono text-[0.65rem] font-bold tracking-[0.05em] uppercase cursor-pointer text-center no-underline" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', boxShadow: '0 4px 12px rgba(212,175,55,0.3)', transition: 'all 0.2s' }}
                >
                  🎸 {t('bookMasterReview')}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Header — Name & Level */}
      <div className="flex items-center gap-4 mb-6 p-5 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(var(--cf-gold-rgb),0.08) 0%, rgba(var(--cf-gold-rgb),0.02) 100%)', border: '1px solid rgba(var(--cf-gold-rgb),0.2)' }}>
        <div style={{ position: 'relative' }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(var(--cf-gold-rgb),0.1)', border: '2px solid rgba(var(--cf-gold-rgb),0.3)' }}>
            {capturedPhoto ? (
              <img
                src={capturedPhoto}
                alt={studentName}
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : googleAvatar ? (
              <img
                src={googleAvatar}
                alt={studentName}
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <span className="text-[1.8rem]">🎸</span>
            )}
          </div>
          <button
            onClick={startCamera}
            title={t('takePhoto')}
            style={{
              position: 'absolute',
              bottom: -4,
              right: -4,
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'rgba(201, 169, 110, 0.9)',
              border: '2px solid #0a0a0f',
              color: '#0a0a0f',
              fontSize: '0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
            }}
          >
            📷
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
          style={{
            marginLeft: 'auto',
            padding: '8px 18px',
            borderRadius: 10,
            background: 'linear-gradient(135deg, rgba(var(--cf-gold-rgb),0.2), rgba(var(--cf-gold-rgb),0.05))',
            border: '1px solid rgba(var(--cf-gold-rgb),0.4)',
            color: 'var(--cf-gold)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.7rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          📤 {t('share')}
        </button>
      </div>

      {/* XP Bar */}
      <div className="mb-5">
        <div className="flex justify-between mb-1.5">
          <span className="font-mono text-[0.65rem] text-[rgba(var(--cf-gold-rgb),0.6)] tracking-[0.15em] uppercase">XP</span>
          <span className="font-mono text-[0.65rem] text-white/40">{xpCurrent} / {xpNext}</span>
        </div>
        <div className="h-1.5 rounded-md bg-white/[0.06] overflow-hidden">
          <div className="h-full rounded-md" style={{ width: `${xpProgress * 100}%`, background: 'linear-gradient(90deg, var(--cf-gold), #e0d0aa)', boxShadow: '0 0 8px rgba(var(--cf-gold-rgb),0.4)', transition: 'width 0.5s ease' }} />
        </div>
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
          {lang === 'fr' 
            ? `Temps de pratique cible: ${timeline.tier.dailyMinutes} min/jour. Graduation: ${timeline.graduationFormatted}`
            : `Target practice: ${timeline.tier.dailyMinutes} min/day. Graduation ETA: ${timeline.graduationFormatted}`}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }}>
          {Object.values(COMMITMENT_TIERS).map(tier => (
            <button
              key={tier.id}
              onClick={() => updateTraction({ commitmentTier: tier.id })}
              style={{
                background: currentTierId === tier.id ? `${tier.color}20` : 'rgba(255,255,255,0.02)',
                border: currentTierId === tier.id ? `1px solid ${tier.color}` : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '12px 8px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                opacity: currentTierId === tier.id ? 1 : 0.6
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{tier.icon}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: currentTierId === tier.id ? tier.color : '#e8edf2' }}>
                {tier.name[lang]}
              </div>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
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
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
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
                <div style={{ flex: 1 }}>
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
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={handleExport}
            className="py-2.5 px-4 rounded-lg font-mono text-[0.75rem] cursor-pointer transition-all duration-200" style={{ background: 'rgba(var(--cf-gold-rgb),0.1)', border: '1px solid rgba(var(--cf-gold-rgb),0.3)', color: '#e0d0aa' }}
          >
            💾 {t('sealTheJournal')}
          </button>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="py-2.5 px-4 rounded-lg font-mono text-[0.75rem] cursor-pointer transition-all duration-200" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}
          >
            📜 {t('presentYourJournal')}
          </button>
          <input 
            type="file" 
            accept=".voixvive,.json"
            ref={fileInputRef}
            onChange={handleImport}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {/* Camera overlay */}
      {showCamera && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2000,
          background: 'rgba(0,0,0,0.92)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          padding: 20,
        }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: 'min(320px, 80vw)',
              height: 'min(320px, 80vw)',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid rgba(201, 169, 110, 0.4)',
            }}
          />
          <canvas ref={photoCanvasRef} style={{ display: 'none' }} />
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={takePhoto}
              style={{
                padding: '10px 28px',
                borderRadius: 50,
                background: 'var(--cf-gold)',
                color: '#0a0a0f',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              📸 {t('capture')}
            </button>
            <button
              onClick={cancelCamera}
              style={{
                padding: '10px 24px',
                borderRadius: 50,
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.75rem',
                border: '1px solid rgba(255,255,255,0.2)',
                cursor: 'pointer',
              }}
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      )}

      {showCertModal && selectedCert && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          backdropFilter: 'blur(5px)'
        }} className="no-print">
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
          
          <div style={{
            background: '#1c1510',
            border: selectedCert === 'master' ? '3px double #d4af37' : selectedCert === 'journeyman' ? '3px double var(--cf-gold)' : '3px double #8a8a8a',
            padding: '30px',
            maxWidth: '650px',
            width: '100%',
            borderRadius: '8px',
            textAlign: 'center',
            boxShadow: '0 0 40px rgba(0,0,0,0.6)',
            position: 'relative',
            color: '#f3e5c8',
          }}>
            <button 
              onClick={() => { setShowCertModal(false); setSelectedCert(null); }}
              style={{
                position: 'absolute',
                top: 15, right: 15,
                background: 'none',
                border: 'none',
                color: '#d4af37',
                fontSize: '1.2rem',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
            
            {/* Printable Certificate Frame */}
            <div id="printable-certificate" style={{
              border: selectedCert === 'master' ? '2px solid rgba(212,175,55,0.6)' : selectedCert === 'journeyman' ? '2px solid rgba(var(--cf-gold-rgb),0.4)' : '2px solid rgba(255,255,255,0.2)',
              padding: '32px 24px',
              borderRadius: '4px',
              backgroundColor: '#1f1812',
              backgroundImage: selectedCert === 'master' 
                ? 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 80%)'
                : 'radial-gradient(circle, rgba(var(--cf-gold-rgb),0.05) 0%, transparent 80%)',
              boxShadow: selectedCert === 'master' ? '0 0 20px rgba(212,175,55,0.15) inset' : 'none'
            }}>
              {/* Emblem */}
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>
                {selectedCert === 'master' ? '👑' : selectedCert === 'journeyman' ? '🌟' : '⭐'}
              </div>
              
              {/* Header Title */}
              <h2 style={{ 
                fontFamily: "'Cormorant Garamond', serif", 
                fontSize: selectedCert === 'master' ? '2.2rem' : '1.8rem', 
                color: selectedCert === 'master' ? '#d4af37' : '#e0d0aa', 
                letterSpacing: '0.06em', 
                margin: '0 0 8px', 
                textTransform: 'uppercase' 
              }}>
                {selectedCert === 'master' 
                  ? (t('bertrandApprovedTruebadourMaster'))
                  : selectedCert === 'journeyman'
                  ? (t('truebadourJourneymanCertificate'))
                  : (t('truebadourApprenticeCertificate'))
                }
              </h2>
              
              <div style={{ 
                fontSize: '0.75rem', 
                fontFamily: "'JetBrains Mono', monospace", 
                color: selectedCert === 'master' ? '#d4af37' : 'rgba(255,255,255,0.4)', 
                textTransform: 'uppercase', 
                letterSpacing: '0.15em', 
                marginBottom: 24 
              }}>
                {t('voixViveMusicAcademy')}
              </div>
              
              <p style={{ fontStyle: 'italic', fontSize: '0.9rem', margin: '0 0 15px', color: 'rgba(255,255,255,0.7)' }}>
                {t('thisIsToCertify')}
              </p>
              
              {/* Student Name */}
              <h3 style={{ 
                fontFamily: "'Cormorant Garamond', serif", 
                fontSize: '2.4rem', 
                color: '#ffffff', 
                margin: '10px 0 20px', 
                textShadow: '0 2px 4px rgba(0,0,0,0.5)', 
                borderBottom: '1px solid rgba(212,175,55,0.3)', 
                paddingBottom: '10px', 
                display: 'inline-block', 
                minWidth: '320px' 
              }}>
                {studentName}
              </h3>
              
              {/* Detailed Somatic Text */}
              <p style={{ 
                fontSize: '0.85rem', 
                lineHeight: 1.6, 
                maxWidth: '520px', 
                margin: '0 auto 24px',
                color: 'rgba(255,255,255,0.85)'
              }}>
                {selectedCert === 'master' ? (
                  t('hasSuccessfullyDemonstratedAbsolute')
                ) : selectedCert === 'journeyman' ? (
                  t('hasCompletedSomaticGuitar')
                ) : (
                  t('hasSuccessfullyUnlockedSomatic')
                )}
              </p>
              
              {/* Seals and signatures */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 35, padding: '0 20px' }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.8rem', fontFamily: "'Cormorant Garamond', serif", borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: 4, width: '140px', fontStyle: 'italic' }}>
                    {new Date().toLocaleDateString(t('enus'))}
                  </div>
                  <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', marginTop: 4 }}>
                    {t('dateOfAward')}
                  </div>
                </div>
                
                {/* Wax Seal Graphic for Premium Feel */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <svg width="50" height="50" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))' }}>
                    <circle cx="50" cy="50" r="42" fill={selectedCert === 'master' ? '#b22222' : selectedCert === 'journeyman' ? '#a0522d' : '#4682b4'} opacity="0.9" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#d4af37" strokeWidth="2" strokeDasharray="3,3" />
                    <text x="50" y="55" textAnchor="middle" fill="#d4af37" fontSize="12" fontWeight="bold" fontFamily="'Cormorant Garamond', serif">
                      {selectedCert === 'master' ? 'MASTER' : selectedCert === 'journeyman' ? 'BARD' : 'APPR'}
                    </text>
                  </svg>
                  <span style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.4)', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', marginTop: 4 }}>
                    {t('officialSeal')}
                  </span>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    fontSize: '1rem', 
                    fontFamily: "'Cormorant Garamond', serif", 
                    color: '#d4af37', 
                    borderBottom: '1px solid rgba(255,255,255,0.2)', 
                    paddingBottom: 4, 
                    width: '140px', 
                    fontStyle: 'italic', 
                    fontWeight: 600 
                  }}>
                    Bertrand Laurence
                  </div>
                  <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', marginTop: 4 }}>
                    {t('mentorshipSeal')}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 15, justifyContent: 'center', marginTop: 25 }}>
              <button 
                onClick={() => window.print()}
                className="py-2.5 px-5 rounded-lg font-mono text-[0.7rem] font-bold tracking-[0.05em] uppercase cursor-pointer" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#ffffff', boxShadow: '0 4px 12px rgba(212,175,55,0.3)', transition: 'all 0.2s' }}
              >
                🖨️ {t('printSavePdf')}
              </button>
              <button 
                onClick={() => { setShowCertModal(false); setSelectedCert(null); }}
                className="py-2.5 px-5 rounded-lg font-mono text-[0.7rem] font-bold tracking-[0.05em] uppercase cursor-pointer" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#ffffff', boxShadow: '0 4px 12px rgba(212,175,55,0.3)', transition: 'all 0.2s' }}
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
