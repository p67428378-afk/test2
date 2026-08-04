import React from "react";
import {
  AssortmentProvider,
  useAssortment,
} from "./context/AssortmentContext.jsx";
import Header from "./components/layout/Header.jsx";
import Sidebar from "./components/layout/Sidebar.jsx";
import ConfirmationBanner from "./components/assortment/ConfirmationBanner.jsx";
import KPIHeaderStrip from "./components/assortment/KPIHeaderStrip.jsx";
import ScenarioSelector from "./components/assortment/ScenarioSelector.jsx";
import ApprovalReviewPanel from "./components/assortment/ApprovalReviewPanel.jsx";
import SKUPerformanceTable from "./components/assortment/SKUPerformanceTable.jsx";

function MainCanvas() {
  const {
    activeTopTab,
    activeSidebarTab,
    guardrailsList,
    activeScenario,
    submissionResult,
  } = useAssortment();

  // Render view based on Topnav Tab or Sidebar Tab selection
  const renderTabContent = () => {
    // 1. Guardrail Rules Topnav View
    if (activeTopTab === "guardrail_rules") {
      return (
        <div className="space-y-6">
          <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500">
                security
              </span>
              Category Guardrail Rules & Policy Constraints
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Mandatory and advisory thresholds governing assortment model
              recommendations for Small Town Value Cluster.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0F172A] text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-[#334155]">
                    <th className="p-3 pl-4">Rule ID</th>
                    <th className="p-3">Rule Name</th>
                    <th className="p-3">Metric Key</th>
                    <th className="p-3 text-center">Operator</th>
                    <th className="p-3 text-right">Threshold</th>
                    <th className="p-3 text-center">Type</th>
                    <th className="p-3 text-center pr-4">Evaluation Status</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-slate-200 divide-y divide-[#334155]">
                  {(guardrailsList || []).map((rule) => (
                    <tr
                      key={rule.id}
                      className="hover:bg-[#334155] transition-colors"
                    >
                      <td className="p-3 pl-4 font-mono text-amber-400 font-semibold">
                        {rule.id}
                      </td>
                      <td className="p-3 font-semibold text-white">
                        {rule.rule_name}
                      </td>
                      <td className="p-3 font-mono text-slate-300">
                        {rule.metric_key}
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-amber-400">
                        {rule.operator}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-white">
                        {rule.threshold_value}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${rule.is_mandatory ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-slate-700 text-slate-300"}`}
                        >
                          {rule.is_mandatory ? "MANDATORY" : "ADVISORY"}
                        </span>
                      </td>
                      <td className="p-3 text-center pr-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[11px]">
                          <span className="material-symbols-outlined text-sm">
                            verified
                          </span>
                          PASSED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    // 2. Scenario Modeler Topnav View
    if (activeTopTab === "scenario_modeler") {
      return (
        <div className="space-y-6">
          <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500">
                model_training
              </span>
              Scenario Modeler & Impact Analyzer
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Compare conservative, balanced, and aggressive recommendation
              models against Small Town Value cluster benchmarks.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-8">
              <ScenarioSelector />
            </div>
            <div className="xl:col-span-4">
              <ApprovalReviewPanel />
            </div>
          </div>
        </div>
      );
    }

    // 3. Approval Queue Topnav View
    if (activeTopTab === "approval_queue") {
      return (
        <div className="space-y-6">
          <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500">
                approval
              </span>
              Category Assortment Approval Queue
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Pending and logged scenario submissions queued for planogram
              generation and store deployment.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0F172A] text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-[#334155]">
                    <th className="p-3 pl-4">Audit Ref ID</th>
                    <th className="p-3">Scenario</th>
                    <th className="p-3">Cluster</th>
                    <th className="p-3 text-right">SKUs Modified</th>
                    <th className="p-3">Submitted By</th>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3 text-center pr-4">Lock Status</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-slate-200 divide-y divide-[#334155]">
                  <tr className="hover:bg-[#334155] transition-colors">
                    <td className="p-3 pl-4 font-mono font-bold text-emerald-400">
                      {submissionResult?.audit_ref_id || "AUD-994821"}
                    </td>
                    <td className="p-3 font-semibold text-white">
                      {submissionResult?.scenario_name ||
                        activeScenario?.name ||
                        "Balanced"}
                    </td>
                    <td className="p-3 text-slate-300">STV-CLUSTER-01</td>
                    <td className="p-3 text-right font-mono font-bold text-white">
                      {submissionResult?.skus_modified_count || 17} SKUs
                    </td>
                    <td className="p-3 text-slate-300">USR-CM-882</td>
                    <td className="p-3 text-slate-400 font-mono">
                      {submissionResult?.timestamp_utc ||
                        "2026-05-18 14:32 UTC"}
                    </td>
                    <td className="p-3 text-center pr-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[11px]">
                        <span className="material-symbols-outlined text-sm">
                          lock
                        </span>
                        APPROVED & LOCKED
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    // 4. Sidebar Tabs (when activeTopTab is "assortment_advisor")
    if (activeSidebarTab === "overview") {
      return (
        <div className="space-y-6">
          <KPIHeaderStrip />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500">
                  dashboard
                </span>
                Cluster Assortment Health Overview
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Key performance metrics for Small Town Value Cluster Snacks
                category.
              </p>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-[#334155]">
                  <span className="text-slate-400">Total Active SKUs</span>
                  <span className="font-mono font-bold text-white">
                    88 SKUs
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#334155]">
                  <span className="text-slate-400">
                    Private Brand Penetration
                  </span>
                  <span className="font-mono font-bold text-emerald-400">
                    28.5% (+1.5% target)
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Weekly Sales Volume</span>
                  <span className="font-mono font-bold text-white">
                    $142.50 / Lin Ft
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500">
                  insights
                </span>
                Strategic Recommendations
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Model-driven recommendations for maximum profit margin.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
                <li>
                  Expand Clover Valley private brand facings in Salty Snacks.
                </li>
                <li>
                  Reduce low-velocity tertiary pretzel SKUs (REDUCE badge).
                </li>
                <li>
                  Swap slow-moving discontinued puffed snacks for high-margin
                  trail mix.
                </li>
              </ul>
            </div>
          </div>
          <SKUPerformanceTable />
        </div>
      );
    }

    if (activeSidebarTab === "category_strategy") {
      return (
        <div className="space-y-6">
          <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500">
                strategy
              </span>
              Snacks Category Strategy & Growth Pillars
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Strategic priorities and space allocation parameters for Small
              Town Value Cluster.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#0F172A] p-4 rounded border border-[#334155]">
                <h4 className="text-amber-500 font-bold text-sm mb-1">
                  Pillar 1: Private Brand Expansion
                </h4>
                <p className="text-xs text-slate-300">
                  Target 30%+ Private Brand mix in Salty Snacks to drive margin.
                </p>
              </div>
              <div className="bg-[#0F172A] p-4 rounded border border-[#334155]">
                <h4 className="text-amber-500 font-bold text-sm mb-1">
                  Pillar 2: Core Brand Protection
                </h4>
                <p className="text-xs text-slate-300">
                  Protect top national brand SKUs (Lay's, Doritos) facing
                  allocations.
                </p>
              </div>
              <div className="bg-[#0F172A] p-4 rounded border border-[#334155]">
                <h4 className="text-amber-500 font-bold text-sm mb-1">
                  Pillar 3: Churn Optimization
                </h4>
                <p className="text-xs text-slate-300">
                  Systematically swap bottom 5% velocity SKUs each quarter.
                </p>
              </div>
            </div>
          </div>
          <SKUPerformanceTable />
        </div>
      );
    }

    if (activeSidebarTab === "store_clusters") {
      return (
        <div className="space-y-6">
          <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500">
                group_work
              </span>
              Store Cluster Configuration (STV-CLUSTER-01)
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Cluster profile and store demographics for Small Town Value
              segment.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-[#0F172A] p-4 rounded border border-[#334155]">
                <span className="text-xs text-slate-400 block">
                  Total Stores
                </span>
                <span className="text-xl font-bold text-white">
                  1,240 Stores
                </span>
              </div>
              <div className="bg-[#0F172A] p-4 rounded border border-[#334155]">
                <span className="text-xs text-slate-400 block">
                  Avg Linear Ft / Store
                </span>
                <span className="text-xl font-bold text-white">
                  24.5 Linear Ft
                </span>
              </div>
              <div className="bg-[#0F172A] p-4 rounded border border-[#334155]">
                <span className="text-xs text-slate-400 block">
                  Category Revenue
                </span>
                <span className="text-xl font-bold text-emerald-400">
                  $4.2M / Wk
                </span>
              </div>
              <div className="bg-[#0F172A] p-4 rounded border border-[#334155]">
                <span className="text-xs text-slate-400 block">
                  Primary Demographics
                </span>
                <span className="text-xl font-bold text-amber-400">
                  Rural / Small Town
                </span>
              </div>
            </div>
          </div>
          <SKUPerformanceTable />
        </div>
      );
    }

    if (activeSidebarTab === "audit_history") {
      return (
        <div className="space-y-6">
          <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500">
                history
              </span>
              Assortment Audit History & Change Log
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Chronological log of scenario submissions and locked assortment
              decisions.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0F172A] text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-[#334155]">
                    <th className="p-3 pl-4">Audit Ref</th>
                    <th className="p-3">Scenario</th>
                    <th className="p-3">User ID</th>
                    <th className="p-3 text-right">SKUs Changed</th>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3 text-center pr-4">Status</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-slate-200 divide-y divide-[#334155]">
                  <tr className="hover:bg-[#334155] transition-colors">
                    <td className="p-3 pl-4 font-mono font-bold text-emerald-400">
                      AUD-994821
                    </td>
                    <td className="p-3 font-semibold text-white">Balanced</td>
                    <td className="p-3 text-slate-300">USR-CM-882</td>
                    <td className="p-3 text-right font-mono font-bold text-white">
                      17
                    </td>
                    <td className="p-3 text-slate-400 font-mono">
                      2026-05-18 14:32 UTC
                    </td>
                    <td className="p-3 text-center pr-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[11px]">
                        APPROVED_AND_LOGGED
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    // Default: SKU Performance view
    return (
      <div className="space-y-6">
        <KPIHeaderStrip />
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8">
            <ScenarioSelector />
          </div>
          <div className="xl:col-span-4">
            <ApprovalReviewPanel />
          </div>
        </div>
        <SKUPerformanceTable />
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0F172A] text-[#dae2fd]">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Header />
        <main className="flex-1 md:ml-[250px] p-6 pt-20 overflow-y-auto w-full">
          <div className="max-w-[1650px] mx-auto space-y-6 pb-24">
            <ConfirmationBanner />
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AssortmentProvider>
      <MainCanvas />
    </AssortmentProvider>
  );
}
