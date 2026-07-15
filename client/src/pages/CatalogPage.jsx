import React, { useState, useEffect } from "react";
import AppLayout from "../components/layout/AppLayout.jsx";
import FilterBar from "../components/catalog/FilterBar.jsx";
import ProductGrid from "../components/catalog/ProductGrid.jsx";
import CartDrawer from "../components/cart/CartDrawer.jsx";
import {
  productService,
  cartService,
  orderService,
  authService,
} from "../services/api.js";

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setProductsFiltered] = useState([]);
  const [cart, setCart] = useState({ items: [], subtotal: 0 });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthOpenMode] = useState("login"); // 'login' | 'register' | 'forgot' | 'otp' | 'security' | 'new-password'

  // Auth Form States
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  // Password Reset States
  const [resetSessionId, setResetSessionId] = useState("");
  const [otp, setOtp] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Filter States
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts();
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      fetchCart();
    } else {
      // Load local mock cart if not logged in
      const localCart = localStorage.getItem("mock_cart");
      if (localCart) {
        setCart(JSON.parse(localCart));
      }
    }
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, activeCategory, sortBy, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products", err);
      // Fallback mock products if backend is empty or fails
      const mockProducts = [
        {
          product_id: "p1",
          name: "Dino-Adventure Bento",
          description:
            "Fun dinosaur themed lunch box with leakproof compartments, perfect for kids.",
          price: 24.99,
          image_urls: [
            "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=500&auto=format&fit=crop&q=60",
          ],
          category: "Kids",
          rating: 4.9,
          review_count: 124,
          tags: ["Leakproof"],
        },
        {
          product_id: "p2",
          name: "Executive Sleek Steel",
          description:
            "Premium insulated stainless steel lunch box designed for working professionals.",
          price: 45.0,
          image_urls: [
            "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&auto=format&fit=crop&q=60",
          ],
          category: "Professionals",
          rating: 4.8,
          review_count: 312,
          tags: ["Bestseller", "Insulated"],
        },
        {
          product_id: "p3",
          name: "Easy-Open Thermal Warm",
          description:
            "Lightweight, easy-grip thermal container that keeps meals warm for seniors.",
          price: 34.99,
          image_urls: [
            "https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=500&auto=format&fit=crop&q=60",
          ],
          category: "Seniors",
          rating: 4.7,
          review_count: 89,
          tags: ["Easy-Grip"],
        },
        {
          product_id: "p4",
          name: "Eco-Friendly Bamboo Stack",
          description:
            "Sustainable stackable bamboo fiber lunch box with secure strap.",
          price: 29.99,
          image_urls: [
            "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=500&auto=format&fit=crop&q=60",
          ],
          category: "Professionals",
          rating: 4.6,
          review_count: 156,
          tags: ["Eco", "Stackable"],
        },
      ];
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    }
  };

  const applyFilters = () => {
    let result = [...products];

    // Category Filter
    if (activeCategory !== "All") {
      result = result.filter(
        (p) => p.category.toLowerCase() === activeCategory.toLowerCase(),
      );
    }

    // Search Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query),
      );
    }

    // Sorting
    if (sortBy === "low-to-high") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "high-to-low") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    setProductsFiltered(result);
  };

  const handleAddToCart = async (productId) => {
    if (user) {
      try {
        const updatedCart = await cartService.addToCart(productId, 1);
        setCart(updatedCart);
      } catch (err) {
        console.error("Failed to add to cart", err);
      }
    } else {
      // Local mock cart logic for unauthenticated users
      const product = products.find((p) => p.product_id === productId);
      if (!product) return;

      const existingItemIdx = cart.items.findIndex(
        (item) => item.product_id === productId,
      );
      let updatedItems = [...cart.items];

      if (existingItemIdx > -1) {
        updatedItems[existingItemIdx].quantity += 1;
      } else {
        updatedItems.push({
          product_id: product.product_id,
          name: product.name,
          price: product.price,
          image_url: product.image_urls?.[0] || "",
          quantity: 1,
        });
      }

      const subtotal = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      const newCart = { items: updatedItems, subtotal };
      setCart(newCart);
      localStorage.setItem("mock_cart", JSON.stringify(newCart));
    }
  };

  const handleCheckout = async (shippingAddress) => {
    if (!user) {
      setAuthOpenMode("login");
      setAuthOpen(true);
      setAuthError("Please login or register to complete your purchase.");
      throw new Error("Authentication required");
    }
    try {
      const order = await orderService.createOrder(shippingAddress);
      // Clear cart locally and fetch fresh cart
      setCart({ items: [], subtotal: 0 });
      localStorage.removeItem("mock_cart");
      return order;
    } catch (err) {
      console.error("Checkout failed", err);
      throw err;
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    try {
      if (authMode === "login") {
        await authService.login(email, password);
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        fetchCart();
        setAuthOpen(false);
      } else if (authMode === "register") {
        await authService.register(email, password);
        setAuthSuccess("Registration successful! Please login.");
        setAuthOpenMode("login");
      } else if (authMode === "forgot") {
        const res = await authService.initiateReset(email);
        setResetSessionId(res.password_reset_session_id);
        setAuthSuccess("OTP sent to your email.");
        setAuthOpenMode("otp");
      } else if (authMode === "otp") {
        const res = await authService.verifyOtp(otp, resetSessionId);
        setResetSessionId(res.password_reset_session_id);
        setAuthSuccess("OTP verified. Please answer security question.");
        setAuthOpenMode("security");
      } else if (authMode === "security") {
        const res = await authService.verifySecurityQuestion(
          securityAnswer,
          resetSessionId,
        );
        setResetSessionId(res.password_reset_session_id);
        setAuthSuccess("Security question verified. Set your new password.");
        setAuthOpenMode("new-password");
      } else if (authMode === "new-password") {
        await authService.setNewPassword(newPassword, resetSessionId);
        setAuthSuccess("Password reset successful! Please login.");
        setAuthOpenMode("login");
      }
    } catch (err) {
      setAuthError(
        err.response?.data?.detail || "An error occurred. Please try again.",
      );
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setCart({ items: [], subtotal: 0 });
    localStorage.removeItem("mock_cart");
  };

  const cartCount = cart.items
    ? cart.items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  return (
    <AppLayout
      cartCount={cartCount}
      onCartClick={() => setCartOpen(true)}
      user={user}
      onAuthClick={() => setAuthOpen(true)}
      onLogout={handleLogout}
    >
      {/* Main Catalog Section */}
      <div class="flex-1 flex flex-col gap-6">
        <header class="mb-4">
          <h1 class="text-4xl font-bold text-gray-900 tracking-tight mb-2">
            Creative Lunch Boxes for Every Generation
          </h1>
          <p class="text-lg text-gray-600 max-w-3xl">
            Discover beautifully designed, functional, and fun lunch boxes
            tailored for kids, office goers, and seniors.
          </p>
        </header>

        <FilterBar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <ProductGrid
          products={filteredProducts}
          onAddToCart={handleAddToCart}
          loading={loading}
        />
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onCheckout={handleCheckout}
        loading={loading}
      />

      {/* Auth Modal */}
      {authOpen && (
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-500 bg-opacity-75">
          <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setAuthOpen(false)}
              class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <span class="material-symbols-outlined">close</span>
            </button>

            <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">
              {authMode === "login" && "Welcome Back"}
              {authMode === "register" && "Create Account"}
              {authMode === "forgot" && "Reset Password"}
              {authMode === "otp" && "Enter OTP"}
              {authMode === "security" && "Security Verification"}
              {authMode === "new-password" && "Set New Password"}
            </h2>

            {authError && (
              <div class="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4 font-medium">
                {authError}
              </div>
            )}

            {authSuccess && (
              <div class="bg-green-50 text-green-700 p-3 rounded-lg text-sm mb-4 font-medium">
                {authSuccess}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} class="space-y-4">
              {authMode === "login" && (
                <div class="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs text-gray-600 mb-4">
                  <p class="font-semibold mb-1">Test Account Credentials:</p>
                  <p>
                    Email:{" "}
                    <code class="font-mono bg-white px-1 py-0.5 rounded border">
                      test@example.com
                    </code>
                  </p>
                  <p>
                    Password:{" "}
                    <code class="font-mono bg-white px-1 py-0.5 rounded border">
                      testpassword
                    </code>
                  </p>
                </div>
              )}

              {(authMode === "login" ||
                authMode === "register" ||
                authMode === "forgot") && (
                <div>
                  <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-[#006c49] focus:border-[#006c49]"
                    placeholder="you@example.com"
                  />
                </div>
              )}

              {(authMode === "login" || authMode === "register") && (
                <div>
                  <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-[#006c49] focus:border-[#006c49]"
                    placeholder="••••••••"
                  />
                </div>
              )}

              {authMode === "otp" && (
                <div>
                  <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    One-Time Password (OTP)
                  </label>
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-[#006c49] focus:border-[#006c49]"
                    placeholder="123456"
                  />
                </div>
              )}

              {authMode === "security" && (
                <div>
                  <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    What is your favorite lunch box color?
                  </label>
                  <input
                    type="text"
                    required
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-[#006c49] focus:border-[#006c49]"
                    placeholder="Your answer"
                  />
                </div>
              )}

              {authMode === "new-password" && (
                <div>
                  <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-[#006c49] focus:border-[#006c49]"
                    placeholder="••••••••"
                  />
                </div>
              )}

              <button
                type="submit"
                class="w-full bg-[#006c49] text-white py-2.5 rounded-lg font-medium hover:bg-[#005236] transition-colors shadow-sm"
              >
                {authMode === "login" && "Sign In"}
                {authMode === "register" && "Create Account"}
                {authMode === "forgot" && "Send OTP"}
                {authMode === "otp" && "Verify OTP"}
                {authMode === "security" && "Verify Answer"}
                {authMode === "new-password" && "Update Password"}
              </button>
            </form>

            <div class="mt-6 text-center text-sm text-gray-600 space-y-2">
              {authMode === "login" && (
                <>
                  <p>
                    Don't have an account?{" "}
                    <button
                      onClick={() => setAuthOpenMode("register")}
                      class="text-[#006c49] font-semibold hover:underline"
                    >
                      Register
                    </button>
                  </p>
                  <p>
                    <button
                      onClick={() => setAuthOpenMode("forgot")}
                      class="text-gray-500 hover:underline text-xs"
                    >
                      Forgot Password?
                    </button>
                  </p>
                </>
              )}
              {authMode === "register" && (
                <p>
                  Already have an account?{" "}
                  <button
                    onClick={() => setAuthOpenMode("login")}
                    class="text-[#006c49] font-semibold hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              )}
              {authMode !== "login" && authMode !== "register" && (
                <p>
                  <button
                    onClick={() => setAuthOpenMode("login")}
                    class="text-[#006c49] font-semibold hover:underline"
                  >
                    Back to Login
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
