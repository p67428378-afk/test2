import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import ExplorePage from "./pages/ExplorePage";
import DetailPage from "./pages/DetailPage";
import ComparePage from "./pages/ComparePage";
import BookingPage from "./pages/BookingPage";
import { authService, bookingService } from "./services/api";

export default function App() {
  const [user, setUser] = useState(null);
  const [comparedIds, setComparedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Dashboard State
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [authError, setAuthError] = useState("");
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const profile = await authService.getMe();
          setUser(profile);
        } catch (err) {
          console.error("Auth check failed:", err);
          localStorage.removeItem("token");
        }
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserBookings();
    }
  }, [user]);

  const fetchUserBookings = async () => {
    try {
      setBookingsLoading(true);
      const data = await bookingService.getUserBookings();
      setBookings(data || []);
    } catch (err) {
      console.error("Error fetching user bookings:", err);
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      setAuthError("");
      await authService.login({ email, password });
      const profile = await authService.getMe();
      setUser(profile);
      setEmail("");
      setPassword("");
    } catch (err) {
      setAuthError(
        err.response?.data?.detail ||
          "Login failed. Please check your credentials.",
      );
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      setAuthError("");
      await authService.register({ email, password, name });
      await authService.login({ email, password });
      const profile = await authService.getMe();
      setUser(profile);
      setEmail("");
      setPassword("");
      setName("");
    } catch (err) {
      setAuthError(
        err.response?.data?.detail ||
          "Registration failed. Email might already be registered.",
      );
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setBookings([]);
  };

  const handleCompareToggle = (id) => {
    setComparedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleRemoveCompare = (id) => {
    setComparedIds((prev) => prev.filter((item) => item !== id));
  };

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-background text-on-background">
        <Sidebar user={user} onLogout={handleLogout} />
        <div className="flex-1 ml-[260px] flex flex-col min-h-screen">
          <Header
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            user={user}
          />
          <main className="flex-1 flex flex-col">
            <Routes>
              <Route
                path="/"
                element={
                  <ExplorePage
                    comparedIds={comparedIds}
                    onCompareToggle={handleCompareToggle}
                  />
                }
              />
              <Route path="/packages/:packageId" element={<DetailPage />} />
              <Route
                path="/compare"
                element={
                  <ComparePage
                    comparedIds={comparedIds}
                    onRemove={handleRemoveCompare}
                  />
                }
              />
              <Route
                path="/booking/:packageId"
                element={<BookingPage user={user} />}
              />
              <Route
                path="/dashboard"
                element={
                  <div className="flex-1 p-lg w-full max-w-max-content-width mx-auto">
                    <div className="mb-8">
                      <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2 text-2xl font-bold">
                        My Dashboard
                      </h2>
                      <p className="font-body-lg text-body-lg text-on-surface-variant">
                        Manage your profile, view booking history, and complete
                        pending payments.
                      </p>
                    </div>

                    {user ? (
                      /* Logged In Dashboard */
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Profile Card */}
                        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm h-fit space-y-4">
                          <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">
                              person
                            </span>
                            Personal Information
                          </h3>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-on-surface-variant block text-xs">
                                Full Name
                              </span>
                              <span className="font-semibold text-on-surface">
                                {user.name}
                              </span>
                            </div>
                            <div>
                              <span className="text-on-surface-variant block text-xs">
                                Email Address
                              </span>
                              <span className="font-semibold text-on-surface">
                                {user.email}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Booking History */}
                        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm space-y-6">
                          <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">
                              history
                            </span>
                            Booking History
                          </h3>

                          {bookingsLoading ? (
                            <div className="flex justify-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                          ) : bookings.length === 0 ? (
                            <div className="text-center py-8 text-on-surface-variant italic">
                              You have no bookings yet. Start exploring packages
                              to book your first trip!
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {bookings.map((b) => (
                                <div
                                  key={b.id}
                                  className="border border-outline-variant/20 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-surface-container-low transition-colors"
                                >
                                  <div>
                                    <h4 className="font-bold text-on-surface text-base">
                                      {b.package_name}
                                    </h4>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-on-surface-variant mt-1">
                                      <span>
                                        Dates: {b.start_date} to {b.end_date}
                                      </span>
                                      <span>Total: ${b.total_price}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                                    <span
                                      className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
                                        b.status === "confirmed"
                                          ? "bg-primary-container/10 text-primary"
                                          : b.status === "pending"
                                            ? "bg-secondary-container text-on-secondary-container"
                                            : "bg-error-container/10 text-error"
                                      }`}
                                    >
                                      {b.status}
                                    </span>
                                    {b.status === "pending" && (
                                      <Link
                                        to={`/booking/${b.package_id}`}
                                        className="bg-primary-container text-on-primary hover:bg-primary-container/90 px-4 py-1.5 rounded-lg font-label-sm text-label-sm transition-colors font-semibold"
                                      >
                                        Pay Now
                                      </Link>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Login / Register Forms */
                      <div className="max-w-md mx-auto bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm space-y-6">
                        <div className="flex border-b border-outline-variant/20 pb-4">
                          <button
                            onClick={() => {
                              setIsLogin(true);
                              setAuthError("");
                            }}
                            className={`flex-1 text-center font-semibold text-sm pb-2 border-b-2 transition-colors ${
                              isLogin
                                ? "border-primary text-primary"
                                : "border-transparent text-on-surface-variant hover:text-on-surface"
                            }`}
                          >
                            Login
                          </button>
                          <button
                            onClick={() => {
                              setIsLogin(false);
                              setAuthError("");
                            }}
                            className={`flex-1 text-center font-semibold text-sm pb-2 border-b-2 transition-colors ${
                              !isLogin
                                ? "border-primary text-primary"
                                : "border-transparent text-on-surface-variant hover:text-on-surface"
                            }`}
                          >
                            Register
                          </button>
                        </div>

                        {authError && (
                          <div className="text-sm text-error bg-error-container/10 p-3 rounded-lg border border-error/20 text-center">
                            {authError}
                          </div>
                        )}

                        {isLogin ? (
                          <form
                            onSubmit={handleLoginSubmit}
                            className="space-y-4"
                          >
                            <div className="flex flex-col gap-2">
                              <label className="font-label-md text-label-md text-on-surface-variant text-xs font-semibold">
                                Email Address
                              </label>
                              <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2 bg-surface border border-outline-variant/50 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md text-on-surface"
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <label className="font-label-md text-label-md text-on-surface-variant text-xs font-semibold">
                                Password
                              </label>
                              <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 bg-surface border border-outline-variant/50 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md text-on-surface"
                              />
                            </div>
                            <button
                              type="submit"
                              className="w-full bg-primary-container text-on-primary hover:bg-primary-container/90 px-6 py-2.5 rounded-lg font-label-md text-label-md shadow-sm transition-colors font-semibold"
                            >
                              Login
                            </button>
                          </form>
                        ) : (
                          <form
                            onSubmit={handleRegisterSubmit}
                            className="space-y-4"
                          >
                            <div className="flex flex-col gap-2">
                              <label className="font-label-md text-label-md text-on-surface-variant text-xs font-semibold">
                                Full Name
                              </label>
                              <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full px-4 py-2 bg-surface border border-outline-variant/50 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md text-on-surface"
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <label className="font-label-md text-label-md text-on-surface-variant text-xs font-semibold">
                                Email Address
                              </label>
                              <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2 bg-surface border border-outline-variant/50 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md text-on-surface"
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <label className="font-label-md text-label-md text-on-surface-variant text-xs font-semibold">
                                Password
                              </label>
                              <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 bg-surface border border-outline-variant/50 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md text-on-surface"
                              />
                            </div>
                            <button
                              type="submit"
                              className="w-full bg-primary-container text-on-primary hover:bg-primary-container/90 px-6 py-2.5 rounded-lg font-label-md text-label-md shadow-sm transition-colors font-semibold"
                            >
                              Register
                            </button>
                          </form>
                        )}
                      </div>
                    )}
                  </div>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
