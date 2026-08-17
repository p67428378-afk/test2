import React, { useEffect, useState } from "react";
import { claimService, itemService } from "../services/api";
import ClaimPanel from "../components/lost-found/ClaimPanel";
import Badge from "../components/common/Badge";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
} from "lucide-react";

export const AdminQueuePage = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemLoading, setItemLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchPendingClaims = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await claimService.getAdminClaims();
      setClaims(Array.isArray(data) ? data : []);
      if (Array.isArray(data) && data.length > 0) {
        handleSelectClaim(data[0]);
      }
    } catch (err) {
      console.error("Error fetching admin claims:", err);
      setError("Failed to fetch pending admin verification queue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingClaims();
  }, []);

  const handleSelectClaim = async (claim) => {
    setSelectedClaim(claim);
    setItemLoading(true);
    try {
      const itemData = await itemService.getItemById(claim.item_id);
      setSelectedItem(itemData);
    } catch (err) {
      setSelectedItem(null);
    } finally {
      setItemLoading(false);
    }
  };

  const handleVerifyClaim = async (claimId, verifyData) => {
    setActionLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      await claimService.verifyClaim(claimId, verifyData);
      setSuccessMsg(`Claim successfully ${verifyData.status}!`);
      await fetchPendingClaims();
    } catch (err) {
      setError(err.message || "Failed to verify claim.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
            Admin Ownership Verification Queue
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review claimant ownership proof, approve/reject claims, and record
            administrative audit notes.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm"
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 text-sm">
              Pending Verification ({claims.length})
            </h3>
            <button
              onClick={fetchPendingClaims}
              className="text-xs text-indigo-600 hover:underline font-medium"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Loading claims queue...
            </div>
          ) : claims.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No pending claims requiring verification.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {claims.map((c) => {
                const isSelected = selectedClaim?.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => handleSelectClaim(c)}
                    className={`w-full text-left p-4 hover:bg-slate-50 transition flex flex-col gap-1 ${
                      isSelected
                        ? "bg-indigo-50/60 border-l-4 border-indigo-600"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-800">
                        Claim #{c.id.slice(0, 8)}
                      </span>
                      <Badge variant="warning">{c.status}</Badge>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-1 italic">
                      "{c.proof_of_ownership}"
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1">
                      Submitted: {new Date(c.created_at).toLocaleDateString()}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {selectedClaim ? (
            <div className="space-y-6">
              {selectedItem && (
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <h4 className="font-semibold text-slate-800 text-sm border-b border-slate-100 pb-2 mb-3">
                    Target Item Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400">Name:</span>
                      <p className="font-medium text-slate-800">
                        {selectedItem.name}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400">Category:</span>
                      <p className="font-medium text-slate-800">
                        {selectedItem.category}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400">Location:</span>
                      <p className="font-medium text-slate-800">
                        {selectedItem.location}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400">Type:</span>
                      <p className="font-medium uppercase text-slate-800">
                        {selectedItem.type}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 text-xs">
                    <span className="text-slate-400">Description:</span>
                    <p className="font-normal text-slate-700 mt-0.5">
                      {selectedItem.description}
                    </p>
                  </div>
                </div>
              )}

              <ClaimPanel
                claim={selectedClaim}
                onVerify={handleVerifyClaim}
                loading={actionLoading}
                isAdmin={true}
              />
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-sm">
              Select a pending claim from the queue to verify proof of
              ownership.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminQueuePage;
