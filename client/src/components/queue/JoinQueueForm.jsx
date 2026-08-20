import React, { useState } from "react";
import { joinQueue } from "../../services/api";
import {
  User,
  Briefcase,
  ArrowRight,
  AlertCircle,
  Loader2,
} from "lucide-react";

const SERVICE_OPTIONS = [
  "Customer Service (General Inquiry)",
  "Account & Banking Services",
  "Technical Support & Assistance",
  "Billing & Payment Processing",
  "VIP & Express Services",
];

export default function JoinQueueForm({ onSuccess }) {
  const [customerName, setCustomerName] = useState("");
  const [serviceType, setServiceType] = useState(SERVICE_OPTIONS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setError("Please enter your full name");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ticket = await joinQueue(customerName.trim(), serviceType);
      if (onSuccess) {
        onSuccess(ticket);
      }
    } catch (err) {
      console.error("Failed to join queue:", err);
      const msg =
        err.response?.data?.detail ||
        err.message ||
        "Failed to join queue. Please try again.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm w-full max-w-lg">
      <h2 className="text-xl font-bold text-[#171c29] mb-1">Join the Queue</h2>
      <p className="text-sm text-[#707a8c] mb-6">
        Enter your details to generate your digital queue ticket.
      </p>

      {error && (
        <div
          role="alert"
          className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="customerName"
            className="block text-xs font-semibold text-[#707a8c] uppercase tracking-wider mb-1"
          >
            Full Name
          </label>
          <div className="relative">
            <User className="w-5 h-5 text-[#707a8c] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="customerName"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full bg-[#f2f5fa] border border-[#e3e8f0] rounded-lg pl-10 pr-4 py-3 text-sm text-[#171c29] focus:outline-none focus:ring-2 focus:ring-[#2663eb] transition-all"
              disabled={loading}
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="serviceType"
            className="block text-xs font-semibold text-[#707a8c] uppercase tracking-wider mb-1"
          >
            Service Type Requested
          </label>
          <div className="relative">
            <Briefcase className="w-5 h-5 text-[#707a8c] absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              id="serviceType"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full bg-[#f2f5fa] border border-[#e3e8f0] rounded-lg pl-10 pr-4 py-3 text-sm text-[#171c29] focus:outline-none focus:ring-2 focus:ring-[#2663eb] transition-all appearance-none cursor-pointer"
              disabled={loading}
            >
              {SERVICE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2663eb] hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating Ticket...</span>
              </>
            ) : (
              <>
                <span>Join Queue Now</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
