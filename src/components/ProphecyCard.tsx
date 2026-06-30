import { Calendar, User, BookOpen, Tag, Pencil, Trash2 } from 'lucide-react';
import type { Prophecy } from '../types/prophecies';
import { PROPHECY_TYPE_CONFIG, PROPHECY_STATUS_CONFIG } from '../types/prophecies';

interface ProphecyCardProps {
  prophecy: Prophecy;
  onEdit: (prophecy: Prophecy) => void;
  onDelete: (id: string) => void;
}

export default function ProphecyCard({ prophecy, onEdit, onDelete }: ProphecyCardProps) {
  const typeConf = PROPHECY_TYPE_CONFIG[prophecy.type];
  const statusConf = PROPHECY_STATUS_CONFIG[prophecy.status];

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  return (
    <div className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl border border-slate-700/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-violet-500/30">
      {/* Top strip */}
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
      </div>

      {/* Header: type & status */}
      <div className="flex items-center justify-between gap-2 mt-1 mb-3">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase border ${typeConf.bg} ${typeConf.text} ${typeConf.border}`}>
          <span>{typeConf.emoji}</span> {typeConf.label}
        </span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${statusConf.bg} ${statusConf.color}`}>
          {statusConf.label.toUpperCase()}
        </span>
      </div>

      {/* Title */}
      {prophecy.title && (
        <h3
          className="text-base font-bold text-white mb-2 leading-snug"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          {prophecy.title}
        </h3>
      )}

      {/* Content - the prophecy itself */}
      <div className="bg-gradient-to-r from-violet-500/5 to-transparent border-l-2 border-violet-500/40 pl-3 py-2 mb-3">
        <p className="text-sm text-slate-200 leading-relaxed italic line-clamp-4">
          "{prophecy.content}"
        </p>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-400 mb-2">
        {prophecy.date && (
          <span className="flex items-center gap-1">
            <Calendar size={11} className="text-violet-400" /> {formatDate(prophecy.date)}
          </span>
        )}
        {prophecy.source && (
          <span className="flex items-center gap-1">
            <User size={11} className="text-amber-400" /> {prophecy.source}
          </span>
        )}
        {prophecy.scriptureRef && (
          <span className="flex items-center gap-1 text-amber-400/80">
            <BookOpen size={11} /> {prophecy.scriptureRef}
          </span>
        )}
      </div>

      {/* Tags */}
      {prophecy.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 pt-2 border-t border-slate-700/30">
          <Tag size={10} className="text-slate-600" />
          {prophecy.tags.slice(0, 4).map(tag => (
            <span key={tag} className="px-1.5 py-0.5 rounded-md bg-slate-700/50 text-slate-300 text-[10px] font-medium">
              {tag}
            </span>
          ))}
          {prophecy.tags.length > 4 && (
            <span className="text-[10px] text-slate-500">+{prophecy.tags.length - 4}</span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(prophecy)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 transition-all"
          title="Edit"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={() => { if (confirm('Delete this prophecy?')) onDelete(prophecy.id); }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-all"
          title="Delete"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
