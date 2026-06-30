import { Plus, Minus, Edit2, Trash2 } from 'lucide-react';
import type { Target } from '../types/targets';
import { TARGET_CATEGORIES } from '../types/targets';

interface TargetCardProps {
  target: Target;
  onIncrement: (id: string, amount: number) => void;
  onEdit: (target: Target) => void;
  onDelete: (id: string) => void;
}

export default function TargetCard({ target, onIncrement, onEdit, onDelete }: TargetCardProps) {
  const categoryConf = TARGET_CATEGORIES.find(c => c.label === target.category) || TARGET_CATEGORIES[0];
  const isDone = target.progress >= 100;

  return (
    <div
      className={`group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl border border-slate-700/50 p-5 hover:border-amber-500/30 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/5`}
    >
      {/* Category strip */}
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl overflow-hidden">
        <div className={`w-full h-full bg-gradient-to-r ${categoryConf.color}`} />
      </div>

      <div className="flex items-start justify-between gap-3 mt-1 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg">{categoryConf.emoji}</span>
          <span className={`text-[10px] font-bold tracking-widest uppercase ${categoryConf.text}`}>
            {target.category}
          </span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={() => onEdit(target)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-all"
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={() => { if (confirm('Delete this target?')) onDelete(target.id); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <h3
        className={`text-base font-bold mb-1 leading-tight ${isDone ? 'text-emerald-300' : 'text-white'}`}
      >
        {isDone && '✦ '}{target.title}
      </h3>

      {target.description && (
        <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
          {target.description}
        </p>
      )}

      {/* Progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">
            {target.priority === 'high' ? '🔥 High Priority' : target.priority === 'medium' ? '⭐ Medium' : '📌 Low'}
          </span>
          <span className={`text-sm font-bold tabular-nums ${isDone ? 'text-emerald-300' : 'text-amber-300'}`}>
            {target.progress}%
          </span>
        </div>
        <div className="relative h-2 bg-slate-700/50 rounded-full overflow-hidden">
          <div
            className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 bg-gradient-to-r ${categoryConf.color}`}
            style={{ width: `${target.progress}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onIncrement(target.id, -10)}
            className="px-2 py-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
            title="Decrease by 10%"
          >
            <Minus size={12} />
          </button>
          <button
            onClick={() => onIncrement(target.id, 10)}
            className="px-2 py-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
            title="Increase by 10%"
          >
            <Plus size={12} />
          </button>
          <button
            onClick={() => onIncrement(target.id, 25)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
          >
            +25%
          </button>
        </div>
        <button
          onClick={() => onIncrement(target.id, target.progress >= 100 ? -100 : (100 - target.progress))}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            isDone
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
          }`}
        >
          {isDone ? 'Reset' : 'Mark Complete'}
        </button>
      </div>
    </div>
  );
}
