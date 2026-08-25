import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import DashboardPage from "./pages/DashboardPage";
import ExpensesPage from "./pages/ExpensesPage";
import BudgetsPage from "./pages/BudgetsPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#f7fafc] flex flex-col font-sans text-[#171c29]">
        {/* Unified Application Navbar */}
        <Navbar />

        {/* Main Content View */}
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/budgets" element={<BudgetsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <footer className="bg-white border-t border-[#e3e8f0] py-6 mt-12 w-full text-center text-xs text-[#707a8c]">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="font-medium text-[#171c29]">
              ExpenseFlow — Personal & Business Financial Management
            </p>
            <p>
              © {new Date().getFullYear()} ExpenseFlow Inc. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
