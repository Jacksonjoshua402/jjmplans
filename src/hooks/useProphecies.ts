import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Prophecy } from '../types/prophecies';

const STORAGE_KEY = 'mydayplan-prophecies';

function loadProphecies(): Prophecy[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return [];
}

function saveProphecies(items: Prophecy[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('Failed to save:', e);
  }
}

export function useProphecies() {
  const [prophecies, setProphecies] = useState<Prophecy[]>(loadProphecies);

  useEffect(() => { saveProphecies(prophecies); }, [prophecies]);

  const addProphecy = useCallback((data: Omit<Prophecy, 'id' | 'createdAt'>) => {
    setProphecies(prev => [
      { ...data, id: uuidv4(), createdAt: new Date().toISOString() },
      ...prev,
    ]);
  }, []);

  const updateProphecy = useCallback((id: string, updates: Partial<Prophecy>) => {
    setProphecies(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const deleteProphecy = useCallback((id: string) => {
    setProphecies(prev => prev.filter(p => p.id !== id));
  }, []);

  const resetProphecies = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setProphecies([]);
  }, []);

  return {
    prophecies,
    addProphecy,
    updateProphecy,
    deleteProphecy,
    resetProphecies,
  };
}
