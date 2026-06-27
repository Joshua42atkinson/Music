// ═══════════════════════════════════════════════════════════
// YOUTUBE SERVICE — Client-Side Chunked Video Uploads
// Uses Google OAuth token from local storage to upload 
// practice videos directly to YouTube (Unlisted) for the 
// Peer Community integration.
// ═══════════════════════════════════════════════════════════

import { vvGetJSON } from './storage';
import { STORAGE_KEYS } from './storageKeys';
import { devWarn } from './devLog';

// ── Get Google access token from local storage ──
async function getGoogleToken() {
  const tokenData = vvGetJSON(STORAGE_KEYS.GOOGLE_TOKEN, null);
  if (tokenData?.access_token && tokenData?.expires_at > Date.now()) {
    return tokenData.access_token;
  }
  return null;
}

/**
 * Uploads a video Blob to YouTube using the Resumable Upload protocol.
 * @param {Blob} videoBlob - The video file to upload.
 * @param {Object} metadata - { title, description, tags, categoryId }
 * @param {Function} onProgress - Callback for upload progress (0-100).
 * @returns {Promise<string>} The YouTube Video ID
 */
export async function uploadToYouTube(videoBlob, metadata = {}, onProgress = null) {
  const token = await getGoogleToken();
  if (!token) {
    throw new Error('No Google token available. Re-authenticate with YouTube scope.');
  }

  const {
    title = `Practice Session - ${new Date().toLocaleDateString()}`,
    description = 'Uploaded via Voix Vive Companion App.',
    tags = ['voix-vive', 'guitar', 'practice'],
    categoryId = '22' // 22 = People & Blogs, 10 = Music
  } = metadata;

  const metadataJson = {
    snippet: {
      title,
      description,
      tags,
      categoryId
    },
    status: {
      privacyStatus: 'unlisted',
      embeddable: true,
      selfDeclaredMadeForKids: false
    }
  };

  // 1. Initialize Resumable Upload Session
  const initRes = await fetch(
    'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Upload-Content-Length': videoBlob.size.toString(),
        'X-Upload-Content-Type': videoBlob.type || 'video/webm'
      },
      body: JSON.stringify(metadataJson)
    }
  );

  if (!initRes.ok) {
    const err = await initRes.json().catch(() => ({}));
    throw new Error(err.error?.message || `YouTube Init Upload failed: ${initRes.status}`);
  }

  const uploadUrl = initRes.headers.get('Location');
  if (!uploadUrl) {
    throw new Error('No upload URL returned from YouTube API.');
  }

  // 2. Upload the Video Bytes (Chunked Upload)
  // For small videos (< 50MB), we can upload in one chunk.
  // For production, a robust 5MB chunking loop should be used.
  const chunkSize = 5 * 1024 * 1024; // 5MB chunks
  let start = 0;
  
  while (start < videoBlob.size) {
    const end = Math.min(start + chunkSize, videoBlob.size);
    const chunk = videoBlob.slice(start, end);
    
    const chunkRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Range': `bytes ${start}-${end - 1}/${videoBlob.size}`
      },
      body: chunk
    });

    if (chunkRes.status === 308) {
      // 308 Resume Incomplete
      if (onProgress) {
        onProgress(Math.round((end / videoBlob.size) * 100));
      }
      start = end;
    } else if (chunkRes.ok || chunkRes.status === 200 || chunkRes.status === 201) {
      // Done!
      if (onProgress) onProgress(100);
      const data = await chunkRes.json();
      return data.id; // Return the video ID
    } else {
      const err = await chunkRes.json().catch(() => ({}));
      throw new Error(err.error?.message || `YouTube Chunk Upload failed: ${chunkRes.status}`);
    }
  }

  throw new Error('Upload completed but no video ID returned.');
}
