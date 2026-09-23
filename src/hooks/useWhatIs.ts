import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { WhatIsEntry } from '../types/whatis';
import { useCloudSyncedState } from './useCloudSync';

const STORAGE_KEY = 'mydayplan-whatis';

function loadWhatIs(): WhatIsEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return [];
}

function saveWhatIs(items: WhatIsEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('Failed to save:', e);
  }
}

export function useWhatIs() {
  const [entries, setEntries, resetCloud] = useCloudSyncedState<WhatIsEntry[]>(STORAGE_KEY, loadWhatIs, saveWhatIs);

  const addEntry = useCallback((data: Omit<WhatIsEntry, 'id' | 'createdAt'>) => {
    setEntries(prev => [{ ...data, id: uuidv4(), createdAt: new Date().toISOString() }, ...prev]);
  }, [setEntries]);

  const updateEntry = useCallback((id: string, updates: Partial<WhatIsEntry>) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  }, [setEntries]);

  const deleteEntry = useCallback((id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  }, [setEntries]);

  const resetWhatIs = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    resetCloud();
    setEntries([]);
  }, [resetCloud, setEntries]);

  return { entries, addEntry, updateEntry, deleteEntry, resetWhatIs };
}
