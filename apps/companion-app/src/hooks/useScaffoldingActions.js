// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : useScaffoldingActions.js                           ║
// ║ WHAT    : Action creators for traction state mutations       ║
// ║ WHY     : Keeps ScaffoldingProvider focused on state wiring  ║
// ║           rather than business logic                         ║
// ║ WHO     : ScaffoldingProvider                                ║
// ║ OWNS    : completePhase, advanceNode, navigateToNode,     ║
// ║           markDepth, passGate, toggleGlobalMode, toggleAI,  ║
// ║           toggleGame                                         ║
// ║ NEEDS   : tractionStore pure reducers, dag helpers           ║
// ║ RULES   : Every action returns the next state; caller sets  ║
// ╚═══════════════════════════════════════════════════════════════╝
import { useCallback } from 'react';
import {
  completeDAGPhase,
  completeNode,
  setCurrentNode,
  markDepthExplored,
  passSomaticGate,
} from '../data/tractionStore';

export function useScaffoldingActions(traction, updateTraction) {
  const completePhase = useCallback((fretIdOrNodeId, phase) => {
    let fretId = fretIdOrNodeId;
    let nodeId = fretIdOrNodeId;
    if (typeof fretIdOrNodeId === 'string' && fretIdOrNodeId.startsWith('fret-')) {
      const match = fretIdOrNodeId.match(/fret-(\d+)/);
      if (match) fretId = parseInt(match[1], 10);
      nodeId = fretIdOrNodeId;
    }

    // Use functional updater so we always read the latest traction state.
    // This fixes stale-closure bugs when passGate + completePhase are
    // called in the same event handler.
    updateTraction((prev) => {
      // ── Pitch-Gated Completion (P5-pitch-gated) ────────────────
      // The somatic gate must be passed before a phase can be marked
      // complete. This prevents "sit silently for 25 min = complete".
      // Gate enforcement lives in business logic, not just UI disabled state.
      const gateKey = `${phase}GatePassed`;
      const fretState = prev.frets?.[fretId] || {};
      if (!fretState[gateKey]) {
        // Gate not passed — silently reject, leave state unchanged
        return prev;
      }

      let newState = completeDAGPhase(prev, fretId, phase);
      if (typeof nodeId === 'string' && nodeId.startsWith('fret-')) {
        newState = completeNode(newState, nodeId);
      }
      return newState;
    });
  }, [updateTraction]);

  const advanceNode = useCallback((nodeId) => {
    const newState = completeNode(traction, nodeId);
    updateTraction(() => newState);
  }, [traction, updateTraction]);

  const navigateToNode = useCallback((nodeId) => {
    const newState = setCurrentNode(traction, nodeId);
    updateTraction(() => newState);
  }, [traction, updateTraction]);

  const markDepth = useCallback((fretId) => {
    const newState = markDepthExplored(traction, fretId);
    updateTraction(() => newState);
  }, [traction, updateTraction]);

  const passGate = useCallback((fretIdOrNodeId, phase) => {
    let fretId = fretIdOrNodeId;
    if (typeof fretIdOrNodeId === 'string' && fretIdOrNodeId.startsWith('fret-')) {
      const match = fretIdOrNodeId.match(/fret-(\d+)/);
      if (match) fretId = parseInt(match[1], 10);
    }
    updateTraction((prev) => passSomaticGate(prev, fretId, phase));
  }, [updateTraction]);

  const toggleGlobalMode = useCallback(() => {
    updateTraction(prev => {
      const currentMode = prev.settings?.globalMode || 'truebadour_trial';
      const newMode = currentMode === 'truebadour_trial' ? 'open_book' : 'truebadour_trial';
      return {
        ...prev,
        settings: { ...(prev.settings || {}), globalMode: newMode },
      };
    });
  }, [updateTraction]);

  const toggleAI = useCallback(() => {
    updateTraction(prev => ({
      ...prev,
      settings: { ...(prev.settings || {}), aiEnabled: prev.settings?.aiEnabled === false ? true : false },
    }));
  }, [updateTraction]);

  const toggleGame = useCallback(() => {
    updateTraction(prev => ({
      ...prev,
      settings: { ...(prev.settings || {}), gameEnabled: prev.settings?.gameEnabled === false ? true : false },
    }));
  }, [updateTraction]);

  return {
    completePhase,
    advanceNode,
    navigateToNode,
    markDepth,
    passGate,
    toggleGlobalMode,
    toggleAI,
    toggleGame,
  };
}
