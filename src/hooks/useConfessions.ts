import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Confession } from '../types/confessions';
import { useCloudSyncedState } from './useCloudSync';

const STORAGE_KEY = 'mydayplan-confessions';

function loadConfessions(): Confession[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return [];
}

function saveConfessions(items: Confession[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('Failed to save:', e);
  }
}

export function useConfessions() {
  const [confessions, setConfessions, resetCloud] = useCloudSyncedState<Confession[]>(STORAGE_KEY, loadConfessions, saveConfessions);

  const addConfession = useCallback((data: Omit<Confession, 'id' | 'createdAt'>) => {
    setConfessions(prev => [
      { ...data, id: uuidv4(), createdAt: new Date().toISOString() },
      ...prev,
    ]);
  }, [setConfessions]);

  const updateConfession = useCallback((id: string, updates: Partial<Confession>) => {
    setConfessions(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, [setConfessions]);

  const deleteConfession = useCallback((id: string) => {
    setConfessions(prev => prev.filter(c => c.id !== id));
  }, [setConfessions]);

  const toggleFavorite = useCallback((id: string) => {
    setConfessions(prev => prev.map(c => c.id === id ? { ...c, isFavorite: !c.isFavorite } : c));
  }, [setConfessions]);

  const resetConfessions = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    resetCloud();
    setConfessions([]);
  }, [resetCloud, setConfessions]);

  return { confessions, addConfession, updateConfession, deleteConfession, toggleFavorite, resetConfessions };
}
