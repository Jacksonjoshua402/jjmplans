export type Frequency = 'daily' | 'weekly' | 'monthly';
export type TargetStatus = 'pending' | 'in-progress' | 'completed';
export type Priority = 'low' | 'medium' | 'high';

export interface Target {
  id: string;
  title: string;
  description: string;
  frequency: Frequency;
  priority: Priority;
  status: TargetStatus;
  progress: number; // 0-100
  weekKey?: string; // e.g. "2026-W15"
  monthKey?: string; // e.g. "2026-04"
  category: string; // e.g. "Spiritual", "Health", "Career", "Personal"
  createdAt: string;
  dueDate?: string;
}

export const TARGET_CATEGORIES = [
  { label: 'Spiritual', emoji: '🙏', color: 'from-amber-500 to-orange-500', text: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/40' },
  { label: 'Health', emoji: '💪', color: 'from-emerald-500 to-teal-500', text: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/40' },
  { label: 'Career', emoji: '💼', color: 'from-blue-500 to-indigo-500', text: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/40' },
  { label: 'Learning', emoji: '📚', color: 'from-violet-500 to-fuchsia-500', text: 'text-violet-400', bg: 'bg-violet-500/20', border: 'border-violet-500/40' },
  { label: 'Finance', emoji: '💰', color: 'from-yellow-500 to-amber-500', text: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/40' },
  { label: 'Personal', emoji: '🌟', color: 'from-rose-500 to-pink-500', text: 'text-rose-400', bg: 'bg-rose-500/20', border: 'border-rose-500/40' },
];

export const FREQUENCY_LABELS: Record<Frequency, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

// Date utilities
export function getWeekKey(date: Date): string {
  const d = new Date(date);
  const dayNum = d.getDay() || 7;
  d.setDate(d.getDate() + 4 - dayNum);
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNum = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + yearStart.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

export function getMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function getWeekDates(weekKey: string): Date[] {
  const [year, weekStr] = weekKey.split('-W');
  const week = parseInt(weekStr, 10);
  const jan4 = new Date(parseInt(year), 0, 4);
  const jan4Day = jan4.getDay() || 7;
  const monday = new Date(jan4);
  monday.setDate(monday.getDate() - jan4Day + 1 + (week - 1) * 7);
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d);
  }
  return dates;
}

export function getMonthName(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function getWeekLabel(weekKey: string): string {
  const dates = getWeekDates(weekKey);
  const start = dates[0];
  const end = dates[6];
  const sameMonth = start.getMonth() === end.getMonth();
  if (sameMonth) {
    return `${start.toLocaleDateString('en-US', { month: 'long' })} ${start.getDate()} – ${end.getDate()}, ${end.getFullYear()}`;
  }
  return `${start.toLocaleDateString('en-US', { month: 'short' })} ${start.getDate()} – ${end.toLocaleDateString('en-US', { month: 'short' })} ${end.getDate()}, ${end.getFullYear()}`;
}

export function getAdjacentWeek(weekKey: string, offset: number): string {
  const dates = getWeekDates(weekKey);
  const newDate = new Date(dates[0]);
  newDate.setDate(newDate.getDate() + offset * 7);
  return getWeekKey(newDate);
}

export function getAdjacentMonth(monthKey: string, offset: number): string {
  const [year, month] = monthKey.split('-').map(Number);
  const d = new Date(year, month - 1 + offset, 1);
  return getMonthKey(d);
}
