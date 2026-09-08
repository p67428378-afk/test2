import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarCheck,
  Plus,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { reservationsApi, roomsApi } from "../services/api.js";
import ReservationTable from "../components/ReservationTable.jsx";

export default function ReservationsPage() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  // Filters
  const [guestNameQuery, setGuestNameQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // New Reservation Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [roomType, setRoomType] = useState("Single Deluxe");
  const [startDate, setStartDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split("T")[0];
  });
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const fetchReservations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {};
      if (guestNameQuery) params.guest_name = guestNameQuery;
      if (statusFilter) params.status = statusFilter;
      const data = await reservationsApi.getReservations(params);
      setReservations(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch reservations.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const data = await roomsApi.getRooms({ status: "Available" });
      setRooms(data);
    } catch (err) {
      // Non-blocking
    }
  };

  useEffect(() => {
    fetchReservations();
    fetchRooms();
  }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchReservations();
  };

  const handleCreateReservation = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    setError(null);
    try {
      await reservationsApi.createReservation({
        guest: {
          full_name: guestName.trim(),
          email: guestEmail.trim(),
          phone: guestPhone.trim(),
        },
        room_type: roomType,
        start_date: startDate,
        end_date: endDate,
        room_id: selectedRoomId || null,
      });

      setIsModalOpen(false);
      setGuestName("");
      setGuestEmail("");
      setGuestPhone("");
      setSelectedRoomId("");
      setSuccessMsg("Reservation created successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
      await fetchReservations();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create reservation.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancelReservation = async (resId) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?"))
      return;
    setError(null);
    try {
      await reservationsApi.cancelReservation(resId);
      setSuccessMsg("Reservation cancelled successfully.");
      setTimeout(() => setSuccessMsg(""), 3000);
      await fetchReservations();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to cancel reservation.");
    }
  };

  const handleCheckInRedirect = (res) => {
    navigate(`/front-desk?resId=${res.id}`);
  };

  const handleCheckOutRedirect = (res) => {
    navigate(`/front-desk?action=checkout&resId=${res.id}`);
  };

  const handleViewInvoice = (res) => {
    navigate(`/invoices?resId=${res.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0b1c30]">
            Guest Reservations & Bookings
          </h1>
          <p className="text-sm text-slate-500">
            View, schedule, and manage guest bookings and stay dates.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchReservations}
            className="p-2 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 rounded-lg shadow-sm hover:bg-slate-50 transition"
            title="Refresh"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow transition"
          >
            <Plus className="w-4 h-4" /> New Reservation
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          {["", "CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED"].map(
            (st) => (
              <button
                key={st || "all"}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  statusFilter === st
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {st ? st.replace("_", " ") : "All Statuses"}
              </button>
            ),
          )}
        </div>

        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 w-full md:w-72"
        >
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Guest Name..."
              value={guestNameQuery}
              onChange={(e) => setGuestNameQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg hover:bg-slate-900 transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Reservations Table */}
      <ReservationTable
        reservations={reservations}
        isLoading={isLoading}
        onCheckIn={handleCheckInRedirect}
        onCheckOut={handleCheckOutRedirect}
        onCancel={handleCancelReservation}
        onViewInvoice={handleViewInvoice}
      />

      {/* New Reservation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-[#041627] text-white p-5 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Create New Reservation</h3>
                <p className="text-xs text-blue-300 mt-0.5">
                  Enter guest and booking requirements
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleCreateReservation}
              className="p-6 space-y-4 overflow-y-auto"
            >
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                  Guest Information
                </h4>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Guest Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alice Smith"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alice@example.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+1-555-0123"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                  Booking Details
                </h4>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Room Type *
                  </label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Single Deluxe">
                      Single Deluxe ($120/night)
                    </option>
                    <option value="Double Suite">
                      Double Suite ($220/night)
                    </option>
                    <option value="Executive Suite">
                      Executive Suite ($350/night)
                    </option>
                    <option value="Presidential Suite">
                      Presidential Suite ($600/night)
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Check-In Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Check-Out Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pre-assign Specific Room (Optional)
                  </label>
                  <select
                    value={selectedRoomId}
                    onChange={(e) => setSelectedRoomId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Auto-assign on Arrival --</option>
                    {rooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        Room {r.room_number} ({r.room_type})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg shadow transition"
                >
                  {isCreating ? "Booking..." : "Confirm Reservation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
