import React, { useState, useEffect } from "react";
import { getKpis, getSkus, getScenario, submitApproval } from "../services/api";
import KpiHeaderStrip from "../components/dashboard/KpiHeaderStrip";
import SkuPerformanceSection from "../components/dashboard/SkuPerformanceSection";
import ScenarioSelector from "../components/dashboard/ScenarioSelector";
import ApprovalReviewPanel from "../components/dashboard/ApprovalReviewPanel";

export default function DashboardPage() {
  const [kpis, setKpis] = useState(null);
  const [skus, setSkus] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState("Balanced");
  const [scenarioData, setScenarioData] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);

  const [loadingKpis, setLoadingKpis] = useState(true);
  const [loadingSkus, setLoadingSkus] = useState(true);
  const [loadingScenario, setLoadingScenario] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    fetchKpis();
  }, []);

  useEffect(() => {
    fetchSkus();
  }, [search, sortBy, sortOrder]);

  useEffect(() => {
    fetchScenario(selectedScenario);
  }, [selectedScenario]);

  const fetchKpis = async () => {
    try {
      setLoadingKpis(true);
      const data = await getKpis();
      setKpis(data);
    } catch (error) {
      console.error("Error fetching KPIs:", error);
    } finally {
      setLoadingKpis(false);
    }
  };

  const fetchSkus = async () => {
    try {
      setLoadingSkus(true);
      const params = {};
      if (search) params.search = search;
      if (sortBy) params.sort_by = sortBy;
      if (sortOrder) params.sort_order = sortOrder;
      const data = await getSkus(params);
      setSkus(data);
    } catch (error) {
      console.error("Error fetching SKUs:", error);
    } finally {
      setLoadingSkus(false);
    }
  };

  const fetchScenario = async (scenarioName) => {
    try {
      setLoadingScenario(true);
      const data = await getScenario(scenarioName);
      setScenarioData(data);
    } catch (error) {
      console.error("Error fetching scenario:", error);
    } finally {
      setLoadingScenario(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const result = await submitApproval(selectedScenario, "Category Manager");
      setSubmissionResult(result);
    } catch (error) {
      console.error("Error submitting approval:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-background text-on-surface min-h-screen">
      {/* TopNavBar */}
      <nav className="fixed top-0 left-0 w-full h-[64px] z-50 flex justify-between items-center px-lg bg-background border-b border-outline-variant font-body-md text-body-md">
        <div className="flex items-center gap-6">
          <div className="font-headline-md text-headline-md font-bold text-primary-container flex items-center gap-2">
            <span
              className="material-symbols-outlined"
              style={{ variationSettings: "'FILL' 1" }}
            >
              {"storefront"}
            </span>
            {"DG Cluster Assortment Advisor"}
          </div>
          {/* Filters */}
          <div className="hidden md:flex items-center gap-4 ml-8">
            <div className="relative group cursor-pointer border border-outline-variant rounded-md px-3 py-1.5 flex items-center gap-2 hover:bg-surface-container transition-colors">
              <span className="text-on-surface text-sm">
                {"Small Town Value Cluster (Active)"}
              </span>
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                {"arrow_drop_down"}
              </span>
            </div>
            <div className="relative group cursor-pointer border border-outline-variant rounded-md px-3 py-1.5 flex items-center gap-2 hover:bg-surface-container transition-colors">
              <span className="text-on-surface text-sm">{"Snacks"}</span>
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                {"arrow_drop_down"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="text-primary-container font-bold px-4 py-2 hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {"Approve Changes"}
          </button>
          <div className="flex gap-2">
            <button className="p-2 text-on-surface-variant hover:text-primary-container transition-colors relative">
              <span className="material-symbols-outlined">
                {"notifications"}
              </span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full"></span>
            </button>
            <button className="p-2 text-on-surface-variant hover:text-primary-container transition-colors">
              <span className="material-symbols-outlined">{"settings"}</span>
            </button>
          </div>
          <img
            className="w-8 h-8 rounded-full border border-outline-variant object-cover ml-2"
            alt="Category Manager"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwpek0xiAZoG3tcKrLjjlMvrGVcJCmXFV6ZjBN5XFg57hAVjw6qz6wcvRSNJqHHS9vwb-daMN5eg7YGTS7ZGWLldNoVLkPXv60B6yImKHG0imi9LJuUW-1quscvqb8_MIr2MP9OB19csS5iSWPHbMDW6rVEKghzq4mGkfEjC6PtAZjstEhwE2OWFWNU8WgCKbW4aHvnhj7Ts6h8hm68mMWUvV47pq2DhS1M_NkaPHDSLTZGgp8wo0i6Q6l0tzBLWbJIm5kIhWh20hI"
          />
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-[88px] px-lg pb-xl max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-margin">
        {/* Success Banner */}
        {submissionResult && (
          <div className="col-span-1 md:col-span-12 bg-[#10B981] rounded-lg p-md flex items-start sm:items-center gap-3 text-white mb-2 shadow-lg shadow-[#10B981]/20">
            <span
              className="material-symbols-outlined"
              style={{ variationSettings: "'FILL' 1" }}
            >
              {"check_circle"}
            </span>
            <div className="font-body-md text-sm sm:text-base">
              <strong className="font-bold">{"Success!"}</strong>{" "}
              {"Assortment changes for Small Town Value Cluster submitted on "}
              {
                new Date(submissionResult.submission_timestamp)
                  .toISOString()
                  .split("T")[0]
              }
              {" by "}
              {submissionResult.submitted_by}
              {"."}
              <span className="block sm:inline opacity-80 mt-1 sm:mt-0 sm:ml-2 font-data-mono text-xs">
                {"Audit Trail ID: "}
                {submissionResult.audit_trail_id}
              </span>
            </div>
          </div>
        )}

        {/* Row 1: KPIs */}
        <KpiHeaderStrip kpis={kpis} loading={loadingKpis} />

        {/* Row 2: Main Grid */}
        <SkuPerformanceSection
          skus={skus}
          loading={loadingSkus}
          onSearchChange={setSearch}
          onSortChange={(col, order) => {
            setSortBy(col);
            setSortOrder(order);
          }}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />

        {/* Right Column: Scenario & Approval Panel */}
        <div className="col-span-1 md:col-span-4 flex flex-col gap-margin">
          <ScenarioSelector
            selectedScenario={selectedScenario}
            onScenarioChange={setSelectedScenario}
          />
          <ApprovalReviewPanel
            scenarioData={scenarioData}
            onSubmit={handleSubmit}
            submitting={submitting}
            loading={loadingScenario}
          />
        </div>
      </main>
    </div>
  );
}
