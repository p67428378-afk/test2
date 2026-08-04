import React from "react";
import { AssortmentProvider } from "./context/AssortmentContext";
import HeaderBar from "./components/HeaderBar";
import KPIHeaderStrip from "./components/KPIHeaderStrip";
import SKUPerformanceTable from "./components/SKUPerformanceTable";
import ScenarioSelector from "./components/ScenarioSelector";
import ApprovalReviewPanel from "./components/ApprovalReviewPanel";
import ConfirmationBanner from "./components/ConfirmationBanner";

function AppContent() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-[#dae2fd] flex flex-col font-sans">
      <HeaderBar />

      <main className="flex-1 p-6 max-w-[1600px] w-full mx-auto flex flex-col gap-6">
        {/* Inline Submission Confirmation Banner */}
        <ConfirmationBanner />

        {/* Section 1: KPI Header Strip */}
        <KPIHeaderStrip />

        {/* Section 2 & 3: Scenario Selector & Approval Review Panel */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8">
            <ScenarioSelector />
          </div>
          <div className="xl:col-span-4">
            <ApprovalReviewPanel />
          </div>
        </div>

        {/* Section 4: SKU Performance Table */}
        <SKUPerformanceTable />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AssortmentProvider>
      <AppContent />
    </AssortmentProvider>
  );
}
