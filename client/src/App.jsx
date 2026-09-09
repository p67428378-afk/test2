import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import CatalogPage from "./pages/CatalogPage";
import PreferencesPage from "./pages/PreferencesPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import { Sparkles } from "lucide-react";

export default function App() {
  const [userId] = useState("user-123");
  const [cartItems, setCartItems] = useState([]);
  const [cartToast, setCartToast] = useState("");

  const handleAddToCart = (product) => {
    setCartItems((prev) => [...prev, product]);
    setCartToast(`Added "${product.name}" to cart!`);
    setTimeout(() => {
      setCartToast("");
    }, 3000);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
        {/* Navigation Bar */}
        <Navbar userId={userId} cartCount={cartItems.length} />

        {/* Global Cart Toast */}
        {cartToast && (
          <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2 text-xs font-semibold animate-bounce">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{cartToast}</span>
          </div>
        )}

        {/* Main Content View */}
        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={<CatalogPage onAddToCart={handleAddToCart} />}
            />
            <Route
              path="/products"
              element={<CatalogPage onAddToCart={handleAddToCart} />}
            />
            <Route
              path="/preferences"
              element={<PreferencesPage userId={userId} />}
            />
            <Route
              path="/recommendations"
              element={
                <RecommendationsPage
                  userId={userId}
                  onAddToCart={handleAddToCart}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center space-x-1">
              <span className="font-bold text-slate-800">RecomCommerce</span>
              <span>
                &copy; {new Date().getFullYear()} AI Product Recommendation
                Engine
              </span>
            </div>
            <div className="flex items-center space-x-1 text-slate-400">
              <span>Built with React 18, Vite & Tailwind CSS</span>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
