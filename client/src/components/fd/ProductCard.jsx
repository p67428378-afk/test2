import React from "react";
import { Calendar, Percent, ShieldCheck } from "lucide-react";

export default function ProductCard({ product, onSelect, isSelected }) {
  return (
    <div
      onClick={() => onSelect(product)}
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 relative overflow-hidden ${
        isSelected
          ? "border-primary-600 bg-primary-50/50 shadow-md"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
      }`}
    >
      {product.badge && (
        <span className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-bl-lg uppercase tracking-wider">
          {product.badge}
        </span>
      )}
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-gray-900 text-base">{product.name}</h3>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-3">
        <div className="flex items-center space-x-2 text-gray-600">
          <Calendar className="h-4 w-4 text-primary-500" />
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-semibold">
              Tenure
            </p>
            <p className="text-sm font-bold text-gray-800">
              {product.tenure_months} Months
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Percent className="h-4 w-4 text-emerald-500" />
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-semibold">
              Interest Rate
            </p>
            <p className="text-sm font-bold text-emerald-600">
              {product.interest_rate}% p.a.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs text-gray-500">
          Min. Deposit:{" "}
          <strong className="text-gray-700">
            ${product.min_deposit.toLocaleString()}
          </strong>
        </span>
        <div className="flex items-center text-[11px] text-emerald-600 font-medium">
          <ShieldCheck className="h-3.5 w-3.5 mr-1" />
          <span>Insured</span>
        </div>
      </div>
    </div>
  );
}
