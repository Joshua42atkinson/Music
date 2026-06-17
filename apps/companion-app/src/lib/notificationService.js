// ═══════════════════════════════════════════════════════════
// NOTIFICATION SERVICE
// 
// Handles transactional emails for the Async Coaching Pipeline.
// Calls the send-email Supabase Edge Function under the hood.
// ═══════════════════════════════════════════════════════════

import { supabase } from './supabase';
import { devLog, devWarn } from './devLog';
import { vvGet } from './storage';
import { STORAGE_KEYS } from './storageKeys';

/**
 * Sends an email to Bertrand when a student submits a new practice video.
 * @param {Object} submission - The submission details
 * @param {Object} user - The student who submitted
 */
export async function sendSubmissionEmail(submission, user) {
  devLog(`[NotificationService] Emailing Bertrand about new submission from ${user?.email || 'Student'}`);
  
  if (!supabase) {
    devLog(`[NotificationService] Offline/Mock: Bertrand email submission logged.`);
    return Promise.resolve({ success: true, mocked: true });
  }

  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        type: 'submission',
        submissionId: submission.id,
        exerciseName: submission.exerciseName || 'Practice Recording',
        fretId: submission.fretId || submission.fret_id,
        studentName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student',
        studentId: user.id,
        locale: vvGet(STORAGE_KEYS.LOCALE) || 'en'
      }
    });
    if (error) throw error;
    return data || { success: true };
  } catch (err) {
    devWarn('[NotificationService] sendSubmissionEmail failed:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Sends an email to the student when Bertrand has reviewed their video.
 * @param {Object} submission - The original submission
 * @param {Object} user - The student who submitted
 * @param {string} feedbackNotes - Text notes from Bertrand
 * @param {string|null} mentorVideoLink - Link to mentor video response (if any)
 */
export async function sendReviewEmail(submission, user, feedbackNotes, mentorVideoLink) {
  devLog(`[NotificationService] Emailing student (${user?.email || user?.display_name || 'Student'}) that their review is ready.`);
  
  if (!supabase) {
    devLog(`[NotificationService] Offline/Mock: Student email review logged.`);
    return Promise.resolve({ success: true, mocked: true });
  }

  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        type: 'review',
        submissionId: submission.id,
        exerciseName: submission.exercise_name || submission.exerciseName || submission.file_name || 'Practice Recording',
        fretId: submission.fret_id || submission.fretId,
        studentName: user?.display_name || user?.full_name || user?.name || 'Student',
        studentId: submission.user_id || submission.studentId || user?.id,
        feedbackNotes,
        mentorVideoLink: typeof mentorVideoLink === 'string' ? mentorVideoLink : null,
        locale: vvGet(STORAGE_KEYS.LOCALE) || 'en'
      }
    });
    if (error) throw error;
    return data || { success: true };
  } catch (err) {
    devWarn('[NotificationService] sendReviewEmail failed:', err);
    return { success: false, error: err.message };
  }
}
