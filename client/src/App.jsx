import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import DashboardPage from "./pages/DashboardPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ClaimsPage from "./pages/ClaimsPage";

export default function App() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-[#f7fafc] flex flex-col font-sans antialiased text-[#171c29]">
        <Navbar onOpenRegisterModal={() => setIsRegisterModalOpen(true)} />

        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <DashboardPage
                  isRegisterModalOpen={isRegisterModalOpen}
                  onToggleRegisterModal={() =>
                    setIsRegisterModalOpen(!isRegisterModalOpen)
                  }
                />
              }
            />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/claims" element={<ClaimsPage />} />
          </Routes>
        </main>

        <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-500">
          <p>
            © 2026 Warranty Tracker System — Product Registration, Expiry
            Milestones & Service Claims Audit Log.
          </p>
        </footer>
      </div>
    </Router>
  );
}
