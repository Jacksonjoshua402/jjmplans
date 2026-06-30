interface ProgressBarProps {
  percent: number;
  completed: number;
  total: number;
}

export default function ProgressBar({ percent, completed, total }: ProgressBarProps) {
  return (
    <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl px-6 py-4 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <span className="text-xs sm:text-sm font-bold tracking-[0.2em] text-amber-300/90 uppercase whitespace-nowrap">
          Today's Progress
        </span>
        <div className="flex w-full items-center gap-4">
          <div className="flex-1 w-full relative h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
              style={{
                width: `${percent}%`,
                background: 'linear-gradient(90deg, #d4a84b 0%, #f5e6a8 50%, #d4a84b 100%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 3s linear infinite',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </div>
            {/* Tick marks */}
            <div className="absolute inset-0 flex justify-between px-0.5 pointer-events-none">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="w-px h-full bg-slate-900/50" />
              ))}
            </div>
          </div>
          <span
            className="text-xl font-bold min-w-[50px] text-right tabular-nums"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: percent === 100 ? '#f5e6a8' : '#d4a84b',
            }}
          >
            {percent}%
          </span>
        </div>
      </div>
      {total > 0 && (
        <div className="mt-2 text-center text-xs text-slate-400">
          {completed} of {total} activities completed
        </div>
      )}
    </div>
  );
}
