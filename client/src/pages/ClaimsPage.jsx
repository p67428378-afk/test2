import React, { useState, useEffect } from "react";
import { ClipboardList, PlusCircle, AlertCircle, Loader2 } from "lucide-react";
import ServiceClaimTable from "../components/claims/ServiceClaimTable";
import ServiceClaimModal from "../components/claims/ServiceClaimModal";
import AuditLogTimeline from "../components/claims/AuditLogTimeline";
import {
  getClaims,
  getProducts,
  updateClaimStatus,
  getClaimAuditLogs,
} from "../services/api";

export default function ClaimsPage() {
  const [claims, setClaims] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedClaimLogs, setSelectedClaimLogs] = useState([]);
  const [selectedClaimId, setSelectedClaimId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [claimsData, productsData] = await Promise.all([
        getClaims({ limit: 100 }),
        getProducts({ limit: 100 }),
      ]);
      setClaims(claimsData);
      setProducts(productsData);
    } catch (err) {
      setError("Failed to load service claims history.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateClaimStatus = async (claimId, statusData) => {
    try {
      await updateClaimStatus(claimId, statusData);
      fetchData();
    } catch (err) {
      alert(
        "Failed to update claim status: " +
          (err.response?.data?.detail || err.message),
      );
    }
  };

  const handleSelectClaimForAudit = async (claim) => {
    setSelectedClaimId(claim.id);
    try {
      const logs = await getClaimAuditLogs(claim.id);
      setSelectedClaimLogs(logs);
    } catch (err) {
      console.error("Failed to load audit logs:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/60 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Service & Warranty Claims Center
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Submit repair claims, track approval workflows, log repair costs,
            and inspect complete audit history.
          </p>
        </div>

        <button
          onClick={() => setIsClaimModalOpen(true)}
          className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm transition-colors"
        >
          <PlusCircle className="h-4 w-4 mr-1.5" />
          File New Claim
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center text-sm text-red-700">
          <AlertCircle className="h-5 w-5 mr-3 text-red-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Claims Table */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500 flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
          <p className="font-semibold text-sm">Loading Claims History...</p>
        </div>
      ) : (
        <ServiceClaimTable
          claims={claims}
          onUpdateStatus={handleUpdateClaimStatus}
          onSelectClaimForAudit={handleSelectClaimForAudit}
        />
      )}

      {/* Selected Claim Audit Trail */}
      {selectedClaimId && (
        <AuditLogTimeline
          auditLogs={selectedClaimLogs}
          claimId={selectedClaimId}
        />
      )}

      {/* Submit Claim Modal */}
      <ServiceClaimModal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        products={products}
        onSuccess={fetchData}
      />
    </div>
  );
}
