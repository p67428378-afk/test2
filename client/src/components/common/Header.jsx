import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, User, LogOut, Search, LogIn, Sparkles } from "lucide-react";
import { loginUser, registerUser, logoutUser } from "../../services/api";

export default function Header({ searchQuery, setSearchQuery }) {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [fullName, setFullName] = useState("Test User");
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user_info");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        // ignore
      }
    }
  }, []);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setLoading(true);
    try {
      let data;
      if (isRegister) {
        data = await registerUser(email, fullName, password);
      } else {
        data = await loginUser(email, password);
      }
      setUser(data.user);
      setShowAuthModal(false);
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        "Authentication failed. Please check your credentials.";
      setAuthError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <header className="bg-primary text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-primary shadow-inner group-hover:scale-105 transition-transform">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white block">
                CrateCurate
              </span>
              <span className="text-xs text-slate-300 font-sans tracking-wide block -mt-1">
                Subscription Box Finder
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          {setSearchQuery && (
            <div className="flex-1 max-w-md mx-8 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search curations, themes, boxes..."
                  value={searchQuery || ""}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-slate-800"
                />
              </div>
            </div>
          )}

          {/* User Auth Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                  <User className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-medium text-slate-200">
                    {user.full_name || user.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-primary font-semibold px-4 py-2 rounded-full text-sm transition-all shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-lg"
            >
              ✕
            </button>
            <div className="text-center mb-6">
              <div className="inline-flex p-3 rounded-2xl bg-amber-100 text-amber-700 mb-2">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-slate-900">
                {isRegister ? "Create Account" : "Subscriber Sign In"}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {isRegister
                  ? "Join CrateCurate to leave reviews and save favorites"
                  : "Sign in to leave reviews and ratings"}
              </p>
            </div>

            {/* Test Credentials Note */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-xs text-amber-900">
              <span className="font-semibold block">
                Test Credentials pre-filled:
              </span>
              <code className="bg-amber-100/70 px-1 py-0.5 rounded">
                email: test@example.com
              </code>{" "}
              /{" "}
              <code className="bg-amber-100/70 px-1 py-0.5 rounded">
                password: testpassword
              </code>
            </div>

            {authError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-4">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder="Jane Doe"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="test@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-primary hover:bg-slate-800 text-white rounded-lg font-medium text-sm transition-colors shadow-sm disabled:opacity-50"
              >
                {loading
                  ? "Processing..."
                  : isRegister
                    ? "Register Account"
                    : "Sign In"}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setAuthError("");
                }}
                className="text-xs text-primary font-semibold hover:underline"
              >
                {isRegister
                  ? "Already have an account? Sign In"
                  : "Don't have an account? Register"}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
