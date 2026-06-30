import type { Pillar } from '../types/pillars';

interface PillarCardProps {
  pillar: Pillar;
  onEdit: (pillar: Pillar) => void;
  onToggle: (id: string) => void;
}

export default function PillarCard({ pillar, onEdit, onToggle }: PillarCardProps) {
  const hasContent = pillar.description || pillar.notes || pillar.keyVerses.length > 0;

  return (
    <button
      onClick={() => onEdit(pillar)}
      className={`group relative text-left w-full rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        pillar.isActive
          ? hasContent
            ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 hover:border-amber-500/30 hover:shadow-amber-500/5'
            : 'bg-gradient-to-br from-slate-800/40 to-slate-900/40 border-slate-700/40 hover:border-slate-600/50'
          : 'bg-slate-800/20 border-slate-800/30 opacity-50'
      }`}
    >
      {/* Pillar number */}
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl overflow-hidden">
        <div
          className={`h-full transition-all ${
            pillar.isActive
              ? 'bg-gradient-to-r from-amber-500 to-orange-500'
              : 'bg-slate-700'
          }`}
        />
      </div>

      <div className="flex items-start gap-3 mt-1">
        {/* Number + Emoji */}
        <div className="flex-shrink-0">
          <div
            className={`h-10 w-10 rounded-xl flex items-center justify-center text-lg transition-all ${
              pillar.isActive
                ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30'
                : 'bg-slate-800/50 border border-slate-700/30'
            }`}
          >
            {pillar.emoji || (
              <span className={`text-xs font-extrabold ${pillar.isActive ? 'text-amber-400' : 'text-slate-600'}`}>
                {pillar.number}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`text-sm font-bold leading-snug transition-colors ${
                pillar.isActive ? 'text-white group-hover:text-amber-200' : 'text-slate-500'
              }`}
            >
              {pillar.title}
            </h3>
            <span
              onClick={(e) => { e.stopPropagation(); onToggle(pillar.id); }}
              className={`flex-shrink-0 mt-0.5 h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer ${
                pillar.isActive
                  ? 'bg-amber-500/20 border-amber-500/60'
                  : 'border-slate-600 hover:border-slate-500'
              }`}
            >
              {pillar.isActive && (
                <div className="h-2 w-2 rounded-full bg-amber-400" />
              )}
            </span>
          </div>

          {/* Content indicators */}
          <div className="flex items-center gap-2 mt-2">
            {pillar.description && (
              <span className="text-[10px] text-slate-400 bg-slate-700/50 px-1.5 py-0.5 rounded">
                Description
              </span>
            )}
            {pillar.keyVerses.length > 0 && (
              <span className="text-[10px] text-amber-400/70 bg-amber-500/10 px-1.5 py-0.5 rounded">
                {pillar.keyVerses.length} verse{pillar.keyVerses.length > 1 ? 's' : ''}
              </span>
            )}
            {pillar.notes && (
              <span className="text-[10px] text-slate-400 bg-slate-700/50 px-1.5 py-0.5 rounded">
                Notes
              </span>
            )}
            {!hasContent && pillar.isActive && (
              <span className="text-[10px] text-slate-500 italic">Click to add details</span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
