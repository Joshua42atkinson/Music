import { devWarn } from '../lib/devLog';
// ═══════════════════════════════════════════════════════════
// MENTOR DASHBOARD — Bertrand's submission review center
// Shows all student video submissions with Google Drive links.
// Reads from Supabase metadata (tiny, fast).
// ═══════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMentorSubmissions, markReviewed, uploadVideo } from '../lib/driveService';
import { getMentorWorkload } from '../lib/schedulingService';
import {
  ArrowLeft, Video as VideoIcon, Clock, CheckCircle, MessageSquare,
  ExternalLink, Filter, User, Calendar, AlertCircle, Sparkles
} from 'lucide-react';
import { useTruebadourAI } from '../hooks/useTruebadourAI';
import MentorVideoRecorder from '../components/MentorVideoRecorder';
import { sendReviewEmail } from '../lib/notificationService';
import { devError } from '../lib/devLog';

export default function MentorDashboard() {
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [workload, setWorkload] = useState(null);
  const [filter, setFilter] = useState('all'); // all | pending | reviewed
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewNotes, setReviewNotes] = useState({}); // submissionId -> notes
  const [activeRecorderFor, setActiveRecorderFor] = useState(null); // submissionId
  const [videoBlobs, setVideoBlobs] = useState({}); // submissionId -> Blob
  const { chatStream } = useTruebadourAI();
  const [aiInsights, setAiInsights] = useState(null);
  const [generatingInsights, setGeneratingInsights] = useState(false);

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
      devError('[MentorDashboard] Load failed:', err);
      setError(err.message || 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkReviewed = async (subId) => {
    const notes = reviewNotes[subId] || '';
    const videoBlob = videoBlobs[subId];
    try {
      let mentorVideoLink = null;
      if (videoBlob) {
        // Upload the blob to Google Drive
        const uploadRes = await uploadVideo(videoBlob, {
          entryType: 'mentor-review',
          fileName: `voix-vive-review-${subId}-${Date.now()}.webm`
        });
        mentorVideoLink = uploadRes.webViewLink;
      }
      
      await markReviewed(subId, notes, mentorVideoLink);
      
      setSubmissions(prev => prev.map(s =>
        s.id === subId ? { ...s, reviewed: true, mentor_notes: notes, mentor_video_link: mentorVideoLink, reviewed_at: new Date().toISOString() } : s
      ));
      
      const sub = submissions.find(s => s.id === subId);
      if (sub) {
        sendReviewEmail(sub, sub.profiles, notes, mentorVideoLink).catch(e => devWarn('Email stub failed:', e));
      }
    } catch (err) {
      devError('[MentorDashboard] Review failed:', err);
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

  const generateAIInsights = async () => {
    if (!submissions.length) return;
    setGeneratingInsights(true);
    try {
      const summaryContext = submissions.map(s => 
        `Student: ${s.profiles?.display_name || 'Unknown'}\nFret: ${s.fret_id || 'N/A'}\nNotes: ${s.mentor_notes || 'None'}\nEmotion: ${s.emotional_state || 'Unknown'}`
      ).join('\n\n');
      
      const prompt = `You are an AI assistant for a guitar mentor. Summarize the following recent student submissions and provide one actionable insight on what the mentor should focus on next for the cohort:\n\n${summaryContext}`;
      
      let insightText = '';
      await chatStream(
        [{ role: 'user', content: prompt }],
        (chunk, full) => { insightText = full; },
        { max_tokens: 150, temperature: 0.5 }
      );
      setAiInsights(insightText || "Students are progressing well through the early chapters. Consider offering a group review session on Chapter 2 mechanics.");
    } catch (err) {
      devWarn('AI Insights failed:', err);
      setAiInsights("AI Insight generation failed or is offline. Please review notes manually.");
    } finally {
      setGeneratingInsights(false);
    }
  };

  // ── RENDER ──
  return (
    <div className="min-h-[100svh] bg-[#050508] text-[#e8dcc8] font-sans px-4 pb-10 max-w-[720px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between py-4 border-b border-white/[0.06]">
        <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-[0.75rem] text-cf-gold bg-transparent border-none cursor-pointer font-mono">
          <ArrowLeft size={18} /> Home
        </button>
        <div className="text-center">
          <h1 className="m-0 font-heading text-[1.4rem] text-[#f0e6d2]">Mentor Dashboard</h1>
          <p className="mt-1 text-[0.75rem] text-white/30">Review student submissions</p>
        </div>
        <div className="w-20" /> {/* spacer */}
      </div>

      {/* Workload bar */}
      {workload && (
        <div className="my-4 py-3 px-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} style={{ color: workload.full ? '#cc5555' : '#7aaa88' }} />
            <span className="text-[0.8rem] text-[#e8dcc8]">
              {workload.full
                ? `Queue FULL — ${workload.count} pending reviews`
                : `${workload.count} pending / ${workload.max} max capacity`}
            </span>
          </div>
          <div className="w-full h-1 bg-white/[0.06] rounded-sm mt-2 overflow-hidden">
            <div className="h-full rounded-sm transition-[width] duration-500 ease-out" style={{ width: `${Math.min((workload.count / workload.max) * 100, 100)}%`, background: workload.full ? '#cc5555' : 'var(--cf-gold)' }} />
          </div>
        </div>
      )}

      {/* AI Insights Panel */}
      <div className="mb-4 p-4 rounded-xl bg-[rgba(139,92,246,0.05)] border border-[rgba(139,92,246,0.2)]">
        <div className="flex items-center justify-between" style={{ marginBottom: aiInsights ? 12 : 0 }}>
          <div className="flex items-center gap-2">
            <Sparkles size={16} style={{ color: '#c4b5fd' }} />
            <h2 className="m-0 text-[0.9rem] text-[#e8dcc8] font-heading">Truebadour AI Insights</h2>
          </div>
          <button
            onClick={generateAIInsights}
            disabled={generatingInsights || submissions.length === 0}
            className="flex items-center gap-1.5 py-2 px-3.5 rounded-lg bg-[rgba(139,92,246,0.15)] border border-[rgba(139,92,246,0.3)] text-[#c4b5fd] text-[0.75rem] font-mono cursor-pointer"
          >
            {generatingInsights ? 'Analyzing...' : 'Generate Report'}
          </button>
        </div>
        {aiInsights && (
          <p className="m-0 text-[0.8rem] text-white/70 leading-[1.5] font-sans">
            {aiInsights}
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {['all', 'pending', 'reviewed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex items-center gap-1.5 py-2 px-3.5 rounded-lg border text-[0.75rem] font-mono cursor-pointer transition-all duration-200 ${filter === f ? 'bg-[rgba(var(--cf-gold-rgb),0.1)] border-cf-gold/[0.3] text-cf-gold' : 'bg-white/[0.05] border-white/[0.08] text-white/40'}`}
          >
            {f === 'all' && <Filter size={14} />}
            {f === 'pending' && <Clock size={14} />}
            {f === 'reviewed' && <CheckCircle size={14} />}
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="text-[0.65rem] py-0.5 px-1.5 rounded-full bg-white/[0.08] text-white/50">
              {f === 'all' ? submissions.length : submissions.filter(s => f === 'pending' ? !s.reviewed : s.reviewed).length}
            </span>
          </button>
        ))}
        <button onClick={loadData} className="flex items-center gap-1.5 py-2 px-3.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white/40 text-[0.75rem] font-mono cursor-pointer transition-all duration-200 ml-auto">
          ↻ Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-[rgba(232,85,85,0.08)] border border-[rgba(232,85,85,0.2)] text-[#e88888] text-[0.8rem] mb-4">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-[60px] px-5 text-center">
          <div className="w-7 h-7 rounded-full border-2 border-cf-gold/20 border-t-cf-gold animate-spin" />
          <p className="text-white/40 text-[0.85rem]">Loading submissions...</p>
        </div>
      )}

      {/* Submission list */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-[60px] px-5 text-center">
          <VideoIcon size={40} className="text-white/10 mb-3" />
          <p className="text-white/40">
            {filter === 'pending' ? 'No pending reviews. All caught up!' : 'No submissions yet.'}
          </p>
        </div>
      )}

      {!loading && filtered.map(sub => (
        <div key={sub.id} className="p-4 rounded-xl bg-white/[0.02] border mb-3" style={{ borderColor: sub.reviewed ? 'rgba(122,170,136,0.2)' : 'rgba(var(--cf-gold-rgb),0.15)' }}>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5 flex-1">
              <div className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background: sub.reviewed ? '#7aaa88' : 'var(--cf-gold)' }} />
              <div>
                <div className="flex items-center gap-2">
                  <User size={14} className="text-white/30" />
                  <span className="text-[0.85rem] text-[#f0e6d2] font-medium">
                    {sub.profiles?.display_name || 'Student'}
                  </span>
                </div>
                <div className="flex gap-3 mt-1 text-[0.65rem] text-white/30 font-mono">
                  <span><Calendar size={10} /> {fmtDate(sub.created_at)}</span>
                  {sub.fret_id && <span>Chapter {sub.fret_id}</span>}
                  <span className="capitalize">{sub.entry_type?.replace('-', ' ')}</span>
                </div>
              </div>
            </div>
            <span className="flex items-center gap-1 py-1 px-2.5 rounded-md text-[0.65rem] font-mono uppercase tracking-[0.05em] shrink-0" style={{ background: sub.reviewed ? 'rgba(122,170,136,0.12)' : 'rgba(var(--cf-gold-rgb),0.1)', color: sub.reviewed ? '#7aaa88' : 'var(--cf-gold)' }}>
              {sub.reviewed ? <><CheckCircle size={10} /> Reviewed</> : <><Clock size={10} /> Pending</>}
            </span>
          </div>

          {/* Emotional state */}
          {sub.emotional_state && (
            <div className="flex items-center gap-2 py-2.5 px-3 rounded-lg bg-[rgba(204,85,85,0.04)] border border-[rgba(204,85,85,0.1)] mb-3">
              <MessageSquare size={12} className="text-[#cc5555] shrink-0" />
              <span className="text-[0.8rem] text-white/50 italic">
                "{sub.emotional_state}"
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2 items-center">
            <a
              href={sub.web_view_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 py-2 px-3.5 rounded-lg bg-[rgba(90,144,160,0.1)] border border-[rgba(90,144,160,0.2)] text-[#5a90a0] text-[0.75rem] font-mono no-underline cursor-pointer"
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
                  className="flex-1 min-w-[200px] py-2 px-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-[#e8dcc8] text-[0.8rem] outline-none font-sans"
                />
                <button
                  onClick={() => setActiveRecorderFor(activeRecorderFor === sub.id ? null : sub.id)}
                  className="flex items-center gap-1.5 py-2 px-3.5 rounded-lg border-none text-[0.75rem] font-mono cursor-pointer font-semibold"
                  style={{ background: videoBlobs[sub.id] ? 'rgba(122,170,136,0.2)' : 'rgba(255,255,255,0.1)', color: videoBlobs[sub.id] ? '#7aaa88' : '#fff' }}
                >
                  <VideoIcon size={14} /> {videoBlobs[sub.id] ? 'Video Attached' : 'Record'}
                </button>
                <button
                  onClick={() => handleMarkReviewed(sub.id)}
                  className="flex items-center gap-1.5 py-2 px-3.5 rounded-lg bg-[#7aaa88] text-[#0d0d14] border-none text-[0.75rem] font-mono cursor-pointer font-semibold"
                >
                  <CheckCircle size={14} /> Send Review
                </button>

                {activeRecorderFor === sub.id && !videoBlobs[sub.id] && (
                  <div className="w-full basis-full">
                    <MentorVideoRecorder
                      submissionId={sub.id}
                      onCancel={() => setActiveRecorderFor(null)}
                      onSave={(blob) => {
                        setVideoBlobs(prev => ({ ...prev, [sub.id]: blob }));
                        setActiveRecorderFor(null);
                      }}
                    />
                  </div>
                )}
              </>
            )}

            {sub.reviewed && sub.mentor_notes && (
              <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-[rgba(122,170,136,0.06)] text-[rgba(122,170,136,0.8)] text-[0.8rem] italic">
                <MessageSquare size={12} className="text-[#7aaa88]" />
                {sub.mentor_notes}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

