import React from "react";
import { Shield, CheckCircle, AlertTriangle, Info } from "lucide-react";

export default function CompliancePreFlight({
  complianceData,
  fraudData,
  riskData,
}) {
  return (
    <div className="glass-panel rounded-xl p-6 space-y-6">
      <div className="flex items-center gap-2 border-b border-outline-variant/10 pb-4">
        <Shield className="w-5 h-5 text-indigo-400" />
        <h3 className="font-bold text-on-surface">
          Automated Compliance & Risk Pre-Flight
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sanction Screening */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block">
            Sanction Screening
          </span>
          <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/10 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-on-surface-variant">OFAC List</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Cleared
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-on-surface-variant">UN List</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Cleared
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-on-surface-variant">EU List</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Cleared
              </span>
            </div>
          </div>
        </div>

        {/* Risk Scoring */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block">
            Risk & Fraud Scoring
          </span>
          <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/10 flex flex-col justify-between h-[116px]">
            <div className="flex justify-between items-center">
              <span className="text-sm text-on-surface-variant">
                Risk Score
              </span>
              <span
                className={`text-sm font-bold ${complianceData?.risk_score > 50 ? "text-amber-400" : "text-emerald-400"}`}
              >
                {complianceData?.risk_score
                  ? `${complianceData.risk_score}/100`
                  : "Pending"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-on-surface-variant">
                Fraud Score
              </span>
              <span
                className={`text-sm font-bold ${fraudData?.score > 50 ? "text-amber-400" : "text-emerald-400"}`}
              >
                {fraudData?.score ? `${fraudData.score}/100` : "Pending"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-on-surface-variant">Status</span>
              <span className="text-xs font-bold text-indigo-400 uppercase">
                {complianceData?.status || "Pre-Flight"}
              </span>
            </div>
          </div>
        </div>

        {/* Exposure Limits */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block">
            Exposure Limits
          </span>
          <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/10 flex flex-col justify-between h-[116px]">
            <div className="flex justify-between items-center">
              <span className="text-sm text-on-surface-variant">
                Limit Validation
              </span>
              <span
                className={`text-xs font-bold ${riskData?.valid === false ? "text-red-400" : "text-emerald-400"} flex items-center gap-1`}
              >
                {riskData?.valid === false ? (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5" /> Breached
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" /> Valid
                  </>
                )}
              </span>
            </div>
            {riskData?.reason && (
              <p className="text-[11px] text-amber-400 leading-tight mt-1 flex items-start gap-1">
                <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
                <span>{riskData.reason}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
