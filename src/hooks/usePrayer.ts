import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { PrayerPoint, PrayerState } from '../types/prayer';
import { useCloudSyncedState } from './useCloudSync';

const STORAGE_KEY = 'mydayplan-prayer';

function loadPrayer(): PrayerState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return { points: [], hourlyPlan: [], activeDuration: 6 };
}

function savePrayer(state: PrayerState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function usePrayer() {
  const [state, setState, resetCloud] = useCloudSyncedState<PrayerState>(STORAGE_KEY, loadPrayer, savePrayer);

  const addPrayerPoint = useCallback((point: Omit<PrayerPoint, 'id' | 'completed'>) => {
    setState(prev => ({ ...prev, points: [...prev.points, { ...point, id: uuidv4(), completed: false }] }));
  }, [setState]);

  const togglePrayerPoint = useCallback((id: string) => {
    setState(prev => ({ ...prev, points: prev.points.map(p => p.id === id ? { ...p, completed: !p.completed } : p) }));
  }, [setState]);

  const deletePrayerPoint = useCallback((id: string) => {
    setState(prev => ({ ...prev, points: prev.points.filter(p => p.id !== id) }));
  }, [setState]);

  const toggleHourly = useCallback((hour: number, date: string) => {
    setState(prev => {
      const exists = prev.hourlyPlan.find(h => h.hour === hour && h.date === date);
      if (exists) {
        return { ...prev, hourlyPlan: prev.hourlyPlan.map(h => (h.hour === hour && h.date === date) ? { ...h, completed: !h.completed } : h) };
      }
      return { ...prev, hourlyPlan: [...prev.hourlyPlan, { hour, date, completed: true, duration: prev.activeDuration }] };
    });
  }, [setState]);

  const setDuration = useCallback((duration: 6 | 10) => {
    setState(prev => ({ ...prev, activeDuration: duration }));
  }, [setState]);

  const resetPrayer = useCallback(() => {
    resetCloud();
    setState({ points: [], hourlyPlan: [], activeDuration: 6 });
  }, [resetCloud, setState]);

  return { ...state, addPrayerPoint, togglePrayerPoint, deletePrayerPoint, toggleHourly, setDuration, resetPrayer };
}
