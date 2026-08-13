import React from "react";
import { Clock, MapPin, Droplets, ArrowRight } from "lucide-react";

export const OperatorDispatchQueue = ({
  bookings = [],
  selectedBookingId = null,
  onSelectBooking,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <p className="text-slate-400 text-sm">
          Loading pending dispatch queue...
        </p>
      </div>
    );
  }

  const pendingBookings = bookings.filter(
    (b) => b.status === "PENDING_ASSIGNMENT",
  );

  if (pendingBookings.length === 0) {
    return (
      <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
        <Clock className="w-10 h-10 text-emerald-500/60 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-200">
          Dispatch Queue Clear
        </h3>
        <p className="text-slate-400 text-sm mt-1">
          There are no pending booking requests awaiting assignment.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">
            Pending Dispatch Requests
          </h3>
          <p className="text-xs text-slate-400">
            Select a booking to assign driver and tanker
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 bg-amber-900/40 text-amber-300 rounded-full border border-amber-700/60 font-medium">
          {pendingBookings.length} Pending
        </span>
      </div>

      <div className="space-y-3">
        {pendingBookings.map((booking) => {
          const isSelected = booking.id === selectedBookingId;
          const formattedDate = booking.scheduled_time
            ? new Date(booking.scheduled_time).toLocaleString()
            : "Immediate";

          return (
            <div
              key={booking.id}
              onClick={() => onSelectBooking(booking)}
              className={`p-4 rounded-lg border transition cursor-pointer flex items-center justify-between gap-4 ${
                isSelected
                  ? "bg-sky-950/60 border-sky-500 shadow-md"
                  : "bg-slate-900/80 border-slate-700 hover:border-slate-600"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-sky-400 font-bold">
                    #{booking.id ? booking.id.substring(0, 8) : "WT"}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-medium border border-slate-700">
                    {booking.volume_liters
                      ? `${booking.volume_liters.toLocaleString()} L`
                      : "N/A"}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-200">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{booking.delivery_address}</span>
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Scheduled: {formattedDate}</span>
                </div>
              </div>

              <div className="shrink-0 flex items-center">
                <button
                  type="button"
                  className={`p-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition ${
                    isSelected
                      ? "bg-sky-500 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <span>{isSelected ? "Selected" : "Assign"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OperatorDispatchQueue;
