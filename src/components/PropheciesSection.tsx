import { useState, useMemo } from 'react';
import { Plus, Search, Sparkles } from 'lucide-react';
import { useProphecies } from '../hooks/useProphecies';
import ProphecyCard from './ProphecyCard';
import ProphecyFormModal from './ProphecyFormModal';
import type { Prophecy, ProphecyType, ProphecyStatus } from '../types/prophecies';
import { PROPHECY_TYPE_CONFIG, PROPHECY_STATUS_CONFIG } from '../types/prophecies';

type StatusFilter = 'all' | ProphecyStatus;
type TypeFilter = 'all' | ProphecyType;

export default function PropheciesSection() {
  const { prophecies, addProphecy, updateProphecy, deleteProphecy, resetProphecies } = useProphecies();
  const [formOpen, setFormOpen] = useState(false);
  const [editingProphecy, setEditingProphecy] = useState<Prophecy | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');

  const filtered = useMemo(() => {
    return prophecies.filter(p => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (typeFilter !== 'all' && p.type !== typeFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          (p.source || '').toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q))
        );
      }
      return true;
    }).sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : new Date(a.createdAt).getTime();
      const dateB = b.date ? new Date(b.date).getTime() : new Date(b.createdAt).getTime();
      return dateB - dateA;
    });
  }, [prophecies, search, statusFilter, typeFilter]);

  const stats = {
    total: prophecies.length,
    pending: prophecies.filter(p => p.status === 'pending').length,
    inProgress: prophecies.filter(p => p.status === 'in-progress').length,
    fulfilled: prophecies.filter(p => p.status === 'fulfilled').length,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 mb-4">
          <Sparkles size={14} className="text-violet-400" />
          <span className="text-xs font-bold tracking-[0.2em] text-violet-400 uppercase">Prophetic Words</span>
        </div>
        <h1
          className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            background: 'linear-gradient(135deg, #ddd6fe 0%, #a78bfa 50%, #7c3aed 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Prophecy & Rhema
        </h1>
        <p className="text-violet-200/60 text-sm max-w-xl mx-auto">
          Record prophecies, rhema words, dreams, and visions you have received. Track their fulfillment over time.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard label="Total" count={stats.total} color="from-violet-500/20 to-fuchsia-500/20" textColor="text-violet-300" />
        <StatCard label="Pending" count={stats.pending} color="from-slate-700/40 to-slate-800/40" textColor="text-slate-300" />
        <StatCard label="In Progress" count={stats.inProgress} color="from-amber-500/15 to-orange-500/15" textColor="text-amber-300" />
        <StatCard label="Fulfilled" count={stats.fulfilled} color="from-emerald-500/15 to-teal-500/15" textColor="text-emerald-300" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search prophecies, sources, tags..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all text-sm"
          />
        </div>
        <button
          onClick={() => { setEditingProphecy(null); setFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.02] active:scale-95 transition-all whitespace-nowrap"
        >
          <Plus size={16} /> New Prophecy
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Status:</span>
        <div className="flex flex-wrap gap-1.5">
          {(['all', 'pending', 'in-progress', 'fulfilled'] as StatusFilter[]).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                statusFilter === s
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
                  : 'bg-slate-800/60 text-slate-400 border border-slate-700 hover:border-slate-600'
              }`}
            >
              {s === 'all' ? 'All' : PROPHECY_STATUS_CONFIG[s as ProphecyStatus].label}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block" />

        <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Type:</span>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              typeFilter === 'all'
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
                : 'bg-slate-800/60 text-slate-400 border border-slate-700 hover:border-slate-600'
            }`}
          >
            All
          </button>
          {(Object.entries(PROPHECY_TYPE_CONFIG) as [ProphecyType, typeof PROPHECY_TYPE_CONFIG[ProphecyType]][]).map(([key, conf]) => (
            <button
              key={key}
              onClick={() => setTypeFilter(key)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                typeFilter === key
                  ? `${conf.bg} ${conf.text} border ${conf.border}`
                  : 'bg-slate-800/60 text-slate-400 border border-slate-700 hover:border-slate-600'
              }`}
            >
              {conf.emoji} {conf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Prophecy grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <ProphecyCard
              key={p.id}
              prophecy={p}
              onEdit={setEditingProphecy}
              onDelete={deleteProphecy}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-dashed border-slate-700">
          <div className="inline-flex h-16 w-16 rounded-2xl bg-violet-500/10 items-center justify-center mb-4 text-3xl">
            🔮
          </div>
          <h3 className="text-violet-200/70 font-semibold mb-1">
            {prophecies.length === 0 ? 'No prophecies recorded yet' : 'No matches'}
          </h3>
          <p className="text-slate-400 text-sm mb-4">
            {prophecies.length === 0
              ? 'Start recording the prophetic words spoken over your life'
              : 'Try adjusting your filters'}
          </p>
          {prophecies.length === 0 && (
            <button
              onClick={() => setFormOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-500/20 border border-violet-500/40 text-violet-300 text-sm font-semibold hover:bg-violet-500/30 transition-all"
            >
              <Plus size={16} /> Record Your First Prophecy
            </button>
          )}
        </div>
      )}

      {/* Verse */}
      <div className="mt-12 text-center">
        <div className="inline-block px-8 py-5 rounded-2xl bg-slate-900/50 border border-violet-500/20 backdrop-blur-sm">
          <p className="text-violet-200/90 italic text-base mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            <span className="text-violet-400/60">"</span>
            Despise not prophesyings. Prove all things; hold fast that which is good.
            <span className="text-violet-400/60">"</span>
          </p>
          <p className="text-violet-400 text-xs font-bold tracking-widest">
            — 1 THESSALONIANS 5:20-21 ✦ JJM 2026
          </p>
        </div>
      </div>

      {/* Reset */}
      {prophecies.length > 0 && (
        <div className="mt-8 text-center">
          <button
            onClick={() => { if (confirm('Delete ALL prophecies?')) resetProphecies(); }}
            className="text-xs text-slate-500 hover:text-rose-400 transition-colors"
          >
            Clear All Prophecies
          </button>
        </div>
      )}

      {/* Modals */}
      {formOpen && !editingProphecy && (
        <ProphecyFormModal
          onClose={() => setFormOpen(false)}
          onSubmit={(data) => { addProphecy(data); setFormOpen(false); }}
        />
      )}
      {editingProphecy && (
        <ProphecyFormModal
          initial={editingProphecy}
          onClose={() => setEditingProphecy(null)}
          onSubmit={(data) => { updateProphecy(editingProphecy.id, data); setEditingProphecy(null); }}
        />
      )}
    </div>
  );
}

function StatCard({ label, count, color, textColor }: { label: string; count: number; color: string; textColor: string }) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-xl p-4 text-center border border-slate-700/30`}>
      <p className={`text-2xl font-extrabold ${textColor}`}>{count}</p>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{label}</p>
    </div>
  );
}
