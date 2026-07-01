import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { GivingState, GivingItem, YearEndTarget, GivingItemType } from '../types/giving';
import { useCloudSyncedState } from './useCloudSync';

const STORAGE_KEY = 'mydayplan-giving';

function defaultState(): GivingState {
  return { monthly: [], yearEndTargets: [] };
}

function load(): GivingState {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) return JSON.parse(s);
  } catch { /* ignore */ }
  return defaultState();
}

function save(state: GivingState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
}

export function useGiving() {
  const [state, setState, resetCloud] = useCloudSyncedState<GivingState>(STORAGE_KEY, load, save);

  // ── Monthly helpers ──────────────────────────────────────────────────────
  const ensureMonth = (monthKey: string) => {
    setState(prev => {
      if (prev.monthly.find(m => m.monthKey === monthKey)) return prev;
      return { ...prev, monthly: [...prev.monthly, { monthKey, items: [] }] };
    });
  };

  const addItem = useCallback((monthKey: string, data: { type: GivingItemType; title: string; amount?: string; notes?: string }) => {
    const item: GivingItem = { id: uuidv4(), ...data, done: false, createdAt: new Date().toISOString() };
    setState(prev => {
      const monthly = prev.monthly.find(m => m.monthKey === monthKey)
        ? prev.monthly.map(m => m.monthKey === monthKey ? { ...m, items: [...m.items, item] } : m)
        : [...prev.monthly, { monthKey, items: [item] }];
      return { ...prev, monthly };
    });
  }, [setState]);

  const toggleItem = useCallback((monthKey: string, itemId: string) => {
    setState(prev => ({
      ...prev,
      monthly: prev.monthly.map(m =>
        m.monthKey === monthKey
          ? { ...m, items: m.items.map(i => i.id === itemId ? { ...i, done: !i.done } : i) }
          : m
      ),
    }));
  }, [setState]);

  const updateItem = useCallback((monthKey: string, itemId: string, updates: Partial<GivingItem>) => {
    setState(prev => ({
      ...prev,
      monthly: prev.monthly.map(m =>
        m.monthKey === monthKey
          ? { ...m, items: m.items.map(i => i.id === itemId ? { ...i, ...updates } : i) }
          : m
      ),
    }));
  }, [setState]);

  const deleteItem = useCallback((monthKey: string, itemId: string) => {
    setState(prev => ({
      ...prev,
      monthly: prev.monthly.map(m =>
        m.monthKey === monthKey ? { ...m, items: m.items.filter(i => i.id !== itemId) } : m
      ),
    }));
  }, [setState]);

  // ── Year-end targets ─────────────────────────────────────────────────────
  const addYearTarget = useCallback((data: { title: string; description?: string; amount?: string }) => {
    setState(prev => ({
      ...prev,
      yearEndTargets: [...prev.yearEndTargets, { id: uuidv4(), ...data, fulfilled: false, createdAt: new Date().toISOString() }],
    }));
  }, [setState]);

  const toggleYearTarget = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      yearEndTargets: prev.yearEndTargets.map(t => t.id === id ? { ...t, fulfilled: !t.fulfilled } : t),
    }));
  }, [setState]);

  const updateYearTarget = useCallback((id: string, updates: Partial<YearEndTarget>) => {
    setState(prev => ({
      ...prev,
      yearEndTargets: prev.yearEndTargets.map(t => t.id === id ? { ...t, ...updates } : t),
    }));
  }, [setState]);

  const deleteYearTarget = useCallback((id: string) => {
    setState(prev => ({ ...prev, yearEndTargets: prev.yearEndTargets.filter(t => t.id !== id) }));
  }, [setState]);

  const reset = useCallback(() => {
    resetCloud();
    setState(defaultState());
  }, [resetCloud, setState]);

  return {
    monthly: state.monthly,
    yearEndTargets: state.yearEndTargets,
    ensureMonth,
    addItem, toggleItem, updateItem, deleteItem,
    addYearTarget, toggleYearTarget, updateYearTarget, deleteYearTarget,
    reset,
  };
}
