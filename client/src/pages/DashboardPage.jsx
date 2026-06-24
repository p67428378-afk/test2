import React, { useState, useEffect } from "react";
import { getDashboardData, submitProposal } from "../services/api";
import KPIHeaderStrip from "../components/dashboard/KPIHeaderStrip";
import ProductPerformanceGrid from "../components/dashboard/ProductPerformanceGrid";
import ScenarioSelector from "../components/dashboard/ScenarioSelector";
import ApprovalReviewPanel from "../components/dashboard/ApprovalReviewPanel";
import SuccessBanner from "../components/common/SuccessBanner";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [selectedScenarioId, setSelectedScenarioId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proposalResult, setProposalResult] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getDashboardData();
        setData(result);

        // Pre-select "Balanced" scenario
        const balancedScenario = result.scenarios?.find(
          (s) =>
            s.id.toLowerCase() === "balanced" ||
            s.name.toLowerCase() === "balanced",
        );
        if (balancedScenario) {
          setSelectedScenarioId(balancedScenario.id);
        } else if (result.scenarios?.length > 0) {
          setSelectedScenarioId(result.scenarios[0].id);
        }
        setError(null);
      } catch {
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectScenario = (scenarioId) => {
    setSelectedScenarioId(scenarioId);
    // Clear previous proposal result when switching scenarios
    setProposalResult(null);
  };

  const handleSubmitProposal = async () => {
    if (!data || !selectedScenarioId) return;

    const selectedScenario = data.scenarios.find(
      (s) => s.id === selectedScenarioId,
    );
    if (!selectedScenario) return;

    try {
      setIsSubmitting(true);
      setProposalResult(null);

      // Prepare proposed actions payload
      const proposedActions = selectedScenario.product_actions.map((pa) => ({
        product_id: pa.product_id,
        action: pa.action,
      }));

      const result = await submitProposal(selectedScenarioId, proposedActions);
      setProposalResult(result);
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
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
          <span className="text-sm font-semibold text-on-surface-variant">
            Loading dashboard data...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="bg-red-50 border border-error/20 rounded-xl p-6 max-w-md text-center flex flex-col gap-3">
          <span className="material-symbols-outlined text-error text-4xl">
            error
          </span>
          <h3 className="text-lg font-bold text-error">Error</h3>
          <p className="text-sm text-on-surface-variant">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 bg-error text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const selectedScenario = data?.scenarios?.find(
    (s) => s.id === selectedScenarioId,
  );

  return (
    <div className="p-6 flex flex-col gap-6 max-w-[1440px] mx-auto w-full">
      {/* Success Banner */}
      <SuccessBanner proposalResult={proposalResult} />

      {/* Row 1: KPIs */}
      <KPIHeaderStrip kpis={data?.kpis} />

      {/* Row 2: Split 8/4 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Table */}
        <div className="lg:col-span-8">
          <ProductPerformanceGrid
            products={data?.products || []}
            selectedScenario={selectedScenario}
          />
        </div>

        {/* Right Column (4 cols): Panels */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <ScenarioSelector
            scenarios={data?.scenarios || []}
            selectedScenarioId={selectedScenarioId}
            onSelectScenario={handleSelectScenario}
          />
          <ApprovalReviewPanel
            selectedScenario={selectedScenario}
            products={data?.products || []}
            onSubmit={handleSubmitProposal}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
