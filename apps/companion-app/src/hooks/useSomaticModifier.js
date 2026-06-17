import { useState, useCallback, useEffect } from 'react';

/**
 * useSomaticModifier
 * 
 * Implements the "Friction Penalty" from the Iron Road Gamification Spec.
 * This hook translates the physical/emotional "BE" check-in into a mechanical
 * session difficulty parameter.
 */
export default function useSomaticModifier() {
  const [somaticState, setSomaticState] = useState({
    tension: 50, // 0 = deeply relaxed, 100 = completely overwhelmed
    energy: 50,  // 0 = exhausted, 100 = manic/wired
  });

  const [frictionModifier, setFrictionModifier] = useState({
    frictionLevel: 1,       // 0 to 3 multiplier
    difficultyClass: 10,    // Base DC
    sessionTargetMins: 15,  // Recommended practice length
    troubadourMode: 'balanced', // 'supportive', 'balanced', 'challenge', 'maintenance'
  });

  const updateSomaticState = useCallback((newState) => {
    setSomaticState(prev => ({ ...prev, ...newState }));
  }, []);

  // Calculate Friction Penalty whenever somatic state changes
  useEffect(() => {
    const { tension, energy } = somaticState;
    
    let level = 1;
    let dc = 10;
    let target = 15;
    let mode = 'balanced';

    // High tension + Low energy = Exhausted/Anxious (Ghost Train risk)
    if (tension > 75) {
      if (energy < 30) {
        level = 3;
        dc = 5;       // Drop difficulty significantly
        target = 5;   // Just 5 minutes
        mode = 'maintenance';
      } else {
        level = 2;
        dc = 8;
        target = 10;
        mode = 'supportive';
      }
    } 
    // Low tension + High energy = Flow State / Focused
    else if (tension < 30 && energy > 60) {
      level = 0;      // Zero friction
      dc = 15;        // Increase difficulty (Challenge)
      target = 30;    // Longer session
      mode = 'challenge';
    }
    // Deep relaxation + low energy = Somatic depth
    else if (tension < 30 && energy < 50) {
      level = 0;
      dc = 12;
      target = 20;
      mode = 'balanced';
    }

    setFrictionModifier({
      frictionLevel: level,
      difficultyClass: dc,
      sessionTargetMins: target,
      troubadourMode: mode,
    });
  }, [somaticState]);

  return {
    somaticState,
    updateSomaticState,
    frictionModifier,
  };
}
