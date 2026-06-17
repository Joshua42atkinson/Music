// ═══════════════════════════════════════════════════════════
// GOOGLE CALENDAR — Create practice milestones & events
// ═══════════════════════════════════════════════════════════

import { GOOGLE_API_BASE } from '../config/google';

const CALENDAR_ID = 'primary';

/** Create a practice session event */
export async function createPracticeEvent(accessToken, { title, startTime, endTime, description = '' }) {
  const event = {
    summary: `🎸 ${title}`,
    description,
    start: { dateTime: startTime.toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
    end:   { dateTime: endTime.toISOString(),   timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
    reminders: { useDefault: false, overrides: [{ method: 'popup', minutes: 15 }] },
  };

  const res = await fetch(`${GOOGLE_API_BASE}/calendar/v3/calendars/${CALENDAR_ID}/events`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });

  if (!res.ok) throw new Error(`Calendar create failed: ${res.status}`);
  return res.json();
}

/** List upcoming events */
export async function listUpcomingEvents(accessToken, maxResults = 10) {
  const timeMin = new Date().toISOString();
  const url = `${GOOGLE_API_BASE}/calendar/v3/calendars/${CALENDAR_ID}/events?timeMin=${encodeURIComponent(timeMin)}&maxResults=${maxResults}&orderBy=startTime&singleEvents=true`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) throw new Error(`Calendar list failed: ${res.status}`);
  const data = await res.json();
  return data.items || [];
}
