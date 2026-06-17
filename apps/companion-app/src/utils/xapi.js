// ╔══ VOIX VIVE ═══════════════════════════════════════════════════╗
// ║ FILE    : xapi.js                                              ║
// ║ WHAT    : Generates xAPI 1.0.3 statement objects for Voix Vive ║
// ║ WHY     : To support LMS grade passback and analytics tracking ║
// ║ WHO     : LMS integrations and data architecture               ║
// ║ OWNS    : The exact shape of xAPI statements                   ║
// ║ NEEDS   : Nothing (pure functions)                             ║
// ║ RULES   : Must adhere exactly to xAPI 1.0.3 specification      ║
// ║ FIX AT  : LMS LRS configuration                                ║
// ║ STAGE   : IMPLEMENT                                            ║
// ╚════════════════════════════════════════════════════════════════╝

export const recordAttemptedSession = (actorId, fretId) => ({
  actor: {
    account: {
      homePage: 'https://voixvive.com',
      name: String(actorId)
    }
  },
  verb: {
    id: 'http://adlnet.gov/expapi/verbs/attempted',
    display: { 'en-US': 'attempted' }
  },
  object: {
    id: `https://voixvive.com/fret/${fretId}`,
    definition: {
      name: { 'en-US': `Fret ${fretId}` },
      description: { 'en-US': '' }
    }
  }
});

export const recordCompletedSession = (actorId, fretId) => ({
  actor: {
    account: {
      homePage: 'https://voixvive.com',
      name: String(actorId)
    }
  },
  verb: {
    id: 'http://adlnet.gov/expapi/verbs/completed',
    display: { 'en-US': 'completed' }
  },
  object: {
    id: `https://voixvive.com/fret/${fretId}`,
    definition: {
      name: { 'en-US': `Fret ${fretId}` },
      description: { 'en-US': '' }
    }
  }
});

export const recordProgressedFret = (actorId, fretId, newStarLevel) => ({
  actor: {
    account: {
      homePage: 'https://voixvive.com',
      name: String(actorId)
    }
  },
  verb: {
    id: 'http://adlnet.gov/expapi/verbs/progressed',
    display: { 'en-US': 'progressed' }
  },
  object: {
    id: `https://voixvive.com/fret/${fretId}`,
    definition: {
      name: { 'en-US': `Fret ${fretId}` }
    }
  },
  result: {
    extensions: {
      // Custom extension for the new star level
      'https://voixvive.com/extensions/newStarLevel': newStarLevel
    }
  }
});

export const recordExperiencedTruebadour = (actorId, promptSnippet) => ({
  actor: {
    account: {
      homePage: 'https://voixvive.com',
      name: String(actorId)
    }
  },
  verb: {
    id: 'http://adlnet.gov/expapi/verbs/experienced',
    display: { 'en-US': 'experienced' }
  },
  object: {
    id: 'https://voixvive.com/truebadour',
    definition: {
      name: { 'en-US': 'Truebadour Experience' },
      description: { 'en-US': promptSnippet }
    }
  }
});

export const recordMasteredFret = (actorId, fretId) => ({
  actor: {
    account: {
      homePage: 'https://voixvive.com',
      name: String(actorId)
    }
  },
  verb: {
    id: 'http://adlnet.gov/expapi/verbs/mastered',
    display: { 'en-US': 'mastered' }
  },
  object: {
    id: `https://voixvive.com/fret/${fretId}`,
    definition: {
      name: { 'en-US': `Fret ${fretId}` }
    }
  }
});
