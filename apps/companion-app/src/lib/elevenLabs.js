import { devWarn, devLog, devError } from './devLog';

// ╔══ VOIX VIVE ════════════════════════════════════════════════════╗
// ║ FILE    : elevenLabs.js                                        ║
// ║ WHAT    : Handles text-to-speech utilizing ElevenLabs API      ║
// ║ WHY     : To give Truebadour Bertrand's cloned voice!          ║
// ║ WHO     : useTruebadourChat (TTS playback pipeline)            ║
// ╚════════════════════════════════════════════════════════════════╝

/**
 * Fetches an audio blob from ElevenLabs for the given text.
 * Requires VITE_ELEVENLABS_API_KEY and VITE_ELEVENLABS_VOICE_ID in .env
 * 
 * @param {string} text - The text to synthesize
 * @returns {Promise<Blob|null>} - The resulting mp3 audio blob, or null if failed
 */
export async function fetchElevenLabsAudio(text) {
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  const voiceId = import.meta.env.VITE_ELEVENLABS_VOICE_ID;

  if (!apiKey || !voiceId) {
    return null;
  }

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      devError('[ElevenLabs] Failed to synthesize audio', response.statusText);
      return null;
    }

    const blob = await response.blob();
    return blob;
  } catch (err) {
    devError('[ElevenLabs] Error connecting to API:', err);
    return null;
  }
}
