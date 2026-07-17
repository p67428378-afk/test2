import React, { useState, useEffect } from "react";
import TopNavBar from "./components/TopNavBar";
import KPIHeaderStrip from "./components/KPIHeaderStrip";
import SKUPerformanceTable from "./components/SKUPerformanceTable";
import ScenarioSelector from "./components/ScenarioSelector";
import ApprovalReviewPanel from "./components/ApprovalReviewPanel";
import InlineConfirmationBanner from "./components/InlineConfirmationBanner";
import { getKPIs, getScenarios, submitPlan } from "./services/api";

export default function App() {
  const [kpis, setKPIs] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState("balanced");
  const [currentActions, setCurrentActions] = useState({});
  const [auditTrail, setAuditTrail] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const kpiData = await getKPIs();
        setKPIs(kpiData);

        const scenarioData = await getScenarios();
        setScenarios(scenarioData);
      } catch (err) {
        console.error("Error loading initial dashboard data:", err);
        setError(
          "Failed to load dashboard data. Please ensure the backend is running.",
        );
      }
    };

    loadInitialData();
  }, []);

  const handleScenarioSelect = (scenarioId) => {
    setSelectedScenarioId(scenarioId);
    // Clear overrides when switching scenarios to align with scenario defaults
    setCurrentActions({});
  };

  const handleActionChange = (sku, action) => {
    setCurrentActions((prev) => ({
      ...prev,
      [sku]: action,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      // Prepare payload
      const skuActions = Object.entries(currentActions).map(
        ([sku, action]) => ({
          sku,
          action,
        }),
      );

      const payload = {
        selected_scenario: selectedScenarioId,
        sku_actions: skuActions,
      };

      const result = await submitPlan(payload);
      if (result.success) {
        setAuditTrail(result);
      } else {
        setError("Submission failed. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting assortment plan:", err);
      setError(
        err.response?.data?.detail ||
          "Failed to submit assortment plan. Please check guardrails.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedScenario = scenarios.find((s) => s.id === selectedScenarioId);

  return (
    <div className="text-on-surface font-body-md min-h-screen flex flex-col bg-slate-950">
      <TopNavBar onApproveClick={handleSubmit} />

      <main className="flex-1 mt-20 p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full flex flex-col gap-stack-lg">
        {/* Error Banner */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3 w-full">
            <span className="material-symbols-outlined text-red-500 mt-0.5">
              error
            </span>
            <div className="flex-1">
              <p className="font-body-md text-body-md text-red-200">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-200"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        )}

        {/* Success Confirmation Banner */}
        {auditTrail && (
          <InlineConfirmationBanner
            auditTrail={auditTrail}
            onClose={() => setAuditTrail(null)}
          />
        )}

        {/* KPI Header Strip */}
        <KPIHeaderStrip kpis={kpis} />

        {/* Snacks SKU Performance Table */}
        <SKUPerformanceTable
          onActionChange={handleActionChange}
          currentActions={currentActions}
        />

        {/* Bottom Bento Grid: Scenario Selector & Review Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter w-full">
          <ScenarioSelector
            scenarios={scenarios}
            selectedScenarioId={selectedScenarioId}
            onScenarioSelect={handleScenarioSelect}
          />
          <ApprovalReviewPanel
            selectedScenario={selectedScenario}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </main>

      <div className="h-8"></div>
    </div>
  );
}
