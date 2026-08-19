import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import LoginPage from "./pages/LoginPage";
import OrganizerDashboardPage from "./pages/OrganizerDashboardPage";
import SpeakerSubmissionPage from "./pages/SpeakerSubmissionPage";
import ReviewerPortalPage from "./pages/ReviewerPortalPage";
import AttendeeAgendaPage from "./pages/AttendeeAgendaPage";
import AttendanceTrackerPage from "./pages/AttendanceTrackerPage";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#f7fafc] flex flex-col font-sans">
        <Navbar currentUser={currentUser} onLogout={handleLogout} />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/organizer" replace />} />
            <Route
              path="/login"
              element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
            />
            <Route path="/organizer" element={<OrganizerDashboardPage />} />
            <Route path="/speaker" element={<SpeakerSubmissionPage />} />
            <Route path="/reviewer" element={<ReviewerPortalPage />} />
            <Route path="/agenda" element={<AttendeeAgendaPage />} />
            <Route path="/attendance" element={<AttendanceTrackerPage />} />
            <Route path="*" element={<Navigate to="/organizer" replace />} />
          </Routes>
        </main>

        <footer className="bg-white border-t border-[#e3e8f0] py-6 text-center text-xs text-[#707a8c]">
          <div className="max-w-7xl mx-auto px-4">
            <p>
              &copy; 2026 Conference Management System (ConfManage). All rights
              reserved.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}
