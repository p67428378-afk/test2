import React, { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import { authService } from "./services/api";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState("login"); // 'login', 'register', 'dashboard'

  useEffect(() => {
    const auth = authService.isAuthenticated();
    setIsAuthenticated(auth);
    if (auth) {
      setCurrentPage("dashboard");
    } else {
      setCurrentPage("login");
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setCurrentPage("login");
  };

  const handleRegisterSuccess = () => {
    setCurrentPage("login");
  };

  if (currentPage === "dashboard" && isAuthenticated) {
    return <DashboardPage onLogout={handleLogout} />;
  }

  if (currentPage === "register") {
    return (
      <RegisterPage
        onRegisterSuccess={handleRegisterSuccess}
        onNavigateToLogin={() => setCurrentPage("login")}
      />
    );
  }

  return (
    <LoginPage
      onLoginSuccess={handleLoginSuccess}
      onNavigateToRegister={() => setCurrentPage("register")}
    />
  );
}
