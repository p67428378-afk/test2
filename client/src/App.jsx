import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ParentPage from "./pages/ParentPage";
import { authService } from "./services/api";

// Protected Route component for Parent Portal
const ParentRoute = ({ children }) => {
  const user = authService.getCurrentUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== "parent") {
    return <Navigate to="/" replace />;
  }
  return children;
};

// Protected Route component for Kid Dashboard
const KidRoute = ({ children }) => {
  const user = authService.getCurrentUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <KidRoute>
              <DashboardPage />
            </KidRoute>
          }
        />
        <Route
          path="/parent"
          element={
            <ParentRoute>
              <ParentPage />
            </ParentRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
