// ═══════════════════════════════════════════════════════════
// SCHEDULING SERVICE — Async review queue & workload guard
// Prevents mentor flooding. Offers text-back alternative.
// ═══════════════════════════════════════════════════════════

import { supabase } from './supabase.js';

const MENTOR_MAX_QUEUE = 10; // Max unreviewed submissions before "workload full"
const TEXT_BACK_PRICE_CENTS = 500; // $5.00

/**
 * Get current mentor workload (unreviewed submissions count).
 */
export async function getMentorWorkload() {
  if (!supabase) return { count: 0, full: false };
  const { count, error } = await supabase
    .from('video_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('reviewed', false);
  if (error) throw error;
  return {
    count: count || 0,
    full: (count || 0) >= MENTOR_MAX_QUEUE,
    max: MENTOR_MAX_QUEUE,
  };
}

/**
 * Get student's position in the review queue.
 */
export async function getQueuePosition(userId) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('video_submissions')
    .select('id, created_at')
    .eq('reviewed', false)
    .order('created_at', { ascending: true });
  if (error) throw error;
  const pos = data?.findIndex(s => s.user_id === userId);
  return pos >= 0 ? pos + 1 : null;
}

/**
 * Request a text-back (quick text response, $5).
 * Stores in a separate table for mentor to process.
 */
export async function requestTextBack(userId, question) {
  if (!supabase) return null;
  const { data, error } = await supabase.from('text_back_requests').insert({
    user_id: userId,
    question: question.trim(),
    status: 'pending',
    price_cents: TEXT_BACK_PRICE_CENTS,
  });
  if (error) throw error;
  return data;
}

/**
 * Get text-back pricing.
 */
export function getTextBackPrice() {
  return TEXT_BACK_PRICE_CENTS;
}

/**
 * Check if mentor is accepting new async reviews.
 * Returns { canSubmit: boolean, message: string, alternative: 'text-back' | 'wait' }
 */
export async function checkSubmissionAvailability() {
  const workload = await getMentorWorkload();
  if (workload.full) {
    return {
      canSubmit: false,
      message: `Bertrand's review queue is full (${workload.count} pending). Estimated wait: 72+ hours.`,
      alternative: 'text-back',
    };
  }
  if (workload.count >= MENTOR_MAX_QUEUE * 0.7) {
    return {
      canSubmit: true,
      message: `Bertrand is busy (${workload.count} pending). Reviews may take 48-72 hours.`,
      alternative: null,
    };
  }
  return {
    canSubmit: true,
    message: `Bertrand typically reviews within 48 hours.`,
    alternative: null,
  };
}
