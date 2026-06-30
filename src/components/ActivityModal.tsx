import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Activity, SessionType, ActivityType, DayKey } from '../types';
import { SESSION_CONFIG, ACTIVITY_TYPE_CONFIG, DAYS } from '../types';

interface ActivityModalProps {
  initial?: Partial<Activity>;
  defaultDay: DayKey;
  onSubmit: (activity: Omit<Activity, 'id'>) => void;
  onClose: () => void;
  modalTitle?: string;
}

export default function ActivityModal({ initial, defaultDay, onSubmit, onClose, modalTitle }: ActivityModalProps) {
  const [title, setTitle] = useState(initial?.title || '');
  const [frequency, setFrequency] = useState(initial?.frequency || '');
  const [type, setType] = useState<ActivityType>(initial?.type || 'book');
  const [session, setSession] = useState<SessionType>(initial?.session || 'morning');
  const [day, setDay] = useState<DayKey>(initial?.day || defaultDay);
  const [emoji, setEmoji] = useState(initial?.emoji || '📖');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    onSubmit({
      title: title.trim(),
      frequency: frequency.trim(),
      type,
      session,
      day,
      emoji: emoji || ACTIVITY_TYPE_CONFIG[type].icon,
      completed: initial?.completed || false,
    });
  };

  const emojiOptions = ['📖', '🙏', '🎓', '💻', '🎨', '🧘', '🗣️', '🏃', '💪', '🎬', '📚', '✍️', '🎵'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-amber-500/20 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-transparent">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-amber-300" style={{ fontFamily: "'Playfair Display', serif" }}>
              {modalTitle}
            </h3>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
              <X size={18} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold tracking-wider text-amber-300/80 uppercase mb-1.5">Activity Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setErrors({}); }}
              placeholder="e.g. Bible Study"
              autoFocus
              className={`w-full px-4 py-2.5 rounded-xl bg-slate-900/50 border ${errors.title ? 'border-rose-500' : 'border-slate-700'} text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-sm`}
            />
            {errors.title && <p className="text-xs text-rose-400 mt-1">{errors.title}</p>}
          </div>

          {/* Emoji */}
          <div>
            <label className="block text-xs font-bold tracking-wider text-amber-300/80 uppercase mb-1.5">Icon</label>
            <div className="flex flex-wrap gap-1.5">
              {emojiOptions.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`h-9 w-9 rounded-lg text-xl transition-all ${
                    emoji === e
                      ? 'bg-amber-500/30 ring-2 ring-amber-500/60 scale-110'
                      : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-xs font-bold tracking-wider text-amber-300/80 uppercase mb-1.5">Frequency / Duration</label>
            <input
              type="text"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              placeholder="e.g. TWICE A DAY, 1+ Videos, 3× A DAY"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-sm"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs font-bold tracking-wider text-amber-300/80 uppercase mb-1.5">Activity Type</label>
            <div className="grid grid-cols-5 gap-2">
              {(Object.entries(ACTIVITY_TYPE_CONFIG) as [ActivityType, typeof ACTIVITY_TYPE_CONFIG[ActivityType]][]).map(([key, conf]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setType(key)}
                  className={`px-2 py-2 rounded-lg text-[10px] font-bold tracking-wider border transition-all ${
                    type === key
                      ? `${conf.bg} ${conf.text} ${conf.border} ring-2 ring-amber-500/50 scale-105`
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {conf.label}
                </button>
              ))}
            </div>
          </div>

          {/* Session */}
          <div>
            <label className="block text-xs font-bold tracking-wider text-amber-300/80 uppercase mb-1.5">Session</label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(SESSION_CONFIG) as [SessionType, typeof SESSION_CONFIG[SessionType]][]).map(([key, conf]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSession(key)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                    session === key
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 ring-2 ring-amber-500/30'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {conf.icon} {conf.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Day */}
          <div>
            <label className="block text-xs font-bold tracking-wider text-amber-300/80 uppercase mb-1.5">Day</label>
            <div className="flex flex-wrap gap-1.5">
              {DAYS.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setDay(key)}
                  className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                    day === key
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm tracking-wider shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-[1.01] active:scale-95 transition-all"
          >
            Save Activity
          </button>
        </form>
      </div>
    </div>
  );
}
