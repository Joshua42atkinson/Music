// ═══════════════════════════════════════════════════════════
// GOOGLE DRIVE SERVICE — Student-owned video storage
// Uses Google OAuth token from Supabase session.
// Videos live in student Drive (free), shared with mentor.
// Supabase stores only metadata (file IDs, not bytes).
// ═══════════════════════════════════════════════════════════

const MENTOR_EMAIL = import.meta.env.VITE_MENTOR_EMAIL || 'joshua42atkinson@gmail.com';
const DRIVE_FOLDER_NAME = 'Voix Vive Submissions';

// ── Get Google access token from Supabase session ──
async function getGoogleToken() {
  const { supabase } = await import('./supabase.js');
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  // provider_token is the Google OAuth access token
  return session?.provider_token || null;
}

// ── Generic Drive API fetch wrapper ──
async function driveFetch(endpoint, options = {}) {
  const token = await getGoogleToken();
  if (!token) throw new Error('No Google Drive token available. Re-authenticate with Google.');

  const res = await fetch(`https://www.googleapis.com/drive/v3${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Drive API error: ${res.status}`);
  }
  return res.json();
}

// ═══════════════════════════════════════════════════════════
// FOLDER MANAGEMENT
// ═══════════════════════════════════════════════════════════

/**
 * Find or create the student's Voix Vive submissions folder.
 * Returns the folder ID.
 */
export async function getOrCreateSubmissionsFolder() {
  // 1. Search for existing folder
  const search = await driveFetch(
    `/files?q=${encodeURIComponent(
      `mimeType='application/vnd.google-apps.folder' and name='${DRIVE_FOLDER_NAME}' and trashed=false`
    )}&spaces=drive`
  );

  if (search.files?.length > 0) {
    return search.files[0].id;
  }

  // 2. Create new folder
  const folder = await driveFetch('/files', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: DRIVE_FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder',
      description: 'Practice videos and submissions for Voix Vive guitar lessons',
    }),
  });

  // 3. Share with mentor
  await shareWithMentor(folder.id);

  return folder.id;
}

/**
 * Share a Drive file/folder with the mentor email.
 */
export async function shareWithMentor(fileId, role = 'writer') {
  return driveFetch(`/files/${fileId}/permissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'user',
      role,
      emailAddress: MENTOR_EMAIL,
      sendNotificationEmail: false,
    }),
  });
}

// ═══════════════════════════════════════════════════════════
// VIDEO UPLOAD
// ═══════════════════════════════════════════════════════════

/**
 * Upload a video Blob to Google Drive inside the Voix Vive folder.
 * Returns { fileId, webViewLink, webContentLink }.
 */
export async function uploadVideo(blob, metadata = {}) {
  const folderId = await getOrCreateSubmissionsFolder();

  const { fretId, entryType = 'practice', emotionalState } = metadata;
  const timestamp = new Date().toISOString();
  const fileName = metadata.fileName || `voix-vive-${entryType}-fret${fretId || 'x'}-${Date.now()}.webm`;

  // Build multipart upload (metadata + media)
  const boundary = '-------voix-vive-boundary';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadataJson = JSON.stringify({
    name: fileName,
    parents: [folderId],
    description: JSON.stringify({
      fretId,
      entryType,
      emotionalState,
      uploadedAt: timestamp,
      app: 'voix-vive',
    }),
  });

  const body = new Blob([
    delimiter,
    'Content-Type: application/json; charset=UTF-8\r\n\r\n',
    metadataJson,
    delimiter,
    'Content-Type: video/webm\r\n\r\n',
    blob,
    closeDelimiter,
  ]);

  const token = await getGoogleToken();
  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body,
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Upload failed: ${res.status}`);
  }

  const file = await res.json();

  // Get sharing links
  const links = await driveFetch(`/files/${file.id}?fields=webViewLink,webContentLink`);

  return {
    fileId: file.id,
    webViewLink: links.webViewLink,
    webContentLink: links.webContentLink,
    folderId,
    fileName,
    uploadedAt: timestamp,
  };
}

// ═══════════════════════════════════════════════════════════
// LISTING & REVIEW
// ═══════════════════════════════════════════════════════════

/**
 * List all videos in the student's Voix Vive folder.
 */
export async function listStudentVideos() {
  const folderId = await getOrCreateSubmissionsFolder();
  const result = await driveFetch(
    `/files?q=${encodeURIComponent(
      `'${folderId}' in parents and mimeType contains 'video/' and trashed=false`
    )}&fields=files(id,name,createdTime,webViewLink,description)&orderBy=createdTime desc`
  );

  return (result.files || []).map(f => {
    let meta = {};
    try { meta = JSON.parse(f.description); } catch {}
    return {
      fileId: f.id,
      fileName: f.name,
      webViewLink: f.webViewLink,
      createdTime: f.createdTime,
      ...meta,
    };
  });
}

/**
 * For mentors: list all files shared with them.
 * (Requires separate mentor auth or server-side with service account.)
 * For now, we store metadata in Supabase for the mentor view.
 */

// ═══════════════════════════════════════════════════════════
// SUPABASE METADATA SYNC
// ═══════════════════════════════════════════════════════════

import { supabase } from './supabase.js';

/**
 * After uploading to Drive, save metadata to Supabase.
 * This is the "index" that both student and mentor query.
 */
export async function saveVideoMetadata(userId, driveData, extra = {}) {
  if (!supabase) return null;
  const { data, error } = await supabase.from('video_submissions').insert({
    user_id: userId,
    drive_file_id: driveData.fileId,
    drive_folder_id: driveData.folderId,
    file_name: driveData.fileName,
    web_view_link: driveData.webViewLink,
    fret_id: extra.fretId || null,
    entry_type: extra.entryType || 'practice',
    emotional_state: extra.emotionalState || null,
    reviewed: false,
    mentor_notes: null,
    created_at: driveData.uploadedAt,
  });
  if (error) throw error;
  return data;
}

/**
 * Get all submissions for a user (student view).
 */
export async function getUserSubmissions(userId) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('video_submissions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

/**
 * Get all submissions for mentor review.
 */
export async function getMentorSubmissions() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('video_submissions')
    .select('*, profiles(display_name)')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw error;
  return data || [];
}

/**
 * Mark a submission as reviewed with mentor notes.
 */
export async function markReviewed(submissionId, notes) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('video_submissions')
    .update({ reviewed: true, mentor_notes: notes, reviewed_at: new Date().toISOString() })
    .eq('id', submissionId);
  if (error) throw error;
  return data;
}
