import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage.jsx";
import SetupPage from "./pages/SetupPage.jsx";
import ScoringPage from "./pages/ScoringPage.jsx";
import LeaderboardPage from "./pages/LeaderboardPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/setup" element={<SetupPage />} />
        <Route path="/scoring/:sessionId" element={<ScoringPage />} />
        <Route path="/leaderboard/:sessionId" element={<LeaderboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
