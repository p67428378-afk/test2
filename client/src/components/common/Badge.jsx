import React from "react";
import PropTypes from "prop-types";

export default function Badge({ status }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    accepted: "bg-blue-100 text-blue-800 border border-blue-200",
    preparing: "bg-purple-100 text-purple-800 border border-purple-200",
    ready_for_pickup: "bg-indigo-100 text-indigo-800 border border-indigo-200",
    out_for_delivery: "bg-orange-100 text-orange-800 border border-orange-200",
    delivered: "bg-green-100 text-green-800 border border-green-200",
    cancelled: "bg-red-100 text-red-800 border border-red-200",
    paid: "bg-green-100 text-green-800 border border-green-200",
    unpaid: "bg-red-100 text-red-800 border border-red-200",
    refunded: "bg-gray-100 text-gray-800 border border-gray-200",
  };

  const label = status ? status.replace(/_/g, " ") : "unknown";

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${styles[status] || "bg-gray-100 text-gray-800"}`}
    >
      {label}
    </span>
  );
}

Badge.propTypes = {
  status: PropTypes.string.isRequired,
};
