import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import CustomerDashboard from "./pages/CustomerDashboard";
import OperatorPortal from "./pages/OperatorPortal";
import DriverPortal from "./pages/DriverPortal";
import Login from "./pages/Login";
import { authAPI } from "./services/api";

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const token = localStorage.getItem("token");
    return token ? { email: "test@example.com", full_name: "Test User" } : null;
  });

  const handleLogout = () => {
    authAPI.logout();
    setCurrentUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
        <Navbar currentUser={currentUser} onLogout={handleLogout} />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<CustomerDashboard />} />
            <Route path="/customer" element={<CustomerDashboard />} />
            <Route path="/operator" element={<OperatorPortal />} />
            <Route path="/driver" element={<DriverPortal />} />
            <Route
              path="/login"
              element={
                <Login onLoginSuccess={(user) => setCurrentUser(user)} />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          <p>
            © 2026 SpinCycle Pro Laundry Management Platform • End-to-End
            Service Core
          </p>
        </footer>
      </div>
    </Router>
  );
}
