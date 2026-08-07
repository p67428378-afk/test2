import React, { useState, useEffect } from "react";
import { authService } from "./services/api";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import LaptopFormPage from "./pages/LaptopFormPage";
import AppLayout from "./components/layout/AppLayout";

export default function App() {
  const [seller, setSeller] = useState(null);
  const [token, setToken] = useState(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      return localStorage.getItem("token");
    }
    return null;
  });
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [laptopToEdit, setLaptopToEdit] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const checkAuth = () => {
      if (token) {
        const currentSeller = authService.getCurrentSeller();
        if (currentSeller) {
          setSeller(currentSeller);
        } else {
          authService.logout();
          setToken(null);
          setSeller(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [token]);

  const handleLoginSuccess = (sellerData) => {
    setSeller(sellerData);
    setToken(localStorage.getItem("token"));
    setActiveTab("dashboard");
  };

  const handleLogout = () => {
    authService.logout();
    setToken(null);
    setSeller(null);
  };

  const handleAddLaptop = () => {
    setLaptopToEdit(null);
    setActiveTab("laptop-form");
  };

  const handleEditLaptop = (laptop) => {
    setLaptopToEdit(laptop);
    setActiveTab("laptop-form");
  };

  const handleSaveSuccess = () => {
    setActiveTab("dashboard");
    setLaptopToEdit(null);
  };

  const handleCancelForm = () => {
    setActiveTab("dashboard");
    setLaptopToEdit(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-on-surface-variant">
        Loading application...
      </div>
    );
  }

  if (!seller) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <AppLayout
      seller={seller}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogout={handleLogout}
      searchValue={searchValue}
      onSearchChange={(e) => setSearchValue(e.target.value)}
    >
      {activeTab === "dashboard" || activeTab === "products" ? (
        <DashboardPage
          onAddLaptop={handleAddLaptop}
          onEditLaptop={handleEditLaptop}
        />
      ) : activeTab === "laptop-form" ? (
        <LaptopFormPage
          laptopToEdit={laptopToEdit}
          onSaveSuccess={handleSaveSuccess}
          onCancel={handleCancelForm}
        />
      ) : activeTab === "orders" ? (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-[0_1px_3px_rgba(15,23,42,0.08)]">
          <h3 className="font-title-lg text-title-lg text-on-surface mb-2">
            Orders
          </h3>
          <p className="text-body-md text-on-surface-variant">
            Order management is coming soon.
          </p>
        </div>
      ) : activeTab === "settings" ? (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-[0_1px_3px_rgba(15,23,42,0.08)]">
          <h3 className="font-title-lg text-title-lg text-on-surface mb-2">
            Settings
          </h3>
          <p className="text-body-md text-on-surface-variant">
            Store settings are coming soon.
          </p>
        </div>
      ) : (
        <DashboardPage
          onAddLaptop={handleAddLaptop}
          onEditLaptop={handleEditLaptop}
        />
      )}
    </AppLayout>
  );
}
