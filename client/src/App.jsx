import React, { useState, useEffect } from "react";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import CredentialsTable from "./components/dashboard/CredentialsTable";
import PasswordGenerator from "./components/dashboard/PasswordGenerator";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import { authService, credentialsService } from "./services/api";
import {
  ShieldAlert,
  ShieldCheck,
  Folder,
  X,
  Save,
  AlertCircle,
} from "lucide-react";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated(),
  );
  const [authView, setAuthView] = useState("login"); // 'login' or 'register'
  const [activeTab, setActiveTab] = useState("vault"); // 'vault', 'generator', 'audit', 'settings'
  const [credentials, setCredentials] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userEmail, setUserEmail] = useState(authService.getEmail());

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [modalForm, setModalForm] = useState({
    title: "",
    username: "",
    password: "",
    url: "",
  });
  const [modalError, setModalError] = useState("");

  // Fetch credentials when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCredentials();
      setUserEmail(authService.getEmail());
    }
  }, [isAuthenticated]);

  const fetchCredentials = async () => {
    try {
      const data = await credentialsService.getAll();
      setCredentials(data);
    } catch (err) {
      console.error("Failed to fetch credentials:", err);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setCredentials([]);
  };

  const handleAddClick = () => {
    setModalMode("add");
    setModalForm({ title: "", username: "", password: "", url: "" });
    setModalError("");
    setIsModalOpen(true);
  };

  const handleEditClick = (cred) => {
    setModalMode("edit");
    setSelectedCredential(cred);
    setModalForm({
      title: cred.title,
      username: cred.username,
      password: cred.password,
      url: cred.url || "",
    });
    setModalError("");
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this credential?",
      )
    ) {
      try {
        await credentialsService.delete(id);
        fetchCredentials();
      } catch (err) {
        console.error("Failed to delete credential:", err);
      }
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setModalError("");

    if (!modalForm.title || !modalForm.username || !modalForm.password) {
      setModalError("Title, Username, and Password are required.");
      return;
    }

    try {
      if (modalMode === "add") {
        await credentialsService.create(modalForm);
      } else {
        await credentialsService.update(selectedCredential.id, modalForm);
      }
      setIsModalOpen(false);
      fetchCredentials();
    } catch (err) {
      console.error("Failed to save credential:", err);
      setModalError(
        err.response?.data?.detail || "An error occurred while saving.",
      );
    }
  };

  const handleSaveGeneratedPassword = (generatedPassword) => {
    setModalMode("add");
    setModalForm({
      title: "",
      username: "",
      password: generatedPassword,
      url: "",
    });
    setModalError("");
    setActiveTab("vault");
    setIsModalOpen(true);
  };

  // Filter credentials based on search query
  const filteredCredentials = credentials.filter((cred) => {
    const query = searchQuery.toLowerCase();
    return (
      cred.title.toLowerCase().includes(query) ||
      cred.username.toLowerCase().includes(query) ||
      (cred.url && cred.url.toLowerCase().includes(query))
    );
  });

  // Calculate security metrics
  const totalCredentials = credentials.length;

  const getPasswordStrength = (password) => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return Math.min(score, 4);
  };

  const averageStrength =
    credentials.length > 0
      ? credentials.reduce(
          (acc, cred) => acc + getPasswordStrength(cred.password),
          0,
        ) / credentials.length
      : 0;

  const securityScore =
    credentials.length > 0 ? Math.round((averageStrength / 4) * 100) : 100;

  const compromisedCount = credentials.filter(
    (cred) => cred.password.length < 8,
  ).length;

  if (!isAuthenticated) {
    if (authView === "login") {
      return (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onNavigateToRegister={() => setAuthView("register")}
        />
      );
    } else {
      return (
        <Register
          onRegisterSuccess={() => setAuthView("login")}
          onNavigateToLogin={() => setAuthView("login")}
        />
      );
    }
  }

  return (
    <div className="antialiased min-h-screen flex overflow-hidden bg-[#090D16]">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        userEmail={userEmail}
      />

      <div className="flex-1 ml-[260px] flex flex-col h-screen">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onAddClick={handleAddClick}
        />

        <main className="flex-1 overflow-y-auto pt-[88px] px-lg pb-lg">
          <div className="max-w-container-max mx-auto space-y-md">
            {activeTab === "vault" && (
              <>
                {/* Row 1: KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                  {/* KPI 1 */}
                  <div className="cyber-card rounded-xl p-md flex flex-col justify-between h-[140px]">
                    <div className="flex justify-between items-start">
                      <span className="font-label-md text-label-md text-on-surface-variant">
                        Total Credentials
                      </span>
                      <Folder className="text-outline-variant w-5 h-5" />
                    </div>
                    <div className="flex items-end justify-between">
                      <div className="font-headline-lg text-headline-lg text-on-surface">
                        {totalCredentials}
                      </div>
                      <div className="font-label-md text-label-md text-on-surface-variant/70 mb-1">
                        entries
                      </div>
                    </div>
                  </div>

                  {/* KPI 2 */}
                  <div className="cyber-card rounded-xl p-md flex flex-col justify-between h-[140px] relative overflow-hidden">
                    <div className="flex justify-between items-start relative z-10">
                      <span className="font-label-md text-label-md text-on-surface-variant">
                        Security Score
                      </span>
                      <ShieldCheck className="text-secondary-container w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-4 relative z-10 mt-auto">
                      <div className="relative w-12 h-12 flex items-center justify-center">
                        <svg
                          className="w-full h-full transform -rotate-90"
                          viewBox="0 0 36 36"
                        >
                          <path
                            className="text-surface-variant"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          ></path>
                          <path
                            className="text-secondary-container"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeDasharray={`${securityScore}, 100`}
                            strokeLinecap="round"
                            strokeWidth="3"
                            style={{
                              filter:
                                "drop-shadow(0 0 4px rgba(16, 185, 129, 0.6))",
                            }}
                          ></path>
                        </svg>
                        <span className="absolute font-label-md text-label-md font-bold text-secondary-container">
                          {securityScore}
                        </span>
                      </div>
                      <div className="font-headline-md text-headline-md text-on-surface">
                        {securityScore >= 80
                          ? "Excellent"
                          : securityScore >= 50
                            ? "Moderate"
                            : "Weak"}
                      </div>
                    </div>
                    <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-secondary-container/5 rounded-full blur-2xl"></div>
                  </div>

                  {/* KPI 3 */}
                  <div className="cyber-card rounded-xl p-md flex flex-col justify-between h-[140px] border-secondary-container/30">
                    <div className="flex justify-between items-start">
                      <span className="font-label-md text-label-md text-on-surface-variant">
                        Weak Passwords
                      </span>
                      <ShieldAlert
                        className={`w-5 h-5 ${compromisedCount > 0 ? "text-error" : "text-secondary-container"}`}
                      />
                    </div>
                    <div className="flex items-end gap-3">
                      <div
                        className={`font-headline-lg text-headline-lg ${compromisedCount > 0 ? "text-error" : "text-secondary-container"}`}
                      >
                        {compromisedCount}
                      </div>
                      <div
                        className={`font-body-md text-body-md mb-1.5 flex items-center gap-1 ${compromisedCount > 0 ? "text-error/80" : "text-secondary-container/80"}`}
                      >
                        <span>
                          {compromisedCount > 0
                            ? "Needs Attention"
                            : "All Secure"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 2: Main Split Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-md items-start">
                  <div className="lg:col-span-7">
                    <CredentialsTable
                      credentials={filteredCredentials}
                      onEdit={handleEditClick}
                      onDelete={handleDeleteClick}
                    />
                  </div>
                  <div className="lg:col-span-5">
                    <PasswordGenerator
                      onSaveAsCredential={handleSaveGeneratedPassword}
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === "generator" && (
              <div className="max-w-xl mx-auto">
                <PasswordGenerator
                  onSaveAsCredential={handleSaveGeneratedPassword}
                />
              </div>
            )}

            {activeTab === "audit" && (
              <div className="cyber-card rounded-xl p-lg space-y-4">
                <h2 className="font-headline-md text-headline-md text-on-surface">
                  Security Audit
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Analyze your stored credentials for potential security risks.
                </p>
                <div className="space-y-3">
                  {credentials.map((cred) => {
                    const strength = getPasswordStrength(cred.password);
                    return (
                      <div
                        key={cred.id}
                        className="flex items-center justify-between p-3 bg-surface-container/30 rounded-lg border border-outline-variant/10"
                      >
                        <div>
                          <h4 className="font-semibold text-on-surface">
                            {cred.title}
                          </h4>
                          <p className="text-xs text-on-surface-variant">
                            {cred.username}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-xs font-bold ${strength >= 3 ? "text-secondary-container" : strength >= 2 ? "text-primary" : "text-error"}`}
                          >
                            {strength >= 3
                              ? "Secure"
                              : strength >= 2
                                ? "Moderate"
                                : "Weak (Under 8 chars or simple)"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="cyber-card rounded-xl p-lg space-y-4">
                <h2 className="font-headline-md text-headline-md text-on-surface">
                  Settings
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Manage your VaultCipher configuration and security
                  preferences.
                </p>
                <div className="p-4 bg-surface-container/30 rounded-lg border border-outline-variant/10">
                  <h3 className="font-semibold text-on-surface mb-2">
                    Encryption Standard
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    All credentials are encrypted locally using AES-256-GCM with
                    a derived Data Encryption Key (DEK) from your master
                    password.
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md cyber-card rounded-xl p-lg relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-6">
              {modalMode === "add" ? "Add Credential" : "Edit Credential"}
            </h3>

            {modalError && (
              <div className="mb-4 bg-error-container/20 border border-error/30 rounded-lg p-3 flex items-start gap-2 text-error">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span className="font-body-md text-body-md">{modalError}</span>
              </div>
            )}

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={modalForm.title}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, title: e.target.value })
                  }
                  className="w-full bg-[#090D16] border border-outline-variant/30 rounded-lg py-2 px-3 font-body-md text-body-md text-on-surface focus:ring-1 focus:ring-primary/40 focus:border-primary/40 outline-none transition-all"
                  placeholder="e.g. Google Account"
                />
              </div>

              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1.5">
                  Username / Email
                </label>
                <input
                  type="text"
                  required
                  value={modalForm.username}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, username: e.target.value })
                  }
                  className="w-full bg-[#090D16] border border-outline-variant/30 rounded-lg py-2 px-3 font-body-md text-body-md text-on-surface focus:ring-1 focus:ring-primary/40 focus:border-primary/40 outline-none transition-all"
                  placeholder="e.g. user@example.com"
                />
              </div>

              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1.5">
                  Password
                </label>
                <input
                  type="text"
                  required
                  value={modalForm.password}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, password: e.target.value })
                  }
                  className="w-full bg-[#090D16] border border-outline-variant/30 rounded-lg py-2 px-3 font-body-md text-body-md text-on-surface focus:ring-1 focus:ring-primary/40 focus:border-primary/40 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1.5">
                  Website URL (Optional)
                </label>
                <input
                  type="text"
                  value={modalForm.url}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, url: e.target.value })
                  }
                  className="w-full bg-[#090D16] border border-outline-variant/30 rounded-lg py-2 px-3 font-body-md text-body-md text-on-surface focus:ring-1 focus:ring-primary/40 focus:border-primary/40 outline-none transition-all"
                  placeholder="e.g. https://google.com"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-6 py-2.5 bg-primary text-[#0F172A] rounded-lg font-label-md text-label-md font-bold hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {modalMode === "add" ? "Save Credential" : "Update Credential"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
