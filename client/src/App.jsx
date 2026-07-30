import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RestaurantDashboardPage from "./pages/RestaurantDashboardPage";
import NGODashboardPage from "./pages/NGODashboardPage";
import VolunteerDashboardPage from "./pages/VolunteerDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import { authService } from "./services/api";

function ProtectedRoute({ children, allowedRoles }) {
  const user = authService.getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/restaurant/*"
          element={
            <ProtectedRoute allowedRoles={["restaurant"]}>
              <RestaurantDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ngo/*"
          element={
            <ProtectedRoute allowedRoles={["ngo"]}>
              <NGODashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/volunteer/*"
          element={
            <ProtectedRoute allowedRoles={["volunteer"]}>
              <VolunteerDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
