import React from "react";
import { Percent, Calendar, DollarSign, ArrowRight } from "lucide-react";

export default function ProductCard({
  product,
  onApply,
  onSelectForCalculator,
}) {
  const {
    name,
    interest_rate,
    min_tenure_months,
    max_tenure_months,
    max_loan_amount,
  } = product;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full">
      <div className="p-6 flex-1">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-slate-900">{name}</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Percent className="w-3 h-3 mr-1" />
            {interest_rate}% p.a.
          </span>
        </div>

        <div className="space-y-3 text-sm text-slate-600 mb-6">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-slate-400" />
            <span>
              Tenure: {min_tenure_months} - {max_tenure_months} months
            </span>
          </div>
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-2 text-slate-400" />
            <span>
              Max Amount: ${parseFloat(max_loan_amount).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-2">
        <button
          onClick={() => onSelectForCalculator(product)}
          className="flex-1 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Calculate EMI
        </button>
        <button
          onClick={() => onApply(product)}
          className="flex-1 px-3 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1"
        >
          Apply Now
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
