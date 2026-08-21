import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProfilePage from "./pages/ProfilePage.jsx";
import DiscoveryPage from "./pages/DiscoveryPage.jsx";
import ExchangesPage from "./pages/ExchangesPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/profile" replace />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/discovery" element={<DiscoveryPage />} />
        <Route path="/exchanges" element={<ExchangesPage />} />
        <Route path="*" element={<Navigate to="/profile" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
