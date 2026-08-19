import React, { useState } from "react";
import {
  ClipboardList,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Edit3,
  ShieldAlert,
} from "lucide-react";
import Badge from "../common/Badge";

export default function ServiceClaimTable({
  claims = [],
  onUpdateStatus,
  onSelectClaimForAudit,
}) {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("ALL");

  // Status update modal state
  const [editingClaim, setEditingClaim] = useState(null);
  const [newStatus, setNewStatus] = useState("APPROVED");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [repairCost, setRepairCost] = useState(0);

  const filteredClaims = claims.filter((claim) => {
    return (
      selectedStatusFilter === "ALL" || claim.status === selectedStatusFilter
    );
  });

  const handleOpenEdit = (claim) => {
    setEditingClaim(claim);
    setNewStatus(claim.status === "PENDING" ? "APPROVED" : claim.status);
    setResolutionNotes(claim.resolution_notes || "");
    setRepairCost(claim.repair_cost || 0);
  };

  const handleSaveStatus = async (e) => {
    e.preventDefault();
    if (!editingClaim) return;

    await onUpdateStatus(editingClaim.id, {
      status: newStatus,
      resolution_notes: resolutionNotes,
      repair_cost: parseFloat(repairCost) || 0,
    });

    setEditingClaim(null);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Controls */}
      <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <ClipboardList className="h-5 w-5 mr-2 text-primary" />
          Service & Warranty Claims
        </h3>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-gray-500 uppercase">
            Filter Status:
          </span>
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-primary focus:border-primary outline-none"
          >
            <option value="ALL">All Claims</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-xs text-gray-500 font-semibold uppercase tracking-wider border-b border-gray-200">
            <tr>
              <th className="px-6 py-3.5">Claim ID & Date</th>
              <th className="px-6 py-3.5">Issue Description</th>
              <th className="px-6 py-3.5">Service Provider</th>
              <th className="px-6 py-3.5">Repair Cost</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredClaims.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-12 text-center text-gray-400"
                >
                  <ClipboardList className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                  <p className="font-semibold text-gray-600">No claims found</p>
                  <p className="text-xs text-gray-400 mt-1">
                    No warranty service claims match the current filter.
                  </p>
                </td>
              </tr>
            ) : (
              filteredClaims.map((claim) => (
                <tr
                  key={claim.id}
                  className="hover:bg-gray-50/80 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-mono text-xs font-semibold text-gray-900 truncate max-w-[120px]">
                      {claim.id.split("-")[0]}...
                    </div>
                    <div className="text-xs text-gray-500 flex items-center mt-0.5">
                      <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                      {claim.claim_date}
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <p className="font-medium text-gray-900 line-clamp-2">
                      {claim.issue_description}
                    </p>
                    {claim.resolution_notes && (
                      <p className="text-xs text-gray-500 mt-1 italic line-clamp-1">
                        Note: {claim.resolution_notes}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-700">
                    {claim.service_provider || "Not specified"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-gray-900">
                    ${(claim.repair_cost || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge status={claim.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(claim)}
                      className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Update Claim Status"
                    >
                      <Edit3 className="h-3.5 w-3.5 mr-1" />
                      Update Status
                    </button>

                    <button
                      onClick={() =>
                        onSelectClaimForAudit && onSelectClaimForAudit(claim)
                      }
                      className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      title="View Audit Trail"
                    >
                      Audit Trail
                      <ChevronRight className="h-3.5 w-3.5 ml-1" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Status Modal */}
      {editingClaim && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Edit3 className="h-5 w-5 mr-2 text-primary" />
              Update Service Claim Status
            </h3>

            <form onSubmit={handleSaveStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  New Claim Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-primary focus:border-primary outline-none"
                >
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Repair Cost ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={repairCost}
                  onChange={(e) => setRepairCost(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-primary focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Resolution / Service Notes
                </label>
                <textarea
                  rows="3"
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Enter service notes, approval details, or rejection reasons..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-primary focus:border-primary outline-none text-sm"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingClaim(null)}
                  className="px-4 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-primary hover:bg-primary-hover rounded-lg shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
