import { useState } from 'react';
import { X } from 'lucide-react';
import type { Target, Frequency, Priority, TargetStatus } from '../types/targets';
import { TARGET_CATEGORIES, FREQUENCY_LABELS, getWeekKey, getMonthKey } from '../types/targets';

interface TargetFormModalProps {
  initial?: Partial<Target>;
  onSubmit: (data: Omit<Target, 'id' | 'createdAt'>) => void;
  onClose: () => void;
  modalTitle?: string;
}

export default function TargetFormModal({ initial, onSubmit, onClose, modalTitle = 'Add Target' }: TargetFormModalProps) {
  const today = new Date();
  const [formTitle, setFormTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [frequency, setFrequency] = useState<Frequency>(initial?.frequency || 'weekly');
  const [priority, setPriority] = useState<Priority>(initial?.priority || 'medium');
  const [status] = useState<TargetStatus>(initial?.status || 'pending');
  const [progress, setProgress] = useState(initial?.progress || 0);
  const [category, setCategory] = useState(initial?.category || 'Spiritual');
  const [weekKey, setWeekKey] = useState(initial?.weekKey || getWeekKey(today));
  const [monthKey, setMonthKey] = useState(initial?.monthKey || getMonthKey(today));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setErrors({ title: 'Title is required' });
      return;
    }

    onSubmit({
      title: formTitle.trim(),
      description: description.trim(),
      frequency,
      priority,
      status,
      progress,
      category,
      weekKey: frequency !== 'monthly' ? weekKey : undefined,
      monthKey: frequency !== 'weekly' ? monthKey : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-0 sm:p-4 animate-in overflow-y-auto" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm fixed" />
      <div
        className="relative w-full max-w-lg bg-gradient-to-br from-slate-800 to-slate-900 rounded-none sm:rounded-2xl shadow-2xl border border-amber-500/20 my-0 sm:my-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 px-6 py-4 border-b border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-transparent flex items-center justify-between backdrop-blur-md">
          <h3 className="text-lg font-bold text-amber-300" style={{ fontFamily: "'Inter', sans-serif" }}>
            {modalTitle}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-bold tracking-wider text-amber-300/80 uppercase mb-1.5">Title *</label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => { setFormTitle(e.target.value); setErrors({}); }}
              autoFocus
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all text-sm"
              placeholder="e.g. Daily Bible Study"
            />
            {errors.title && <p className="text-xs text-rose-400 mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold tracking-wider text-amber-300/80 uppercase mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all text-sm resize-none"
              placeholder="Add more details..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold tracking-wider text-amber-300/80 uppercase mb-1.5">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as Frequency)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900/50 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-sm"
              >
                {Object.entries(FREQUENCY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold tracking-wider text-amber-300/80 uppercase mb-1.5">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900/50 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold tracking-wider text-amber-300/80 uppercase mb-1.5">Category</label>
            <div className="flex flex-wrap gap-2">
              {TARGET_CATEGORIES.map((cat) => (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => setCategory(cat.label)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    category === cat.label
                      ? `${cat.bg} ${cat.text} ${cat.border}`
                      : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {frequency !== 'monthly' && (
              <div>
                <label className="block text-xs font-bold tracking-wider text-amber-300/80 uppercase mb-1.5">Week Key</label>
                <input
                  type="text"
                  value={weekKey}
                  onChange={(e) => setWeekKey(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900/50 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-sm"
                  placeholder="e.g. 2026-W15"
                />
              </div>
            )}
            {frequency !== 'weekly' && (
              <div>
                <label className="block text-xs font-bold tracking-wider text-amber-300/80 uppercase mb-1.5">Month Key</label>
                <input
                  type="text"
                  value={monthKey}
                  onChange={(e) => setMonthKey(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900/50 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-sm"
                  placeholder="e.g. 2026-04"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-bold tracking-wider text-amber-300/80 uppercase mb-1.5">Progress %</label>
              <input
                type="number"
                min={0}
                max={100}
                value={progress}
                onChange={(e) => setProgress(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900/50 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm tracking-wider shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-[1.01] active:scale-95 transition-all"
          >
            Save Target
          </button>
        </form>
      </div>
    </div>
  );
}
