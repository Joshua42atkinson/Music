// ═══════════════════════════════════════════════════════════
// GOOGLE DRIVE SYNC — Save/Load Voix Vive state
// ═══════════════════════════════════════════════════════════

import { GOOGLE_API_BASE, DRIVE_FILE_NAME, DRIVE_MIME_TYPE } from '../config/google';

/** Upload (or overwrite) save data to Google Drive */
export async function uploadSaveToDrive(accessToken, data) {
  const metadata = {
    name: DRIVE_FILE_NAME,
    mimeType: DRIVE_MIME_TYPE,
  };

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelim = `\r\n--${boundary}--`;

  const body =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    JSON.stringify(data) +
    closeDelim;

  const res = await fetch(`${GOOGLE_API_BASE}/upload/drive/v3/files?uploadType=multipart`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary="${boundary}"`,
    },
    body,
  });

  if (!res.ok) throw new Error(`Drive upload failed: ${res.status}`);
  return res.json();
}

/** Find existing save file in Drive */
export async function findSaveInDrive(accessToken) {
  const query = encodeURIComponent(`name='${DRIVE_FILE_NAME}' and trashed=false`);
  const res = await fetch(`${GOOGLE_API_BASE}/drive/v3/files?q=${query}&spaces=appDataFolder`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) throw new Error(`Drive search failed: ${res.status}`);
  const data = await res.json();
  return data.files?.[0] || null;
}

/** Download save data from Drive */
export async function downloadSaveFromDrive(accessToken, fileId) {
  const res = await fetch(`${GOOGLE_API_BASE}/drive/v3/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) throw new Error(`Drive download failed: ${res.status}`);
  return res.json();
}
