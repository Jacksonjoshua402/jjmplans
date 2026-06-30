export type ConfessionCategory = 'identity' | 'healing' | 'prosperity' | 'protection' | 'wisdom' | 'faith' | 'custom';

export interface Confession {
  id: string;
  text: string;
  category: ConfessionCategory;
  scriptureRef?: string;
  isFavorite: boolean;
  createdAt: string;
}

export const CONFESSION_CATEGORIES: Record<ConfessionCategory, {
  label: string;
  emoji: string;
  bg: string;
  text: string;
  border: string;
}> = {
  identity: { label: 'Identity in Christ', emoji: '👑', bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/30' },
  healing: { label: 'Healing & Health', emoji: '💪', bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/30' },
  prosperity: { label: 'Prosperity & Provision', emoji: '💰', bg: 'bg-yellow-500/15', text: 'text-yellow-300', border: 'border-yellow-500/30' },
  protection: { label: 'Protection', emoji: '🛡️', bg: 'bg-blue-500/15', text: 'text-blue-300', border: 'border-blue-500/30' },
  wisdom: { label: 'Wisdom & Guidance', emoji: '🧠', bg: 'bg-violet-500/15', text: 'text-violet-300', border: 'border-violet-500/30' },
  faith: { label: 'Faith & Power', emoji: '🔥', bg: 'bg-rose-500/15', text: 'text-rose-300', border: 'border-rose-500/30' },
  custom: { label: 'Custom', emoji: '✨', bg: 'bg-slate-500/15', text: 'text-slate-300', border: 'border-slate-500/30' },
};
