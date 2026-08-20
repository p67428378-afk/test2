import React, { useState } from "react";
import { updateTicketStatus } from "../../services/api";
import {
  Clock,
  Users,
  Hash,
  Monitor,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  XCircle,
} from "lucide-react";

export default function PositionTrackerCard({ ticket, onRefresh, onCancel }) {
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState(null);

  if (!ticket) return null;

  const {
    ticket_id,
    ticket_number,
    customer_name,
    service_type,
    status,
    position_in_line,
    estimated_wait_minutes,
    counter_number,
  } = ticket;

  const handleCancelTicket = async () => {
    if (!window.confirm("Are you sure you want to cancel your queue ticket?")) {
      return;
    }

    setCancelling(true);
    setError(null);

    try {
      const updated = await updateTicketStatus(ticket_id, "Cancelled");
      if (onCancel) {
        onCancel(updated);
      } else if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.error("Failed to cancel ticket:", err);
      const msg =
        err.response?.data?.detail ||
        "Failed to cancel ticket. Please try again.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case "Waiting":
        return (
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2.5 py-1 rounded-full font-semibold border border-yellow-200">
            Waiting in Line
          </span>
        );
      case "In Progress":
        return (
          <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-semibold border border-blue-200 animate-pulse">
            Now Serving
          </span>
        );
      case "Completed":
        return (
          <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full font-semibold border border-green-200">
            Completed
          </span>
        );
      case "Cancelled":
        return (
          <span className="bg-red-100 text-red-800 text-xs px-2.5 py-1 rounded-full font-semibold border border-red-200">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded-full font-semibold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-[#e3e8f0] rounded-2xl p-6 shadow-md w-full max-w-xl mx-auto">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-[#e3e8f0] pb-4 mb-6">
        <div>
          <span className="text-xs font-semibold text-[#707a8c] uppercase tracking-wider">
            Ticket Holder
          </span>
          <h3 className="text-lg font-bold text-[#171c29]">{customer_name}</h3>
          <p className="text-xs text-[#707a8c]">{service_type}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {getStatusBadge()}
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="text-xs text-[#2663eb] hover:underline flex items-center gap-1 mt-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Refresh Status</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2"
        >
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-center">
        {/* Ticket Number */}
        <div className="bg-[#f7fafc] border border-[#e3e8f0] rounded-xl p-4 flex flex-col items-center justify-center">
          <Hash className="w-5 h-5 text-[#2663eb] mb-1" />
          <span className="text-xs font-medium text-[#707a8c]">
            Ticket Number
          </span>
          <span className="text-3xl font-extrabold text-[#2663eb] mt-1">
            {ticket_number}
          </span>
        </div>

        {/* Line Position */}
        <div className="bg-[#f7fafc] border border-[#e3e8f0] rounded-xl p-4 flex flex-col items-center justify-center">
          <Users className="w-5 h-5 text-[#2663eb] mb-1" />
          <span className="text-xs font-medium text-[#707a8c]">
            Ahead of You
          </span>
          <span className="text-3xl font-extrabold text-[#171c29] mt-1">
            {status === "Waiting"
              ? position_in_line
              : status === "In Progress"
                ? "0"
                : "-"}
          </span>
        </div>

        {/* Estimated Wait */}
        <div className="bg-[#f7fafc] border border-[#e3e8f0] rounded-xl p-4 flex flex-col items-center justify-center">
          <Clock className="w-5 h-5 text-[#2663eb] mb-1" />
          <span className="text-xs font-medium text-[#707a8c]">
            Est. Wait Time
          </span>
          <span className="text-2xl font-bold text-[#171c29] mt-1">
            {status === "Waiting"
              ? `${estimated_wait_minutes} Mins`
              : status === "In Progress"
                ? "Serving"
                : "N/A"}
          </span>
        </div>
      </div>

      {/* Counter Banner if In Progress */}
      {status === "In Progress" && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-center animate-pulse">
          <Monitor className="w-6 h-6 text-[#2663eb] mx-auto mb-1" />
          <h4 className="font-bold text-[#2663eb] text-lg">
            Please Proceed to {counter_number || "Counter 1"}
          </h4>
          <p className="text-xs text-blue-700">
            An agent is ready to serve you now!
          </p>
        </div>
      )}

      {/* Action Footer */}
      {status === "Waiting" && (
        <div className="pt-2 border-t border-[#e3e8f0]">
          <button
            onClick={handleCancelTicket}
            disabled={cancelling}
            className="w-full bg-[#db2626] hover:bg-red-700 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
          >
            <XCircle className="w-5 h-5" />
            <span>
              {cancelling ? "Cancelling Ticket..." : "Cancel My Ticket"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
