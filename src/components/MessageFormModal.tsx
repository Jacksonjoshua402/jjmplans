import { useState, useRef, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Plus, Trash2, Play, Calendar } from 'lucide-react';
import type { MediaItem, MessageNote } from '../types/messages';
import { processFile } from '../hooks/useMessages';
import NotesEditor from './NotesEditor';

interface MessageFormModalProps {
  initial?: MessageNote | null;
  onSubmit: (data: any) => void;
  onClose: () => void;
}

export default function MessageFormModal({ initial, onSubmit, onClose }: MessageFormModalProps) {
  const [title, setTitle] = useState(initial?.title || '');
  const [speaker, setSpeaker] = useState(initial?.speaker || '');
  const [date, setDate] = useState(initial?.date || new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState(initial?.notes || '');
  const [notesPreview, setNotesPreview] = useState(false);
  const [coverImage, setCoverImage] = useState<MediaItem | null>(initial?.coverImage || null);
  const [gallery, setGallery] = useState<MediaItem[]>(initial?.gallery || []);
  const [uploading, setUploading] = useState(false);
  const coverRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const media = await processFile(file);
    setCoverImage(media);
    setUploading(false);
    if (coverRef.current) coverRef.current.value = '';
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    const mediaItems = await Promise.all(files.map(processFile));
    setGallery(prev => [...prev, ...mediaItems]);
    setUploading(false);
    if (galleryRef.current) galleryRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      speaker: speaker.trim(),
      date,
      notes: notes.trim(),
      keyPoints: initial?.keyPoints || [],
      prayerPoints: initial?.prayerPoints || [],
      series: initial?.series || '',
      scriptureRef: initial?.scriptureRef || '',
      tags: initial?.tags || [],
      coverImage: coverImage || undefined,
      gallery,
    });
  };

  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-10 overflow-y-auto animate-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm fixed" />
      <div
        className="relative w-full max-w-3xl bg-gradient-to-br from-[#0f1f3d] to-[#0a1528] rounded-2xl shadow-2xl border border-slate-700/50 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 h-9 w-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-700/50"
        >
          <X size={18} />
        </button>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Cover Image Upload — prominent, no cutting */}
          <div
            onClick={() => coverRef.current?.click()}
            className={`relative cursor-pointer rounded-2xl overflow-hidden border-2 border-dashed transition-all ${
              coverImage
                ? 'border-amber-500/40'
                : 'border-slate-600/50 hover:border-amber-500/50 bg-slate-800/30'
            }`}
          >
            {coverImage ? (
              <div className="relative">
                <img
                  src={coverImage.dataUrl}
                  alt="Cover"
                  className="w-full max-h-64 object-contain bg-black rounded-xl"
                />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setCoverImage(null); }}
                  className="absolute top-2 right-2 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-semibold transition-all shadow-lg"
                >
                  <Trash2 size={12} /> Remove
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 py-14 bg-slate-800/20">
                <div className="h-14 w-14 rounded-2xl bg-slate-700/40 flex items-center justify-center">
                  <Upload size={24} className="text-slate-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-300">Click to upload main preview</p>
                  <p className="text-xs text-slate-500 mt-1">JPG or PNG — the cover image for your message</p>
                </div>
              </div>
            )}
          </div>
          <input
            ref={coverRef}
            type="file"
            accept="image/*"
            onChange={handleCoverUpload}
            className="hidden"
          />

          {/* Message Title & Preacher */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold tracking-[0.15em] text-slate-400 uppercase mb-2">
                Message Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter message title"
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-[0.15em] text-slate-400 uppercase mb-2">
                Preacher
              </label>
              <input
                type="text"
                value={speaker}
                onChange={(e) => setSpeaker(e.target.value)}
                placeholder="Enter preacher name"
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all text-sm"
              />
            </div>
          </div>

          {/* Date Preached */}
          <div>
            <label className="block text-xs font-bold tracking-[0.15em] text-slate-400 uppercase mb-2">
              Date Preached (Day, Month & Year)
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all text-sm"
            />
            <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5">
              <Calendar size={12} /> {formattedDate}
            </p>
          </div>

          {/* Key Summary / Notes */}
          <div>
            <label className="block text-xs font-bold tracking-[0.15em] text-slate-400 uppercase mb-2">
              Key Summary / Notes
            </label>
            <NotesEditor
              value={notes}
              onChange={setNotes}
              rows={6}
              showPreview={notesPreview}
              onTogglePreview={() => setNotesPreview(p => !p)}
              placeholder="Capture the core message... Use the highlight button or type ==text== to highlight in yellow"
            />
          </div>

          {/* Gallery */}
          <div>
            <label className="block text-xs font-bold tracking-[0.15em] text-slate-400 uppercase mb-2">
              Gallery (Photos/Videos)
            </label>
            <div
              onClick={() => galleryRef.current?.click()}
              className="cursor-pointer rounded-xl border-2 border-dashed border-slate-600/50 hover:border-amber-500/50 transition-all p-6 flex items-center gap-4 bg-slate-800/30"
            >
              <div className="h-12 w-12 rounded-xl bg-slate-700/40 flex items-center justify-center">
                <ImageIcon size={22} className="text-slate-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-300">
                  {uploading ? 'Uploading...' : 'Add photos or videos'}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">Supports JPG, PNG, MP4 — multiple files</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Plus size={18} className="text-amber-400" />
              </div>
            </div>
            <input
              ref={galleryRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleGalleryUpload}
              className="hidden"
            />
            {gallery.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-3">
                {gallery.map((item) => (
                  <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden group bg-slate-900">
                    {item.type === 'image' ? (
                      <img src={item.dataUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                        <Play size={20} className="text-white" fill="white" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setGallery(gallery.filter(g => g.id !== item.id))}
                      className="absolute top-1 right-1 p-1 bg-rose-600/90 hover:bg-rose-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm tracking-wider shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-[1.01] active:scale-95 transition-all"
            >
              {initial ? 'Save Changes' : 'Save Message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
