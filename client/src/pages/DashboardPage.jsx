import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Calendar,
  Users,
  Star,
  Plus,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { adminService, eventService } from "../services/api";
import Sidebar from "../components/layout/Sidebar";
import Button from "../components/common/Button";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("admin_token"),
  );
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("adminpassword");
  const [loginError, setLoginError] = useState("");
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  // Dashboard data states
  const [reports, setReports] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Create Event Form states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Workshop");
  const [imageUrl, setImageUrl] = useState("");
  const [createSuccess, setCreateSuccess] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSubmitting, setCreateSubmitting] = useState(false);

  // Selected event registrations view
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [regsLoading, setRegistrationsLoading] = useState(false);

  // Manual registration form
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regError, setRegError] = useState("");
  const [regSubmitting, setRegSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginSubmitting(true);
    setLoginError("");
    try {
      await adminService.login(username, password);
      setIsLoggedIn(true);
    } catch (err) {
      setLoginError("Invalid username or password.");
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleLogout = () => {
    adminService.logout();
    setIsLoggedIn(false);
    setReports(null);
    setEvents([]);
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const reportsData = await adminService.getReports();
      setReports(reportsData);
      const eventsData = await eventService.getEvents();
      setEvents(eventsData);
    } catch (err) {
      setError("Failed to load dashboard data. Please verify authorization.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchDashboardData();
    }
  }, [isLoggedIn]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setCreateSubmitting(true);
    setCreateError("");
    setCreateSuccess(false);
    try {
      await eventService.createEvent({
        title,
        description,
        date_time: new Date(dateTime).toISOString(),
        location,
        category,
        image_url: imageUrl || null,
      });
      setCreateSuccess(true);
      setTitle("");
      setDescription("");
      setDateTime("");
      setLocation("");
      setImageUrl("");
      fetchDashboardData();
    } catch (err) {
      setCreateError(err.response?.data?.detail || "Failed to create event.");
    } finally {
      setCreateSubmitting(false);
    }
  };

  const handleViewRegistrations = async (event) => {
    setSelectedEvent(event);
    setRegistrationsLoading(true);
    setRegError("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}/api/v1/admin/events/${event.id}/registrations`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        },
      );
      if (!response.ok) throw new Error("Failed to fetch registrations");
      const data = await response.json();
      setRegistrations(data);
    } catch (err) {
      setRegError("Failed to load registrations.");
    } finally {
      setRegistrationsLoading(false);
    }
  };

  const handleManualRegister = async (e) => {
    e.preventDefault();
    setRegSubmitting(true);
    setRegError("");
    try {
      await eventService.registerForEvent(selectedEvent.id, {
        full_name: regName,
        email: regEmail,
        phone_number: regPhone || null,
        agree_reminders: true,
      });
      setRegName("");
      setRegEmail("");
      setRegPhone("");
      handleViewRegistrations(selectedEvent);
      fetchDashboardData();
    } catch (err) {
      setRegError(err.response?.data?.detail || "Failed to register attendee.");
    } finally {
      setRegSubmitting(false);
    }
  };

  const handleDeleteRegistration = async (regId) => {
    if (!window.confirm("Are you sure you want to remove this attendee?"))
      return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}/api/v1/admin/registrations/${regId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        },
      );
      if (!response.ok) throw new Error("Failed to delete registration");
      handleViewRegistrations(selectedEvent);
      fetchDashboardData();
    } catch (err) {
      alert("Failed to delete registration.");
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this event? This will remove all registrations.",
      )
    )
      return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}/api/v1/admin/events/${eventId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        },
      );
      if (!response.ok) throw new Error("Failed to delete event");
      if (selectedEvent?.id === eventId) setSelectedEvent(null);
      fetchDashboardData();
    } catch (err) {
      alert("Failed to delete event.");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/30 max-w-md w-full p-lg md:p-xl">
          <div className="text-center mb-6">
            <span className="material-symbols-outlined text-primary text-5xl">
              admin_panel_settings
            </span>
            <h1 className="font-display text-headline-md font-bold text-on-background mt-2">
              Admin Portal
            </h1>
            <p className="text-on-surface-variant font-body-md mt-1">
              Sign in to manage events and view reports
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-error-container/30 border border-error/20 text-error rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label
                className="font-label-sm text-label-sm text-on-surface-variant"
                htmlFor="username"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md text-on-background"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                className="font-label-sm text-label-sm text-on-surface-variant"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md text-on-background"
              />
            </div>

            <div className="p-3 bg-surface-container-low rounded-lg text-xs text-on-surface-variant border border-outline-variant/20 mt-2">
              <p className="font-semibold mb-1">Test Credentials:</p>
              <p>
                Username: <span className="font-mono font-bold">admin</span>
              </p>
              <p>
                Password:{" "}
                <span className="font-mono font-bold">adminpassword</span>
              </p>
            </div>

            <Button
              type="submit"
              disabled={loginSubmitting}
              className="w-full mt-2"
            >
              {loginSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col md:flex-row">
      <Sidebar onLogout={handleLogout} />

      <main className="flex-grow p-lg md:p-xl flex flex-col gap-lg bg-surface-container-low/30">
        <div className="flex justify-between items-center flex-wrap gap-md">
          <div>
            <h1 className="font-display text-headline-lg font-bold text-on-background">
              Dashboard Overview
            </h1>
            <p className="text-on-surface-variant font-body-md">
              Manage community events, registrations, and view analytics.
            </p>
          </div>
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            <Plus className="w-5 h-5" />
            {showCreateForm ? "Hide Form" : "Create New Event"}
          </Button>
        </div>

        {/* Create Event Form */}
        {showCreateForm && (
          <div className="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant/20 shadow-sm flex flex-col gap-md">
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-background">
              Create New Event
            </h2>

            {createSuccess && (
              <div className="p-4 bg-primary-container/10 border border-primary-container/20 text-primary rounded-lg flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary-container" />
                <span className="font-semibold">
                  Event created successfully!
                </span>
              </div>
            )}

            {createError && (
              <div className="p-3 bg-error-container/30 border border-error/20 text-error rounded-lg flex items-center gap-2 text-sm">
                <AlertCircle className="w-5 h-5" />
                <span>{createError}</span>
              </div>
            )}

            <form
              onSubmit={handleCreateEvent}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="flex flex-col gap-1">
                <label
                  className="font-label-sm text-label-sm text-on-surface-variant"
                  htmlFor="title"
                >
                  Event Title *
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md text-on-background"
                  placeholder="e.g. Summer Music Festival"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  className="font-label-sm text-label-sm text-on-surface-variant"
                  htmlFor="category"
                >
                  Category *
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md text-on-background"
                >
                  <option value="Music">Music</option>
                  <option value="Sports">Sports</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Arts">Arts</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label
                  className="font-label-sm text-label-sm text-on-surface-variant"
                  htmlFor="dateTime"
                >
                  Date & Time *
                </label>
                <input
                  id="dateTime"
                  type="datetime-local"
                  required
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md text-on-background"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  className="font-label-sm text-label-sm text-on-surface-variant"
                  htmlFor="location"
                >
                  Location *
                </label>
                <input
                  id="location"
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md text-on-background"
                  placeholder="e.g. City Park Amphitheater"
                />
              </div>

              <div className="flex flex-col gap-1 md:col-span-2">
                <label
                  className="font-label-sm text-label-sm text-on-surface-variant"
                  htmlFor="imageUrl"
                >
                  Image URL (Optional)
                </label>
                <input
                  id="imageUrl"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md text-on-background"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="flex flex-col gap-1 md:col-span-2">
                <label
                  className="font-label-sm text-label-sm text-on-surface-variant"
                  htmlFor="description"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md text-on-background"
                  placeholder="Provide a detailed description of the event..."
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createSubmitting}>
                  {createSubmitting ? "Creating..." : "Create Event"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Analytics Cards */}
        {reports && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
            <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/20 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-primary-container/10 rounded-lg text-primary">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-wider">
                  Total Events
                </p>
                <p className="text-2xl font-bold text-on-background">
                  {reports.total_events}
                </p>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/20 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-wider">
                  Total Registrations
                </p>
                <p className="text-2xl font-bold text-on-background">
                  {reports.total_registrations}
                </p>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/20 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-wider">
                  Attendance Rate
                </p>
                <p className="text-2xl font-bold text-on-background">
                  {reports.attendance_rate}%
                </p>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/20 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg text-yellow-600">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-wider">
                  Feedback Score
                </p>
                <p className="text-2xl font-bold text-on-background">4.8 / 5</p>
              </div>
            </div>
          </div>
        )}

        {/* Events List & Registrations Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
          {/* Events List */}
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm overflow-hidden">
            <div className="p-lg border-b border-outline-variant/20 flex justify-between items-center">
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-background">
                Manage Events
              </h2>
              <button
                onClick={fetchDashboardData}
                className="text-on-surface-variant hover:text-primary p-1.5 rounded-full hover:bg-surface-container-low transition-all"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <RefreshCw className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : error ? (
              <div className="p-lg text-error font-bold text-center">
                {error}
              </div>
            ) : events.length === 0 ? (
              <div className="p-lg text-on-surface-variant text-center">
                No events created yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low/50 text-on-surface-variant font-label-sm text-xs uppercase tracking-wider border-b border-outline-variant/20">
                      <th className="p-4">Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {events.map((evt) => (
                      <tr
                        key={evt.id}
                        className={`hover:bg-surface-container-low/20 transition-colors ${selectedEvent?.id === evt.id ? "bg-primary-container/5" : ""}`}
                      >
                        <td className="p-4 font-semibold text-on-background">
                          {evt.title}
                        </td>
                        <td className="p-4 text-sm text-on-surface-variant">
                          {evt.category}
                        </td>
                        <td className="p-4 text-sm text-on-surface-variant">
                          {new Date(evt.date_time).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right flex justify-end gap-2">
                          <Button
                            variant="outline"
                            className="py-1 px-3 text-xs"
                            onClick={() => handleViewRegistrations(evt)}
                          >
                            Registrations
                          </Button>
                          <button
                            onClick={() => handleDeleteEvent(evt.id)}
                            className="text-error hover:bg-error-container/20 p-1.5 rounded-full transition-colors"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Registrations Panel */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm overflow-hidden flex flex-col">
            <div className="p-lg border-b border-outline-variant/20">
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-background">
                Registrations
              </h2>
              <p className="text-xs text-on-surface-variant mt-1">
                {selectedEvent
                  ? `Managing attendees for: ${selectedEvent.title}`
                  : "Select an event to manage registrations."}
              </p>
            </div>

            {selectedEvent ? (
              <div className="p-lg flex flex-col gap-lg flex-grow">
                {/* Manual Registration Form */}
                <form
                  onSubmit={handleManualRegister}
                  className="bg-surface-container-low/40 p-md rounded-lg border border-outline-variant/20 flex flex-col gap-3"
                >
                  <p className="font-label-sm text-label-sm text-on-surface-variant font-bold">
                    Add Attendee Manually
                  </p>

                  {regError && (
                    <div className="p-2 bg-error-container/20 border border-error/10 text-error rounded text-xs flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{regError}</span>
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full px-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <input
                      type="tel"
                      placeholder="Phone Number (Optional)"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full px-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={regSubmitting}
                    className="py-1.5 text-xs w-full"
                  >
                    {regSubmitting ? "Adding..." : "Add Attendee"}
                  </Button>
                </form>

                {/* Registrations List */}
                <div className="flex-grow flex flex-col gap-md">
                  <p className="font-label-sm text-label-sm text-on-surface-variant font-bold">
                    Registered Attendees ({registrations.length})
                  </p>

                  {regsLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <RefreshCw className="w-6 h-6 text-primary animate-spin" />
                    </div>
                  ) : registrations.length === 0 ? (
                    <p className="text-sm text-on-surface-variant text-center py-8">
                      No attendees registered yet.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                      {registrations.map((reg) => (
                        <div
                          key={reg.id}
                          className="flex justify-between items-center p-2 bg-surface-container-low/30 rounded border border-outline-variant/10 hover:bg-surface-container-low/60 transition-colors"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-on-background truncate">
                              {reg.full_name}
                            </p>
                            <p className="text-xs text-on-surface-variant truncate">
                              {reg.email}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteRegistration(reg.id)}
                            className="text-error hover:bg-error-container/20 p-1 rounded-full transition-colors shrink-0"
                            title="Remove Attendee"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-lg text-center text-on-surface-variant text-sm py-20 flex-grow flex items-center justify-center">
                Please select an event from the list to manage its
                registrations.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
