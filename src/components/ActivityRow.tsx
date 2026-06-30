import { useState, useRef, useEffect } from 'react';
import { Pencil, Trash2, CheckCircle2, Settings } from 'lucide-react';
import type { Activity, ActivityType } from '../types';
import { ACTIVITY_TYPE_CONFIG } from '../types';

interface ActivityRowProps {
  activity: Activity;
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Activity>) => void;
  onEdit: () => void;
  onDelete: (id: string) => void;
}

export default function ActivityRow({ activity, onToggle, onUpdate, onEdit, onDelete }: ActivityRowProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingFreq, setEditingFreq] = useState(false);
  const [titleValue, setTitleValue] = useState(activity.title);
  const [freqValue, setFreqValue] = useState(activity.frequency);
  const titleRef = useRef<HTMLInputElement>(null);
  const freqRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTitle) titleRef.current?.focus();
    if (editingFreq) freqRef.current?.focus();
  }, [editingTitle, editingFreq]);

  const typeConf = ACTIVITY_TYPE_CONFIG[activity.type];

  const saveTitle = () => {
    onUpdate(activity.id, { title: titleValue.trim() || 'Untitled' });
    setEditingTitle(false);
  };

  const saveFreq = () => {
    onUpdate(activity.id, { frequency: freqValue.trim() });
    setEditingFreq(false);
  };

  const cycleType = () => {
    const types: ActivityType[] = ['book', 'practice', 'course', 'video', 'bookvideo'];
    const idx = types.indexOf(activity.type);
    const next = types[(idx + 1) % types.length];
    onUpdate(activity.id, { type: next, emoji: ACTIVITY_TYPE_CONFIG[next].icon });
  };

  return (
    <div
      className={`group flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 px-3 sm:px-5 py-3.5 transition-all duration-200 border-b border-slate-100 last:border-b-0 ${
        activity.completed ? 'bg-slate-50/50' : 'bg-white hover:bg-amber-50/30'
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(activity.id)}
        className={`flex-shrink-0 transition-all duration-200 ${
          activity.completed ? 'text-amber-500' : 'text-slate-300 hover:text-amber-500'
        }`}
      >
        <CheckCircle2
          size={22}
          className={activity.completed ? 'drop-shadow-md' : ''}
          strokeWidth={activity.completed ? 2.5 : 1.5}
        />
      </button>

      {/* Emoji */}
      <span className="text-xl flex-shrink-0">{activity.emoji || typeConf.icon}</span>

      {/* Title */}
      <div className="flex-1 min-w-0">
        {editingTitle ? (
          <input
            ref={titleRef}
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveTitle();
              if (e.key === 'Escape') { setTitleValue(activity.title); setEditingTitle(false); }
            }}
            className="w-full text-sm font-medium text-slate-800 bg-amber-50 border border-amber-300 rounded px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        ) : (
          <div
            className={`text-sm font-medium truncate transition-all ${
              activity.completed ? 'text-slate-400 line-through' : 'text-slate-800'
            }`}
          >
            {activity.title || 'Untitled Activity'}
          </div>
        )}

        {editingFreq ? (
          <input
            ref={freqRef}
            value={freqValue}
            onChange={(e) => setFreqValue(e.target.value)}
            onBlur={saveFreq}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveFreq();
              if (e.key === 'Escape') { setFreqValue(activity.frequency); setEditingFreq(false); }
            }}
            className="text-[11px] text-slate-500 bg-amber-50 border border-amber-300 rounded px-1.5 py-0.5 focus:outline-none focus:ring-2 focus:ring-amber-400 mt-0.5"
          />
        ) : (
          <div className="text-[11px] text-slate-500 font-medium tracking-wide mt-0.5">
            {activity.frequency || 'Set frequency'}
          </div>
        )}
      </div>

      <div className="w-full sm:w-auto flex items-center justify-end sm:justify-start gap-2 ml-10 sm:ml-0 mt-2 sm:mt-0">
        {/* Type badge */}
        <button
          onClick={cycleType}
          className={`flex-shrink-0 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider border transition-all ${typeConf.bg} ${typeConf.text} ${typeConf.border} hover:scale-105`}
          title="Click to change type"
        >
          {typeConf.label}
        </button>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
            title="Full Edit"
          >
            <Settings size={13} />
          </button>
          <button
            onClick={() => { setEditingTitle(true); setTitleValue(activity.title); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all"
            title="Edit title"
          >
            <Pencil size={13} />
          </button>
        <button
          onClick={() => { setEditingFreq(true); setFreqValue(activity.frequency); }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
          title="Edit frequency"
        >
          <ClockEditIcon />
        </button>
        <button
          onClick={() => onDelete(activity.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
          title="Delete"
        >
          <Trash2 size={13} />
        </button>
      </div>
      </div>
    </div>
  );
}

function ClockEditIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 14" />
    </svg>
  );
}
