import React, { useState } from "react";
import AppLayout from "./components/layout/AppLayout";
import WorklistPage from "./pages/WorklistPage";
import { authService } from "./services/api";

// Simple Error Boundary
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
        <div
          style={{
            padding: "2rem",
            backgroundColor: "#020617",
            color: "#ffb4ab",
            minHeight: "100vh",
          }}
        >
          <h2>Something went wrong. Check console.</h2>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#6366F1",
              color: "white",
              borderRadius: "0.5rem",
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function LoginView({ onLoginSuccess }) {
  const [username, setUsername] = useState("testuser");
  const [password, setPassword] = useState("testpassword");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await authService.login(username, password);
      onLoginSuccess();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-4">
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl max-w-md w-full p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <h1 className="font-display-lg text-3xl font-bold text-primary">
            WorkSync
          </h1>
          <p className="text-on-surface-variant">
            Sign in to manage your worklist
          </p>
        </div>

        {error && (
          <div className="bg-error-container/20 border border-error-container text-error p-3 rounded-lg text-body-md text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block font-label-md text-label-md text-on-surface-variant">
              Username
            </label>
            <input
              required
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary-fixed-dim"
            />
          </div>

          <div className="space-y-1">
            <label className="block font-label-md text-label-md text-on-surface-variant">
              Password
            </label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary-fixed-dim"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#6366F1] hover:bg-primary-container text-white rounded-lg py-2.5 font-title-md text-title-md font-semibold transition-colors disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="bg-surface-container-low border border-outline-variant/30 rounded-lg p-3 text-center space-y-1">
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            Test Account Credentials
          </p>
          <p className="font-body-md text-body-md text-primary font-semibold">
            testuser / testpassword
          </p>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated(),
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentTab, setCurrentTab] = useState("worklist");
  const [isWsConnected, setIsWsConnected] = useState(true); // Default to true, updated by page

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <AppLayout
      onCreateTaskClick={() => setShowCreateModal(true)}
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
      isWsConnected={isWsConnected}
      user={{ username: "testuser" }}
      onLogout={handleLogout}
    >
      {currentTab === "worklist" && (
        <WorklistPage
          showCreateModal={showCreateModal}
          setShowCreateModal={setShowCreateModal}
        />
      )}
      {currentTab === "analytics" && (
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-8 text-center text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-2">
            bar_chart
          </span>
          <h3 className="font-title-lg text-title-lg font-bold text-on-surface mb-1">
            Analytics Dashboard
          </h3>
          <p>Analytics and reporting features are coming soon!</p>
        </div>
      )}
      {currentTab === "settings" && (
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-8 text-center text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-2">
            settings
          </span>
          <h3 className="font-title-lg text-title-lg font-bold text-on-surface mb-1">
            Settings
          </h3>
          <p>Configure your WorkSync preferences here.</p>
        </div>
      )}
    </AppLayout>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
