import { useState } from 'react';
import { Target, Sparkles, Columns3 } from 'lucide-react';
import { usePillars } from '../hooks/usePillars';
import PillarCard from './PillarCard';
import PillarFormModal from './PillarFormModal';
import type { Pillar } from '../types/pillars';

export default function PillarsSection() {
  const { pillars, updatePillar, resetPillars, togglePillar } = usePillars();
  const [editingPillar, setEditingPillar] = useState<Pillar | null>(null);

  const activeCount = pillars.filter(p => p.isActive).length;
  const filledCount = pillars.filter(p => p.description || p.notes || p.keyVerses.length > 0).length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 mb-4">
          <Target size={14} className="text-amber-400" />
          <span className="text-xs font-bold tracking-[0.2em] text-amber-400 uppercase">Life Foundations</span>
        </div>
        <h1
          className="text-3xl md:text-5xl font-extrabold mb-3 tracking-tight"
          style={{
            fontFamily: "'Montserrat', 'Inter', sans-serif",
            background: 'linear-gradient(135deg, #f5e6a8 0%, #d4a84b 50%, #b8863a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          My Pillars
        </h1>
        <p className="text-amber-200/60 text-sm max-w-xl mx-auto">
          The 17 foundational pillars of my life and personal growth plan. Click on any pillar to add your vision, verses, and notes.
        </p>
      </div>

      {/* Stats bar */}
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/50 rounded-2xl p-5 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Columns3 size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">17 Pillars of Life</h2>
              <p className="text-xs text-slate-400">Your foundational priorities</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-xl font-bold text-amber-300">{activeCount}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-emerald-300">{filledCount}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Filled</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-blue-300">{17 - activeCount}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Inactive</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pillars grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {pillars.map((pillar) => (
          <PillarCard
            key={pillar.id}
            pillar={pillar}
            onEdit={setEditingPillar}
            onToggle={togglePillar}
          />
        ))}
      </div>

      {/* Bible verse footer */}
      <div className="mt-12 text-center">
        <div className="inline-block px-8 py-5 rounded-2xl bg-slate-900/50 border border-amber-500/20 backdrop-blur-sm">
          <p
            className="text-amber-200/90 italic text-base mb-1"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            <span className="text-amber-400/60">"</span>
            But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.
            <span className="text-amber-400/60">"</span>
          </p>
          <p className="text-amber-400 text-xs font-bold tracking-widest">
            — MATTHEW 6:33 ✦ JJM 2026
          </p>
        </div>
      </div>

      {/* Reset */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => {
            if (confirm('Reset all pillar data? This will clear your descriptions, verses, and notes.')) {
              resetPillars();
            }
          }}
          className="flex items-center gap-2 text-xs text-slate-500 hover:text-amber-400 transition-colors"
        >
          <Sparkles size={12} />
          Reset Pillar Data
        </button>
      </div>

      {/* Edit Modal */}
      {editingPillar && (
        <PillarFormModal
          initial={editingPillar}
          onClose={() => setEditingPillar(null)}
          onSubmit={(updates) => {
            updatePillar(editingPillar.id, updates);
            setEditingPillar(null);
          }}
        />
      )}
    </div>
  );
}
