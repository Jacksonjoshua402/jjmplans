import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Activity, DayKey, SessionType } from '../types';
import { DEFAULT_ACTIVITIES } from '../types';
import { useCloudSyncedState } from './useCloudSync';

const STORAGE_KEY = 'mydayplan-activities';

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
  }, []);

  const addActivity = useCallback((activity: Omit<Activity, 'id'>) => {
    setActivities(prev => [...prev, { ...activity, id: uuidv4() }]);
  }, []);

  const updateActivity = useCallback((id: string, updates: Partial<Activity>) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  }, []);

  const deleteActivity = useCallback((id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id));
  }, []);

  const addToSession = useCallback((session: SessionType, day: DayKey) => {
    const newActivity: Activity = {
      id: uuidv4(),
      title: '',
      frequency: '',
      type: 'book',
      session,
      completed: false,
      day,
      emoji: '📖',
    };
    setActivities(prev => [...prev, newActivity]);
    return newActivity.id;
  }, []);

  const clearDay = useCallback((day: DayKey) => {
    setActivities(prev => prev.filter(a => a.day !== day));
  }, []);

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
    resetData,
  };
}
