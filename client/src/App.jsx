import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import CampaignCatalogPage from "./pages/CampaignCatalogPage";
import CampaignDetailsPage from "./pages/CampaignDetailsPage";
import AdminCampaignsPage from "./pages/AdminCampaignsPage";
import AdminDonationsPage from "./pages/AdminDonationsPage";
import MyDonationsPage from "./pages/MyDonationsPage";
import { authAPI } from "./services/api";
import { Heart } from "lucide-react";

export default function App() {
  const [currentUser, setCurrentUser] = useState(() =>
    authAPI.getCurrentUser(),
  );

  useEffect(() => {
    // Optionally verify user token on load
    const token = localStorage.getItem("access_token");
    if (token) {
      authAPI
        .getMe()
        .then((user) => setCurrentUser(user))
        .catch(() => {
          authAPI.logout();
          setCurrentUser(null);
        });
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
        {/* Navigation Bar */}
        <Navbar currentUser={currentUser} onUserChange={setCurrentUser} />

        {/* Main Content Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<CampaignCatalogPage />} />
            <Route
              path="/campaigns/:id"
              element={<CampaignDetailsPage currentUser={currentUser} />}
            />
            <Route
              path="/admin/campaigns"
              element={<AdminCampaignsPage currentUser={currentUser} />}
            />
            <Route
              path="/admin/donations"
              element={<AdminDonationsPage currentUser={currentUser} />}
            />
            <Route
              path="/my-donations"
              element={<MyDonationsPage currentUser={currentUser} />}
            />
          </Routes>
        </main>

        {/* Global Footer */}
        <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 text-white p-1 rounded">
                <Heart className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="font-bold text-slate-900">
                GiveHope Donation Portal
              </span>
              <span>
                © {new Date().getFullYear()} GiveHope Inc. All rights reserved.
              </span>
            </div>

            <div className="flex items-center gap-6">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Support</span>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
