import React, { useState, useEffect } from "react";
import KPIHeaderStrip from "../components/advisor/KPIHeaderStrip.jsx";
import SKUPerformanceSection from "../components/advisor/SKUPerformanceSection.jsx";
import ScenarioSelector from "../components/advisor/ScenarioSelector.jsx";
import ApprovalReviewPanel from "../components/advisor/ApprovalReviewPanel.jsx";
import SuccessBanner from "../components/common/SuccessBanner.jsx";
import {
  getKPIs,
  getSKUPerformance,
  getScenarioProjections,
  submitAssortmentDecision,
} from "../services/api.js";

export default function DashboardPage() {
  // State for KPIs
  const [kpis, setKpis] = useState(null);
  const [kpisLoading, setKpisLoading] = useState(true);
  const [kpisError, setKpisError] = useState(false);

  // State for SKU Performance
  const [skus, setSkus] = useState([]);
  const [skusTotal, setSkusTotal] = useState(0);
  const [skusPage, setSkusPage] = useState(1);
  const [skusLimit] = useState(10);
  const [skusSearch, setSkusSearch] = useState("");
  const [skusStatus, setSkusStatus] = useState("");
  const [skusLoading, setSkusLoading] = useState(true);
  const [skusError, setSkusError] = useState(false);

  // State for Scenario Selector & Projections
  const [selectedScenario, setSelectedScenario] = useState("balanced");
  const [projections, setProjections] = useState(null);
  const [projectionsLoading, setProjectionsLoading] = useState(true);
  const [projectionsError, setProjectionsError] = useState(false);

  // State for Submission & Confirmation
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [submissionError, setSubmissionError] = useState(null);

  // Fetch KPIs on mount
  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        setKpisLoading(true);
        const data = await getKPIs();
        setKpis(data);
        setKpisError(false);
      } catch (err) {
        console.error("Error fetching KPIs:", err);
        setKpisError(true);
      } finally {
        setKpisLoading(false);
      }
    };

    fetchKPIs();
  }, []);

  // Fetch SKU Performance when page, search, or status changes
  useEffect(() => {
    const fetchSKUs = async () => {
      try {
        setSkusLoading(true);
        const data = await getSKUPerformance({
          page: skusPage,
          limit: skusLimit,
          search: skusSearch || undefined,
          status: skusStatus || undefined,
        });
        setSkus(data.items || []);
        setSkusTotal(data.total || 0);
        setSkusError(false);
      } catch (err) {
        console.error("Error fetching SKUs:", err);
        setSkusError(true);
      } finally {
        setSkusLoading(false);
      }
    };

    fetchSKUs();
  }, [skusPage, skusSearch, skusStatus, skusLimit]);

  // Fetch Scenario Projections when selected scenario changes
  useEffect(() => {
    const fetchProjections = async () => {
      try {
        setProjectionsLoading(true);
        const data = await getScenarioProjections(selectedScenario);
        setProjections(data);
        setProjectionsError(false);
      } catch (err) {
        console.error("Error fetching projections:", err);
        setProjectionsError(true);
      } finally {
        setProjectionsLoading(false);
      }
    };

    fetchProjections();
  }, [selectedScenario]);

  // Handle Scenario Change
  const handleScenarioChange = (scenarioId) => {
    setSelectedScenario(scenarioId);
    // Clear previous submission result when scenario changes
    setSubmissionResult(null);
  };

  // Handle Submit Assortment Changes
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setSubmissionError(null);

      const payload = {
        action_counts: projections?.action_counts || {
          grow: 12,
          maintain: 24,
          swap: 8,
          reduce: 4,
        },
        scenario_applied: selectedScenario,
        user_name: "Sarah Chen",
      };

      const result = await submitAssortmentDecision(payload);
      setSubmissionResult(result);
    } catch (err) {
      console.error("Error submitting assortment decision:", err);
      setSubmissionError(
        err.response?.data?.detail || "Failed to submit assortment decision.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Row 1: KPI Cards */}
      <KPIHeaderStrip kpis={kpis} loading={kpisLoading} error={kpisError} />

      {/* Inline Confirmation Banner */}
      {submissionResult && (
        <SuccessBanner
          summary={submissionResult.summary}
          auditId={submissionResult.audit_id}
          submittedAt={submissionResult.submitted_at}
          onClose={() => setSubmissionResult(null)}
        />
      )}

      {submissionError && (
        <div className="bg-error-container text-on-error-container p-4 rounded-xl border border-error-container/30">
          {submissionError}
        </div>
      )}

      {/* Row 2: Table & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8-cols: Table */}
        <SKUPerformanceSection
          items={skus}
          total={skusTotal}
          page={skusPage}
          limit={skusLimit}
          onPageChange={setSkusPage}
          onSearchChange={(val) => {
            setSkusSearch(val);
            setSkusPage(1); // Reset to first page on search
          }}
          onStatusChange={(val) => {
            setSkusStatus(val);
            setSkusPage(1); // Reset to first page on status change
          }}
          loading={skusLoading}
          error={skusError}
        />

        {/* Right 4-cols: Actions & Summaries */}
        <div className="lg:col-span-4 space-y-6">
          <ScenarioSelector
            selectedScenario={selectedScenario}
            onScenarioChange={handleScenarioChange}
            projections={projections}
          />

          <ApprovalReviewPanel
            scenarioType={selectedScenario}
            projections={projections}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        </div>
      </div>
    </div>
  );
}
