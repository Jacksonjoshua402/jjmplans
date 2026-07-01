import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { PrayerPoint, PrayerState, PrayerSession } from '../types/prayer';
import { useCloudSyncedState } from './useCloudSync';

const STORAGE_KEY = 'mydayplan-prayer';

function loadPrayer(): PrayerState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Migrate old data that may not have tonguesSessions
      return { tonguesSessions: [], ...parsed };
    }
  } catch { /* ignore */ }
  return { points: [], hourlyPlan: [], activeDuration: 6, tonguesSessions: [] };
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

  // FIX: when toggling an existing hour entry, also update its duration to the
  // current activeDuration so switching 6/10 is always respected.
  const toggleHourly = useCallback((hour: number, date: string) => {
    setState(prev => {
      const exists = prev.hourlyPlan.find(h => h.hour === hour && h.date === date);
      if (exists) {
        // If already completed with the same duration → mark incomplete
        // If completed with a different duration → update duration (keep completed)
        if (exists.duration === prev.activeDuration) {
          return {
            ...prev,
            hourlyPlan: prev.hourlyPlan.map(h =>
              h.hour === hour && h.date === date ? { ...h, completed: !h.completed } : h
            ),
          };
        } else {
          // Duration changed — update entry with new duration, mark complete
          return {
            ...prev,
            hourlyPlan: prev.hourlyPlan.map(h =>
              h.hour === hour && h.date === date
                ? { ...h, duration: prev.activeDuration, completed: true }
                : h
            ),
          };
        }
      }
      // New entry
      return {
        ...prev,
        hourlyPlan: [...prev.hourlyPlan, { hour, date, completed: true, duration: prev.activeDuration }],
      };
    });
  }, [setState]);

  const setDuration = useCallback((duration: 6 | 10) => {
    setState(prev => ({ ...prev, activeDuration: duration }));
  }, [setState]);

  // Tongues sessions
  const toggleTongues = useCallback((session: PrayerSession, date: string) => {
    setState(prev => {
      const exists = prev.tonguesSessions.find(t => t.session === session && t.date === date);
      if (exists) {
        return {
          ...prev,
          tonguesSessions: prev.tonguesSessions.map(t =>
            t.session === session && t.date === date ? { ...t, completed: !t.completed } : t
          ),
        };
      }
      return {
        ...prev,
        tonguesSessions: [...prev.tonguesSessions, { session, date, completed: true }],
      };
    });
  }, [setState]);

  const resetPrayer = useCallback(() => {
    resetCloud();
    setState({ points: [], hourlyPlan: [], activeDuration: 6, tonguesSessions: [] });
  }, [resetCloud, setState]);

  return { ...state, addPrayerPoint, togglePrayerPoint, deletePrayerPoint, toggleHourly, setDuration, toggleTongues, resetPrayer };
}
