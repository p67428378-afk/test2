import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import SavedPaymentMethodsPage from "./pages/SavedPaymentMethodsPage.jsx";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        {/* TopNavBar */}
        <header className="bg-slate-900 border-b border-slate-800 h-[64px] flex items-center w-full z-50 sticky top-0">
          <div className="flex justify-between items-center w-full px-margin-desktop max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="font-bold text-xl text-slate-100 hover:text-indigo-400 transition-colors"
              >
                ApexStore
              </Link>
            </div>
            <nav className="flex gap-6 items-center">
              <div className="flex items-center gap-1 text-slate-400">
                <ShieldCheck size={18} className="text-indigo-400" />
                <span className="text-xs font-semibold tracking-wider uppercase">
                  Secure Checkout
                </span>
              </div>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow w-full">
          <Routes>
            <Route path="/" element={<CheckoutPage />} />
            <Route
              path="/saved-payment-methods"
              element={<SavedPaymentMethodsPage />}
            />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 border-t border-slate-800 py-8 mt-auto w-full">
          <div className="flex flex-col md:flex-row justify-between items-center w-full px-margin-desktop max-w-7xl mx-auto gap-4">
            <span className="font-bold text-lg text-slate-100">ApexStore</span>
            <p className="text-xs text-slate-400">
              © 2026 ApexStore. All rights reserved. Secure encrypted checkout.
            </p>
            <div className="flex gap-4">
              <a
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
                href="#"
              >
                Privacy Policy
              </a>
              <a
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
                href="#"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
