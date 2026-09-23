import { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import type { WhatIsEntry, WhatIsCategory } from '../types/whatis';
import { WHATIS_CATEGORY_CONFIG } from '../types/whatis';

interface WhatIsFormModalProps {
  initial?: WhatIsEntry | null;
  onSubmit: (data: Omit<WhatIsEntry, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

export default function WhatIsFormModal({ initial, onSubmit, onClose }: WhatIsFormModalProps) {
  const [question, setQuestion] = useState(initial?.question || '');
  const [category, setCategory] = useState<WhatIsCategory>(initial?.category || 'bible');
  const [scriptureRefs, setScriptureRefs] = useState(initial?.scriptureRefs || '');
  const [answer, setAnswer] = useState(initial?.answer || '');
  const [source, setSource] = useState(initial?.source || '');
  const [date, setDate] = useState(initial?.date || '');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    onSubmit({
      question: question.trim(),
      category,
      scriptureRefs: scriptureRefs.trim(),
      answer: answer.trim(),
      source: source.trim() || undefined,
      date: date || undefined,
    });
  };

  const formattedDate = date
    ? new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      })
    : '';

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
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-600 flex items-center justify-center text-xl shadow-lg shadow-cyan-500/20">
              ❓
            </div>
            <div>
              <p className="text-[10px] text-cyan-400/70 font-bold tracking-[0.2em] uppercase">WHAT IS?</p>
              <h3 className="text-lg font-bold text-white">{initial ? 'Edit Entry' : 'New Entry'}</h3>
            </div>
          </div>

          {/* Category selector */}
          <div>
            <label className="block text-xs font-bold tracking-[0.15em] text-slate-400 uppercase mb-2">Category</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(WHATIS_CATEGORY_CONFIG).map(([key, conf]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCategory(key as WhatIsCategory)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    category === key
                      ? `${conf.bg} ${conf.text} ${conf.border}`
                      : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:bg-slate-800'
                  }`}
                >
                  {conf.emoji} {conf.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question */}
          <div>
            <label className="block text-xs font-bold tracking-[0.15em] text-slate-400 uppercase mb-2">
              What is...? (Question) *
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={2}
              autoFocus
              placeholder="e.g. A brother can be under attack, this is the solution"
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all text-sm resize-none"
            />
          </div>

          {/* Scripture references */}
          <div>
            <label className="block text-xs font-bold tracking-[0.15em] text-slate-400 uppercase mb-2">
              Scripture Reference(s)
            </label>
            <textarea
              value={scriptureRefs}
              onChange={(e) => setScriptureRefs(e.target.value)}
              rows={2}
              placeholder={'e.g. Luke 22:31-32\nActs 12:1-6'}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all text-sm resize-none"
            />
          </div>

          {/* Answer / rhema */}
          <div>
            <label className="block text-xs font-bold tracking-[0.15em] text-slate-400 uppercase mb-2">
              Answer / Rhema (optional)
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={5}
              placeholder="Any extra explanation, insight, or rhema word to go with the scriptures above..."
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all text-sm resize-none"
            />
          </div>

          {/* Source & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold tracking-[0.15em] text-slate-400 uppercase mb-2">Source / Speaker</label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Who taught or shared this?"
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-[0.15em] text-slate-400 uppercase mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all text-sm"
              />
              {formattedDate && (
                <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5">
                  <Calendar size={12} /> {formattedDate}
                </p>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 text-white font-bold text-sm tracking-wider shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.01] active:scale-95 transition-all"
          >
            {initial ? 'Save Changes' : 'Save Entry'}
          </button>
        </form>
      </div>
    </div>
  );
}
