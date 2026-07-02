import React from "react";
import {
  CheckCircle2,
  Calendar,
  Percent,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export default function FDSuccessPage({ result, onDone }) {
  if (!result) return null;

  const formattedMaturityDate = new Date(
    result.maturity_date,
  ).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8 text-center py-4">
      <div className="flex flex-col items-center space-y-3">
        <div className="p-3 bg-emerald-50 rounded-full text-emerald-500 animate-bounce">
          <CheckCircle2 className="h-16 w-16" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Fixed Deposit Opened!
        </h2>
        <p className="text-sm text-gray-500 max-w-xs">
          Your Fixed Deposit account has been successfully created and funded.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 text-left">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <span className="text-xs text-gray-400 font-semibold uppercase">
            FD Account Number
          </span>
          <span className="font-mono font-bold text-gray-800 text-sm">
            {result.fd_account_number}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="space-y-1">
            <p className="text-[10px] text-gray-400 font-semibold uppercase">
              Principal Amount
            </p>
            <p className="text-base font-extrabold text-gray-900">
              $
              {result.principal_amount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-gray-400 font-semibold uppercase">
              Interest Rate
            </p>
            <p className="text-base font-extrabold text-emerald-600 flex items-center">
              <Percent className="h-4 w-4 mr-0.5" />
              <span>{result.interest_rate}% p.a.</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
          <div className="space-y-1">
            <p className="text-[10px] text-gray-400 font-semibold uppercase">
              Maturity Amount
            </p>
            <p className="text-base font-extrabold text-primary-600">
              $
              {result.maturity_amount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-gray-400 font-semibold uppercase">
              Maturity Date
            </p>
            <p className="text-xs font-bold text-gray-800 flex items-center mt-1">
              <Calendar className="h-3.5 w-3.5 mr-1 text-primary-500" />
              <span>{formattedMaturityDate}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 flex items-start space-x-2.5 text-left text-xs text-emerald-800">
        <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
        <p>
          Your investment is fully secured and backed by Apex Mobile Bank's
          capital guarantee.
        </p>
      </div>

      <div className="pt-4">
        <button
          onClick={onDone}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <span>Go to Dashboard</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
