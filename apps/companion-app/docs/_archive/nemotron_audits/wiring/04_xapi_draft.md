---
title: 04_xapi_draft
status: archive
tags: []
date: 2026-06-14
---
Here are five helper functions that return correctly‑shaped xAPI 1.0.3 statement objects for the requested events, each using a verb from the official ADL registry (http://adlnet.gov/expapi/verbs/). The `actor` is identified by its ID and uses an Agent object; verbs include display text in English where appropriate.

```javascript
// src/utils/xapi.js

/**
 * Builds an xAPI statement for a session that was attempted.
 *
 * @param {string} actorId - Identifier (mbox, account, etc.) of the learner/actor.
 * @param {number|string} fretId - ID of the fret being worked on.
 * @returns {{actor:Object, verb:Object, object:Object}} xAPI statement
 */
export function recordAttemptedSession(actorId, fretId) {
  return {
    actor: {
      // Assuming actorId is a mailbox; adjust type if needed (e.g., Account)
      mbox: `mailto:${actorId}`,
      objectType: 'Agent'
    },
    verb: {
      id: 'http://adlnet.gov/expapi/verbs/experienced',
      display: { 'en-US': 'experienced' }
    },
    object: {
      // Unique identifier for the fret resource
      id: `https://example.com/frets/${fretId}`,
      definition: {
        name: { 'en-US': `Fret ${fretId}` },
        description: { 'en-US': `Attempted session on fret ${fretId}` }
      },
      objectType: 'Activity'
    }
  };
}

/**
 * Builds an xAPI statement for a completed session.
 *
 * @param {string} actorId
 * @param {number|string} fretId
 */
export function recordCompletedSession(actorId, fretId) {
  return {
    actor: {
      mbox: `mailto:${actorId}`,
      objectType: 'Agent'
    },
    verb: {
      id: 'http://adlnet.gov/expapi/verbs/completed',
      display: { 'en-US': 'completed' }
    },
    object: {
      id: `https://example.com/frets/${fretId}`,
      definition: {
        name: { 'en-US': `Fret ${fretId}` },
        description: { 'en-US': `Completed session on fret ${fretId}` }
      },
      objectType: 'Activity'
    }
  };
}

/**
 * Builds an xAPI statement for progressing a fret to a new star level.
 *
 * @param {string} actorId
 * @param {number|string} fretId
 * @param {number} newStarLevel - The achieved star rating (e.g., 1‑5)
 */
export function recordProgressedFret(actorId, fretId, newStarLevel) {
  return {
    actor: {
      mbox: `mailto:${actorId}`,
      objectType: 'Agent'
    },
    verb: {
      id: 'http://adlnet.gov/expapi/verbs/progressed',
      display: { 'en-US': 'progressed' }
    },
    object: {
      id: `https://example.com/frets/${fretId}`,
      definition: {
        name: { 'en-US': `Fret ${fretId}` },
        description: { 'en-US': `Progressed fret to star level ${newStarLevel}` }
      },
      objectType: 'Activity'
    },
    // Optional result capturing the achieved level
    result: {
      extensions: {
        'https://example.com/extensions/starLevel': newStarLevel
      }
    }
  };
}

/**
 * Builds an xAPI statement for experiencing a troubadour prompt snippet.
 *
 * @param {string} actorId - Learner identifier
 * @param {string} promptSnippet - Short text or ID of the troubadour content experienced
 */
export function recordExperiencedTroubadour(actorId, promptSnippet) {
  return {
    actor: {
      mbox: `mailto:${actorId}`,
      objectType: 'Agent'
    },
    verb: {
      id: 'http://adlnet.gov/expapi/verbs/experienced',
      display: { 'en-US': 'experienced' }
    },
    object: {
      // Treat the troubadour prompt as an activity
      id: `https://example.com/troubadours/${encodeURIComponent(promptSnippet)}`,
      definition: {
        name: { 'en-US': 'Troubadour Prompt' },
        description: { 'en-US': promptSnippet }
      },
      objectType: 'Activity'
    }
  };
}

/**
 * Builds an xAPI statement for mastering a fret.
 *
 * @param {string} actorId
 * @param {number|string} fretId
 */
export function recordMasteredFret(actorId, fretId) {
  return {
    actor: {
      mbox: `mailto:${actorId}`,
      objectType: 'Agent'
    },
    verb: {
      id: 'http://adlnet.gov/expapi/verbs/mastered',
      display: { 'en-US': 'mastered' }
    },
    object: {
      id: `https://example.com/frets/${fretId}`,
      definition: {
        name: { 'en-US': `Fret ${fretId}` },
        description: { 'en-US': `Mastered fret ${fretId}` }
      },
      objectType: 'Activity'
    }
  };
}
```