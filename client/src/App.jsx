import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/common/Navbar";
import DashboardPage from "./pages/DashboardPage";
import ResumeEditorPage from "./pages/ResumeEditorPage";
import ExportPdfPage from "./pages/ExportPdfPage";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#f7fafc] flex flex-col font-sans antialiased text-[#171c29]">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/editor" element={<ResumeEditorPage />} />
            <Route path="/editor/:id" element={<ResumeEditorPage />} />
            <Route path="/export/:id" element={<ExportPdfPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-[#e3e8f0] py-6 text-center text-xs text-gray-500 no-print">
          <p>
            © {new Date().getFullYear()} Quick Resume Maker. All rights
            reserved.
          </p>
        </footer>
      </div>
    </Router>
  );
}
