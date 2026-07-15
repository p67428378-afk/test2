import React, { useState } from "react";
import VerificationCard from "../components/security/VerificationCard";
import { visitService, securityService } from "../services/api";

export default function SecurityPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [visitor, setVisitor] = useState(null);
  const [visitHistory, setVisitHistory] = useState([]);
  const [activeVisitLog, setActiveVisitLog] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Mock search for visitor
  const handleSearch = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (
      searchQuery.toLowerCase().includes("john") ||
      searchQuery.toLowerCase().includes("test")
    ) {
      setVisitor({
        id: "88888888-8888-4888-8888-888888888888",
        full_name: "John Doe",
        gov_id: "DL-987654321",
        phone: "+1 (555) 019-2834",
        is_verified: true,
      });
    } else {
      setError("No visitor found matching that name or ID.");
      setVisitor(null);
    }
  };

  const handleVerifyOnSite = async (visitorId) => {
    setSuccess("On-site identity verification completed successfully!");
  };

  const handleFlagVisitor = async (visitorId, reason) => {
    try {
      await securityService.flagVisitor(visitorId, reason);
      setSuccess("Visitor has been flagged for rule violations.");
    } catch (err) {
      setError("Failed to flag visitor.");
    }
  };

  const handleCheckIn = async () => {
    try {
      // Simulate check-in using a mock appointment ID
      const mockApptId = "99999999-9999-4999-9999-999999999999";
      const log = await visitService.checkIn(mockApptId);
      setActiveVisitLog(log);
      setSuccess("Visitor checked in successfully! Entry logged.");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to check in visitor.");
    }
  };

  const handleCheckOut = async () => {
    if (!activeVisitLog) return;
    try {
      await visitService.checkOut(activeVisitLog.id);
      setActiveVisitLog(null);
      setSuccess("Visitor checked out successfully! Exit logged.");
    } catch (err) {
      setError("Failed to check out visitor.");
    }
  };

  return (
    <div className="max-w-container-max w-full mx-auto p-6 flex flex-col gap-6">
      <div className="flex justify-between items-center bg-surface-container p-6 rounded-xl border border-surface-variant shadow-lg">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">
            Security Officer Portal
          </h1>
          <p className="text-sm text-on-surface-variant">
            Manage visitor entry/exit logs and perform identity verification.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-error-container text-on-error-container px-4 py-2 rounded-lg text-sm font-semibold border border-error">
          <span>Role: Security Officer</span>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-error-container border border-error text-on-error-container rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 bg-[#132d20] border border-[#1f4a35] text-[#4ade80] rounded-lg text-sm">
          {success}
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-surface-container p-6 rounded-xl border border-surface-variant shadow-lg">
        <h3 className="text-lg font-semibold text-on-surface mb-3">
          Search Visitor
        </h3>
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            placeholder="Enter visitor name or Government ID..."
            className="flex-1 bg-surface-container-high border border-outline-variant text-on-surface rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-fixed"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-[#6366f1] text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {visitor && (
        <div className="flex flex-col gap-6">
          <VerificationCard
            visitor={visitor}
            onVerifyOnSite={handleVerifyOnSite}
            onFlagVisitor={handleFlagVisitor}
          />

          {/* Entry/Exit Logs */}
          <div className="bg-surface-container p-6 rounded-xl border border-surface-variant shadow-lg">
            <h3 className="text-lg font-semibold text-on-surface mb-4">
              Entry & Exit Management
            </h3>
            <div className="flex gap-4">
              <button
                onClick={handleCheckIn}
                disabled={activeVisitLog !== null}
                className={`flex-1 py-4 rounded-lg font-semibold text-sm transition-colors ${
                  activeVisitLog !== null
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-[#132d20] border border-[#1f4a35] text-[#4ade80] hover:bg-opacity-90"
                }`}
              >
                Log Check-In (Entry)
              </button>
              <button
                onClick={handleCheckOut}
                disabled={activeVisitLog === null}
                className={`flex-1 py-4 rounded-lg font-semibold text-sm transition-colors ${
                  activeVisitLog === null
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-error-container border border-error text-on-error-container hover:bg-opacity-90"
                }`}
              >
                Log Check-Out (Exit)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
