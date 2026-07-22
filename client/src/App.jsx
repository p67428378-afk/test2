import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { authService } from "./services/api";
import AppLayout from "./components/layout/AppLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import HiveDetailPage from "./pages/HiveDetailPage";
import InspectionsPage from "./pages/InspectionsPage";

export default function App() {
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      if (!authService.isAuthenticated()) {
        try {
          await authService.refreshToken();
        } catch {
          // Ignore error, user is just not logged in or cookie expired
        }
      }
      setCheckingSession(false);
    };
    checkSession();
  }, []);

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-beekeeper-bg flex items-center justify-center text-beekeeper-amber">
        <div className="flex flex-col items-center gap-md">
          <span className="material-symbols-outlined animate-spin text-[48px]">
            sync
          </span>
          <span className="font-label-md text-label-md uppercase tracking-wider">
            Restoring Session...
          </span>
        </div>
      </div>
    );
  }

  function ProtectedRoute({ children }) {
    const isAuthenticated = authService.isAuthenticated();
    return isAuthenticated ? (
      <AppLayout>{children}</AppLayout>
    ) : (
      <Navigate to="/login" replace />
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hives/:hiveId"
          element={
            <ProtectedRoute>
              <HiveDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inspections"
          element={
            <ProtectedRoute>
              <InspectionsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
