import React, { useState } from 'react';
import { useScaffolding } from '../ScaffoldingProvider';
import { useAuth } from '../../hooks/useAuth';
import { syncPracticeGardenToCalendar } from '../../lib/calendarService';

// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : PracticeGarden.jsx                                   ║
// ║ WHAT    : UI for planting and tending notification "trees"     ║
// ║ WHY     : Gamifies habit building via Kriya's "tree a day"     ║
// ╚════════════════════════════════════════════════════════════════╝

const TREES = [
  { id: 'breath', name: 'Breath Tree', icon: '🌱', unlockFret: 1, desc: '3 minutes of breath', defaultTime: '07:00' },
  { id: 'practice', name: 'Practice Tree', icon: '🌿', unlockFret: 2, desc: '8 minutes of practice', defaultTime: '12:00' },
  { id: 'reflect', name: 'Reflect Tree', icon: '🌳', unlockFret: 4, desc: '5 minutes of journaling', defaultTime: '18:00' },
  { id: 'night-gate', name: 'Night Gate', icon: '🌸', unlockFret: 6, desc: '3 minutes before sleep', defaultTime: '22:30' },
  { id: 'living-voice', name: 'Living Voice', icon: '🌳', unlockFret: 8, desc: 'Background autonomous practice', defaultTime: null },
];

