import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import AppLayout from "./components/layout/AppLayout";
import CustomerDashboardPage from "./pages/CustomerDashboardPage";
import RestaurantDashboardPage from "./pages/RestaurantDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import Button from "./components/common/Button";
import Badge from "./components/common/Badge";
import { authService, deliveryService, orderService } from "./services/api";
import "./index.css";

// 1. Error Boundary Class Component (MANDATORY)
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
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-8 text-center">
          <span className="material-symbols-outlined text-error text-6xl mb-4">
            error
          </span>
          <h2 className="font-headline-lg text-on-surface text-2xl font-black mb-2">
            Something went wrong.
          </h2>
          <p className="font-body-md text-on-surface-variant mb-6">
            Please refresh the page or contact support.
          </p>
          <Button onClick={() => window.location.reload()} variant="primary">
            Refresh Page
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

// 2. Driver Dashboard Component (rendered inline or as helper)
function DriverDashboard({ activeTab, isOnline }) {
  const [availableDeliveries, setAvailableDeliveries] = useState([]);
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [earnings, setEarnings] = useState(0);

  const fetchDriverData = async () => {
    try {
      if (isOnline) {
        const available = await deliveryService.listAvailable();
        setAvailableDeliveries(available);
      } else {
        setAvailableDeliveries([]);
      }

      // Fetch active delivery (if any)
      const orders = await orderService.list("driver");
      const activeOrder = orders.find((o) =>
        [
          "accepted",
          "preparing",
          "ready_for_pickup",
          "out_for_delivery",
        ].includes(o.status),
      );
      if (activeOrder) {
        const details = await orderService.get(activeOrder.id);
        setActiveDelivery(details);
      } else {
        setActiveDelivery(null);
      }

      // Calculate earnings from completed deliveries
      const completedOrders = orders.filter((o) => o.status === "delivered");
      setEarnings(completedOrders.length * 5.0); // Mock $5 per delivery
    } catch (err) {
      console.error("Failed to fetch driver data", err);
    }
  };

  useEffect(() => {
    fetchDriverData();
    const interval = setInterval(fetchDriverData, 5000);
    return () => clearInterval(interval);
  }, [activeTab, isOnline]);

  const handleAcceptDelivery = async (deliveryId) => {
    try {
      await deliveryService.accept(deliveryId);
      alert("Delivery task accepted!");
      fetchDriverData();
    } catch (err) {
      alert("Failed to accept delivery task.");
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await orderService.updateStatus(orderId, status);
      if (status === "delivered") {
        alert("Delivery completed! Earnings updated.");
      }
      fetchDriverData();
    } catch (err) {
      alert("Failed to update delivery status.");
    }
  };

  const handleSimulateGPS = async () => {
    if (!activeDelivery?.delivery?.id) return;
    try {
      // Generate random coordinates near NY
      const lat = 40.7128 + (Math.random() - 0.5) * 0.01;
      const lng = -74.006 + (Math.random() - 0.5) * 0.01;
      await deliveryService.updateLocation(
        activeDelivery.delivery.id,
        lat,
        lng,
      );
      alert("GPS coordinates updated!");
      fetchDriverData();
    } catch (err) {
      alert("Failed to update GPS location.");
    }
  };

  return (
    <div className="space-y-8">
      {activeTab === "dashboard" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-outline-variant p-6 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <p className="font-label-sm text-xs text-on-surface-variant font-medium">
                Total Earnings
              </p>
              <p className="font-headline-lg text-brand-green text-2xl font-black">
                ${earnings.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">
                payments
              </span>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-outline-variant p-6 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <p className="font-label-sm text-xs text-on-surface-variant font-medium">
                Available Tasks
              </p>
              <p className="font-headline-lg text-on-surface text-2xl font-black">
                {availableDeliveries.length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-brand-coral/10 text-brand-coral flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">
                local_shipping
              </span>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-outline-variant p-6 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <p className="font-label-sm text-xs text-on-surface-variant font-medium">
                Status
              </p>
              <p
                className={`font-headline-lg text-2xl font-black ${isOnline ? "text-brand-green" : "text-secondary"}`}
              >
                {isOnline ? "Online" : "Offline"}
              </p>
            </div>
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${isOnline ? "bg-brand-green/10 text-brand-green" : "bg-secondary/10 text-secondary"}`}
            >
              <span className="material-symbols-outlined text-2xl">
                sports_motorsports
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === "available" && (
        <div className="space-y-6">
          <h3 className="font-headline-md text-on-surface text-lg font-bold border-b border-outline-variant pb-3">
            Available Deliveries
          </h3>
          {!isOnline ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-outline-variant p-8">
              <span className="material-symbols-outlined text-on-surface-variant text-5xl mb-3">
                wifi_off
              </span>
              <h3 className="font-headline-md text-on-surface text-lg font-bold mb-1">
                You are offline
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant">
                Set your availability to Online to view and accept delivery
                tasks.
              </p>
            </div>
          ) : availableDeliveries.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-outline-variant p-8">
              <span className="material-symbols-outlined text-on-surface-variant text-5xl mb-3">
                local_shipping
              </span>
              <h3 className="font-headline-md text-on-surface text-lg font-bold mb-1">
                No available tasks
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant">
                Check back later for new delivery requests.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableDeliveries.map((del) => (
                <div
                  key={del.id}
                  className="bg-white rounded-2xl border border-outline-variant p-6 space-y-4 shadow-sm"
                >
                  <div className="flex justify-between items-start border-b border-outline-variant/50 pb-3">
                    <div>
                      <h4 className="font-headline-md text-on-surface text-base font-bold">
                        Delivery #{del.id.slice(0, 8)}
                      </h4>
                      <p className="font-body-md text-xs text-on-surface-variant mt-0.5">
                        Est. Earnings: $5.00
                      </p>
                    </div>
                    <Badge status="ready_for_pickup" />
                  </div>
                  <div className="space-y-2 text-sm text-on-surface">
                    <p className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-brand-coral text-lg">
                        restaurant
                      </span>
                      <span className="font-semibold">
                        Pickup: Restaurant Partner
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-brand-green text-lg">
                        home
                      </span>
                      <span>Dropoff: Customer Address</span>
                    </p>
                  </div>
                  <Button
                    onClick={() => handleAcceptDelivery(del.id)}
                    variant="primary"
                    className="w-full py-2.5"
                  >
                    Accept Delivery Task
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "active" && (
        <div className="space-y-6">
          <h3 className="font-headline-md text-on-surface text-lg font-bold border-b border-outline-variant pb-3">
            Active Delivery Task
          </h3>
          {!activeDelivery ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-outline-variant p-8">
              <span className="material-symbols-outlined text-on-surface-variant text-5xl mb-3">
                navigation
              </span>
              <h3 className="font-headline-md text-on-surface text-lg font-bold mb-1">
                No active delivery
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant">
                Accept a task from the Available Deliveries tab to start.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-outline-variant p-6 space-y-6 shadow-sm max-w-2xl mx-auto">
              <div className="flex justify-between items-start border-b border-outline-variant pb-4">
                <div>
                  <h4 className="font-headline-md text-on-surface text-base font-bold">
                    Order #{activeDelivery.id.slice(0, 8)}
                  </h4>
                  <p className="font-body-md text-xs text-on-surface-variant mt-0.5">
                    Delivery Address:{" "}
                    <span className="font-semibold text-on-surface">
                      {activeDelivery.delivery_address}
                    </span>
                  </p>
                </div>
                <Badge status={activeDelivery.status} />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center bg-surface-container-low p-4 rounded-xl border border-outline-variant/50">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-brand-coral text-2xl">
                      navigation
                    </span>
                    <div>
                      <p className="font-label-md text-sm text-on-surface font-bold">
                        Real-Time GPS Sharing
                      </p>
                      <p className="font-label-sm text-xs text-on-surface-variant mt-0.5">
                        Simulate your location updates for the customer.
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleSimulateGPS}
                    variant="secondary"
                    className="py-1.5 px-4 text-xs"
                  >
                    Update GPS
                  </Button>
                </div>

                <div className="flex gap-4 pt-4 border-t border-outline-variant/50">
                  {activeDelivery.status === "ready_for_pickup" && (
                    <Button
                      onClick={() =>
                        handleUpdateStatus(
                          activeDelivery.id,
                          "out_for_delivery",
                        )
                      }
                      variant="primary"
                      className="w-full py-3"
                    >
                      Pick Up Order (Out for Delivery)
                    </Button>
                  )}
                  {activeDelivery.status === "out_for_delivery" && (
                    <Button
                      onClick={() =>
                        handleUpdateStatus(activeDelivery.id, "delivered")
                      }
                      variant="success"
                      className="w-full py-3"
                    >
                      Mark as Delivered
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

DriverDashboard.propTypes = {
  activeTab: PropTypes.string.isRequired,
  isOnline: PropTypes.bool.isRequired,
};

// 3. Main App Component
function App() {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [isOnline, setIsOnline] = useState(false);
  const [activeTab, setActiveTab] = useState("browse");
  const [isRegister, setIsRegister] = useState(false);

  // Login/Register Form State
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("customer");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      if (user.role === "customer") setActiveTab("browse");
      else if (user.role === "restaurant") setActiveTab("dashboard");
      else if (user.role === "delivery") {
        setActiveTab("dashboard");
        setIsOnline(user.is_online || false);
      } else if (user.role === "admin") setActiveTab("dashboard");
    }
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
      setError("");
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await authService.register(email, password, fullName, phone, role);
      alert("Registration successful! Please log in.");
      setIsRegister(false);
      setError("");
    } catch (err) {
      setError("Registration failed. Email might already be registered.");
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setEmail("test@example.com");
    setPassword("testpassword");
  };

  const handleToggleOnline = async (online) => {
    try {
      await deliveryService.updateAvailability(online);
      setIsOnline(online);
      const updatedUser = { ...user, is_online: online };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (err) {
      alert("Failed to update availability.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="bg-white rounded-2xl border border-outline-variant p-8 max-w-md w-full space-y-6 shadow-md">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-brand-coral text-4xl font-bold">
                local_pizza
              </span>
              <span className="font-headline-lg text-brand-coral font-black text-3xl">
                FoodDash
              </span>
            </div>
            <p className="font-body-md text-sm text-on-surface-variant">
              {isRegister ? "Create your account" : "Log into your account"}
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-brand bg-error-container/20 border border-error/20 text-error text-xs font-semibold text-center">
              {error}
            </div>
          )}

          <form
            onSubmit={isRegister ? handleRegister : handleLogin}
            className="space-y-4"
          >
            {isRegister && (
              <>
                <div className="space-y-1.5">
                  <label className="font-label-sm text-xs text-on-surface-variant font-bold uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-11 px-4 rounded-brand border border-outline-variant bg-white focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none font-body-md text-sm text-on-surface transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-label-sm text-xs text-on-surface-variant font-bold uppercase tracking-wider">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-11 px-4 rounded-brand border border-outline-variant bg-white focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none font-body-md text-sm text-on-surface transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-label-sm text-xs text-on-surface-variant font-bold uppercase tracking-wider">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full h-11 px-4 rounded-brand border border-outline-variant bg-white focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none font-body-md text-sm text-on-surface transition-colors"
                  >
                    <option value="customer">Customer</option>
                    <option value="restaurant">Restaurant Partner</option>
                    <option value="delivery">Delivery Partner</option>
                  </select>
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <label className="font-label-sm text-xs text-on-surface-variant font-bold uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-4 rounded-brand border border-outline-variant bg-white focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none font-body-md text-sm text-on-surface transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-label-sm text-xs text-on-surface-variant font-bold uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-4 rounded-brand border border-outline-variant bg-white focus:border-brand-coral focus:ring-1 focus:ring-brand-coral outline-none font-body-md text-sm text-on-surface transition-colors"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 mt-2"
            >
              {isRegister ? "Sign Up" : "Log In"}
            </Button>
          </form>

          {/* Test Credentials Helper (MANDATORY) */}
          {!isRegister && (
            <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/50 space-y-2 text-xs text-on-surface-variant">
              <p className="font-bold uppercase tracking-wider text-[10px] text-on-surface">
                Test Accounts (Pre-seeded):
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmail("test@example.com");
                    setPassword("testpassword");
                  }}
                  className="text-left hover:text-brand-coral transition-colors"
                >
                  • Customer:{" "}
                  <span className="font-semibold">test@example.com</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail("restaurant@example.com");
                    setPassword("testpassword");
                  }}
                  className="text-left hover:text-brand-coral transition-colors"
                >
                  • Restaurant:{" "}
                  <span className="font-semibold">restaurant@example.com</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail("driver@example.com");
                    setPassword("testpassword");
                  }}
                  className="text-left hover:text-brand-coral transition-colors"
                >
                  • Driver:{" "}
                  <span className="font-semibold">driver@example.com</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail("admin@example.com");
                    setPassword("testpassword");
                  }}
                  className="text-left hover:text-brand-coral transition-colors"
                >
                  • Admin:{" "}
                  <span className="font-semibold">admin@example.com</span>
                </button>
              </div>
              <p className="text-[10px] text-center text-brand-coral font-semibold mt-1">
                Click any account to pre-fill form.
              </p>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
              }}
              className="font-label-sm text-xs text-brand-coral hover:underline font-bold"
            >
              {isRegister
                ? "Already have an account? Log In"
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
      isOnline={isOnline}
      onToggleOnline={handleToggleOnline}
    >
      {user.role === "customer" && (
        <CustomerDashboardPage
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
      {user.role === "restaurant" && (
        <RestaurantDashboardPage
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
      {user.role === "delivery" && (
        <DriverDashboard activeTab={activeTab} isOnline={isOnline} />
      )}
      {user.role === "admin" && <AdminDashboardPage activeTab={activeTab} />}
    </AppLayout>
  );
}

// Render App with Error Boundary
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
