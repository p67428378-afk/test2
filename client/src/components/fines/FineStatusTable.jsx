import React, { useState } from "react";
import { getStatusBadge } from "./FineDetailsCard";
import { Edit2, Ban, Search, Filter, History, AlertCircle } from "lucide-react";

export default function FineStatusTable({
  fines,
  onUpdateStatus,
  onVoidFine,
  onViewAudit,
  isLoading,
}) {
  const [filterStatus, setFilterStatus] = useState("");
  const [searchPlate, setSearchPlate] = useState("");
  const [editingFine, setEditingFine] = useState(null);
  const [voidingFine, setVoidingFine] = useState(null);

  const [updateStatusVal, setUpdateStatusVal] = useState("PAID");
  const [updateAmountVal, setUpdateAmountVal] = useState("");
  const [updateTxnRef, setUpdateTxnRef] = useState("");
  const [updateNotes, setUpdateNotes] = useState("");
  const [voidNotes, setVoidNotes] = useState("");

  const [actionError, setActionError] = useState("");

  const filteredFines = fines.filter((fine) => {
    const matchesStatus = !filterStatus || fine.status === filterStatus;
    const matchesPlate =
      !searchPlate ||
      fine.license_plate.toLowerCase().includes(searchPlate.toLowerCase()) ||
      fine.ticket_number.toLowerCase().includes(searchPlate.toLowerCase());
    return matchesStatus && matchesPlate;
  });

  const handleOpenEdit = (fine) => {
    setActionError("");
    setEditingFine(fine);
    setUpdateStatusVal(fine.status);
    setUpdateAmountVal(fine.amount);
    setUpdateTxnRef(fine.transaction_reference || "");
    setUpdateNotes("");
  };

  const handleOpenVoid = (fine) => {
    setActionError("");
    setVoidingFine(fine);
    setVoidNotes("");
  };

  const handleSaveUpdate = async (e) => {
    e.preventDefault();
    setActionError("");
    try {
      await onUpdateStatus(editingFine.id, {
        status: updateStatusVal,
        amount: updateAmountVal ? parseFloat(updateAmountVal) : undefined,
        transaction_reference: updateTxnRef || undefined,
        notes: updateNotes || undefined,
      });
      setEditingFine(null);
    } catch (err) {
      setActionError(
        err.response?.data?.detail || "Failed to update fine details",
      );
    }
  };

  const handleConfirmVoid = async (e) => {
    e.preventDefault();
    if (!voidNotes.trim()) {
      setActionError("Void notes/justification is required");
      return;
    }
    setActionError("");
    try {
      await onVoidFine(voidingFine.id, voidNotes.trim());
      setVoidingFine(null);
    } catch (err) {
      setActionError(err.response?.data?.detail || "Failed to void citation");
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-wrap gap-4 justify-between items-center">
        <h3 className="font-bold text-slate-900 text-lg">
          Fine Records Management
        </h3>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchPlate}
              onChange={(e) => setSearchPlate(e.target.value)}
              placeholder="Filter by plate or ticket..."
              className="pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white w-48 sm:w-64"
            />
          </div>

          <div className="flex items-center space-x-1.5">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="py-2 px-3 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700 font-medium"
            >
              <option value="">All Statuses</option>
              <option value="UNPAID">UNPAID</option>
              <option value="PENDING_VERIFICATION">PENDING VERIFICATION</option>
              <option value="PAID">PAID</option>
              <option value="OVERDUE">OVERDUE</option>
              <option value="VOIDED">VOIDED</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Ticket #</th>
              <th className="px-4 py-3">License Plate</th>
              <th className="px-4 py-3">Violation</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Due Date</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {isLoading ? (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-8 text-slate-500 text-sm"
                >
                  Loading fine records...
                </td>
              </tr>
            ) : filteredFines.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-8 text-slate-500 text-sm"
                >
                  No parking fine records found matching filters.
                </td>
              </tr>
            ) : (
              filteredFines.map((fine) => (
                <tr
                  key={fine.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3 font-mono font-bold text-slate-900 text-xs">
                    {fine.ticket_number}
                  </td>
                  <td className="px-4 py-3 font-mono font-semibold text-blue-700 text-xs">
                    {fine.license_plate}
                  </td>
                  <td className="px-4 py-3 text-slate-800 text-xs font-medium">
                    {fine.violation_type}
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs">
                    {fine.location}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900 text-xs">
                    ${Number(fine.amount).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(fine.status)}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {new Date(fine.due_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right space-x-1 whitespace-nowrap">
                    <button
                      onClick={() => onViewAudit(fine.id)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                      title="View Audit Trail"
                    >
                      <History className="w-4 h-4" />
                    </button>
                    {fine.status !== "VOIDED" && (
                      <>
                        <button
                          onClick={() => handleOpenEdit(fine)}
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                          title="Update Fine Status"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenVoid(fine)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Void Citation"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Fine Status Modal */}
      {editingFine && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-slate-200">
            <h4 className="text-lg font-bold text-slate-900 mb-1">
              Update Fine Status: {editingFine.ticket_number}
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Plate:{" "}
              <span className="font-mono font-bold text-blue-700">
                {editingFine.license_plate}
              </span>
            </p>

            {actionError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            <form onSubmit={handleSaveUpdate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Payment Status
                </label>
                <select
                  value={updateStatusVal}
                  onChange={(e) => setUpdateStatusVal(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
                >
                  <option value="UNPAID">UNPAID</option>
                  <option value="PENDING_VERIFICATION">
                    PENDING VERIFICATION
                  </option>
                  <option value="PAID">PAID</option>
                  <option value="OVERDUE">OVERDUE</option>
                  <option value="VOIDED">VOIDED</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Adjust Fine Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={updateAmountVal}
                  onChange={(e) => setUpdateAmountVal(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Transaction Reference
                </label>
                <input
                  type="text"
                  value={updateTxnRef}
                  onChange={(e) => setUpdateTxnRef(e.target.value)}
                  placeholder="e.g. TXN-88219"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Admin Audit Note
                </label>
                <textarea
                  value={updateNotes}
                  onChange={(e) => setUpdateNotes(e.target.value)}
                  placeholder="Notes explaining manual status update..."
                  rows="2"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingFine(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Void Fine Confirmation Modal */}
      {voidingFine && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-slate-200">
            <h4 className="text-lg font-bold text-red-700 mb-1 flex items-center space-x-2">
              <Ban className="w-5 h-5 text-red-600" />
              <span>Void Citation: {voidingFine.ticket_number}</span>
            </h4>
            <p className="text-xs text-slate-600 mb-4">
              Are you sure you want to void this citation? This action will set
              the status to VOIDED and log an audit entry.
            </p>

            {actionError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            <form onSubmit={handleConfirmVoid} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Void Justification Notes{" "}
                  <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={voidNotes}
                  onChange={(e) => setVoidNotes(e.target.value)}
                  placeholder="e.g. Cancelled due to officer error / invalid meter location."
                  rows="3"
                  required
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setVoidingFine(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
                >
                  Confirm Void
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
