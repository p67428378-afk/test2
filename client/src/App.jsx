import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ImportExportPage from "./pages/ImportExportPage";
import PasswordGeneratorPage from "./pages/PasswordGeneratorPage";
import { authService } from "./services/api";

const ProtectedRoute = ({ children, onLock, countdown }) => {
  const user = authService.getCurrentUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return (
    <AppLayout onLock={onLock} countdown={countdown}>
      {children}
    </AppLayout>
  );
};

function App() {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes auto-lock
  const [toast, setToast] = useState(null);

  // Auto-lock timer
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          authService.logout();
          window.location.href = "/login";
          return 300;
        }
        return prev - 1;
      });
    }, 1000);

    // Reset timer on user activity
    const resetTimer = () => setTimeLeft(300);
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    return () => {
      clearInterval(timer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, [timeLeft]);

  const handleLock = () => {
    authService.logout();
    window.location.href = "/login";
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Clipboard copy with auto-clear after 30 seconds
  const handleCopy = (text, label = "Item") => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setToast(`${label} copied to clipboard! Will clear in 30s.`);

    setTimeout(() => {
      navigator.clipboard.writeText("");
      setToast(null);
    }, 30000);
  };

  return (
    <Router>
      <div className="relative h-screen overflow-hidden bg-[#0b1326]">
        {/* Toast Notification */}
        {toast && (
          <div className="fixed bottom-4 right-4 bg-[#10b981] text-[#003824] px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 border border-[#4edea3]/20 animate-bounce">
            <span className="material-symbols-outlined text-sm">
              check_circle
            </span>
            <span className="text-xs font-semibold">{toast}</span>
          </div>
        )}

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute
                onLock={handleLock}
                countdown={formatTime(timeLeft)}
              >
                <DashboardPage onCopy={handleCopy} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/generator"
            element={
              <ProtectedRoute
                onLock={handleLock}
                countdown={formatTime(timeLeft)}
              >
                <PasswordGeneratorPage onCopy={handleCopy} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/import-export"
            element={
              <ProtectedRoute
                onLock={handleLock}
                countdown={formatTime(timeLeft)}
              >
                <ImportExportPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
