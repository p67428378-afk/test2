import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import MembershipsPage from "./pages/MembershipsPage";
import VisitsPage from "./pages/VisitsPage";
import SettingsPage from "./pages/SettingsPage";
import { authService } from "./services/api";
import "./index.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0b1326] text-[#dae2fd] p-8">
          <div className="glass-card p-8 rounded-xl max-w-md text-center">
            <h2 className="text-2xl font-bold text-error mb-4">
              Something went wrong.
            </h2>
            <p className="text-on-surface-variant mb-6">
              Please refresh the page or check the console for details.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-on-primary px-6 py-2 rounded-lg font-bold hover:bg-primary-fixed transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function LoginRegister() {
  const [isLogin, setIsLogin] = React.useState(true);
  const [email, setEmail] = React.useState("test@example.com");
  const [password, setPassword] = React.useState("testpassword");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        await authService.login(email, password);
      } else {
        await authService.register(email, password);
        await authService.login(email, password);
      }
      window.location.href = "/";
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Authentication failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1326] text-[#dae2fd] p-4">
      <div className="glass-card w-full max-w-md p-8 rounded-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded bg-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary-container font-bold">
              fitness_center
            </span>
          </div>
          <span className="font-headline-lg text-2xl font-bold text-primary tracking-tight">
            FitValue
          </span>
        </div>

        <h2 className="text-xl font-bold text-center mb-6 text-on-surface">
          {isLogin ? "Sign In to Your Account" : "Create Your Account"}
        </h2>

        {error && (
          <div className="bg-error-container/20 border border-error-container/30 text-error p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container-high border border-white/10 rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container-high border border-white/10 rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary font-bold py-2.5 rounded-lg hover:bg-primary-fixed transition-colors disabled:opacity-50 shadow-[0_0_15px_rgba(192,193,255,0.2)]"
          >
            {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="text-primary hover:underline"
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"}
          </button>
        </div>

        <div className="mt-6 p-3 bg-surface-container-low rounded-lg border border-white/5 text-center text-xs text-on-surface-variant">
          <p className="font-semibold text-on-surface mb-1">
            Test Account Credentials:
          </p>
          <p>
            Email:{" "}
            <span className="text-primary font-mono">test@example.com</span>
          </p>
          <p>
            Password:{" "}
            <span className="text-primary font-mono">testpassword</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginRegister />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/memberships" element={<MembershipsPage />} />
                  <Route path="/visits" element={<VisitsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
