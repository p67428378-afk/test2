import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import DashboardPage from "./pages/DashboardPage";
import SubjectsPage from "./pages/SubjectsPage";
import SchedulesPage from "./pages/SchedulesPage";
import AnalyticsPage from "./pages/AnalyticsPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/subjects" element={<SubjectsPage />} />
            <Route path="/schedules" element={<SchedulesPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
