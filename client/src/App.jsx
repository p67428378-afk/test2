import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import SpotDetailPage from "./pages/SpotDetailPage";
import MonitorPage from "./pages/MonitorPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/spots/:id text-slate-100" element={<SpotDetailPage />} />
        <Route path="/spots/:id" element={<SpotDetailPage />} />
        <Route path="/rates" element={<SearchPage />} />
        <Route path="/monitor" element={<MonitorPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
