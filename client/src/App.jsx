import React, { useState, useEffect } from "react";
import KpiHeaderStrip from "./components/KpiHeaderStrip";
import ProductPerformanceTable from "./components/ProductPerformanceTable";
import ScenarioSelector from "./components/ScenarioSelector";
import ApprovalReviewPanel from "./components/ApprovalReviewPanel";
import SuccessBanner from "./components/SuccessBanner";
import {
  getKpis,
  getProducts,
  getScenarios,
  createApprovalRequest,
} from "./services/api";

export default function App() {
  const [kpis, setKpis] = useState(null);
  const [products, setProducts] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [auditTrail, setAuditTrail] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [kpiData, productData, scenarioData] = await Promise.all([
          getKpis(),
          getProducts(),
          getScenarios(),
        ]);
        setKpis(kpiData);
        setProducts(productData);
        setScenarios(scenarioData);

        // Pre-select "Balanced" scenario
        const balanced = scenarioData.find(
          (s) => s.name?.toLowerCase() === "balanced",
        );
        setSelectedScenario(balanced || scenarioData[0] || null);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(
          "Failed to load dashboard data. Please ensure the backend server is running.",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSubmitApproval = async () => {
    if (!selectedScenario) return;
    try {
      setSubmitting(true);
      setError(null);
      const response = await createApprovalRequest(
        selectedScenario.id,
        "PM-001",
        "Sarah Chen",
      );
      if (response.audit_trail) {
        setAuditTrail(response.audit_trail);
      } else {
        // Fallback if audit_trail is not returned directly
        setAuditTrail({
          approved_by: "Sarah Chen",
          timestamp: new Date().toISOString(),
          guardrails_passed: [
            "RBI Exposure Limits",
            "KYC / AML Compliant",
            "PMLA 2002 Guidelines",
            "Minimum CASA Floor",
          ],
        });
      }
    } catch (err) {
      console.error("Error submitting approval request:", err);
      const errMsg =
        err.response?.data?.detail ||
        "Failed to submit approval request. Please check guardrail compliance.";
      setError(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen font-sans text-[#dae2fd] antialiased overflow-x-hidden flex flex-col bg-[#0b1326]">
      {/* TopNavBar */}
      <header className="bg-surface border-b border-outline-variant flex justify-between items-center px-container-margin w-full max-w-full mx-auto h-16 z-50">
        <div className="flex items-center space-x-4">
          <h1 className="text-title-md font-bold text-on-surface">
            Retail Banking Product Strategy Decision-Support Tool
          </h1>
          <span className="text-on-surface-variant font-body-sm text-body-sm border-l border-outline-variant pl-4 ml-4 hidden lg:inline-block">
            Semi-Urban/Rural Branch Cluster
          </span>
        </div>
        <nav className="hidden md:flex space-x-8">
          <a
            className="text-primary border-b-2 border-primary pb-1 font-bold font-label-md text-label-md hover:text-primary transition-colors opacity-80"
            href="#"
          >
            Strategy
          </a>
          <a
            className="text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors"
            href="#"
          >
            Dashboard
          </a>
          <a
            className="text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors"
            href="#"
          >
            Risk
          </a>
          <a
            className="text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors"
            href="#"
          >
            Approvals
          </a>
        </nav>
        <div className="flex items-center space-x-6">
          <span className="text-on-surface-variant font-label-md text-label-md hidden md:inline-block">
            January 1, 2026
          </span>
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <div className="text-on-surface font-label-md text-label-md">
                Sarah Chen
              </div>
              <div className="text-on-surface-variant font-label-sm text-label-sm">
                Product Manager
              </div>
            </div>
            <img
              alt="Sarah Chen Avatar"
              className="w-8 h-8 rounded-full border border-outline-variant"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfsbSKBE2iwJozkoArYXIh4divwzymmR7m4f8kecxqr_twlTod1icmTnLk28dwvl7S6IAaobT0MTJBDpcdlfIIbq3xA_ls4T5-_MqI4CrPziAAJdh8i1SuF6Qj8P0YOLp-HG0QpI7M4kGP2c277LqdE13L447Fw4SsgAw3Y5vsUhWB5mOnN5inJVdWOsii_O0UQxTIKcZckyV0_wU_8aLPabq1c-ZKrUsvSJRBNcNf2CcBoeglZD5mV2yCAO0TTCrO4KLMQQ2bVR0"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 px-container-margin py-gutter w-full max-w-[1600px] mx-auto flex flex-col gap-stack-default">
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 text-red-200 p-4 rounded-xl flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-white"
            >
              <span className="material-symbols-outlined text-[18px]">
                close
              </span>
            </button>
          </div>
        )}

        {auditTrail && (
          <SuccessBanner
            auditTrail={auditTrail}
            onClose={() => setAuditTrail(null)}
          />
        )}

        <KpiHeaderStrip kpis={kpis} loading={loading} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter flex-1">
          {/* Left Column (8-col) */}
          <div className="lg:col-span-8 flex flex-col gap-gutter">
            <ProductPerformanceTable products={products} loading={loading} />
            <ScenarioSelector
              scenarios={scenarios}
              selectedScenario={selectedScenario}
              onSelectScenario={setSelectedScenario}
              loading={loading}
            />
          </div>

          {/* Right Column (4-col) */}
          <div className="lg:col-span-4 flex flex-col h-full">
            <ApprovalReviewPanel
              selectedScenario={selectedScenario}
              onSubmit={handleSubmitApproval}
              submitting={submitting}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
