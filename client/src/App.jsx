import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import CatalogPage from "./pages/CatalogPage.jsx";
import ConfiguratorPage from "./pages/ConfiguratorPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import OrderTrackingPage from "./pages/OrderTrackingPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";

// Legacy views for Library System compatibility
import LibrarianDashboard from "./pages/LibrarianDashboard.jsx";
import MemberPortal from "./pages/MemberPortal.jsx";
import BookCatalogManagement from "./pages/BookCatalogManagement.jsx";
import InventoryDashboardPage from "./pages/InventoryDashboardPage.jsx";
import InventoryFormPage from "./pages/InventoryFormPage.jsx";

import { authService, cartService } from "./services/api.js";

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      return localStorage.getItem("token");
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState("catalog"); // 'catalog', 'configurator', 'cart', 'orders', 'admin'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPaintingForConfig, setSelectedPaintingForConfig] =
    useState(null);
  const [initialOrderNumber, setInitialOrderNumber] = useState("");

  // Persistent Cart ID
  const [cartId] = useState(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      let id = localStorage.getItem("wall_art_cart_id");
      if (!id) {
        id = `CART-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
        localStorage.setItem("wall_art_cart_id", id);
      }
      return id;
    }
    return "CART-DEFAULT-123";
  });

  const [cart, setCart] = useState(null);

  const fetchCart = async () => {
    try {
      const data = await cartService.getCart(cartId);
      setCart(data);
    } catch (err) {
      console.error("Fetch cart error", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [cartId]);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (err) {
          console.error(err);
          authService.logout();
          setToken(null);
          setUser(null);
        }
      }
    };
    checkAuth();
  }, [token]);

  const handleLogout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  const handleConfigurePainting = (painting) => {
    setSelectedPaintingForConfig(painting);
    setActiveTab("configurator");
  };

  const handleAddToCart = async (itemData) => {
    try {
      if (itemData.painting_id) {
        // Standard item or custom configured item payload
        await cartService.addItem({
          cart_id: cartId,
          painting_id: itemData.painting_id,
          frame_option_id: itemData.frame_option_id || null,
          custom_width_inches: itemData.custom_width_inches || null,
          custom_height_inches: itemData.custom_height_inches || null,
          quantity: itemData.quantity || 1,
        });
      } else {
        // Direct painting object
        await cartService.addItem({
          cart_id: cartId,
          painting_id: itemData.id,
          quantity: 1,
        });
      }
      await fetchCart();
      setActiveTab("cart");
    } catch (err) {
      console.error("Add to cart error", err);
    }
  };

  const handleViewOrderTracking = (orderNum) => {
    setInitialOrderNumber(orderNum);
    setActiveTab("orders");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "catalog":
        return (
          <CatalogPage
            searchQuery={searchQuery}
            onConfigure={handleConfigurePainting}
            onAddToCart={handleAddToCart}
          />
        );
      case "configurator":
        return (
          <ConfiguratorPage
            selectedPainting={selectedPaintingForConfig}
            onAddToCart={handleAddToCart}
            onBack={() => setActiveTab("catalog")}
          />
        );
      case "cart":
        return (
          <CheckoutPage
            cartId={cartId}
            cart={cart}
            onRefreshCart={fetchCart}
            onViewOrderTracking={handleViewOrderTracking}
          />
        );
      case "orders":
        return <OrderTrackingPage initialOrderNumber={initialOrderNumber} />;
      case "admin":
        return <AdminPage />;

      // Legacy support tabs
      case "library-dashboard":
        return <LibrarianDashboard />;
      case "library-portal":
        return <MemberPortal user={user} />;
      case "inventory":
        return (
          <InventoryDashboardPage
            user={user}
            onAddItem={() => {}}
            onEditItem={() => {}}
          />
        );

      default:
        return (
          <CatalogPage
            searchQuery={searchQuery}
            onConfigure={handleConfigurePainting}
            onAddToCart={handleAddToCart}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Primary Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={cart?.total_items || 0}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 text-center text-xs text-slate-500 space-y-2">
        <p className="font-semibold text-slate-400">
          Artesan Canvas &mdash; E-Commerce Wall Painting & Custom Artwork
          Platform
        </p>
        <p>
          Powered by React 18, Vite, Tailwind CSS, & FastAPI &bull; Compliant
          with SDLC Assistant Constitution v1.0.0
        </p>
      </footer>
    </div>
  );
}
