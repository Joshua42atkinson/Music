import { devWarn } from '../lib/devLog';
// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : PlayerPortal.jsx                                     ║
// ║ WHAT    : The Player's Sanctum — mentor connection hub          ║
// ║ WHY     : The Player (essential Self) needs a mirror, not a    ║
// ║           game board. This is where vulnerability happens:      ║
// ║           recording for Bertrand, receiving feedback,           ║
// ║           watching the library, reflecting on the journey.     ║
// ║ RULES   : No gamification. No AI required. No jargon.          ║
// ║           One primary action: "Record for Bertrand."           ║
// ║           The Great Game: The Player is the one who observes. ║
// ╚═════════════════════════════════════════════════════════════════╝
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '../hooks/useLocale';
import { useScaffolding } from './ScaffoldingProvider';
import { useAuth } from '../hooks/useAuth';
import { db } from '../data/localDatabase';
import { loadTraction } from '../data/tractionStore';
import PracticeRecorder from './PracticeRecorder';
import { vvGet } from '../lib/storage';
import { STORAGE_KEYS } from '../lib/storageKeys';
import StructuredPracticeRecorder from './StructuredPracticeRecorder';
import TruebadourLoom from '../features/somatic-masterclass/TruebadourLoom';
import { checkSubmissionAvailability } from '../lib/schedulingService';
import {
  Video, Play, Clock, CheckCircle, Circle, Send, BookOpen,
  Mic, Music, Heart, Calendar, ArrowLeft, Film, MessageSquare,
  Feather, AlertCircle, Wind,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════
// BERTRAND'S VIDEO LIBRARY
// Curated teachings available to all students.
// ═══════════════════════════════════════════════════════════
const VIDEO_LIBRARY = [
  {
    id: 'breath-1',
    title: 'The Breath Before the Note',
    duration: '4:32',
    category: 'SHEARL',
    description: 'Why every practice begins with the body.',
    thumbnail: '/assets/portal_player.png',
    locked: false,
  },
  {
    id: 'pling-1',
    title: 'Hearing the PLING!',
    duration: '6:15',
    category: 'PLING!',
    description: 'The absolute resonance and how to find it.',
    thumbnail: '/assets/portal_guitar.png',
    locked: false,
  },
  {
    id: 'fheal-1',
    title: 'Playing Without Rules',
    duration: '8:47',
    category: 'FHEAL',
    description: 'Improvisation as a conversation, not a test.',
    thumbnail: '/assets/portal_song.png',
    locked: false,
  },
  {
    id: 'micro-1',
    title: 'The Cents Between',
    duration: '5:22',
    category: 'SHEARL',
    description: 'Microtonal awareness and expressive intonation.',
    thumbnail: '/assets/portal_playbook.png',
    locked: true,
  },
];

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════
function formatDate(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
export default function PlayerPortal() {
  const navigate = useNavigate();
  const { locale, t } = useLocale();
  const { resonanceCycles, practiceMinutes, currentFret, completePhase, passGate, gameEnabled: _gameEnabled, somaticDepth: _somaticDepth } = useScaffolding();
  const { user } = useAuth();
  const lang = locale;

  const [showRecorder, setShowRecorder] = useState(false);
  const [showStructuredRecorder, setShowStructuredRecorder] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [activeTab, setActiveTab] = useState('loom'); // loom | submissions | library | timeline
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [workload, setWorkload] = useState(null);

  const traction = loadTraction();
  const completedFrets = Object.entries(traction?.frets || {})
    .filter(([, f]) => (f.traction || 0) >= 60)
    .map(([id]) => parseInt(id));

  const studentName = (() => {
    try { return vvGet(STORAGE_KEYS.ACTIVE_PROFILE) || t('adventurer') || 'Student'; }
    catch { return 'Student'; }
  })();

  // Load submissions: local (IndexedDB) + cloud (Supabase video_submissions & submissions)
  useEffect(() => {
    const load = async () => {
      // 1. Run outbox sync to R2 if user is logged in
      if (user?.id) {
        try {
          const { syncOutboxToR2 } = await import('../lib/r2Service.js');
          await syncOutboxToR2(user.id);
        } catch (e) {
          devWarn('[PlayerPortal] Outbox sync to R2 failed:', e);
        }
      }

      let recs = [];
      // 2. Local recordings
      try {
        recs = await db.recordings.orderBy('timestamp').reverse().toArray();
      } catch (e) { devWarn('[PlayerPortal] No recordings table:', e); }

      // 3. Legacy fallback
      if (recs.length === 0) {
        try {
          const legacy = JSON.parse(vvGet(STORAGE_KEYS.SUBMISSIONS) || '[]');
          recs = legacy.map(s => ({
            id: s.id || Date.now() + Math.random(),
            exerciseName: s.exerciseName,
            timestamp: s.timestamp,
            duration: s.duration,
            reviewed: s.status === 'reviewed',
            feedback: s.feedback || null,
          }));
        } catch (e) { devWarn('[PlayerPortal] Legacy submissions parse error:', e); }
      }

      // 4. Cloud submissions from Google Drive (cross-device)
      try {
        const { getUserSubmissions } = await import('../lib/driveService.js');
        if (user?.id) {
          const cloudSubs = await getUserSubmissions(user.id);
          const cloudRecs = cloudSubs.map(s => ({
            id: s.drive_file_id,
            exerciseName: s.file_name,
            timestamp: s.created_at,
            duration: 0, // Drive doesn't store duration
            reviewed: s.reviewed,
            feedback: s.mentor_notes,
            webViewLink: s.web_view_link,
            isCloud: true,
            fretId: s.fret_id,
            emotionalState: s.emotional_state,
          }));
          // Merge: local + cloud, dedupe by drive_file_id
          const localIds = new Set(recs.map(r => r.id));
          recs = [...recs, ...cloudRecs.filter(c => !localIds.has(c.id))];
        }
      } catch (e) { devWarn('[PlayerPortal] Cloud submissions load failed:', e); }

      // 5. Cloud submissions from Cloudflare R2 (cross-device)
      try {
        const { supabase } = await import('../lib/supabase.js');
        if (user?.id && supabase) {
          const { data: r2Subs, error } = await supabase
            .from('submissions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (!error && r2Subs) {
            const r2Recs = r2Subs.map(s => ({
              id: s.id,
              exerciseName: s.exercise_name,
              timestamp: s.created_at,
              duration: s.duration,
              reviewed: s.reviewed,
              feedback: s.feedback,
              webViewLink: s.video_url,
              isCloud: true,
              isR2: true,
            }));
            // Merge: dedupe by id
            const existingIds = new Set(recs.map(r => r.id));
            recs = [...recs, ...r2Recs.filter(r => !existingIds.has(r.id))];
          }
        }
      } catch (e) { devWarn('[PlayerPortal] Cloud R2 submissions load failed:', e); }

      // Sort unified list newest first
      recs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setSubmissions(recs);

      try {
        const entries = await db.journal.orderBy('timestamp').reverse().limit(20).toArray();
        setJournalEntries(entries);
      } catch (e) { devWarn('[PlayerPortal] No journal:', e); }

      // Check mentor workload
      try {
        const wl = await checkSubmissionAvailability();
        setWorkload(wl);
      } catch (e) { devWarn('[PlayerPortal] Workload check failed:', e); }
    };
    load();
  }, [showRecorder, showStructuredRecorder, user?.id]);


  // Build unified timeline
  const timeline = useMemo(() => {
    const items = [];

    submissions.forEach(sub => {
      items.push({
        type: 'submission',
        timestamp: sub.timestamp,
        title: sub.exerciseName || 'Practice Recording',
        duration: sub.duration,
        status: sub.reviewed ? 'reviewed' : 'pending',
        id: sub.id,
        webViewLink: sub.webViewLink || null,
        isCloud: sub.isCloud || false,
      });
    });

    journalEntries.forEach(entry => {
      items.push({
        type: 'journal',
        timestamp: entry.timestamp,
        title: `Reflection — Chapter ${entry.fretId}`,
        mood: entry.mood,
        text: entry.text?.slice(0, 80),
        id: entry.id,
      });
    });

    // Sort newest first
    items.sort((a, b) => b.timestamp - a.timestamp);
    return items.slice(0, 30);
  }, [submissions, journalEntries]);

  const handleRecordingSaved = useCallback(() => {
    setShowRecorder(false);
    // Reload submissions
    const load = async () => {
      try {
        const recs = await db.recordings.orderBy('timestamp').reverse().toArray();
        setSubmissions(recs);
      } catch (e) { devWarn('[PlayerPortal] Reload recordings error:', e); }
    };
    load();
  }, []);

  const handleStructuredSaved = useCallback(() => {
    setShowStructuredRecorder(false);
    const load = async () => {
      try {
        const recs = await db.recordings.orderBy('timestamp').reverse().toArray();
        setSubmissions(recs);
      } catch (e) { devWarn('[PlayerPortal] Reload error:', e); }
    };
    load();
  }, []);

  const playRecording = async (sub) => {
    try {
      const outboxItems = await db.outbox.toArray();
      const match = outboxItems.find(item => item.timestamp === sub.timestamp || item.size === sub.size);
      if (match && match.blob) {
        const url = URL.createObjectURL(match.blob);
        setSelectedVideo({
          title: sub.exerciseName || 'Practice Recording',
          description: `Recorded on ${formatDate(sub.timestamp)}`,
          blobUrl: url,
          mediaType: sub.mediaType || 'video',
        });
      } else {
        alert('Local recording video/audio blob not found in IndexedDB outbox.');
      }
    } catch (e) {
      devWarn('[PlayerPortal] Failed to play recording:', e);
    }
  };

  const closeVideoModal = () => {
    if (selectedVideo && selectedVideo.blobUrl) {
      URL.revokeObjectURL(selectedVideo.blobUrl);
    }
    setSelectedVideo(null);
  };

  return (
    <div className="min-h-[100svh] bg-[#050508] text-[#e8dcc8] font-sans pb-[60px]">
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-white/[0.06]">
        <div className="text-center flex-1">
          <p className="m-0 font-mono text-[0.55rem] tracking-[0.2em] uppercase text-[rgba(var(--cf-gold-rgb),0.5)]">The Player</p>
          <p className="m-0 font-[EB_Garamond] italic text-[0.95rem] text-white/40 mt-1">Your mirror. Your mentor. Your journey.</p>
        </div>
        <button onClick={() => navigate('/')} className="bg-white/[0.05] border border-white/[0.08] rounded-lg px-2.5 py-1.5 cursor-pointer flex items-center" aria-label="Home">
          <img src="/assets/wordmark.png" alt="Voix Vive" className="h-7" draggable={false} />
        </button>
      </div>

      {/* ── PROFILE BAR ── */}
      <div className="flex items-center justify-center gap-0 px-4 py-3.5 border-b border-white/[0.04] flex-wrap">
        <div className="flex items-center gap-2.5 px-4">
          <span className="text-[1.5rem] w-9 h-9 flex items-center justify-center">🎸</span>
          <div>
            <span className="block text-[0.85rem] font-semibold text-[#f0e6d2] font-[Cormorant_Garamond]">{studentName}</span>
            <span className="text-[0.5rem] text-white/30 font-mono tracking-[0.06em] uppercase">{completedFrets.length} of 12 frets explored</span>
          </div>
        </div>
        <div className="w-px h-[22px] bg-white/[0.08]" />
        <div className="flex flex-col items-center px-3.5 min-w-[60px] gap-0.5">
          <Calendar size={14} className="text-cf-gold/50" />
          <span className="block text-[0.85rem] font-semibold text-[#f0e6d2] font-[Cormorant_Garamond]">{resonanceCycles || 0}</span>
          <span className="text-[0.5rem] text-white/30 font-mono tracking-[0.06em] uppercase">resonance cycles</span>
        </div>
        <div className="w-px h-[22px] bg-white/[0.08]" />
        <div className="flex flex-col items-center px-3.5 min-w-[60px] gap-0.5">
          <Clock size={14} className="text-cf-gold/50" />
          <span className="block text-[0.85rem] font-semibold text-[#f0e6d2] font-[Cormorant_Garamond]">{practiceMinutes || 0}</span>
          <span className="text-[0.5rem] text-white/30 font-mono tracking-[0.06em] uppercase">minutes</span>
        </div>
        <div className="w-px h-[22px] bg-white/[0.08]" />
        <div className="flex flex-col items-center px-3.5 min-w-[60px] gap-0.5">
          <Film size={14} className="text-cf-gold/50" />
          <span className="block text-[0.85rem] font-semibold text-[#f0e6d2] font-[Cormorant_Garamond]">{submissions.length}</span>
          <span className="text-[0.5rem] text-white/30 font-mono tracking-[0.06em] uppercase">recordings</span>
        </div>
      </div>

      {/* ── MENTOR WORKLOAD BANNER ── */}
      {workload && (
        <div
          className="flex items-center gap-2.5 px-4 py-2.5 mx-4 mb-3 rounded-xl"
          style={{
            background: workload.canSubmit ? 'rgba(122,170,136,0.06)' : 'rgba(232,85,85,0.06)',
            border: `1px solid ${workload.canSubmit ? 'rgba(122,170,136,0.15)' : 'rgba(232,85,85,0.15)'}`,
          }}
        >
          <AlertCircle size={16} style={{ color: workload.canSubmit ? '#7aaa88' : '#cc5555', flexShrink: 0 }} />
          <div className="flex-1">
            <p className="m-0 text-[0.8rem] text-[#e8dcc8]">{workload.message}</p>
            {workload.alternative === 'text-back' && (
              <p className="mt-1 text-[0.7rem] text-white/40">
                Or send a quick question for a $5 text response.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── RECORD FOR BERTRAND (Hero) ── */}
      <div className="pt-5 px-4 max-w-[640px] mx-auto">
        <div className="rounded-2xl border border-[rgba(var(--cf-gold-rgb),0.2)] bg-gradient-to-br from-[rgba(var(--cf-gold-rgb),0.08)] to-[rgba(5,5,8,0.5)] px-6 py-5.5 text-left">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-[rgba(var(--cf-gold-rgb),0.1)] border border-[rgba(var(--cf-gold-rgb),0.2)] flex items-center justify-center shrink-0">
              <Video size={24} className="text-cf-gold" />
            </div>
            <div>
              <h2 className="m-0 font-[Cormorant_Garamond] text-[1.3rem] text-[#f0e6d2] font-semibold">Record for Bertrand</h2>
              <p className="m-0 text-[0.6rem] text-[rgba(var(--cf-gold-rgb),0.5)] font-mono tracking-[0.08em] uppercase">Async video coaching — submit a practice session</p>
            </div>
          </div>
          <p className="m-0 mb-4 text-[0.85rem] text-white/50 leading-normal">
            {t('recordYourPracticeBertrand')}
          </p>
          <button onClick={() => setShowRecorder(true)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[rgba(var(--cf-gold-rgb),0.15)] border border-[rgba(var(--cf-gold-rgb),0.3)] text-[var(--cf-gold)] text-[0.85rem] font-semibold cursor-pointer font-sans">
            <Mic size={16} /> Start Recording
          </button>
        </div>

        {/* ── STRUCTURED GUIDED SESSION ── */}
        <div className="rounded-2xl border border-[rgba(122,170,136,0.2)] bg-[rgba(122,170,136,0.04)] px-6 py-5.5 text-left">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-[rgba(122,170,136,0.1)] border border-[rgba(122,170,136,0.25)] flex items-center justify-center shrink-0">
              <Wind size={24} className="text-cf-sage" />
            </div>
            <div>
              <h2 className="m-0 font-[Cormorant_Garamond] text-[1.3rem] text-[#7aaa88] font-semibold">Guided 15-Minute Session</h2>
              <p className="m-0 text-[0.6rem] text-[rgba(var(--cf-gold-rgb),0.5)] font-mono tracking-[0.08em] uppercase">Breathing → Warm-up → Practice → Reflection</p>
            </div>
          </div>
          <p className="m-0 mb-4 text-[0.85rem] text-white/50 leading-normal">
            {t('aStructuredSessionBreathing')}
          </p>
          <button
            onClick={() => setShowStructuredRecorder(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[rgba(122,170,136,0.15)] border border-[rgba(122,170,136,0.3)] text-[#7aaa88] text-[0.85rem] font-semibold cursor-pointer font-sans"
          >
            <Wind size={16} /> Start Guided Session
          </button>
        </div>

        {/* Quick context if they have pending reviews */}
        {submissions.some(s => !s.reviewed) && (
          <div className="flex items-center gap-2 mt-2.5 px-3.5 py-2.5 rounded-xl bg-[rgba(122,170,136,0.06)] border border-[rgba(122,170,136,0.15)]">
            <AlertCircle size={16} className="text-cf-sage" />
            <span className="text-[0.8rem] text-white/60">
              {submissions.filter(s => !s.reviewed).length} recording{submissions.filter(s => !s.reviewed).length > 1 ? 's' : ''} awaiting review
            </span>
          </div>
        )}
      </div>

      {/* ── TABS ── */}
      <div className="flex justify-center gap-0 px-4 max-w-[640px] mt-5 mx-auto border-b border-white/[0.06]">
        <button
          onClick={() => setActiveTab('loom')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-3 px-2 bg-transparent border-0 border-b-2 text-[0.75rem] font-sans cursor-pointer transition-all duration-200 ${activeTab === 'loom' ? 'text-cf-gold' : 'text-white/30'}`}
          style={{ borderBottomColor: activeTab === 'loom' ? 'var(--cf-gold)' : 'transparent' }}
        >
          <Heart size={14} /> Your Loom
        </button>
        <button
          onClick={() => setActiveTab('submissions')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-3 px-2 bg-transparent border-0 border-b-2 text-[0.75rem] font-sans cursor-pointer transition-all duration-200 ${activeTab === 'submissions' ? 'text-cf-gold' : 'text-white/30'}`}
          style={{ borderBottomColor: activeTab === 'submissions' ? 'var(--cf-gold)' : 'transparent' }}
        >
          <Send size={14} /> Submissions
        </button>
        <button
          onClick={() => setActiveTab('library')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-3 px-2 bg-transparent border-0 border-b-2 text-[0.75rem] font-sans cursor-pointer transition-all duration-200 ${activeTab === 'library' ? 'text-cf-gold' : 'text-white/30'}`}
          style={{ borderBottomColor: activeTab === 'library' ? 'var(--cf-gold)' : 'transparent' }}
        >
          <Film size={14} /> Bertrand's Library
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-3 px-2 bg-transparent border-0 border-b-2 text-[0.75rem] font-sans cursor-pointer transition-all duration-200 ${activeTab === 'timeline' ? 'text-cf-gold' : 'text-white/30'}`}
          style={{ borderBottomColor: activeTab === 'timeline' ? 'var(--cf-gold)' : 'transparent' }}
        >
          <Calendar size={14} /> Your Timeline
        </button>
      </div>

      {/* ── TAB CONTENT ── */}
      <div className="pt-4 px-4 max-w-[640px] mx-auto pb-0">
        {/* LOOM */}
        {activeTab === 'loom' && <TruebadourLoom />}

        {/* SUBMISSIONS */}
        {activeTab === 'submissions' && (
          <div>
            {submissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-5 text-center">
                <Video size={40} className="text-white/10 mb-3" />
                <p className="text-white/40 text-[0.9rem] mb-1">
                  No recordings yet.
                </p>
                <p className="text-white/25 text-[0.75rem]">
                  Your first submission begins the conversation.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {submissions.map(sub => (
                  <div
                    key={sub.id}
                    className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] cursor-pointer hover:border-[rgba(var(--cf-gold-rgb),0.3)]"
                    onClick={() => playRecording(sub)}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-11 h-11 rounded-[10px] bg-white/[0.05] border border-white/[0.08] flex items-center justify-center shrink-0">
                        <Play size={16} className="text-white/40" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[0.85rem] text-[#f0e6d2] font-medium">
                            {sub.exerciseName || 'Practice Recording'}
                          </span>
                          {sub.reviewed ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border font-mono text-[0.6rem] tracking-[0.04em] uppercase bg-cf-sage/15 text-cf-sage border-cf-sage/30">
                              <CheckCircle size={10} /> Reviewed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border font-mono text-[0.6rem] tracking-[0.04em] uppercase bg-cf-gold/10 text-cf-gold border-cf-gold/20">
                              <Clock size={10} /> Pending
                            </span>
                          )}
                        </div>
                        <div className="flex gap-3 text-[0.65rem] text-white/30 font-mono items-center">
                          <span>{formatDate(sub.timestamp)}</span>
                          <span>{formatDuration(sub.duration || 0)}</span>
                          {sub.webViewLink && (
                            <a
                              href={sub.webViewLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="text-[#60a5fa] no-underline"
                            >
                              Open in Drive ↗
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    {sub.feedback && (
                      <div className="flex items-start gap-2 mt-2.5 px-3 py-2.5 rounded-lg bg-[rgba(122,170,136,0.05)] border border-[rgba(122,170,136,0.1)]">
                        <MessageSquare size={12} className="text-cf-sage shrink-0" />
                        <p className="m-0 text-[0.78rem] text-white/50 leading-[1.45]">
                          {sub.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* LIBRARY */}
        {activeTab === 'library' && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
            {VIDEO_LIBRARY.map(video => (
              <button
                key={video.id}
                onClick={() => !video.locked && setSelectedVideo(video)}
                className={`rounded-xl bg-white/[0.03] border border-white/[0.06] text-left overflow-hidden transition-all duration-200 ${video.locked ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer'}`}
                disabled={video.locked}
              >
                <div className="h-[120px] bg-gradient-to-br from-[rgba(var(--cf-gold-rgb),0.08)] to-[rgba(5,5,8,0.5)] flex items-center justify-center border-b border-white/[0.05]">
                  {video.locked ? (
                    <Circle size={24} className="text-white/15" />
                  ) : (
                    <Play size={24} className="text-white/60" />
                  )}
                </div>
                <div className="px-3 py-2.5 text-left">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[0.55rem] font-mono tracking-[0.08em] uppercase text-cf-gold/50">
                      {video.category}
                    </span>
                    <span className="text-[0.6rem] text-white/25 font-mono">
                      {video.duration}
                    </span>
                  </div>
                  <h3 className="m-0 mb-1 text-[0.85rem] text-[#e8dcc8] font-semibold">{video.title}</h3>
                  <p className="m-0 text-[0.7rem] text-white/40 leading-[1.4]">{video.description}</p>
                  {video.locked && (
                    <span className="block mt-1.5 text-[0.6rem] text-white/20 font-mono">
                      Complete earlier frets to unlock
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="flex flex-col gap-0 pl-2 border-l border-white/[0.06] ml-2">
            {timeline.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-5 text-center">
                <Calendar size={40} className="text-white/10 mb-3" />
                <p className="text-white/40 text-[0.9rem]">
                  Your timeline is waiting for its first entry.
                </p>
              </div>
            ) : (
              timeline.map((item, i) => (
                <div key={`${item.type}-${item.id}-${i}`} className="flex items-start gap-3 py-3 relative">
                  <div className="w-5 h-5 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center -ml-[18px] shrink-0">
                    {item.type === 'submission' ? <Video size={10} className="text-cf-gold" /> : <Feather size={10} className="text-cf-sage" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className="text-[0.8rem] text-[#e8dcc8]">{item.title}</span>
                      <span className="text-[0.6rem] text-white/25 font-mono">
                        {formatDate(item.timestamp)}
                      </span>
                    </div>
                    {item.type === 'submission' && (
                      <div className="flex gap-2 items-center flex-wrap">
                        <span className="text-[0.65rem] text-white/30 font-mono">
                          {formatDuration(item.duration || 0)}
                        </span>
                        {item.status === 'reviewed' ? (
                          <span className="text-[0.6rem] text-cf-sage">✓ Reviewed</span>
                        ) : (
                          <span className="text-[0.6rem] text-cf-gold">⏳ Pending</span>
                        )}
                        {item.webViewLink && (
                          <a
                            href={item.webViewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="text-[0.6rem] text-[#60a5fa] no-underline font-mono"
                          >
                            Open in Drive ↗
                          </a>
                        )}
                      </div>
                    )}
                    {item.type === 'journal' && item.text && (
                      <p className="mt-1 text-[0.75rem] text-white/40 italic">
                        "{item.text}..."
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ── PRACTICE RECORDER MODAL ── */}
      {showRecorder && (
        <PracticeRecorder
          onClose={handleRecordingSaved}
          exerciseName="Async Submission for Bertrand"
          currentFret={currentFret}
          completePhase={completePhase}
          passGate={passGate}
        />
      )}

      {/* ── STRUCTURED PRACTICE RECORDER MODAL ── */}
      {showStructuredRecorder && (
        <StructuredPracticeRecorder
          onClose={handleStructuredSaved}
          fretId={currentFret}
          completePhase={completePhase}
          passGate={passGate}
        />
      )}

      {/* ── VIDEO PLAYER MODAL ── */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[200] bg-[rgba(5,5,8,0.97)] flex items-center justify-center p-5" onClick={closeVideoModal}>
          <div className="w-full max-w-[720px] bg-[#0a0a10] rounded-2xl border border-white/[0.08] p-5" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="m-0 font-[Cormorant_Garamond] text-[1.1rem] text-[#f0e6d2]">{selectedVideo.title}</h3>
              <button onClick={closeVideoModal} className="bg-white/[0.05] border border-white/[0.1] rounded-lg px-3 py-1.5 text-cf-gold text-[0.8rem] cursor-pointer flex items-center gap-1">
                <ArrowLeft size={18} /> Back
              </button>
            </div>
            <div className="aspect-video bg-black rounded-xl flex items-center justify-center border border-white/[0.06]">
              {selectedVideo.blobUrl ? (
                selectedVideo.mediaType === 'audio' ? (
                  <audio src={selectedVideo.blobUrl} controls autoPlay className="w-4/5" />
                ) : (
                  <video src={selectedVideo.blobUrl} controls autoPlay className="w-full h-full object-contain rounded-[10px]" />
                )
              ) : (
                <p className="text-white/30 text-[0.85rem] text-center">
                  🎬 {selectedVideo.title}<br />
                  <span className="text-[0.7rem]">(Video placeholder — integrate with CDN or DaaS)</span>
                </p>
              )}
            </div>
            <p className="mt-3 text-[0.8rem] text-white/50 leading-[1.5]">
              {selectedVideo.description}
            </p>
          </div>
        </div>
      )}

      {/* ── MENTOR SERVICES ── */}
      <div className="px-4 pt-5 pb-10 max-w-[640px] mx-auto">
        <div className="flex items-center gap-2 mb-3">
          <Heart size={16} className="text-cf-gold" />
          <h2 className="m-0 font-[Cormorant_Garamond] text-[1.1rem] text-[#f0e6d2]">
            {t('mentorServices') || 'Mentor Services'}
          </h2>
        </div>
        <p className="text-[0.85rem] text-white/40 leading-[1.6] mb-4">
          {locale === 'fr'
            ? "Bertrand offre des leçons privées, des critiques vidéo et un accompagnement. Visitez le studio pour les tarifs complets."
            : "Bertrand offers private lessons, video critiques, and mentorship. Visit the studio for full pricing."}
        </p>
        <button
          onClick={() => navigate('/studio')}
          className="w-full px-6 py-3.5 rounded-[10px] bg-cf-gold/10 border border-cf-gold/25 text-cf-gold cursor-pointer font-mono text-[0.85rem] tracking-[0.1em] uppercase"
        >
          {t('viewAllServices') || 'View All Services →'}
        </button>
      </div>
    </div>
  );
}

