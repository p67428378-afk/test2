import React from "react";
import ReactDOM from "react-dom/client";
import AppLayout from "./components/layout/AppLayout";
import CustomerDashboardPage from "./pages/CustomerDashboardPage";
import RestaurantDashboardPage from "./pages/RestaurantDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import Button from "./components/common/Button";
import Badge from "./components/common/Badge";
import { authService, userService, deliveryService } from "./services/api";
import "./index.css";

// Error Boundary Class Component (MANDATORY)
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
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-8 text-center">
          <span className="material-symbols-outlined text-5xl text-error mb-4">
            error
          </span>
          <h2 className="text-2xl font-black text-on-surface mb-2">
            Something went wrong.
          </h2>
          <p className="text-sm text-on-surface-variant mb-4">
            Please refresh the page or check the console for details.
          </p>
          <Button onClick={() => window.location.reload()}>Reload Page</Button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [user, setUser] = React.useState(null);
  const [token, setToken] = React.useState(localStorage.getItem("token"));
  const [activeTab, setActiveTab] = React.useState("browse");
  const [cart, setCart] = React.useState({
    restaurantId: null,
    restaurantName: "",
    items: [],
  });

  // Auth Form State
  const [isRegister, setIsRegister] = React.useState(false);
  const [email, setEmail] = React.useState("test@example.com"); // Pre-filled default (MANDATORY)
  const [password, setPassword] = React.useState("testpassword"); // Pre-filled default (MANDATORY)
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [role, setRole] = React.useState("customer");
  const [authError, setAuthError] = React.useState("");
  const [authLoading, setAuthLoading] = React.useState(false);

  // Delivery Partner State
  const [availableJobs, setAvailableJobs] = React.useState([]);
  const [isOnline, setIsOnline] = React.useState(true);

  React.useEffect(() => {
    if (token) {
      fetchCurrentUser();
    }
  }, [token]);

  React.useEffect(() => {
    if (user && user.role === "delivery") {
      fetchDeliveryData();
      const interval = setInterval(fetchDeliveryData, 10000);
      return () => clearInterval(interval);
    }
  }, [user, isOnline]);

  const fetchCurrentUser = async () => {
    try {
      const data = await authService.getCurrentUser();
      setUser(data);
      if (data.role === "customer") {
        setActiveTab("browse");
      } else if (data.role === "restaurant") {
        setActiveTab("dashboard");
      } else if (data.role === "delivery") {
        setActiveTab("jobs");
        setIsOnline(data.is_online);
      } else if (data.role === "admin") {
        setActiveTab("metrics");
      }
    } catch (err) {
      handleLogout();
    }
  };

  const fetchDeliveryData = async () => {
    try {
      if (isOnline) {
        const jobs = await deliveryService.listAvailable();
        setAvailableJobs(jobs);
      } else {
        setAvailableJobs([]);
      }
    } catch (err) {
      console.error("Failed to fetch delivery data", err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    try {
      const data = await authService.login(email, password);
      setToken(data.access_token);
    } catch (err) {
      setAuthError(err.response?.data?.detail || "Invalid email or password");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    try {
      await authService.register({
        email,
        password,
        full_name: fullName,
        phone: phone || null,
        role,
      });
      // Auto login after registration
      const data = await authService.login(email, password);
      setToken(data.access_token);
    } catch (err) {
      setAuthError(err.response?.data?.detail || "Registration failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    setCart({ restaurantId: null, restaurantName: "", items: [] });
  };

  const handleToggleOnline = async () => {
    try {
      const updated = await userService.updateAvailability(!isOnline);
      setIsOnline(updated.is_online);
    } catch (err) {
      console.error("Failed to toggle availability", err);
    }
  };

  const handleAcceptJob = async (deliveryId) => {
    try {
      await deliveryService.accept(deliveryId);
      fetchDeliveryData();
      setActiveTab("my-deliveries");
    } catch (err) {
      console.error("Failed to accept job", err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md bg-white rounded-2xl border border-outline-variant p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-brand-coral text-4xl font-black">
                fastfood
              </span>
              <span className="text-3xl font-black text-brand-coral">
                FoodDash
              </span>
            </div>
            <p className="text-sm text-on-surface-variant">
              {isRegister
                ? "Create your account to get started"
                : "Sign in to your account"}
            </p>
          </div>

          {authError && (
            <div className="bg-error-container text-on-error-container p-3 rounded-brand text-xs font-medium border border-error/20">
              {authError}
            </div>
          )}

          <form
            onSubmit={isRegister ? handleRegister : handleLogin}
            className="space-y-4"
          >
            {isRegister && (
              <>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full p-2.5 border border-outline-variant rounded-brand text-sm focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1234567890"
                    className="w-full p-2.5 border border-outline-variant rounded-brand text-sm focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">
                    I want to join as a:
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-2.5 border border-outline-variant rounded-brand text-sm focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none bg-white"
                  >
                    <option value="customer">Customer</option>
                    <option value="restaurant">Restaurant Partner</option>
                    <option value="delivery">Delivery Partner</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full p-2.5 border border-outline-variant rounded-brand text-sm focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 border border-outline-variant rounded-brand text-sm focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none bg-white"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3"
              disabled={authLoading}
            >
              {authLoading
                ? "Please wait..."
                : isRegister
                  ? "Sign Up"
                  : "Sign In"}
            </Button>
          </form>

          {/* Test Credentials Note (MANDATORY) */}
          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant text-xs space-y-2">
            <p className="font-bold text-on-surface">
              🔑 Test Accounts (Pre-seeded):
            </p>
            <ul className="space-y-1 text-on-surface-variant">
              <li>
                • <span className="font-semibold">Customer:</span>{" "}
                test@example.com / testpassword
              </li>
              <li>
                • <span className="font-semibold">Restaurant:</span>{" "}
                restaurant@example.com / testpassword
              </li>
              <li>
                • <span className="font-semibold">Delivery:</span>{" "}
                driver@example.com / testpassword
              </li>
              <li>
                • <span className="font-semibold">Admin:</span>{" "}
                admin@example.com / testpassword
              </li>
            </ul>
          </div>

          <div className="text-center">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setAuthError("");
                // Reset pre-fills based on mode
                if (!isRegister) {
                  setEmail("");
                  setPassword("");
                } else {
                  setEmail("test@example.com");
                  setPassword("testpassword");
                }
              }}
              className="text-xs font-bold text-brand-coral hover:underline"
            >
              {isRegister
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AppLayout
      user={user}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogout={handleLogout}
      cartCount={cart.items.length}
    >
      {user.role === "customer" && (
        <CustomerDashboardPage
          user={user}
          cart={cart}
          setCart={setCart}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}

      {user.role === "restaurant" && (
        <RestaurantDashboardPage
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}

      {user.role === "admin" && (
        <AdminDashboardPage
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}

      {user.role === "delivery" && (
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-outline-variant shadow-sm">
            <div>
              <h1 className="text-2xl font-black text-on-surface mb-1">
                Delivery Partner Dashboard
              </h1>
              <p className="text-sm text-on-surface-variant">
                Manage your availability and accept delivery tasks.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-on-surface-variant">
                Status:
              </span>
              <button
                onClick={handleToggleOnline}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  isOnline
                    ? "bg-brand-green text-white shadow-sm"
                    : "bg-secondary-container text-on-secondary-container"
                }`}
              >
                {isOnline ? "ONLINE" : "OFFLINE"}
              </button>
            </div>
          </div>

          {activeTab === "jobs" && (
            <div className="space-y-6">
              <h3 className="font-headline-md text-lg font-bold text-on-surface">
                Available Delivery Jobs
              </h3>
              {availableJobs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-outline-variant p-8">
                  <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">
                    local_shipping
                  </span>
                  <h4 className="font-bold text-on-surface mb-1">
                    No Jobs Available
                  </h4>
                  <p className="text-sm text-on-surface-variant">
                    {isOnline
                      ? "Waiting for restaurants to prepare orders..."
                      : "Go online to receive delivery tasks."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {availableJobs.map((job) => (
                    <div
                      key={job.id}
                      className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-outline-variant pb-3">
                        <h4 className="font-bold text-on-surface">
                          Delivery #{job.id.substring(0, 8)}
                        </h4>
                        <Badge variant="primary">PENDING PICKUP</Badge>
                      </div>
                      <div className="text-sm space-y-1">
                        <p className="text-on-surface font-medium">
                          <span className="text-on-surface-variant font-normal">
                            Restaurant:
                          </span>{" "}
                          {job.order?.restaurant?.name || "Gourmet Kitchen"}
                        </p>
                        <p className="text-on-surface font-medium">
                          <span className="text-on-surface-variant font-normal">
                            Pickup Address:
                          </span>{" "}
                          {job.order?.restaurant?.address || "789 Chef Way"}
                        </p>
                        <p className="text-on-surface font-medium">
                          <span className="text-on-surface-variant font-normal">
                            Delivery Address:
                          </span>{" "}
                          {job.order?.delivery_address}
                        </p>
                      </div>
                      <div className="flex justify-between items-center font-bold text-on-surface text-sm pt-2">
                        <span>Your Earnings</span>
                        <span className="text-brand-green text-base">
                          ${job.earnings?.toFixed(2) || "5.00"}
                        </span>
                      </div>
                      <Button
                        variant="success"
                        className="w-full"
                        onClick={() => handleAcceptJob(job.id)}
                      >
                        Accept Delivery Job
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "my-deliveries" && (
            <div className="space-y-6">
              <h3 className="font-headline-md text-lg font-bold text-on-surface">
                My Active Deliveries
              </h3>
              {/* Simulated active delivery list */}
              <div className="text-center py-12 bg-white rounded-xl border border-outline-variant p-8">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">
                  task_alt
                </span>
                <h4 className="font-bold text-on-surface mb-1">
                  No Active Deliveries
                </h4>
                <p className="text-sm text-on-surface-variant">
                  Accept a job from the available list to get started.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
