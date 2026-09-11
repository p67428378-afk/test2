import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import ContractDetailPage from "./pages/ContractDetailPage";
import RemindersPage from "./pages/RemindersPage";
import { authService } from "./services/api";
import { FileText, Bell, User, LogIn, LogOut, Shield } from "lucide-react";

function Navbar({ currentUser, onLoginClick, onLogout }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-slate-900 text-white shadow-md border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-bold tracking-tight text-white hover:text-indigo-300"
          >
            <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
              <FileText className="w-5 h-5" />
            </div>
            <span>Vendor Contract Portal</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                isActive("/") || location.pathname.startsWith("/contracts")
                  ? "bg-indigo-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <FileText className="w-4 h-4" />
              Contracts Dashboard
            </Link>

            <Link
              to="/reminders"
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                isActive("/reminders")
                  ? "bg-indigo-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Bell className="w-4 h-4" />
              Renewal Reminders
            </Link>
          </nav>
        </div>

        {/* User Role Badge & Auth */}
        <div className="flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white">
                  {currentUser.full_name || currentUser.email}
                </p>
                <p className="text-[10px] text-indigo-300 font-semibold uppercase tracking-wider">
                  {currentUser.role?.replace("_", " ") || "Procurement Admin"}
                </p>
              </div>

              <span className="p-2 bg-indigo-900/60 border border-indigo-700 text-indigo-300 rounded-full">
                <User className="w-4 h-4" />
              </span>

              <button
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-xs flex items-center gap-1"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              Login / Switch Role
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      onLoginSuccess(data.user);
      onClose();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
          "Authentication failed. Check credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = (roleEmail, rolePw) => {
    setEmail(roleEmail);
    setPassword(rolePw);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
        <div className="p-6 bg-slate-900 text-white">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" /> Contract Portal
            Authentication
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Select a test account role or enter credentials to sign in.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs">
              {error}
            </div>
          )}

          {/* Test Account Quick Switch Chips */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Quick Switch Role Credentials
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() =>
                  handleRoleSelect("test@example.com", "testpassword")
                }
                className={`p-2 rounded-lg border text-left font-medium ${
                  email === "test@example.com"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-900"
                    : "border-slate-200 bg-slate-50 text-slate-700"
                }`}
              >
                Procurement Admin
                <span className="block text-[10px] text-slate-400 font-mono">
                  test@example.com
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleRoleSelect("legal@example.com", "legalpassword")
                }
                className={`p-2 rounded-lg border text-left font-medium ${
                  email === "legal@example.com"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-900"
                    : "border-slate-200 bg-slate-50 text-slate-700"
                }`}
              >
                Legal Approver
                <span className="block text-[10px] text-slate-400 font-mono">
                  legal@example.com
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleRoleSelect("finance@example.com", "financepassword")
                }
                className={`p-2 rounded-lg border text-left font-medium ${
                  email === "finance@example.com"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-900"
                    : "border-slate-200 bg-slate-50 text-slate-700"
                }`}
              >
                Finance Approver
                <span className="block text-[10px] text-slate-400 font-mono">
                  finance@example.com
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleRoleSelect("vendor@example.com", "vendorpassword")
                }
                className={`p-2 rounded-lg border text-left font-medium ${
                  email === "vendor@example.com"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-900"
                    : "border-slate-200 bg-slate-50 text-slate-700"
                }`}
              >
                Vendor Representative
                <span className="block text-[10px] text-slate-400 font-mono">
                  vendor@example.com
                </span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email / Username
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-lg p-2.5"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-lg p-2.5"
            />
          </div>

          <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <strong>Test Account:</strong> test@example.com / testpassword
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // Auto login with default test credentials if token absent or check stored user
    const user = authService.getStoredUser();
    if (user) {
      setCurrentUser(user);
    } else {
      // Auto-authenticate as default test user
      authService
        .login("test@example.com", "testpassword")
        .then((res) => {
          if (res?.user) setCurrentUser(res.user);
        })
        .catch(() => {});
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        {/* Banner with default credentials note */}
        <div className="bg-indigo-900 text-indigo-100 text-xs py-1.5 px-4 text-center font-medium border-b border-indigo-800">
          <span>🔒 Vendor Contract Portal — Seed Test Account: </span>
          <strong className="text-white font-mono bg-indigo-800 px-1.5 py-0.5 rounded ml-1">
            test@example.com / testpassword
          </strong>
        </div>

        <Navbar
          currentUser={currentUser}
          onLoginClick={() => setShowLoginModal(true)}
          onLogout={handleLogout}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/contracts/:id" element={<ContractDetailPage />} />
            <Route path="/reminders" element={<RemindersPage />} />
          </Routes>
        </main>

        <footer className="bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800 text-center">
          <p>
            © 2026 Vendor Contract Management Portal. Enterprise SDLC
            Governance.
          </p>
        </footer>

        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={(user) => setCurrentUser(user)}
        />
      </div>
    </BrowserRouter>
  );
}
