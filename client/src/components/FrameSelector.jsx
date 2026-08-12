import React from "react";
import { Check, Shield, Layers } from "lucide-react";

export default function FrameSelector({
  frameOptions = [],
  selectedFrameId,
  onSelectFrame,
}) {
  return (
    <div className="space-y-3">
      <label className="text-xs font-bold uppercase tracking-wider text-amber-400/90 block">
        Select Frame Finish
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {frameOptions.map((frame) => {
          const isSelected = selectedFrameId === frame.id;
          const flatFee = parseFloat(frame.flat_fee || 0);
          const multiplier = parseFloat(frame.price_multiplier || 1);

          return (
            <div
              key={frame.id}
              onClick={() => onSelectFrame(frame.id)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                isSelected
                  ? "bg-amber-500/10 border-amber-500 text-slate-100 shadow-md"
                  : "bg-slate-800/60 border-slate-700/60 hover:border-slate-600 text-slate-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected
                      ? "border-amber-400 bg-amber-500 text-slate-950"
                      : "border-slate-600"
                  }`}
                >
                  {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-100">
                    {frame.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {frame.material || "Archival solid hardwood"}
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold text-amber-400 whitespace-nowrap">
                {flatFee > 0
                  ? `+$${flatFee.toFixed(2)}`
                  : multiplier > 1
                    ? `+${Math.round((multiplier - 1) * 100)}%`
                    : "Included"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
