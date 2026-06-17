import { useEffect, useRef, useState } from 'react';
import { vvGet, vvSetJSON, vvRemove } from '../lib/storage';
import { devLog, devWarn } from '../lib/devLog';

// Auto-save hook for user inputs
// Saves data to localStorage with debouncing
export function useAutoSave(key, data, delay = 1000) {
  const timeoutRef = useRef(null);
  const lastSaveRef = useRef(null);

  useEffect(() => {
    // Don't save if data hasn't changed
    if (JSON.stringify(data) === JSON.stringify(lastSaveRef.current)) {
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(() => {
      try {
        vvSetJSON(key, data);
        lastSaveRef.current = data;
        devLog(`[AutoSave] Saved data to ${key}`);
      } catch (error) {
        devWarn(`[AutoSave] Failed to save to ${key}:`, error);
      }
    }, delay);

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [key, data, delay]);

  // Force save function for immediate save
  const forceSave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    try {
      vvSetJSON(key, data);
      lastSaveRef.current = data;
      devLog(`[AutoSave] Force saved data to ${key}`);
    } catch (error) {
      devWarn(`[AutoSave] Failed to force save to ${key}:`, error);
    }
  };

  return { forceSave };
}

// Load auto-saved data from localStorage
export function loadAutoSave(key, defaultValue = null) {
  try {
    const saved = vvGet(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    devWarn(`[AutoSave] Failed to load from ${key}:`, error);
    return defaultValue;
  }
}

// Clear auto-saved data
export function clearAutoSave(key) {
  try {
    vvRemove(key);
    devLog(`[AutoSave] Cleared data from ${key}`);
  } catch (error) {
    devWarn(`[AutoSave] Failed to clear ${key}:`, error);
  }
}

// Hook for form inputs with auto-save
export function useAutoSaveForm(formKey, initialData = {}) {
  const [formData, setFormData] = useState(() => 
    loadAutoSave(formKey, initialData)
  );
  
  const { forceSave } = useAutoSave(formKey, formData);

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateFields = (updates) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }));
  };

  const resetForm = () => {
    setFormData(initialData);
    clearAutoSave(formKey);
  };

  return {
    formData,
    setFormData,
    updateField,
    updateFields,
    resetForm,
    forceSave
  };
}
