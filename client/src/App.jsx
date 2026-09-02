import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import Login from "./pages/Login";
import PasswordReset from "./pages/PasswordReset";
import { authService } from "./services/api";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("access_token");
    if (token) {
      authService
        .getMe()
        .then((userData) => setUser(userData))
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("access_token");
        });
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <Login initialTab="signin" onLoginSuccess={handleLoginSuccess} />
          }
        />
        <Route
          path="/signup"
          element={
            <Login initialTab="signup" onLoginSuccess={handleLoginSuccess} />
          }
        />
        <Route path="/password-reset" element={<PasswordReset />} />
        <Route
          path="/dashboard"
          element={<DashboardPage user={user} onLogout={handleLogout} />}
        />
        <Route
          path="*"
          element={<DashboardPage user={user} onLogout={handleLogout} />}
        />
      </Routes>
    </Router>
  );
}
