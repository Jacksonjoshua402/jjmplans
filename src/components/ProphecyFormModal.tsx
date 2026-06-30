import { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import type { Prophecy, ProphecyType, ProphecyStatus } from '../types/prophecies';
import { PROPHECY_TYPE_CONFIG, PROPHECY_STATUS_CONFIG } from '../types/prophecies';

interface ProphecyFormModalProps {
  initial?: Prophecy | null;
  onSubmit: (data: Omit<Prophecy, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

export default function ProphecyFormModal({ initial, onSubmit, onClose }: ProphecyFormModalProps) {
  const [title, setTitle] = useState(initial?.title || '');
  const [content, setContent] = useState(initial?.content || '');
  const [type, setType] = useState<ProphecyType>(initial?.type || 'prophecy');
  const [status, setStatus] = useState<ProphecyStatus>(initial?.status || 'pending');
  const [date, setDate] = useState(initial?.date || '');
  const [source, setSource] = useState(initial?.source || '');
  const [scriptureRef, setScriptureRef] = useState(initial?.scriptureRef || '');
  const [notes, setNotes] = useState(initial?.notes || '');
  const [tags, setTags] = useState(initial?.tags?.join(', ') || '');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit({
      title: title.trim() || 'Untitled Prophecy',
      content: content.trim(),
      type,
      status,
      date: date || undefined,
      source: source.trim() || undefined,
      scriptureRef: scriptureRef.trim() || undefined,
      notes: notes.trim(),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
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
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-xl shadow-lg shadow-violet-500/20">
              🔮
            </div>
            <div>
              <p className="text-[10px] text-violet-400/70 font-bold tracking-[0.2em] uppercase">PROPHECY & RHEMA</p>
              <h3 className="text-lg font-bold text-white">{initial ? 'Edit Prophecy' : 'New Prophecy'}</h3>
            </div>
          </div>

          {/* Type selector */}
          <div>
            <label className="block text-xs font-bold tracking-[0.15em] text-slate-400 uppercase mb-2">Type</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(PROPHECY_TYPE_CONFIG).map(([key, conf]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setType(key as ProphecyType)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    type === key
                      ? `${conf.bg} ${conf.text} ${conf.border}`
                      : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:bg-slate-800'
                  }`}
                >
                  {conf.emoji} {conf.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold tracking-[0.15em] text-slate-400 uppercase mb-2">Title (optional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="A brief title for this prophecy"
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all text-sm"
            />
          </div>

          {/* Content - the actual prophecy */}
          <div>
            <label className="block text-xs font-bold tracking-[0.15em] text-slate-400 uppercase mb-2">
              The Prophecy / Word *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              autoFocus
              placeholder="Write down the exact prophecy or word you received..."
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all text-sm resize-none"
            />
          </div>

          {/* Date & Source */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold tracking-[0.15em] text-slate-400 uppercase mb-2">Date Received</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all text-sm"
              />
              {formattedDate && (
                <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5">
                  <Calendar size={12} /> {formattedDate}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold tracking-[0.15em] text-slate-400 uppercase mb-2">Source / Speaker</label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Who gave the prophecy?"
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all text-sm"
              />
            </div>
          </div>

          {/* Scripture & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold tracking-[0.15em] text-slate-400 uppercase mb-2">Scripture Reference</label>
              <input
                type="text"
                value={scriptureRef}
                onChange={(e) => setScriptureRef(e.target.value)}
                placeholder="e.g. Jeremiah 29:11"
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-[0.15em] text-slate-400 uppercase mb-2">Status</label>
              <div className="flex gap-2">
                {(Object.entries(PROPHECY_STATUS_CONFIG) as [ProphecyStatus, { label: string; color: string; bg: string }][]).map(([key, conf]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setStatus(key)}
                    className={`flex-1 px-2 py-2.5 rounded-xl text-[11px] font-semibold border transition-all ${
                      status === key
                        ? `${conf.bg} ${conf.color} border-current`
                        : 'bg-slate-800/50 text-slate-500 border-slate-700/50 hover:bg-slate-800'
                    }`}
                  >
                    {conf.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold tracking-[0.15em] text-slate-400 uppercase mb-2">Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. healing, breakthrough, family"
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all text-sm"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold tracking-[0.15em] text-slate-400 uppercase mb-2">Personal Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Your insights, fulfillment progress, observations..."
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all text-sm resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold text-sm tracking-wider shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.01] active:scale-95 transition-all"
          >
            {initial ? 'Save Changes' : 'Save Prophecy'}
          </button>
        </form>
      </div>
    </div>
  );
}
