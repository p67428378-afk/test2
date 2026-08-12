import React from "react";
import { Calculator, CheckCircle, AlertTriangle } from "lucide-react";

export default function DynamicPriceCalculator({
  basePrice = 0,
  customWidth = 24,
  customHeight = 36,
  areaSqInches = null,
  frameFee = 0,
  calculatedUnitPrice = 0,
  isValid = true,
  validationError = null,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-amber-400" />
          <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
            Live Price Calculation
          </h4>
        </div>
        {isValid ? (
          <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
            <CheckCircle className="h-3.5 w-3.5" />
            Valid Configuration
          </span>
        ) : (
          <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5" />
            Bounds Exceeded
          </span>
        )}
      </div>

      {!isValid && validationError && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-medium">
          {validationError}
        </div>
      )}

      <div className="space-y-2 text-xs text-slate-300">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Base Artwork Cost</span>
          <span className="font-semibold text-slate-200">
            ${parseFloat(basePrice || 0).toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-400">
            Dimensions ({customWidth}" &times; {customHeight}")
          </span>
          <span className="font-semibold text-slate-200">
            {areaSqInches
              ? `${parseFloat(areaSqInches).toFixed(0)} sq in`
              : `${customWidth * customHeight} sq in`}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-400">Frame Finish Fee</span>
          <span className="font-semibold text-slate-200">
            +${parseFloat(frameFee || 0).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800 flex justify-between items-end">
        <div>
          <span className="text-xs text-slate-400 font-medium block">
            Calculated Unit Price
          </span>
          <span className="text-xs text-amber-400/80">
            Includes canvas stretching
          </span>
        </div>
        <span className="text-2xl font-extrabold text-amber-400">
          ${parseFloat(calculatedUnitPrice || 0).toFixed(2)}
        </span>
      </div>
    </div>
  );
}
