import React, { useState, useEffect, useCallback } from 'react';
import { FRET_METADATA } from '../../data/dag/dagNodes';
import { generateDailySession } from '../../data/practiceEngine';
import { getBardicTitle } from '../../data/bardicTitles';
import { syncJournalToDrive } from '../../lib/driveService';
import { getAvailableSlots, bookReviewSlot } from '../../lib/calendarService';
import { useKokoroTTS } from '../../hooks/useKokoroTTS';
import { useAuth } from '../../hooks/useAuth';
import { vvGet, vvSetJSON } from '../../lib/storage';
import { STORAGE_KEYS } from '../../lib/storageKeys';

// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : PracticeJournal.jsx                                  ║
// ║ WHAT    : Workbook companion — today's focus, practice log,   ║
// ║           mentor booking. Wraps around the student.            ║
// ║ WHY     : Transforms workbook from checklist to living journal. ║
// ╚════════════════════════════════════════════════════════════════╝

export default function PracticeJournal({ traction, nextRecommended: _nextRecommended, completedNodes }) {
  const { user } = useAuth();
  const [log, setLog] = useState(() => {
    try { return JSON.parse(vvGet(STORAGE_KEYS.PRACTICE_LOG) || '[]'); }
    catch { return []; }
  });

  useEffect(() => {
    vvSetJSON(STORAGE_KEYS.PRACTICE_LOG, log);
  }, [log]);

  // Generate the 20-min daily session from the DAG
  const session = generateDailySession(traction, completedNodes);
  const { blocks, focusNode, title } = session;

  const { initAndSpeak, isLoading, loadProgress } = useKokoroTTS();

  // ── Calendar Booking State ──
  const [showBooking, setShowBooking] = useState(false);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null); // null | 'booking' | 'success' | 'error'
  const [bookedSlot, setBookedSlot] = useState(null);
  const [bookingError, setBookingError] = useState('');

  // Current identity
  const bardLevel = traction?.bardLevel || 1;
  const bardTitle = getBardicTitle(bardLevel);

  // Streak calculation
  const today = new Date().toDateString();
  const practicedToday = log.some(e => new Date(e.date).toDateString() === today);
  const streak = calculateStreak(log);

  // Time since last practice
  const lastEntry = log[0];
  const lastPracticeText = lastEntry
    ? formatTimeSince(new Date(lastEntry.date))
    : 'No sessions yet';

  const handleLogSession = async () => {
    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      nodeId: focusNode?.id || 'fret-1-class-be',
      fret: focusNode?.fret || 1,
      phase: focusNode?.phase || 'be',
      activity: focusNode?.title || 'Practice',
      duration: 20,
      status: 'logged',
    };
    setLog(prev => [entry, ...prev]);
    
    // Sync to Drive Archive in background
    syncJournalToDrive(entry).catch(err => {
      console.warn('Background sync failed:', err);
    });
  };

  const handlePlayAudioGuide = async () => {
    let script = `Today's session is: ${title}. `;
    blocks.forEach(b => {
      script += `For ${b.duration} minutes, we will focus on ${b.label}. ${b.description}. `;
    });
    script += "Let's begin.";
    await initAndSpeak(script, 'en', 'am_adam');
  };

  // ── Calendar Booking Handlers ──
  const handleOpenBooking = useCallback(async () => {
    setShowBooking(true);
    setLoadingSlots(true);
    setBookingStatus(null);
    setBookingError('');
    try {
      const available = await getAvailableSlots(7);
      setSlots(available);
    } catch (err) {
      setBookingError(err.message || 'Could not load calendar slots');
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  const handleBookSlot = useCallback(async (slot) => {
    if (!user) return;
    setBookingStatus('booking');
    try {
      await bookReviewSlot(
        slot,
        user.email,
        user.user_metadata?.full_name || user.email
      );
      setBookedSlot(slot);
      setBookingStatus('success');
    } catch (err) {
      setBookingError(err.message || 'Booking failed');
      setBookingStatus('error');
    }
  }, [user]);

  const formatSlotDate = (isoStr) => {
    const d = new Date(isoStr);
    return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  };
  const formatSlotTime = (isoStr) => {
    const d = new Date(isoStr);
    return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  };

  // Group slots by date for display
  const groupedSlots = slots.reduce((acc, slot) => {
    const dateKey = formatSlotDate(slot.start);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(slot);
    return acc;
  }, {});

  return (
    <div className="mb-6">
      {/* ── Today's 20-Min Session ── */}
      <div className="bg-gradient-to-br from-blue-400/[0.08] to-purple-400/[0.08] border border-blue-400/20 rounded-2xl p-5 mb-5">
        <div className="flex flex-col items-center mb-3 pb-3 border-b border-white/[0.06]">
          <span className="font-heading text-[1.1rem] text-vv-text font-semibold">{bardTitle.title}</span>
          <span className="font-mono text-[0.65rem] text-cf-gold/70 tracking-[0.1em] uppercase">{bardTitle.epithet}</span>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[1.2rem]">🎯</span>
          <span className="font-mono text-[0.7rem] text-[#60a5fa] tracking-[0.15em] uppercase flex-1">Today's 20-Minute Session</span>
          <span className="text-[0.8rem] text-amber-400 bg-amber-400/10 py-1 px-2.5 rounded-xl">🔥 {streak} day{streak !== 1 ? 's' : ''}</span>
        </div>

        <h3 className="font-heading text-[1.3rem] text-vv-text m-0 mb-1.5">{title}</h3>

        {/* Session blocks */}
        <div className="flex flex-col gap-2 mb-4">
          {blocks.map((block, i) => (
            <div key={i} className="flex gap-2.5 py-2.5 px-3 rounded-[10px] bg-white/[0.04] border border-white/[0.06]">
              <span className="text-[1.2rem] leading-none mt-0.5">{block.icon}</span>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[0.85rem] font-semibold text-vv-text">{block.label}</span>
                  <span className="font-mono text-[0.7rem] text-white/40 bg-white/[0.06] py-0.5 px-2 rounded-md">{block.duration} min</span>
                </div>
                <p className="text-[0.8rem] text-white/50 m-0 mb-1.5 leading-[1.4]">{block.description}</p>
                {block.activities && (
                  <ul className="m-0 pl-4 list-disc">
                    {block.activities.map((a, j) => (
                      <li key={j} className="text-[0.75rem] text-blue-400/80 mb-0.5">{a}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2.5 mb-3">
          <button className="flex-1 py-3 px-4 rounded-[10px] border-none bg-gradient-to-br from-[#60a5fa] to-[#a78bfa] text-white font-mono text-[0.75rem] font-semibold cursor-pointer tracking-[0.05em] hover:opacity-90 transition-opacity" onClick={handleLogSession}>
            {practicedToday ? '✓ Logged Today' : 'Start 20-Min Session'}
          </button>
          <button
            className="py-3 px-4 rounded-[10px] border border-white/15 bg-white/5 text-white/70 font-mono text-[0.75rem] cursor-pointer relative overflow-hidden hover:bg-white/10 transition-colors disabled:opacity-50"
            onClick={handlePlayAudioGuide}
            disabled={isLoading}
          >
            {isLoading ? `Loading Voice... ${loadProgress}%` : '🔊 Audio Guide'}
          </button>
          <button className="py-3 px-4 rounded-[10px] border border-white/15 bg-white/5 text-white/70 font-mono text-[0.75rem] cursor-pointer hover:bg-white/10 transition-colors" onClick={handleOpenBooking}>
            📅 Book Mentor Review
          </button>
        </div>

        <div className="text-[0.75rem] text-white/35 font-mono">
          <span>Last practice: {lastPracticeText}</span>
        </div>
      </div>

      {/* ── Calendar Booking Overlay ── */}
      {showBooking && (
        <div className="fixed inset-0 z-[999] bg-cf-void/92 backdrop-blur-[8px] flex items-center justify-center p-5">
          <div className="w-full max-w-[420px] max-h-[80vh] overflow-y-auto bg-gradient-to-br from-blue-400/[0.06] to-purple-400/[0.06] border border-blue-400/20 rounded-[20px] p-6">
            <div className="flex justify-between items-center mb-5">
              <span className="font-heading text-[1.3rem] text-vv-text font-semibold">📅 Book Mentor Review</span>
              <button className="bg-white/[0.06] border border-white/10 rounded-full w-8 h-8 text-white/50 cursor-pointer text-[0.9rem] flex items-center justify-center hover:bg-white/[0.1] transition-colors" onClick={() => { setShowBooking(false); setBookingStatus(null); }}>✕</button>
            </div>

            {!user ? (
              <div className="text-center py-6">
                <p className="m-0 mb-2 text-white/70">
                  Sign in with Google to view Bertrand's availability and book a review slot.
                </p>
                <p className="m-0 text-[0.75rem] text-cf-gold/60">
                  Your Google Calendar will receive the booking confirmation.
                </p>
              </div>
            ) : bookingStatus === 'success' ? (
              <div className="text-center py-6">
                <span className="text-[2rem]">✅</span>
                <p className="font-heading text-[1.2rem] text-[#34d399] font-semibold m-[8px_0_4px]">Review Booked!</p>
                <p className="font-mono text-[0.8rem] text-[#60a5fa]">
                  {formatSlotDate(bookedSlot.start)} at {formatSlotTime(bookedSlot.start)}
                </p>
                <p className="text-[0.8rem] text-white/50 m-[8px_0_0]">
                  A calendar event has been sent to your Google Calendar. Bertrand will review your latest submission during this window.
                </p>
              </div>
            ) : loadingSlots ? (
              <div className="text-center py-8 text-white/50 text-[0.85rem]">
                <span className="text-[1.5rem]">⏳</span>
                <p>Loading Bertrand's availability...</p>
              </div>
            ) : bookingError && bookingStatus !== 'booking' ? (
              <div className="text-center py-6">
                <p className="text-[#f87171]">⚠️ {bookingError}</p>
                <button className="py-3 px-4 rounded-[10px] border border-white/15 bg-white/5 text-white/70 font-mono text-[0.75rem] cursor-pointer mt-2 hover:bg-white/10 transition-colors" onClick={handleOpenBooking}>Retry</button>
              </div>
            ) : slots.length === 0 ? (
              <div className="text-center py-6 text-white/50 text-[0.85rem]">
                <p>No available slots this week. Bertrand's calendar is full.</p>
                <p className="text-[0.75rem] text-white/40">
                  Try again next week or submit your video for async review.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {Object.entries(groupedSlots).map(([date, daySlots]) => (
                  <div key={date} className="flex flex-col gap-2">
                    <span className="font-mono text-[0.7rem] text-cf-gold/70 tracking-[0.1em] uppercase">{date}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {daySlots.map((slot, i) => (
                        <button
                          key={i}
                          className="py-2 px-3.5 rounded-[10px] bg-blue-400/10 border border-blue-400/25 text-[#60a5fa] cursor-pointer font-mono text-[0.75rem] transition-all duration-200 hover:bg-blue-400/20 disabled:opacity-50"
                          onClick={() => handleBookSlot(slot)}
                          disabled={bookingStatus === 'booking'}
                        >
                          {bookingStatus === 'booking' ? '...' : formatSlotTime(slot.start)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Practice Log ── */}
      {log.length > 0 && (
        <div className="bg-white/[0.02] rounded-xl p-4 border border-white/[0.05]">
          <h4 className="font-mono text-[0.7rem] text-cf-gold/60 tracking-[0.15em] uppercase m-0 mb-3">Recent Sessions</h4>
          <div className="flex flex-col gap-2">
            {log.slice(0, 7).map(entry => (
              <div key={entry.id} className="flex items-center gap-2.5 py-2 px-2.5 rounded-lg bg-white/[0.03]">
                <div className="w-2 h-2 rounded-full bg-[#34d399] shrink-0" />
                <div className="flex flex-col flex-1">
                  <span className="text-[0.8rem] text-white/80">{entry.activity}</span>
                  <span className="text-[0.7rem] text-white/40 font-mono">
                    {new Date(entry.date).toLocaleDateString()} · {entry.duration} min
                  </span>
                </div>
                <span className="text-[0.9rem] text-white/30">{entry.status === 'reviewed' ? '✓' : '○'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function calculateStreak(log) {
  if (!log.length) return 0;
  const dates = [...new Set(log.map(e => new Date(e.date).toDateString()))].sort((a, b) => new Date(b) - new Date(a));
  let streak = 0;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  let checkDate = dates[0] === today ? today : yesterday;
  for (const d of dates) {
    if (d === checkDate) {
      streak++;
      checkDate = new Date(new Date(checkDate).getTime() - 86400000).toDateString();
    } else break;
  }
  return streak;
}

function formatTimeSince(date) {
  const diff = Date.now() - date.getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

