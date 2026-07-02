import React from "react";
import { Calculator, TrendingUp, ArrowRightLeft } from "lucide-react";

export default function MaturityCalculator({ product, depositAmount }) {
  if (!product || !depositAmount || isNaN(depositAmount)) return null;

  const principal = parseFloat(depositAmount);
  const rate = parseFloat(product.interest_rate) / 100;
  const tenureYears = parseInt(product.tenure_months) / 12;
  const interestEarned = principal * rate * tenureYears;
  const maturityAmount = principal + interestEarned;

  return (
    <div className="bg-gradient-to-br from-primary-700 to-primary-800 text-white p-5 rounded-2xl shadow-lg mt-4">
      <div className="flex items-center space-x-2 mb-4">
        <Calculator className="h-5 w-5 text-sky-300" />
        <h4 className="font-bold text-sm uppercase tracking-wider text-sky-100">
          Maturity Estimator
        </h4>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-primary-200">Total Interest Earned</p>
          <p className="text-xl font-extrabold text-emerald-300">
            +$
            {interestEarned.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div>
          <p className="text-xs text-primary-200">Maturity Value</p>
          <p className="text-xl font-extrabold text-white">
            $
            {maturityAmount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-primary-600/50 flex items-center justify-between text-xs text-primary-200">
        <div className="flex items-center space-x-1">
          <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
          <span>Yield: {product.interest_rate}% p.a.</span>
        </div>
        <div className="flex items-center space-x-1">
          <ArrowRightLeft className="h-3.5 w-3.5 text-sky-300" />
          <span>Tenure: {product.tenure_months} Months</span>
        </div>
      </div>
    </div>
  );
}
