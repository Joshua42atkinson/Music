// ═══════════════════════════════════════════════════════════
// MENTOR DASHBOARD — Bertrand's submission review center
// Shows all student video submissions with Google Drive links.
// Reads from Supabase metadata (tiny, fast).
// ═══════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getMentorSubmissions, markReviewed } from '../lib/driveService';
import { getMentorWorkload } from '../lib/schedulingService';
import {
  ArrowLeft, Video, Clock, CheckCircle, MessageSquare,
  ExternalLink, Filter, User, Calendar, AlertCircle,
} from 'lucide-react';

export default function MentorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [workload, setWorkload] = useState(null);
  const [filter, setFilter] = useState('all'); // all | pending | reviewed
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewNotes, setReviewNotes] = useState({}); // submissionId -> notes

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [subs, wl] = await Promise.all([
        getMentorSubmissions(),
        getMentorWorkload(),
      ]);
      setSubmissions(subs);
      setWorkload(wl);
    } catch (err) {
      console.error('[MentorDashboard] Load failed:', err);
      setError(err.message || 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkReviewed = async (subId) => {
    const notes = reviewNotes[subId] || '';
    try {
      await markReviewed(subId, notes);
      setSubmissions(prev => prev.map(s =>
        s.id === subId ? { ...s, reviewed: true, mentor_notes: notes, reviewed_at: new Date().toISOString() } : s
      ));
    } catch (err) {
      console.error('[MentorDashboard] Review failed:', err);
    }
  };

  const filtered = submissions.filter(s => {
    if (filter === 'pending') return !s.reviewed;
    if (filter === 'reviewed') return s.reviewed;
    return true;
  });

  const fmtDate = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // ── RENDER ──
  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate('/')} style={styles.backBtn}>
          <ArrowLeft size={18} /> Home
        </button>
        <div style={{ textAlign: 'center' }}>
          <h1 style={styles.title}>Mentor Dashboard</h1>
          <p style={styles.subtitle}>Review student submissions</p>
        </div>
        <div style={{ width: 80 }} /> {/* spacer */}
      </div>

      {/* Workload bar */}
      {workload && (
        <div style={styles.workloadBar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={16} style={{ color: workload.full ? '#cc5555' : '#7aaa88' }} />
            <span style={{ fontSize: '0.8rem', color: '#e8dcc8' }}>
              {workload.full
                ? `Queue FULL — ${workload.count} pending reviews`
                : `${workload.count} pending / ${workload.max} max capacity`}
            </span>
          </div>
          <div style={styles.workloadTrack}>
            <div style={{ ...styles.workloadFill, width: `${Math.min((workload.count / workload.max) * 100, 100)}%`, background: workload.full ? '#cc5555' : '#c9a96e' }} />
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={styles.filters}>
        {['all', 'pending', 'reviewed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{ ...styles.filterBtn, ...(filter === f ? styles.filterBtnActive : {}) }}
          >
            {f === 'all' && <Filter size={14} />}
            {f === 'pending' && <Clock size={14} />}
            {f === 'reviewed' && <CheckCircle size={14} />}
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span style={styles.filterCount}>
              {f === 'all' ? submissions.length : submissions.filter(s => f === 'pending' ? !s.reviewed : s.reviewed).length}
            </span>
          </button>
        ))}
        <button onClick={loadData} style={{ ...styles.filterBtn, marginLeft: 'auto' }}>
          ↻ Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={styles.errorBox}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={styles.centerMessage}>
          <div style={styles.spinner} />
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>Loading submissions...</p>
        </div>
      )}

      {/* Submission list */}
      {!loading && filtered.length === 0 && (
        <div style={styles.centerMessage}>
          <Video size={40} style={{ color: 'rgba(255,255,255,0.1)', marginBottom: 12 }} />
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>
            {filter === 'pending' ? 'No pending reviews. All caught up!' : 'No submissions yet.'}
          </p>
        </div>
      )}

      {!loading && filtered.map(sub => (
        <div key={sub.id} style={{ ...styles.card, borderColor: sub.reviewed ? 'rgba(122,170,136,0.2)' : 'rgba(201,169,110,0.15)' }}>
          <div style={styles.cardHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
              <div style={{ ...styles.statusDot, background: sub.reviewed ? '#7aaa88' : '#c9a96e' }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <User size={14} style={{ color: 'rgba(255,255,255,0.3)' }} />
                  <span style={{ fontSize: '0.85rem', color: '#f0e6d2', fontWeight: 500 }}>
                    {sub.profiles?.display_name || 'Student'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 4, fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace" }}>
                  <span><Calendar size={10} /> {fmtDate(sub.created_at)}</span>
                  {sub.fret_id && <span>Fret {sub.fret_id}</span>}
                  <span style={{ textTransform: 'capitalize' }}>{sub.entry_type?.replace('-', ' ')}</span>
                </div>
              </div>
            </div>
            <span style={{ ...styles.badge, background: sub.reviewed ? 'rgba(122,170,136,0.12)' : 'rgba(201,169,110,0.1)', color: sub.reviewed ? '#7aaa88' : '#c9a96e' }}>
              {sub.reviewed ? <><CheckCircle size={10} /> Reviewed</> : <><Clock size={10} /> Pending</>}
            </span>
          </div>

          {/* Emotional state */}
          {sub.emotional_state && (
            <div style={styles.emotionalState}>
              <MessageSquare size={12} style={{ color: '#cc5555', flexShrink: 0 }} />
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>
                "{sub.emotional_state}"
              </span>
            </div>
          )}

          {/* Actions */}
          <div style={styles.actions}>
            <a
              href={sub.web_view_link}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.linkBtn}
            >
              <ExternalLink size={14} /> Open in Drive
            </a>

            {!sub.reviewed && (
              <>
                <input
                  type="text"
                  placeholder="Review notes..."
                  value={reviewNotes[sub.id] || ''}
                  onChange={(e) => setReviewNotes(prev => ({ ...prev, [sub.id]: e.target.value }))}
                  style={styles.noteInput}
                />
                <button
                  onClick={() => handleMarkReviewed(sub.id)}
                  style={styles.reviewBtn}
                >
                  <CheckCircle size={14} /> Mark Reviewed
                </button>
              </>
            )}

            {sub.reviewed && sub.mentor_notes && (
              <div style={styles.reviewedNote}>
                <MessageSquare size={12} style={{ color: '#7aaa88' }} />
                {sub.mentor_notes}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Styles ──
const styles = {
  page: { minHeight: '100svh', background: '#050508', color: '#e8dcc8', fontFamily: "'Inter', sans-serif", padding: '0 16px 40px', maxWidth: 720, margin: '0 auto' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  backBtn: { display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: '#c9a96e', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace" },
  title: { margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', color: '#f0e6d2' },
  subtitle: { margin: '4px 0 0', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' },

  workloadBar: { margin: '16px 0', padding: '12px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' },
  workloadTrack: { width: '100%', height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginTop: 8, overflow: 'hidden' },
  workloadFill: { height: '100%', borderRadius: 2, transition: 'width 0.5s ease' },

  filters: { display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  filterBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace", cursor: 'pointer', transition: 'all 0.2s' },
  filterBtnActive: { background: 'rgba(201,169,110,0.1)', borderColor: 'rgba(201,169,110,0.3)', color: '#c9a96e' },
  filterCount: { fontSize: '0.65rem', padding: '2px 6px', borderRadius: 10, background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' },

  errorBox: { display: 'flex', alignItems: 'center', gap: 8, padding: 12, borderRadius: 10, background: 'rgba(232,85,85,0.08)', border: '1px solid rgba(232,85,85,0.2)', color: '#e88888', fontSize: '0.8rem', marginBottom: 16 },

  centerMessage: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center' },
  spinner: { width: 28, height: 28, borderRadius: '50%', border: '2px solid rgba(201,169,110,0.2)', borderTopColor: '#c9a96e', animation: 'spin 1s linear infinite' },

  card: { padding: 16, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: 12 },
  cardHeader: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 },
  statusDot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0, marginTop: 6 },
  badge: { display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 6, fontSize: '0.65rem', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0 },

  emotionalState: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 8, background: 'rgba(204,85,85,0.04)', border: '1px solid rgba(204,85,85,0.1)', marginBottom: 12 },

  actions: { display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
  linkBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: 'rgba(90,144,160,0.1)', border: '1px solid rgba(90,144,160,0.2)', color: '#5a90a0', fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace", textDecoration: 'none', cursor: 'pointer' },
  noteInput: { flex: 1, minWidth: 200, padding: '8px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e8dcc8', fontSize: '0.8rem', outline: 'none', fontFamily: "'Inter', sans-serif" },
  reviewBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: '#7aaa88', color: '#0d0d14', border: 'none', fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace", cursor: 'pointer', fontWeight: 600 },
  reviewedNote: { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, background: 'rgba(122,170,136,0.06)', color: 'rgba(122,170,136,0.8)', fontSize: '0.8rem', fontStyle: 'italic' },
};
