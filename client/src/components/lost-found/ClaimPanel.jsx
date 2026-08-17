import React, { useState } from "react";
import Button from "../common/Button";
import Badge from "../common/Badge";
import { ShieldCheck, AlertCircle, CheckCircle, XCircle } from "lucide-react";

export const ClaimPanel = ({
  claim,
  onVerify,
  loading = false,
  isAdmin = false,
  onSubmitClaim,
  itemId,
}) => {
  const [proofOfOwnership, setProofOfOwnership] = useState("");
  const [status, setStatus] = useState("approved");
  const [rejectionReason, setRejectionReason] = useState(
    "Insufficient proof of ownership",
  );
  const [adminNotes, setAdminNotes] = useState("");
  const [error, setError] = useState("");

  const rejectionReasons = [
    "Insufficient proof of ownership",
    "Identifier / Name mismatch",
    "Item already claimed by verified owner",
    "Invalid or fake claim description",
  ];

  const handleUserClaimSubmit = async (e) => {
    e.preventDefault();
    if (!proofOfOwnership.trim()) {
      setError("Proof of ownership description is required.");
      return;
    }
    setError("");
    try {
      await onSubmitClaim({
        item_id: itemId,
        proof_of_ownership: proofOfOwnership,
      });
      setProofOfOwnership("");
    } catch (err) {
      setError(err.message || "Failed to submit claim.");
    }
  };

  const handleAdminVerifySubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      status: status,
      rejection_reason: status === "rejected" ? rejectionReason : null,
      admin_notes: adminNotes,
    };
    try {
      await onVerify(claim.id, payload);
    } catch (err) {
      setError(err.message || "Failed to verify claim.");
    }
  };

  if (!isAdmin && !claim) {
    return (
      <form
        onSubmit={handleUserClaimSubmit}
        className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4"
      >
        <h4 className="font-semibold text-slate-800 text-base flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          Claim This Item
        </h4>
        <p className="text-xs text-slate-500">
          Describe specific features, unique identifiers, serial numbers, or
          details only the true owner would know.
        </p>

        {error && (
          <div
            role="alert"
            className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-1.5"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label
            htmlFor="proof"
            className="block text-xs font-medium text-slate-700 mb-1"
          >
            Proof of Ownership <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="proof"
            rows={3}
            value={proofOfOwnership}
            onChange={(e) => setProofOfOwnership(e.target.value)}
            placeholder="e.g. It contains a driver license in the name of Jane Doe and a photo of a dog in the billfold..."
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <Button type="submit" loading={loading} className="w-full">
          Submit Ownership Claim
        </Button>
      </form>
    );
  }

  if (claim) {
    return (
      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h4 className="font-semibold text-slate-800 text-sm">Claim Status</h4>
          <Badge
            variant={
              claim.status === "approved"
                ? "success"
                : claim.status === "rejected"
                  ? "danger"
                  : "warning"
            }
          >
            {claim.status}
          </Badge>
        </div>

        <div className="text-xs space-y-2 text-slate-600">
          <div>
            <span className="font-medium text-slate-700">Claimant ID:</span>{" "}
            {claim.claimant_id}
          </div>
          <div>
            <span className="font-medium text-slate-700">Proof Submitted:</span>
            <p className="mt-1 bg-white p-2.5 rounded border border-slate-200 italic">
              {claim.proof_of_ownership}
            </p>
          </div>
          {claim.rejection_reason && (
            <div>
              <span className="font-medium text-rose-700">
                Rejection Reason:
              </span>{" "}
              {claim.rejection_reason}
            </div>
          )}
          {claim.admin_notes && (
            <div>
              <span className="font-medium text-slate-700">Admin Notes:</span>{" "}
              {claim.admin_notes}
            </div>
          )}
        </div>

        {isAdmin && claim.status === "pending" && (
          <form
            onSubmit={handleAdminVerifySubmit}
            className="pt-3 border-t border-slate-200 space-y-3"
          >
            <h5 className="font-medium text-xs text-slate-800 uppercase tracking-wide">
              Admin Review Action
            </h5>

            {error && (
              <div
                role="alert"
                className="p-2.5 bg-rose-50 border border-rose-200 rounded text-rose-700 text-xs"
              >
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus("approved")}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition ${
                  status === "approved"
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white border-slate-200 text-slate-600"
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" /> Approve
              </button>
              <button
                type="button"
                onClick={() => setStatus("rejected")}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition ${
                  status === "rejected"
                    ? "bg-rose-600 text-white border-rose-600"
                    : "bg-white border-slate-200 text-slate-600"
                }`}
              >
                <XCircle className="w-3.5 h-3.5" /> Reject
              </button>
            </div>

            {status === "rejected" && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Rejection Reason
                </label>
                <select
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs"
                >
                  {rejectionReasons.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Administrative Notes
              </label>
              <input
                type="text"
                placeholder="e.g. Verified ID matches. User notified for pickup."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs"
              />
            </div>

            <Button
              type="submit"
              loading={loading}
              variant={status === "approved" ? "success" : "danger"}
              className="w-full"
            >
              Finalize Verification
            </Button>
          </form>
        )}
      </div>
    );
  }

  return null;
};

export default ClaimPanel;
