import React, { useState } from "react";
import {
  LogIn,
  BedDouble,
  CheckSquare,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function CheckInForm({
  reservation,
  availableRooms = [],
  onConfirmCheckIn,
  onCancel,
  isSubmitting = false,
  error = null,
}) {
  const [selectedRoomId, setSelectedRoomId] = useState(
    reservation?.room_id ||
      (availableRooms.length > 0 ? availableRooms[0].id : ""),
  );
  const [verifiedId, setVerifiedId] = useState(false);
  const [verifiedPayment, setVerifiedPayment] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!verifiedId) {
      setFormError("Please verify government ID before checking in.");
      return;
    }
    setFormError("");
    onConfirmCheckIn(reservation.id, selectedRoomId || null);
  };

  if (!reservation) {
    return null;
  }

  // Filter available rooms matching the room type if any, else show all available
  const matchingRooms = availableRooms.filter(
    (r) => r.room_type?.toLowerCase() === reservation.room_type?.toLowerCase(),
  );
  const displayRooms =
    matchingRooms.length > 0 ? matchingRooms : availableRooms;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
      <div className="bg-[#041627] p-6 text-white flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-300">
            Front Desk Operations
          </span>
          <h3 className="text-xl font-bold mt-0.5">Guest Check-In</h3>
        </div>
        <div className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-medium border border-emerald-500/30">
          Booking #{reservation.id.slice(0, 8)}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {(error || formError) && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error || formError}</span>
          </div>
        )}

        {/* Guest Summary Card */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="text-xs text-slate-500 block">Guest Name</span>
            <span className="font-semibold text-slate-800 text-base">
              {reservation.guest?.full_name || "Guest"}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">
              Booked Room Type
            </span>
            <span className="font-semibold text-slate-800 text-base">
              {reservation.room_type}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Stay Duration</span>
            <span className="font-medium text-slate-700 text-sm">
              {reservation.start_date} → {reservation.end_date}
            </span>
          </div>
        </div>

        {/* Room Assignment */}
        <div>
          <label
            htmlFor="room-select"
            className="block text-sm font-semibold text-slate-800 mb-2"
          >
            Assign Room
          </label>
          {displayRooms.length > 0 ? (
            <select
              id="room-select"
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Auto-assign First Available Room --</option>
              {displayRooms.map((room) => (
                <option key={room.id} value={room.id}>
                  Room {room.room_number} ({room.room_type}) — $
                  {Number(room.daily_rate).toFixed(2)}/night
                </option>
              ))}
            </select>
          ) : (
            <div className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
              No specifically vacant rooms listed; system will auto-assign upon
              check-in.
            </div>
          )}
        </div>

        {/* Verification Checkboxes */}
        <div className="space-y-3 pt-2">
          <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
            <input
              type="checkbox"
              checked={verifiedId}
              onChange={(e) => setVerifiedId(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-slate-300"
            />
            <span className="text-sm font-medium text-slate-700">
              Government Issued Photo ID Verified & Recorded
            </span>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
            <input
              type="checkbox"
              checked={verifiedPayment}
              onChange={(e) => setVerifiedPayment(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-slate-300"
            />
            <span className="text-sm font-medium text-slate-700">
              Payment Method / Incidentals Pre-authorization on File
            </span>
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-lg shadow transition"
          >
            <LogIn className="w-4 h-4" />
            {isSubmitting ? "Checking In..." : "Confirm Check-In & Issue Key"}
          </button>
        </div>
      </form>
    </div>
  );
}
