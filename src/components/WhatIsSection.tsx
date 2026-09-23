import { useState, useMemo } from 'react';
import { Plus, Search, HelpCircle } from 'lucide-react';
import { useWhatIs } from '../hooks/useWhatIs';
import WhatIsCard from './WhatIsCard';
import WhatIsFormModal from './WhatIsFormModal';
import type { WhatIsEntry, WhatIsCategory } from '../types/whatis';
import { WHATIS_CATEGORY_CONFIG } from '../types/whatis';

type CategoryFilter = 'all' | WhatIsCategory;

export default function WhatIsSection() {
  const { entries, addEntry, updateEntry, deleteEntry, resetWhatIs } = useWhatIs();
  const [formOpen, setFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<WhatIsEntry | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');

  const filtered = useMemo(() => {
    return entries.filter(e => {
      if (categoryFilter !== 'all' && e.category !== categoryFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          e.question.toLowerCase().includes(q) ||
          e.answer.toLowerCase().includes(q) ||
          e.scriptureRefs.toLowerCase().includes(q) ||
          (e.source || '').toLowerCase().includes(q)
        );
      }
      return true;
    }).sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : new Date(a.createdAt).getTime();
      const dateB = b.date ? new Date(b.date).getTime() : new Date(b.createdAt).getTime();
      return dateB - dateA;
    });
  }, [entries, search, categoryFilter]);

  const counts = useMemo(() => {
    const c: Partial<Record<WhatIsCategory, number>> = {};
    entries.forEach(e => { c[e.category] = (c[e.category] || 0) + 1; });
    return c;
  }, [entries]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-4">
          <HelpCircle size={14} className="text-cyan-400" />
          <span className="text-xs font-bold tracking-[0.2em] text-cyan-400 uppercase">Answers From The Word</span>
        </div>
        <h1
          className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2 text-white"
          style={{ fontFamily: "'Montserrat', 'Inter', sans-serif" }}
        >
          What Is?
        </h1>
        <p className="text-cyan-200/60 text-sm max-w-xl mx-auto">
          A bank of questions with scripture-backed answers, rhema words, and insight — so you always know where to turn.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions, scriptures, answers..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all text-sm"
          />
        </div>
        <button
          onClick={() => { setEditingEntry(null); setFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 text-white text-sm font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.02] active:scale-95 transition-all whitespace-nowrap"
        >
          <Plus size={16} /> New Entry
        </button>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mr-1">Category:</span>
        <button
          onClick={() => setCategoryFilter('all')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
            categoryFilter === 'all'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'bg-slate-800/60 text-slate-400 border border-slate-700 hover:border-slate-600'
          }`}
        >
          All ({entries.length})
        </button>
        {(Object.entries(WHATIS_CATEGORY_CONFIG) as [WhatIsCategory, typeof WHATIS_CATEGORY_CONFIG[WhatIsCategory]][]).map(([key, conf]) => {
          const count = counts[key] || 0;
          if (count === 0 && categoryFilter !== key) return null;
          return (
            <button
              key={key}
              onClick={() => setCategoryFilter(key === categoryFilter ? 'all' : key)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                categoryFilter === key
                  ? `${conf.bg} ${conf.text} border ${conf.border}`
                  : 'bg-slate-800/60 text-slate-400 border border-slate-700 hover:border-slate-600'
              }`}
            >
              {conf.emoji} {conf.label} {count > 0 && `(${count})`}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(entry => (
            <WhatIsCard
              key={entry.id}
              entry={entry}
              onEdit={setEditingEntry}
              onDelete={deleteEntry}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-dashed border-slate-700">
          <div className="inline-flex h-16 w-16 rounded-2xl bg-cyan-500/10 items-center justify-center mb-4 text-3xl">
            ❓
          </div>
          <h3 className="text-cyan-200/70 font-semibold mb-1">
            {entries.length === 0 ? 'No entries yet' : 'No matches'}
          </h3>
          <p className="text-slate-400 text-sm mb-4">
            {entries.length === 0
              ? 'Start building your bank of questions and scripture-backed answers'
              : 'Try adjusting your search or filter'}
          </p>
          {entries.length === 0 && (
            <button
              onClick={() => setFormOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-sm font-semibold hover:bg-cyan-500/30 transition-all"
            >
              <Plus size={16} /> Add Your First Entry
            </button>
          )}
        </div>
      )}

      {/* Verse */}
      <div className="mt-12 text-center">
        <div className="inline-block px-8 py-5 rounded-2xl bg-slate-900/50 border border-cyan-500/20 backdrop-blur-sm">
          <p className="text-cyan-200/90 italic text-base mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            <span className="text-cyan-400/60">"</span>
            Study to shew thyself approved unto God, a workman that needeth not to be ashamed, rightly dividing the word of truth.
            <span className="text-cyan-400/60">"</span>
          </p>
          <p className="text-cyan-400 text-xs font-bold tracking-widest">
            — 2 TIMOTHY 2:15 ✦ JJM 2026
          </p>
        </div>
      </div>

      {/* Reset */}
      {entries.length > 0 && (
        <div className="mt-8 text-center">
          <button
            onClick={() => { if (confirm('Delete ALL entries?')) resetWhatIs(); }}
            className="text-xs text-slate-500 hover:text-rose-400 transition-colors"
          >
            Clear All Entries
          </button>
        </div>
      )}

      {/* Modals */}
      {formOpen && !editingEntry && (
        <WhatIsFormModal
          onClose={() => setFormOpen(false)}
          onSubmit={(data) => { addEntry(data); setFormOpen(false); }}
        />
      )}
      {editingEntry && (
        <WhatIsFormModal
          initial={editingEntry}
          onClose={() => setEditingEntry(null)}
          onSubmit={(data) => { updateEntry(editingEntry.id, data); setEditingEntry(null); }}
        />
      )}
    </div>
  );
}
