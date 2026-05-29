import { db } from './localDatabase';

/**
 * Export all localStorage state and IndexedDB tables to a single .voixvive file
 */
export async function exportVoixViveFile(studentName = 'adventurer') {
  try {
    const saveState = {
      version: 2,
      timestamp: new Date().toISOString(),
      localStorage: {
        bard_traction: localStorage.getItem('bard_traction'),
        voix_vive_dag_progress: localStorage.getItem('voix_vive_dag_progress'),
        voix_vive_adventure_session: localStorage.getItem('voix_vive_adventure_session'),
        active_student_profile: localStorage.getItem('active_student_profile'),
      },
      indexedDB: {}
    };

    // Extract all IndexedDB tables
    for (const table of db.tables) {
      saveState.indexedDB[table.name] = await table.toArray();
    }

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
    console.error("[VoixVive] Export failed:", err);
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
          if (saveState.localStorage.bard_traction) localStorage.setItem('bard_traction', saveState.localStorage.bard_traction);
          if (saveState.localStorage.voix_vive_dag_progress) localStorage.setItem('voix_vive_dag_progress', saveState.localStorage.voix_vive_dag_progress);
          if (saveState.localStorage.voix_vive_adventure_session) localStorage.setItem('voix_vive_adventure_session', saveState.localStorage.voix_vive_adventure_session);
          if (saveState.localStorage.active_student_profile) localStorage.setItem('active_student_profile', saveState.localStorage.active_student_profile);
          
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
        } 
        // Handle CharacterSheet v1 format
        else if (saveState.bard_traction !== undefined) {
          if (saveState.bard_traction) localStorage.setItem('bard_traction', saveState.bard_traction);
          if (saveState.voix_vive_dag_progress) localStorage.setItem('voix_vive_dag_progress', saveState.voix_vive_dag_progress);
          if (saveState.voix_vive_adventure_session) localStorage.setItem('voix_vive_adventure_session', saveState.voix_vive_adventure_session);
        }
        // Handle TroubadourWidget v0 format (raw traction object)
        else if (saveState.frets) {
          localStorage.setItem('bard_traction', JSON.stringify(saveState));
        } else {
          throw new Error('Unrecognized save format');
        }
        
        resolve(true);
      } catch (err) {
        console.error("[VoixVive] Import failed:", err);
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
