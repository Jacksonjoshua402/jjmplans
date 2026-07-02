import { useState, useMemo } from 'react';
import { Sparkles, ListChecks, BookOpen, Target as TargetIcon, Columns3, Wand2, Volume2, HardDrive, Library, Monitor, Zap, Banknote } from 'lucide-react';
import Header from './components/Header';
import ProgressBar from './components/ProgressBar';
import SessionCard from './components/SessionCard';
import ActivityModal from './components/ActivityModal';
import MessagesSection from './components/MessagesSection';
import TargetsSection from './components/TargetsSection';
import PillarsSection from './components/PillarsSection';
import PropheciesSection from './components/PropheciesSection';
import ConfessionsSection from './components/ConfessionsSection';
import BooksSection from './components/BooksSection';
import CoursesSection from './components/CoursesSection';
import PrayerSection from './components/PrayerSection';
import GivingSection from './components/GivingSection';
import DataManager from './components/DataManager';
import { useActivities } from './hooks/useActivities';
import type { Activity, SessionType } from './types';
import { SESSION_CONFIG, BIBLE_VERSES } from './types';

type View = 'planner' | 'targets' | 'pillars' | 'confessions' | 'prophecies' | 'prayer' | 'messages' | 'library' | 'learning' | 'giving';

const TABS: { key: View; label: string; mobileLabel: string; icon: typeof ListChecks; gradient?: string }[] = [
  { key: 'planner', label: 'Day Plan', mobileLabel: 'Plan', icon: ListChecks, gradient: 'from-amber-500 to-orange-500' },
  { key: 'prayer', label: 'Prayer', mobileLabel: 'Pray', icon: Zap, gradient: 'from-sky-500 to-cyan-500' },
  { key: 'targets', label: 'Targets', mobileLabel: 'Goals', icon: TargetIcon, gradient: 'from-rose-500 to-pink-500' },
  { key: 'pillars', label: 'Pillars', mobileLabel: 'Pillars', icon: Columns3, gradient: 'from-teal-500 to-emerald-500' },
  { key: 'confessions', label: 'Confessions', mobileLabel: 'Confess', icon: Volume2, gradient: 'from-orange-500 to-amber-500' },
  { key: 'prophecies', label: 'Prophecy', mobileLabel: 'Word', icon: Wand2, gradient: 'from-violet-500 to-fuchsia-500' },
  { key: 'messages', label: 'Messages', mobileLabel: 'Notes', icon: BookOpen, gradient: 'from-indigo-500 to-blue-500' },
  { key: 'library', label: 'Library', mobileLabel: 'Books', icon: Library, gradient: 'from-emerald-500 to-teal-600' },
  { key: 'learning', label: 'Learning', mobileLabel: 'Study', icon: Monitor, gradient: 'from-blue-500 to-indigo-600' },
  { key: 'giving', label: 'Giving', mobileLabel: 'Give', icon: Banknote, gradient: 'from-yellow-500 to-amber-500' },
];

