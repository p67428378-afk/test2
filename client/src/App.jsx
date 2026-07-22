import React, { useState, useEffect } from "react";
import HeaderBar from "./components/layout/HeaderBar";
import KPIHeaderStrip from "./components/assortment/KPIHeaderStrip";
import SKUPerformanceSection from "./components/assortment/SKUPerformanceSection";
import ScenarioSelectorSection from "./components/assortment/ScenarioSelectorSection";
import ApprovalReviewPanel from "./components/assortment/ApprovalReviewPanel";
import Modal from "./components/common/Modal";
import {
  getKPIs,
  getSKUs,
  getScenarioProjection,
  submitAssortmentPlan,
} from "./services/api";

export default function App() {
  const [kpis, setKPIs] = useState(null);
  const [skus, setSKUs] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState("balanced");
  const [projection, setProjection] = useState(null);
  const [loadingKPIs, setLoadingKPIs] = useState(true);
  const [loadingSKUs, setLoadingSKUs] = useState(true);
  const [loadingProjection, setLoadingProjection] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoadingKPIs(true);
        const kpiData = await getKPIs();
        setKPIs(kpiData);
      } catch (err) {
        console.error("Error fetching KPIs:", err);
        // Fallback KPIs
        setKPIs({
          sales_per_linear_ft: 152.5,
          private_brand_percentage: 18.75,
          in_stock_rate: 94.2,
          shelf_capacity_utilized: 88.0,
        });
      } finally {
        setLoadingKPIs(false);
      }

      try {
        setLoadingSKUs(true);
        const skuData = await getSKUs();
        setSKUs(skuData);
      } catch (err) {
        console.error("Error fetching SKUs:", err);
        // Fallback SKUs
        setSKUs([
          {
            id: "1",
            sku_name: "Lay's Classic 13oz",
            upc: "028400040112",
            sales_rank_percentile: 95,
            weekly_sales: 12000,
            margin_percentage: 35.5,
            is_private_brand: false,
            status: "GROW",
          },
          {
            id: "2",
            sku_name: "Clover Valley Potato Chips",
            upc: "012345678901",
            sales_rank_percentile: 75,
            weekly_sales: 8500,
            margin_percentage: 42.0,
            is_private_brand: true,
            status: "GROW",
          },
          {
            id: "3",
            sku_name: "Doritos Nacho Cheese",
            upc: "028400091565",
            sales_rank_percentile: 62,
            weekly_sales: 7200,
            margin_percentage: 33.0,
            is_private_brand: false,
            status: "MAINTAIN",
          },
          {
            id: "4",
            sku_name: "Cheetos Crunchy",
            upc: "028400091855",
            sales_rank_percentile: 45,
            weekly_sales: 5100,
            margin_percentage: 34.0,
            is_private_brand: false,
            status: "MAINTAIN",
          },
          {
            id: "5",
            sku_name: "Fritos Original",
            upc: "028400091121",
            sales_rank_percentile: 32,
            weekly_sales: 3400,
            margin_percentage: 31.0,
            is_private_brand: false,
            status: "SWAP",
          },
          {
            id: "6",
            sku_name: "CV Tortilla Chips",
            upc: "012345678902",
            sales_rank_percentile: 28,
            weekly_sales: 2800,
            margin_percentage: 45.0,
            is_private_brand: true,
            status: "MAINTAIN",
          },
          {
            id: "7",
            sku_name: "Pretzels Rold Gold",
            upc: "028400031211",
            sales_rank_percentile: 15,
            weekly_sales: 1200,
            margin_percentage: 28.0,
            is_private_brand: false,
            status: "REDUCE",
          },
        ]);
      } finally {
        setLoadingSKUs(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch projection when scenario changes
  useEffect(() => {
    const fetchProjection = async () => {
      try {
        setLoadingProjection(true);
        const projData = await getScenarioProjection(selectedScenario);
        setProjection(projData);
      } catch (err) {
        console.error(
          `Error fetching projection for ${selectedScenario}:`,
          err,
        );
        // Fallback projections
        const fallbacks = {
          conservative: {
            scenario_name: "conservative",
            projected_private_brand_percentage: 17.5,
            projected_total_sales: 485000,
            guardrails: [
              { name: "Projected Private Brand % > 15%", pass: true },
              { name: "Shelf Capacity < 95%", pass: true },
            ],
            actions: {
              add: [{ sku_id: "2", sku_name: "Clover Valley Potato Chips" }],
              reduce: [{ sku_id: "7", sku_name: "Pretzels Rold Gold" }],
              swap: [],
            },
          },
          balanced: {
            scenario_name: "balanced",
            projected_private_brand_percentage: 19.5,
            projected_total_sales: 510000,
            guardrails: [
              { name: "Projected Private Brand % > 15%", pass: true },
              { name: "Shelf Capacity < 95%", pass: true },
            ],
            actions: {
              add: [
                { sku_id: "2", sku_name: "Clover Valley Potato Chips" },
                { sku_id: "6", sku_name: "CV Tortilla Chips" },
              ],
              reduce: [{ sku_id: "7", sku_name: "Pretzels Rold Gold" }],
              swap: [{ sku_id: "5", sku_name: "Fritos Original" }],
            },
          },
          aggressive: {
            scenario_name: "aggressive",
            projected_private_brand_percentage: 22.0,
            projected_total_sales: 535000,
            guardrails: [
              { name: "Projected Private Brand % > 15%", pass: true },
              { name: "Shelf Capacity < 95%", pass: false },
            ],
            actions: {
              add: [
                { sku_id: "2", sku_name: "Clover Valley Potato Chips" },
                { sku_id: "6", sku_name: "CV Tortilla Chips" },
              ],
              reduce: [],
              swap: [
                { sku_id: "5", sku_name: "Fritos Original" },
                { sku_id: "7", sku_name: "Pretzels Rold Gold" },
              ],
            },
          },
        };
        setProjection(fallbacks[selectedScenario] || fallbacks.balanced);
      } finally {
        setLoadingProjection(false);
      }
    };

    fetchProjection();
  }, [selectedScenario]);

  const handleSubmitPlan = async () => {
    if (!projection) return;
    try {
      setSubmitting(true);
      setError(null);
      const result = await submitAssortmentPlan({
        scenario_name: projection.scenario_name,
        projected_private_brand_percentage:
          projection.projected_private_brand_percentage,
        projected_total_sales: projection.projected_total_sales,
        guardrails: projection.guardrails,
        actions: projection.actions,
      });
      setSubmitResult(result);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error submitting assortment plan:", err);
      setError(
        "Failed to submit assortment plan. Please check guardrails and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0F172A] text-[#dae2fd]">
      <HeaderBar />

      <div className="flex flex-1 pt-[64px]">
        {/* SideNavBar */}
        <nav className="fixed left-0 top-[64px] h-[calc(100vh-64px)] w-[240px] bg-[#060e20] border-r border-[#3c4a42] flex flex-col py-4 z-40 hidden md:flex">
          <div className="px-4 pb-6 mb-2 border-b border-[#3c4a42] flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#171f33] flex items-center justify-center text-[#4edea3]">
              <span className="material-symbols-outlined">dataset</span>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold text-[#4edea3] truncate">
                Small Town Value
              </span>
              <span className="text-xs text-[#bbcabf] truncate">
                Snacks Category
              </span>
            </div>
          </div>
          <div className="px-4 mb-6">
            <button className="w-full bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
              <span className="material-symbols-outlined text-sm">add</span>
              New Scenario
            </button>
          </div>
          <div className="flex-1 overflow-y-auto flex flex-col gap-1 px-3">
            <a
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#4edea3] border-l-2 border-[#4edea3] bg-[#222a3d] opacity-80 transition-opacity duration-150 translate-x-1"
              href="#"
            >
              <span className="material-symbols-outlined">dashboard</span>
              <span className="text-xs font-medium">Dashboard</span>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#bbcabf] hover:bg-[#171f33] transition-all border-l-2 border-transparent"
              href="#"
            >
              <span className="material-symbols-outlined">inventory_2</span>
              <span className="text-xs">Assortment Plan</span>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#bbcabf] hover:bg-[#171f33] transition-all border-l-2 border-transparent"
              href="#"
            >
              <span className="material-symbols-outlined">analytics</span>
              <span className="text-xs">Scenario Builder</span>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#bbcabf] hover:bg-[#171f33] transition-all border-l-2 border-transparent"
              href="#"
            >
              <span className="material-symbols-outlined">groups</span>
              <span className="text-xs">Cluster Analysis</span>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#bbcabf] hover:bg-[#171f33] transition-all border-l-2 border-transparent"
              href="#"
            >
              <span className="material-symbols-outlined">trending_up</span>
              <span className="text-xs">Market Trends</span>
            </a>
          </div>
          <div className="mt-auto px-3 border-t border-[#3c4a42] pt-4 flex flex-col gap-1">
            <a
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#bbcabf] hover:bg-[#171f33] transition-all border-l-2 border-transparent"
              href="#"
            >
              <span className="material-symbols-outlined">help</span>
              <span className="text-xs">Support</span>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#bbcabf] hover:bg-[#171f33] transition-all border-l-2 border-transparent"
              href="#"
            >
              <span className="material-symbols-outlined">history</span>
              <span className="text-xs">Archive</span>
            </a>
          </div>
        </nav>

        {/* Main Content Canvas */}
        <main className="flex-1 ml-0 md:ml-[240px] p-6 flex flex-col gap-5 overflow-x-hidden">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl flex justify-between items-center">
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-rose-400 hover:text-white"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          )}

          {/* KPI Strip */}
          <KPIHeaderStrip kpis={kpis} loading={loadingKPIs} />

          {/* Main Grid Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1">
            {/* Left: SKU Performance (8 cols) */}
            <div className="lg:col-span-8">
              <SKUPerformanceSection skus={skus} loading={loadingSKUs} />
            </div>

            {/* Right: Scenario & Approval (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-5 h-full">
              <ScenarioSelectorSection
                selectedScenario={selectedScenario}
                onSelectScenario={setSelectedScenario}
              />
              <ApprovalReviewPanel
                selectedScenario={selectedScenario}
                projection={projection}
                onSubmit={handleSubmitPlan}
                submitting={submitting}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Success Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Assortment Plan Submitted"
      >
        <div className="flex flex-col items-center text-center gap-4">
          <span className="material-symbols-outlined text-5xl text-[#10B981]">
            check_circle
          </span>
          <div className="text-lg font-semibold text-white">
            Plan Successfully Submitted!
          </div>
          <p className="text-xs text-slate-400">
            The assortment plan has been processed and logged to the audit
            trail.
          </p>
          {submitResult && (
            <div className="bg-[#0F172A] border border-[#334155] rounded-lg p-4 w-full text-left flex flex-col gap-2 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Audit Trail ID:</span>
                <span
                  className="text-slate-300 truncate max-w-[180px]"
                  title={submitResult.audit_trail_id}
                >
                  {submitResult.audit_trail_id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="text-emerald-400 font-bold">
                  {submitResult.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Submitted At:</span>
                <span className="text-slate-300">
                  {new Date(submitResult.submitted_at).toLocaleString()}
                </span>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsModalOpen(false)}
            className="mt-2 px-6 py-2 bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}
