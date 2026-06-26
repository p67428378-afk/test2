import React, { useState, useEffect } from "react";
import TopNavBar from "./components/layout/TopNavBar";
import ProductCatalogPage from "./pages/ProductCatalogPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CheckoutPage from "./pages/CheckoutPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import { authService, wishlistService, cartService } from "./services/api";

export default function App() {
  const [currentPage, setCurrentPage] = useState("catalog");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState({ items: [], total_price: 0 });
  const [user, setUser] = useState(null);

  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [authEmail, setAuthEmail] = useState("test@example.com");
  const [authPassword, setAuthPassword] = useState("testpassword");
  const [authName, setAuthName] = useState("Test User");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const [wishlistData, cartData] = await Promise.all([
        wishlistService.getWishlist(),
        cartService.getCart(),
      ]);
      setWishlist(wishlistData);
      setCart(cartData);
    } catch (err) {
      console.error("Failed to fetch user data", err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    try {
      const data = await authService.login({
        email: authEmail,
        password: authPassword,
      });
      setUser(data.user);
      setShowAuthModal(false);
      fetchUserData();
    } catch (err) {
      setAuthError("Invalid email or password.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError("");
    try {
      await authService.register({
        email: authEmail,
        password: authPassword,
        name: authName,
      });
      // Auto login after register
      const data = await authService.login({
        email: authEmail,
        password: authPassword,
      });
      setUser(data.user);
      setShowAuthModal(false);
      fetchUserData();
    } catch (err) {
      setAuthError("Registration failed. Email might already be registered.");
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setWishlist([]);
    setCart({ items: [], total_price: 0 });
    setCurrentPage("catalog");
  };

  const handleProductClick = (productId) => {
    setSelectedProductId(productId);
    setCurrentPage("detail");
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setSelectedProductId(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface font-body-md antialiased">
      <TopNavBar
        wishlistCount={wishlist.length}
        cartCount={cart.items.reduce((acc, item) => acc + item.quantity, 0)}
        onSearch={setSearchQuery}
        onNavigate={handleNavigate}
        currentPage={currentPage}
        onOpenAuthModal={() => setShowAuthModal(true)}
        user={user}
        onLogout={handleLogout}
      />

      <main className="flex-grow">
        {currentPage === "catalog" && (
          <ProductCatalogPage
            searchQuery={searchQuery}
            wishlist={wishlist}
            onUpdateWishlist={setWishlist}
            onUpdateCart={setCart}
            onProductClick={handleProductClick}
          />
        )}

        {currentPage === "detail" && (
          <ProductDetailPage
            productId={selectedProductId}
            wishlist={wishlist}
            onUpdateWishlist={setWishlist}
            onUpdateCart={setCart}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === "cart" && (
          <CheckoutPage
            cart={cart}
            onUpdateCart={setCart}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === "wishlist" && (
          <div className="flex-grow w-full max-w-container-max mx-auto px-margin-desktop py-stack-lg">
            <h1 className="font-display text-display text-on-surface font-bold mb-8">
              My Wishlist
            </h1>
            {wishlist.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
                {wishlist.map((item) => (
                  <div
                    key={item.product_id}
                    className="bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden p-4 flex flex-col justify-between"
                  >
                    <img
                      src={item.image_url}
                      alt={item.name}
                      onClick={() => handleProductClick(item.product_id)}
                      className="w-full aspect-[3/4] object-cover rounded-md bg-surface-container-low cursor-pointer mb-4"
                    />
                    <div>
                      <h3 className="font-label-md text-label-md text-on-surface font-semibold line-clamp-1 mb-2">
                        {item.name}
                      </h3>
                      <p className="font-headline-sm text-headline-sm font-bold text-primary mb-4">
                        ${Number(item.price).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={async () => {
                        await wishlistService.removeFromWishlist(
                          item.product_id,
                        );
                        const updated = await wishlistService.getWishlist();
                        setWishlist(updated);
                      }}
                      className="w-full bg-error text-on-error font-label-md text-label-md py-2 rounded hover:bg-error-container transition-colors border-none cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-surface-container-lowest rounded-lg border border-outline-variant">
                <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-4">
                  favorite
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-2">
                  Your wishlist is empty
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Explore products and add your favorites to the wishlist!
                </p>
              </div>
            )}
          </div>
        )}

        {currentPage === "admin" && <AdminDashboardPage />}
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low border-t border-outline-variant w-full py-stack-xl mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin-desktop max-w-container-max mx-auto gap-6">
          <div className="font-headline-md text-headline-md text-on-surface font-bold">
            Aura Threads
          </div>
          <div className="flex flex-wrap justify-center gap-6 font-body-sm text-body-sm">
            <span className="text-on-surface-variant hover:text-primary transition-opacity duration-200 cursor-pointer">
              Privacy Policy
            </span>
            <span className="text-on-surface-variant hover:text-primary transition-opacity duration-200 cursor-pointer">
              Terms of Service
            </span>
            <span className="text-on-surface-variant hover:text-primary transition-opacity duration-200 cursor-pointer">
              Shipping & Returns
            </span>
            <span className="text-on-surface-variant hover:text-primary transition-opacity duration-200 cursor-pointer">
              Contact Us
            </span>
          </div>
          <div className="font-body-sm text-body-sm text-on-surface-variant">
            © 2024 Aura Threads. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest p-8 rounded-lg border border-outline-variant max-w-md w-full relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface bg-transparent border-none cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-6">
              {isRegister ? "Create Account" : "Welcome Back"}
            </h2>

            <form
              onSubmit={isRegister ? handleRegister : handleLogin}
              className="space-y-4"
            >
              {isRegister && (
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  required
                />
              </div>

              {authError && (
                <p className="text-error font-body-sm text-body-sm">
                  {authError}
                </p>
              )}

              <div className="bg-surface-container-low p-3 rounded-lg text-body-sm text-on-surface-variant mb-4">
                <p className="font-semibold mb-1">Test Account Credentials:</p>
                <p>
                  Email:{" "}
                  <span className="font-mono text-on-surface">
                    test@example.com
                  </span>
                </p>
                <p>
                  Password:{" "}
                  <span className="font-mono text-on-surface">
                    testpassword
                  </span>
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-on-primary font-label-md text-label-md py-3 rounded-lg hover:bg-primary-fixed transition-colors border-none cursor-pointer"
              >
                {isRegister ? "Sign Up" : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center font-body-sm text-body-sm text-on-surface-variant">
              {isRegister ? (
                <p>
                  Already have an account?{" "}
                  <button
                    onClick={() => setIsRegister(false)}
                    className="text-primary hover:underline bg-transparent border-none cursor-pointer font-semibold"
                  >
                    Sign In
                  </button>
                </p>
              ) : (
                <p>
                  Don't have an account?{" "}
                  <button
                    onClick={() => setIsRegister(true)}
                    className="text-primary hover:underline bg-transparent border-none cursor-pointer font-semibold"
                  >
                    Sign Up
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
