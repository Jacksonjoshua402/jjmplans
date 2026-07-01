export type GivingItemType = 'Giving' | 'Partnership' | 'Purchase' | 'Payment';

export interface GivingItem {
  id: string;
  type: GivingItemType;
  title: string;
  amount?: string;
  notes?: string;
  done: boolean;
  createdAt: string;
}

export interface MonthlyGiving {
  monthKey: string; // e.g. "2026-01"
  items: GivingItem[];
}

export interface YearEndTarget {
  id: string;
  title: string;
  description?: string;
  amount?: string;
  fulfilled: boolean;
  createdAt: string;
}

export interface GivingState {
  monthly: MonthlyGiving[];
  yearEndTargets: YearEndTarget[];
}

export const GIVING_TYPES: { type: GivingItemType; color: string; bg: string; border: string; emoji: string }[] = [
  { type: 'Giving',      color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', emoji: '🙏' },
  { type: 'Partnership', color: 'text-blue-400',    bg: 'bg-blue-500/20',    border: 'border-blue-500/40',    emoji: '🤝' },
  { type: 'Purchase',    color: 'text-amber-400',   bg: 'bg-amber-500/20',   border: 'border-amber-500/40',   emoji: '🛒' },
  { type: 'Payment',     color: 'text-rose-400',    bg: 'bg-rose-500/20',    border: 'border-rose-500/40',    emoji: '💳' },
];

export const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

export function getMonthKey(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

export function parseMonthKey(key: string): { year: number; month: number } {
  const [y, m] = key.split('-').map(Number);
  return { year: y, month: m - 1 };
}
