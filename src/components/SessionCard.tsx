import { Plus } from 'lucide-react';
import type { Activity, SessionType } from '../types';
import { SESSION_CONFIG } from '../types';
import ActivityRow from './ActivityRow';

interface SessionCardProps {
  session: SessionType;
  activities: Activity[];
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Activity>) => void;
  onEditActivity: (activity: Activity) => void;
  onDelete: (id: string) => void;
  onAddToSession: (session: SessionType) => void;
}

export default function SessionCard({ session, activities, onToggle, onUpdate, onEditActivity, onDelete, onAddToSession }: SessionCardProps) {
  const conf = SESSION_CONFIG[session];
  const completed = activities.filter(a => a.completed).length;
  const total = activities.length;

  return (
    <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/30 bg-white mb-6 border border-white/5">
      {/* Header */}
      <div className={`${conf.headerBg} px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_50%,white,transparent_50%)]" />
        <div className="flex items-center gap-3 relative w-full sm:w-auto">
          <span className="text-2xl">{conf.icon}</span>
          <div>
            <h2 className={`text-xl font-bold ${conf.headerText}`}>{conf.label}</h2>
            <p className={`text-xs ${conf.headerText} opacity-70 font-mono tracking-wider`}>{conf.time}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 relative self-start sm:self-auto">
          {total > 0 && (
            <span className={`text-xs font-semibold ${conf.headerText} bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full`}>
              {completed}/{total}
            </span>
          )}
          <button
            onClick={() => onAddToSession(session)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm ${conf.headerText} text-xs font-bold transition-all hover:scale-105 active:scale-95`}
          >
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      {/* Activities */}
      <div>
        {activities.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <div className="text-4xl mb-2 opacity-20">{conf.icon}</div>
            <p className="text-sm text-slate-400">No activities yet. Click "+ Add" to plan your {conf.label.split(' ')[0].toLowerCase()}.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {activities.map((activity) => (
              <ActivityRow
                key={activity.id}
                activity={activity}
                onToggle={onToggle}
                onUpdate={onUpdate}
                onEdit={() => onEditActivity(activity)}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
