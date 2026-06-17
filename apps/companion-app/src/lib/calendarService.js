// ═══════════════════════════════════════════════════════════
// GOOGLE CALENDAR SERVICE — Mentor availability & scheduling
// Students see Bertrand's free slots and book async reviews.
// ═══════════════════════════════════════════════════════════

import { devWarn } from './devLog';

const CALENDAR_ID = import.meta.env.VITE_MENTOR_CALENDAR_ID || 'primary';

async function getGoogleToken() {
  const { supabase } = await import('./supabase.js');
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session?.provider_token || null;
}

async function calendarFetch(endpoint, options = {}) {
  const token = await getGoogleToken();
  if (!token) throw new Error('No Google token');
  const res = await fetch(`https://www.googleapis.com/calendar/v3${endpoint}`, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, ...(options.headers || {}) },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Calendar API error: ${res.status}`);
  }
  return res.json();
}

/**
 * Get mentor's free/busy status for the next 7 days.
 * Returns array of { start, end } busy slots.
 */
export async function getMentorBusySlots(days = 7) {
  const now = new Date();
  const end = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  const data = await calendarFetch('/freeBusy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      timeMin: now.toISOString(),
      timeMax: end.toISOString(),
      items: [{ id: CALENDAR_ID }],
    }),
  });

  return data.calendars?.[CALENDAR_ID]?.busy || [];
}

/**
 * Generate available async review slots (30-min windows).
 * Excludes busy times. Returns array of { start, end }.
 */
export async function getAvailableSlots(days = 7) {
  const busy = await getMentorBusySlots(days);
  const now = new Date();
  const end = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  // Generate daily 9am-5pm slots, 30 min each
  const slots = [];
  for (let d = new Date(now); d < end; d.setDate(d.getDate() + 1)) {
    for (let h = 9; h < 17; h++) {
      const start = new Date(d);
      start.setHours(h, 0, 0, 0);
      const slotEnd = new Date(start.getTime() + 30 * 60 * 1000);
      if (start < now) continue;

      const overlaps = busy.some(b => {
        const bs = new Date(b.start);
        const be = new Date(b.end);
        return start < be && slotEnd > bs;
      });

      if (!overlaps) {
        slots.push({ start: start.toISOString(), end: slotEnd.toISOString() });
      }
    }
  }
  return slots.slice(0, 14); // Max 14 slots shown
}

/**
 * Book a review slot (creates calendar event).
 */
export async function bookReviewSlot(slot, studentEmail, studentName) {
  return calendarFetch('/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      summary: `Voix Vive — Async Review for ${studentName}`,
      description: `Student: ${studentName} (${studentEmail})\nType: Async video review\nPlatform: voix-vive.com`,
      start: { dateTime: slot.start, timeZone: 'America/New_York' },
      end: { dateTime: slot.end, timeZone: 'America/New_York' },
      attendees: [{ email: studentEmail }],
      reminders: { useDefault: false, overrides: [{ method: 'email', minutes: 60 }] },
    }),
  });
}

/**
 * Sync the student's Practice Garden habits to their personal Google Calendar.
 */
export async function syncPracticeGardenToCalendar(garden, commitmentTier, _studentEmail) {
  if (!garden || !garden.trees || garden.trees.length === 0) return null;
  
  // Calculate duration based on tier
  let practiceMins = 20;
  if (commitmentTier === 'Gentle') practiceMins = 10;
  if (commitmentTier === 'Intensive') practiceMins = 30;
  
  const eventsToCreate = [];
  
  garden.trees.forEach(tree => {
    // Generate a recurring rule for the habit
    // Simplification: just create a daily recurring event
    const now = new Date();
    
    if (tree.id === 'daily-practice') {
      const start = new Date(now);
      start.setHours(9, 0, 0, 0); // Default 9 AM
      const end = new Date(start.getTime() + practiceMins * 60000);
      
      eventsToCreate.push({
        summary: 'Voix Vive: Daily Practice',
        description: 'Time to tune the self. Your daily somatic and musical practice.',
        start: { dateTime: start.toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
        end: { dateTime: end.toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
        recurrence: ['RRULE:FREQ=DAILY'],
        reminders: { useDefault: false, overrides: [{ method: 'popup', minutes: 15 }] }
      });
    }
    
    if (tree.id === 'evening-wind-down') {
      // Use garden.nightGateTime (e.g. "22:30")
      const [hours, mins] = (garden.nightGateTime || '22:30').split(':').map(Number);
      const start = new Date(now);
      start.setHours(hours, mins, 0, 0);
      const end = new Date(start.getTime() + 5 * 60000); // 5 mins
      
      eventsToCreate.push({
        summary: 'Voix Vive: Evening Wind-Down',
        description: 'Somatic wind-down: Breathe, replay your best musical moment, and set an intention.',
        start: { dateTime: start.toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
        end: { dateTime: end.toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
        recurrence: ['RRULE:FREQ=DAILY'],
        reminders: { useDefault: false, overrides: [{ method: 'popup', minutes: 5 }] }
      });
    }
  });

  const results = [];
  for (const eventBody of eventsToCreate) {
    try {
      const res = await calendarFetch('/events?calendarId=primary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventBody),
      });
      results.push(res);
    } catch (e) {
      devWarn('[CalendarService] Failed to sync event:', e);
    }
  }
  
  return results;
}
