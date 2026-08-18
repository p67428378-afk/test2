import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import CatalogPage from "./pages/CatalogPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import AdminSchedulePage from "./pages/AdminSchedulePage";
import GuideAttendancePage from "./pages/GuideAttendancePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <MyBookingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/schedules"
            element={
              <ProtectedRoute allowedRoles={["Administrator"]}>
                <AdminSchedulePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guide/attendance"
            element={
              <ProtectedRoute allowedRoles={["Guide", "Administrator"]}>
                <GuideAttendancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guide/attendance/:scheduleId"
            element={
              <ProtectedRoute allowedRoles={["Guide", "Administrator"]}>
                <GuideAttendancePage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
