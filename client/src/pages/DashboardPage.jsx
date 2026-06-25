import React, { useState, useEffect } from "react";
import KPIHeaderStrip from "../components/dashboard/KPIHeaderStrip";
import ProductPerformanceGrid from "../components/dashboard/ProductPerformanceGrid";
import ScenarioSelectorPanel from "../components/dashboard/ScenarioSelectorPanel";
import ApprovalReviewPanel from "../components/dashboard/ApprovalReviewPanel";
import SuccessBanner from "../components/dashboard/SuccessBanner";
import {
  getKPIs,
  getProducts,
  getScenario,
  submitApproval,
} from "../services/api";

export default function DashboardPage() {
  const [kpis, setKpis] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState("balanced");
  const [scenarioData, setScenarioData] = useState(null);
  const [auditTrail, setAuditTrail] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const kpiData = await getKPIs();
        setKpis(kpiData);

        const productData = await getProducts();
        setProducts(productData);
      } catch (err) {
        console.error("Error loading initial dashboard data:", err);
        setError(
          "Failed to load dashboard metrics. Please ensure the backend is running.",
        );
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    const loadScenarioData = async () => {
      try {
        const data = await getScenario(selectedScenario);
        setScenarioData(data);
      } catch (err) {
        console.error("Error loading scenario data:", err);
        setError(
          `Failed to load projections for ${selectedScenario} scenario.`,
        );
      }
    };

    loadScenarioData();
  }, [selectedScenario]);

  const handleSubmitDecision = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const productActions = scenarioData.recommended_actions.map((act) => ({
        product_id: act.product_id,
        recommended_action: act.action,
      }));

      const payload = {
        selected_scenario: selectedScenario,
        product_actions: productActions,
      };

      const result = await submitApproval(payload);
      if (result.status === "SUCCESS") {
        setAuditTrail(result.audit_trail);
        // Refresh products to reflect new statuses if needed
        const updatedProducts = await getProducts();
        setProducts(updatedProducts);
      } else {
        setError("Submission failed. Please check guardrail compliance.");
      }
    } catch (err) {
      console.error("Error submitting decision:", err);
      setError(
        err.response?.data?.detail ||
          "Failed to submit decision. Guardrail check failed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-[1440px] mx-auto flex flex-col gap-8">
      {/* Test Account Banner */}
      <div className="bg-surface-container-high border border-outline-variant rounded-lg p-3 flex items-center justify-between text-xs text-on-surface-variant">
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-primary"
            style={{ fontSize: "16px" }}
          >
            info
          </span>
          <span>
            Logged in as <strong>Aarchi Jain</strong> (Product Manager). Test
            account: <code>test@example.com</code> / <code>testpassword</code>
          </span>
        </div>
        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-semibold uppercase tracking-wider text-[10px]">
          Pre-Authenticated
        </span>
      </div>

      {/* Error Alert */}
      {error && (
        <div
          className="bg-error/10 border border-error text-error p-4 rounded-lg flex items-center gap-3"
          role="alert"
        >
          <span className="material-symbols-outlined">error</span>
          <div className="flex-1 text-sm">{error}</div>
          <button
            onClick={() => setError(null)}
            className="text-error hover:text-white"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "18px" }}
            >
              close
            </span>
          </button>
        </div>
      )}

      {/* Success Banner */}
      {auditTrail && (
        <SuccessBanner
          auditTrail={auditTrail}
          onClose={() => setAuditTrail(null)}
        />
      )}

      {/* Row 1: KPI Cards */}
      <KPIHeaderStrip kpis={kpis} />

      {/* Row 2: Grid Layout */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Main Table Area (8 col) */}
        <ProductPerformanceGrid
          products={products}
          recommendedActions={scenarioData?.recommended_actions}
        />

        {/* Scenario & Approval Panel (4 col) */}
        <div className="xl:col-span-4 flex flex-col gap-4">
          <ScenarioSelectorPanel
            selectedScenario={selectedScenario}
            onSelectScenario={setSelectedScenario}
            scenarioData={scenarioData}
          />

          <ApprovalReviewPanel
            selectedScenario={selectedScenario}
            scenarioData={scenarioData}
            onSubmit={handleSubmitDecision}
            isSubmitting={isSubmitting}
          />
        </div>
      </section>
    </div>
  );
}
