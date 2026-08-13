import React from "react";
import {
  Clock,
  MapPin,
  Droplets,
  CheckCircle,
  Truck,
  AlertCircle,
  XCircle,
} from "lucide-react";

export const CustomerBookingList = ({ bookings = [], loading = false }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING_ASSIGNMENT":
        return {
          color: "bg-amber-900/40 text-amber-300 border-amber-700/60",
          label: "Pending Assignment",
          icon: Clock,
        };
      case "ASSIGNED":
        return {
          color: "bg-blue-900/40 text-blue-300 border-blue-700/60",
          label: "Assigned",
          icon: Truck,
        };
      case "EN_ROUTE":
        return {
          color: "bg-indigo-900/40 text-indigo-300 border-indigo-700/60",
          label: "En Route",
          icon: Truck,
        };
      case "ARRIVED":
        return {
          color: "bg-cyan-900/40 text-cyan-300 border-cyan-700/60",
          label: "Arrived at Location",
          icon: MapPin,
        };
      case "DISCHARGING":
        return {
          color: "bg-teal-900/40 text-teal-300 border-teal-700/60",
          label: "Discharging Water",
          icon: Droplets,
        };
      case "COMPLETED":
        return {
          color: "bg-emerald-900/40 text-emerald-300 border-emerald-700/60",
          label: "Completed",
          icon: CheckCircle,
        };
      case "CANCELLED":
        return {
          color: "bg-rose-900/40 text-rose-300 border-rose-700/60",
          label: "Cancelled",
          icon: XCircle,
        };
      default:
        return {
          color: "bg-slate-800 text-slate-300 border-slate-700",
          label: status,
          icon: AlertCircle,
        };
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <p className="text-slate-400 text-sm">Loading your bookings...</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
        <Droplets className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-200">
          No Booking Requests
        </h3>
        <p className="text-slate-400 text-sm mt-1">
          Submit a request above to order water delivery.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-100">
          Your Booking Requests
        </h3>
        <span className="text-xs px-2.5 py-1 bg-slate-900 rounded-full text-slate-400 border border-slate-700">
          {bookings.length} Total
        </span>
      </div>

      <div className="space-y-3.5">
        {bookings.map((booking) => {
          const badge = getStatusBadge(booking.status);
          const IconComponent = badge.icon;
          const formattedDate = booking.scheduled_time
            ? new Date(booking.scheduled_time).toLocaleString()
            : "Unscheduled";

          return (
            <div
              key={booking.id}
              className="p-4 bg-slate-900/80 border border-slate-700/80 rounded-lg hover:border-slate-600 transition"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-sky-400 font-medium">
                      #{booking.id ? booking.id.substring(0, 8) : "WT-N/A"}
                    </span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-400">
                      {booking.volume_liters
                        ? `${booking.volume_liters.toLocaleString()} Liters`
                        : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-slate-200 mt-1">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{booking.delivery_address}</span>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${badge.color}`}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                  <span>{badge.label}</span>
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400 border-t border-slate-800 pt-2.5 mt-2">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  Scheduled: {formattedDate}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomerBookingList;
