import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Activity, DayKey, SessionType } from '../types';
import { DEFAULT_ACTIVITIES } from '../types';
import { useCloudSyncedState } from './useCloudSync';

const STORAGE_KEY = 'mydayplan-activities';
const DEFAULT_TEMPLATE_KEY = 'mydayplan-default-template';

function loadActivities(): Activity[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return DEFAULT_ACTIVITIES;
}

function saveActivities(activities: Activity[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
}

function getTodayKey(): DayKey {
  const dayMap: DayKey[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return dayMap[new Date().getDay()];
}

export function useActivities() {
  const [activities, setActivities, resetCloud] = useCloudSyncedState<Activity[]>(STORAGE_KEY, loadActivities, saveActivities);
  const [selectedDay, setSelectedDay] = useState<DayKey>(getTodayKey());

  const toggleComplete = useCallback((id: string) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, completed: !a.completed } : a));
  }, [setActivities]);

  const addActivity = useCallback((activity: Omit<Activity, 'id'>) => {
    setActivities(prev => [...prev, { ...activity, id: uuidv4() }]);
  }, [setActivities]);

  const updateActivity = useCallback((id: string, updates: Partial<Activity>) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  }, [setActivities]);

  const deleteActivity = useCallback((id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id));
  }, [setActivities]);

  const addToSession = useCallback((session: SessionType, day: DayKey) => {
    setActivities(prev => [...prev, {
      id: uuidv4(), title: '', name: '', frequency: '', type: 'book' as const,
      session, day, completed: false, notes: '', emoji: '📖', startTime: '', endTime: '',
    } as Activity]);
  }, [setActivities]);

  const clearDay = useCallback((day: DayKey) => {
    setActivities(prev => prev.filter(a => a.day !== day));
  }, [setActivities]);

  // ── Save current day as default template ─────────────────────────────────
  const saveAsDefault = useCallback((day: DayKey) => {
    const dayItems = activities.filter(a => a.day === day);
    const template = dayItems.map(a => ({ ...a, completed: false }));
    localStorage.setItem(DEFAULT_TEMPLATE_KEY, JSON.stringify(template));
    return template.length;
  }, [activities]);

  // ── Duplicate a day's activities to another day ──────────────────────────
  const duplicateDay = useCallback((fromDay: DayKey, toDay: DayKey) => {
    const source = activities.filter(a => a.day === fromDay);
    if (!source.length) return 0;
    const copies = source.map(a => ({ ...a, id: uuidv4(), day: toDay, completed: false }));
    setActivities(prev => [...prev.filter(a => a.day !== toDay), ...copies]);
    return copies.length;
  }, [activities, setActivities]);

  // ── Apply saved default template to a day ───────────────────────────────
  const applyDefault = useCallback((toDay: DayKey) => {
    try {
      const stored = localStorage.getItem(DEFAULT_TEMPLATE_KEY);
      if (!stored) return 0;
      const template: Activity[] = JSON.parse(stored);
      const copies = template.map(a => ({ ...a, id: uuidv4(), day: toDay, completed: false }));
      setActivities(prev => [...prev.filter(a => a.day !== toDay), ...copies]);
      return copies.length;
    } catch { return 0; }
  }, [setActivities]);

  const hasDefault = () => !!localStorage.getItem(DEFAULT_TEMPLATE_KEY);

  const resetData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    resetCloud();
    setActivities(DEFAULT_ACTIVITIES);
  }, [resetCloud, setActivities]);

  const dayActivities = activities.filter(a => a.day === selectedDay);
  const completedCount = dayActivities.filter(a => a.completed).length;
  const totalCount = dayActivities.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return {
    allActivities: activities,
    activities,
    dayActivities,
    selectedDay,
    setSelectedDay,
    progressPercent,
    completedCount,
    totalCount,
    toggleComplete,
    addActivity,
    updateActivity,
    deleteActivity,
    addToSession,
    clearDay,
    saveAsDefault,
    duplicateDay,
    applyDefault,
    hasDefault,
    resetData,
  };
}
