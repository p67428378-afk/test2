import React, { useEffect, useState } from "react";
import { Shield, AlertCircle } from "lucide-react";
import { adminService } from "../services/api";
import ClaimsTable from "../components/admin/ClaimsTable.jsx";
import AuditLog from "../components/admin/AuditLog.jsx";

export default function AdminClaimsPage() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchClaims = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getAllClaims();
      setClaims(data.claims || []);
    } catch (err) {
      setError(
        "Failed to load claims. Please verify you are logged in as an Admin.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleAction = async (claimId, status) => {
    setActionLoading(true);
    setError(null);
    try {
      await adminService.updateClaimStatus(claimId, status);
      await fetchClaims();
    } catch (err) {
      setError("Failed to update claim status. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6366F1]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h2 className="text-3xl font-bold text-white flex items-center gap-2">
          <Shield className="text-[#6366F1] w-8 h-8" />
          Admin Claims Verification
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Review pending claims, verify ownership, and manage claim history.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Claims Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Pending & Recent Claims
            </h3>
            <ClaimsTable
              claims={claims}
              onAction={handleAction}
              loading={actionLoading}
            />
          </div>
        </div>

        {/* Audit Log */}
        <div className="lg:col-span-4">
          <div className="glass-card rounded-xl p-6">
            <AuditLog claims={claims} />
          </div>
        </div>
      </div>
    </div>
  );
}
