import React, { useState } from "react";

export default function VerificationCard({
  visitor,
  onVerifyOnSite,
  onFlagVisitor,
}) {
  const [flagReason, setFlagReason] = useState("");
  const [showFlagModal, setShowFlagReasonModal] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleVerify = () => {
    onVerifyOnSite(visitor.id);
    setVerified(true);
  };

  const handleFlagSubmit = (e) => {
    e.preventDefault();
    if (!flagReason) return;
    onFlagVisitor(visitor.id, flagReason);
    setShowFlagReasonModal(false);
    setFlagReason("");
  };

  return (
    <div className="bg-surface-container p-6 rounded-xl border border-surface-variant shadow-lg flex flex-col md:flex-row gap-6">
      {/* Live Photo vs ID Photo Simulation */}
      <div className="flex-1 flex flex-col gap-4">
        <h3 className="font-headline-sm text-headline-sm text-on-surface border-b border-surface-variant pb-2">
          Identity Verification
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container-high p-4 rounded-lg border border-outline-variant text-center">
            <div className="font-label-sm text-label-sm text-on-surface-variant mb-2">
              ID Photo (On File)
            </div>
            <div className="w-full h-32 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 text-xs">
              👤 Photo ID
            </div>
          </div>
          <div className="bg-surface-container-high p-4 rounded-lg border border-outline-variant text-center">
            <div className="font-label-sm text-label-sm text-on-surface-variant mb-2">
              Live Camera Feed
            </div>
            <div className="w-full h-32 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 text-xs relative overflow-hidden">
              📹 Live Feed
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="mt-2 flex gap-3">
          <button
            onClick={handleVerify}
            disabled={verified}
            className={`flex-1 py-3 rounded-lg font-label-md text-label-md transition-colors ${
              verified
                ? "bg-[#132d20] border border-[#1f4a35] text-[#4ade80]"
                : "bg-[#6366f1] text-white hover:bg-opacity-90"
            }`}
          >
            {verified
              ? "✓ Identity Verified On-Site"
              : "Verify Identity (Match Photos)"}
          </button>
          <button
            onClick={() => setShowFlagReasonModal(true)}
            className="bg-error-container border border-error text-on-error-container hover:bg-opacity-90 px-4 py-3 rounded-lg font-label-md text-label-md transition-colors"
          >
            Flag Violator
          </button>
        </div>
      </div>

      {/* Visitor Details */}
      <div className="w-full md:w-80 bg-surface-container-high p-4 rounded-lg border border-outline-variant flex flex-col gap-3">
        <h4 className="font-semibold text-on-surface border-b border-surface-variant pb-2">
          Visitor Details
        </h4>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-on-surface-variant">Full Name</span>
          <span className="text-sm font-medium text-on-surface">
            {visitor.full_name}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-on-surface-variant">Government ID</span>
          <span className="text-sm font-mono text-on-surface">
            {visitor.gov_id}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-on-surface-variant">Phone</span>
          <span className="text-sm text-on-surface">
            {visitor.phone || "N/A"}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-on-surface-variant">
            Online Verification Status
          </span>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded self-start ${
              visitor.is_verified
                ? "bg-[#132d20] text-[#4ade80]"
                : "bg-error-container text-on-error-container"
            }`}
          >
            {visitor.is_verified ? "Verified Online" : "Unverified"}
          </span>
        </div>
      </div>

      {/* Flag Modal */}
      {showFlagModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface-container-high border border-surface-variant p-6 rounded-xl max-w-md w-full shadow-2xl">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">
              Flag Visitor for Violation
            </h3>
            <form onSubmit={handleFlagSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label
                  className="font-label-sm text-label-sm text-on-surface-variant"
                  htmlFor="flagReason"
                >
                  Reason for Flagging
                </label>
                <textarea
                  id="flagReason"
                  rows="3"
                  className="bg-surface-container border border-outline-variant text-on-surface font-body-md text-body-md rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-fixed"
                  placeholder="e.g., Contraband attempt, rule violation, etc."
                  value={flagReason}
                  onChange={(e) => setFlagReason(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setShowFlagReasonModal(false)}
                  className="bg-secondary-container text-on-secondary-container hover:bg-opacity-90 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-error-container border border-error text-on-error-container hover:bg-opacity-90 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  Flag Visitor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
