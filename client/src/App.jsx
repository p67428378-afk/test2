import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import BrokerDashboard from "./pages/BrokerDashboard";
import BuyerPortal from "./pages/BuyerPortal";
import PropertyDetail from "./pages/PropertyDetail";
import ChatPanel from "./components/properties/ChatPanel";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1326] flex items-center justify-center text-[#4edea3]">
        <span className="material-symbols-outlined animate-spin text-4xl">
          sync
        </span>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] flex">
        {/* Sidebar Navigation */}
        <Sidebar user={user} onLogout={handleLogout} />

        {/* Main Content Area */}
        <div className="flex-1 ml-[280px] p-8 min-h-screen overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Routes>
              {/* Public Routes */}
              <Route path="/buyer-portal" element={<BuyerPortal />} />
              <Route
                path="/properties/:id"
                element={<PropertyDetail user={user} />}
              />
              <Route
                path="/login"
                element={<Login onLoginSuccess={setUser} />}
              />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/broker-dashboard"
                element={
                  user?.role === "broker" ? (
                    <BrokerDashboard user={user} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/messages"
                element={
                  user ? (
                    <ChatPanel user={user} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              {/* Fallback Route */}
              <Route
                path="*"
                element={
                  user?.role === "broker" ? (
                    <Navigate to="/broker-dashboard" replace />
                  ) : (
                    <Navigate to="/buyer-portal" replace />
                  )
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}
