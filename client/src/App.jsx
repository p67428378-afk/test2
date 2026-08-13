import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import PaintingGalleryPage from "./pages/PaintingGalleryPage";
import PaintingDetailPage from "./pages/PaintingDetailPage";
import ShoppingCartPage from "./pages/ShoppingCartPage";
import CheckoutPage from "./pages/CheckoutPage";

export default function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<PaintingGalleryPage />} />
          <Route path="/paintings/:id" element={<PaintingDetailPage />} />
          <Route path="/cart" element={<ShoppingCartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}
