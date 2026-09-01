import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import VisitorPortalPage from "./pages/VisitorPortalPage";
import AdminApprovalsPage from "./pages/AdminApprovalsPage";
import SecurityGatePage from "./pages/SecurityGatePage";
import VisitorHistoryPage from "./pages/VisitorHistoryPage";
import {
  Shield,
  UserPlus,
  CheckSquare,
  ShieldAlert,
  History,
} from "lucide-react";

const App = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Application Header */}
      <header className="bg-slate-900 text-white shadow-md border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-700 text-white rounded-lg">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight text-white">
                  Prison Visitor Management
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs bg-blue-900 text-blue-200 px-2 py-0.5 rounded font-mono">
                  v1.0.0
                </span>
              </div>
            </div>

            {/* Navigation Bar */}
            <nav className="flex items-center space-x-1 sm:space-x-2">
              <Link
                to="/"
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center space-x-1.5 ${
                  isActive("/")
                    ? "bg-blue-800 text-white shadow-inner"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden md:inline">Visitor Portal</span>
              </Link>

              <Link
                to="/admin"
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center space-x-1.5 ${
                  isActive("/admin")
                    ? "bg-blue-800 text-white shadow-inner"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                <span className="hidden md:inline">Admin Approvals</span>
              </Link>

              <Link
                to="/gate"
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center space-x-1.5 ${
                  isActive("/gate")
                    ? "bg-amber-600 text-slate-950 font-bold shadow-inner"
                    : "text-amber-400 hover:text-amber-300 hover:bg-slate-800"
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span className="hidden md:inline">Gate Control</span>
              </Link>

              <Link
                to="/history"
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center space-x-1.5 ${
                  isActive("/history")
                    ? "bg-blue-800 text-white shadow-inner"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                <History className="w-4 h-4" />
                <span className="hidden md:inline">History Audit</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<VisitorPortalPage />} />
          <Route path="/admin" element={<AdminApprovalsPage />} />
          <Route path="/gate" element={<SecurityGatePage />} />
          <Route path="/history" element={<VisitorHistoryPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-4 text-center text-xs font-mono">
        <div>
          Correctional Facility Visitor Management & Security Control &copy;{" "}
          {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default App;
