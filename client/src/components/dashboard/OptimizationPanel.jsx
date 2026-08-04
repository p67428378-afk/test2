import React from "react";
import ScenarioSelector from "../scenario/ScenarioSelector";
import ApprovalReviewPanel from "../approval/ApprovalReviewPanel";

export default function OptimizationPanel({
  scenariosData = [],
  selectedScenario,
  onSelectScenario,
  isSubmitting,
  onSubmit,
}) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-2">
        <h2 className="text-xl font-bold text-slate-100">
          Assortment Optimization & Scenario Analysis
        </h2>
        <p className="text-xs text-slate-400">
          Compare algorithmic optimization models (Conservative, Balanced,
          Aggressive) and evaluate projected shelf impact.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <ScenarioSelector
            scenariosData={scenariosData}
            selectedScenarioId={selectedScenario?.id}
            onSelectScenario={onSelectScenario}
          />
        </div>

        <div className="xl:col-span-1">
          <ApprovalReviewPanel
            selectedScenario={selectedScenario}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </div>
  );
}
