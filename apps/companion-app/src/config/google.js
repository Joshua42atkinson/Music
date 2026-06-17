// ═══════════════════════════════════════════════════════════
// GOOGLE CONFIG — OAuth + API Scopes
// Set VITE_GOOGLE_CLIENT_ID in your .env file.
// Get one at: https://console.cloud.google.com/apis/credentials
// ═══════════════════════════════════════════════════════════

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export const GOOGLE_SCOPES = {
  // Minimal — only files created by this app
  drive: 'https://www.googleapis.com/auth/drive.file',
  // Read/write calendars
  calendar: 'https://www.googleapis.com/auth/calendar',
  // Basic profile + email (always included)
  profile: 'openid email profile',
};

export const GOOGLE_API_BASE = 'https://www.googleapis.com';

export const DRIVE_FILE_NAME = 'voix-vive-save.json';
export const DRIVE_MIME_TYPE = 'application/json';

export function hasGoogleClientId() {
  return GOOGLE_CLIENT_ID.length > 0 && !GOOGLE_CLIENT_ID.includes('YOUR_');
}
