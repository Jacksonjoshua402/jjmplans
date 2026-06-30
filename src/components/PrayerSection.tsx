import { useState, useMemo } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, Clock, Calendar, Zap, ChevronLeft, ChevronRight, Settings2 } from 'lucide-react';
import { usePrayer } from '../hooks/usePrayer';

export default function PrayerSection() {
  const {
    points,
    hourlyPlan,
    activeDuration,
    addPrayerPoint,
    togglePrayerPoint,
    deletePrayerPoint,
    toggleHourly,
    setDuration,
    resetPrayer,
  } = usePrayer();

  const [newPoint, setNewPoint] = useState('');
  const [period, setPeriod] = useState<'day' | 'week' | 'custom'>('day');
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);

  const filteredPoints = useMemo(() => {
    return points.filter(p => {
      if (p.period === 'day') return p.startDate === dateFilter;
      // For week, we check if dateFilter is between start and end
      const d = new Date(dateFilter);
      const s = new Date(p.startDate);
      const e = new Date(p.endDate);
      return d >= s && d <= e;
    });
  }, [points, dateFilter]);

  const hourlyForToday = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    return hours.map(h => {
      const entry = hourlyPlan.find(p => p.hour === h && p.date === dateFilter);
      return {
        hour: h,
        completed: entry?.completed || false,
        duration: entry?.duration || activeDuration,
      };
    });
  }, [hourlyPlan, dateFilter, activeDuration]);

  const completedHours = hourlyForToday.filter(h => h.completed).length;

  const handleAddPoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPoint.trim()) return;
    
    let startDate = dateFilter;
    let endDate = dateFilter;

    if (period === 'week') {
      const d = new Date(dateFilter);
      const day = d.getDay() || 7;
      const monday = new Date(d);
      monday.setDate(d.getDate() - day + 1);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      startDate = monday.toISOString().split('T')[0];
      endDate = sunday.toISOString().split('T')[0];
    }

    addPrayerPoint({
      text: newPoint.trim(),
      period,
      startDate,
      endDate,
    });
    setNewPoint('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 mb-4">
          <Zap size={14} className="text-blue-400" />
          <span className="text-xs font-bold tracking-[0.2em] text-blue-400 uppercase">Prayer Life</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2 text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          PRAYER HUB
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          "Pray without ceasing." — 1 Thessalonians 5:17
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Hourly Plan */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Clock size={20} className="text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Hourly Prayer Plan</h2>
                  <p className="text-xs text-slate-400">{completedHours} of 24 hours completed</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-xl border border-slate-700/50">
                <button 
                  onClick={() => setDuration(6)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${activeDuration === 6 ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  6 MINS
                </button>
                <button 
                  onClick={() => setDuration(10)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${activeDuration === 10 ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  10 MINS
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
              {hourlyForToday.map((h) => (
                <button
                  key={h.hour}
                  onClick={() => toggleHourly(h.hour, dateFilter)}
                  className={`relative group aspect-square rounded-xl border flex flex-col items-center justify-center transition-all ${
                    h.completed 
                      ? 'bg-blue-500/20 border-blue-500/50 text-blue-300' 
                      : 'bg-slate-900/40 border-slate-700/50 text-slate-500 hover:border-slate-500'
                  }`}
                >
                  <span className="text-[10px] font-bold mb-1">{h.hour.toString().padStart(2, '0')}:00</span>
                  {h.completed ? <CheckCircle2 size={16} /> : <Circle size={16} className="opacity-20 group-hover:opacity-100" />}
                  <div className="absolute -top-1 -right-1 h-3 px-1 rounded-full bg-slate-800 text-[8px] font-bold border border-slate-700">
                    {h.duration}m
                  </div>
                </button>
              ))}
            </div>
            
            <div className="mt-6 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-center">
              <p className="text-xs text-blue-400 font-medium">
                Tip: Spend {activeDuration} minutes in prayer every hour of your waking day.
              </p>
            </div>
          </div>

          {/* Prayer Sessions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {['Morning', 'Afternoon', 'Evening'].map((session) => (
              <div key={session} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 text-center group hover:border-blue-500/30 transition-all">
                <div className="h-12 w-12 rounded-2xl bg-slate-900/50 flex items-center justify-center mx-auto mb-3 text-2xl">
                  {session === 'Morning' ? '🌅' : session === 'Afternoon' ? '☀️' : '🌙'}
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{session} Prayer</h3>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-4">Dedicated Time</p>
                <button className="w-full py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold hover:bg-blue-500/20 transition-all">
                  Set Reminder
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Prayer Points */}
        <div className="space-y-6">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Plus size={20} className="text-amber-400" />
                </div>
                <h2 className="text-lg font-bold text-white">Prayer Points</h2>
              </div>
            </div>

            <form onSubmit={handleAddPoint} className="space-y-4 mb-6">
              <div className="flex gap-1.5 p-1 bg-slate-900/50 rounded-xl border border-slate-700/50">
                {(['day', 'week', 'custom'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPeriod(p)}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${period === p ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              
              <div className="relative">
                <textarea
                  value={newPoint}
                  onChange={(e) => setNewPoint(e.target.value)}
                  placeholder={`Add a prayer point for this ${period}...`}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all text-sm resize-none"
                />
                <button
                  type="submit"
                  className="absolute bottom-3 right-3 h-8 w-8 rounded-lg bg-amber-500 text-white flex items-center justify-center hover:bg-amber-600 shadow-lg transition-all active:scale-95"
                >
                  <Plus size={18} />
                </button>
              </div>
            </form>

            <div className="space-y-3 max-h-[400px] overflow-y-auto no-scrollbar pr-1">
              {filteredPoints.length === 0 ? (
                <div className="text-center py-10 opacity-20">
                  <Calendar size={40} className="mx-auto mb-2" />
                  <p className="text-xs font-bold uppercase tracking-wider">No prayer points</p>
                </div>
              ) : (
                filteredPoints.map((p) => (
                  <div key={p.id} className="group bg-slate-900/40 border border-slate-700/30 rounded-xl p-3 flex items-start gap-3 hover:border-amber-500/30 transition-all">
                    <button 
                      onClick={() => togglePrayerPoint(p.id)}
                      className={`flex-shrink-0 mt-0.5 transition-all ${p.completed ? 'text-emerald-500' : 'text-slate-600 hover:text-amber-400'}`}
                    >
                      {p.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-relaxed ${p.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                        {p.text}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                         <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase">
                           {p.period}
                         </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => deletePrayerPoint(p.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-600 hover:text-rose-400 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Date Navigation */}
      <div className="mt-10 flex items-center justify-center gap-4">
        <button 
          onClick={() => {
            const d = new Date(dateFilter);
            d.setDate(d.getDate() - 1);
            setDateFilter(d.toISOString().split('T')[0]);
          }}
          className="p-2 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-400 hover:text-white"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center gap-2 px-6 py-2 rounded-full bg-slate-800/60 border border-slate-700">
          <Calendar size={16} className="text-amber-400" />
          <span className="text-sm font-bold text-white">
            {new Date(dateFilter).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <button 
           onClick={() => {
            const d = new Date(dateFilter);
            d.setDate(d.getDate() + 1);
            setDateFilter(d.toISOString().split('T')[0]);
          }}
          className="p-2 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-400 hover:text-white"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Action Bar */}
      <div className="mt-12 flex items-center justify-center gap-4">
        <button 
          onClick={() => { if(confirm('Reset all prayer data?')) resetPrayer(); }}
          className="text-xs text-slate-600 hover:text-rose-400 flex items-center gap-1.5 transition-colors"
        >
          <Settings2 size={12} /> Reset Prayer Data
        </button>
      </div>
    </div>
  );
}
