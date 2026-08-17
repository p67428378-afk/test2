import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserDashboardPage from "./pages/UserDashboardPage";
import ReportItemPage from "./pages/ReportItemPage";
import AdminVerificationPage from "./pages/AdminVerificationPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserDashboardPage />} />
        <Route path="/report" element={<ReportItemPage />} />
        <Route path="/admin" element={<AdminVerificationPage />} />
      </Routes>
    </Router>
  );
}
