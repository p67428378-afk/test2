import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import BoxCatalogPage from "./pages/BoxCatalogPage";
import BoxDetailPage from "./pages/BoxDetailPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BoxCatalogPage />} />
        <Route path="/boxes/:id" element={<BoxDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
