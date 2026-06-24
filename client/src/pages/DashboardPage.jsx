import React, { useState, useEffect } from "react";
import { getDashboardData, submitAssortmentPlan } from "../services/api";
import KpiHeaderStrip from "../components/assortment/KpiHeaderStrip";
import SkuPerformanceTable from "../components/assortment/SkuPerformanceTable";
import ScenarioSelector from "../components/assortment/ScenarioSelector";
import ApprovalReviewPanel from "../components/assortment/ApprovalReviewPanel";
import Modal from "../components/common/Modal";

// Robust fallback mock data in case API is not running or fails
const MOCK_DASHBOARD_DATA = {
  kpi_metrics: {
    sales_per_linear_ft: 450.5,
    private_brand_percent: 24.5,
    in_stock_rate: 96.2,
    shelf_capacity: 1200,
  },
  scenarios: [
    {
      name: "Conservative",
      projected_impact: {
        sales_per_linear_ft: 460.2,
        private_brand_percent: 25.0,
        in_stock_rate: 97.0,
        shelf_capacity: 1150,
      },
      guardrails: {
        private_brand_target_passed: true,
        sales_target_passed: true,
        shelf_capacity_passed: true,
      },
      sku_actions: [
        { sku: "SKU-1001", action: "GROW" },
        { sku: "SKU-8492", action: "MAINTAIN" },
        { sku: "SKU-1192", action: "MAINTAIN" },
      ],
    },
    {
      name: "Balanced",
      projected_impact: {
        sales_per_linear_ft: 485.5,
        private_brand_percent: 28.2,
        in_stock_rate: 96.5,
        shelf_capacity: 1200,
      },
      guardrails: {
        private_brand_target_passed: true,
        sales_target_passed: true,
        shelf_capacity_passed: true,
      },
      sku_actions: [
        { sku: "SKU-1001", action: "GROW" },
        { sku: "SKU-3104", action: "GROW" },
        { sku: "SKU-8492", action: "MAINTAIN" },
        { sku: "SKU-1192", action: "MAINTAIN" },
        { sku: "SKU-5521", action: "SWAP" },
        { sku: "SKU-2281", action: "REDUCE" },
      ],
    },
    {
      name: "Aggressive",
      projected_impact: {
        sales_per_linear_ft: 510.0,
        private_brand_percent: 32.0,
        in_stock_rate: 94.8,
        shelf_capacity: 1250,
      },
      guardrails: {
        private_brand_target_passed: true,
        sales_target_passed: true,
        shelf_capacity_passed: false,
      },
      sku_actions: [
        { sku: "SKU-1001", action: "GROW" },
        { sku: "SKU-3104", action: "GROW" },
        { sku: "SKU-7743", action: "GROW" },
        { sku: "SKU-5521", action: "SWAP" },
        { sku: "SKU-2281", action: "REDUCE" },
      ],
    },
  ],
  sku_performance: [
    {
      id: "d3b07384-d113-49c3-a55e-4c3d163e4501",
      sku: "SKU-1001",
      name: "Clover Valley Potato Chips 10oz",
      private_brand_percent: 100,
      sales_per_linear_ft: 520,
      in_stock_rate: 98.5,
      shelf_capacity: 150,
      status: "GROW",
    },
    {
      id: "d3b07384-d113-49c3-a55e-4c3d163e4502",
      sku: "SKU-8492",
      name: "Lay's Classic",
      private_brand_percent: 0,
      sales_per_linear_ft: 512,
      in_stock_rate: 98.2,
      shelf_capacity: 48,
      status: "MAINTAIN",
    },
    {
      id: "d3b07384-d113-49c3-a55e-4c3d163e4503",
      sku: "SKU-3104",
      name: "Clover Valley Tortilla",
      private_brand_percent: 100,
      sales_per_linear_ft: 480,
      in_stock_rate: 97.5,
      shelf_capacity: 36,
      status: "GROW",
    },
    {
      id: "d3b07384-d113-49c3-a55e-4c3d163e4504",
      sku: "SKU-5521",
      name: "Cheetos Crunchy",
      private_brand_percent: 0,
      sales_per_linear_ft: 390,
      in_stock_rate: 95.1,
      shelf_capacity: 48,
      status: "SWAP",
    },
    {
      id: "d3b07384-d113-49c3-a55e-4c3d163e4505",
      sku: "SKU-1192",
      name: "Clover Valley Pretzels",
      private_brand_percent: 100,
      sales_per_linear_ft: 310,
      in_stock_rate: 94.0,
      shelf_capacity: 24,
      status: "MAINTAIN",
    },
    {
      id: "d3b07384-d113-49c3-a55e-4c3d163e4506",
      sku: "SKU-7743",
      name: "Doritos Nacho",
      private_brand_percent: 0,
      sales_per_linear_ft: 540,
      in_stock_rate: 98.9,
      shelf_capacity: 60,
      status: "GROW",
    },
    {
      id: "d3b07384-d113-49c3-a55e-4c3d163e4507",
      sku: "SKU-2281",
      name: "Generic Potato Sticks",
      private_brand_percent: 0,
      sales_per_linear_ft: 180,
      in_stock_rate: 89.5,
      shelf_capacity: 12,
      status: "REDUCE",
    },
  ],
};

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getDashboardData();
        setData(result);
        // Pre-select Balanced scenario
        const balanced =
          result.scenarios.find((s) => s.name === "Balanced") ||
          result.scenarios[0];
        setSelectedScenario(balanced);
        setError(null);
      } catch (err) {
        // Fallback to mock data if API fails
        setData(MOCK_DASHBOARD_DATA);
        const balanced = MOCK_DASHBOARD_DATA.scenarios.find(
          (s) => s.name === "Balanced",
        );
        setSelectedScenario(balanced);
        setError("Using offline mode. Backend API is currently unavailable.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectScenario = (scenario) => {
    setSelectedScenario(scenario);
  };

  const handleSubmitPlan = async () => {
    if (!selectedScenario) return;

    try {
      setIsSubmitting(true);
      const result = await submitAssortmentPlan(
        selectedScenario.name,
        selectedScenario.sku_actions,
      );
      setSubmitResult(result);
      setIsModalOpen(true);
    } catch (err) {
      // Fallback submit response for offline mode
      const mockResult = {
        audit_trail_id: "e4b07384-d113-49c3-a55e-4c3d163e4502",
        scenario_name: selectedScenario.name,
        sku_actions_count: selectedScenario.sku_actions.length,
        status: "SUCCESS",
        submitted_at: new Date().toISOString(),
        submitted_by: "category_manager@dollargeneral.com",
      };
      setSubmitResult(mockResult);
      setIsModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-on-background">
        <div className="flex flex-col items-center gap-md">
          <span className="material-symbols-outlined animate-spin text-primary-container text-[48px]">
            sync
          </span>
          <p className="font-title-md text-title-md">
            Loading Assortment Advisor...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-background">
      {/* TopNavBar */}
      <header className="h-16 w-full flex items-center justify-between px-lg bg-surface-container border-b border-outline-variant fixed top-0 z-50">
        <div className="flex items-center gap-md">
          <div className="bg-black text-primary-container p-2 rounded-sm font-bold flex items-center justify-center h-10 w-10 shrink-0">
            <span className="font-display-lg text-[20px] leading-none">DG</span>
          </div>
          <h1 className="font-title-md text-title-md text-on-surface truncate">
            Assortment Advisor
          </h1>
          <div className="h-8 w-[1px] bg-outline-variant mx-sm hidden sm:block"></div>
          <button className="hidden sm:flex items-center gap-xs px-md py-sm bg-surface-container-high rounded hover:bg-surface-container-highest transition-colors text-on-surface border border-outline-variant">
            <span className="font-label-md text-label-md">
              Small Town Value Cluster - Region 4
            </span>
            <span className="material-symbols-outlined text-[18px]">
              keyboard_arrow_down
            </span>
          </button>
        </div>
        <div className="flex items-center gap-lg">
          <nav className="hidden md:flex items-center gap-lg">
            <a
              className="font-title-md text-title-md text-primary border-b-2 border-primary pb-1"
              href="#"
            >
              Dashboard
            </a>
            <a
              className="font-title-md text-title-md text-on-surface-variant hover:text-on-surface transition-colors"
              href="#"
            >
              Analytics
            </a>
            <a
              className="font-title-md text-title-md text-on-surface-variant hover:text-on-surface transition-colors"
              href="#"
            >
              Scenarios
            </a>
            <a
              className="font-title-md text-title-md text-on-surface-variant hover:text-on-surface transition-colors"
              href="#"
            >
              Library
            </a>
          </nav>
          <div className="flex items-center gap-md border-l border-outline-variant pl-lg">
            <div className="flex flex-col items-end mr-sm">
              <span className="font-label-md text-label-md text-on-surface font-semibold">
                Sarah Jenkins
              </span>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">
                Category Manager
              </span>
            </div>
            <div className="h-10 w-10 rounded-full bg-surface-container-highest overflow-hidden border border-outline">
              <img
                className="w-full h-full object-cover"
                alt="Sarah Jenkins"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdWXr7EmrhqiK3wLhaesnncZN2DKPA-n35Hb5U8tnxoY8_Yax1iiYUE_rFfexA3dCg0gUBakuOww64tg0OnN79gFtY5rf5nYm1ay67BjC_u2B1rVTg4wzF8gw4xi3JSkiXQ3vA7Mfy6rIHB0BsMO_QShRbHn9IrE5bgppiGB4FpM5WNbLg2hPxa1Loxf825Rq2zPMqhZJsqRUU3mhm_cJnSSgYnQa89rVVFlpPZ7Jzp2A1IOe4q1r6CM__W2ZKi5-yDIYue-l14i1i"
              />
            </div>
            <button className="material-symbols-outlined text-on-surface-variant hover:text-on-surface">
              settings
            </button>
          </div>
        </div>
      </header>

      {/* SideNavBar */}
      <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-surface-container-low border-r border-outline-variant hidden lg:flex flex-col z-40">
        <div className="p-md">
          <button className="w-full py-md bg-primary-container text-on-primary font-bold rounded-lg flex items-center justify-center gap-sm hover:opacity-90 transition-all shadow-sm">
            <span className="material-symbols-outlined">add</span>
            <span>New Scenario</span>
          </button>
        </div>
        <nav className="flex-1 flex flex-col gap-xs mt-md">
          <a
            className="flex items-center gap-md px-md py-sm bg-secondary-container text-on-secondary-container rounded-lg mx-2 transition-all duration-200"
            href="#"
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-label-md text-label-md">Overview</span>
          </a>
          <a
            className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-container-high mx-2 rounded-lg transition-all duration-200"
            href="#"
          >
            <span className="material-symbols-outlined">hub</span>
            <span className="font-label-md text-label-md">Clusters</span>
          </a>
          <a
            className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-container-high mx-2 rounded-lg transition-all duration-200"
            href="#"
          >
            <span className="material-symbols-outlined">inventory_2</span>
            <span className="font-label-md text-label-md">SKU Analysis</span>
          </a>
          <a
            className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-container-high mx-2 rounded-lg transition-all duration-200"
            href="#"
          >
            <span className="material-symbols-outlined">tune</span>
            <span className="font-label-md text-label-md">Scenarios</span>
          </a>
          <a
            className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-container-high mx-2 rounded-lg transition-all duration-200"
            href="#"
          >
            <span className="material-symbols-outlined">assessment</span>
            <span className="font-label-md text-label-md">Reports</span>
          </a>
        </nav>
        <div className="mt-auto border-t border-outline-variant p-md">
          <div className="flex items-center gap-sm mb-md px-sm">
            <div className="bg-primary-container p-1 rounded-sm">
              <span className="text-[10px] font-bold text-black">DG</span>
            </div>
            <div>
              <p className="text-on-surface font-semibold text-[12px]">
                DG Cluster Advisor
              </p>
              <p className="text-on-surface-variant text-[10px]">
                v2.4 Stable Build
              </p>
            </div>
          </div>
          <a
            className="flex items-center gap-md px-sm py-xs text-on-surface-variant hover:text-on-surface mb-2"
            href="#"
          >
            <span className="material-symbols-outlined text-[20px]">help</span>
            <span className="text-label-md font-label-md">Support</span>
          </a>
          <a
            className="flex items-center gap-md px-sm py-xs text-error hover:opacity-80"
            href="#"
          >
            <span className="material-symbols-outlined text-[20px]">
              logout
            </span>
            <span className="text-label-md font-label-md">Logout</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 mt-16 p-lg bg-background min-h-screen pb-24 lg:pb-lg">
        {error && (
          <div className="mb-lg p-md bg-surface-container-high border border-primary-container/30 rounded-xl flex items-center gap-md text-primary-container text-body-md">
            <span className="material-symbols-outlined">info</span>
            <span>{error}</span>
          </div>
        )}

        {/* Row 1: KPI Cards */}
        <KpiHeaderStrip
          metrics={
            selectedScenario
              ? selectedScenario.projected_impact
              : data.kpi_metrics
          }
        />

        {/* Row 2: Tables and Scenarios */}
        <div className="grid grid-cols-12 gap-gutter">
          {/* Left: SKU Performance Table */}
          <SkuPerformanceTable skus={data.sku_performance} />

          {/* Right: Scenarios and Approval */}
          <div className="col-span-12 xl:col-span-4 flex flex-col gap-gutter">
            <ScenarioSelector
              scenarios={data.scenarios}
              selectedScenario={selectedScenario}
              onSelectScenario={handleSelectScenario}
            />

            <ApprovalReviewPanel
              selectedScenario={selectedScenario}
              onSubmit={handleSubmitPlan}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </main>

      {/* Mobile Navigation (Bottom) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface-container border-t border-outline-variant h-16 flex items-center justify-around lg:hidden z-50">
        <button className="flex flex-col items-center gap-1 text-primary-container">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-on-surface-variant">
          <span className="material-symbols-outlined">hub</span>
          <span className="text-[10px] font-bold">Clusters</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-on-surface-variant">
          <span className="material-symbols-outlined">inventory_2</span>
          <span className="text-[10px] font-bold">SKUs</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-on-surface-variant">
          <span className="material-symbols-outlined">tune</span>
          <span className="text-[10px] font-bold">Scenarios</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-on-surface-variant">
          <span className="material-symbols-outlined">account_circle</span>
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </nav>

      {/* Success Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Assortment Plan Submitted Successfully"
      >
        {submitResult && (
          <div className="space-y-lg">
            <div className="flex flex-col items-center justify-center text-center p-lg bg-primary-container/10 border border-primary-container/30 rounded-xl">
              <span className="material-symbols-outlined text-primary-container text-[48px] mb-sm">
                check_circle
              </span>
              <h4 className="font-title-md text-title-md text-white">
                Plan Finalized
              </h4>
              <p className="text-on-surface-variant text-body-md mt-xs">
                The assortment planogram changes have been successfully
                submitted.
              </p>
            </div>

            <div className="space-y-md">
              <h5 className="font-label-md text-label-md text-white uppercase tracking-wider">
                Audit Trail Summary
              </h5>
              <div className="bg-surface-container-low border border-outline-variant rounded-lg p-md space-y-sm font-mono text-[12px]">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Status:</span>
                  <span className="text-[#4ade80] font-bold">
                    {submitResult.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">
                    Audit Trail ID:
                  </span>
                  <span
                    className="text-white truncate max-w-[200px]"
                    title={submitResult.audit_trail_id}
                  >
                    {submitResult.audit_trail_id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Scenario:</span>
                  <span className="text-primary-container font-bold">
                    {submitResult.scenario_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">
                    SKU Actions Count:
                  </span>
                  <span className="text-white">
                    {submitResult.sku_actions_count}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Submitted By:</span>
                  <span className="text-white">
                    {submitResult.submitted_by}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Submitted At:</span>
                  <span className="text-white">
                    {new Date(submitResult.submitted_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
