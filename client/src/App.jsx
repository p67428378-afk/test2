import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import DashboardPage from "./pages/DashboardPage";
import HivesPage from "./pages/HivesPage";
import HarvestsPage from "./pages/HarvestsPage";
import DiseasesPage from "./pages/DiseasesPage";
import InspectionsPage from "./pages/InspectionsPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#f7fafc] text-[#171c29]">
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/hives" element={<HivesPage />} />
            <Route path="/harvests" element={<HarvestsPage />} />
            <Route path="/diseases" element={<DiseasesPage />} />
            <Route path="/inspections" element={<InspectionsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
