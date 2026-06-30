import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { PrayerPoint, PrayerState } from '../types/prayer';

const STORAGE_KEY = 'mydayplan-prayer';

function loadPrayer(): PrayerState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return {
    points: [],
    hourlyPlan: [],
    activeDuration: 6,
  };
}

export function usePrayer() {
  const [state, setState] = useState<PrayerState>(loadPrayer);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addPrayerPoint = useCallback((point: Omit<PrayerPoint, 'id' | 'completed'>) => {
    setState(prev => ({
      ...prev,
      points: [...prev.points, { ...point, id: uuidv4(), completed: false }],
    }));
  }, []);

  const togglePrayerPoint = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      points: prev.points.map(p => p.id === id ? { ...p, completed: !p.completed } : p),
    }));
  }, []);

  const deletePrayerPoint = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      points: prev.points.filter(p => p.id !== id),
    }));
  }, []);

  const toggleHourly = useCallback((hour: number, date: string) => {
    setState(prev => {
      const exists = prev.hourlyPlan.find(h => h.hour === hour && h.date === date);
      if (exists) {
        return {
          ...prev,
          hourlyPlan: prev.hourlyPlan.map(h => 
            (h.hour === hour && h.date === date) ? { ...h, completed: !h.completed } : h
          ),
        };
      }
      return {
        ...prev,
        hourlyPlan: [...prev.hourlyPlan, { hour, date, completed: true, duration: prev.activeDuration }],
      };
    });
  }, []);

  const setDuration = useCallback((duration: 6 | 10) => {
    setState(prev => ({ ...prev, activeDuration: duration }));
  }, []);

  const resetPrayer = useCallback(() => {
    setState({ points: [], hourlyPlan: [], activeDuration: 6 });
  }, []);

  return {
    ...state,
    addPrayerPoint,
    togglePrayerPoint,
    deletePrayerPoint,
    toggleHourly,
    setDuration,
    resetPrayer,
  };
}
