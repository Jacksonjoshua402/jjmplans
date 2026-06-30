import { useRef } from 'react';
import { Highlighter, Bold, Italic, Heading1, Heading2, List, Quote, Eye, EyeOff } from 'lucide-react';
import { renderNotes } from '../utils/notesFormatter';

interface NotesEditorProps {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
  showPreview?: boolean;
  onTogglePreview?: () => void;
}

export default function NotesEditor({
  value,
  onChange,
  rows = 6,
  placeholder = 'Capture the core message... Use ==text== for yellow highlights',
  showPreview = false,
  onTogglePreview,
}: NotesEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wrapSelection = (before: string, after: string = before) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end) || 'text';
    const newText = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(newText);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };

  const insertLinePrefix = (prefix: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    // Find start of current line
    let lineStart = start;
    while (lineStart > 0 && value[lineStart - 1] !== '\n') lineStart--;
    const newText = value.slice(0, lineStart) + prefix + value.slice(lineStart);
    onChange(newText);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + prefix.length, start + prefix.length);
    }, 0);
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-slate-700/60 bg-slate-900/50 flex-wrap">
        <ToolbarButton
          onClick={() => wrapSelection('==')}
          title="Highlight (Yellow)"
          icon={<Highlighter size={13} />}
          accent="text-yellow-400 hover:bg-yellow-400/10"
        />
        <div className="w-px h-5 bg-slate-700 mx-1" />
        <ToolbarButton
          onClick={() => wrapSelection('**')}
          title="Bold"
          icon={<Bold size={13} />}
        />
        <ToolbarButton
          onClick={() => wrapSelection('*')}
          title="Italic"
          icon={<Italic size={13} />}
        />
        <div className="w-px h-5 bg-slate-700 mx-1" />
        <ToolbarButton
          onClick={() => insertLinePrefix('# ')}
          title="Heading"
          icon={<Heading1 size={13} />}
        />
        <ToolbarButton
          onClick={() => insertLinePrefix('## ')}
          title="Subheading"
          icon={<Heading2 size={13} />}
        />
        <ToolbarButton
          onClick={() => insertLinePrefix('- ')}
          title="List item"
          icon={<List size={13} />}
        />
        <ToolbarButton
          onClick={() => insertLinePrefix('> ')}
          title="Quote"
          icon={<Quote size={13} />}
        />
        {onTogglePreview && (
          <>
            <div className="w-px h-5 bg-slate-700 mx-1" />
            <button
              type="button"
              onClick={onTogglePreview}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                showPreview
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'text-slate-400 hover:bg-slate-700/60 hover:text-slate-200'
              }`}
            >
              {showPreview ? <EyeOff size={11} /> : <Eye size={11} />}
              {showPreview ? 'Edit' : 'Preview'}
            </button>
          </>
        )}
        <span className="text-[10px] text-slate-500 ml-auto px-2 hidden sm:inline">
          Tip: highlight with <code className="text-yellow-400">==text==</code>
        </span>
      </div>

      {/* Editor / Preview */}
      {showPreview ? (
        <div className="px-4 py-3 min-h-[150px] space-y-1.5">
          {value.trim() ? renderNotes(value) : (
            <p className="text-sm text-slate-500 italic">Nothing to preview</p>
          )}
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-transparent text-white placeholder-slate-500 focus:outline-none text-sm resize-none leading-relaxed"
          style={{ fontFamily: "'Inter', sans-serif" }}
        />
      )}
    </div>
  );
}

function ToolbarButton({
  onClick,
  title,
  icon,
  accent,
}: {
  onClick: () => void;
  title: string;
  icon: React.ReactNode;
  accent?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded transition-all ${
        accent || 'text-slate-400 hover:bg-slate-700/60 hover:text-slate-200'
      }`}
    >
      {icon}
    </button>
  );
}
