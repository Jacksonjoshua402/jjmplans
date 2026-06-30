import { Plus, FileSpreadsheet, FileText, Trash2, LogOut } from 'lucide-react';
import type { DayKey } from '../types';
import { DAYS } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  selectedDay: DayKey;
  onSelectDay: (day: DayKey) => void;
  onAddActivity: () => void;
  onExportExcel: () => void;
  onExportPdf: () => void;
  onClearDay: () => void;
}

function getTodayKey(): DayKey {
  const dayMap: DayKey[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return dayMap[new Date().getDay()];
}

export default function Header({
  selectedDay,
  onSelectDay,
  onAddActivity,
  onExportExcel,
  onExportPdf,
  onClearDay,
}: HeaderProps) {
  const { user, logout } = useAuth();
  const now = new Date();
  const todayKey = getTodayKey();
  const fullDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <header className="relative text-center mb-10">
      {/* Top label */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <span className="text-xs font-semibold tracking-[0.3em] text-amber-400/80">JJM 2026</span>
        <span className="text-amber-400/60 text-xs">✦</span>
        <span className="text-xs font-semibold tracking-[0.3em] text-amber-400/80">PERSONAL GROWTH PLAN</span>
      </div>

      {/* Title */}
      <h1
        className="text-5xl md:text-7xl font-bold mb-4 tracking-tight"
        style={{
          fontFamily: "'Montserrat', 'Inter', sans-serif",
          color: '#ffffff',
        }}
      >
        My day plan
      </h1>

      {/* Today's date */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/60 border border-slate-700/50">
          <div className="h-7 w-7 rounded-lg bg-amber-500 flex items-center justify-center text-white font-bold text-sm">
            {now.getDate()}
          </div>
          <span className="text-sm text-slate-200 font-medium">{fullDate}</span>
        </div>
        {user && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-800/60 border border-slate-700/50">
            <span className="text-xs text-slate-300 font-medium max-w-[140px] truncate">
              {user.displayName || user.email}
            </span>
            <button
              onClick={logout}
              title="Log out"
              className="text-slate-400 hover:text-rose-400 transition-colors"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Bible verse */}
      <div className="max-w-2xl mx-auto mb-8">
        <p className="text-amber-100/80 text-sm md:text-base italic leading-relaxed">
          <span className="text-amber-300/60">"</span>
          Commit your works to the LORD, and your plans will be established.
          <span className="text-amber-300/60">"</span>
          <span className="text-amber-400 font-semibold ml-2 block sm:inline mt-2 sm:mt-0">— Proverbs 16:3</span>
        </p>
      </div>

      {/* Divider */}
      <div className="max-w-3xl mx-auto mb-8 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

      {/* Action buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
        <button
          onClick={onAddActivity}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus size={16} /> Add Activity
        </button>
        <button
          onClick={onExportExcel}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600/90 hover:bg-emerald-600 text-white text-sm font-semibold shadow-lg shadow-emerald-600/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <FileSpreadsheet size={14} /> Export Excel
        </button>
        <button
          onClick={onExportPdf}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-700/80 hover:bg-slate-700 border border-slate-600 text-white text-sm font-semibold hover:scale-[1.02] active:scale-95 transition-all"
        >
          <FileText size={14} /> Export PDF
        </button>
        <button
          onClick={onClearDay}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-900/50 hover:bg-rose-900/70 border border-rose-700/50 text-rose-200 text-sm font-semibold hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Trash2 size={14} /> Clear Day
        </button>
      </div>

      {/* Day tabs */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {DAYS.map(({ key, label }) => {
          const isActive = selectedDay === key;
          const isToday = todayKey === key;
          return (
            <button
              key={key}
              onClick={() => onSelectDay(key)}
              className={`relative px-5 py-2 rounded-full text-sm font-bold tracking-wider transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30 scale-105'
                  : isToday
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/50'
                  : 'bg-slate-800/50 text-amber-200/70 hover:bg-slate-700/50 hover:text-amber-200 border border-slate-700/50'
              }`}
            >
              {label}
              {isToday && !isActive && (
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400" />
              )}
              {isActive && (
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
}
