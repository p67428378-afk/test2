import React, { useState } from "react";
import Modal from "../common/Modal";
import { ArrowRightLeft, ShieldCheck, CheckSquare } from "lucide-react";

export default function CustodianTransferModal({
  isOpen,
  onClose,
  evidenceItem,
  users = [],
  onTransferSubmit,
  isSubmitting,
}) {
  const [newCustodianId, setNewCustodianId] = useState("");
  const [transferReason, setTransferReason] = useState("Court Presentation");
  const [locationContext, setLocationContext] = useState(
    "8th Judicial District Courtroom 4B",
  );
  const [departingSignoff, setDepartingSignoff] = useState(true);
  const [receivingSignoff, setReceivingSignoff] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newCustodianId) return;
    if (onTransferSubmit) {
      onTransferSubmit({
        evidence_id: evidenceItem?.id || "EVID-1002",
        new_custodian_id: newCustodianId,
        transfer_reason: transferReason,
        location_context: locationContext,
        departing_signoff: departingSignoff,
        receiving_signoff: receivingSignoff,
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Execute Chain of Custody Transfer (Form 804-E)"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400">Transfer Target Item</p>
          <p className="text-sm font-bold text-slate-200">
            {evidenceItem?.evidence_code || "EVID-1002"} -{" "}
            {evidenceItem?.file_name || "dashcam_footage.mp4"}
          </p>
          <p className="text-xs font-mono text-emerald-400 break-all">
            {evidenceItem?.sha256_hash || "a5f18c0e2b4d9627e36980db1c14..."}
          </p>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">
            Select Receiving Custodian
          </label>
          <select
            value={newCustodianId}
            onChange={(e) => setNewCustodianId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
            required
          >
            <option value="">-- Select Custodian --</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.full_name || u.email} ({u.role})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">
            Transfer Reason
          </label>
          <input
            type="text"
            value={transferReason}
            onChange={(e) => setTransferReason(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
            placeholder="e.g. Court Presentation, Forensic Lab Analysis"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">
            Location Context
          </label>
          <input
            type="text"
            value={locationContext}
            onChange={(e) => setLocationContext(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
            placeholder="e.g. 8th Judicial District Courtroom 4B"
          />
        </div>

        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
          <p className="text-xs font-semibold text-slate-300">
            Dual Sign-Off Certification
          </p>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
            <input
              type="checkbox"
              checked={departingSignoff}
              onChange={(e) => setDepartingSignoff(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
            />
            <span>
              Departing Custodian Sign-Off (Confirm physical & digital transfer)
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
            <input
              type="checkbox"
              checked={receivingSignoff}
              onChange={(e) => setReceivingSignoff(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
            />
            <span>
              Receiving Custodian Sign-Off (Acknowledge receipt & custody)
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !newCustodianId}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>{isSubmitting ? "Transferring..." : "Execute Transfer"}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
