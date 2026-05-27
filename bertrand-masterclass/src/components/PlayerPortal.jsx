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
import { db } from '../data/localDatabase';
import { loadTraction } from '../data/tractionStore';
import PracticeRecorder from './PracticeRecorder';
import {
  Video, Play, Clock, CheckCircle, Circle, Send, BookOpen,
  Mic, Music, Heart, Calendar, ArrowLeft, Film, MessageSquare,
  Feather, AlertCircle,
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
  const { streak, practiceMinutes } = useScaffolding();
  const lang = locale;

  const [showRecorder, setShowRecorder] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [activeTab, setActiveTab] = useState('submissions'); // submissions | library | timeline
  const [selectedVideo, setSelectedVideo] = useState(null);

  const traction = loadTraction();
  const completedFrets = Object.entries(traction.frets || {})
    .filter(([, f]) => (f.traction || 0) >= 60)
    .map(([id]) => parseInt(id));

  const studentName = (() => {
    try { return localStorage.getItem('active_student_profile') || t('adventurer') || 'Student'; }
    catch { return 'Student'; }
  })();

  // Load submissions from IndexedDB + localStorage fallback
  useEffect(() => {
    const load = async () => {
      let recs = [];
      try {
        recs = await db.recordings.orderBy('timestamp').reverse().toArray();
      } catch (e) { console.warn('[PlayerPortal] No recordings table:', e); }

      // Fallback: read from localStorage legacy submissions
      if (recs.length === 0) {
        try {
          const legacy = JSON.parse(localStorage.getItem('voixvive_submissions') || '[]');
          recs = legacy.map(s => ({
            id: s.id || Date.now() + Math.random(),
            exerciseName: s.exerciseName,
            timestamp: s.timestamp,
            duration: s.duration,
            reviewed: s.status === 'reviewed',
            feedback: s.feedback || null,
          }));
        } catch (e) { console.warn('[PlayerPortal] Legacy submissions parse error:', e); }
      }
      setSubmissions(recs);

      try {
        const entries = await db.journal.orderBy('timestamp').reverse().limit(20).toArray();
        setJournalEntries(entries);
      } catch (e) { console.warn('[PlayerPortal] No journal:', e); }
    };
    load();
  }, [showRecorder]);

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
      });
    });

    journalEntries.forEach(entry => {
      items.push({
        type: 'journal',
        timestamp: entry.timestamp,
        title: `Reflection — Fret ${entry.fretId}`,
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
      } catch (e) { console.warn('[PlayerPortal] Reload recordings error:', e); }
    };
    load();
  }, []);

  return (
    <div style={styles.page}>
      {/* ── HEADER ── */}
      <div style={styles.header}>
        <div style={styles.headerCenter}>
          <p style={styles.headerLabel}>The Player</p>
          <p style={styles.headerSub}>Your mirror. Your mentor. Your journey.</p>
        </div>
        <button onClick={() => navigate('/')} style={styles.backBtn} aria-label="Home">
          <img src="/assets/wordmark.png" alt="Voix Vive" style={{ height: 28 }} draggable={false} />
        </button>
      </div>

      {/* ── PROFILE BAR ── */}
      <div style={styles.profileBar}>
        <div style={styles.profileName}>
          <span style={styles.profileEmoji}>🎸</span>
          <div>
            <span style={styles.profileValue}>{studentName}</span>
            <span style={styles.profileLabel}>{completedFrets.length} of 12 frets explored</span>
          </div>
        </div>
        <div style={styles.profileDivider} />
        <div style={styles.profileStat}>
          <Calendar size={14} style={{ color: 'rgba(201,169,110,0.5)' }} />
          <span style={styles.profileValue}>{streak || 0}</span>
          <span style={styles.profileLabel}>day streak</span>
        </div>
        <div style={styles.profileDivider} />
        <div style={styles.profileStat}>
          <Clock size={14} style={{ color: 'rgba(201,169,110,0.5)' }} />
          <span style={styles.profileValue}>{practiceMinutes || 0}</span>
          <span style={styles.profileLabel}>minutes</span>
        </div>
        <div style={styles.profileDivider} />
        <div style={styles.profileStat}>
          <Film size={14} style={{ color: 'rgba(201,169,110,0.5)' }} />
          <span style={styles.profileValue}>{submissions.length}</span>
          <span style={styles.profileLabel}>recordings</span>
        </div>
      </div>

      {/* ── RECORD FOR BERTRAND (Hero) ── */}
      <div style={styles.heroSection}>
        <div style={styles.heroCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={styles.heroIcon}>
              <Video size={24} style={{ color: '#c9a96e' }} />
            </div>
            <div>
              <h2 style={styles.heroTitle}>Record for Bertrand</h2>
              <p style={styles.heroSubtitle}>Async video coaching — submit a practice session</p>
            </div>
          </div>
          <p style={styles.heroDesc}>
            {lang === 'fr'
              ? "Enregistrez votre pratique. Bertrand l'écoute et vous envoie un retour personnalisé."
              : "Record your practice. Bertrand listens and sends you personalized feedback."}
          </p>
          <button onClick={() => setShowRecorder(true)} style={styles.heroBtn}>
            <Mic size={16} /> Start Recording
          </button>
        </div>

        {/* Quick context if they have pending reviews */}
        {submissions.some(s => !s.reviewed) && (
          <div style={styles.pendingCard}>
            <AlertCircle size={16} style={{ color: '#7aaa88' }} />
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
              {submissions.filter(s => !s.reviewed).length} recording{submissions.filter(s => !s.reviewed).length > 1 ? 's' : ''} awaiting review
            </span>
          </div>
        )}
      </div>

      {/* ── TABS ── */}
      <div style={styles.tabBar}>
        <button
          onClick={() => setActiveTab('submissions')}
          style={{ ...styles.tabBtn, borderBottomColor: activeTab === 'submissions' ? '#c9a96e' : 'transparent', color: activeTab === 'submissions' ? '#c9a96e' : 'rgba(255,255,255,0.3)' }}
        >
          <Send size={14} /> Your Submissions
        </button>
        <button
          onClick={() => setActiveTab('library')}
          style={{ ...styles.tabBtn, borderBottomColor: activeTab === 'library' ? '#c9a96e' : 'transparent', color: activeTab === 'library' ? '#c9a96e' : 'rgba(255,255,255,0.3)' }}
        >
          <Film size={14} /> Bertrand's Library
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          style={{ ...styles.tabBtn, borderBottomColor: activeTab === 'timeline' ? '#c9a96e' : 'transparent', color: activeTab === 'timeline' ? '#c9a96e' : 'rgba(255,255,255,0.3)' }}
        >
          <Calendar size={14} /> Your Timeline
        </button>
      </div>

      {/* ── TAB CONTENT ── */}
      <div style={styles.tabContent}>
        {/* SUBMISSIONS */}
        {activeTab === 'submissions' && (
          <div>
            {submissions.length === 0 ? (
              <div style={styles.emptyState}>
                <Video size={40} style={{ color: 'rgba(255,255,255,0.1)', marginBottom: 12 }} />
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', marginBottom: 4 }}>
                  No recordings yet.
                </p>
                <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem' }}>
                  Your first submission begins the conversation.
                </p>
              </div>
            ) : (
              <div style={styles.submissionList}>
                {submissions.map(sub => (
                  <div key={sub.id} style={styles.submissionCard}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={styles.submissionThumb}>
                        <Play size={16} style={{ color: 'rgba(255,255,255,0.4)' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: '0.85rem', color: '#f0e6d2', fontWeight: 500 }}>
                            {sub.exerciseName || 'Practice Recording'}
                          </span>
                          {sub.reviewed ? (
                            <span style={{ ...styles.statusBadge, background: 'rgba(122,170,136,0.15)', color: '#7aaa88', borderColor: 'rgba(122,170,136,0.3)' }}>
                              <CheckCircle size={10} /> Reviewed
                            </span>
                          ) : (
                            <span style={{ ...styles.statusBadge, background: 'rgba(201,169,110,0.1)', color: '#c9a96e', borderColor: 'rgba(201,169,110,0.2)' }}>
                              <Clock size={10} /> Pending
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: 12, fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace" }}>
                          <span>{formatDate(sub.timestamp)}</span>
                          <span>{formatDuration(sub.duration || 0)}</span>
                        </div>
                      </div>
                    </div>
                    {sub.feedback && (
                      <div style={styles.feedbackBox}>
                        <MessageSquare size={12} style={{ color: '#7aaa88', flexShrink: 0 }} />
                        <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.45 }}>
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
          <div style={styles.libraryGrid}>
            {VIDEO_LIBRARY.map(video => (
              <button
                key={video.id}
                onClick={() => !video.locked && setSelectedVideo(video)}
                style={{
                  ...styles.libraryCard,
                  opacity: video.locked ? 0.5 : 1,
                  cursor: video.locked ? 'not-allowed' : 'pointer',
                }}
                disabled={video.locked}
              >
                <div style={styles.libraryThumb}>
                  {video.locked ? (
                    <Circle size={24} style={{ color: 'rgba(255,255,255,0.15)' }} />
                  ) : (
                    <Play size={24} style={{ color: 'rgba(255,255,255,0.6)' }} />
                  )}
                </div>
                <div style={{ padding: '10px 12px', textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.55rem', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.5)' }}>
                      {video.category}
                    </span>
                    <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)', fontFamily: "'JetBrains Mono', monospace" }}>
                      {video.duration}
                    </span>
                  </div>
                  <h3 style={{ margin: '0 0 4px', fontSize: '0.85rem', color: '#e8dcc8', fontWeight: 600 }}>{video.title}</h3>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>{video.description}</p>
                  {video.locked && (
                    <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', fontFamily: "'JetBrains Mono', monospace", marginTop: 6, display: 'block' }}>
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
          <div style={styles.timeline}>
            {timeline.length === 0 ? (
              <div style={styles.emptyState}>
                <Calendar size={40} style={{ color: 'rgba(255,255,255,0.1)', marginBottom: 12 }} />
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
                  Your timeline is waiting for its first entry.
                </p>
              </div>
            ) : (
              timeline.map((item, i) => (
                <div key={`${item.type}-${item.id}-${i}`} style={styles.timelineItem}>
                  <div style={styles.timelineDot}>
                    {item.type === 'submission' ? <Video size={10} style={{ color: '#c9a96e' }} /> : <Feather size={10} style={{ color: '#7aaa88' }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
                      <span style={{ fontSize: '0.8rem', color: '#e8dcc8' }}>{item.title}</span>
                      <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)', fontFamily: "'JetBrains Mono', monospace" }}>
                        {formatDate(item.timestamp)}
                      </span>
                    </div>
                    {item.type === 'submission' && (
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace" }}>
                          {formatDuration(item.duration || 0)}
                        </span>
                        {item.status === 'reviewed' ? (
                          <span style={{ fontSize: '0.6rem', color: '#7aaa88' }}>✓ Reviewed</span>
                        ) : (
                          <span style={{ fontSize: '0.6rem', color: '#c9a96e' }}>⏳ Pending</span>
                        )}
                      </div>
                    )}
                    {item.type === 'journal' && item.text && (
                      <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
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
        />
      )}

      {/* ── VIDEO PLAYER MODAL ── */}
      {selectedVideo && (
        <div style={styles.videoModal} onClick={() => setSelectedVideo(null)}>
          <div style={styles.videoModalContent} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', color: '#f0e6d2' }}>{selectedVideo.title}</h3>
              <button onClick={() => setSelectedVideo(null)} style={styles.closeBtn}>
                <ArrowLeft size={18} /> Back
              </button>
            </div>
            <div style={styles.videoPlayer}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', textAlign: 'center' }}>
                🎬 {selectedVideo.title}<br />
                <span style={{ fontSize: '0.7rem' }}>(Video placeholder — integrate with CDN or DaaS)</span>
              </p>
            </div>
            <p style={{ margin: '12px 0 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
              {selectedVideo.description}
            </p>
          </div>
        </div>
      )}

      {/* ── MENTOR SERVICES ── */}
      <div style={{ padding: '20px 16px 40px', maxWidth: 640, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Heart size={16} style={{ color: '#c9a96e' }} />
          <h2 style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', color: '#f0e6d2' }}>
            {t('mentorServices') || 'Mentor Services'}
          </h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, marginBottom: 16 }}>
          {locale === 'fr'
            ? "Bertrand offre des leçons privées, des critiques vidéo et un accompagnement. Visitez le studio pour les tarifs complets."
            : "Bertrand offers private lessons, video critiques, and mentorship. Visit the studio for full pricing."}
        </p>
        <button
          onClick={() => navigate('/studio')}
          style={{
            width: '100%', padding: '14px 24px', borderRadius: 10,
            background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.25)',
            color: '#c9a96e', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase',
          }}
        >
          {t('viewAllServices') || 'View All Services →'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100svh',
    background: '#050508',
    color: '#e8dcc8',
    fontFamily: "'Inter', sans-serif",
    paddingBottom: 60,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px 8px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  backBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 8,
    padding: '6px 10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  headerCenter: {
    textAlign: 'center',
    flex: 1,
  },
  headerLabel: {
    margin: 0,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.55rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'rgba(201,169,110,0.5)',
  },
  headerSub: {
    margin: '4px 0 0',
    fontFamily: "'EB Garamond', serif",
    fontStyle: 'italic',
    fontSize: '0.95rem',
    color: 'rgba(255,255,255,0.4)',
  },
  profileBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
    padding: '14px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    flexWrap: 'wrap',
  },
  profileName: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '0 16px',
  },
  profileEmoji: {
    fontSize: '1.5rem',
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileValue: {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#f0e6d2',
    fontFamily: "'Cormorant Garamond', serif",
  },
  profileLabel: {
    fontSize: '0.5rem',
    color: 'rgba(255,255,255,0.3)',
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  profileStat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0 14px',
    minWidth: 60,
    gap: 2,
  },
  profileDivider: {
    width: 1,
    height: 22,
    background: 'rgba(255,255,255,0.08)',
  },
  heroSection: {
    padding: '20px 16px 0',
    maxWidth: 640,
    margin: '0 auto',
  },
  heroCard: {
    borderRadius: 16,
    border: '1px solid rgba(201,169,110,0.2)',
    background: 'linear-gradient(135deg, rgba(201,169,110,0.08) 0%, rgba(5,5,8,0.5) 100%)',
    padding: '22px 24px',
    textAlign: 'left',
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    background: 'rgba(201,169,110,0.1)',
    border: '1px solid rgba(201,169,110,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  heroTitle: {
    margin: 0,
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.3rem',
    color: '#f0e6d2',
    fontWeight: 600,
  },
  heroSubtitle: {
    margin: 0,
    fontSize: '0.6rem',
    color: 'rgba(201,169,110,0.5)',
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  heroDesc: {
    margin: '0 0 16px',
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 1.5,
  },
  heroBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 20px',
    borderRadius: 10,
    background: 'rgba(201,169,110,0.15)',
    border: '1px solid rgba(201,169,110,0.3)',
    color: '#c9a96e',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
  },
  pendingCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    padding: '10px 14px',
    borderRadius: 10,
    background: 'rgba(122,170,136,0.06)',
    border: '1px solid rgba(122,170,136,0.15)',
  },
  tabBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: 0,
    padding: '0 16px',
    maxWidth: 640,
    margin: '20px auto 0',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  tabBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: '12px 8px',
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    fontSize: '0.75rem',
    fontFamily: "'Inter', sans-serif",
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  tabContent: {
    padding: '16px 16px 0',
    maxWidth: 640,
    margin: '0 auto',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    textAlign: 'center',
  },
  submissionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  submissionCard: {
    padding: 14,
    borderRadius: 12,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  submissionThumb: {
    width: 44,
    height: 44,
    borderRadius: 10,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '2px 8px',
    borderRadius: 6,
    border: '1px solid',
    fontSize: '0.6rem',
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  feedbackBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 10,
    padding: '10px 12px',
    borderRadius: 8,
    background: 'rgba(122,170,136,0.05)',
    border: '1px solid rgba(122,170,136,0.1)',
  },
  libraryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 12,
  },
  libraryCard: {
    borderRadius: 12,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    textAlign: 'left',
    overflow: 'hidden',
    transition: 'all 0.2s',
  },
  libraryThumb: {
    height: 120,
    background: 'linear-gradient(135deg, rgba(201,169,110,0.08) 0%, rgba(5,5,8,0.5) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    paddingLeft: 8,
    borderLeft: '1px solid rgba(255,255,255,0.06)',
    marginLeft: 8,
  },
  timelineItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '12px 0',
    position: 'relative',
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -18,
    flexShrink: 0,
  },
  videoModal: {
    position: 'fixed',
    inset: 0,
    zIndex: 200,
    background: 'rgba(5,5,8,0.97)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  videoModalContent: {
    width: '100%',
    maxWidth: 720,
    background: '#0a0a10',
    borderRadius: 16,
    border: '1px solid rgba(255,255,255,0.08)',
    padding: 20,
  },
  videoPlayer: {
    aspectRatio: '16/9',
    background: '#000',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  closeBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: '6px 12px',
    color: '#c9a96e',
    fontSize: '0.8rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
};
