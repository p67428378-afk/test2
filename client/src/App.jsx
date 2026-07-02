import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import RechargeDashboardPage from "./pages/RechargeDashboardPage";
import RechargeFormPage from "./pages/RechargeFormPage";
import RechargeConfirmationPage from "./pages/RechargeConfirmationPage";
import { ShieldCheck, Landmark } from "lucide-react";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Navigation Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-600 text-white rounded-lg">
                <Landmark className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-black text-gray-900 tracking-tight">
                  RETAIL BANK
                </span>
                <span className="text-xs block text-primary-600 font-bold -mt-1 tracking-wider uppercase">
                  Net Banking Portal
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-2 text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100">
                <ShieldCheck className="w-4 h-4" />
                <span>RBI BBPS Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">
                  U
                </div>
                <span className="hidden sm:inline">Welcome, User</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/recharge" replace />} />
            <Route path="/recharge" element={<RechargeDashboardPage />} />
            <Route path="/recharge/new" element={<RechargeFormPage />} />
            <Route
              path="/recharge/confirm"
              element={<RechargeConfirmationPage />}
            />
            <Route path="*" element={<Navigate to="/recharge" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <p>© 2026 Retail Bank Ltd. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary-600 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary-600 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-primary-600 transition-colors">
                BBPS Guidelines
              </a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
