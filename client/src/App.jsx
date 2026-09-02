import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import DashboardPage from "./pages/DashboardPage";
import SitesPage from "./pages/SitesPage";
import ArtifactsPage from "./pages/ArtifactsPage";
import Trench3DPage from "./pages/Trench3DPage";
import SyncCenterPage from "./pages/SyncCenterPage";
import CustodyStoragePage from "./pages/CustodyStoragePage";
import MLClassificationPage from "./pages/MLClassificationPage";
import TeamsPage from "./pages/TeamsPage";
import LabAnalysisPage from "./pages/LabAnalysisPage";
import PublicationsPage from "./pages/PublicationsPage";

export default function App() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/sites" element={<SitesPage />} />
          <Route path="/artifacts" element={<ArtifactsPage />} />
          <Route path="/trench-3d" element={<Trench3DPage />} />
          <Route path="/sync-center" element={<SyncCenterPage />} />
          <Route path="/custody-storage" element={<CustodyStoragePage />} />
          <Route path="/ml-classification" element={<MLClassificationPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/lab-analysis" element={<LabAnalysisPage />} />
          <Route path="/publications" element={<PublicationsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="bg-white border-t border-stone-200 py-4 text-center text-xs text-stone-500">
        <p>
          🏛️ ArchExcav — Archaeological Excavation Management System &bull;
          Version 2.0.0
        </p>
      </footer>
    </div>
  );
}
