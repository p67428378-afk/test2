import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import TransactionApprovalPage from "./pages/TransactionApprovalPage";
import ActionSuccessPage from "./pages/ActionSuccessPage";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#0F172A] text-[#dae2fd] font-body-md">
        <Header />
        <Routes>
          <Route
            path="/transactions/:id/verify"
            element={<TransactionApprovalPage />}
          />
          <Route path="/success" element={<ActionSuccessPage />} />
          {/* Fallback route */}
          <Route
            path="*"
            element={
              <Navigate
                to="/transactions/00000000-0000-0000-0000-000000000000/verify?token=invalid"
                replace
              />
            }
          />
        </Routes>
        <Footer referenceId="TXN-98231-A" />
      </div>
    </Router>
  );
}
