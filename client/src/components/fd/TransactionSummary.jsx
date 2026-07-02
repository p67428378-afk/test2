import React from "react";
import { ShieldCheck, Info } from "lucide-react";

export default function TransactionSummary({
  product,
  depositAmount,
  sourceAccount,
}) {
  if (!product || !sourceAccount) return null;

  const principal = parseFloat(depositAmount);
  const rate = parseFloat(product.interest_rate) / 100;
  const tenureYears = parseInt(product.tenure_months) / 12;
  const interestEarned = principal * rate * tenureYears;
  const maturityAmount = principal + interestEarned;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
      <h3 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3">
        Investment Summary
      </h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Selected Product</span>
          <span className="font-semibold text-gray-800">{product.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Source Account</span>
          <span className="font-semibold text-gray-800">
            {sourceAccount.account_number}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Principal Amount</span>
          <span className="font-bold text-gray-900">
            $
            {principal.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Interest Rate</span>
          <span className="font-semibold text-emerald-600">
            {product.interest_rate}% p.a.
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Tenure</span>
          <span className="font-semibold text-gray-800">
            {product.tenure_months} Months
          </span>
        </div>
        <div className="flex justify-between border-t border-dashed border-gray-100 pt-3">
          <span className="text-gray-500 font-medium">Estimated Interest</span>
          <span className="font-bold text-emerald-600">
            +$
            {interestEarned.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
        <div className="flex justify-between border-t border-gray-100 pt-3">
          <span className="text-gray-900 font-bold">Maturity Amount</span>
          <span className="font-extrabold text-primary-600 text-lg">
            $
            {maturityAmount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-start space-x-2 text-xs text-amber-800">
        <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
        <p>
          Funds will be instantly debited from your savings account. Early
          withdrawal may incur penalties.
        </p>
      </div>

      <div className="flex items-center justify-center space-x-1.5 text-xs text-gray-400 pt-1">
        <ShieldCheck className="h-4 w-4 text-emerald-500" />
        <span>Secure 256-bit SSL Encrypted Transaction</span>
      </div>
    </div>
  );
}
