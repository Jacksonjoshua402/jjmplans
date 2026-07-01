import { useState, useMemo } from 'react';
import { Plus, Search, BookOpen, LayoutGrid, List } from 'lucide-react';
import MessageCard from './MessageCard';
import MessageFormModal from './MessageFormModal';
import MessageDetail from './MessageDetail';
import { useMessages } from '../hooks/useMessages';
import type { MessageNote } from '../types/messages';

export default function MessagesSection() {
  const { messages, addMessage, updateMessage, deleteMessage, resetMessages } = useMessages();
  const [formOpen, setFormOpen] = useState(false);
  const [editingMsg, setEditingMsg] = useState<MessageNote | null>(null);
  const [viewingMsg, setViewingMsg] = useState<MessageNote | null>(null);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredMessages = useMemo(() => {
    if (!search.trim()) return messages;
    const q = search.toLowerCase();
    return messages.filter(m =>
      m.title.toLowerCase().includes(q) ||
      m.speaker.toLowerCase().includes(q) ||
      m.scriptureRef.toLowerCase().includes(q) ||
      m.tags.some(t => t.toLowerCase().includes(q)) ||
      m.notes.toLowerCase().includes(q)
    );
  }, [messages, search]);

  const sortedMessages = useMemo(() => {
    return [...filteredMessages].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [filteredMessages]);

  const groupedByMonth = useMemo(() => {
    const groups: Record<string, MessageNote[]> = {};
    sortedMessages.forEach(msg => {
      const d = new Date(msg.date + 'T00:00:00');
      const key = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      if (!groups[key]) groups[key] = [];
      groups[key].push(msg);
    });
    return groups;
  }, [sortedMessages]);

  const handleEdit = (msg: MessageNote) => {
    setViewingMsg(null);
    setEditingMsg(msg);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 mb-4">
          <BookOpen size={14} className="text-amber-400" />
          <span className="text-xs font-bold tracking-[0.2em] text-amber-400 uppercase">Sermon Archive</span>
        </div>
        <h1
          className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight text-white"
          style={{ fontFamily: "'Montserrat', 'Inter', sans-serif" }}
        >
          MESSAGE NOTES
        </h1>
        <p className="text-amber-200/60 text-sm italic max-w-xl mx-auto">
          Capture every revelation. Store sermon photos, videos, and insights for future reference.
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
            placeholder="Search messages, speakers, scriptures..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-slate-800/50 border border-slate-700 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Grid view"
            >
              <LayoutGrid size={14} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'list' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="List view"
            >
              <List size={14} />
            </button>
          </div>

          <button
            onClick={() => { setEditingMsg(null); setFormOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-[1.02] active:scale-95 transition-all whitespace-nowrap"
          >
            <Plus size={16} /> New Message
          </button>
        </div>
      </div>

      {/* Messages */}
      {messages.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-dashed border-slate-700">
          <div className="inline-flex h-16 w-16 rounded-2xl bg-amber-500/10 items-center justify-center mb-4">
            <BookOpen size={28} className="text-amber-400/60" />
          </div>
          <h3 className="text-amber-200/70 font-semibold mb-1">No messages yet</h3>
          <p className="text-slate-400 text-sm mb-4">Start building your sermon archive</p>
          <button
            onClick={() => setFormOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-sm font-semibold hover:bg-amber-500/30 transition-all"
          >
            <Plus size={16} /> Add Your First Message
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedByMonth).map(([month, monthMsgs]) => (
            <div key={month}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-sm font-bold tracking-[0.15em] text-amber-400/80 uppercase">{month}</h2>
                <span className="flex-1 h-px bg-gradient-to-r from-amber-500/30 to-transparent" />
                <span className="text-xs text-slate-500">{monthMsgs.length} message{monthMsgs.length !== 1 ? 's' : ''}</span>
              </div>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {monthMsgs.map(msg => (
                    <MessageCard
                      key={msg.id}
                      message={msg}
                      onView={setViewingMsg}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {monthMsgs.map(msg => (
                    <MessageListRow key={msg.id} message={msg} onView={setViewingMsg} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reset */}
      {messages.length > 0 && (
        <div className="mt-10 text-center">
          <button
            onClick={() => {
              if (confirm('Delete ALL message notes? This cannot be undone.')) {
                resetMessages();
              }
            }}
            className="text-xs text-slate-500 hover:text-rose-400 transition-colors"
          >
            Clear All Messages
          </button>
        </div>
      )}

      {/* New Message Modal */}
      {formOpen && !editingMsg && (
        <MessageFormModal
          onClose={() => setFormOpen(false)}
          onSubmit={(data) => {
            addMessage(data);
            setFormOpen(false);
          }}
        />
      )}

      {/* Edit Message Modal */}
      {editingMsg && (
        <MessageFormModal
          initial={editingMsg}
          onClose={() => setEditingMsg(null)}
          onSubmit={(data) => {
            updateMessage(editingMsg.id, data);
            setEditingMsg(null);
          }}
        />
      )}

      {/* View Message Detail */}
      {viewingMsg && (
        <MessageDetail
          message={viewingMsg}
          onClose={() => setViewingMsg(null)}
          onDelete={(id) => { deleteMessage(id); setViewingMsg(null); }}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}

function MessageListRow({ message, onView }: { message: MessageNote; onView: (m: MessageNote) => void }) {
  const formatDate = (dateStr: string) =>
    new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div
      onClick={() => onView(message)}
      className="flex items-center gap-4 p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl hover:border-amber-500/40 hover:bg-slate-800/60 transition-all cursor-pointer group"
    >
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden bg-slate-700">
        {message.coverImage ? (
          <img src={message.coverImage.dataUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500/20 to-orange-500/20">
            <BookOpen size={18} className="text-amber-400/50" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-amber-100 group-hover:text-amber-300 transition-colors truncate">
          {message.title}
        </h3>
        <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
          {message.speaker && <span>{message.speaker}</span>}
          <span>· {formatDate(message.date)}</span>
          {message.scriptureRef && <span className="text-amber-400/70">· {message.scriptureRef}</span>}
        </div>
      </div>

      {/* Media count */}
      <div className="flex-shrink-0 flex items-center gap-3">
        {((message.coverImage ? 1 : 0) + message.gallery.length) > 0 && (
          <span className="text-xs text-slate-500 bg-slate-700/50 px-2 py-1 rounded-md">
            📷 {(message.coverImage ? 1 : 0) + message.gallery.length}
          </span>
        )}
      </div>
    </div>
  );
}
