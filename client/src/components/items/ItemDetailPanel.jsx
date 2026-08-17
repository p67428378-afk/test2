import React, { useState } from "react";
import {
  MapPin,
  Mail,
  Calendar,
  Tag,
  AlertCircle,
  CheckCircle,
  ShieldAlert,
} from "lucide-react";
import { claimService } from "../../services/api";

export default function ItemDetailPanel({ item, onClaimSubmitted }) {
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimantDetails, setClaimantDetails] = useState("");
  const [claimDate, setClaimDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!item) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-sm">
        <p className="text-slate-500">
          Select an item from the list to view details.
        </p>
      </div>
    );
  }

  const isLost = item.status?.toLowerCase() === "lost";
  const formattedDate = item.report_date
    ? new Date(item.report_date).toLocaleDateString()
    : "";

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!claimantDetails.trim()) {
      setError("Please provide details to verify your ownership.");
      return;
    }

    try {
      await claimService.submitClaim({
        item_id: item.id,
        claimant_details: claimantDetails,
        claim_date: new Date(claimDate).toISOString(),
      });
      setSuccess(
        "Claim submitted successfully! An administrator will review it.",
      );
      setClaimantDetails("");
      setIsClaiming(false);
      if (onClaimSubmitted) {
        onClaimSubmitted();
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to submit claim. Please try again.",
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      {/* Header / Image Gallery */}
      <div className="p-6 pb-4 border-b border-slate-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-900">Item Details</h3>
        </div>

        {/* Image Gallery */}
        {item.images && item.images.length > 0 ? (
          <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
            {item.images.map((img, idx) => (
              <div
                key={img.id || idx}
                className="w-1/2 aspect-video rounded-xl bg-slate-100 overflow-hidden flex-shrink-0"
              >
                <img
                  src={img.image_url}
                  alt={`${item.name} - ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full aspect-video rounded-xl bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center text-slate-400 mb-6">
            No images uploaded
          </div>
        )}

        <div className="flex justify-between items-end">
          <div>
            <h4 className="text-2xl font-bold text-slate-900 leading-tight">
              {item.name}
            </h4>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
              <Tag className="h-3.5 w-3.5" />
              <span>{item.category}</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span>Reported {formattedDate}</span>
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${
              isLost
                ? "bg-rose-50 text-rose-700 border border-rose-100"
                : "bg-emerald-50 text-emerald-700 border border-emerald-100"
            }`}
          >
            {isLost ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            <span className="capitalize">{item.status}</span>
          </span>
        </div>
      </div>

      {/* Details Body */}
      <div className="p-6 flex flex-col gap-5">
        <div>
          <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Description
          </h5>
          <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
            {item.description || "No description provided."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Last Seen Location
            </h5>
            <p className="text-sm text-slate-700 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span>{item.location}</span>
            </p>
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Contact Info
            </h5>
            <p className="text-sm text-slate-700 flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-400" />
              <span>{item.contact_info}</span>
            </p>
          </div>
        </div>

        {/* Claim Section */}
        {!isLost && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            {success && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg text-sm">
                {success}
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-100 text-rose-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {!isClaiming ? (
              <button
                onClick={() => setIsClaiming(true)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-semibold transition-colors shadow-sm"
              >
                Claim this Item
              </button>
            ) : (
              <form
                onSubmit={handleClaimSubmit}
                className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100"
              >
                <h6 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-indigo-600" />
                  Submit Ownership Claim
                </h6>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Verification Details (e.g. unique marks, proof of purchase,
                    contents)
                  </label>
                  <textarea
                    value={claimantDetails}
                    onChange={(e) => setClaimantDetails(e.target.value)}
                    rows={3}
                    placeholder="Describe how you can prove this item belongs to you..."
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Claim Date
                  </label>
                  <input
                    type="date"
                    value={claimDate}
                    onChange={(e) => setClaimDate(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold text-sm transition-colors"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsClaiming(false)}
                    className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-2 rounded-lg font-semibold text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
