import React, { useState, useEffect } from "react";
import Header from "./components/layout/Header.jsx";
import KPIHeaderStrip from "./components/assortment/KPIHeaderStrip.jsx";
import SKUPerformanceTable from "./components/assortment/SKUPerformanceTable.jsx";
import ScenarioSelector from "./components/assortment/ScenarioSelector.jsx";
import ApprovalReviewPanel from "./components/assortment/ApprovalReviewPanel.jsx";
import InlineConfirmationOverlay from "./components/assortment/InlineConfirmationOverlay.jsx";
import {
  getKPIMetrics,
  getSKUPerformance,
  submitAssortmentPlan,
} from "./services/api.js";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function App() {
  const [kpis, setKpis] = useState(null);
  const [skus, setSkus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedScenario, setSelectedScenario] = useState("Balanced");
  const [skuActions, setSkuActions] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [kpiData, skuData] = await Promise.all([
        getKPIMetrics(),
        getSKUPerformance(),
      ]);
      setKpis(kpiData);
      setSkus(skuData);

      // Initialize actions with the pre-selected scenario actions
      const initialActions = {};
      skuData.forEach((sku) => {
        initialActions[sku.sku_id] =
          sku.scenarios?.Balanced?.action || "MAINTAIN";
      });
      setSkuActions(initialActions);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to load dashboard data.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // When scenario changes, update all SKU actions to match that scenario's default actions
  const handleSelectScenario = (scenario) => {
    setSelectedScenario(scenario);
    const updatedActions = {};
    skus.forEach((sku) => {
      updatedActions[sku.sku_id] =
        sku.scenarios?.[scenario]?.action || "MAINTAIN";
    });
    setSkuActions(updatedActions);
  };

  const handleActionChange = (skuId, newAction) => {
    setSkuActions((prev) => ({
      ...prev,
      [skuId]: newAction,
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const payloadActions = Object.entries(skuActions).map(
        ([skuId, action]) => ({
          sku_id: skuId,
          action,
        }),
      );
      const result = await submitAssortmentPlan(
        selectedScenario,
        payloadActions,
      );
      setConfirmation(result);
      // Refresh KPIs and SKU list after successful submission
      await fetchData();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to submit assortment plan.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9ff]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 flex flex-col gap-8">
        {/* Error Banner */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 flex flex-col gap-1">
              <span className="text-sm font-bold">Error Occurred</span>
              <p className="text-xs text-rose-700">{error}</p>
            </div>
            <button
              onClick={fetchData}
              className="p-1.5 hover:bg-rose-100 rounded-lg text-rose-800 transition-colors flex items-center gap-1 text-xs font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        )}

        {/* KPI Header Strip */}
        <KPIHeaderStrip metrics={kpis} loading={loading} />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left 2 Columns: Scenario Selector & SKU Table */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <ScenarioSelector
              selectedScenario={selectedScenario}
              onSelectScenario={handleSelectScenario}
              metrics={kpis}
            />

            <SKUPerformanceTable
              skus={skus.map((sku) => ({
                ...sku,
                currentAction: skuActions[sku.sku_id],
              }))}
              loading={loading}
              currentScenario={selectedScenario}
              onActionChange={handleActionChange}
            />
          </div>

          {/* Right Column: Approval Review Panel */}
          <div className="lg:col-span-1 h-full">
            <ApprovalReviewPanel
              selectedScenario={selectedScenario}
              skuActions={skuActions}
              skus={skus}
              onSubmit={handleSubmit}
              submitting={submitting}
            />
          </div>
        </div>
      </main>

      {/* Inline Confirmation Overlay */}
      <InlineConfirmationOverlay
        confirmation={confirmation}
        onClose={() => setConfirmation(null)}
      />

      <footer className="w-full py-6 mt-auto bg-white border-t border-outline-variant/30">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 max-w-7xl mx-auto">
          <span className="text-xs text-on-surface-variant/80 mb-4 md:mb-0">
            © 2026 Dollar General Corporation. All rights reserved. Small Town
            Value Cluster Assortment Advisor.
          </span>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-xs text-on-surface-variant/80 hover:text-primary transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-xs text-on-surface-variant/80 hover:text-primary transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-xs text-on-surface-variant/80 hover:text-primary transition-colors"
            >
              Support Portal
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
