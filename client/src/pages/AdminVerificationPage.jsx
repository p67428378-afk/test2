import React, { useState, useEffect } from "react";
import {
  Check,
  X,
  ShieldAlert,
  RefreshCw,
  Calendar,
  User,
  Tag,
  MapPin,
} from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import { claimService } from "../services/api";

export default function AdminVerificationPage() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const data = await claimService.getClaims();
      setClaims(data || []);
    } catch (err) {
      setError("Failed to load claims. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (claimId, status) => {
    setError("");
    setSuccess("");
    try {
      await claimService.verifyClaim(claimId, status);
      setSuccess(`Claim successfully ${status}!`);
      fetchClaims();
    } catch (err) {
      setError(err.response?.data?.detail || `Failed to ${status} claim.`);
    }
  };

  return (
    <AppLayout>
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <ShieldAlert className="h-8 w-8 text-indigo-600" />
            Admin Verification Portal
          </h2>
          <p className="text-slate-500 mt-1">
            Review and verify ownership claims for found items.
          </p>
        </div>
        <button
          onClick={fetchClaims}
          className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-semibold transition-all shadow-sm flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </header>

      {success && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-slate-500 mt-4">Loading claims...</p>
        </div>
      ) : claims.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-lg">No claims submitted yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {claims.map((claim) => {
            const isPending = claim.status?.toLowerCase() === "pending";
            const isApproved = claim.status?.toLowerCase() === "approved";
            const isRejected = claim.status?.toLowerCase() === "rejected";
            const claimDate = claim.claim_date
              ? new Date(claim.claim_date).toLocaleDateString()
              : "";

            return (
              <div
                key={claim.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row"
              >
                {/* Left: Claim Details */}
                <div className="p-6 flex-1 border-b lg:border-b-0 lg:border-r border-slate-100">
                  <div className="flex justify-between items-start mb-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        isPending
                          ? "bg-amber-50 text-amber-700 border border-amber-100"
                          : isApproved
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-rose-50 text-rose-700 border border-rose-100"
                      }`}
                    >
                      <span className="capitalize">{claim.status} Claim</span>
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {claimDate}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Claimant Details
                      </h4>
                      <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-start gap-2">
                        <User className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                        <span>{claim.claimant_details}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: Item Details & Actions */}
                <div className="p-6 flex-1 bg-slate-50/50 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Associated Item
                    </h4>
                    <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                      <h5 className="text-base font-bold text-slate-900 mb-2">
                        {claim.item?.name || "Unknown Item"}
                      </h5>
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Tag className="h-3.5 w-3.5" />
                          {claim.item?.category || "N/A"}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {claim.item?.location || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isPending && (
                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() => handleVerify(claim.id, "approved")}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Check className="h-4 w-4" />
                        Approve Claim
                      </button>
                      <button
                        onClick={() => handleVerify(claim.id, "rejected")}
                        className="flex-1 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-1.5"
                      >
                        <X className="h-4 w-4" />
                        Reject Claim
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}
