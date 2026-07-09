import React, { useState, useEffect } from "react";
import TopNavBar from "./components/layout/TopNavBar.jsx";
import KPIHeaderStrip from "./components/dashboard/KPIHeaderStrip.jsx";
import SKUQuadrantChart from "./components/dashboard/SKUQuadrantChart.jsx";
import SKUPerformanceSection from "./components/dashboard/SKUPerformanceSection.jsx";
import ScenarioSelectorSection from "./components/dashboard/ScenarioSelectorSection.jsx";
import ApprovalReviewPanel from "./components/dashboard/ApprovalReviewPanel.jsx";
import Modal from "./components/common/Modal.jsx";
import {
  getKPIs,
  getScenario,
  submitAssortmentDecision,
} from "./services/api.js";

export default function App() {
  const [kpis, setKPIs] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState("balanced");
  const [scenariosData, setScenariosData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search, filter, sort states for SKU table
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Interactive selection state
  const [selectedSkuUpc, setSelectedSkuUpc] = useState(null);

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch KPIs and all scenarios on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const kpiData = await getKPIs();
        setKPIs(kpiData);

        // Fetch all three scenarios to populate selector cards
        const [cons, bal, agg] = await Promise.all([
          getScenario("conservative").catch((err) => {
            console.error("Error fetching conservative scenario:", err);
            return {};
          }),
          getScenario("balanced").catch((err) => {
            console.error("Error fetching balanced scenario:", err);
            return {};
          }),
          getScenario("aggressive").catch((err) => {
            console.error("Error fetching aggressive scenario:", err);
            return {};
          }),
        ]);

        setScenariosData({
          conservative: cons || {},
          balanced: bal || {},
          aggressive: agg || {},
        });

        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(
          "Failed to load dashboard data. Please ensure the backend server is running.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch selected scenario when search/filter/sort changes (if backend supports it)
  useEffect(() => {
    const fetchSelectedScenario = async () => {
      try {
        const params = {};
        if (search) params.search = search;
        if (statusFilter) params.status_filter = statusFilter;
        if (sortBy) {
          params.sort_by = sortBy;
          params.sort_order = sortOrder;
        }

        const data = await getScenario(selectedScenario, params);
        setScenariosData((prev) => ({
          ...prev,
          [selectedScenario]: data || {},
        }));
      } catch (err) {
        console.error(`Error fetching scenario ${selectedScenario}:`, err);
      }
    };

    if (kpis) {
      // Only fetch if initial load is complete
      fetchSelectedScenario();
    }
  }, [selectedScenario, search, statusFilter, sortBy, sortOrder]);

  const handleSelectSKU = (sku) => {
    setSelectedSkuUpc(sku.upc);
  };

  const handleSubmit = async () => {
    const currentScenarioData = scenariosData[selectedScenario];
    if (!currentScenarioData) return;

    try {
      setIsSubmitting(true);

      // Map changes payload to match backend expectations
      const changesPayload = (currentScenarioData.skus || []).map((sku) => ({
        upc: sku.upc,
        action: sku.status,
      }));

      const payload = {
        scenario_applied: selectedScenario,
        changes: changesPayload,
      };

      const response = await submitAssortmentDecision(payload);
      setConfirmationData(response);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error submitting assortment decision:", err);
      alert("Failed to submit assortment changes. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-secondary font-body-md text-body-md">
            Loading Cluster Assortment Advisor...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest p-4">
        <div className="bg-surface border border-error-container rounded-xl p-6 max-w-md w-full text-center space-y-4 shadow-lg">
          <span className="material-symbols-outlined text-error text-5xl filled-icon">
            error
          </span>
          <h2 className="text-headline-sm font-headline-sm text-on-surface">
            Connection Error
          </h2>
          <p className="text-secondary font-body-md text-body-md">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-container text-on-primary-fixed font-bold px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const currentScenarioData = scenariosData[selectedScenario];

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface font-sans antialiased">
      <TopNavBar />

      {/* SideNavBar (Hidden on Mobile) */}
      <nav className="hidden md:flex fixed left-0 top-nav-height h-[calc(100vh-nav-height)] w-64 flex-col z-40 bg-surface-container-low border-r border-outline-variant pt-4">
        <div className="px-4 pb-4 border-b border-outline-variant mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary-container w-8 h-8 rounded flex items-center justify-center font-bold text-sm text-on-primary-container">
              DG
            </div>
            <div>
              <div className="font-headline-sm text-headline-sm font-bold text-on-surface text-sm">
                Dollar General
              </div>
              <div className="font-body-sm text-body-sm text-secondary">
                Category Management
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-2">
          <a
            className="bg-primary-container text-on-primary-container font-bold rounded-full mx-2 flex items-center gap-3 px-4 py-3 mb-1"
            href="#"
          >
            <span className="material-symbols-outlined filled-icon text-lg">
              dashboard
            </span>
            <span className="font-label-md text-label-md">Dashboard</span>
          </a>
          <a
            className="text-on-surface-variant hover:bg-surface-container-high mx-2 flex items-center gap-3 px-4 py-3 mb-1 rounded-full transition-all"
            href="#"
          >
            <span className="material-symbols-outlined text-lg">layers</span>
            <span className="font-label-md text-label-md">Scenarios</span>
          </a>
          <a
            className="text-on-surface-variant hover:bg-surface-container-high mx-2 flex items-center gap-3 px-4 py-3 mb-1 rounded-full transition-all"
            href="#"
          >
            <span className="material-symbols-outlined text-lg">
              inventory_2
            </span>
            <span className="font-label-md text-label-md">Inventory</span>
          </a>
          <a
            className="text-on-surface-variant hover:bg-surface-container-high mx-2 flex items-center gap-3 px-4 py-3 mb-1 rounded-full transition-all"
            href="#"
          >
            <span className="material-symbols-outlined text-lg">
              fact_check
            </span>
            <span className="font-label-md text-label-md">Compliance</span>
          </a>
          <a
            className="text-on-surface-variant hover:bg-surface-container-high mx-2 flex items-center gap-3 px-4 py-3 mb-1 rounded-full transition-all"
            href="#"
          >
            <span className="material-symbols-outlined text-lg">history</span>
            <span className="font-label-md text-label-md">History</span>
          </a>
        </div>
        <div className="p-4 border-t border-outline-variant flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !currentScenarioData?.guardrails?.private_brand_passed ||
              !currentScenarioData?.guardrails?.aisle_layout_score_passed
            }
            className="w-full max-w-xs bg-primary-container text-on-primary-container font-bold py-2 px-4 rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Changes
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-[calc(64px+2rem)] md:pl-[calc(256px+2rem)] px-margin-mobile md:pr-margin-desktop pb-margin-desktop min-h-screen">
        <div className="max-w-container-max mx-auto space-y-6">
          {/* Row 1: KPI Cards */}
          <KPIHeaderStrip kpis={kpis} />

          {/* Row 2: Quadrant Chart */}
          <SKUQuadrantChart
            skus={currentScenarioData?.skus ?? []}
            onSelectSKU={handleSelectSKU}
            selectedSkuUpc={selectedSkuUpc}
          />

          {/* Row 3: Table & Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 8-cols: Table */}
            <SKUPerformanceSection
              skus={currentScenarioData?.skus ?? []}
              search={search}
              setSearch={setSearch}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              selectedSkuUpc={selectedSkuUpc}
              onSelectSKU={handleSelectSKU}
            />

            {/* Right 4-cols: Actions & Summaries */}
            <div className="lg:col-span-4 space-y-6">
              {/* Scenario Selector */}
              <ScenarioSelectorSection
                selectedScenario={selectedScenario}
                setSelectedScenario={setSelectedScenario}
                scenariosData={scenariosData}
              />

              {/* Approval Review Panel */}
              <ApprovalReviewPanel
                scenarioData={currentScenarioData}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Inline Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Assortment Submission Confirmed"
      >
        {confirmationData && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-emerald-50 text-emerald-800 p-3 rounded-lg border border-emerald-200">
              <span className="material-symbols-outlined text-emerald-600 filled-icon text-2xl">
                check_circle
              </span>
              <div>
                <div className="font-label-md text-label-md font-bold">
                  Assortment Plan Submitted Successfully
                </div>
                <div className="font-body-sm text-body-sm text-secondary">
                  Audit trail has been logged.
                </div>
              </div>
            </div>

            <div className="border border-outline-variant rounded-lg p-3 space-y-2 bg-surface-container-low">
              <div className="flex justify-between font-body-sm text-body-sm">
                <span className="text-secondary">Confirmation ID:</span>
                <span className="font-bold text-on-surface">
                  {confirmationData.confirmation_id}
                </span>
              </div>
              <div className="flex justify-between font-body-sm text-body-sm">
                <span className="text-secondary">Scenario Applied:</span>
                <span className="font-bold text-on-surface uppercase">
                  {confirmationData.scenario_applied}
                </span>
              </div>
              <div className="flex justify-between font-body-sm text-body-sm">
                <span className="text-secondary">Submitted By:</span>
                <span className="font-bold text-on-surface">
                  {confirmationData.user}
                </span>
              </div>
              <div className="flex justify-between font-body-sm text-body-sm">
                <span className="text-secondary">Timestamp:</span>
                <span className="font-bold text-on-surface">
                  {new Date(confirmationData.timestamp).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="border border-outline-variant rounded-lg p-3 space-y-2">
              <div className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mb-1">
                Summary of Changes
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-emerald-50 p-2 rounded border border-emerald-200">
                  <div className="font-label-sm text-[10px] text-secondary uppercase">
                    Added
                  </div>
                  <div className="font-headline-sm text-headline-sm text-emerald-600 font-bold">
                    {confirmationData.summary?.added ?? 0}
                  </div>
                </div>
                <div className="bg-rose-50 p-2 rounded border border-rose-200">
                  <div className="font-label-sm text-[10px] text-secondary uppercase">
                    Removed
                  </div>
                  <div className="font-headline-sm text-headline-sm text-rose-600 font-bold">
                    {confirmationData.summary?.removed ?? 0}
                  </div>
                </div>
                <div className="bg-amber-50 p-2 rounded border border-amber-200">
                  <div className="font-label-sm text-[10px] text-secondary uppercase">
                    Swapped
                  </div>
                  <div className="font-headline-sm text-headline-sm text-amber-600 font-bold">
                    {confirmationData.summary?.swapped ?? 0}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-primary-container text-on-primary-fixed font-bold px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
