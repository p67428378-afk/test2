import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import JobBoardSearchPage from "./pages/JobBoardSearchPage";
import JobApplicationPage from "./pages/JobApplicationPage";
import PostAJobPage from "./pages/PostAJobPage";
import EmployerDashboard from "./pages/EmployerDashboard";
import LoginPage from "./pages/LoginPage";

// Protected route component for employer-only pages
function EmployerRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#f7fafc] flex flex-col">
        <Navbar />
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<JobBoardSearchPage />} />
            <Route path="/jobs/:id/apply" element={<JobApplicationPage />} />
            <Route
              path="/post-job"
              element={
                <EmployerRoute>
                  <PostAJobPage />
                </EmployerRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <EmployerRoute>
                  <EmployerDashboard />
                </EmployerRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
