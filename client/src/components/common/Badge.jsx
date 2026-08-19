import React from "react";

export default function Badge({ status, text }) {
  const statusUpper = (status || "").toUpperCase();

  const getStyle = () => {
    switch (statusUpper) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 border-green-200";
      case "EXPIRING_SOON":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "EXPIRED":
        return "bg-red-100 text-red-800 border-red-200";
      case "PENDING":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "APPROVED":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200";
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formattedText = text || statusUpper.replace("_", " ");

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStyle()}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current"></span>
      {formattedText}
    </span>
  );
}
