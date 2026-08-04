import React, { useState, useEffect } from "react";
import TopNavBar from "./common/TopNavBar";
import KPIHeaderStrip from "./kpi/KPIHeaderStrip";
import SKUPerformanceTable from "./sku/SKUPerformanceTable";
import ScenarioSelector from "./scenario/ScenarioSelector";
import ApprovalReviewPanel from "./approval/ApprovalReviewPanel";
import InlineAuditModal from "./audit/InlineAuditModal";
import {
  fetchKPIs,
  fetchSKUs,
  fetchScenarios,
  submitRecommendation,
} from "../services/api";

export default function Dashboard() {
  const [kpiData, setKpiData] = useState(null);
  const [skusData, setSkusData] = useState([]);
  const [scenariosData, setScenariosData] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState({
    id: "balanced",
    label: "Balanced",
    projected_sales_delta_pct: 5.2,
    projected_pb_share_pct: 28.5,
    shelf_capacity_impact_pct: 92.0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      setIsLoading(true);
      try {
        const [kpiRes, skusRes, scenarioRes] = await Promise.allSettled([
          fetchKPIs("small-town-value"),
          fetchSKUs("small-town-value", "Snacks"),
          fetchScenarios(),
        ]);

        if (isMounted) {
          if (kpiRes.status === "fulfilled") setKpiData(kpiRes.value);
          if (skusRes.status === "fulfilled" && skusRes.value?.skus)
            setSkusData(skusRes.value.skus);
          if (
            scenarioRes.status === "fulfilled" &&
            scenarioRes.value?.scenarios
          ) {
            setScenariosData(scenarioRes.value.scenarios);
            const defaultId = scenarioRes.value.default_selected || "balanced";
            const matchedScenario = scenarioRes.value.scenarios.find(
              (s) => s.id === defaultId,
            );
            if (matchedScenario) setSelectedScenario(matchedScenario);
          }
        }
      } catch (err) {
        // Handled via fallbacks inside subcomponents
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectScenario = (scenario) => {
    setSelectedScenario(scenario);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const payload = {
        cluster_id: "small-town-value",
        scenario_id: selectedScenario?.id || "balanced",
        manager_id: "Aarchi Jain",
        notes: `Submitted ${selectedScenario?.label || "Balanced"} scenario recommendation for Snacks category.`,
      };

      const result = await submitRecommendation(payload);
      // ONLY on real 2xx response set submission result (no fake success on error)
      setSubmissionResult(result);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.detail ||
          err.message ||
          "Failed to submit assortment recommendation. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="antialiased min-h-screen flex flex-col font-body-base text-body-base bg-dg-navy">
      {/* Top Navigation */}
      <TopNavBar
        clusterName="Small Town Value Cluster (1,240 Stores)"
        categoryName="Snacks"
      />

      {/* Main Content Area */}
      <div className="flex flex-1 w-full max-w-container-max-width mx-auto">
        {/* Side Navigation */}
        <aside className="w-64 bg-surface-container border-r border-outline-variant shadow-sm flex flex-col h-[calc(100vh-65px)] sticky top-[65px] hidden md:flex shrink-0">
          <div className="p-margin border-b border-outline-variant flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-container rounded flex items-center justify-center text-dg-navy font-bold text-xl">
              DG
            </div>
            <div>
              <h2 className="text-headline-md font-headline-md text-primary-container text-lg leading-tight">
                Dollar General
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Enterprise Retail
              </p>
            </div>
          </div>
          <nav className="flex-1 py-margin flex flex-col gap-1 overflow-y-auto">
            <a
              href="#cluster"
              className="text-on-surface-variant hover:bg-surface-variant transition-all flex items-center gap-3 px-margin py-2 font-body-base"
            >
              <span className="material-symbols-outlined">lan</span>
              Cluster Select
            </a>
            <a
              href="#category"
              className="bg-secondary-container text-primary-container border-l-4 border-primary-container transition-all flex items-center gap-3 px-[20px] py-2 font-body-base font-medium"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                category
              </span>
              Category
            </a>
            <a
              href="#sku"
              className="text-on-surface-variant hover:bg-surface-variant transition-all flex items-center gap-3 px-margin py-2 font-body-base"
            >
              <span className="material-symbols-outlined">list_alt</span>
              SKU View
            </a>
            <a
              href="#optimization"
              className="text-on-surface-variant hover:bg-surface-variant transition-all flex items-center gap-3 px-margin py-2 font-body-base"
            >
              <span className="material-symbols-outlined">insights</span>
              Optimization
            </a>
            <a
              href="#audit"
              className="text-on-surface-variant hover:bg-surface-variant transition-all flex items-center gap-3 px-margin py-2 font-body-base"
            >
              <span className="material-symbols-outlined">verified_user</span>
              Audit
            </a>
          </nav>
          <div className="p-margin border-t border-outline-variant flex flex-col gap-2">
            <a
              href="#help"
              className="text-on-surface-variant hover:text-on-surface flex items-center gap-2 text-xs"
            >
              <span className="material-symbols-outlined text-[18px]">
                help
              </span>{" "}
              Help
            </a>
            <a
              href="#support"
              className="text-on-surface-variant hover:text-on-surface flex items-center gap-2 text-xs"
            >
              <span className="material-symbols-outlined text-[18px]">
                contact_support
              </span>{" "}
              Support
            </a>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="mt-4 w-full bg-primary-container text-on-primary-container font-data-mono text-data-mono py-2 rounded font-bold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
            >
              Submit Plan
            </button>
          </div>
        </aside>

        {/* Main Dashboard Canvas */}
        <main className="flex-1 p-margin overflow-y-auto flex flex-col gap-margin relative">
          {/* Submission Audit Confirmation */}
          {submissionResult && (
            <InlineAuditModal
              auditData={submissionResult}
              onClose={() => setSubmissionResult(null)}
            />
          )}

          {/* Submission Error Banner */}
          {errorMessage && (
            <div className="bg-red-900/40 border border-red-500/50 rounded-lg p-3 flex items-center justify-between text-red-200 font-data-mono text-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-400">
                  error
                </span>
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-red-400 hover:text-red-200"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          )}

          {/* Header */}
          <div>
            <h1 className="font-display-lg text-display-lg text-on-surface">
              Snacks Category Assortment
            </h1>
            <p className="font-body-base text-body-base text-on-surface-variant mt-1">
              Consolidated view for Small Town Value Cluster.
            </p>
          </div>

          {/* KPI Strip */}
          <KPIHeaderStrip kpiData={kpiData} />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-margin">
            {/* Left Column: Scenarios & SKU Table */}
            <div className="xl:col-span-2 flex flex-col gap-margin">
              {/* Scenario Selector Bento Box */}
              <ScenarioSelector
                scenariosData={scenariosData}
                selectedScenarioId={selectedScenario?.id}
                onSelectScenario={handleSelectScenario}
              />

              {/* SKU Performance Table */}
              <SKUPerformanceTable skusData={skusData} />
            </div>

            {/* Right Column: Approval Panel */}
            <div className="xl:col-span-1">
              <ApprovalReviewPanel
                selectedScenario={selectedScenario}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
              />
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-auto w-full py-4 border-t border-outline-variant bg-surface-container-lowest">
            <div className="flex flex-col md:flex-row justify-between items-center px-margin max-w-container-max-width mx-auto gap-4">
              <div className="text-on-surface-variant font-label-caps text-label-caps">
                © 2026 Dollar General Enterprise Solutions. All rights reserved.
              </div>
              <div className="flex items-center gap-6">
                <a
                  href="#privacy"
                  className="text-on-surface-variant hover:text-primary font-label-caps text-label-caps transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="#terms"
                  className="text-on-surface-variant hover:text-primary font-label-caps text-label-caps transition-colors"
                >
                  Terms of Service
                </a>
                <a
                  href="#audit-logs"
                  className="text-on-surface-variant hover:text-primary font-label-caps text-label-caps transition-colors"
                >
                  Audit Logs
                </a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
