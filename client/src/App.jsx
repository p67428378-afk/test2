import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import DiscoverPage from "./pages/DiscoverPage";
import FavoritesPage from "./pages/FavoritesPage";
import { authService } from "./services/api";
import Button from "./components/common/Button";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authService.login(email, password);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.detail || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="bg-white border border-[#e3e8f0] rounded-2xl p-8 shadow-sm max-w-md w-full flex flex-col gap-6">
        <div className="text-center">
          <h2 className="font-bold text-[#171c29] text-2xl">Welcome Back</h2>
          <p className="text-[#707a8c] text-sm mt-1">
            Log in to save your favorite quotes
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#707a8c]">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-[#e3e8f0] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#2663eb]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#707a8c]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-[#e3e8f0] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#2663eb]"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full mt-2"
          >
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </form>

        <div className="bg-[#f2f5fa] border border-[#e3e8f0] p-4 rounded-xl text-xs text-[#707a8c] flex flex-col gap-1">
          <p className="font-bold text-[#171c29]">
            💡 Test Account Credentials:
          </p>
          <p>
            Email:{" "}
            <span className="font-mono font-semibold text-[#2663eb]">
              test@example.com
            </span>
          </p>
          <p>
            Password:{" "}
            <span className="font-mono font-semibold text-[#2663eb]">
              testpassword
            </span>
          </p>
        </div>

        <p className="text-center text-xs text-[#707a8c]">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-[#2663eb] font-semibold hover:underline"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authService.register(email, password, fullName);
      // Auto login after register
      await authService.login(email, password);
      navigate("/");
    } catch (err) {
      console.error("Register error:", err);
      setError(
        err.response?.data?.detail || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="bg-white border border-[#e3e8f0] rounded-2xl p-8 shadow-sm max-w-md w-full flex flex-col gap-6">
        <div className="text-center">
          <h2 className="font-bold text-[#171c29] text-2xl">Create Account</h2>
          <p className="text-[#707a8c] text-sm mt-1">
            Join QuoteGen to start saving favorites
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#707a8c]">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="border border-[#e3e8f0] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#2663eb]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#707a8c]">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-[#e3e8f0] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#2663eb]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#707a8c]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-[#e3e8f0] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#2663eb]"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full mt-2"
          >
            {loading ? "Creating account..." : "Register"}
          </Button>
        </form>

        <p className="text-center text-xs text-[#707a8c]">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-[#2663eb] font-semibold hover:underline"
          >
            Log in here
          </button>
        </p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const user = authService.getCurrentUser();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#f7fafc]">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 md:px-8">
          <Routes>
            <Route path="/" element={<DiscoverPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <FavoritesPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
