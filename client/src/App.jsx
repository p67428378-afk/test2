import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/Login";
import ResumeBuilderPage from "./pages/ResumeBuilderPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import TopNavBar from "./components/layout/TopNavBar";

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-600">
        <div className="flex items-center space-x-3 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">
            Loading Quick CV application...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <TopNavBar />
      <main className="flex-1 flex flex-col">
        <Routes>
          {/* Default root route: directly renders Login for unauthenticated users, redirects to Builder when authenticated */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/builder" replace />
              ) : (
                <LoginPage />
              )
            }
          />

          {/* Explicit Login route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Resume Builder route */}
          <Route
            path="/builder"
            element={
              <ProtectedRoute>
                <ResumeBuilderPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
