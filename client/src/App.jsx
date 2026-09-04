import React from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

function AppRoutes() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage onNavigateAdmin={() => navigate("/admin")} />}
      />
      <Route
        path="/admin"
        element={<AdminDashboardPage onNavigateHome={() => navigate("/")} />}
      />
      <Route
        path="*"
        element={<HomePage onNavigateAdmin={() => navigate("/admin")} />}
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
