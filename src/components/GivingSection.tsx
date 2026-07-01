import { useState } from 'react';
import { Plus, Trash2, Pencil, Check, X, Banknote, Target, ChevronDown, ChevronUp } from 'lucide-react';
import { useGiving } from '../hooks/useGiving';
import type { GivingItemType } from '../types/giving';
import { GIVING_TYPES, MONTHS, getMonthKey, parseMonthKey } from '../types/giving';

const now = new Date();
const CURRENT_YEAR = now.getFullYear();
const CURRENT_MONTH_KEY = getMonthKey(CURRENT_YEAR, now.getMonth());

function typeMeta(type: GivingItemType) {
  return GIVING_TYPES.find(t => t.type === type)!;
}

// ── Add Item Modal ───────────────────────────────────────────────────────────
function AddItemModal({ monthKey, onAdd, onClose }: {
  monthKey: string;
  onAdd: (data: { type: GivingItemType; title: string; amount?: string; notes?: string }) => void;
  onClose: () => void;
}) {
  const [type, setType] = useState<GivingItemType>('Giving');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  const { month } = parseMonthKey(monthKey);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/50 rounded-2xl p-5 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-base">Add to {MONTHS[month]}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={18} /></button>
        </div>

        {/* Type selector */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {GIVING_TYPES.map(t => (
            <button
              key={t.type}
              onClick={() => setType(t.type)}
              className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${type === t.type ? `${t.bg} ${t.border} ${t.color}` : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'}`}
            >
              <span className="text-lg">{t.emoji}</span>
              {t.type}
            </button>
          ))}
        </div>

        <input
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 mb-3"
          placeholder="Title / description"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 mb-3"
          placeholder="Amount (e.g. K500, $200) — optional"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <textarea
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 mb-4 resize-none"
          placeholder="Notes — optional"
          rows={2}
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-700 transition-all">Cancel</button>
          <button
            onClick={() => { if (title.trim()) { onAdd({ type, title: title.trim(), amount: amount.trim() || undefined, notes: notes.trim() || undefined }); onClose(); } }}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold shadow-lg transition-all"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Month Card ───────────────────────────────────────────────────────────────
function MonthCard({ monthKey, isCurrent }: { monthKey: string; isCurrent: boolean }) {
  const { month, year } = parseMonthKey(monthKey);
  const { monthly, addItem, toggleItem, deleteItem, updateItem } = useGiving();
  const [open, setOpen] = useState(isCurrent);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAmount, setEditAmount] = useState('');

  const monthData = monthly.find(m => m.monthKey === monthKey);
  const items = monthData?.items || [];
  const done = items.filter(i => i.done).length;

  const typeCounts = GIVING_TYPES.map(t => ({ ...t, count: items.filter(i => i.type === t.type).length })).filter(t => t.count > 0);

  return (
    <div className={`rounded-2xl border transition-all ${isCurrent ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-slate-700/50 bg-slate-900/40'}`}>
      <button
        className="w-full flex items-center justify-between px-4 py-3.5"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-3">
          <span className="text-white font-bold text-sm">{MONTHS[month]} {year}</span>
          {isCurrent && <span className="text-[10px] font-bold tracking-widest text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full">CURRENT</span>}
          {items.length > 0 && <span className="text-[11px] text-slate-400">{done}/{items.length}</span>}
        </div>
        <div className="flex items-center gap-2">
          {items.length > 0 && (
            <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all" style={{ width: `${items.length ? (done / items.length) * 100 : 0}%` }} />
            </div>
          )}
          {open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4">
          {/* Progress bar (mobile) */}
          {items.length > 0 && (
            <div className="mb-3 sm:hidden">
              <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Progress</span><span>{done}/{items.length}</span></div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all" style={{ width: `${items.length ? (done / items.length) * 100 : 0}%` }} />
              </div>
            </div>
          )}

          {/* Type chips */}
          {typeCounts.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {typeCounts.map(t => (
                <span key={t.type} className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${t.bg} ${t.color} border ${t.border}`}>
                  {t.emoji} {t.type} ({t.count})
                </span>
              ))}
            </div>
          )}

          {/* Items */}
          <div className="space-y-2 mb-3">
            {items.map(item => {
              const meta = typeMeta(item.type);
              const isEditing = editId === item.id;
              return (
                <div key={item.id} className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all ${item.done ? 'opacity-50 bg-slate-800/30 border-slate-700/30' : 'bg-slate-800/50 border-slate-700/50'}`}>
                  <button onClick={() => toggleItem(monthKey, item.id)} className="mt-0.5 shrink-0">
                    {item.done
                      ? <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center"><Check size={11} className="text-white" /></div>
                      : <div className="h-5 w-5 rounded-full border-2 border-slate-600" />
                    }
                  </button>
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <div className="space-y-1.5">
                        <input className="w-full bg-slate-700 rounded-lg px-2 py-1 text-white text-sm focus:outline-none" value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                        <input className="w-full bg-slate-700 rounded-lg px-2 py-1 text-white text-xs focus:outline-none" placeholder="Amount" value={editAmount} onChange={e => setEditAmount(e.target.value)} />
                        <div className="flex gap-1">
                          <button onClick={() => { updateItem(monthKey, item.id, { title: editTitle, amount: editAmount || undefined }); setEditId(null); }} className="px-2 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold">Save</button>
                          <button onClick={() => setEditId(null)} className="px-2 py-1 rounded-lg bg-slate-700 text-white text-xs">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[10px] font-bold ${meta.color}`}>{meta.emoji} {item.type}</span>
                          <span className={`text-sm font-medium ${item.done ? 'line-through text-slate-500' : 'text-white'}`}>{item.title}</span>
                          {item.amount && <span className="text-xs text-emerald-400 font-bold">{item.amount}</span>}
                        </div>
                        {item.notes && <p className="text-xs text-slate-400 mt-0.5">{item.notes}</p>}
                      </>
                    )}
                  </div>
                  {!isEditing && (
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => { setEditId(item.id); setEditTitle(item.title); setEditAmount(item.amount || ''); }} className="p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-all"><Pencil size={13} /></button>
                      <button onClick={() => deleteItem(monthKey, item.id)} className="p-1 rounded-lg hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 transition-all"><Trash2 size={13} /></button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setShowAdd(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-slate-600 text-slate-400 hover:border-emerald-500/50 hover:text-emerald-400 text-sm font-semibold transition-all"
          >
            <Plus size={15} /> Add Item
          </button>
        </div>
      )}

      {showAdd && <AddItemModal monthKey={monthKey} onAdd={d => addItem(monthKey, d)} onClose={() => setShowAdd(false)} />}
    </div>
  );
}

// ── Year-End Tab ─────────────────────────────────────────────────────────────
function YearEndTab() {
  const { yearEndTargets, addYearTarget, toggleYearTarget, deleteYearTarget, updateYearTarget } = useGiving();
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const fulfilled = yearEndTargets.filter(t => t.fulfilled).length;

  return (
    <div>
      <div className="mb-5">
        <div className="flex justify-between text-xs text-slate-400 mb-2">
          <span>Year-end progress</span>
          <span>{fulfilled} / {yearEndTargets.length} fulfilled</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 transition-all duration-500"
            style={{ width: `${yearEndTargets.length ? (fulfilled / yearEndTargets.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {yearEndTargets.map(t => (
          <div key={t.id} className={`p-4 rounded-2xl border transition-all ${t.fulfilled ? 'border-amber-500/40 bg-amber-500/5' : 'border-slate-700/50 bg-slate-900/40'}`}>
            {editId === t.id ? (
              <div className="space-y-2">
                <input className="w-full bg-slate-800 rounded-xl px-3 py-2 text-white text-sm focus:outline-none border border-slate-700" value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                <div className="flex gap-2">
                  <button onClick={() => { updateYearTarget(t.id, { title: editTitle }); setEditId(null); }} className="px-3 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-bold">Save</button>
                  <button onClick={() => setEditId(null)} className="px-3 py-1.5 rounded-lg bg-slate-700 text-white text-xs">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <button onClick={() => toggleYearTarget(t.id)} className="mt-0.5 shrink-0">
                  {t.fulfilled
                    ? <div className="h-6 w-6 rounded-full bg-amber-500 flex items-center justify-center"><Check size={13} className="text-white" /></div>
                    : <div className="h-6 w-6 rounded-full border-2 border-slate-600" />
                  }
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-sm font-bold ${t.fulfilled ? 'line-through text-slate-500' : 'text-white'}`}>{t.title}</span>
                    {t.amount && <span className="text-xs text-amber-400 font-bold">{t.amount}</span>}
                  </div>
                  {t.description && <p className="text-xs text-slate-400 mt-0.5">{t.description}</p>}
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => { setEditId(t.id); setEditTitle(t.title); }} className="p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-all"><Pencil size={13} /></button>
                  <button onClick={() => deleteYearTarget(t.id)} className="p-1 rounded-lg hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 transition-all"><Trash2 size={13} /></button>
                </div>
              </div>
            )}
          </div>
        ))}
        {yearEndTargets.length === 0 && (
          <div className="text-center py-12 text-slate-500 text-sm">
            <Target size={36} className="mx-auto mb-3 text-slate-700" />
            No year-end targets yet. Add your first one below.
          </div>
        )}
      </div>

      {showAdd ? (
        <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-2">
          <input className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none" placeholder="Target title" value={title} onChange={e => setTitle(e.target.value)} />
          <input className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none" placeholder="Amount (optional)" value={amount} onChange={e => setAmount(e.target.value)} />
          <textarea className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none resize-none" placeholder="Description (optional)" rows={2} value={desc} onChange={e => setDesc(e.target.value)} />
          <div className="flex gap-2">
            <button onClick={() => setShowAdd(false)} className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm font-semibold">Cancel</button>
            <button onClick={() => { if (title.trim()) { addYearTarget({ title: title.trim(), description: desc.trim() || undefined, amount: amount.trim() || undefined }); setTitle(''); setDesc(''); setAmount(''); setShowAdd(false); } }} className="flex-1 py-2 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-sm font-semibold">Add Target</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowAdd(true)} className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-slate-600 text-slate-400 hover:border-amber-500/50 hover:text-amber-400 text-sm font-semibold transition-all">
          <Plus size={15} /> Add Year-End Target
        </button>
      )}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function GivingSection() {
  const [activeTab, setActiveTab] = useState<'monthly' | 'yearend'>('monthly');

  const allMonthKeys = Array.from({ length: 12 }, (_, i) => getMonthKey(CURRENT_YEAR, i));

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-3">
          <Banknote size={14} className="text-emerald-400" />
          <span className="text-xs font-bold tracking-[0.2em] text-emerald-400 uppercase">Financial Stewardship</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2 text-white" style={{ fontFamily: "'Montserrat', 'Inter', sans-serif" }}>
          My Giving
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Track your giving, partnerships, purchases and payments. Honour God with your finances.
        </p>
      </div>

      {/* Tab toggle */}
      <div className="flex p-1 rounded-full bg-slate-800/70 border border-slate-700/50 mb-6 max-w-xs mx-auto">
        <button onClick={() => setActiveTab('monthly')} className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'monthly' ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}>
          Monthly
        </button>
        <button onClick={() => setActiveTab('yearend')} className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'yearend' ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}>
          End of Year
        </button>
      </div>

      {activeTab === 'monthly' ? (
        <div className="space-y-3">
          {allMonthKeys.map(mk => (
            <MonthCard key={mk} monthKey={mk} isCurrent={mk === CURRENT_MONTH_KEY} />
          ))}
        </div>
      ) : (
        <YearEndTab />
      )}
    </div>
  );
}
