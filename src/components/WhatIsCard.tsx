import { useState } from 'react';
import { Calendar, User, BookOpen, Pencil, Trash2, ChevronDown } from 'lucide-react';
import type { WhatIsEntry } from '../types/whatis';
import { WHATIS_CATEGORY_CONFIG } from '../types/whatis';

interface WhatIsCardProps {
  entry: WhatIsEntry;
  onEdit: (entry: WhatIsEntry) => void;
  onDelete: (id: string) => void;
}

export default function WhatIsCard({ entry, onEdit, onDelete }: WhatIsCardProps) {
  const [expanded, setExpanded] = useState(false);
  const conf = WHATIS_CATEGORY_CONFIG[entry.category];

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  const answerIsLong = entry.answer.length > 160;

  return (
    <div className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl border border-slate-700/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-cyan-500/30">
      {/* Top strip */}
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-cyan-500 to-sky-500" />
      </div>

      {/* Header: category */}
      <div className="flex items-center justify-between gap-2 mt-1 mb-3">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase border ${conf.bg} ${conf.text} ${conf.border}`}>
          <span>{conf.emoji}</span> {conf.label}
        </span>
      </div>

      {/* Question */}
      <h3
        className="text-base font-bold text-white mb-3 leading-snug"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        <span className="text-cyan-400/70">What is:</span> {entry.question}
      </h3>

      {/* Scripture refs */}
      {entry.scriptureRefs && (
        <div className="flex items-start gap-1.5 mb-3 text-sm text-amber-300/90 font-semibold">
          <BookOpen size={13} className="mt-0.5 shrink-0 text-amber-400" />
          <span className="whitespace-pre-line leading-snug">{entry.scriptureRefs}</span>
        </div>
      )}

      {/* Answer / rhema */}
      {entry.answer && (
        <div className="bg-gradient-to-r from-cyan-500/5 to-transparent border-l-2 border-cyan-500/40 pl-3 py-2 mb-3">
          <p className={`text-sm text-slate-200 leading-relaxed italic whitespace-pre-wrap ${expanded ? '' : 'line-clamp-4'}`}>
            "{entry.answer}"
          </p>
          {answerIsLong && (
            <button
              onClick={() => setExpanded(v => !v)}
              className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-cyan-400/80 hover:text-cyan-300"
            >
              {expanded ? 'Show less' : 'Read more'}
              <ChevronDown size={12} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      )}

      {/* Meta */}
      {(entry.date || entry.source) && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-400 mb-2">
          {entry.date && (
            <span className="flex items-center gap-1">
              <Calendar size={11} className="text-cyan-400" /> {formatDate(entry.date)}
            </span>
          )}
          {entry.source && (
            <span className="flex items-center gap-1">
              <User size={11} className="text-amber-400" /> {entry.source}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(entry)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
          title="Edit"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={() => { if (confirm('Delete this entry?')) onDelete(entry.id); }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-all"
          title="Delete"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
