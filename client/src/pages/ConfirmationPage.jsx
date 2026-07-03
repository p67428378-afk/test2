import React from "react";
import { useNavigate } from "react-router-dom";

export default function ConfirmationPage({
  submissionResult,
  selectedScenario,
}) {
  const navigate = useNavigate();

  // Fallback mock data if no submission result exists yet
  const result = submissionResult || {
    selected_scenario: selectedScenario?.name || "Balanced",
    status: "Submitted",
    submission_id: "sub-mock12345",
    submitted_by: "manager-1",
    timestamp: new Date().toISOString(),
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[500px] max-w-2xl mx-auto w-full gap-6">
      {/* Success Icon & Message */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] mb-2 animate-bounce">
          <span className="material-symbols-outlined text-4xl">
            check_circle
          </span>
        </div>
        <h1 className="text-3xl font-bold text-on-surface tracking-tight">
          Assortment Plan Submitted!
        </h1>
        <p className="text-sm text-on-surface-variant max-w-md mx-auto">
          Your Snacks assortment plan for the Small Town Value Cluster has been
          successfully submitted for regional approval.
        </p>
      </div>

      {/* Audit Trail Summary Card */}
      <div className="glass-panel rounded-lg border border-[#334155] w-full overflow-hidden">
        <div className="p-4 md:p-6 border-b border-[#334155] bg-surface-container-low flex items-center gap-2">
          <span className="material-symbols-outlined text-primary-fixed-dim">
            history
          </span>
          <h3 className="text-lg font-bold text-on-surface">
            Audit Trail Summary
          </h3>
        </div>
        <div className="p-6 space-y-4 font-mono text-sm">
          <div className="flex justify-between items-center border-b border-[#334155]/50 pb-3">
            <span className="text-xs text-on-surface-variant font-sans font-semibold uppercase tracking-wider">
              Submission ID
            </span>
            <span className="text-on-surface font-bold">
              {result.submission_id}
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-[#334155]/50 pb-3">
            <span className="text-xs text-on-surface-variant font-sans font-semibold uppercase tracking-wider">
              Selected Scenario
            </span>
            <span className="text-primary-fixed-dim font-bold">
              {result.selected_scenario}
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-[#334155]/50 pb-3">
            <span className="text-xs text-on-surface-variant font-sans font-semibold uppercase tracking-wider">
              Submitted By
            </span>
            <span className="text-on-surface font-bold">
              {result.submitted_by}
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-[#334155]/50 pb-3">
            <span className="text-xs text-on-surface-variant font-sans font-semibold uppercase tracking-wider">
              Timestamp
            </span>
            <span className="text-on-surface font-bold">
              {new Date(result.timestamp).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-xs text-on-surface-variant font-sans font-semibold uppercase tracking-wider">
              Status
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20">
              <span className="material-symbols-outlined text-[14px]">
                hourglass_empty
              </span>
              {result.status}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <button
          onClick={() => navigate("/")}
          className="flex-1 py-3 px-4 bg-primary-container text-[#000000] text-sm font-bold rounded flex items-center justify-center gap-2 hover:bg-primary transition-colors active:scale-95 shadow-[0_0_15px_rgba(255,209,0,0.15)]"
        >
          <span className="material-symbols-outlined text-[18px]">
            dashboard
          </span>
          <span>Back to Dashboard</span>
        </button>
        <button
          onClick={() => window.print()}
          className="flex-1 py-3 px-4 border border-outline-variant text-on-surface text-sm font-bold rounded flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">print</span>
          <span>Print Audit Summary</span>
        </button>
      </div>
    </div>
  );
}
