import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Confession } from '../types/confessions';

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
  const [confessions, setConfessions] = useState<Confession[]>(loadConfessions);

  useEffect(() => { saveConfessions(confessions); }, [confessions]);

  const addConfession = useCallback((data: Omit<Confession, 'id' | 'createdAt'>) => {
    setConfessions(prev => [
      { ...data, id: uuidv4(), createdAt: new Date().toISOString() },
      ...prev,
    ]);
  }, []);

  const updateConfession = useCallback((id: string, updates: Partial<Confession>) => {
    setConfessions(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const deleteConfession = useCallback((id: string) => {
    setConfessions(prev => prev.filter(c => c.id !== id));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setConfessions(prev => prev.map(c => c.id === id ? { ...c, isFavorite: !c.isFavorite } : c));
  }, []);

  const resetConfessions = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setConfessions([]);
  }, []);

  return { confessions, addConfession, updateConfession, deleteConfession, toggleFavorite, resetConfessions };
}
