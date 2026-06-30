import { useState } from 'react';
import { X, Play, User, BookOpen, Tag, Image as ImageIcon, Trash2, Download, Pencil, CalendarDays } from 'lucide-react';
import type { MessageNote, MediaItem } from '../types/messages';
import MediaViewer from './MediaViewer';
import { renderNotes } from '../utils/notesFormatter';

interface MessageDetailProps {
  message: MessageNote;
  onClose: () => void;
  onDelete: (id: string) => void;
  onEdit: (message: MessageNote) => void;
}

export default function MessageDetail({ message, onClose, onDelete, onEdit }: MessageDetailProps) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const allMedia: MediaItem[] = [
    ...(message.coverImage ? [message.coverImage] : []),
    ...message.gallery,
  ];

  const openMedia = (idx: number) => {
    setViewerIndex(idx);
    setViewerOpen(true);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
  };

  const handleDownload = () => {
    const content = `
${message.title}
${'='.repeat(message.title.length)}

Date Preached: ${formatDate(message.date)}
Speaker: ${message.speaker || 'N/A'}
Series: ${message.series || 'N/A'}
Scripture: ${message.scriptureRef || 'N/A'}
Tags: ${message.tags.join(', ') || 'N/A'}

${'—'.repeat(40)}

KEY POINTS
${message.keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}

${'—'.repeat(40)}

PRAYER POINTS
${message.prayerPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}

${'—'.repeat(40)}

NOTES
${message.notes}

— Generated from My Day Plan — JJM 2026
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${message.title.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto animate-in p-4 pt-10 sm:pt-8" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md fixed" />
      <div
        className="relative w-full max-w-4xl bg-gradient-to-br from-[#0f1f3d] to-[#0a1528] rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top actions bar */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={() => onEdit(message)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-amber-500/90 hover:bg-amber-500 text-white text-xs font-semibold transition-all shadow-lg shadow-amber-500/30"
            title="Edit message"
          >
            <Pencil size={14} /> Edit
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700/50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Cover image section — nice and prominent */}
        {message.coverImage ? (
          <div className="relative w-full bg-black">
            <img
              src={message.coverImage.dataUrl}
              alt={message.title}
              className="w-full max-h-[45vh] object-contain"
            />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0a1528] via-[#0a1528]/80 to-transparent pointer-events-none" />
          </div>
        ) : (
          <div className="w-full h-40 flex items-center justify-center bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-b border-slate-700/30">
            <BookOpen size={48} className="text-amber-400/40" />
          </div>
        )}

        {/* Title & series */}
        <div className="px-6 pt-4 pb-3 -mt-8 relative z-10">
          {message.series && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/90 text-white text-[10px] font-bold tracking-[0.15em] uppercase mb-3 shadow-lg shadow-amber-500/30">
              {message.series}
            </div>
          )}
          <h2
            className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3 tracking-tight"
            style={{ fontFamily: "'Montserrat', 'Inter', sans-serif" }}
          >
            {message.title}
          </h2>

          {/* Meta info — big and clear */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-300 pt-2">
            {message.speaker && (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center">
                  <User size={14} className="text-amber-400" />
                </div>
                <span className="font-medium text-white">{message.speaker}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center">
                <CalendarDays size={14} className="text-blue-400" />
              </div>
              <span className="font-medium text-white">{formatDate(message.date)}</span>
            </div>
            {message.scriptureRef && (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 flex items-center justify-center">
                  <BookOpen size={14} className="text-violet-400" />
                </div>
                <span className="font-medium text-amber-300">{message.scriptureRef}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {message.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-4">
              <Tag size={12} className="text-slate-500" />
              {message.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 text-xs font-medium border border-amber-500/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="px-6 pb-6">
          <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        </div>

        {/* Main content */}
        <div className="px-6 pb-6 space-y-6">
          {/* Key Points */}
          {message.keyPoints.length > 0 && (
            <div>
              <h3 className="text-xs font-bold tracking-[0.15em] text-amber-400 uppercase mb-3 flex items-center gap-2">
                <span className="w-8 h-px bg-amber-500/50" /> Key Points
              </h3>
              <div className="space-y-2">
                {message.keyPoints.map((point, i) => (
                  <div key={i} className="flex gap-3 bg-slate-800/40 rounded-xl p-4 border border-slate-700/30">
                    <span className="flex-shrink-0 h-7 w-7 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center border border-amber-500/30">
                      {i + 1}
                    </span>
                    <p className="text-sm text-slate-200 leading-relaxed pt-0.5">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {message.notes && (
            <div>
              <h3 className="text-xs font-bold tracking-[0.15em] text-amber-400 uppercase mb-3 flex items-center gap-2">
                <span className="w-8 h-px bg-amber-500/50" /> Full Notes
              </h3>
              <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/30 leading-relaxed space-y-1.5">
                {renderNotes(message.notes)}
              </div>
            </div>
          )}

          {/* Prayer Points */}
          {message.prayerPoints.length > 0 && (
            <div>
              <h3 className="text-xs font-bold tracking-[0.15em] text-amber-400 uppercase mb-3 flex items-center gap-2">
                <span className="w-8 h-px bg-amber-500/50" /> Prayer Points
              </h3>
              <div className="space-y-2">
                {message.prayerPoints.map((point, i) => (
                  <div key={i} className="flex gap-3 bg-gradient-to-r from-amber-500/5 to-transparent rounded-xl p-4 border-l-2 border-amber-500/50">
                    <span className="flex-shrink-0 text-amber-400 text-lg">✦</span>
                    <p className="text-sm text-slate-200 leading-relaxed italic">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gallery */}
          {allMedia.length > 0 && (
            <div>
              <h3 className="text-xs font-bold tracking-[0.15em] text-amber-400 uppercase mb-3 flex items-center gap-2">
                <span className="w-8 h-px bg-amber-500/50" /> Photos & Videos ({allMedia.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {allMedia.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => openMedia(idx)}
                    className="relative aspect-square rounded-xl overflow-hidden bg-slate-800 group hover:ring-2 hover:ring-amber-500/50 transition-all shadow-md"
                  >
                    {item.type === 'image' ? (
                      <img src={item.dataUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                        <Play size={32} className="text-white" fill="white" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                      <ImageIcon size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="sticky bottom-0 bg-gradient-to-t from-[#0a1528] via-[#0a1528]/95 to-[#0a1528]/80 backdrop-blur-sm border-t border-slate-700/50 px-6 py-4 flex flex-col sm:flex-row items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>Date preached:</span>
            <span className="font-semibold text-amber-300">{formatDate(message.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-white text-xs font-semibold transition-all"
            >
              <Download size={14} /> Download
            </button>
            <button
              onClick={() => onEdit(message)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-all"
            >
              <Pencil size={14} /> Edit Message
            </button>
            <button
              onClick={() => {
                if (confirm('Delete these message notes?')) {
                  onDelete(message.id);
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-900/40 hover:bg-rose-900/60 border border-rose-700/50 text-rose-200 text-xs font-semibold transition-all"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      </div>

      {viewerOpen && (
        <MediaViewer
          items={allMedia}
          startIndex={viewerIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </div>
  );
}
