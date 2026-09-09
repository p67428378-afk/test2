import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import GardenPage from "./pages/GardenPage.jsx";
import SpeciesCatalogPage from "./pages/SpeciesCatalogPage.jsx";
import { getCurrentUser, getWateringNotifications } from "./services/api.js";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [unreadAlerts, setUnreadAlerts] = useState(0);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch {
        // User not logged in yet
      }

      try {
        const notifData = await getWateringNotifications();
        if (notifData && typeof notifData.total_alerts === "number") {
          setUnreadAlerts(notifData.total_alerts);
        }
      } catch {
        // Notifications optional
      }
    }
    loadInitialData();
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F4F7F4] flex flex-col font-sans">
        <Navbar
          unreadAlerts={unreadAlerts}
          currentUser={currentUser}
          onUserChange={(user) => setCurrentUser(user)}
        />
        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <DashboardPage
                  onAlertsCountChange={(count) => setUnreadAlerts(count)}
                />
              }
            />
            <Route path="/garden" element={<GardenPage />} />
            <Route path="/species" element={<SpeciesCatalogPage />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-gray-200 py-6 px-8 text-center text-xs text-gray-500 mt-12">
          <p>
            © {new Date().getFullYear()} SproutCare - Houseplant Identification
            & Watering Schedule Management
          </p>
        </footer>
      </div>
    </BrowserRouter>
  );
}
