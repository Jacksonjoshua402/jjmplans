import { useState, useMemo } from 'react';
import { Plus, Search, Book as BookIcon, Trash2, Pencil, Star } from 'lucide-react';
import { useLearning } from '../hooks/useLearning';
import type { Book, BookStatus } from '../types/learning';
import { LEARNING_CATEGORIES } from '../types/learning';

export default function BooksSection() {
  const { books, addBook, updateBook, deleteBook } = useLearning();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | BookStatus>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const filtered = useMemo(() => {
    return books.filter(b => {
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
      }
      return true;
    });
  }, [books, search, statusFilter]);

  const handleOpenEdit = (b: Book) => {
    setEditingBook(b);
    setModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingBook(null);
    setModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-4">
          <BookIcon size={14} className="text-emerald-400" />
          <span className="text-xs font-bold tracking-[0.2em] text-emerald-400 uppercase">My Library</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2 text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          Books & Reading
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Keep track of the books you are reading, your progress, and key insights gained from each one.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Search titles or authors..." 
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all text-sm" 
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          >
            <option value="all">All Status</option>
            <option value="reading">Currently Reading</option>
            <option value="want-to-read">Want to Read</option>
            <option value="finished">Finished</option>
          </select>
          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold shadow-lg hover:shadow-emerald-600/30 transition-all active:scale-95"
          >
            <Plus size={16} /> Add Book
          </button>
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(book => (
            <BookCard key={book.id} book={book} onEdit={handleOpenEdit} onDelete={deleteBook} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-dashed border-slate-700">
          <BookIcon size={48} className="mx-auto text-slate-600 mb-4" />
          <h3 className="text-slate-300 font-semibold mb-1">No books found</h3>
          <p className="text-slate-500 text-sm mb-6">Start building your reading list</p>
          <button 
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/30 transition-all"
          >
            <Plus size={16} /> Add Your First Book
          </button>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <BookFormModal 
          initial={editingBook} 
          onClose={() => setModalOpen(false)} 
          onSubmit={(data) => {
            if (editingBook) updateBook(editingBook.id, data);
            else addBook(data);
            setModalOpen(false);
          }} 
        />
      )}
    </div>
  );
}

function BookCard({ book, onEdit, onDelete }: { 
  book: Book; 
  onEdit: (b: Book) => void; 
  onDelete: (id: string) => void;
}) {
  const percent = Math.round((book.progressPages / book.totalPages) * 100) || 0;
  
  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-emerald-500/40 transition-all group shadow-xl">
      <div className="aspect-[3/4] bg-slate-700 relative overflow-hidden">
        {book.coverImage ? (
          <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <BookIcon size={48} className="text-slate-600 mb-2" />
            <p className="text-sm font-bold text-slate-400">{book.title}</p>
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(book)} className="p-2 rounded-lg bg-black/60 text-white hover:bg-emerald-500 transition-colors"><Pencil size={14}/></button>
          <button onClick={() => onDelete(book.id)} className="p-2 rounded-lg bg-black/60 text-white hover:bg-rose-500 transition-colors"><Trash2 size={14}/></button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 to-transparent">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
            book.status === 'reading' ? 'bg-emerald-500 text-white' : 
            book.status === 'finished' ? 'bg-blue-500 text-white' : 'bg-slate-600 text-white'
          }`}>
            {book.status.replace('-', ' ')}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{book.title}</h3>
        <p className="text-sm text-slate-400 mb-4">{book.author}</p>
        
        {book.status === 'reading' && (
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
              <span>Progress</span>
              <span className="text-emerald-400">{percent}%</span>
            </div>
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 transition-all" style={{ width: `${percent}%` }} />
            </div>
            <p className="text-[10px] text-slate-500 text-center">{book.progressPages} of {book.totalPages} pages</p>
          </div>
        )}
        
        {book.status === 'finished' && (
          <div className="flex items-center gap-1 text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className={i < (book.rating || 0) ? 'fill-yellow-400' : 'text-slate-600'} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BookFormModal({ initial, onClose, onSubmit }: { initial: Book | null; onClose: () => void; onSubmit: (data: any) => void }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [author, setAuthor] = useState(initial?.author || '');
  const [status, setStatus] = useState<BookStatus>(initial?.status || 'want-to-read');
  const [category, setCategory] = useState(initial?.category || 'Spiritual');
  const [totalPages, setTotalPages] = useState(initial?.totalPages || 0);
  const [progressPages, setProgressPages] = useState(initial?.progressPages || 0);
  const [notes, setNotes] = useState(initial?.notes || '');
  const [coverImage, setCoverImage] = useState(initial?.coverImage || '');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCoverImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl animate-in p-6">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white"><Plus className="rotate-45" size={24}/></button>
        <h2 className="text-2xl font-bold text-white mb-6">{initial ? 'Edit Book' : 'Add New Book'}</h2>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <div 
              onClick={() => document.getElementById('cover-upload')?.click()}
              className="w-24 h-32 flex-shrink-0 bg-slate-800 rounded-lg border-2 border-dashed border-slate-700 flex items-center justify-center cursor-pointer overflow-hidden"
            >
              {coverImage ? <img src={coverImage} className="w-full h-full object-cover" /> : <Plus className="text-slate-600" />}
              <input id="cover-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>
            <div className="flex-1 space-y-4">
              <input 
                type="text" placeholder="Book Title" value={title} onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm" 
              />
              <input 
                type="text" placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <select value={status} onChange={e => setStatus(e.target.value as any)} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm">
              <option value="want-to-read">Want to Read</option>
              <option value="reading">Currently Reading</option>
              <option value="finished">Finished</option>
            </select>
            <select value={category} onChange={e => setCategory(e.target.value)} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm">
              {LEARNING_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Total Pages</label>
              <input type="number" value={totalPages} onChange={e => setTotalPages(parseInt(e.target.value))} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Progress (Pages)</label>
              <input type="number" value={progressPages} onChange={e => setProgressPages(parseInt(e.target.value))} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm" />
            </div>
          </div>
          
          <textarea 
            placeholder="Key insights and notes..." value={notes} onChange={e => setNotes(e.target.value)} rows={4}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm resize-none"
          />
          
          <button 
            onClick={() => onSubmit({ title, author, status, category, totalPages, progressPages, notes, coverImage })}
            className="w-full py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all"
          >
            Save Book
          </button>
        </div>
      </div>
    </div>
  );
}
