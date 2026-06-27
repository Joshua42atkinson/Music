import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
import { app } from "./firebase";
import { devLog, devWarn } from "./devLog";

let aiInstance = null;
let isAiAvailable = false;

try {
  // Initialize AI using the existing Firebase App
  aiInstance = getAI(app, { backend: new GoogleAIBackend() });
  isAiAvailable = true;
  devLog("firebaseAI", "Firebase AI initialized successfully");
} catch (error) {
  devWarn("[Firebase AI] Initialization failed:", error);
}

/**
 * Returns an instance of the generative model configured for the companion app.
 * By default, uses gemini-2.5-flash which provides the best balance of speed and reasoning.
 */
export function getCompanionModel(modelName = "gemini-2.5-flash", systemInstruction = null) {
  if (!isAiAvailable) {
    devWarn("[Firebase AI] Cannot get model, AI is not initialized.");
    return null;
  }

  try {
    const config = {};
    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }
    
    return getGenerativeModel(aiInstance, { 
      model: modelName,
      ...config,
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
      }
    });
  } catch (error) {
    devWarn(`[Firebase AI] Failed to get model ${modelName}:`, error);
    return null;
  }
}

export { aiInstance, isAiAvailable };
