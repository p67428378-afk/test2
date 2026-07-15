import React from "react";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

export default function DTIAnalysis({ emi, monthlyIncome }) {
  if (!emi || !monthlyIncome) return null;

  const dtiRatio = (emi / monthlyIncome) * 100;
  const isAutoRejected = dtiRatio > 50;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
        Debt-to-Income (DTI) Analysis
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
          <p className="text-xs text-slate-500 uppercase">Calculated EMI</p>
          <p className="text-lg font-bold text-slate-800 mt-1">
            $
            {parseFloat(emi).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
          <p className="text-xs text-slate-500 uppercase">Monthly Income</p>
          <p className="text-lg font-bold text-slate-800 mt-1">
            $
            {parseFloat(monthlyIncome).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
          <p className="text-xs text-slate-500 uppercase">DTI Ratio</p>
          <p
            className={`text-lg font-bold mt-1 ${isAutoRejected ? "text-red-600" : "text-emerald-600"}`}
          >
            {dtiRatio.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-2.5 rounded-full ${isAutoRejected ? "bg-red-500" : "bg-emerald-500"}`}
          style={{ width: `${Math.min(dtiRatio, 100)}%` }}
        ></div>
      </div>

      {/* Status Alert */}
      {isAutoRejected ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm flex items-start gap-2">
          <XCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
          <div>
            <p className="font-bold">Auto-Rejection Warning</p>
            <p className="mt-1">
              Your Debt-to-Income ratio is{" "}
              <strong>{dtiRatio.toFixed(1)}%</strong>, which exceeds the maximum
              allowed limit of <strong>50%</strong>. Submitting this application
              will result in an automatic rejection.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm flex items-start gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500 mt-0.5" />
          <div>
            <p className="font-bold">DTI Ratio is Healthy</p>
            <p className="mt-1">
              Your Debt-to-Income ratio is{" "}
              <strong>{dtiRatio.toFixed(1)}%</strong>, which is within the safe
              limit of <strong>50%</strong>. This application is eligible for
              submission.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
