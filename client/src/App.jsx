import React, { useState, useEffect } from "react";
import {
  Heart,
  ShoppingCart,
  Search,
  User as UserIcon,
  LogIn,
  LogOut,
  Star,
  CheckCircle,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { authService, wishlistService } from "./services/api.js";
import WishlistPage from "./pages/WishlistPage.jsx";
import WishlistButton from "./components/wishlist/WishlistButton.jsx";

export default function App() {
  // Navigation state: 'pdp' or 'wishlist'
  const [page, setPage] = useState("pdp");
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated(),
  );
  const [username, setUsername] = useState(authService.getUsername());

  // Auth modal state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // 'login' or 'register'
  const [emailInput, setEmailInput] = useState("test@example.com");
  const [passwordInput, setPasswordInput] = useState("testpassword");
  const [mobileInput, setMobileInput] = useState("1234567890");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Product details state
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("Matte Black");
  const [isSavedInWishlist, setIsSavedInWishlist] = useState(false);
  const [wishlistItemId, setWishlistItemId] = useState(null);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Notification state
  const [notification, setNotification] = useState(null);

  // Sample product details (matches seeded product)
  const sampleProduct = {
    id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    name: "AeroSound Max Wireless Headphones",
    description:
      "Experience industry-leading noise cancellation, 40-hour battery life, and ultra-comfortable memory foam earcups. Perfect for travel, work, and study.",
    price: 299.0,
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDy8VFVfyTNe3Z7Cl3APg3fX5dAzUq0sP1gLKSH3zRU36a7-mdxcU7D1o4szDaF_EPu-epo3VA4x5VbSUr8me-zHFDlnHlr0EcxScuv1Lyb5t-uRyO5h1n0snO0L-_DztWUPiVXiDimS1E9oExwPubTBlMeaSgbEnJXWVGv4s560OROJIyhlG67YVtVE1_ZP1RKS-6pe4pNDGConumSYzxqGOAsNAbWh8NzIJT3X3kKOSfh229s4AO3UmRI3LOCgULQG4ZoU0syvp9R",
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Fetch wishlist status for the sample product
  const checkWishlistStatus = async () => {
    if (!isAuthenticated) {
      setIsSavedInWishlist(false);
      setWishlistItemId(null);
      setWishlistCount(0);
      return;
    }
    try {
      setWishlistLoading(true);
      const items = await wishlistService.getWishlist();
      setWishlistCount(items.length);
      const found = items.find((item) => item.product.id === sampleProduct.id);
      if (found) {
        setIsSavedInWishlist(true);
        setWishlistItemId(found.id);
      } else {
        setIsSavedInWishlist(false);
        setWishlistItemId(null);
      }
    } catch (err) {
      console.error("Error checking wishlist status:", err);
    } finally {
      setWishlistLoading(false);
    }
  };

  useEffect(() => {
    checkWishlistStatus();
  }, [isAuthenticated]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      if (authMode === "login") {
        await authService.login(emailInput, passwordInput);
        setIsAuthenticated(true);
        setUsername(emailInput);
        showNotification("Successfully logged in!", "success");
        setShowAuthModal(false);
      } else {
        await authService.register(emailInput, mobileInput, passwordInput);
        showNotification("Registration successful! Please log in.", "success");
        setAuthMode("login");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setAuthError(
        err.response?.data?.detail ||
          "Authentication failed. Please try again.",
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUsername("");
    setPage("pdp");
    showNotification("Logged out successfully", "success");
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      setAuthMode("login");
      setShowAuthModal(true);
      return;
    }

    try {
      setWishlistLoading(true);
      if (isSavedInWishlist) {
        await wishlistService.removeFromWishlist(wishlistItemId);
        setIsSavedInWishlist(false);
        setWishlistItemId(null);
        setWishlistCount((prev) => Math.max(0, prev - 1));
        showNotification("Removed from wishlist", "success");
      } else {
        const res = await wishlistService.addToWishlist(sampleProduct.id);
        setIsSavedInWishlist(true);
        setWishlistItemId(res.id);
        setWishlistCount((prev) => prev + 1);
        showNotification("Added to wishlist!", "success");
      }
    } catch (err) {
      console.error("Wishlist toggle error:", err);
      showNotification(
        err.response?.data?.detail || "Failed to update wishlist",
        "error",
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col font-sans">
      {/* TopNavBar */}
      <header className="bg-surface-container-lowest border-b border-outline-variant shadow-sm flex justify-between items-center px-lg w-full max-w-container-max mx-auto h-[64px] z-50 sticky top-0">
        <div className="flex items-center gap-lg">
          <span
            onClick={() => setPage("pdp")}
            className="font-h3 text-h3 font-bold text-primary cursor-pointer"
          >
            ShopSphere
          </span>
          <div className="hidden md:flex items-center bg-surface-container-low rounded-full px-4 py-2 border border-outline-variant">
            <Search className="text-outline mr-2 w-5 h-5" />
            <input
              className="bg-transparent border-none focus:ring-0 text-body-md font-body-md text-on-surface w-64 placeholder:text-outline-variant p-0 h-auto outline-none"
              placeholder="Search..."
              type="text"
            />
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-xl">
          <button
            onClick={() => setPage("pdp")}
            className={`font-label-sm text-label-sm pb-1 transition-colors duration-200 ${page === "pdp" ? "text-primary font-bold border-b-2 border-primary" : "text-on-surface-variant hover:text-primary"}`}
          >
            Shop
          </button>
          <a
            className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors duration-200"
            href="#"
          >
            Deals
          </a>
          <a
            className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors duration-200"
            href="#"
          >
            New Arrivals
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (isAuthenticated) {
                setPage("wishlist");
              } else {
                setAuthMode("login");
                setShowAuthModal(true);
              }
            }}
            aria-label="Favorite"
            className={`hover:text-primary transition-colors duration-200 relative ${page === "wishlist" ? "text-primary" : "text-on-surface"}`}
          >
            <Heart
              className={`w-6 h-6 ${isSavedInWishlist ? "fill-current text-error" : ""}`}
            />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-error text-on-error text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {wishlistCount}
              </span>
            )}
          </button>
          <button
            aria-label="Shopping Cart"
            className="text-on-surface hover:text-primary transition-colors duration-200 relative"
          >
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              2
            </span>
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-sm text-secondary font-medium">
                {username}
              </span>
              <button
                onClick={handleLogout}
                aria-label="Logout"
                className="text-on-surface hover:text-primary transition-colors duration-200"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setAuthMode("login");
                setShowAuthModal(true);
              }}
              aria-label="Login"
              className="text-on-surface hover:text-primary transition-colors duration-200"
            >
              <LogIn className="w-6 h-6" />
            </button>
          )}
        </div>
      </header>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white transition-all duration-300 ${notification.type === "error" ? "bg-error" : "bg-primary"}`}
        >
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* Main Content Canvas */}
      <main className="flex-grow w-full max-w-container-max mx-auto">
        {page === "wishlist" ? (
          <WishlistPage
            onBack={() => setPage("pdp")}
            onShowNotification={showNotification}
          />
        ) : (
          <div className="px-margin-mobile md:px-lg py-xl">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="mb-lg">
              <ol className="flex items-center gap-2 font-caption text-caption text-secondary">
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Home
                  </a>
                </li>
                <li>
                  <ChevronRight className="w-4 h-4" />
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Electronics
                  </a>
                </li>
                <li>
                  <ChevronRight className="w-4 h-4" />
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Audio
                  </a>
                </li>
                <li>
                  <ChevronRight className="w-4 h-4" />
                </li>
                <li aria-current="page" class="text-on-surface font-medium">
                  Headphones
                </li>
              </ol>
            </nav>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-xl items-start">
              {/* Left Pane: Imagery */}
              <div className="flex flex-col gap-md">
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden aspect-square relative shadow-[0px_4px_12px_rgba(15,23,42,0.05)]">
                  <img
                    className="w-full h-full object-cover"
                    alt={sampleProduct.name}
                    src={sampleProduct.image_url}
                  />
                  <div className="absolute top-4 left-4 bg-secondary-container text-on-secondary-container font-label-sm text-label-sm px-3 py-1 rounded-full shadow-sm">
                    Best Seller
                  </div>
                </div>
              </div>

              {/* Right Pane: Product Details */}
              <div className="flex flex-col bg-surface-container-lowest rounded-xl p-0 md:p-lg">
                <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-on-surface mb-2 font-bold">
                  {sampleProduct.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-lg">
                  <div className="flex text-tertiary">
                    <Star className="w-5 h-5 fill-current text-tertiary-container" />
                    <Star className="w-5 h-5 fill-current text-tertiary-container" />
                    <Star className="w-5 h-5 fill-current text-tertiary-container" />
                    <Star className="w-5 h-5 fill-current text-tertiary-container" />
                    <Star className="w-5 h-5 text-tertiary-container" />
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                    4.8
                  </span>
                  <span className="font-caption text-caption text-secondary underline cursor-pointer hover:text-primary">
                    128 reviews
                  </span>
                </div>

                {/* Price */}
                <div className="mb-lg">
                  <span className="font-h2 text-h2 text-primary font-bold text-3xl">
                    ${sampleProduct.price.toFixed(2)}
                  </span>
                </div>

                {/* Description */}
                <p className="font-body-lg text-body-lg text-secondary mb-xl">
                  {sampleProduct.description}
                </p>

                {/* Color Selection */}
                <div className="mb-xl">
                  <h3 className="font-label-sm text-label-sm text-on-surface mb-sm">
                    Color: <span class="font-semibold">{selectedColor}</span>
                  </h3>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedColor("Matte Black")}
                      aria-label="Select Matte Black"
                      className={`w-10 h-10 rounded-full border-2 bg-[#1e2124] flex items-center justify-center ${selectedColor === "Matte Black" ? "border-primary" : "border-outline-variant"}`}
                    >
                      {selectedColor === "Matte Black" && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </button>
                    <button
                      onClick={() => setSelectedColor("Platinum Silver")}
                      aria-label="Select Platinum Silver"
                      className={`w-10 h-10 rounded-full border bg-[#e5e7eb] flex items-center justify-center ${selectedColor === "Platinum Silver" ? "border-2 border-primary" : "border-outline-variant"}`}
                    >
                      {selectedColor === "Platinum Silver" && (
                        <span className="text-gray-800 text-xs">✓</span>
                      )}
                    </button>
                    <button
                      onClick={() => setSelectedColor("Midnight Blue")}
                      aria-label="Select Midnight Blue"
                      className={`w-10 h-10 rounded-full border bg-[#1e3a8a] flex items-center justify-center ${selectedColor === "Midnight Blue" ? "border-2 border-primary" : "border-outline-variant"}`}
                    >
                      {selectedColor === "Midnight Blue" && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Quantity & Actions */}
                <div className="flex flex-col sm:flex-row gap-4 mb-xl">
                  {/* Quantity */}
                  <div className="flex items-center border border-outline-variant rounded-lg h-[44px] bg-surface-bright">
                    <button
                      onClick={() =>
                        setQuantity((prev) => Math.max(1, prev - 1))
                      }
                      aria-label="Decrease quantity"
                      className="px-4 text-on-surface-variant hover:text-primary transition-colors h-full"
                    >
                      -
                    </button>
                    <span className="font-label-sm text-label-sm text-on-surface w-8 text-center font-semibold">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((prev) => prev + 1)}
                      aria-label="Increase quantity"
                      className="px-4 text-on-surface-variant hover:text-primary transition-colors h-full"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button className="flex-grow flex items-center justify-center gap-2 bg-primary hover:bg-primary-container text-on-primary font-label-sm text-label-sm rounded-lg h-[44px] px-lg transition-colors shadow-sm">
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>

                  {/* Wishlist Button */}
                  <WishlistButton
                    isSaved={isSavedInWishlist}
                    onClick={handleWishlistToggle}
                    disabled={wishlistLoading}
                  />
                </div>

                {/* Features Checklist */}
                <div className="bg-surface-container-low rounded-lg p-md border border-outline-variant/50">
                  <ul className="flex flex-col gap-3 font-body-md text-body-md text-on-surface-variant">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="text-primary w-5 h-5 mt-0.5" />
                      Active Noise Cancellation
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="text-primary w-5 h-5 mt-0.5" />
                      Bluetooth 5.2
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="text-primary w-5 h-5 mt-0.5" />
                      40-Hour Battery Life
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 w-full max-w-md shadow-xl relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-secondary hover:text-on-surface"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-on-surface mb-6">
              {authMode === "login" ? "Sign In" : "Create Account"}
            </h2>

            <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full border border-outline-variant rounded-lg px-3 py-2 focus:outline-none focus:border-primary bg-surface-bright"
                  placeholder="test@example.com"
                />
              </div>

              {authMode === "register" && (
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    required
                    value={mobileInput}
                    onChange={(e) => setMobileInput(e.target.value)}
                    className="w-full border border-outline-variant rounded-lg px-3 py-2 focus:outline-none focus:border-primary bg-surface-bright"
                    placeholder="1234567890"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full border border-outline-variant rounded-lg px-3 py-2 focus:outline-none focus:border-primary bg-surface-bright"
                  placeholder="••••••••"
                />
              </div>

              {authError && (
                <p className="text-error text-sm font-medium">{authError}</p>
              )}

              <div className="bg-surface-container-low p-3 rounded-lg text-xs text-secondary mb-2">
                <p className="font-semibold mb-1">💡 Test Credentials:</p>
                <p>
                  Email:{" "}
                  <span className="font-mono font-bold">test@example.com</span>
                </p>
                <p>
                  Password:{" "}
                  <span className="font-mono font-bold">testpassword</span>
                </p>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-primary hover:bg-primary-container text-on-primary font-medium rounded-lg py-2.5 transition-colors flex items-center justify-center gap-2"
              >
                {authLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {authMode === "login" ? "Sign In" : "Register"}
              </button>
            </form>

            <div className="mt-4 text-center text-sm">
              {authMode === "login" ? (
                <p className="text-secondary">
                  Don't have an account?{" "}
                  <button
                    onClick={() => setAuthMode("register")}
                    className="text-primary font-semibold hover:underline"
                  >
                    Register
                  </button>
                </p>
              ) : (
                <p className="text-secondary">
                  Already have an account?{" "}
                  <button
                    onClick={() => setAuthMode("login")}
                    className="text-primary font-semibold hover:underline"
                  >
                    Sign In
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
