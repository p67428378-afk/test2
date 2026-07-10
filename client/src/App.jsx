import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import VisitorDashboard from "./pages/VisitorDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import SecurityConsole from "./pages/SecurityConsole.jsx";
import { authService } from "./services/api";

function ProtectedRoute({ children, allowedRoles }) {
  const user = authService.getCurrentUser();

  if (!user.token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their default dashboard if role is not allowed
    if (user.role === "visitor")
      return <Navigate to="/visitor-dashboard" replace />;
    if (user.role === "staff")
      return <Navigate to="/admin-dashboard" replace />;
    if (user.role === "security")
      return <Navigate to="/security-console" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/visitor-dashboard"
              element={
                <ProtectedRoute allowedRoles={["visitor"]}>
                  <VisitorDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={["staff"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/security-console"
              element={
                <ProtectedRoute allowedRoles={["security"]}>
                  <SecurityConsole />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
