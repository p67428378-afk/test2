import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
} from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import BookShipmentPage from "./pages/BookShipmentPage";
import TrackPackagePage from "./pages/TrackPackagePage";
import AgentManagementPage from "./pages/AgentManagementPage";
import { authService } from "./services/api";
import { Truck, Lock, Mail, User } from "lucide-react";
import "./index.css";

// Error Boundary (MANDATORY per Constitution)
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
          <h2 className="text-2xl font-bold text-rose-600 mb-2">
            Something went wrong.
          </h2>
          <p className="text-gray-600 mb-4">
            Please refresh the page or check the console for details.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Protected Route Component
function ProtectedRoute({ children, allowedRoles = [] }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// Login Page Component
function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("test@example.com"); // Pre-filled default (MANDATORY)
  const [password, setPassword] = React.useState("testpassword"); // Pre-filled default (MANDATORY)
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const data = await authService.login(email, password);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("email", email);

      // Determine role based on email or quick check
      const role = email.includes("admin") ? "admin" : "customer";
      localStorage.setItem("role", role);

      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-gray-200 shadow-lg">
        <div className="text-center">
          <div className="inline-flex p-3 bg-indigo-50 rounded-xl text-indigo-600 mb-4">
            <Truck className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to manage your shipments
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="test@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1.5">
          <p className="font-bold text-slate-700 uppercase tracking-wider">
            Test Accounts:
          </p>
          <p>
            • Customer:{" "}
            <span className="font-mono font-semibold">test@example.com</span> /{" "}
            <span className="font-mono font-semibold">testpassword</span>
          </p>
          <p>
            • Admin:{" "}
            <span className="font-mono font-semibold">admin@example.com</span> /{" "}
            <span className="font-mono font-semibold">adminpassword</span>
          </p>
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

// Register Page Component
function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [role, setRole] = React.useState("customer");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await authService.register(email, password, fullName, role);
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail || "Registration failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-gray-200 shadow-lg">
        <div className="text-center">
          <div className="inline-flex p-3 bg-indigo-50 rounded-xl text-indigo-600 mb-4">
            <Truck className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join SwiftCourier delivery network
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Account Type
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="customer">Customer</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}

// App Component
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["customer", "admin"]}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <BookShipmentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/track"
          element={
            <ProtectedRoute allowedRoles={["customer", "admin"]}>
              <TrackPackagePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agents"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AgentManagementPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// Mount App
const container = document.getElementById("root");
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>,
  );
}
