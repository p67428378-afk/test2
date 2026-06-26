import React, { useState, useEffect } from "react";
import AppLayout from "./components/layout/AppLayout";
import BookCatalogPage from "./pages/BookCatalogPage";
import MyLoansPage from "./pages/MyLoansPage";
import LibrarianAdminPanel from "./pages/LibrarianAdminPanel";
import { authService } from "./services/api";

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("catalog"); // catalog, loans, admin, login, register
  const [searchQuery, setSearchQuery] = useState("");

  // Login form state
  const [loginUsername, setLoginUsername] = useState("testuser");
  const [loginPassword, setLoginPassword] = useState("testpassword");
  const [loginError, setLoginError] = useState("");

  // Register form state
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState("member");
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const data = await authService.login(loginUsername, loginPassword);
      setUser(data.user);
      setActiveTab("catalog");
    } catch (err) {
      setLoginError(
        err.response?.data?.detail || "Invalid username or password.",
      );
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError("");
    setRegSuccess("");
    try {
      await authService.register(regUsername, regEmail, regPassword, regRole);
      setRegSuccess("Registration successful! You can now log in.");
      setRegUsername("");
      setRegEmail("");
      setRegPassword("");
    } catch (err) {
      setRegError(err.response?.data?.detail || "Registration failed.");
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setActiveTab("catalog");
  };

  const prefillMember = () => {
    setLoginUsername("testuser");
    setLoginPassword("testpassword");
  };

  const prefillLibrarian = () => {
    setLoginUsername("librarian");
    setLoginPassword("testpassword");
  };

  return (
    <div className="min-h-screen bg-background text-on-background">
      {activeTab === "login" ? (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-surface-container-low">
          <div className="max-w-md w-full space-y-8 bg-surface-container-lowest p-8 border border-outline-variant rounded-xl shadow-lg">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-on-surface">
                Sign in to LibFlow
              </h2>
              <p className="mt-2 text-center text-sm text-on-surface-variant">
                Or{" "}
                <button
                  onClick={() => setActiveTab("register")}
                  className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  create a new account
                </button>
              </p>
            </div>

            {loginError && (
              <div className="p-3 bg-error/10 text-error rounded text-sm font-medium">
                {loginError}
              </div>
            )}

            <form className="mt-8 space-y-6" onSubmit={handleLogin}>
              <div className="rounded-md shadow-sm space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium text-on-surface-variant mb-1"
                    htmlFor="username"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="appearance-none rounded relative block w-full px-3 py-2 border border-outline-variant placeholder-on-surface-variant text-on-surface focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-surface-container-lowest"
                    placeholder="Username"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-on-surface-variant mb-1"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="appearance-none rounded relative block w-full px-3 py-2 border border-outline-variant placeholder-on-surface-variant text-on-surface focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-surface-container-lowest"
                    placeholder="Password"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 p-3 bg-surface-container-low rounded border border-outline-variant text-xs text-on-surface-variant">
                <span className="font-semibold">Test Accounts:</span>
                <div className="flex justify-between items-center">
                  <span>Member: testuser / testpassword</span>
                  <button
                    type="button"
                    onClick={prefillMember}
                    className="text-primary hover:underline font-medium"
                  >
                    Use
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span>Librarian: librarian / testpassword</span>
                  <button
                    type="button"
                    onClick={prefillLibrarian}
                    className="text-primary hover:underline font-medium"
                  >
                    Use
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors shadow-sm"
                >
                  Sign In
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setActiveTab("catalog")}
                  className="text-sm text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  Back to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : activeTab === "register" ? (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-surface-container-low">
          <div className="max-w-md w-full space-y-8 bg-surface-container-lowest p-8 border border-outline-variant rounded-xl shadow-lg">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-on-surface">
                Create your account
              </h2>
              <p className="mt-2 text-center text-sm text-on-surface-variant">
                Or{" "}
                <button
                  onClick={() => setActiveTab("login")}
                  className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  sign in to your account
                </button>
              </p>
            </div>

            {regError && (
              <div className="p-3 bg-error/10 text-error rounded text-sm font-medium">
                {regError}
              </div>
            )}

            {regSuccess && (
              <div className="p-3 bg-tertiary-container/10 text-tertiary-container rounded text-sm font-medium">
                {regSuccess}
              </div>
            )}

            <form className="mt-8 space-y-6" onSubmit={handleRegister}>
              <div className="rounded-md shadow-sm space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium text-on-surface-variant mb-1"
                    htmlFor="reg-username"
                  >
                    Username
                  </label>
                  <input
                    id="reg-username"
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    className="appearance-none rounded relative block w-full px-3 py-2 border border-outline-variant placeholder-on-surface-variant text-on-surface focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-surface-container-lowest"
                    placeholder="Username"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-on-surface-variant mb-1"
                    htmlFor="reg-email"
                  >
                    Email Address
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="appearance-none rounded relative block w-full px-3 py-2 border border-outline-variant placeholder-on-surface-variant text-on-surface focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-surface-container-lowest"
                    placeholder="Email Address"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-on-surface-variant mb-1"
                    htmlFor="reg-password"
                  >
                    Password
                  </label>
                  <input
                    id="reg-password"
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="appearance-none rounded relative block w-full px-3 py-2 border border-outline-variant placeholder-on-surface-variant text-on-surface focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-surface-container-lowest"
                    placeholder="Password"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-on-surface-variant mb-1"
                    htmlFor="reg-role"
                  >
                    Role
                  </label>
                  <select
                    id="reg-role"
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                    className="block w-full px-3 py-2 border border-outline-variant rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  >
                    <option value="member">Member</option>
                    <option value="librarian">Librarian</option>
                  </select>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors shadow-sm"
                >
                  Register
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setActiveTab("catalog")}
                  className="text-sm text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  Back to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <AppLayout
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          onLogout={handleLogout}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        >
          {activeTab === "catalog" && (
            <BookCatalogPage user={user} searchQuery={searchQuery} />
          )}
          {activeTab === "loans" && <MyLoansPage user={user} />}
          {activeTab === "admin" && <LibrarianAdminPanel />}
        </AppLayout>
      )}
    </div>
  );
}
