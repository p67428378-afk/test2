import React, { useState, useEffect } from "react";
import Header from "./components/Header.jsx";
import KPIHeaderStrip from "./components/KPIHeaderStrip.jsx";
import SKUPerformanceTable from "./components/SKUPerformanceTable.jsx";
import ScenarioSelector from "./components/ScenarioSelector.jsx";
import ApprovalReviewPanel from "./components/ApprovalReviewPanel.jsx";
import InlineConfirmation from "./components/InlineConfirmation.jsx";
import {
  getKPIs,
  getSKUs,
  getScenario,
  submitAssortmentPlan,
} from "./services/api.js";

export default function App() {
  // State
  const [kpis, setKpis] = useState(null);
  const [kpisLoading, setKpisLoading] = useState(true);
  const [kpisError, setKpisError] = useState(null);

  const [skus, setSkus] = useState([]);
  const [skusLoading, setSkusLoading] = useState(true);
  const [skusError, setSkusError] = useState(null);
  const [sortBy, setSortBy] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [selectedScenario, setSelectedScenario] = useState("Balanced");
  const [scenarioData, setScenarioData] = useState(null);
  const [scenarioLoading, setScenarioLoading] = useState(true);
  const [scenarioError, setScenarioError] = useState(null);

  const [submittedPlan, setSubmittedPlan] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch KPIs
  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        setKpisLoading(true);
        const data = await getKPIs();
        setKpis(data);
        setKpisError(null);
      } catch (err) {
        console.error("Error fetching KPIs:", err);
        setKpisError(
          err.response?.data?.detail || err.message || "Failed to load KPIs",
        );
      } finally {
        setKpisLoading(false);
      }
    };
    fetchKPIs();
  }, []);

  // Fetch SKUs
  useEffect(() => {
    const fetchSKUs = async () => {
      try {
        setSkusLoading(true);
        const data = await getSKUs(sortBy, filterStatus);
        setSkus(data);
        setSkusError(null);
      } catch (err) {
        console.error("Error fetching SKUs:", err);
        setSkusError(
          err.response?.data?.detail || err.message || "Failed to load SKUs",
        );
      } finally {
        setSkusLoading(false);
      }
    };
    fetchSKUs();
  }, [sortBy, filterStatus]);

  // Fetch Scenario Details
  useEffect(() => {
    const fetchScenario = async () => {
      try {
        setScenarioLoading(true);
        const data = await getScenario(selectedScenario);
        setScenarioData(data);
        setScenarioError(null);
      } catch (err) {
        console.error("Error fetching scenario:", err);
        setScenarioError(
          err.response?.data?.detail ||
            err.message ||
            "Failed to load scenario",
        );
      } finally {
        setScenarioLoading(false);
      }
    };
    fetchScenario();
  }, [selectedScenario]);

  // Submit Plan Handler
  const handleSubmitPlan = async () => {
    try {
      setSubmitting(true);
      const result = await submitAssortmentPlan(
        selectedScenario,
        "manager@dollargeneral.com",
      );
      setSubmittedPlan(result);
      // Scroll to top to show confirmation banner
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Error submitting plan:", err);
      alert(
        err.response?.data?.detail ||
          err.message ||
          "Failed to submit assortment plan",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dg-bg text-on-surface min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <Header onSubmitPlan={handleSubmitPlan} />

      {/* Sidebar Navigation (Desktop only) */}
      <aside className="fixed left-0 top-0 h-full w-64 hidden lg:flex flex-col z-40 bg-surface-container-low pt-16 border-r border-surface-container-high">
        <div className="p-6 border-b border-surface-container-high">
          <h2 className="text-headline-md font-headline-md font-black text-primary">
            Dollar General
          </h2>
          <p className="text-label-sm font-label-sm text-on-surface-variant mt-1">
            Category Management
          </p>
          <button className="mt-4 w-full bg-transparent border border-primary text-primary text-label-sm font-label-sm py-2 rounded-md hover:bg-primary-container hover:text-on-primary-container transition-all">
            New Scenario
          </button>
        </div>
        <nav className="flex-1 py-4 flex flex-col gap-1 px-3">
          <a
            className="flex items-center gap-3 px-4 py-3 rounded-md text-primary font-bold border-l-4 border-primary bg-surface-container-highest opacity-80 scale-95 transition-all text-label-sm"
            href="#"
          >
            <span className="material-symbols-outlined">dashboard</span>Home
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 rounded-md text-on-surface-variant hover:bg-surface-variant transition-all text-label-sm"
            href="#"
          >
            <span className="material-symbols-outlined">inventory_2</span>
            Product Performance
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 rounded-md text-on-surface-variant hover:bg-surface-variant transition-all text-label-sm"
            href="#"
          >
            <span className="material-symbols-outlined">hub</span>Cluster
            Analysis
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 rounded-md text-on-surface-variant hover:bg-surface-variant transition-all text-label-sm"
            href="#"
          >
            <span className="material-symbols-outlined">analytics</span>
            Inventory
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 rounded-md text-on-surface-variant hover:bg-surface-variant transition-all text-label-sm"
            href="#"
          >
            <span className="material-symbols-outlined">difference</span>
            Assortment Scenarios
          </a>
        </nav>
        <div className="p-4 border-t border-surface-container-high flex flex-col gap-1">
          <a
            className="flex items-center gap-3 px-4 py-2 rounded-md text-on-surface-variant hover:bg-surface-variant transition-all text-label-sm"
            href="#"
          >
            <span className="material-symbols-outlined">help</span>Support
          </a>
          <a
            className="flex items-center gap-3 px-4 py-2 rounded-md text-on-surface-variant hover:bg-surface-variant transition-all text-label-sm"
            href="#"
          >
            <span className="material-symbols-outlined">logout</span>Sign Out
          </a>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 lg:ml-64 pt-20 p-margin-mobile md:p-margin-desktop flex flex-col gap-lg">
        {/* Success Banner / Inline Confirmation */}
        {submittedPlan && (
          <InlineConfirmation
            plan={submittedPlan}
            onClose={() => setSubmittedPlan(null)}
          />
        )}

        {/* KPI Header Strip */}
        <KPIHeaderStrip kpis={kpis} loading={kpisLoading} error={kpisError} />

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-lg items-start">
          {/* Left Column: SKU Performance Table */}
          <SKUPerformanceTable
            skus={skus}
            loading={skusLoading}
            error={skusError}
            onSort={setSortBy}
            onFilter={setFilterStatus}
          />

          {/* Right Column: Scenario Selector & Approval Review Panel */}
          <div className="xl:col-span-4 flex flex-col gap-lg">
            <ScenarioSelector
              selectedScenario={selectedScenario}
              onSelectScenario={setSelectedScenario}
            />

            <ApprovalReviewPanel
              scenarioData={scenarioData}
              loading={scenarioLoading}
              error={scenarioError}
              onSubmit={handleSubmitPlan}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
