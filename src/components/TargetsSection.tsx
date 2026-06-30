import { useState, useMemo } from 'react';
import { Plus, ChevronLeft, ChevronRight, Target as TargetIcon, Calendar, Download, Filter } from 'lucide-react';
import { useTargets } from '../hooks/useTargets';
import TargetCard from './TargetCard';
import TargetFormModal from './TargetFormModal';
import {
  getWeekKey,
  getMonthKey,
  getWeekDates,
  getWeekLabel,
  getMonthName,
  getAdjacentWeek,
  getAdjacentMonth,
  TARGET_CATEGORIES,
} from '../types/targets';
import type { Target, Frequency } from '../types/targets';
import type { Activity } from '../types';
import type { DayKey } from '../types';

type FrequencyFilter = 'all' | Frequency;
type ViewMode = 'weekly' | 'monthly';

interface TargetsSectionProps {
  activities: Activity[];
}

export default function TargetsSection({ activities }: TargetsSectionProps) {
  const { targets, addTarget, updateTarget, deleteTarget, incrementProgress, resetTargets } = useTargets();
  const [formOpen, setFormOpen] = useState(false);
  const [editingTarget, setEditingTarget] = useState<Target | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('weekly');
  const [activeWeek, setActiveWeek] = useState(getWeekKey(new Date()));
  const [activeMonth, setActiveMonth] = useState(getMonthKey(new Date()));
  const [frequencyFilter, setFrequencyFilter] = useState<FrequencyFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Day activities mapping for the week view
  const dayActivitiesMap = useMemo(() => {
    const map: Record<string, Activity[]> = {};
    activities.forEach(a => {
      if (!map[a.day]) map[a.day] = [];
      map[a.day].push(a);
    });
    return map;
  }, [activities]);

  // Filter targets
  const filteredTargets = useMemo(() => {
    return targets.filter(t => {
      if (frequencyFilter !== 'all' && t.frequency !== frequencyFilter) return false;
      if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
      if (viewMode === 'weekly' && t.frequency === 'weekly' && t.weekKey !== activeWeek) return false;
      if (viewMode === 'weekly' && t.frequency === 'daily' && t.weekKey !== activeWeek) return false;
      if (viewMode === 'monthly' && t.frequency === 'monthly' && t.monthKey !== activeMonth) return false;
      return true;
    });
  }, [targets, frequencyFilter, categoryFilter, viewMode, activeWeek, activeMonth]);

  const weeklyTargets = filteredTargets.filter(t => t.frequency !== 'monthly');
  const monthlyTargets = filteredTargets.filter(t => t.frequency !== 'daily');
  const weekDates = getWeekDates(activeWeek);
  const dayKeys: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  const weekStats = useMemo(() => {
    const weekly = filteredTargets.filter(t => t.frequency === 'weekly' || t.frequency === 'daily');
    return {
      total: weekly.length,
      completed: weekly.filter(t => t.progress >= 100).length,
      avgProgress: weekly.length > 0
        ? Math.round(weekly.reduce((sum, t) => sum + t.progress, 0) / weekly.length)
        : 0,
    };
  }, [filteredTargets]);

  const monthStats = useMemo(() => {
    const monthly = filteredTargets.filter(t => t.frequency === 'monthly');
    return {
      total: monthly.length,
      completed: monthly.filter(t => t.progress >= 100).length,
      avgProgress: monthly.length > 0
        ? Math.round(monthly.reduce((sum, t) => sum + t.progress, 0) / monthly.length)
        : 0,
    };
  }, [filteredTargets]);

  // PDF Export
  const handleExportPdf = () => {
    const win = window.open('', '_blank');
    if (!win) return;

    const weekTargetRows = weeklyTargets.map(t =>
      `<tr><td>${t.title}</td><td>${t.category}</td><td>${t.frequency}</td><td>${t.progress}%</td></tr>`
    ).join('');
    const monthTargetRows = monthlyTargets.map(t =>
      `<tr><td>${t.title}</td><td>${t.category}</td><td>${t.frequency}</td><td>${t.progress}%</td></tr>`
    ).join('');

    const weekDaysHtml = weekDates.map((d, i) => {
      const key = dayKeys[i];
      const acts = dayActivitiesMap[key] || [];
      return `
        <div style="flex:1;padding:12px;background:#1e293b;border-radius:8px;margin:4px;min-width:80px">
          <div style="font-weight:bold;color:#d4a84b;margin-bottom:8px;font-size:14px">
            ${d.toLocaleDateString('en-US', { weekday: 'short' })}<br>
            ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
          <div style="color:#cbd5e1;font-size:12px">
            ${acts.length > 0
              ? acts.map(a => `<div style="margin-bottom:6px;padding:6px 8px;background:#0f172a;border-radius:4px;border-left:3px solid #d4a84b">${a.completed ? '✓ ' : '○ '}${a.title}</div>`).join('')
              : '<div style="color:#64748b;font-style:italic">No activities</div>'
            }
          </div>
        </div>
      `;
    }).join('');

    const html = `
      <html><head><title>My Day Plan - Targets Report</title>
      <style>
        body { font-family: 'Arial', sans-serif; background: #0f172a; color: #f1f5f9; padding: 40px; max-width: 1000px; margin: 0 auto; }
        h1 { color: #d4a84b; font-size: 32px; margin-bottom: 8px; }
        h2 { color: #f5e6a8; border-bottom: 2px solid #d4a84b; padding-bottom: 8px; margin-top: 32px; margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #334155; }
        th { background: #1e293b; color: #d4a84b; font-weight: bold; }
        .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 24px 0; }
        .stat-card { background: #1e293b; padding: 20px; border-radius: 12px; text-align: center; border-left: 4px solid #d4a84b; }
        .stat-number { font-size: 36px; font-weight: bold; color: #d4a84b; margin: 0; }
        .stat-label { color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
        .week-days { display: flex; flex-wrap: wrap; margin: 24px 0; }
      </style></head><body>
        <h1>Target Plan Report</h1>
        <p style="color:#94a3b8;font-style:italic">Generated from My Day Plan — JJM 2026</p>

        <div style="background:#1e293b;padding:16px;border-radius:12px;border-left:4px solid #d4a84b;margin:16px 0">
          <strong style="color:#d4a84b">📅 Week of:</strong> ${getWeekLabel(activeWeek)} &nbsp;|&nbsp;
          <strong style="color:#d4a84b">📅 Month:</strong> ${getMonthName(activeMonth)}
        </div>

        <h2>Weekly & Daily Targets</h2>
        <div class="stat-grid">
          <div class="stat-card"><p class="stat-number">${weekStats.total}</p><p class="stat-label">Total Targets</p></div>
          <div class="stat-card"><p class="stat-number">${weekStats.completed}</p><p class="stat-label">Completed</p></div>
          <div class="stat-card"><p class="stat-number">${weekStats.avgProgress}%</p><p class="stat-label">Average Progress</p></div>
        </div>

        <table>
          <tr><th>Target</th><th>Category</th><th>Frequency</th><th>Progress</th></tr>
          ${weekTargetRows || '<tr><td colspan="4" style="text-align:center;color:#64748b;font-style:italic">No targets for this week</td></tr>'}
        </table>

        <h2>Weekly Schedule</h2>
        <div class="week-days">${weekDaysHtml}</div>

        <h2>Monthly Targets (${getMonthName(activeMonth)})</h2>
        <div class="stat-grid">
          <div class="stat-card"><p class="stat-number">${monthStats.total}</p><p class="stat-label">Total Targets</p></div>
          <div class="stat-card"><p class="stat-number">${monthStats.completed}</p><p class="stat-label">Completed</p></div>
          <div class="stat-card"><p class="stat-number">${monthStats.avgProgress}%</p><p class="stat-label">Average Progress</p></div>
        </div>

        <table>
          <tr><th>Target</th><th>Category</th><th>Frequency</th><th>Progress</th></tr>
          ${monthTargetRows || '<tr><td colspan="4" style="text-align:center;color:#64748b;font-style:italic">No monthly targets</td></tr>'}
        </table>

        <p style="text-align:center;margin-top:40px;color:#94a3b8">
          "I can do all things through Christ who strengthens me." — Philippians 4:13 ✦ JJM 2026
        </p>
      </body></html>
    `;

    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 700);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 mb-4">
          <TargetIcon size={14} className="text-amber-400" />
          <span className="text-xs font-bold tracking-[0.2em] text-amber-400 uppercase">Goal Tracker</span>
        </div>
        <h1
          className="text-3xl md:text-5xl font-extrabold mb-3 tracking-tight"
          style={{
            fontFamily: "'Inter', -apple-system, sans-serif",
            background: 'linear-gradient(135deg, #f5e6a8 0%, #d4a84b 50%, #b8863a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          TARGETS & GOALS
        </h1>
        <p className="text-amber-200/60 text-sm max-w-xl mx-auto">
          Plan weekly targets, set monthly goals, and track your progress. Stay consistent, stay blessed.
        </p>
      </div>

      {/* View switcher & controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center bg-slate-800/60 border border-slate-700 rounded-full p-1">
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              viewMode === 'weekly'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📅 Weekly View
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              viewMode === 'monthly'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📆 Monthly View
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPdf}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300 text-xs font-semibold hover:border-amber-500/40 hover:text-amber-300 transition-all"
          >
            <Download size={14} /> Export PDF
          </button>
          <button
            onClick={() => { setEditingTarget(null); setFormOpen(true); }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Plus size={14} /> New Target
          </button>
        </div>
      </div>

      {/* Week/Month Navigation */}
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/50 rounded-2xl p-4 mb-6">
        {viewMode === 'weekly' ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveWeek(getAdjacentWeek(activeWeek, -1))}
                className="p-2 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar size={16} className="text-amber-400" />
                  {getWeekLabel(activeWeek)}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Weekly targets & daily activities</p>
              </div>
              <button
                onClick={() => setActiveWeek(getAdjacentWeek(activeWeek, 1))}
                className="p-2 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-all"
              >
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => setActiveWeek(getWeekKey(new Date()))}
                className="px-3 py-1.5 text-xs rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold hover:bg-amber-500/30 transition-all ml-2"
              >
                Today
              </button>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">Total</span>
                <span className="text-lg font-bold text-amber-300">{weekStats.total}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">Done</span>
                <span className="text-lg font-bold text-emerald-300">{weekStats.completed}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">Avg</span>
                <span className="text-lg font-bold text-amber-400">{weekStats.avgProgress}%</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveMonth(getAdjacentMonth(activeMonth, -1))}
                className="p-2 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar size={16} className="text-amber-400" />
                  {getMonthName(activeMonth)}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Monthly goals and long-term targets</p>
              </div>
              <button
                onClick={() => setActiveMonth(getAdjacentMonth(activeMonth, 1))}
                className="p-2 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-all"
              >
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => setActiveMonth(getMonthKey(new Date()))}
                className="px-3 py-1.5 text-xs rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold hover:bg-amber-500/30 transition-all ml-2"
              >
                This Month
              </button>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">Total</span>
                <span className="text-lg font-bold text-amber-300">{monthStats.total}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">Done</span>
                <span className="text-lg font-bold text-emerald-300">{monthStats.completed}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">Avg</span>
                <span className="text-lg font-bold text-amber-400">{monthStats.avgProgress}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Week days grid (only in weekly view) */}
      {viewMode === 'weekly' && (
        <div className="mb-8">
          <div className="grid grid-cols-7 gap-1.5 sm:gap-3">
            {weekDates.map((date, idx) => {
              const dayKey = dayKeys[idx];
              const dayActs = dayActivitiesMap[dayKey] || [];
              const completedCount = dayActs.filter(a => a.completed).length;
              const todayMatch = date.toDateString() === new Date().toDateString();

              return (
                <div
                  key={dayKey}
                  className={`rounded-xl p-2 sm:p-3 text-center transition-all border ${
                    todayMatch
                      ? 'bg-amber-500/15 border-amber-500/40 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-800/40 border-slate-700/40 hover:border-slate-600'
                  }`}
                >
                  <div className={`text-[10px] sm:text-xs font-bold tracking-wider uppercase mb-1 ${
                    todayMatch ? 'text-amber-400' : 'text-slate-400'
                  }`}>
                    {date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                  </div>
                  <div className={`text-lg sm:text-xl font-bold mb-1.5 ${
                    todayMatch ? 'text-amber-300' : 'text-slate-200'
                  }`}>
                    {date.getDate()}
                  </div>
                  <div className="h-1 bg-slate-700 rounded-full overflow-hidden mb-1">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all"
                      style={{ width: dayActs.length > 0 ? `${(completedCount / dayActs.length) * 100}%` : '0%' }}
                    />
                  </div>
                  <div className={`text-[9px] sm:text-[10px] font-semibold ${
                    dayActs.length > 0 && completedCount === dayActs.length
                      ? 'text-emerald-400'
                      : todayMatch ? 'text-amber-400/80' : 'text-slate-400'
                  }`}>
                    {dayActs.length > 0 ? `${completedCount}/${dayActs.length}` : '—'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-1.5">
          <Filter size={12} className="text-slate-500" />
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Filter:</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(['all', 'weekly', 'daily', 'monthly'] as FrequencyFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFrequencyFilter(f)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
                frequencyFilter === f
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-800/60 text-slate-400 border border-slate-700 hover:border-slate-600'
              }`}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block" />

        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              categoryFilter === 'all'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-800/60 text-slate-400 border border-slate-700 hover:border-slate-600'
            }`}
          >
            All Categories
          </button>
          {TARGET_CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setCategoryFilter(cat.label)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                categoryFilter === cat.label
                  ? `${cat.bg} ${cat.text} border ${cat.border}`
                  : 'bg-slate-800/60 text-slate-400 border border-slate-700 hover:border-slate-600'
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Weekly targets grid */}
      {viewMode === 'weekly' && weeklyTargets.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-bold tracking-wider text-amber-300/80 uppercase mb-4 flex items-center gap-2">
            <span className="w-8 h-px bg-amber-500/40" />
            Weekly & Daily Targets
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {weeklyTargets.map((t) => (
              <TargetCard
                key={t.id}
                target={t}
                onIncrement={incrementProgress}
                onEdit={setEditingTarget}
                onDelete={deleteTarget}
              />
            ))}
          </div>
        </div>
      )}

      {viewMode === 'weekly' && weeklyTargets.length === 0 && (
        <div className="mb-8 text-center py-12 bg-slate-800/30 rounded-2xl border border-dashed border-slate-700">
          <div className="text-4xl mb-3">🎯</div>
          <p className="text-slate-400 text-sm mb-3">No targets for this week yet</p>
          <button
            onClick={() => { setEditingTarget(null); setFormOpen(true); }}
            className="text-xs text-amber-400 font-bold hover:text-amber-300"
          >
            + Add your first target
          </button>
        </div>
      )}

      {/* Monthly targets grid */}
      {monthlyTargets.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-bold tracking-wider text-amber-300/80 uppercase mb-4 flex items-center gap-2">
            <span className="w-8 h-px bg-amber-500/40" />
            Monthly Goals ({getMonthName(activeMonth)})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {monthlyTargets.map((t) => (
              <TargetCard
                key={t.id}
                target={t}
                onIncrement={incrementProgress}
                onEdit={setEditingTarget}
                onDelete={deleteTarget}
              />
            ))}
          </div>
        </div>
      )}

      {monthlyTargets.length === 0 && (
        <div className="mb-8 text-center py-10 bg-slate-800/30 rounded-2xl border border-dashed border-slate-700">
          <div className="text-3xl mb-2">📆</div>
          <p className="text-slate-400 text-sm mb-3">No monthly goals yet</p>
          <button
            onClick={() => { setEditingTarget(null); setFormOpen(true); }}
            className="text-xs text-amber-400 font-bold hover:text-amber-300"
          >
            + Set a monthly target
          </button>
        </div>
      )}

      {/* Reset */}
      {targets.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={() => { if (confirm('Delete ALL targets?')) resetTargets(); }}
            className="text-xs text-slate-500 hover:text-rose-400 transition-colors"
          >
            Clear All Targets
          </button>
        </div>
      )}

      {/* Modals */}
      {formOpen && !editingTarget && (
        <TargetFormModal
          onSubmit={(data) => { addTarget(data); setFormOpen(false); }}
          onClose={() => setFormOpen(false)}
          modalTitle="Add New Target"
        />
      )}
      {editingTarget && (
        <TargetFormModal
          initial={editingTarget}
          onSubmit={(data) => { updateTarget(editingTarget.id, data); setEditingTarget(null); }}
          onClose={() => setEditingTarget(null)}
          modalTitle="Edit Target"
        />
      )}
    </div>
  );
}
