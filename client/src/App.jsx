import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import DashboardPage from "./pages/DashboardPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ServiceRequestsPage from "./pages/ServiceRequestsPage";

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-[#0F172A] text-[#F8FAFC]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <Header title="VoltMonitor - Electricity Monitoring Platform" />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-8">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route
                path="/service-requests"
                element={<ServiceRequestsPage />}
              />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
