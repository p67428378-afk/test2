import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DonorDashboard from "./pages/DonorDashboard";
import NGOPortal from "./pages/NGOPortal";
import VolunteerPortal from "./pages/VolunteerPortal";
import AdminConsole from "./pages/AdminConsole";
import { authApi } from "./services/api";

export default function App() {
  const [currentUser, setCurrentUser] = useState(() =>
    authApi.getCurrentUser(),
  );

  useEffect(() => {
    const user = authApi.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar currentUser={currentUser} onLogout={handleLogout} />

        <div className="flex-1">
          <Routes>
            <Route
              path="/login"
              element={<Login onLoginSuccess={handleLoginSuccess} />}
            />
            <Route path="/register" element={<Register />} />

            <Route
              path="/donor"
              element={
                currentUser ? (
                  <DonorDashboard currentUser={currentUser} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/ngo"
              element={
                currentUser ? (
                  <NGOPortal currentUser={currentUser} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/volunteer"
              element={
                currentUser ? (
                  <VolunteerPortal currentUser={currentUser} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/admin"
              element={
                currentUser ? (
                  <AdminConsole currentUser={currentUser} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/"
              element={
                currentUser ? (
                  currentUser.role === "donor" ? (
                    <Navigate to="/donor" replace />
                  ) : currentUser.role === "ngo" ? (
                    <Navigate to="/ngo" replace />
                  ) : currentUser.role === "volunteer" ? (
                    <Navigate to="/volunteer" replace />
                  ) : (
                    <Navigate to="/admin" replace />
                  )
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
