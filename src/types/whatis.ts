export type WhatIsCategory =
  | 'bible'
  | 'life'
  | 'doctrine'
  | 'prayer'
  | 'relationships'
  | 'purpose'
  | 'warfare'
  | 'other';

export interface WhatIsEntry {
  id: string;
  question: string; // e.g. "A BROTHER CAN BE UNDER ATTACK, THIS IS THE SOLUTION"
  category: WhatIsCategory;
  scriptureRefs: string; // e.g. "LUKE 22:31-32, ACTS 12:1-6"
  answer: string; // free-text explanation, insight, or rhema word (optional)
  source?: string; // who taught/shared it, if anyone
  date?: string; // YYYY-MM-DD
  createdAt: string;
}

export const WHATIS_CATEGORY_CONFIG: Record<WhatIsCategory, {
  label: string;
  emoji: string;
  bg: string;
  text: string;
  border: string;
}> = {
  bible: { label: 'Bible', emoji: '📖', bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/30' },
  life: { label: 'Life', emoji: '🌱', bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/30' },
  doctrine: { label: 'Doctrine', emoji: '⚖️', bg: 'bg-sky-500/15', text: 'text-sky-300', border: 'border-sky-500/30' },
  prayer: { label: 'Prayer', emoji: '🙏', bg: 'bg-indigo-500/15', text: 'text-indigo-300', border: 'border-indigo-500/30' },
  relationships: { label: 'Relationships', emoji: '🤝', bg: 'bg-pink-500/15', text: 'text-pink-300', border: 'border-pink-500/30' },
  purpose: { label: 'Purpose', emoji: '🎯', bg: 'bg-violet-500/15', text: 'text-violet-300', border: 'border-violet-500/30' },
  warfare: { label: 'Spiritual Warfare', emoji: '🛡️', bg: 'bg-rose-500/15', text: 'text-rose-300', border: 'border-rose-500/30' },
  other: { label: 'Other', emoji: '❓', bg: 'bg-slate-500/15', text: 'text-slate-300', border: 'border-slate-500/30' },
};
