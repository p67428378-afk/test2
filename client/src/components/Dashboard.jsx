import React, { useState, useEffect } from "react";
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

export default function Dashboard({
  kpiData: propKpiData,
  skusData: propSkusData,
  scenariosData: propScenariosData,
  selectedScenario: propSelectedScenario,
  onSelectScenario: propOnSelectScenario,
  isSubmitting: propIsSubmitting,
  onSubmit: propOnSubmit,
  submissionResult: propSubmissionResult,
  errorMessage: propErrorMessage,
  onClearError: propOnClearError,
  onClearResult: propOnClearResult,
}) {
  const [internalKpiData, setKpiData] = useState(null);
  const [internalSkusData, setSkusData] = useState([]);
  const [internalScenariosData, setScenariosData] = useState([]);
  const [internalSelectedScenario, setSelectedScenario] = useState({
    id: "balanced",
    label: "Balanced",
    projected_sales_delta_pct: 4.5,
    projected_pb_share_pct: 28.5,
    shelf_capacity_impact_pct: 1.2,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [internalIsSubmitting, setIsSubmitting] = useState(false);
  const [internalSubmissionResult, setSubmissionResult] = useState(null);
  const [internalErrorMessage, setErrorMessage] = useState(null);

  const kpiData = propKpiData ?? internalKpiData;
  const skusData = propSkusData ?? internalSkusData;
  const scenariosData = propScenariosData ?? internalScenariosData;
  const selectedScenario = propSelectedScenario ?? internalSelectedScenario;
  const isSubmitting = propIsSubmitting ?? internalIsSubmitting;
  const submissionResult = propSubmissionResult ?? internalSubmissionResult;
  const errorMessage = propErrorMessage ?? internalErrorMessage;

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
        // Fallbacks handled
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
    if (propOnSelectScenario) {
      propOnSelectScenario(scenario);
    } else {
      setSelectedScenario(scenario);
    }
  };

  const handleSubmit = async () => {
    if (propOnSubmit) {
      propOnSubmit();
      return;
    }
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

  const handleCloseAudit = () => {
    if (propOnClearResult) propOnClearResult();
    setSubmissionResult(null);
  };

  const handleCloseError = () => {
    if (propOnClearError) propOnClearError();
    setErrorMessage(null);
  };

  return (
    <div className="space-y-6">
      {/* Submission Audit Confirmation Modal */}
      {submissionResult && (
        <InlineAuditModal
          auditData={submissionResult}
          onClose={handleCloseAudit}
        />
      )}

      {/* Submission Error Banner */}
      {errorMessage && (
        <div className="bg-red-900/40 border border-red-500/50 rounded-lg p-3 flex items-center justify-between text-red-200 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-red-400 text-sm">
              error
            </span>
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={handleCloseError}
            className="text-red-400 hover:text-red-200"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* Dashboard Title & Overview Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">
          Snacks Category Assortment Advisor
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Consolidated decision-support dashboard for Small Town Value Cluster.
        </p>
      </div>

      {/* KPI Header Strip */}
      <KPIHeaderStrip kpiData={kpiData} />

      {/* Scenarios & Table & Review Panel Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <ScenarioSelector
            scenariosData={scenariosData}
            selectedScenarioId={selectedScenario?.id}
            onSelectScenario={handleSelectScenario}
          />
          <SKUPerformanceTable skusData={skusData} />
        </div>

        <div className="xl:col-span-1">
          <ApprovalReviewPanel
            selectedScenario={selectedScenario}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
