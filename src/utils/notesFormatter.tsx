import React from 'react';

/**
 * Renders notes with custom formatting:
 * - ==text== → Yellow highlight (titles/subtitles)
 * - **text** → Bold
 * - *text* → Italic
 * - # Heading → Large amber heading
 * - ## Subheading → Medium amber subheading
 * - - List item → Bulleted list item
 * - > Quote → Quoted block
 */
export function renderNotes(text: string): React.ReactNode {
  if (!text) return null;
  const lines = text.split('\n');

  return lines.map((line, idx) => {
    const trimmed = line.trim();

    // Empty line
    if (!trimmed) return <div key={idx} className="h-3" />;

    // Heading H1
    if (trimmed.startsWith('# ')) {
      return (
        <h3 key={idx} className="text-lg font-bold text-amber-300 mt-3 mb-1.5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          {renderInline(trimmed.slice(2))}
        </h3>
      );
    }

    // Heading H2
    if (trimmed.startsWith('## ')) {
      return (
        <h4 key={idx} className="text-base font-bold text-amber-200 mt-2 mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          {renderInline(trimmed.slice(3))}
        </h4>
      );
    }

    // List item
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      return (
        <div key={idx} className="flex gap-2 items-start ml-2 my-1">
          <span className="text-amber-400 mt-1">•</span>
          <span className="flex-1 text-slate-200 leading-relaxed">{renderInline(trimmed.slice(2))}</span>
        </div>
      );
    }

    // Quote / blockquote
    if (trimmed.startsWith('> ')) {
      return (
        <div key={idx} className="border-l-2 border-amber-500/40 pl-3 py-1 my-1.5 bg-amber-500/5">
          <p className="text-sm text-amber-100/90 italic leading-relaxed">{renderInline(trimmed.slice(2))}</p>
        </div>
      );
    }

    // Default paragraph
    return (
      <p key={idx} className="text-sm text-slate-200 leading-relaxed">
        {renderInline(line)}
      </p>
    );
  });
}

/**
 * Render inline formatting within a line:
 * - ==text==     → highlighted yellow
 * - **text**     → bold
 * - *text*       → italic
 */
function renderInline(text: string): React.ReactNode {
  // Token regex: highlight, bold, italic
  const regex = /(==[^=\n]+==|\*\*[^*\n]+\*\*|\*[^*\n]+\*)/g;
  const parts = text.split(regex).filter(p => p !== undefined && p !== '');

  return parts.map((part, i) => {
    if (part.startsWith('==') && part.endsWith('==')) {
      return (
        <span
          key={i}
          className="bg-yellow-400/85 text-slate-900 px-1.5 py-0.5 rounded font-semibold"
          style={{ boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' }}
        >
          {part.slice(2, -2)}
        </span>
      );
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <em key={i} className="italic text-amber-200">{part.slice(1, -1)}</em>;
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}
