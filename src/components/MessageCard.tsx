import { useState } from 'react';
import { Play, Calendar, User, BookOpen, Tag, ImageIcon, Eye, CalendarDays } from 'lucide-react';
import type { MessageNote } from '../types/messages';

interface MessageCardProps {
  message: MessageNote;
  onView: (message: MessageNote) => void;
}

export default function MessageCard({ message, onView }: MessageCardProps) {
  const [imgError, setImgError] = useState(false);
  const galleryCount = message.gallery.length;
  const mediaCount = (message.coverImage ? 1 : 0) + galleryCount;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  return (
    <div
      onClick={() => onView(message)}
      className="group relative text-left bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl border border-slate-700/50 overflow-hidden hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      {/* Cover image */}
      <div className="relative w-full bg-slate-800 overflow-hidden">
        {message.coverImage && !imgError ? (
          <img
            src={message.coverImage.dataUrl}
            alt={message.title}
            onError={() => setImgError(true)}
            className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full aspect-video flex items-center justify-center bg-gradient-to-br from-amber-500/15 to-orange-500/15">
            <BookOpen size={40} className="text-amber-400/40" />
          </div>
        )}

        {/* Media count badge */}
        {mediaCount > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-semibold">
            <ImageIcon size={12} />
            {mediaCount}
            {message.gallery.some(g => g.type === 'video') && (
              <>
                <span className="mx-0.5 opacity-50">·</span>
                <Play size={10} fill="white" />
              </>
            )}
          </div>
        )}

        {/* Series tag */}
        {message.series && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-500/90 text-white text-[10px] font-bold tracking-wider uppercase">
            {message.series}
          </div>
        )}

        {/* Date on image */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium">
          <CalendarDays size={12} />
          {formatDate(message.date)}
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />

        {/* View overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/0 group-hover:to-amber-500/10 transition-all opacity-0 group-hover:opacity-100" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/95 backdrop-blur-sm text-slate-900 text-sm font-bold shadow-xl">
            <Eye size={16} /> View Message
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <h3
          className="text-lg font-bold text-amber-100 group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug"
        >
          {message.title}
        </h3>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
          {message.speaker && (
            <span className="flex items-center gap-1">
              <User size={11} /> {message.speaker}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar size={11} /> {formatDate(message.date)}
          </span>
          {message.scriptureRef && (
            <span className="flex items-center gap-1 text-amber-400/70">
              <BookOpen size={11} /> {message.scriptureRef}
            </span>
          )}
        </div>

        {/* Notes preview */}
        {message.notes && (
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {message.notes}
          </p>
        )}

        {/* Tags */}
        {message.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 pt-1">
            <Tag size={11} className="text-slate-600" />
            {message.tags.slice(0, 4).map(tag => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-slate-700/50 text-slate-300 text-[10px] font-medium"
              >
                {tag}
              </span>
            ))}
            {message.tags.length > 4 && (
              <span className="text-[10px] text-slate-500">+{message.tags.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
