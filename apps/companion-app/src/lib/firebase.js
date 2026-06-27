// ═══════════════════════════════════════════════════════════
// FIREBASE ENGINE — Replaces Supabase
// Connects Voix Vive to the same backend as TRINITY XR
// ═══════════════════════════════════════════════════════════

import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent, isSupported } from "firebase/analytics";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { devLog, devWarn } from "./devLog";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let app;
let db;
let analytics;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  
  // Conditionally initialize analytics since it requires a browser environment
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
} catch (error) {
  devWarn("[Firebase] Initialization failed. Check env variables.", error);
}

export { app, db, analytics, logEvent };

export async function getTractionState(userId) {
  if (!db) return null;
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.state) {
        return JSON.parse(data.state);
      }
    }
    return null;
  } catch (error) {
    devWarn("[Firebase] Error fetching traction state:", error);
    return null;
  }
}

export async function saveTractionState(userId, stateObject) {
  if (!db) return null;
  try {
    const docRef = doc(db, "users", userId);
    const jsonState = JSON.stringify(stateObject);
    
    await setDoc(docRef, {
      state: jsonState,
      currentFret: stateObject.currentFret || 1,
      bardLevel: stateObject.bardLevel || 1,
      practiceMinutes: stateObject.practiceMinutes || 0,
      updated_at: serverTimestamp()
    }, { merge: true });
    
    devLog("[Firebase] Traction state saved to cloud.");
    return true;
  } catch (error) {
    devWarn("[Firebase] Error saving traction state:", error);
    return false;
  }
}

export async function migrateLocalToCloud(userId, stateObject) {
  return await saveTractionState(userId, stateObject);
}

// Stubbed auth helpers
export async function signInWithGoogle() { devWarn('Auth not implemented in this module'); }
export async function signOut() {}
export async function getCurrentUser() { return null; }
