// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : useExportState.js                                   ║
// ║ WHAT    : Serialize Traction state for VR Truebadour Engine   ║
// ║ WHY     : Bridging the web app and the Bevy VR game           ║
// ╚═══════════════════════════════════════════════════════════════╝
import { loadTraction } from '../data/tractionStore';
import { vvGet } from '../lib/storage';
import { STORAGE_KEYS } from '../lib/storageKeys';

export function useExportState() {
  const exportState = () => {
    const traction = loadTraction();
    let voicePrefs = vvGet(STORAGE_KEYS.VOICE_PREFS);
    if (typeof voicePrefs === 'string') {
      try { voicePrefs = JSON.parse(voicePrefs); } catch (e) { voicePrefs = {}; }
    } else {
      voicePrefs = voicePrefs || {};
    }
    
    // Schema must match Bevy `serde_json` struct for `TruebadourProfile`
    const bevyProfile = {
      bard_level: traction.bardLevel,
      current_fret: parseInt((traction.currentNodeId || '').match(/fret-(\d+)/)?.[1] || "1", 10),
      streak: traction.streak || 0,
      practice_minutes: traction.practiceMinutes || 0,
      nodes_completed: traction.completedNodes || [],
      frets_unlocked: traction.fretsUnlocked || [],
      voice_settings: {
        voice_id: voicePrefs.voiceId || 'af_bella',
        speed: voicePrefs.speed || 1.0,
        pitch: voicePrefs.pitch || 1.0,
        volume: voicePrefs.volume || 1.0
      },
      somatic_depth: traction.somaticDepth || 1,
      total_traction: traction.totalTraction || 0
    };

    const json = JSON.stringify(bevyProfile, null, 2);
    
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voixvive_vr_profile_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  return { exportState };
}
