import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  ConciergeBell,
  LogIn,
  LogOut,
  Search,
  BedDouble,
  User,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { reservationsApi, roomsApi, frontDeskApi } from "../services/api.js";
import CheckInForm from "../components/CheckInForm.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

export default function FrontDeskPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const paramResId = searchParams.get("resId");
  const paramAction = searchParams.get("action");

  const [activeTab, setActiveTab] = useState(
    paramAction === "checkout" ? "checkout" : "checkin",
  );
  const [reservations, setReservations] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedResForCheckIn, setSelectedResForCheckIn] = useState(null);
  const [selectedResForCheckOut, setSelectedResForCheckOut] = useState(null);

  // Check-Out Form state
  const [serviceFees, setServiceFees] = useState("0.00");
  const [promoCode, setPromoCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState("0.00");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [resData, roomsData] = await Promise.all([
        reservationsApi.getReservations(),
        roomsApi.getRooms({ status: "Available" }),
      ]);
      setReservations(resData);
      setAvailableRooms(roomsData);

      if (paramResId) {
        const found = resData.find((r) => r.id === paramResId);
        if (found) {
          if (found.status === "CONFIRMED") {
            setSelectedResForCheckIn(found);
            setActiveTab("checkin");
          } else if (found.status === "CHECKED_IN") {
            setSelectedResForCheckOut(found);
            setActiveTab("checkout");
          }
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to load front desk operational data.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [paramResId, paramAction]);

  const confirmedReservations = reservations.filter(
    (r) => r.status === "CONFIRMED",
  );
  const inHouseGuests = reservations.filter((r) => r.status === "CHECKED_IN");

  const handleConfirmCheckIn = async (reservationId, roomId) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await frontDeskApi.checkIn(reservationId, roomId);
      setSuccessMsg(
        `Check-In Successful! Room ${res.room_number} assigned to ${res.guest_name}.`,
      );
      setSelectedResForCheckIn(null);
      setTimeout(() => setSuccessMsg(""), 4000);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.detail || "Check-In failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmCheckOut = async (e) => {
    e.preventDefault();
    if (!selectedResForCheckOut) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const res = await frontDeskApi.checkOut(selectedResForCheckOut.id, {
        service_fees: parseFloat(serviceFees || 0),
        discount_amount: parseFloat(discountAmount || 0),
        promo_code: promoCode.trim() || undefined,
      });

      setSuccessMsg(
        `Check-Out Successful! Room status set to Cleaning. Total: $${res.invoice?.total_amount}`,
      );
      const resId = selectedResForCheckOut.id;
      setSelectedResForCheckOut(null);
      await loadData();
      // Navigate to Invoices view
      setTimeout(() => {
        navigate(`/invoices?resId=${resId}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || "Check-Out failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0b1c30]">
            Front Desk Operations
          </h1>
          <p className="text-sm text-slate-500">
            Process guest check-in arrivals, room key allocation, and express
            check-out settlements.
          </p>
        </div>
        <button
          onClick={loadData}
          className="p-2 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 rounded-lg shadow-sm hover:bg-slate-50 transition self-start sm:self-auto"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
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

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("checkin")}
          className={`flex items-center gap-2 py-3 px-6 border-b-2 font-semibold text-sm transition ${
            activeTab === "checkin"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <LogIn className="w-4 h-4" /> Guest Arrivals (
          {confirmedReservations.length})
        </button>
        <button
          onClick={() => setActiveTab("checkout")}
          className={`flex items-center gap-2 py-3 px-6 border-b-2 font-semibold text-sm transition ${
            activeTab === "checkout"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <LogOut className="w-4 h-4" /> In-House & Check-Out (
          {inHouseGuests.length})
        </button>
      </div>

      {/* TAB 1: CHECK-IN */}
      {activeTab === "checkin" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
              Pending Arrivals
            </h3>
            {confirmedReservations.length === 0 ? (
              <div className="bg-white p-6 rounded-xl border border-slate-200 text-center text-slate-400 text-sm">
                No pending confirmed arrivals.
              </div>
            ) : (
              <div className="space-y-2">
                {confirmedReservations.map((res) => (
                  <div
                    key={res.id}
                    onClick={() => setSelectedResForCheckIn(res)}
                    className={`p-4 rounded-xl border cursor-pointer transition ${
                      selectedResForCheckIn?.id === res.id
                        ? "bg-blue-50/70 border-blue-500 shadow-sm"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">
                        {res.guest?.full_name || "Guest"}
                      </span>
                      <StatusBadge status={res.status} type="reservation" />
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex justify-between">
                      <span>{res.room_type}</span>
                      <span>
                        {res.start_date} → {res.end_date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-7">
            {selectedResForCheckIn ? (
              <CheckInForm
                reservation={selectedResForCheckIn}
                availableRooms={availableRooms}
                onConfirmCheckIn={handleConfirmCheckIn}
                onCancel={() => setSelectedResForCheckIn(null)}
                isSubmitting={isSubmitting}
                error={error}
              />
            ) : (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400">
                <LogIn className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <h4 className="font-semibold text-slate-700">
                  Select an Arrival to Process Check-In
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Choose a guest from the left list to review details and
                  allocate a room.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CHECK-OUT */}
      {activeTab === "checkout" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
              In-House Guests
            </h3>
            {inHouseGuests.length === 0 ? (
              <div className="bg-white p-6 rounded-xl border border-slate-200 text-center text-slate-400 text-sm">
                No guests currently checked in.
              </div>
            ) : (
              <div className="space-y-2">
                {inHouseGuests.map((res) => (
                  <div
                    key={res.id}
                    onClick={() => setSelectedResForCheckOut(res)}
                    className={`p-4 rounded-xl border cursor-pointer transition ${
                      selectedResForCheckOut?.id === res.id
                        ? "bg-blue-50/70 border-blue-500 shadow-sm"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">
                        {res.guest?.full_name || "Guest"}
                      </span>
                      <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                        Room {res.room?.room_number || "101"}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex justify-between">
                      <span>{res.room_type}</span>
                      <span>Departure: {res.end_date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-7">
            {selectedResForCheckOut ? (
              <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
                <div className="bg-[#041627] p-6 text-white flex justify-between items-center">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-300">
                      Departure & Billing Statement
                    </span>
                    <h3 className="text-xl font-bold mt-0.5">
                      Guest Check-Out
                    </h3>
                  </div>
                  <div className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/30">
                    Room {selectedResForCheckOut.room?.room_number || "N/A"}
                  </div>
                </div>

                <form
                  onSubmit={handleConfirmCheckOut}
                  className="p-6 space-y-6"
                >
                  {/* Guest Stay Summary */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-xs text-slate-400 block">
                        Guest Name
                      </span>
                      <span className="font-bold text-slate-800">
                        {selectedResForCheckOut.guest?.full_name}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block">Room</span>
                      <span className="font-bold text-slate-800">
                        #{selectedResForCheckOut.room?.room_number} (
                        {selectedResForCheckOut.room_type})
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block">
                        Stay Dates
                      </span>
                      <span className="font-semibold text-slate-700">
                        {selectedResForCheckOut.start_date} →{" "}
                        {selectedResForCheckOut.end_date}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Service & Incidental Fees ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={serviceFees}
                        onChange={(e) => setServiceFees(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Promo Code / Voucher
                      </label>
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="e.g. WELCOME10, SAVE20"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-800 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                    ℹ️ Upon confirmation, the room status will automatically
                    transition to <strong>Cleaning</strong> for housekeeping
                    turn-around, and the invoice will be finalized.
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setSelectedResForCheckOut(null)}
                      className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-lg shadow transition"
                    >
                      <LogOut className="w-4 h-4" />
                      {isSubmitting
                        ? "Processing..."
                        : "Complete Check-Out & Finalize Folio"}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400">
                <LogOut className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <h4 className="font-semibold text-slate-700">
                  Select an In-House Guest to Check-Out
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Select a guest from the left list to review charges, apply
                  discounts, and complete departure.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
