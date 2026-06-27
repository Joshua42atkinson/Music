// ╔══ VOIX VIVE ════════════════════════════════════════════════════╗
// ║ FILE    : saveState.js                                         ║
// ║ WHAT    : Exports/imports the complete app state (localStorage, ║
// ║           IndexedDB, RAG vectors) as a portable .voixvive file  ║
// ║ WHY     : Lets students back up progress, migrate devices, or  ║
// ║           share learning journals without losing any data       ║
// ║ WHO     : student (triggered from Binder settings panel)       ║
// ║ OWNS    : All persisted app state — localStorage keys,         ║
// ║           IndexedDB tables via db, RAG store via exportRagData  ║
// ║ NEEDS   : db from ./localDatabase,                             ║
// ║           exportRagData / importRagData from ./ragStore         ║
// ║ RULES   : Never include API keys or auth tokens in export file. ║
// ║           Increment schema version on every format change.      ║
// ║ FIX AT  : Confirm db.tables defined + exportRagData resolves.  ║
// ║ STAGE   : IMPLEMENT                                            ║
// ╚════════════════════════════════════════════════════════════════╝
import { db } from './localDatabase';
import { exportRagData, importRagData } from './ragStore';
import { vvGet, vvSet } from '../lib/storage';
import { STORAGE_KEYS } from '../lib/storageKeys';
import { devError } from '../lib/devLog';

/**
 * Export all localStorage state and IndexedDB tables to a single .voixvive file
 */
export async function exportVoixViveFile(studentName = 'adventurer') {
  try {
    const saveState = {
      version: 2,
      timestamp: new Date().toISOString(),
      localStorage: {
        bard_traction: vvGet(STORAGE_KEYS.TRACTION),
        voix_vive_dag_progress: vvGet(STORAGE_KEYS.DAG_PROGRESS),
        voix_vive_adventure_session: vvGet(STORAGE_KEYS.ADVENTURE_SESSION),
        active_student_profile: vvGet(STORAGE_KEYS.ACTIVE_PROFILE),
      },
      indexedDB: {},
      ragDB: {}
    };

    // Extract all IndexedDB tables
    for (const table of db.tables) {
      saveState.indexedDB[table.name] = await table.toArray();
    }
    
    // Extract RAG vectors
    saveState.ragDB = await exportRagData();

    const blob = new Blob([JSON.stringify(saveState, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${studentName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_journal.voixvive`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    devError("[VoixVive] Export failed:", err);
    return false;
  }
}

/**
 * Import a .voixvive file and restore localStorage and IndexedDB
 */
export async function importVoixViveFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const saveState = JSON.parse(evt.target.result);
        
        // Handle v2 format (with IndexedDB)
        if (saveState.version >= 2 && saveState.localStorage) {
          if (saveState.localStorage.bard_traction) vvSet(STORAGE_KEYS.TRACTION, saveState.localStorage.bard_traction);
          if (saveState.localStorage.voix_vive_dag_progress) vvSet(STORAGE_KEYS.DAG_PROGRESS, saveState.localStorage.voix_vive_dag_progress);
          if (saveState.localStorage.voix_vive_adventure_session) vvSet(STORAGE_KEYS.ADVENTURE_SESSION, saveState.localStorage.voix_vive_adventure_session);
          if (saveState.localStorage.active_student_profile) vvSet(STORAGE_KEYS.ACTIVE_PROFILE, saveState.localStorage.active_student_profile);
          
          if (saveState.indexedDB) {
            for (const [tableName, records] of Object.entries(saveState.indexedDB)) {
              if (db[tableName]) {
                await db[tableName].clear();
                if (records.length > 0) {
                  await db[tableName].bulkAdd(records);
                }
              }
            }
          }
          if (saveState.ragDB) {
            await importRagData(saveState.ragDB);
          }
        } 
        // Handle CharacterSheet v1 format
        else if (saveState.bard_traction !== undefined) {
          if (saveState.bard_traction) vvSet(STORAGE_KEYS.TRACTION, saveState.bard_traction);
          if (saveState.voix_vive_dag_progress) vvSet(STORAGE_KEYS.DAG_PROGRESS, saveState.voix_vive_dag_progress);
          if (saveState.voix_vive_adventure_session) vvSet(STORAGE_KEYS.ADVENTURE_SESSION, saveState.voix_vive_adventure_session);
        }
        // Handle TruebadourWidget v0 format (raw traction object)
        else if (saveState.frets) {
          vvSet(STORAGE_KEYS.TRACTION, JSON.stringify(saveState));
        } else {
          throw new Error('Unrecognized save format');
        }
        
        resolve(true);
      } catch (err) {
        devError("[VoixVive] Import failed:", err);
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
