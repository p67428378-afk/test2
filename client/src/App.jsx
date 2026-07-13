import React, { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import { authService } from "./services/api";

export default function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState("login"); // 'login', 'register', 'dashboard'

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setCurrentPage("dashboard");
    }
  }, []);

  const handleLoginSuccess = () => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setCurrentPage("login");
  };

  if (currentPage === "login") {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onNavigateToRegister={() => setCurrentPage("register")}
      />
    );
  }

  if (currentPage === "register") {
    return <RegisterPage onNavigateToLogin={() => setCurrentPage("login")} />;
  }

  if (currentPage === "dashboard") {
    return <DashboardPage onLogout={handleLogout} user={user} />;
  }

  return null;
}
