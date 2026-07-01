import { useState, useMemo } from 'react';
import { Plus, Search, Star, Pencil, Trash2, BookOpen, Volume2, X } from 'lucide-react';
import { useConfessions } from '../hooks/useConfessions';
import type { Confession, ConfessionCategory } from '../types/confessions';
import { CONFESSION_CATEGORIES } from '../types/confessions';

export default function ConfessionsSection() {
  const { confessions, addConfession, updateConfession, deleteConfession, toggleFavorite, resetConfessions } = useConfessions();
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<'all' | ConfessionCategory>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [speakingMode, setSpeakingMode] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(0);

  // Form state
  const [formText, setFormText] = useState('');
  const [formCat, setFormCat] = useState<ConfessionCategory>('identity');
  const [formScripture, setFormScripture] = useState('');

  const filtered = useMemo(() => {
    return confessions.filter(c => {
      if (catFilter !== 'all' && c.category !== catFilter) return false;
      if (showFavoritesOnly && !c.isFavorite) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return c.text.toLowerCase().includes(q) || (c.scriptureRef || '').toLowerCase().includes(q);
      }
      return true;
    });
  }, [confessions, search, catFilter, showFavoritesOnly]);

  const favorites = confessions.filter(c => c.isFavorite);

  const openEdit = (c: Confession) => {
    setEditingId(c.id);
    setFormText(c.text);
    setFormCat(c.category);
    setFormScripture(c.scriptureRef || '');
    setFormOpen(true);
  };

  const openNew = () => {
    setEditingId(null);
    setFormText('');
    setFormCat('identity');
    setFormScripture('');
    setFormOpen(true);
  };

  const handleSubmit = () => {
    if (!formText.trim()) return;
    if (editingId) {
      updateConfession(editingId, { text: formText.trim(), category: formCat, scriptureRef: formScripture.trim() || undefined });
    } else {
      addConfession({ text: formText.trim(), category: formCat, scriptureRef: formScripture.trim() || undefined, isFavorite: false });
    }
    setFormOpen(false);
    setEditingId(null);
  };

  // Speaking mode — read through confessions one by one
  const speakList = favorites.length > 0 ? favorites : confessions;
  const currentSpeak = speakList[speakingIndex];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 mb-4">
          <Volume2 size={14} className="text-amber-400" />
          <span className="text-xs font-bold tracking-[0.2em] text-amber-400 uppercase">Daily Confessions</span>
        </div>
        <h1
          className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2 text-white"
          style={{ fontFamily: "'Montserrat', 'Inter', sans-serif" }}
        >
          My Confessions
        </h1>
        <p className="text-amber-200/60 text-sm max-w-xl mx-auto">
          Declare who you are in Christ. Add your confessions, mark favorites, and speak them daily.
        </p>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
        <button onClick={openNew} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-[1.02] active:scale-95 transition-all">
          <Plus size={16} /> Add Confession
        </button>
        {confessions.length > 0 && (
          <button
            onClick={() => { setSpeakingMode(true); setSpeakingIndex(0); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Volume2 size={16} /> Speak Mode
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-8">
        <div className="bg-gradient-to-br from-amber-500/15 to-orange-500/15 rounded-xl p-4 text-center border border-amber-500/20">
          <p className="text-2xl font-extrabold text-amber-300">{confessions.length}</p>
          <p className="text-[10px] text-amber-400/70 font-bold uppercase tracking-wider">Total</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500/15 to-amber-500/15 rounded-xl p-4 text-center border border-yellow-500/20">
          <p className="text-2xl font-extrabold text-yellow-300">{favorites.length}</p>
          <p className="text-[10px] text-yellow-400/70 font-bold uppercase tracking-wider">Favorites</p>
        </div>
        <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 rounded-xl p-4 text-center border border-slate-700/30">
          <p className="text-2xl font-extrabold text-slate-300">{Object.keys(CONFESSION_CATEGORIES).filter(k => confessions.some(c => c.category === k)).length}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Categories</p>
        </div>
      </div>

      {/* Search & filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search confessions..." className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all text-sm" />
        </div>
        <button onClick={() => setShowFavoritesOnly(!showFavoritesOnly)} className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${showFavoritesOnly ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-800/60 text-slate-400 border-slate-700'}`}>
          <Star size={13} className={showFavoritesOnly ? 'fill-amber-400' : ''} /> Favorites
        </button>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        <button onClick={() => setCatFilter('all')} className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${catFilter === 'all' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800/60 text-slate-400 border border-slate-700'}`}>All</button>
        {(Object.entries(CONFESSION_CATEGORIES) as [ConfessionCategory, typeof CONFESSION_CATEGORIES[ConfessionCategory]][]).map(([key, conf]) => (
          <button key={key} onClick={() => setCatFilter(key)} className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${catFilter === key ? `${conf.bg} ${conf.text} border ${conf.border}` : 'bg-slate-800/60 text-slate-400 border border-slate-700'}`}>
            {conf.emoji} {conf.label}
          </button>
        ))}
      </div>

      {/* Confession cards */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map(c => {
            const cat = CONFESSION_CATEGORIES[c.category];
            return (
              <div key={c.id} className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl border border-slate-700/50 p-5 hover:border-amber-500/30 transition-all">
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-r from-amber-500 to-orange-500" />
                </div>
                <div className="flex items-start gap-4 mt-1">
                  <button onClick={() => toggleFavorite(c.id)} className="flex-shrink-0 mt-1">
                    <Star size={18} className={`transition-all ${c.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-slate-600 hover:text-amber-400/60'}`} strokeWidth={1.5} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-base text-white leading-relaxed font-medium italic">
                      "{c.text}"
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${cat.bg} ${cat.text} border ${cat.border}`}>
                        {cat.emoji} {cat.label}
                      </span>
                      {c.scriptureRef && (
                        <span className="flex items-center gap-1 text-[11px] text-amber-400/70">
                          <BookOpen size={10} /> {c.scriptureRef}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-all"><Pencil size={13} /></button>
                    <button onClick={() => { if (confirm('Delete?')) deleteConfession(c.id); }} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-all"><Trash2 size={13} /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-dashed border-slate-700">
          <div className="text-4xl mb-4">✨</div>
          <h3 className="text-amber-200/70 font-semibold mb-1">{confessions.length === 0 ? 'No confessions yet' : 'No matches'}</h3>
          <p className="text-slate-400 text-sm mb-4">{confessions.length === 0 ? 'Start declaring who you are in Christ' : 'Try adjusting your filters'}</p>
          {confessions.length === 0 && (
            <button onClick={openNew} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-sm font-semibold hover:bg-amber-500/30 transition-all">
              <Plus size={16} /> Add Your First Confession
            </button>
          )}
        </div>
      )}

      {/* Verse */}
      <div className="mt-12 text-center">
        <div className="inline-block px-8 py-5 rounded-2xl bg-slate-900/50 border border-amber-500/20 backdrop-blur-sm">
          <p className="text-amber-200/90 italic text-base mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            <span className="text-amber-400/60">"</span>Death and life are in the power of the tongue.<span className="text-amber-400/60">"</span>
          </p>
          <p className="text-amber-400 text-xs font-bold tracking-widest">— PROVERBS 18:21 ✦ JJM 2026</p>
        </div>
      </div>

      {confessions.length > 0 && (
        <div className="mt-8 text-center">
          <button onClick={() => { if (confirm('Delete ALL confessions?')) resetConfessions(); }} className="text-xs text-slate-500 hover:text-rose-400 transition-colors">Clear All Confessions</button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-10 overflow-y-auto animate-in" onClick={() => setFormOpen(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm fixed" />
          <div className="relative w-full max-w-lg bg-gradient-to-br from-[#0f1f3d] to-[#0a1528] rounded-2xl shadow-2xl border border-slate-700/50 my-auto" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setFormOpen(false)} className="absolute top-3 right-3 z-20 h-9 w-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-700/50">
              <X size={18} />
            </button>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-700/50">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xl shadow-lg shadow-amber-500/20">✨</div>
                <div>
                  <p className="text-[10px] text-amber-400/70 font-bold tracking-[0.2em] uppercase">CONFESSIONS</p>
                  <h3 className="text-lg font-bold text-white">{editingId ? 'Edit Confession' : 'New Confession'}</h3>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold tracking-[0.15em] text-slate-400 uppercase mb-2">Your Confession *</label>
                <textarea value={formText} onChange={(e) => setFormText(e.target.value)} rows={4} autoFocus placeholder="I am the righteousness of God in Christ Jesus..." className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all text-sm resize-none" />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-[0.15em] text-slate-400 uppercase mb-2">Category</label>
                <div className="flex flex-wrap gap-2">
                  {(Object.entries(CONFESSION_CATEGORIES) as [ConfessionCategory, typeof CONFESSION_CATEGORIES[ConfessionCategory]][]).map(([key, conf]) => (
                    <button key={key} type="button" onClick={() => setFormCat(key)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${formCat === key ? `${conf.bg} ${conf.text} ${conf.border}` : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:bg-slate-800'}`}>
                      {conf.emoji} {conf.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold tracking-[0.15em] text-slate-400 uppercase mb-2">Scripture Reference</label>
                <input type="text" value={formScripture} onChange={(e) => setFormScripture(e.target.value)} placeholder="e.g. 2 Corinthians 5:21" className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all text-sm" />
              </div>
              <button onClick={handleSubmit} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm tracking-wider shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-[1.01] active:scale-95 transition-all">
                {editingId ? 'Save Changes' : 'Save Confession'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Speaking Mode Overlay */}
      {speakingMode && currentSpeak && (
        <div className="fixed inset-0 z-50 bg-[#0a0f1f] flex flex-col" onClick={() => setSpeakingMode(false)}>
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-2" onClick={e => e.stopPropagation()}>
            <p className="text-[10px] text-amber-400/70 font-bold tracking-[0.3em] uppercase">
              CONFESSION {speakingIndex + 1} OF {speakList.length}
            </p>
            <button onClick={() => setSpeakingMode(false)} className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700/50">
              <X size={18} />
            </button>
          </div>

          {/* Progress bar */}
          <div className="h-0.5 bg-slate-800 mx-5 rounded-full overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500" style={{ width: `${((speakingIndex + 1) / speakList.length) * 100}%` }} />
          </div>

          {/* Main text — scrollable, vertically centred */}
          <div className="flex-1 overflow-y-auto flex items-center justify-center px-6 py-8" onClick={e => e.stopPropagation()}>
            <div className="text-center max-w-2xl w-full">
              <p
                className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight italic"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {currentSpeak.text}
              </p>
              {currentSpeak.scriptureRef && (
                <p className="text-amber-400 text-sm font-semibold mt-6">— {currentSpeak.scriptureRef}</p>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="px-5 pb-8 pt-4 flex items-center justify-center gap-4" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSpeakingIndex(i => Math.max(0, i - 1))}
              disabled={speakingIndex === 0}
              className="flex-1 max-w-[140px] py-3.5 rounded-2xl bg-slate-800 text-white text-sm font-bold disabled:opacity-30 hover:bg-slate-700 transition-all"
            >
              ← Previous
            </button>
            <button
              onClick={() => { if (speakingIndex < speakList.length - 1) setSpeakingIndex(i => i + 1); else setSpeakingMode(false); }}
              className="flex-1 max-w-[180px] py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold shadow-lg shadow-amber-500/30 transition-all"
            >
              {speakingIndex < speakList.length - 1 ? 'Next →' : '✓ Done'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
