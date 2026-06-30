import { useState } from 'react';
import { X, Plus, Trash2, BookOpen } from 'lucide-react';
import type { Pillar } from '../types/pillars';

interface PillarFormModalProps {
  initial?: Pillar;
  onSubmit: (updates: Partial<Pillar>) => void;
  onClose: () => void;
}

export default function PillarFormModal({ initial, onSubmit, onClose }: PillarFormModalProps) {
  const [description, setDescription] = useState(initial?.description || '');
  const [keyVerses, setKeyVerses] = useState<string[]>(initial?.keyVerses?.length ? initial.keyVerses : ['']);
  const [notes, setNotes] = useState(initial?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      description: description.trim(),
      keyVerses: keyVerses.filter(v => v.trim()),
      notes: notes.trim(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-10 overflow-y-auto animate-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm fixed" />
      <div
        className="relative w-full max-w-2xl bg-gradient-to-br from-[#0f1f3d] to-[#0a1528] rounded-2xl shadow-2xl border border-slate-700/50 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 h-9 w-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-700/50"
        >
          <X size={18} />
        </button>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-slate-700/50">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xl shadow-lg shadow-amber-500/20">
              {initial?.emoji || '🔑'}
            </div>
            <div>
              <p className="text-[10px] text-amber-400/70 font-bold tracking-[0.2em] uppercase">
                Pillar {initial?.number}
              </p>
              <h3 className="text-lg font-bold text-white">{initial?.title}</h3>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold tracking-[0.15em] text-slate-400 uppercase mb-2">
              Description / Vision
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="What does this pillar mean to you? What is your vision for it?"
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all text-sm resize-none"
            />
          </div>

          {/* Key Verses */}
          <div>
            <label className="block text-xs font-bold tracking-[0.15em] text-slate-400 uppercase mb-2 flex items-center gap-1.5">
              <BookOpen size={12} className="text-amber-400/60" /> Key Verses
            </label>
            <div className="space-y-2">
              {keyVerses.map((verse, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={verse}
                    onChange={(e) => {
                      const newVerses = [...keyVerses];
                      newVerses[i] = e.target.value;
                      setKeyVerses(newVerses);
                    }}
                    placeholder="e.g. John 3:16"
                    className="flex-1 px-3 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/60 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/40 transition-all text-sm"
                  />
                  {keyVerses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setKeyVerses(keyVerses.filter((_, idx) => idx !== i))}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => setKeyVerses([...keyVerses, ''])}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                <Plus size={12} /> Add Verse
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold tracking-[0.15em] text-slate-400 uppercase mb-2">
              Personal Notes & Insights
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              placeholder="Write your convictions, revelations, and insights about this pillar..."
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all text-sm resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm tracking-wider shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-[1.01] active:scale-95 transition-all"
          >
            Save Pillar Details
          </button>
        </form>
      </div>
    </div>
  );
}