export default function PracticeGarden() {
  const { traction, updateTraction, currentFret } = useScaffolding();
  const { user } = useAuth();
  
  // Calendar sync state
  const [calSyncStatus, setCalSyncStatus] = useState(null); // null | 'syncing' | 'success' | 'error'
  const [calSyncError, setCalSyncError] = useState('');
  
  // Ensure garden exists
  const garden = traction.garden || { trees: [] };
  
  const handlePlantTree = (treeId, time) => {
    updateTraction(prev => {
      const prevGarden = prev.garden || { trees: [] };
      const existing = prevGarden.trees.find(t => t.id === treeId);
      let newTrees;
      if (existing) {
        newTrees = prevGarden.trees.map(t => t.id === treeId ? { ...t, planted: true, time, growthStage: 'sprout' } : t);
      } else {
        newTrees = [...prevGarden.trees, { id: treeId, planted: true, time, growthStage: 'sprout', consecutiveHits: 0 }];
      }
      return { ...prev, garden: { ...prevGarden, trees: newTrees } };
    });
  };

  const handleUprootTree = (treeId) => {
    updateTraction(prev => {
      const prevGarden = prev.garden || { trees: [] };
      const newTrees = [];
      for (const tree of prevGarden.trees) {
        newTrees.push(tree.id === treeId ? { ...tree, planted: false } : tree);
      }
      return {
        ...prev,
        garden: { ...prevGarden, trees: newTrees }
      };
    });
  };

  const handleCalSync = async () => {
    if (!user) return;
    setCalSyncStatus('syncing');
    setCalSyncError('');
    try {
      // Map garden data to calendarService format
      const calGarden = {
        trees: garden.trees.filter(t => t.planted).map(t => ({
          id: t.id === 'breath' ? 'daily-practice' : t.id === 'night-gate' ? 'evening-wind-down' : t.id,
        })),
        nightGateTime: garden.trees.find(t => t.id === 'night-gate')?.time || '22:30',
      };
      await syncPracticeGardenToCalendar(
        calGarden,
        traction?.commitmentTier || 'Committed',
        user.email
      );
      setCalSyncStatus('success');
    } catch (err) {
      setCalSyncError(err.message || 'Calendar sync failed');
      setCalSyncStatus('error');
    }
  };

  return (
    <div className="p-6 text-[#e8edf2] font-body">
      <div className="mb-6 text-center">
        <h2 className="font-heading text-[2rem] text-[#34d399] m-0 mb-2">Your Practice Garden</h2>
        <p className="font-mono text-[0.85rem] text-[#a0aab8] m-0">Plant a tree to build a habit. One at a time.</p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
        {TREES.map(treeDef => {
          const isUnlocked = currentFret >= treeDef.unlockFret;
          const userTree = garden.trees.find(t => t.id === treeDef.id) || {};
          const isPlanted = !!userTree.planted;

          return (
            <div
              key={treeDef.id}
              className={`bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 flex flex-col items-center text-center transition-all duration-300 ${isPlanted ? '' : ''} ${!isUnlocked ? 'opacity-50' : ''}`}
              style={{
                background: isPlanted ? 'rgba(52,211,153,0.05)' : 'rgba(255,255,255,0.03)',
                borderColor: isPlanted ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.08)',
              }}
            >
              <div className="text-[3rem] mb-3">{treeDef.icon}</div>
              <h3 className="text-[1.2rem] font-semibold m-0 mb-2 text-vv-text">{treeDef.name}</h3>
              <p className="text-[0.85rem] text-white/60 m-0 mb-4 leading-[1.4]">{treeDef.desc}</p>

              {!isUnlocked ? (
                <div className="font-mono text-[0.75rem] text-amber-400 py-2 px-3 bg-amber-400/10 rounded-lg mt-auto">🔒 Unlocks at Fret {treeDef.unlockFret}</div>
              ) : isPlanted ? (
                <div className="mt-auto w-full flex flex-col gap-2">
                  <div className="font-mono text-[0.75rem] text-[#34d399] tracking-[0.1em]">Stage: {userTree.growthStage?.toUpperCase() || 'SPROUT'}</div>
                  {treeDef.defaultTime && (
                    <div className="text-[0.85rem] text-[#a0aab8]">
                      Time: <strong>{userTree.time}</strong>
                    </div>
                  )}
                  <button className="py-1.5 px-3 bg-transparent border border-white/20 rounded-lg text-white/60 cursor-pointer text-[0.75rem] mt-1 hover:bg-white/[0.05] transition-colors" onClick={() => handleUprootTree(treeDef.id)}>Uproot (Pause)</button>
                </div>
              ) : (
                <div className="mt-auto w-full flex flex-col gap-2">
                  {treeDef.defaultTime ? (
                    <div className="flex gap-2 w-full">
                      <input
                        type="time"
                        id={`time-${treeDef.id}`}
                        defaultValue={treeDef.defaultTime}
                        className="flex-1 bg-black/20 border border-white/10 text-white rounded-lg py-2 px-2 font-mono text-[0.85rem] outline-none"
                      />
                      <button
                        className="py-2 px-4 bg-[#34d399] text-black border-none rounded-lg font-semibold cursor-pointer shrink-0 hover:bg-[#34d399]/90 transition-colors"
                        onClick={() => {
                          const val = document.getElementById(`time-${treeDef.id}`).value;
                          handlePlantTree(treeDef.id, val);
                        }}
                      >
                        Plant
                      </button>
                    </div>
                  ) : (
                    <button
                      className="py-2 px-4 bg-[#34d399] text-black border-none rounded-lg font-semibold cursor-pointer shrink-0 hover:bg-[#34d399]/90 transition-colors"
                      onClick={() => handlePlantTree(treeDef.id, null)}
                    >
                      Plant
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Sync to Google Calendar ── */}
      {garden.trees.some(t => t.planted) && (
        <div className="mt-6 text-center py-4 border-t border-white/[0.06]">
          {!user ? (
            <p className="text-[0.8rem] text-white/40 italic m-0">Sign in with Google to sync your practice habits to your calendar.</p>
          ) : calSyncStatus === 'success' ? (
            <div className="py-3 px-4 bg-[#34d399]/[0.08] border border-[#34d399]/20 rounded-[10px] text-[#34d399] text-[0.85rem]">
              <span>✅ Practice reminders synced to Google Calendar!</span>
            </div>
          ) : calSyncStatus === 'error' ? (
            <div className="py-3 px-4 bg-red-400/[0.08] border border-red-400/20 rounded-[10px] text-[#f87171] text-[0.85rem] flex flex-col items-center gap-2">
              <span>⚠️ {calSyncError}</span>
              <button className="py-3 px-6 bg-blue-400/10 border border-blue-400/25 rounded-xl text-[#60a5fa] cursor-pointer font-mono text-[0.8rem] font-semibold tracking-[0.05em] transition-all duration-200 hover:bg-blue-400/20" onClick={handleCalSync}>Retry</button>
            </div>
          ) : (
            <button
              className="py-3 px-6 bg-blue-400/10 border border-blue-400/25 rounded-xl text-[#60a5fa] cursor-pointer font-mono text-[0.8rem] font-semibold tracking-[0.05em] transition-all duration-200 hover:bg-blue-400/20 disabled:opacity-50"
              onClick={handleCalSync}
              disabled={calSyncStatus === 'syncing'}
            >
              {calSyncStatus === 'syncing' ? '⏳ Syncing...' : '📅 Sync to Google Calendar'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
