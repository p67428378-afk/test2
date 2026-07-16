import React, { useState, useEffect } from "react";
import Header from "./components/layout/Header";
import CatalogPage from "./pages/CatalogPage";
import DetailPage from "./pages/DetailPage";
import CheckoutPage from "./pages/CheckoutPage";
import PasswordResetPage from "./pages/PasswordResetPage";
import { cartApi } from "./services/api";

export default function App() {
  const [currentPage, setCurrentPage] = useState("catalog"); // 'catalog', 'detail', 'checkout', 'password-reset'
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    try {
      const cart = await cartApi.get();
      const count = cart.items
        ? cart.items.reduce((sum, item) => sum + item.quantity, 0)
        : 0;
      setCartCount(count);
    } catch (err) {
      console.error("Error fetching cart count:", err);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  const handleAddToCart = async (bookId) => {
    try {
      // Get current cart to check if item already exists
      const cart = await cartApi.get();
      const existingItem = cart.items
        ? cart.items.find((item) => item.book_id === bookId)
        : null;
      const currentQty = existingItem ? existingItem.quantity : 0;

      await cartApi.add(bookId, currentQty + 1);
      await fetchCartCount();
      alert("Added to cart successfully!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert(err.response?.data?.detail || "Failed to add item to cart.");
    }
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    if (page !== "detail") {
      setSelectedBookId(null);
    }
  };

  const handleSelectBook = (bookId) => {
    setSelectedBookId(bookId);
    setCurrentPage("detail");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Header
        cartCount={cartCount}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />

      <main className="flex-1 w-full max-w-container-max mx-auto px-md py-lg">
        {currentPage === "catalog" && (
          <CatalogPage
            onAddToCart={handleAddToCart}
            onSelectBook={handleSelectBook}
          />
        )}

        {currentPage === "detail" && selectedBookId && (
          <DetailPage
            bookId={selectedBookId}
            onBack={() => handleNavigate("catalog")}
            onAddToCart={handleAddToCart}
          />
        )}

        {currentPage === "checkout" && (
          <CheckoutPage
            onBack={() => handleNavigate("catalog")}
            onCartUpdated={fetchCartCount}
          />
        )}

        {currentPage === "password-reset" && (
          <PasswordResetPage onBack={() => handleNavigate("catalog")} />
        )}
      </main>

      <footer className="bg-surface-container-low dark:bg-surface-dim font-label-sm text-label-sm w-full py-lg mt-xl border-t border-outline-variant">
        <div className="flex flex-col md:flex-row justify-between items-center px-md max-w-container-max mx-auto gap-base">
          <div className="font-headline-sm text-headline-sm text-primary mb-4 md:mb-0 flex items-center gap-2">
            <img
              alt="Hogwarts Library Logo Minimal"
              className="h-6 w-6 object-contain opacity-70 grayscale"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAP9EJ1mNmt_j_x0UmMJ4E6KFMakcB0qnGhriQddJq2zzxX7aqZtY9UXprlWEhl8_E4b3TWxEPUx4soUg29CgkblsPweGgrc2Qe6SHQ4WkF8b5x6_6_nKIOu7UzJAFgPGQtUqacRoB5EzVrCdMOKpFlyMRuDqAcuMuoSuyQQXveATmBMohM6k7MebIjVRPw1l9YYJbnw29K-iU4AqTw8PFabPcHDx2opOG324j8hiamMmDr78q7y6PS_gUpPx56JorKaNMFzHoIR08o"
            />
            Hogwarts Library
          </div>
          <nav className="flex flex-wrap justify-center gap-md">
            <a
              className="text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              Terms of Service
            </a>
            <a
              className="text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              Shipping Info
            </a>
            <a
              className="text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              Contact Librarian
            </a>
          </nav>
          <div className="text-secondary dark:text-secondary-fixed mt-4 md:mt-0">
            © 1997 Hogwarts Library. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
