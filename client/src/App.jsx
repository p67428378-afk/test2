import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import GroupsOverviewPage from "./pages/GroupsOverviewPage";
import GroupDetailPage from "./pages/GroupDetailPage";
import ExpenseEntryPage from "./pages/ExpenseEntryPage";
import SettlementsPage from "./pages/SettlementsPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F7FAFC] text-[#171C29] flex flex-col font-sans">
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<GroupsOverviewPage />} />
            <Route path="/groups/:groupId" element={<GroupDetailPage />} />
            <Route path="/expenses/new" element={<ExpenseEntryPage />} />
            <Route path="/settlements" element={<SettlementsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#E3E8F0] bg-white py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#707A8C]">
            <p>
              © {new Date().getFullYear()} BillSplitter. Transparent group
              expense splitting and debt settlement.
            </p>
            <div className="flex items-center gap-4">
              <span>FastAPI Backend</span>
              <span>•</span>
              <span>React 18 &amp; Tailwind CSS</span>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
