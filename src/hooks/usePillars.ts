import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Pillar } from '../types/pillars';
import { DEFAULT_PILLARS } from '../types/pillars';
import { useCloudSyncedState } from './useCloudSync';

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
  const [pillars, setPillars, resetCloud] = useCloudSyncedState<Pillar[]>(STORAGE_KEY, loadPillars, savePillars);

  const updatePillar = useCallback((id: string, updates: Partial<Pillar>) => {
    setPillars(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, [setPillars]);

  const resetPillars = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    resetCloud();
    setPillars(DEFAULT_PILLARS.map(p => ({ ...p, id: uuidv4() })));
  }, [resetCloud, setPillars]);

  const togglePillar = useCallback((id: string) => {
    setPillars(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
  }, [setPillars]);

  return { pillars, updatePillar, resetPillars, togglePillar };
}
