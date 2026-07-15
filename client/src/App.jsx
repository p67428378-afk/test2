import React, { useState } from "react";
import LoanProductsPage from "./pages/LoanProductsPage";
import LoanApplicationPage from "./pages/LoanApplicationPage";
import MyApplicationsPage from "./pages/MyApplicationsPage";
import OfficerPortalPage from "./pages/OfficerPortalPage";
import {
  Landmark,
  User,
  ShieldAlert,
  FileText,
  HelpCircle,
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("products"); // 'products', 'tracking', 'officer'
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Mock Roles / Users for testing
  const [currentUser, setCurrentUser] = useState({
    id: "00000000-0000-0000-0000-000000000001",
    name: "Test Customer",
    email: "test@example.com",
    role: "customer",
  });

  const handleApply = (product) => {
    setSelectedProduct(product);
    setActiveTab("apply");
  };

  const handleCancelApplication = () => {
    setSelectedProduct(null);
    setActiveTab("products");
  };

  const handleNavigateToTracking = () => {
    setSelectedProduct(null);
    setActiveTab("tracking");
  };

  const toggleRole = () => {
    if (currentUser.role === "customer") {
      setCurrentUser({
        id: "00000000-0000-0000-0000-000000000002",
        name: "Test Officer",
        email: "officer@example.com",
        role: "loan officer",
      });
      setActiveTab("officer");
    } else {
      setCurrentUser({
        id: "00000000-0000-0000-0000-000000000001",
        name: "Test Customer",
        email: "test@example.com",
        role: "customer",
      });
      setActiveTab("products");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setActiveTab("products")}
            >
              <Landmark className="w-8 h-8 text-indigo-600" />
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                Apex Retail Bank
              </span>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex space-x-1">
              <button
                onClick={() => setActiveTab("products")}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "products" || activeTab === "apply"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Loan Products
              </button>
              {currentUser.role === "customer" && (
                <button
                  onClick={() => setActiveTab("tracking")}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "tracking"
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  My Applications
                </button>
              )}
              {currentUser.role === "loan officer" && (
                <button
                  onClick={() => setActiveTab("officer")}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "officer"
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  Officer Portal
                </button>
              )}
            </nav>

            {/* Role Switcher & User Info */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-slate-900">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-slate-500 capitalize">
                  {currentUser.role}
                </p>
              </div>
              <button
                onClick={toggleRole}
                className="inline-flex items-center justify-center px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors gap-1"
              >
                {currentUser.role === "customer" ? (
                  <>
                    <ShieldAlert className="w-3.5 h-3.5 text-indigo-600" />
                    Switch to Officer
                  </>
                ) : (
                  <>
                    <User className="w-3.5 h-3.5 text-indigo-600" />
                    Switch to Customer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Banner */}
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800">
            <p className="font-bold">Interactive Demo Mode</p>
            <p className="mt-0.5">
              Use the role switcher in the top right to toggle between a{" "}
              <strong>Customer</strong> (to apply and track loans) and a{" "}
              <strong>Loan Officer</strong> (to evaluate and approve/reject
              applications).
            </p>
            <p className="mt-1">
              Test Account:{" "}
              <strong className="font-mono">test@example.com</strong> /{" "}
              <strong className="font-mono">testpassword</strong>
            </p>
          </div>
        </div>

        {activeTab === "products" && <LoanProductsPage onApply={handleApply} />}

        {activeTab === "apply" && selectedProduct && (
          <LoanApplicationPage
            product={selectedProduct}
            customerId={currentUser.id}
            onCancel={handleCancelApplication}
            onNavigateToTracking={handleNavigateToTracking}
          />
        )}

        {activeTab === "tracking" && (
          <MyApplicationsPage
            customerId={currentUser.id}
            userEmail={currentUser.email}
          />
        )}

        {activeTab === "officer" && (
          <OfficerPortalPage officerEmail={currentUser.email} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} Apex Retail Bank. All rights
          reserved. Secure online banking portal.
        </div>
      </footer>
    </div>
  );
}
