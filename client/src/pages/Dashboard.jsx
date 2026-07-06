import React, { useState, useEffect } from "react";
import HeaderStrip from "../components/HeaderStrip";
import SKUPerformanceTable from "../components/SKUPerformanceTable";
import ScenarioSelector from "../components/ScenarioSelector";
import ApprovalReviewPanel from "../components/ApprovalReviewPanel";
import InlineConfirmation from "../components/InlineConfirmation";
import {
  getKPIs,
  getSKUs,
  calculateScenario,
  submitApproval,
} from "../services/api";

export default function Dashboard() {
  const [kpis, setKPIs] = useState(null);
  const [skus, setSKUs] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState("Balanced");
  const [scenarioData, setScenarioData] = useState(null);
  const [auditTrail, setAuditTrail] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch initial data
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [kpiRes, skuRes] = await Promise.all([getKPIs(), getSKUs()]);
        setKPIs(kpiRes);
        setSKUs(skuRes);
      } catch (err) {
        console.error("Error loading initial dashboard data:", err);
        setError(
          "Failed to load dashboard data. Please ensure the backend is running.",
        );
      }
    }
    loadInitialData();
  }, []);

  // Fetch scenario calculation when selected scenario changes
  useEffect(() => {
    async function loadScenario() {
      try {
        const data = await calculateScenario(selectedScenario);
        setScenarioData(data);
      } catch (err) {
        console.error("Error calculating scenario:", err);
        setError(`Failed to calculate scenario: ${selectedScenario}`);
      }
    }
    loadScenario();
  }, [selectedScenario]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await submitApproval(selectedScenario);
      setAuditTrail(result);

      // Refresh KPIs and SKUs to reflect the newly approved assortment plan
      const [kpiRes, skuRes] = await Promise.all([getKPIs(), getSKUs()]);
      setKPIs(kpiRes);
      setSKUs(skuRes);
    } catch (err) {
      console.error("Error submitting approval:", err);
      setError("Failed to submit assortment plan approval.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col antialiased bg-[#0F172A] text-[#F8FAFC]">
      <HeaderStrip kpis={kpis} />

      {error && (
        <div className="bg-semantic-danger-light border border-red-500 text-semantic-danger px-md py-sm mx-lg mt-sm rounded flex justify-between items-center text-body-sm">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="font-bold hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      <main className="flex-1 overflow-hidden flex p-gutter gap-gutter">
        <SKUPerformanceTable skus={skus} />

        <div className="w-[35%] flex flex-col gap-gutter overflow-hidden">
          <ScenarioSelector
            selectedScenario={selectedScenario}
            onSelectScenario={setSelectedScenario}
            scenarioData={scenarioData}
          />
          <ApprovalReviewPanel
            selectedScenario={selectedScenario}
            scenarioData={scenarioData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </main>

      {auditTrail && (
        <InlineConfirmation
          auditTrail={auditTrail}
          onClose={() => setAuditTrail(null)}
        />
      )}
    </div>
  );
}
