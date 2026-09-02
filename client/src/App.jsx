import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("access_token");
          setUser(null);
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

  const isAuthenticated = Boolean(
    user ||
    localStorage.getItem("token") ||
    localStorage.getItem("access_token"),
  );

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
          element={
            isAuthenticated ? (
              <DashboardPage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <DashboardPage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <DashboardPage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}
