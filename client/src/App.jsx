import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  Link,
} from "react-router-dom";
import { AlertCircle, Fingerprint, Shield, User, Lock } from "lucide-react";
import { authService, caseService, evidenceService } from "./services/api";
import AppLayout from "./components/layout/AppLayout.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import CaseDetailPage from "./pages/CaseDetailPage.jsx";
import EvidenceDetailPage from "./pages/EvidenceDetailPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import Button from "./components/common/Button.jsx";

// Protected Route Component
function ProtectedRoute({ children, allowedRoles = [] }) {
  const currentUser = authService.getCurrentUser();
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// Login Page Component
function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authService.login(username, password);
      onLoginSuccess();
      navigate("/");
    } catch (err) {
      console.error("Login failed", err);
      setError(err.response?.data?.detail || "Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] px-4">
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-8 w-full max-w-md shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-[#c0c1ff]/10 rounded-full text-[#c0c1ff] mb-2">
            <Fingerprint className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold text-[#dae2fd]">DEMS Portal</h2>
          <p className="text-sm text-[#c7c4d7]">
            Digital Evidence Management System
          </p>
        </div>

        {error && (
          <div className="bg-[#93000a]/20 border border-[#ffb4ab] text-[#ffb4ab] p-3 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#c7c4d7] mb-1">
              Username / Email
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c7c4d7] h-4 w-4" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#0F172A] border border-[#334155] rounded-md py-2 pl-10 pr-4 text-sm text-[#dae2fd] focus:outline-none focus:border-[#c0c1ff]"
                placeholder="test@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#c7c4d7] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c7c4d7] h-4 w-4" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0F172A] border border-[#334155] rounded-md py-2 pl-10 pr-4 text-sm text-[#dae2fd] focus:outline-none focus:border-[#c0c1ff]"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full py-2.5"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        {/* Test Credentials Note */}
        <div className="bg-[#2d3449] border border-[#464554] rounded-lg p-4 text-xs text-[#c7c4d7] space-y-2">
          <p className="font-semibold text-[#c0c1ff]">
            Test Accounts Available:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="font-medium text-[#dae2fd]">Investigator:</p>
              <p>test@example.com</p>
              <p>testpassword</p>
            </div>
            <div>
              <p className="font-medium text-[#dae2fd]">Administrator:</p>
              <p>admin@example.com</p>
              <p>adminpassword</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/register"
            className="text-xs text-[#c0c1ff] hover:underline"
          >
            Need an account? Register here
          </Link>
        </div>
      </div>
    </div>
  );
}

// Register Page Component
function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [roleName, setRoleName] = useState("Investigator");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      await authService.register(username, password, roleName);
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Registration failed", err);
      setError(
        err.response?.data?.detail ||
          "Registration failed. Username might already exist.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] px-4">
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-8 w-full max-w-md shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-[#c0c1ff]/10 rounded-full text-[#c0c1ff] mb-2">
            <Fingerprint className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold text-[#dae2fd]">Create Account</h2>
          <p className="text-sm text-[#c7c4d7]">Register for DEMS Portal</p>
        </div>

        {error && (
          <div className="bg-[#93000a]/20 border border-[#ffb4ab] text-[#ffb4ab] p-3 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-[#00a572]/20 border border-[#4edea3] text-[#4edea3] p-3 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>Registration successful! Redirecting to login...</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#c7c4d7] mb-1">
              Username / Email
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c7c4d7] h-4 w-4" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#0F172A] border border-[#334155] rounded-md py-2 pl-10 pr-4 text-sm text-[#dae2fd] focus:outline-none focus:border-[#c0c1ff]"
                placeholder="investigator@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#c7c4d7] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c7c4d7] h-4 w-4" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0F172A] border border-[#334155] rounded-md py-2 pl-10 pr-4 text-sm text-[#dae2fd] focus:outline-none focus:border-[#c0c1ff]"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#c7c4d7] mb-1">
              Role
            </label>
            <select
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full bg-[#0F172A] border border-[#334155] rounded-md p-2 text-sm text-[#dae2fd] focus:outline-none focus:border-[#c0c1ff]"
            >
              <option value="Investigator">Investigator</option>
              <option value="Analyst">Analyst</option>
              <option value="Administrator">Administrator</option>
            </select>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full py-2.5"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>

        <div className="text-center">
          <Link to="/login" className="text-xs text-[#c0c1ff] hover:underline">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [cases, setCases] = useState([]);
  const [evidenceList, setEvidenceList] = useState([]);
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated(),
  );

  const fetchData = async () => {
    if (!authService.isAuthenticated()) return;
    try {
      // Fetch cases
      const fetchedCases = await caseService.getCases();
      setCases(fetchedCases);

      // Fetch evidence for all cases and combine them
      const allEvidence = [];
      for (const c of fetchedCases) {
        const evidence = await caseService.getCaseEvidence(c.id);
        // Add case_id to each evidence item
        const mappedEvidence = evidence.map((e) => ({ ...e, case_id: c.id }));
        allEvidence.push(...mappedEvidence);
      }

      // Also check if there are any unassigned evidence files stored in localStorage
      const localUnassigned = JSON.parse(
        localStorage.getItem("unassigned_evidence") || "[]",
      );

      // Filter out any local unassigned evidence that has since been assigned to a case
      const filteredLocal = localUnassigned.filter(
        (le) => !allEvidence.some((ae) => ae.filename === le.filename),
      );

      setEvidenceList([...allEvidence, ...filteredLocal]);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout
                onNewCaseClick={() => setShowNewCaseModal(true)}
                onUploadEvidenceClick={() => setShowUploadModal(true)}
              >
                <Routes>
                  <Route
                    path="/"
                    element={
                      <DashboardPage
                        showNewCaseModal={showNewCaseModal}
                        setShowNewCaseModal={setShowNewCaseModal}
                        showUploadModal={showUploadModal}
                        setShowUploadModal={setShowUploadModal}
                        cases={cases}
                        setCases={setCases}
                        evidenceList={evidenceList}
                        setEvidenceList={setEvidenceList}
                        fetchData={fetchData}
                      />
                    }
                  />
                  <Route
                    path="/cases/:id"
                    element={
                      <CaseDetailPage
                        cases={cases}
                        evidenceList={evidenceList}
                        fetchData={fetchData}
                      />
                    }
                  />
                  <Route
                    path="/evidence/:id"
                    element={
                      <EvidenceDetailPage cases={cases} fetchData={fetchData} />
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute allowedRoles={["Administrator"]}>
                        <AdminPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