export default function App() {
  const {
    allActivities,
    dayActivities,
    selectedDay,
    setSelectedDay,
    progressPercent,
    completedCount,
    totalCount,
    toggleComplete,
    addActivity,
    updateActivity,
    deleteActivity,
    addToSession,
    clearDay,
    saveAsDefault,
    duplicateDay,
    applyDefault,
    hasDefault,
    resetData,
  } = useActivities();

  const [view, setView] = useState<View>('planner');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [modalInitial, setModalInitial] = useState<Partial<Activity> | null>(null);
  const [dataManagerOpen, setDataManagerOpen] = useState(false);

  const verse = useMemo(() => {
    const idx = new Date().getDate() % BIBLE_VERSES.length;
    return BIBLE_VERSES[idx];
  }, []);

  const handleAdd = (initialSession?: SessionType) => {
    setModalInitial(initialSession
      ? { session: initialSession, day: selectedDay, type: 'book', emoji: '📖' }
      : { day: selectedDay, session: 'morning', type: 'book', emoji: '📖' });
    setModalOpen(true);
  };

  const handleExportExcel = () => {
    const rows = [['Session', 'Activity', 'Frequency', 'Type', 'Day', 'Status']];
    dayActivities.forEach(a => {
      rows.push([SESSION_CONFIG[a.session].label, a.title, a.frequency, a.type.toUpperCase(), a.day.toUpperCase(), a.completed ? '✓ Done' : '○ Pending']);
    });
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MyDayPlan-${selectedDay.toUpperCase()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPdf = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    const html = `<html><head><title>My Day Plan - ${selectedDay.toUpperCase()}</title>
      <style>body{font-family:'Arial',sans-serif;background:#0f172a;color:#f1f5f9;padding:40px;max-width:800px;margin:0 auto}h1{color:#d4a84b;text-align:center;font-size:42px;margin:0 0 10px;letter-spacing:-1px;font-weight:800}h2{color:#f5e6a8;border-bottom:2px solid #d4a84b;padding-bottom:8px;margin-top:32px}.verse{text-align:center;font-style:italic;color:#cbd5e1;margin:10px 0 30px;font-size:16px}.activity{padding:14px;border-bottom:1px solid #334155;display:flex;align-items:center;gap:14px;background:#1e293b;margin-bottom:6px;border-radius:8px;border-left:3px solid #d4a84b}.type{background:#d4a84b;color:#0f172a;padding:4px 10px;border-radius:4px;font-size:11px;font-weight:bold}.freq{color:#94a3b8;font-size:13px}</style></head><body>
      <h1>MY DAY PLAN</h1>
      <div style="text-align:center;color:#94a3b8;letter-spacing:3px;font-size:12px;margin-bottom:8px">${selectedDay.toUpperCase()} — PERSONAL GROWTH PLAN</div>
      <p class="verse">"${verse.text}" — ${verse.ref}</p>
      ${(Object.keys(SESSION_CONFIG) as SessionType[]).map(session => {
        const acts = dayActivities.filter(a => a.session === session);
        if (acts.length === 0) return '';
        return `<h2>${SESSION_CONFIG[session].icon} ${SESSION_CONFIG[session].label} (${SESSION_CONFIG[session].time})</h2>` +
          acts.map(a => `<div class="activity"><div style="font-size:20px">${a.completed ? '✅' : '◯'}</div><div style="flex:1"><strong>${a.title}</strong><br><span class="freq">${a.frequency}</span></div><span class="type">${a.type.toUpperCase()}</span></div>`).join('');
      }).join('')}
      <p style="text-align:center;margin-top:40px;color:#94a3b8;font-size:13px">Progress: ${progressPercent}% (${completedCount}/${totalCount})</p>
      <p style="text-align:center;font-style:italic;color:#d4a84b;margin-top:30px;font-size:15px">"I can do all things through Christ who strengthens me." — Philippians 4:13 ✦ JJM 2026</p>
      </body></html>`;
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 700);
  };

  const handleClearDay = () => {
    if (confirm(`Clear all activities for ${selectedDay.toUpperCase()}?`)) clearDay(selectedDay);
  };

  const handleAddToSession = (session: SessionType) => addToSession(session, selectedDay);

  const handleEditActivity = (activity: Activity) => {
    setEditingActivityId(activity.id);
    setModalInitial(activity);
    setModalOpen(true);
  };

  const sessions: Record<SessionType, Activity[]> = {
    morning: dayActivities.filter(a => a.session === 'morning'),
    afternoon: dayActivities.filter(a => a.session === 'afternoon'),
    evening: dayActivities.filter(a => a.session === 'evening'),
  };

  return (
    <div className="min-h-screen text-white" style={{ background: '#0f172a', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* Top Navigation */}
      <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-lg border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Logo + Backup */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Sparkles size={14} className="text-white" />
              </div>
              <div>
                <h1 className="text-sm font-extrabold text-white leading-tight tracking-tight" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  My day plan
                </h1>
                <p className="text-[8px] text-amber-400/50 font-semibold tracking-widest -mt-0.5">JJM 2026</p>
              </div>
            </div>
            <button
              onClick={() => setDataManagerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold hover:bg-emerald-500/25 transition-all"
              title="Backup & Restore"
            >
              <HardDrive size={12} />
              <span className="hidden sm:inline">Backup</span>
            </button>
          </div>

          {/* Tab bar */}
          <div className="flex items-center gap-0.5 bg-slate-800/60 rounded-full p-1 border border-slate-700/50 overflow-x-auto no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = view === tab.key;
              const grad = tab.gradient || 'from-amber-500 to-orange-500';
              return (
                <button
                  key={tab.key}
                  onClick={() => setView(tab.key)}
                  className={`flex-shrink-0 flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all ${
                    isActive
                      ? `bg-gradient-to-r ${grad} text-white shadow-lg`
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon size={12} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.mobileLabel}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      {view === 'planner' ? (
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {/* Page heading */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
              <ListChecks size={14} className="text-amber-400" />
              <span className="text-xs font-bold tracking-[0.2em] text-amber-400 uppercase">Daily Schedule</span>
            </div>
            <h1
              className="text-6xl md:text-8xl font-extrabold tracking-tight leading-none mb-1 text-white"
              style={{ fontFamily: "'Montserrat', 'Inter', sans-serif" }}
            >
              MY DAY PLAN
            </h1>
            <p className="text-xs font-bold tracking-[0.3em] text-amber-400/60 mt-2 uppercase">JJM 2026 ✦ Personal Growth Plan</p>
          </div>
          <Header
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
            onAddActivity={() => handleAdd()}
            onExportExcel={handleExportExcel}
            onExportPdf={handleExportPdf}
            onClearDay={handleClearDay}
            onSaveAsDefault={() => saveAsDefault(selectedDay)}
            onDuplicateDay={duplicateDay}
            onApplyDefault={applyDefault}
            hasDefault={hasDefault}
          />
          <ProgressBar percent={progressPercent} completed={completedCount} total={totalCount} />
          <div className="space-y-6">
            {(Object.keys(SESSION_CONFIG) as SessionType[]).map(session => (
              <SessionCard
                key={session}
                session={session}
                activities={sessions[session]}
                onToggle={toggleComplete}
                onUpdate={updateActivity}
                onEditActivity={handleEditActivity}
                onDelete={deleteActivity}
                onAddToSession={handleAddToSession}
              />
            ))}
          </div>
          <div className="mt-10 text-center">
            <div className="inline-block px-8 py-5 rounded-2xl bg-slate-900/50 border border-amber-500/20 backdrop-blur-sm">
              <p className="text-amber-200/90 italic text-base md:text-lg mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                <span className="text-amber-400/60">"</span>I can do all things through Christ who strengthens me.<span className="text-amber-400/60">"</span>
              </p>
              <p className="text-amber-400 text-xs font-bold tracking-widest">— PHILIPPIANS 4:13 ✦ JJM 2026</p>
            </div>
          </div>
          <div className="mt-8 flex justify-center">
            <button onClick={() => { if (confirm('Reset?')) resetData(); }} className="flex items-center gap-2 text-xs text-slate-500 hover:text-amber-400 transition-colors">
              <Sparkles size={12} /> Reset to Default Activities
            </button>
          </div>
        </div>
      ) : view === 'targets' ? (
        <TargetsSection activities={allActivities} />
      ) : view === 'pillars' ? (
        <PillarsSection />
      ) : view === 'confessions' ? (
        <ConfessionsSection />
      ) : view === 'prophecies' ? (
        <PropheciesSection />
      ) : view === 'prayer' ? (
        <PrayerSection />
      ) : view === 'library' ? (
        <BooksSection />
      ) : view === 'learning' ? (
        <CoursesSection />
      ) : view === 'giving' ? (
        <GivingSection />
      ) : (
        <MessagesSection />
      )}

      {/* Activity Modal */}
      {modalOpen && (
        <ActivityModal
          initial={modalInitial || {}}
          defaultDay={selectedDay}
          modalTitle={editingActivityId ? 'Edit Activity' : (modalInitial?.session ? 'Add to Session' : 'Add New Activity')}
          onSubmit={(data) => {
            if (editingActivityId) {
              updateActivity(editingActivityId, data);
              setEditingActivityId(null);
            } else {
              addActivity(data);
            }
            setModalOpen(false);
          }}
          onClose={() => {
            setModalOpen(false);
            setEditingActivityId(null);
          }}
        />
      )}

      {/* Data Manager Modal */}
      {dataManagerOpen && <DataManager onClose={() => setDataManagerOpen(false)} />}

      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(-5px)} to{opacity:1;transform:translateY(0)} }
        @keyframes modalIn { from{opacity:0;transform:scale(0.95) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .animate-in { animation: modalIn 0.3s ease-out; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #475569; }
        body { background: #0f172a; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
      `}</style>
    </div>
  );
}
