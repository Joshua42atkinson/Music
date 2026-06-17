import { supabase } from './supabase';
import { db } from '../data/localDatabase';

/**
 * Request a pre-signed PUT upload URL from the Supabase Edge Function.
 */
export async function getPresignedUrl(fileName, contentType) {
  if (!supabase) {
    throw new Error('Supabase client is not initialized.');
  }

  const { data, error } = await supabase.functions.invoke('r2-presigned-url', {
    body: { fileName, contentType },
  });

  if (error) {
    throw new Error(`Failed to invoke r2-presigned-url function: ${error.message}`);
  }

  return data; // returns { uploadUrl, publicUrl, fileKey }
}

/**
 * Upload a binary blob directly to Cloudflare R2 using a pre-signed URL.
 */
export async function uploadBlobToR2(blob, fileName, contentType) {
  const { uploadUrl, publicUrl, fileKey } = await getPresignedUrl(fileName, contentType);

  const response = await fetch(uploadUrl, {
    method: 'PUT',
    body: blob,
    headers: {
      'Content-Type': contentType,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to upload blob to R2: ${response.statusText}`);
  }

  return { publicUrl, fileKey };
}

/**
 * Record a successful R2 submission to the Supabase submissions table.
 */
export async function saveR2SubmissionMetadata(userId, { exerciseName, videoUrl, duration }) {
  if (!supabase) return null;

  // Attempt to fetch user's student profile to link the profile ID
  let studentProfileId = null;
  try {
    const { data: profile } = await supabase
      .from('student_profiles')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();
    if (profile) studentProfileId = profile.id;
  } catch (err) {
    console.warn('[R2Service] Could not retrieve student profile ID:', err);
  }

  const { data, error } = await supabase
    .from('submissions')
    .insert({
      user_id: userId,
      student_profile_id: studentProfileId,
      exercise_name: exerciseName,
      video_url: videoUrl,
      duration: Math.round(duration),
      reviewed: false,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Process all items currently queued in IndexedDB outbox and sync them to R2.
 */
export async function syncOutboxToR2(userId) {
  if (!supabase || !userId) {
    console.warn('[R2Service] Sync aborted: missing Supabase client or userId.');
    return { success: false, syncedCount: 0 };
  }

  try {
    const queuedItems = await db.outbox
      .where('status')
      .equals('queued')
      .toArray();

    if (queuedItems.length === 0) {
      return { success: true, syncedCount: 0 };
    }

    console.log(`[R2Service] Found ${queuedItems.length} queued items to sync to R2...`);
    let syncedCount = 0;

    for (const item of queuedItems) {
      try {
        // Mark as syncing in local DB
        await db.outbox.update(item.id, { status: 'syncing' });

        const ext = item.mediaType === 'audio' ? 'webm' : 'webm';
        const contentType = item.mediaType === 'audio' ? 'audio/webm' : 'video/webm';
        const fileName = `outbox-sync-${item.id}-${Date.now()}.${ext}`;

        // 1. Upload the raw blob to R2
        const { publicUrl } = await uploadBlobToR2(item.blob, fileName, contentType);

        // 2. Save metadata to Supabase
        await saveR2SubmissionMetadata(userId, {
          exerciseName: item.fretId || 'Practice Sync',
          videoUrl: publicUrl,
          duration: item.duration || 0,
        });

        // 3. Mark as synced or delete from local outbox queue
        await db.outbox.update(item.id, { status: 'synced' });
        
        // Also update local recordings metadata state if matched
        if (item.submissionId) {
          const rec = await db.recordings.where('timestamp').equals(item.timestamp).first();
          if (rec) {
            await db.recordings.update(rec.id, {
              blobUrl: publicUrl,
              reviewed: false,
            });
          }
        }

        // Delete from outbox once successfully sent to free space
        await db.outbox.delete(item.id);
        syncedCount++;

      } catch (err) {
        console.error(`[R2Service] Failed to sync outbox item ${item.id}:`, err);
        // Revert status to queued for next retry
        await db.outbox.update(item.id, { status: 'queued' });
      }
    }

    return { success: true, syncedCount };

  } catch (err) {
    console.error('[R2Service] Error syncing outbox:', err);
    return { success: false, syncedCount: 0 };
  }
}
