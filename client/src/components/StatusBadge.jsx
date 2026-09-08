import React from "react";

export default function StatusBadge({ status, type = "room" }) {
  const getBadgeStyle = () => {
    const s = (status || "").toUpperCase();

    // Room Statuses
    if (s === "AVAILABLE") {
      return "bg-emerald-100 text-emerald-800 border-emerald-300";
    }
    if (s === "OCCUPIED") {
      return "bg-blue-100 text-blue-800 border-blue-300";
    }
    if (s === "CLEANING") {
      return "bg-amber-100 text-amber-800 border-amber-300";
    }
    if (s === "MAINTENANCE") {
      return "bg-rose-100 text-rose-800 border-rose-300";
    }

    // Reservation Statuses
    if (s === "CONFIRMED") {
      return "bg-indigo-100 text-indigo-800 border-indigo-300";
    }
    if (s === "CHECKED_IN") {
      return "bg-emerald-100 text-emerald-800 border-emerald-300";
    }
    if (s === "CHECKED_OUT") {
      return "bg-slate-200 text-slate-800 border-slate-300";
    }
    if (s === "CANCELLED") {
      return "bg-red-100 text-red-800 border-red-300";
    }

    // Invoice Statuses
    if (s === "PAID") {
      return "bg-emerald-100 text-emerald-800 border-emerald-300";
    }
    if (s === "UNPAID") {
      return "bg-rose-100 text-rose-800 border-rose-300";
    }
    if (s === "PARTIAL") {
      return "bg-amber-100 text-amber-800 border-amber-300";
    }

    return "bg-gray-100 text-gray-800 border-gray-300";
  };

  const formatText = (text) => {
    if (!text) return "Unknown";
    if (text === "CHECKED_IN") return "Checked In";
    if (text === "CHECKED_OUT") return "Checked Out";
    if (text === "CONFIRMED") return "Confirmed";
    if (text === "CANCELLED") return "Cancelled";
    return text;
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBadgeStyle()}`}
      data-testid="status-badge"
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70" />
      {formatText(status)}
    </span>
  );
}
