import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Pillar } from '../types/pillars';
import { DEFAULT_PILLARS } from '../types/pillars';

const STORAGE_KEY = 'mydayplan-pillars';

function loadPillars(): Pillar[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return DEFAULT_PILLARS.map(p => ({ ...p, id: uuidv4() }));
}

function savePillars(pillars: Pillar[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pillars));
  } catch (e) {
    console.warn('Failed to save pillars:', e);
  }
}

export function usePillars() {
  const [pillars, setPillars] = useState<Pillar[]>(loadPillars);

  useEffect(() => { savePillars(pillars); }, [pillars]);

  const updatePillar = useCallback((id: string, updates: Partial<Pillar>) => {
    setPillars(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const resetPillars = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setPillars(DEFAULT_PILLARS.map(p => ({ ...p, id: uuidv4() })));
  }, []);

  const togglePillar = useCallback((id: string) => {
    setPillars(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
  }, []);

  return {
    pillars,
    updatePillar,
    resetPillars,
    togglePillar,
  };
}
