export type ProphecyType = 'prophecy' | 'rhema' | 'word' | 'dream' | 'vision' | 'inspiration' | 'revelation';
export type ProphecyStatus = 'pending' | 'in-progress' | 'fulfilled';

export interface Prophecy {
  id: string;
  title: string;
  content: string;
  type: ProphecyType;
  status: ProphecyStatus;
  date?: string; // when received (YYYY-MM-DD)
  source?: string; // who spoke it (pastor, prophet, etc.)
  scriptureRef?: string;
  notes: string;
  tags: string[];
  createdAt: string;
}

export const PROPHECY_TYPE_CONFIG: Record<ProphecyType, {
  label: string;
  emoji: string;
  bg: string;
  text: string;
  border: string;
}> = {
  prophecy: { label: 'Prophecy', emoji: '🔮', bg: 'bg-violet-500/15', text: 'text-violet-300', border: 'border-violet-500/30' },
  rhema: { label: 'Rhema', emoji: '✨', bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/30' },
  word: { label: 'Word of Knowledge', emoji: '📖', bg: 'bg-blue-500/15', text: 'text-blue-300', border: 'border-blue-500/30' },
  dream: { label: 'Dream', emoji: '🌙', bg: 'bg-indigo-500/15', text: 'text-indigo-300', border: 'border-indigo-500/30' },
  vision: { label: 'Vision', emoji: '👁️', bg: 'bg-rose-500/15', text: 'text-rose-300', border: 'border-rose-500/30' },
  inspiration: { label: 'Inspiration', emoji: '💡', bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/30' },
  revelation: { label: 'Revelation', emoji: '🕯️', bg: 'bg-cyan-500/15', text: 'text-cyan-300', border: 'border-cyan-500/30' },
};

export const PROPHECY_STATUS_CONFIG: Record<ProphecyStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: 'text-slate-400', bg: 'bg-slate-700/40' },
  'in-progress': { label: 'In Progress', color: 'text-amber-400', bg: 'bg-amber-500/15' },
  fulfilled: { label: 'Fulfilled', color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
};
