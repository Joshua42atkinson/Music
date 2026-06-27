import { devWarn } from '../lib/devLog';
import { useState, useEffect } from 'react';
import { vvGet, vvSetJSON, vvRemove } from '../lib/storage';
import { STORAGE_KEYS } from '../lib/storageKeys';

const INBOX_KEY = STORAGE_KEYS.TRUEBADOUR_INBOX;

export function useTruebadourInbox() {
  const [inbox, setInbox] = useState([]);

  // Load on mount
  useEffect(() => {
    try {
      const saved = vvGet(INBOX_KEY);
      if (saved) {
        setInbox(JSON.parse(saved));
      }
    } catch (err) {
      devWarn('Failed to load Truebadour inbox:', err);
    }
  }, []);

  // Save to local storage whenever it changes
  useEffect(() => {
    try {
      vvSetJSON(INBOX_KEY, inbox);
    } catch (err) {
      devWarn('Failed to save Truebadour inbox:', err);
    }
  }, [inbox]);

  /**
   * Add a new submission to the inbox
   * @param {string} prompt - The student's text or recording note
   * @returns {string} The ID of the new submission
   */
  const addSubmission = (prompt) => {
    const id = Date.now().toString();
    const newSubmission = {
      id,
      prompt,
      status: 'pending', // 'pending' | 'ready'
      response: null,
      timestamp: Date.now(),
    };
    setInbox(prev => [newSubmission, ...prev]);
    return id;
  };

  /**
   * Update a submission with the AI's response
   * @param {string} id - The submission ID
   * @param {string} response - The text response
   */
  const completeReview = (id, response) => {
    setInbox(prev => prev.map(item => 
      item.id === id 
        ? { ...item, status: 'ready', response, reviewedAt: Date.now() }
        : item
    ));
  };

  /**
   * Clear the inbox
   */
  const clearInbox = () => {
    setInbox([]);
    vvRemove(INBOX_KEY);
  };

  return {
    inbox,
    addSubmission,
    completeReview,
    clearInbox
  };
}
