import React from "react";
import { ThumbsUp, ThumbsDown, Minus } from "lucide-react";

export default function SentimentBreakdownChart({ distribution }) {
  const pos = distribution?.positive ?? 0;
  const neu = distribution?.neutral ?? 0;
  const neg = distribution?.negative ?? 0;
  const total = pos + neu + neg || 1;

  const posPct =
    distribution?.positive_percentage ?? Math.round((pos / total) * 100);
  const neuPct =
    distribution?.neutral_percentage ?? Math.round((neu / total) * 100);
  const negPct =
    distribution?.negative_percentage ?? Math.round((neg / total) * 100);

  return (
    <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 backdrop-blur">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-white">Sentiment Breakdown</h2>
        <span className="text-xs text-slate-400 font-mono">
          Total Analyzed: {pos + neu + neg}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs font-medium mb-1">
            <span className="text-emerald-400 flex items-center gap-1">
              <ThumbsUp className="w-3.5 h-3.5" /> Positive ({posPct}%)
            </span>
            <span className="text-slate-400">{pos} submissions</span>
          </div>
          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, posPct))}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-medium mb-1">
            <span className="text-amber-400 flex items-center gap-1">
              <Minus className="w-3.5 h-3.5" /> Neutral ({neuPct}%)
            </span>
            <span className="text-slate-400">{neu} submissions</span>
          </div>
          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, neuPct))}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-medium mb-1">
            <span className="text-rose-400 flex items-center gap-1">
              <ThumbsDown className="w-3.5 h-3.5" /> Negative ({negPct}%)
            </span>
            <span className="text-slate-400">{neg} submissions</span>
          </div>
          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-rose-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, negPct))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
