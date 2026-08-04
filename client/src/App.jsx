import React from "react";
import { AssortmentProvider } from "./context/AssortmentContext.jsx";
import HeaderBar from "./components/HeaderBar.jsx";
import ConfirmationBanner from "./components/ConfirmationBanner.jsx";
import KPIHeaderStrip from "./components/KPIHeaderStrip.jsx";
import ScenarioSelector from "./components/ScenarioSelector.jsx";
import ApprovalReviewPanel from "./components/ApprovalReviewPanel.jsx";
import SKUPerformanceTable from "./components/SKUPerformanceTable.jsx";

export default function App() {
  return (
    <AssortmentProvider>
      <div className="flex h-screen overflow-hidden bg-[#0F172A] text-[#dae2fd]">
        {/* SideNav Container */}
        <nav
          aria-label="Main Navigation"
          className="w-64 flex-shrink-0 bg-[#131b2e] border-r border-[#534434]/40 flex flex-col h-full py-6 relative z-10 hidden lg:flex"
        >
          {/* Header */}
          <div className="px-6 mb-8">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-sm">
                DG
              </div>
              <span className="font-bold text-lg text-amber-500">
                Inventory Admin
              </span>
            </div>
            <div className="text-slate-400 text-xs">Regional Snacks</div>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 flex flex-col">
            <a
              className="text-slate-400 font-medium px-4 py-3 flex items-center gap-3 hover:bg-[#2d3449] transition-all cursor-pointer text-sm"
              href="#"
            >
              <span
                className="material-symbols-outlined text-lg"
                style={{ fontVariationSettings: "'FILL' 0" }}
              >
                dashboard
              </span>
              <span>Dashboard</span>
            </a>
            <a
              className="text-amber-500 font-bold border-r-4 border-amber-500 bg-amber-500/10 px-4 py-3 flex items-center gap-3 hover:bg-[#2d3449] transition-all cursor-pointer text-sm"
              href="#"
            >
              <span
                className="material-symbols-outlined text-lg"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                inventory_2
              </span>
              <span>SKU Performance</span>
            </a>
            <a
              className="text-slate-400 font-medium px-4 py-3 flex items-center gap-3 hover:bg-[#2d3449] transition-all cursor-pointer text-sm"
              href="#"
            >
              <span
                className="material-symbols-outlined text-lg"
                style={{ fontVariationSettings: "'FILL' 0" }}
              >
                science
              </span>
              <span>Scenarios</span>
            </a>
            <a
              className="text-slate-400 font-medium px-4 py-3 flex items-center gap-3 hover:bg-[#2d3449] transition-all cursor-pointer text-sm"
              href="#"
            >
              <span
                className="material-symbols-outlined text-lg"
                style={{ fontVariationSettings: "'FILL' 0" }}
              >
                hub
              </span>
              <span>Clusters</span>
            </a>
          </div>

          {/* CTA */}
          <div className="px-6 mt-auto">
            <button className="w-full bg-amber-500 text-slate-950 font-bold text-xs py-2 px-4 rounded hover:opacity-90 transition-opacity">
              Generate Report
            </button>
          </div>
        </nav>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          <HeaderBar />

          {/* Scrollable Canvas */}
          <main className="flex-1 overflow-y-auto p-6 bg-[#0F172A] relative">
            <div className="max-w-[1600px] mx-auto flex flex-col gap-6">
              {/* Section 5: Inline Confirmation Banner */}
              <ConfirmationBanner />

              {/* Section 1: KPI Row */}
              <KPIHeaderStrip />

              {/* Section 3 & 4: Scenarios & Review Panel */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div className="xl:col-span-8">
                  <ScenarioSelector />
                </div>
                <div className="xl:col-span-4">
                  <ApprovalReviewPanel />
                </div>
              </div>

              {/* Section 2: SKU Performance Table */}
              <SKUPerformanceTable />
            </div>
          </main>
        </div>
      </div>
    </AssortmentProvider>
  );
}
