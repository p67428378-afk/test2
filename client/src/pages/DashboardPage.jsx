import React, { useState, useEffect } from "react";
import KPIHeaderStrip from "../components/dashboard/KPIHeaderStrip";
import ProductPerformanceGrid from "../components/dashboard/ProductPerformanceGrid";
import ScenarioSelector from "../components/dashboard/ScenarioSelector";
import ApprovalReviewPanel from "../components/dashboard/ApprovalReviewPanel";
import SuccessBanner from "../components/common/SuccessBanner";
import { getDashboardData, submitProposal } from "../services/api";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [kpis, setKpis] = useState(null);
  const [products, setProducts] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedProposal, setSubmittedProposal] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getDashboardData();
        setKpis(data.kpis);
        setProducts(data.products || []);
        setScenarios(data.scenarios || []);

        // Pre-select Balanced scenario
        const balanced = (data.scenarios || []).find(
          (s) => s.id === "balanced",
        );
        setSelectedScenario(balanced || data.scenarios?.[0] || null);
        setError(null);
      } catch (err) {
        setError("Failed to load dashboard data. Please try again later.");
        if (process.env.NODE_ENV !== "production") {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSelectScenario = (scenario) => {
    setSelectedScenario(scenario);
    // Clear previous submission when switching scenarios
    setSubmittedProposal(null);
  };

  const handleSubmitProposal = async () => {
    if (!selectedScenario) return;
    try {
      setIsSubmitting(true);

      // Map proposed actions from selected scenario
      const proposedActions = (selectedScenario.product_actions || []).map(
        (pa) => ({
          product_id: pa.product_id,
          action: pa.action,
        }),
      );

      const result = await submitProposal(selectedScenario.id, proposedActions);
      setSubmittedProposal(result);

      // Scroll to top to show success banner
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      alert(
        err.response?.data?.detail ||
          "Failed to submit proposal. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined animate-spin text-primary text-4xl">
            sync
          </span>
          <p className="text-on-surface-variant font-medium">
            Loading decision-support dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-error/10 border border-error/30 p-6 rounded-lg max-w-md text-center flex flex-col gap-4">
          <span className="material-symbols-outlined text-error text-4xl">
            error
          </span>
          <p className="text-on-surface font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-primary-container text-on-primary px-4 py-2 rounded font-semibold transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Success Banner */}
      {submittedProposal && (
        <SuccessBanner
          proposal={submittedProposal}
          onClose={() => setSubmittedProposal(null)}
        />
      )}

      {/* Row 1: KPIs */}
      <KPIHeaderStrip kpis={kpis} />

      {/* Row 2: Split Layout */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: Data Table */}
        <ProductPerformanceGrid
          products={products}
          selectedScenario={selectedScenario}
        />

        {/* Right Column: Scenarios & Approvals */}
        <div className="col-span-12 xl:col-span-4 flex flex-col gap-6">
          <ScenarioSelector
            scenarios={scenarios}
            selectedScenarioId={selectedScenario?.id}
            onSelectScenario={handleSelectScenario}
          />

          <ApprovalReviewPanel
            selectedScenario={selectedScenario}
            onSubmit={handleSubmitProposal}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
