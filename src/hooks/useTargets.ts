import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Target } from '../types/targets';
import { getWeekKey, getMonthKey } from '../types/targets';
import { useCloudSyncedState } from './useCloudSync';

const STORAGE_KEY = 'mydayplan-targets';

function defaultTargets(): Target[] {
  const today = new Date();
  const weekKey = getWeekKey(today);
  const monthKey = getMonthKey(today);
  return [
    { id: uuidv4(), title: 'Daily Bible Study', description: 'Read at least one chapter and take notes', frequency: 'daily', priority: 'high', status: 'in-progress', progress: 70, weekKey, monthKey, category: 'Spiritual', createdAt: new Date().toISOString() },
    { id: uuidv4(), title: 'Exercise 5x this week', description: '30 min cardio or strength training', frequency: 'weekly', priority: 'high', status: 'in-progress', progress: 60, weekKey, category: 'Health', createdAt: new Date().toISOString() },
    { id: uuidv4(), title: 'Read 2 books this month', description: 'Personal development & professional books', frequency: 'monthly', priority: 'medium', status: 'pending', progress: 30, monthKey, category: 'Learning', createdAt: new Date().toISOString() },
    { id: uuidv4(), title: 'Practice Speaking in Tongues', description: 'At least 30 minutes daily', frequency: 'daily', priority: 'high', status: 'in-progress', progress: 85, weekKey, monthKey, category: 'Spiritual', createdAt: new Date().toISOString() },
    { id: uuidv4(), title: 'Complete Data Analysis Course', description: 'Finish all modules on Udemy', frequency: 'weekly', priority: 'high', status: 'in-progress', progress: 45, weekKey, category: 'Career', createdAt: new Date().toISOString() },
    { id: uuidv4(), title: 'Save 20% of income', description: 'Budget & track expenses daily', frequency: 'monthly', priority: 'medium', status: 'pending', progress: 50, monthKey, category: 'Finance', createdAt: new Date().toISOString() },
  ];
}

function loadTargets(): Target[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return defaultTargets();
}

function saveTargets(targets: Target[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(targets));
  } catch (e) {
    console.warn('Failed to save:', e);
  }
}

export function useTargets() {
  const [targets, setTargets, resetCloud] = useCloudSyncedState<Target[]>(STORAGE_KEY, loadTargets, saveTargets);

  const addTarget = useCallback((data: Omit<Target, 'id' | 'createdAt'>) => {
    setTargets(prev => [{ ...data, id: uuidv4(), createdAt: new Date().toISOString() }, ...prev]);
  }, [setTargets]);

  const updateTarget = useCallback((id: string, updates: Partial<Target>) => {
    setTargets(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, [setTargets]);

  const deleteTarget = useCallback((id: string) => {
    setTargets(prev => prev.filter(t => t.id !== id));
  }, [setTargets]);

  const incrementProgress = useCallback((id: string, amount: number) => {
    setTargets(prev => prev.map(t => {
      if (t.id !== id) return t;
      const newProgress = Math.max(0, Math.min(100, t.progress + amount));
      return { ...t, progress: newProgress, status: newProgress >= 100 ? 'completed' : (newProgress > 0 ? 'in-progress' : 'pending') };
    }));
  }, [setTargets]);

  const resetTargets = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    resetCloud();
    setTargets(defaultTargets());
  }, [resetCloud, setTargets]);

  return { targets, addTarget, updateTarget, deleteTarget, incrementProgress, resetTargets };
}
