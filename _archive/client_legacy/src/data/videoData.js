// Master content index — combines all 3 video data files and provides utility functions.

import impactStages from './impactData';
import authorityStages from './authorityData';
import selfStages from './selfData';

const STAGE_DATA = {
  impact: impactStages,
  authority: authorityStages,
  'the-self': selfStages,
};

/**
 * Get a specific stage's rich data.
 * @param {string} videoId - 'impact', 'authority', or 'the-self'
 * @param {number} stageNumber - 1-12
 * @returns {Object|null} The stage data object, or null if not found
 */
export function getStage(videoId, stageNumber) {
  const stages = STAGE_DATA[videoId];
  if (!stages) return null;
  return stages.find(s => s.number === stageNumber) || null;
}

/**
 * Get all stages for a video.
 * @param {string} videoId
 * @returns {Array} Array of stage data objects
 */
export function getVideoStages(videoId) {
  return STAGE_DATA[videoId] || [];
}

/**
 * Get the next video in sequence.
 * @param {string} videoId
 * @returns {string|null} Next video ID or null if at the end
 */
export function getNextVideoId(videoId) {
  const order = ['impact', 'authority', 'the-self'];
  const idx = order.indexOf(videoId);
  return idx < 2 ? order[idx + 1] : null;
}

/**
 * Get the previous video in sequence.
 * @param {string} videoId
 * @returns {string|null} Previous video ID or null if at the start
 */
export function getPrevVideoId(videoId) {
  const order = ['impact', 'authority', 'the-self'];
  const idx = order.indexOf(videoId);
  return idx > 0 ? order[idx - 1] : null;
}

export { STAGE_DATA };
export default STAGE_DATA;
