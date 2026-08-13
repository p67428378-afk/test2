import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import PairingsPage from "./pages/PairingsPage";
import StandingsPage from "./pages/StandingsPage";
import CertificateVerifyPage from "./pages/CertificateVerifyPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/pairings" element={<PairingsPage />} />
        <Route path="/standings" element={<StandingsPage />} />
        <Route path="/verify" element={<CertificateVerifyPage />} />
        <Route path="/verify/:uuid" element={<CertificateVerifyPage />} />
      </Routes>
    </Router>
  );
}
