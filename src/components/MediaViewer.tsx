import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { MediaItem } from '../types/messages';

interface MediaViewerProps {
  items: MediaItem[];
  startIndex: number;
  onClose: () => void;
}

export default function MediaViewer({ items, startIndex, onClose }: MediaViewerProps) {
  const [index, setIndex] = useState(startIndex);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setIndex(i => (i - 1 + items.length) % items.length);
      if (e.key === 'ArrowRight') setIndex(i => (i + 1) % items.length);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [items.length, onClose]);

  const item = items[index];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in" onClick={onClose}>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
      >
        <X size={24} />
      </button>

      {items.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); setIndex(i => (i - 1 + items.length) % items.length); }}
            className="absolute left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setIndex(i => (i + 1) % items.length); }}
            className="absolute right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}

      <div className="max-w-6xl max-h-[90vh] p-4" onClick={(e) => e.stopPropagation()}>
        {item.type === 'image' ? (
          <img
            src={item.dataUrl}
            alt={item.name}
            className="max-w-full max-h-[85vh] object-contain rounded-xl"
          />
        ) : (
          <video
            src={item.dataUrl}
            controls
            autoPlay
            className="max-w-full max-h-[85vh] rounded-xl"
          />
        )}
        {items.length > 1 && (
          <div className="text-center text-white/70 text-sm mt-3">
            {index + 1} / {items.length}
          </div>
        )}
      </div>
    </div>
  );
}
