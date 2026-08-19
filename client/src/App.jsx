import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import DashboardPage from "./pages/DashboardPage";
import RecordTaskPage from "./pages/RecordTaskPage";
import CostAnalyticsPage from "./pages/CostAnalyticsPage";
import TechniciansPage from "./pages/TechniciansPage";

export default function App() {
  return (
    <div className="min-h-screen bg-[#f7fafc] flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/tasks/new" element={<RecordTaskPage />} />
          <Route path="/analytics" element={<CostAnalyticsPage />} />
          <Route path="/technicians" element={<TechniciansPage />} />
          <Route path="*" element={<DashboardPage />} />
        </Routes>
      </main>
      <footer className="bg-white border-t border-[#e3e8f0] py-4 text-center text-xs text-[#707a8c]">
        ⚡ Electricity Board Maintenance Tracker &copy;{" "}
        {new Date().getFullYear()}
      </footer>
    </div>
  );
}
