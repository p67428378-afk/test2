import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import CartDrawer from "./components/cart/CartDrawer";
import CatalogPage from "./pages/CatalogPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";

export function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1A0F0D] font-sans selection:bg-[#D4AF37]/30 selection:text-[#1A0F0D]">
          {/* Header */}
          <Navbar />

          {/* Cart Drawer Overlay */}
          <CartDrawer />

          {/* Main App Content */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<CatalogPage />} />
              <Route path="/chocolates" element={<CatalogPage />} />
              <Route path="/chocolates/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route
                path="/orders/:order_id"
                element={<OrderConfirmationPage />}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
