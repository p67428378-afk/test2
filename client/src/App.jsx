import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import CustomerPage from "./pages/CustomerPage";
import OperatorPage from "./pages/OperatorPage";
import DriverPage from "./pages/DriverPage";
import AdminPage from "./pages/AdminPage";
import { Droplet, Shield, Truck, Navigation, Activity } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center max-w-md mx-auto my-12 bg-slate-800 border border-slate-700 rounded-xl">
          <h2 className="text-xl font-bold text-rose-400 mb-2">
            Something went wrong
          </h2>
          <p className="text-slate-400 text-sm mb-4">
            An unexpected error occurred while rendering the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-semibold"
          >
            Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400">
        <p>Loading user profile...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div
        role="alert"
        className="p-12 text-center max-w-md mx-auto my-12 bg-slate-800 border border-slate-700 rounded-xl"
      >
        <h2 className="text-xl font-bold text-amber-400 mb-2">
          403 - Access Forbidden
        </h2>
        <p className="text-slate-400 text-sm mb-4">
          Your role ({user.role}) is not authorized to access this portal.
        </p>
        <Link
          to="/"
          className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-semibold inline-block"
        >
          Return to Hub
        </Link>
      </div>
    );
  }

  return children;
};

const RoleHub = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex p-3 bg-sky-500/10 rounded-2xl text-sky-400">
          <Droplet className="w-10 h-10 fill-sky-400" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100">
          AquaFlow Tanker Dispatch Platform
        </h1>
        <p className="text-slate-400 text-base">
          Select your active role workspace to manage water distribution
          operations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          to="/customer"
          className="p-6 bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-emerald-500/50 rounded-xl shadow-lg transition group"
        >
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg w-fit group-hover:scale-110 transition">
            <Droplet className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-100 mt-4">
            Customer Portal
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Book delivery requests, choose volume, and track status.
          </p>
        </Link>

        <Link
          to="/operator"
          className="p-6 bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-blue-500/50 rounded-xl shadow-lg transition group"
        >
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg w-fit group-hover:scale-110 transition">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-100 mt-4">
            Operator Dispatch
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Review pending queue, check fleet capacity, and assign drivers.
          </p>
        </Link>

        <Link
          to="/driver"
          className="p-6 bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-amber-500/50 rounded-xl shadow-lg transition group"
        >
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg w-fit group-hover:scale-110 transition">
            <Navigation className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-100 mt-4">
            Driver Portal
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            View task queue and update delivery lifecycle states.
          </p>
        </Link>

        <Link
          to="/admin"
          className="p-6 bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-purple-500/50 rounded-xl shadow-lg transition group"
        >
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg w-fit group-hover:scale-110 transition">
            <Activity className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-100 mt-4">
            Admin Analytics
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Fleet utilization, surge zones, and operational KPIs.
          </p>
        </Link>
      </div>
    </div>
  );
};

export const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <RoleHub />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customer"
                  element={
                    <ProtectedRoute allowedRoles={["CUSTOMER", "ADMIN"]}>
                      <CustomerPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/operator"
                  element={
                    <ProtectedRoute allowedRoles={["OPERATOR", "ADMIN"]}>
                      <OperatorPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/driver"
                  element={
                    <ProtectedRoute allowedRoles={["DRIVER", "ADMIN"]}>
                      <DriverPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={["ADMIN", "OPERATOR"]}>
                      <AdminPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
