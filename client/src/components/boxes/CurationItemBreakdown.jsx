import React, { useState } from "react";
import { Sparkles, Gift, CheckCircle2, Calendar, Tag } from "lucide-react";

export default function CurationItemBreakdown({ curations = [] }) {
  const [selectedCurationIndex, setSelectedCurationIndex] = useState(0);

  if (!curations || curations.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm text-center">
        <p className="text-slate-500 text-sm">
          No monthly curations detailed for this box yet.
        </p>
      </div>
    );
  }

  const activeCuration = curations[selectedCurationIndex] || curations[0];
  const items = activeCuration.item_list || [];

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6">
      {/* Header & Month Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Monthly Curation Breakdown</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            {activeCuration.theme_title || "Featured Curation"}
          </h2>
        </div>

        {curations.length > 1 && (
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
            <Calendar className="w-4 h-4 text-slate-400 ml-2" />
            <select
              value={selectedCurationIndex}
              onChange={(e) => setSelectedCurationIndex(Number(e.target.value))}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none pr-2 cursor-pointer"
            >
              {curations.map((cur, idx) => (
                <option key={cur.id || idx} value={idx}>
                  {cur.month_year || `Curation #${idx + 1}`}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Curation Highlights */}
      {activeCuration.highlights && (
        <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-4">
          <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Gift className="w-4 h-4 text-amber-600" />
            Curation Highlights
          </h4>
          <p className="text-slate-700 text-sm leading-relaxed">
            {activeCuration.highlights}
          </p>
        </div>
      )}

      {/* Item List */}
      <div>
        <h3 className="font-serif font-bold text-lg text-slate-900 mb-4 flex items-center justify-between">
          <span>Items Included in This Box</span>
          <span className="text-xs font-sans font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            {items.length} Items Total
          </span>
        </h3>

        {items.length === 0 ? (
          <p className="text-slate-500 text-sm italic">
            Items list coming soon.
          </p>
        ) : (
          <div className="space-y-3">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {item.name || item.title || `Item #${idx + 1}`}
                    </h4>
                    {item.description && (
                      <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
                {item.value && (
                  <span className="text-xs font-bold text-secondary bg-slate-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                    Est. Value: {item.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
