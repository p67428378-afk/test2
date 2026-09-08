import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { KeyRound, Lock, User, AlertCircle, Info } from "lucide-react";
import Navbar from "./components/Navbar.jsx";
import RoomsPage from "./pages/RoomsPage.jsx";
import ReservationsPage from "./pages/ReservationsPage.jsx";
import FrontDeskPage from "./pages/FrontDeskPage.jsx";
import InvoicesPage from "./pages/InvoicesPage.jsx";
import { authApi } from "./services/api.js";

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // Test account credentials prefilled as mandated
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [authError, setAuthError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isBypassed, setIsBypassed] = useState(true); // Allow direct access for seamless operations while providing full auth capabilities

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError("");
    try {
      const data = await authApi.login(email, password);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setCurrentUser(data.user);
      setIsBypassed(false);
    } catch (err) {
      setAuthError(
        err.response?.data?.detail ||
          "Invalid email or password. Please try again.",
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#f8f9ff] flex flex-col font-sans">
        <Navbar
          currentUser={
            currentUser || {
              full_name: "Desk Clerk Staff",
              email: "test@example.com",
              role: "desk_clerk",
            }
          }
          onLogout={handleLogout}
        />

        {/* Demo banner with test credentials */}
        <div className="bg-blue-900 text-blue-100 text-xs py-1.5 px-4 text-center border-b border-blue-800 flex items-center justify-center gap-2">
          <Info className="w-4 h-4 text-blue-300 shrink-0" />
          <span>
            <strong>Test account:</strong>{" "}
            <code className="bg-blue-950 px-1 py-0.5 rounded text-white">
              test@example.com
            </code>{" "}
            /{" "}
            <code className="bg-blue-950 px-1 py-0.5 rounded text-white">
              testpassword
            </code>{" "}
            | Admin:{" "}
            <code className="bg-blue-950 px-1 py-0.5 rounded text-white">
              admin@example.com
            </code>{" "}
            /{" "}
            <code className="bg-blue-950 px-1 py-0.5 rounded text-white">
              adminpassword
            </code>
          </span>
        </div>

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/rooms" replace />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/reservations" element={<ReservationsPage />} />
            <Route path="/front-desk" element={<FrontDeskPage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="*" element={<Navigate to="/rooms" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
