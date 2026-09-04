import React from "react";

export default function SentimentBreakdownChart({ distribution = {} }) {
  const positive = distribution.positive_percentage ?? 0;
  const neutral = distribution.neutral_percentage ?? 0;
  const negative = distribution.negative_percentage ?? 0;

  const posCount = distribution.positive ?? 0;
  const neuCount = distribution.neutral ?? 0;
  const negCount = distribution.negative ?? 0;

  return (
    <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 backdrop-blur">
      <h2 className="text-base font-bold text-white mb-4">
        Sentiment Breakdown
      </h2>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs font-medium mb-1">
            <span className="text-emerald-400">
              Positive ({positive.toFixed(1)}%)
            </span>
            <span className="text-slate-400">{posCount} submissions</span>
          </div>
          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, positive))}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs font-medium mb-1">
            <span className="text-amber-400">
              Neutral ({neutral.toFixed(1)}%)
            </span>
            <span className="text-slate-400">{neuCount} submissions</span>
          </div>
          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, neutral))}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs font-medium mb-1">
            <span className="text-rose-400">
              Negative ({negative.toFixed(1)}%)
            </span>
            <span className="text-slate-400">{negCount} submissions</span>
          </div>
          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-rose-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, negative))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
