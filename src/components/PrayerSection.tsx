import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, Clock, Calendar, Zap, ChevronLeft, ChevronRight, Settings2, Play, Square, RotateCcw } from 'lucide-react';
import { usePrayer } from '../hooks/usePrayer';

const TODAY = new Date().toISOString().split('T')[0];

function fmt(h: number) { return `${h.toString().padStart(2, '0')}:00`; }

// ── Countdown Timer Banner ───────────────────────────────────────────────────
function TimerBanner({ hour, duration, onDone, onStop }: {
  hour: number; duration: number; onDone: () => void; onStop: () => void;
}) {
  const totalSecs = duration * 60;
  const [secs, setSecs] = useState(totalSecs);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    ref.current = setInterval(() => {
      setSecs(s => {
        if (s <= 1) { clearInterval(ref.current!); onDone(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [onDone]);

  const pct = ((totalSecs - secs) / totalSecs) * 100;
  const mm = Math.floor(secs / 60).toString().padStart(2, '0');
  const ss = (secs % 60).toString().padStart(2, '0');

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-blue-600 shadow-2xl">
      <div className="h-1 bg-blue-400/40">
        <div className="h-full bg-white transition-all duration-1000" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex items-center justify-between px-4 py-3 max-w-2xl mx-auto">
        <div className="flex items-center gap-3">
          <Clock size={18} className="text-blue-200 animate-pulse" />
          <div>
            <p className="text-white text-sm font-bold">{fmt(hour)} — {duration} min prayer</p>
            <p className="text-blue-200 text-xs">{mm}:{ss} remaining</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onDone} className="px-3 py-1.5 rounded-lg bg-white/20 text-white text-xs font-bold hover:bg-white/30 transition-all">
            ✓ Mark Done
          </button>
          <button onClick={onStop} className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all">
            <Square size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PrayerSection() {
  const {
    points, hourlyPlan, activeDuration, tonguesSessions,
    addPrayerPoint, togglePrayerPoint, deletePrayerPoint,
    toggleHourly, setDuration, toggleTongues, resetPrayer,
  } = usePrayer();

  const [subTab, setSubTab] = useState<'journal' | 'hourly'>('journal');
  const [newPoint, setNewPoint] = useState('');
  const [period, setPeriod] = useState<'day' | 'week' | 'custom'>('day');
  const [dateFilter, setDateFilter] = useState(TODAY);
  const [activeTimer, setActiveTimer] = useState<{ hour: number } | null>(null);

  const shiftDate = (delta: number) => {
    const d = new Date(dateFilter); d.setDate(d.getDate() + delta);
    setDateFilter(d.toISOString().split('T')[0]);
  };

  const filteredPoints = useMemo(() => points.filter(p => {
    if (p.period === 'day') return p.startDate === dateFilter;
    const d = new Date(dateFilter), s = new Date(p.startDate), e = new Date(p.endDate);
    return d >= s && d <= e;
  }), [points, dateFilter]);

  const hourlyForToday = useMemo(() => Array.from({ length: 24 }, (_, i) => {
    const entry = hourlyPlan.find(p => p.hour === i && p.date === dateFilter);
    return { hour: i, completed: entry?.completed || false };
  }), [hourlyPlan, dateFilter]);

  const completedHours = hourlyForToday.filter(h => h.completed).length;
  const currentHour = new Date().getHours();
  const isToday = dateFilter === TODAY;

  const handleAddPoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPoint.trim()) return;
    let startDate = dateFilter, endDate = dateFilter;
    if (period === 'week') {
      const d = new Date(dateFilter), day = d.getDay() || 7;
      const mon = new Date(d); mon.setDate(d.getDate() - day + 1);
      const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
      startDate = mon.toISOString().split('T')[0];
      endDate = sun.toISOString().split('T')[0];
    }
    addPrayerPoint({ text: newPoint.trim(), period, startDate, endDate });
    setNewPoint('');
  };

  const startTimer = useCallback((hour: number) => setActiveTimer({ hour }), []);
  const stopTimer = useCallback(() => setActiveTimer(null), []);
  const handleTimerDone = useCallback(() => {
    if (activeTimer) { toggleHourly(activeTimer.hour, dateFilter); setActiveTimer(null); }
  }, [activeTimer, toggleHourly, dateFilter]);

  const resetToday = () => {
    if (confirm('Reset all hourly completions for this day?')) {
      hourlyForToday.filter(h => h.completed).forEach(h => toggleHourly(h.hour, dateFilter));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-10">
      {/* Timer banner */}
      {activeTimer && (
        <TimerBanner
          hour={activeTimer.hour}
          duration={activeDuration}
          onDone={handleTimerDone}
          onStop={stopTimer}
        />
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 mb-4">
          <Zap size={14} className="text-sky-400" />
          <span className="text-xs font-bold tracking-[0.2em] text-sky-400 uppercase">Prayer Life</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2 text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          PRAYER HUB
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">"Pray without ceasing." — 1 Thessalonians 5:17</p>
      </div>

      {/* Sub-tab toggle */}
      <div className="flex p-1 rounded-full bg-slate-800/70 border border-slate-700/50 mb-8 max-w-xs mx-auto">
        <button onClick={() => setSubTab('journal')} className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all ${subTab === 'journal' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}>
          Prayer Journal
        </button>
        <button onClick={() => setSubTab('hourly')} className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all ${subTab === 'hourly' ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}>
          Hourly Plan
        </button>
      </div>

      {/* Date nav (shared) */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <button onClick={() => shiftDate(-1)} className="p-2 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-400 hover:text-white transition-all"><ChevronLeft size={18} /></button>
        <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-slate-800/60 border border-slate-700">
          <Calendar size={14} className="text-amber-400" />
          <span className="text-sm font-bold text-white">{new Date(dateFilter + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}</span>
          {isToday && <span className="text-[10px] font-bold text-sky-400 bg-sky-500/20 px-1.5 py-0.5 rounded-full">TODAY</span>}
        </div>
        <button onClick={() => shiftDate(1)} className="p-2 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-400 hover:text-white transition-all"><ChevronRight size={18} /></button>
      </div>

      {/* ── HOURLY PLAN ── */}
      {subTab === 'hourly' && (
        <div className="space-y-5">
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-white font-bold">{completedHours} / 24 hours completed</p>
              <p className="text-xs text-slate-400">{Math.round((completedHours / 24) * 100)}% of your day prayed</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-800/70 border border-slate-700/50 p-1 rounded-xl">
                {([6, 10] as const).map(d => (
                  <button key={d} onClick={() => setDuration(d)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeDuration === d ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}>
                    {d} MINS
                  </button>
                ))}
              </div>
              <button onClick={resetToday} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white text-xs font-bold transition-all">
                <RotateCcw size={12} /> Reset Today
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-all duration-500" style={{ width: `${(completedHours / 24) * 100}%` }} />
            </div>
          </div>

          {/* Tip */}
          <div className="p-3 rounded-xl bg-sky-500/5 border border-sky-500/20 text-center">
            <p className="text-xs text-sky-400 font-medium">
              ⏰ 6 minutes = 1/10th of each hour dedicated to God — the tithe of your time
            </p>
          </div>

          {/* 30 Minutes in Tongues */}
          <div className="rounded-2xl border border-violet-500/30 bg-violet-500/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🔥</span>
              <div>
                <p className="text-white font-bold text-sm">30 Minutes in Tongues</p>
                <p className="text-violet-300/60 text-xs">Complete all 3 sessions today</p>
              </div>
              <div className="ml-auto">
                {(() => {
                  const done = (['morning','afternoon','evening'] as const).filter(s =>
                    tonguesSessions.find(t => t.session === s && t.date === dateFilter && t.completed)
                  ).length;
                  return (
                    <span className="text-xs font-bold text-violet-300 bg-violet-500/20 px-2 py-1 rounded-full border border-violet-500/30">
                      {done}/3 done
                    </span>
                  );
                })()}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {([
                { key: 'morning' as const,   label: 'Morning',   emoji: '🌅', time: '6–9 AM' },
                { key: 'afternoon' as const, label: 'Afternoon', emoji: '☀️', time: '12–2 PM' },
                { key: 'evening' as const,   label: 'Evening',   emoji: '🌙', time: '6–9 PM' },
              ]).map(s => {
                const entry = tonguesSessions.find(t => t.session === s.key && t.date === dateFilter);
                const done = entry?.completed || false;
                return (
                  <button
                    key={s.key}
                    onClick={() => toggleTongues(s.key, dateFilter)}
                    className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border font-semibold transition-all ${
                      done
                        ? 'bg-violet-500/20 border-violet-500/50 text-violet-300'
                        : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-violet-500/30 hover:text-violet-300'
                    }`}
                  >
                    <span className="text-xl">{s.emoji}</span>
                    <span className="text-xs font-bold">{s.label}</span>
                    <span className="text-[10px] text-slate-500">{s.time}</span>
                    {done && <span className="text-[10px] font-bold text-violet-400 bg-violet-500/20 px-1.5 rounded-full">✓ Done</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hour grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {hourlyForToday.map(h => {
              const isCurrent = isToday && h.hour === currentHour;
              const isRunning = activeTimer?.hour === h.hour;
              // Show the duration this hour was actually completed with, or the active duration if not yet done
              const savedEntry = hourlyPlan.find(p => p.hour === h.hour && p.date === dateFilter);
              const displayDuration = (h.completed && savedEntry) ? savedEntry.duration : activeDuration;
              return (
                <div key={h.hour} className={`relative rounded-2xl border p-2.5 flex flex-col items-center gap-1.5 transition-all ${
                  h.completed ? 'bg-sky-500/15 border-sky-500/50' :
                  isCurrent ? 'bg-sky-500/5 border-sky-500/30 ring-2 ring-sky-500/40' :
                  'bg-slate-900/40 border-slate-700/50'
                }`}>
                  {/* Hour label */}
                  <span className={`text-xs font-bold ${isCurrent ? 'text-sky-400' : h.completed ? 'text-sky-300' : 'text-slate-400'}`}>
                    {fmt(h.hour)}
                  </span>
                  {/* Duration badge */}
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${h.completed ? 'bg-sky-500/20 border-sky-500/40 text-sky-300' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                    {displayDuration}m
                  </span>
                  {/* Toggle + timer buttons */}
                  <div className="flex gap-1 w-full">
                    <button
                      onClick={() => toggleHourly(h.hour, dateFilter)}
                      className={`flex-1 flex items-center justify-center py-1.5 rounded-xl transition-all ${h.completed ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-500 hover:text-sky-400 hover:bg-slate-700'}`}
                      title={h.completed ? 'Mark incomplete' : 'Mark done'}
                    >
                      {h.completed ? <CheckCircle2 size={13} /> : <Circle size={13} />}
                    </button>
                    {!h.completed && (
                      <button
                        onClick={() => isRunning ? stopTimer() : startTimer(h.hour)}
                        className={`flex-1 flex items-center justify-center py-1.5 rounded-xl transition-all ${isRunning ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-slate-800 text-slate-500 hover:text-sky-400 hover:bg-slate-700'}`}
                        title={isRunning ? 'Stop timer' : 'Start timer'}
                      >
                        {isRunning ? <Square size={12} /> : <Play size={12} />}
                      </button>
                    )}
                  </div>
                  {isCurrent && !h.completed && (
                    <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-sky-400 animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── PRAYER JOURNAL ── */}
      {subTab === 'journal' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add point */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-9 w-9 rounded-xl bg-amber-500/20 flex items-center justify-center"><Plus size={18} className="text-amber-400" /></div>
              <h2 className="text-base font-bold text-white">Add Prayer Point</h2>
            </div>
            <form onSubmit={handleAddPoint} className="space-y-3">
              <div className="flex gap-1 p-1 bg-slate-900/50 rounded-xl border border-slate-700/50">
                {(['day', 'week', 'custom'] as const).map(p => (
                  <button key={p} type="button" onClick={() => setPeriod(p)}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${period === p ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
                    {p}
                  </button>
                ))}
              </div>
              <div className="relative">
                <textarea
                  value={newPoint} onChange={e => setNewPoint(e.target.value)}
                  placeholder={`Add a prayer point for this ${period}...`}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-sm resize-none"
                />
                <button type="submit" className="absolute bottom-3 right-3 h-8 w-8 rounded-lg bg-amber-500 text-white flex items-center justify-center hover:bg-amber-600 transition-all active:scale-95">
                  <Plus size={16} />
                </button>
              </div>
            </form>
          </div>

          {/* Prayer points list */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-9 w-9 rounded-xl bg-sky-500/20 flex items-center justify-center"><Zap size={18} className="text-sky-400" /></div>
              <h2 className="text-base font-bold text-white">Prayer Points</h2>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {filteredPoints.length === 0 ? (
                <div className="text-center py-10 text-slate-500">
                  <Calendar size={36} className="mx-auto mb-2 opacity-30" />
                  <p className="text-xs font-bold uppercase tracking-wider">No prayer points for this day</p>
                </div>
              ) : filteredPoints.map(p => (
                <div key={p.id} className="group flex items-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-700/30 hover:border-amber-500/30 transition-all">
                  <button onClick={() => togglePrayerPoint(p.id)} className={`mt-0.5 shrink-0 transition-all ${p.completed ? 'text-emerald-400' : 'text-slate-600 hover:text-amber-400'}`}>
                    {p.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                  </button>
                  <p className={`flex-1 text-sm leading-relaxed ${p.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{p.text}</p>
                  <button onClick={() => deletePrayerPoint(p.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-600 hover:text-rose-400 transition-all shrink-0">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <button onClick={() => { if (confirm('Reset all prayer data?')) resetPrayer(); }} className="text-xs text-slate-600 hover:text-rose-400 flex items-center gap-1.5 transition-colors">
          <Settings2 size={12} /> Reset Prayer Data
        </button>
      </div>
    </div>
  );
}
