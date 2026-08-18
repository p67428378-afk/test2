import React, { useState } from "react";
import Badge from "../common/Badge";
import { bookingsAPI } from "../../services/api";
import { Ticket, Calendar, AlertCircle } from "lucide-react";

export default function MyBookingsTable({ bookings = [], onRefresh }) {
  const [cancellingId, setCancellingId] = useState(null);
  const [error, setError] = useState(null);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;

    setCancellingId(bookingId);
    setError(null);
    try {
      await bookingsAPI.cancelBooking(bookingId);
      onRefresh();
    } catch (err) {
      const detail = err.response?.data?.detail || "Failed to cancel booking.";
      setError(detail);
    } finally {
      setCancellingId(null);
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
        <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-800">
          No Bookings Found
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          You haven't booked any guided tours yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {error && (
        <div className="p-3 bg-rose-50 border-b border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="p-4">Tour Name</th>
              <th className="p-4">Date & Time</th>
              <th className="p-4">Guide</th>
              <th className="p-4 text-center">Tickets</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {bookings.map((booking) => {
              const schedule = booking.schedule;
              const tour = schedule?.tour;
              const guide = schedule?.guide;
              const isConfirmed = booking.status === "Confirmed";
              const isCancelled = booking.status === "Cancelled";

              const formattedDate = schedule?.start_time
                ? new Date(schedule.start_time).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "N/A";

              return (
                <tr
                  key={booking.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="p-4 font-semibold text-slate-900">
                    {tour?.name || "Tour Schedule"}
                  </td>
                  <td className="p-4 text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                      <span>{formattedDate}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600">
                    {guide?.full_name ? (
                      <span className="font-medium text-slate-800">
                        {guide.full_name}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-800 font-bold text-xs">
                      {booking.ticket_count}
                    </span>
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={
                        isConfirmed
                          ? "success"
                          : isCancelled
                            ? "danger"
                            : "warning"
                      }
                    >
                      {booking.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    {isConfirmed && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        disabled={cancellingId === booking.id}
                        className="text-xs text-rose-600 hover:text-rose-800 font-semibold px-2.5 py-1 rounded hover:bg-rose-50 transition-colors disabled:opacity-50"
                      >
                        {cancellingId === booking.id
                          ? "Cancelling..."
                          : "Cancel Booking"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
