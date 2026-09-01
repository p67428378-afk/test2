import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import TaskDashboardPage from "./pages/TaskDashboardPage";

function App() {
  const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };

  return (
    <BrowserRouter>
      <div className="bg-slate-50 text-slate-900 min-h-screen">
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<TaskDashboardPage />} />
          <Route path="/projects" element={<TaskDashboardPage />} />
          <Route path="/tasks" element={<TaskDashboardPage />} />
          <Route
            path="/"
            element={
              isAuthenticated() ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/signup" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
