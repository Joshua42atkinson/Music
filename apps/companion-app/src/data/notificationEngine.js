// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : notificationEngine.js                              ║
// ║ WHAT    : Evaluates the Practice Garden state to trigger     ║
// ║           local notifications for habit building.            ║
// ║ STAGE   : IMPLEMENT (ADDIECRAPEYE phase 4)                   ║
// ╚═══════════════════════════════════════════════════════════════╝

import { loadTraction, saveTraction } from './tractionStore';

/**
 * Check if a specific garden tree action has been completed today.
 * Currently stubbed to check general practice minutes.
 */
function isCompletedToday(traction, _treeId) {
  const today = new Date().toISOString().split('T')[0];
  if (traction.lastPracticeDate !== today) return false;
  
  // Specific checks can be added here if traction tracking gets granular
  // Defaulting to true if they practiced at all today
  return traction.practiceMinutes > 0;
}

function daysSinceLastPractice(traction) {
  if (!traction.lastPracticeTimestamp) return 999;
  const now = new Date().getTime();
  return Math.floor((now - traction.lastPracticeTimestamp) / (1000 * 60 * 60 * 24));
}

// ── State-Driven Notification Rules ────────────────────────────────
export const NOTIFICATION_RULES = [
  {
    id: 'morning-breath',
    trigger: (traction, garden) => {
      const breathTree = garden?.trees?.find(t => t.id === 'breath');
      if (!breathTree?.planted) return null;
      if (breathTree.growthStage === 'forest') return null; // self-sustaining
      
      const now = new Date();
      const [h, m] = (breathTree.time || '07:00').split(':').map(Number);
      const target = new Date(); target.setHours(h, m, 0, 0);
      
      const tolerance = breathTree.growthStage === 'sprout' ? 0
        : breathTree.growthStage === 'sapling' ? 30
        : 120; // minutes
        
      if (now >= target && !isCompletedToday(traction, 'breath')) {
        if (now - target <= tolerance * 60 * 1000 || tolerance === 0) {
          return { title: 'Your breath is waiting', body: '3 breaths to begin.' };
        }
      }
      return null;
    }
  },
  {
    id: 'streak-guardian',
    trigger: (traction, _garden) => {
      if (traction.streak >= 7 && !isCompletedToday(traction, 'practice')) {
        const now = new Date();
        if (now.getHours() >= 15) { // afternoon — streak at risk
          return { title: `${traction.streak}-day streak at risk`, body: 'Even 3 minutes counts.' };
        }
      }
      return null;
    }
  },
  {
    id: 'gate-unlock',
    trigger: (traction, _garden) => {
      const fretState = traction.frets?.[traction.currentFret];
      if (fretState?.beGatePassed && !fretState?.doGatePassed) {
        return { title: 'You heard it. Now play it.', body: 'DO phase unlocked.' };
      }
      return null;
    }
  },
  {
    id: 'paravastha-prompt',
    trigger: (traction, _garden) => {
      if (isCompletedToday(traction, 'practice') && !isCompletedToday(traction, 'paravastha')) {
        const now = new Date();
        if (now.getHours() >= 20) { // evening
          return { title: 'How long did the feeling last?', body: 'Paravastha check: 5 min? 1 hour? All day?' };
        }
      }
      return null;
    }
  },
  {
    id: 'night-gate',
    trigger: (traction, garden) => {
      const nightTree = garden?.trees?.find(t => t.id === 'night-gate');
      if (!nightTree?.planted) return null;
      if (nightTree.growthStage === 'forest') return null;
      
      const [h, m] = (garden.nightGateTime || '22:30').split(':').map(Number);
      const now = new Date();
      const target = new Date(); target.setHours(h, m, 0, 0);
      
      if (now >= target && !isCompletedToday(traction, 'night-gate')) {
        return { title: 'Night Gate', body: 'Breathe 3×. Replay your best moment. Set tomorrow.' };
      }
      return null;
    }
  },
  {
    id: 'daily-ritual-reminder',
    trigger: (traction, _garden) => {
      if (!isCompletedToday(traction, 'practice')) {
        const now = new Date();
        // Trigger around 6 PM if they haven't practiced yet
        if (now.getHours() === 18) {
          const fretId = Math.max(1, ...(traction.fretsUnlocked || [1]));
          return { title: 'Your Daily Ritual Awaits', body: `Today's focus is Chapter ${fretId}. Hold the guitar, breathe, and begin.` };
        }
      }
      return null;
    }
  },
  {
    id: 'commitment-check',
    trigger: (traction, _garden) => {
      if (daysSinceLastPractice(traction) >= 3 && traction.commitmentTier === 'committed') {
        return { title: 'Would you like to switch to Gentle pace?', body: 'No judgment. The path adjusts to you.' };
      }
      return null;
    }
  },
  {
    id: 'scaffolding-fade',
    trigger: (traction, _garden) => {
      const level = traction.settings?.scaffoldingLevel ?? 1.0;
      if (level < 0.5 && !traction._scaffoldingFadeNotified) {
        // We'll mutate state internally to not spam this
        const newState = { ...traction, _scaffoldingFadeNotified: true };
        saveTraction(newState);
        return { title: 'Note labels fading', body: 'Your fingers know the way now.' };
      }
      return null;
    }
  },
];

// ── Notification Evaluator ────────────────────────────────────────

/**
 * Evaluates the rules and returns the active notification (if any).
 * Typically called by the service worker or a background sync interval.
 */
export function evaluateNotifications() {
  const traction = loadTraction();
  const garden = traction.garden || { trees: [] };
  
  for (const rule of NOTIFICATION_RULES) {
    try {
      const notification = rule.trigger(traction, garden);
      if (notification) {
        // Return the first matching notification priority
        return notification;
      }
    } catch (e) {
      console.warn(`[NotificationEngine] Error evaluating rule ${rule.id}:`, e);
    }
  }
  return null;
}

/**
 * Helper to register Service Worker and request Push permissions
 */
export async function setupPushNotifications() {
  if (!('Notification' in window)) {
    console.warn('[NotificationEngine] This browser does not support notifications.');
    return false;
  }
  
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('/sw.js');
        return true;
      } catch (e) {
        console.error('[NotificationEngine] Service Worker registration failed:', e);
      }
    }
    return true;
  }
  return false;
}
