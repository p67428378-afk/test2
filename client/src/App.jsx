import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import InitiatePaymentPage from "./pages/InitiatePaymentPage.jsx";
import PaymentDetailPage from "./pages/PaymentDetailPage.jsx";

export default function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/initiate" element={<InitiatePaymentPage />} />
          <Route path="/payments/:payment_id" element={<PaymentDetailPage />} />
          <Route path="/history" element={<DashboardPage />} />
          <Route path="/risk-limits" element={<DashboardPage />} />
          <Route path="/settings" element={<DashboardPage />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}
