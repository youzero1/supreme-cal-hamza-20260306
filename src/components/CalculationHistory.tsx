'use client';

import { CalculationHistoryProps, CalculationRecord } from '@/types';

function timeAgo(date: Date): string {
  const now = new Date();
  const d = new Date(date);
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString();
}

function CalcCard({
  calc,
  onShare,
}: {
  calc: CalculationRecord;
  onShare: (c: CalculationRecord) => void;
}) {
  return (
    <div className="feed-card glass rounded-2xl p-4 border border-brand-border hover:border-purple-500/50 transition-all">
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold">
            U
          </div>
          <div>
            <p className="text-white text-sm font-medium">You</p>
            <p className="text-gray-500 text-xs">{timeAgo(calc.createdAt)}</p>
          </div>
        </div>
        {calc.shared && (
          <span className="text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full">
            Shared
          </span>
        )}
      </div>

      {/* Calculation content */}
      <div className="bg-brand-dark rounded-xl p-3 mb-3">
        <p className="text-gray-400 text-xs mb-0.5">{calc.expression}</p>
        <p className="text-white text-xl font-light">= {calc.result}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onShare(calc)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-purple-400 text-xs font-medium hover:from-purple-600/30 hover:to-blue-600/30 transition-all"
        >
          <span>📤</span>
          <span>Share</span>
        </button>
        <button
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(
                `${calc.expression} = ${calc.result}`
              );
            } catch {}
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-surface border border-brand-border text-gray-400 text-xs font-medium hover:text-white transition-colors"
        >
          <span>📋</span>
          <span>Copy</span>
        </button>
      </div>
    </div>
  );
}

export default function CalculationHistory({
  calculations,
  onShare,
  onRefresh,
  isLoading,
}: CalculationHistoryProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h2 className="text-white font-bold text-base flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
          Recent Calculations
        </h2>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="text-xs text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-50 flex items-center gap-1"
        >
          <span className={isLoading ? 'animate-spin' : ''}>↻</span>
          Refresh
        </button>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 rounded-2xl bg-brand-surface animate-pulse"
              />
            ))}
          </div>
        ) : calculations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-4xl mb-3">🧮</div>
            <p className="text-gray-400 text-sm font-medium">No calculations yet</p>
            <p className="text-gray-600 text-xs mt-1">Start calculating to see your history here!</p>
          </div>
        ) : (
          calculations.map((calc) => (
            <CalcCard key={calc.id} calc={calc} onShare={onShare} />
          ))
        )}
      </div>
    </div>
  );
}
