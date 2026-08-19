import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/common/Navbar.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import LogsPage from "./pages/LogsPage.jsx";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#f7fafc] flex flex-col font-sans">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/logs" element={<LogsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-[#e3e8f0] py-4 text-center text-xs text-[#707a8c]">
          WiFi Maintenance Tracker &copy; {new Date().getFullYear()} —
          Enterprise Infrastructure Management
        </footer>
      </div>
    </Router>
  );
}
