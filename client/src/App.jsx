import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import StudentDashboard from "./pages/StudentDashboard";
import AnatomyViewerPage from "./pages/AnatomyViewerPage";
import AnimationPlayerPage from "./pages/AnimationPlayerPage";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#f5f7fc] text-[#171f2e]">
        {/* Top Header Navbar */}
        <Navbar />

        {/* Main Application Router View */}
        <main className="flex-1 pb-12">
          <Routes>
            <Route path="/" element={<StudentDashboard />} />
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/anatomy" element={<AnatomyViewerPage />} />
            <Route path="/animation" element={<AnimationPlayerPage />} />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Bottom Medical Portal Footer */}
        <footer className="bg-white border-t border-[#dee3ed] py-6 text-center text-xs text-[#6b758a]">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p>
              © {new Date().getFullYear()} MBBS Digital Learning Platform •
              Designed for 1st Year Medical Students
            </p>
            <div className="flex items-center gap-4 text-[#1466bf] font-medium">
              <span>Anatomy</span>
              <span>•</span>
              <span>Physiology</span>
              <span>•</span>
              <span>Biochemistry</span>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
