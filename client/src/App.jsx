import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import BrowsePage from "./pages/BrowsePage";
import AdoptionFormPage from "./pages/AdoptionFormPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BrowsePage />} />
        <Route path="/adopt/:petId" element={<AdoptionFormPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
