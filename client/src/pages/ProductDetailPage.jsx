import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Shield,
  Calendar,
  Tag,
  Building,
  FileText,
  Wrench,
  Clock,
  Loader2,
  AlertCircle,
  Plus,
} from "lucide-react";
import Badge from "../components/common/Badge";
import ServiceClaimTable from "../components/claims/ServiceClaimTable";
import ServiceClaimModal from "../components/claims/ServiceClaimModal";
import AuditLogTimeline from "../components/claims/AuditLogTimeline";
import {
  getProductDetails,
  getClaims,
  updateClaimStatus,
  getClaimAuditLogs,
} from "../services/api";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [claims, setClaims] = useState([]);
  const [selectedClaimLogs, setSelectedClaimLogs] = useState([]);
  const [selectedClaimId, setSelectedClaimId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const productData = await getProductDetails(id);
      setProduct(productData);

      const claimsData = await getClaims({ product_id: id });
      setClaims(claimsData);
    } catch (err) {
      setError("Failed to fetch product details.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-500 flex flex-col items-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
        <p className="font-semibold text-sm">
          Loading Product Warranty Details...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-semibold text-primary hover:underline mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl flex items-center text-red-700 text-sm">
          <AlertCircle className="h-5 w-5 mr-3 text-red-500" />
          <span>{error || "Product not found."}</span>
        </div>
      </div>
    );
  }

  const warranty = product.warranty;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back & Breadcrumb */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
      </div>

      {/* Header Info */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {product.product_name}
            </h1>
            {warranty && <Badge status={warranty.status} />}
          </div>
          <p className="text-sm font-mono text-gray-500">
            Serial Number:{" "}
            <span className="font-bold text-gray-700">
              {product.serial_number}
            </span>
          </p>
        </div>

        <button
          onClick={() => setIsClaimModalOpen(true)}
          className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-sm transition-colors whitespace-nowrap"
        >
          <Wrench className="h-4 w-4 mr-2" />
          File Service Claim
        </button>
      </div>

      {/* Grid: Product Details & Warranty Spec Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Specs */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center">
            <Tag className="h-4 w-4 mr-2 text-primary" />
            Product Specifications
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">
                Brand / Manufacturer:
              </span>
              <span className="font-semibold text-gray-900">
                {product.brand || "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Category:</span>
              <span className="font-semibold text-gray-900">
                {product.category || "General"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Purchase Date:</span>
              <span className="font-semibold text-gray-900 flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1 text-gray-400" />
                {product.purchase_date}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Vendor / Store:</span>
              <span className="font-semibold text-gray-900">
                {warranty?.vendor_name || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Warranty Status & Expiry Countdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center">
            <Shield className="h-4 w-4 mr-2 text-green-600" />
            Warranty Coverage Terms
          </h3>

          {warranty ? (
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Status:</span>
                <Badge status={warranty.status} />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Start Date:</span>
                <span className="font-semibold text-gray-900">
                  {warranty.start_date}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">
                  Expiration Date:
                </span>
                <span className="font-bold text-red-600">
                  {warranty.end_date}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Duration:</span>
                <span className="font-semibold text-gray-900">
                  {warranty.duration_months} Months
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-500 italic">
              No warranty terms registered for this product.
            </p>
          )}
        </div>

        {/* Uploaded Receipt Document */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center">
            <FileText className="h-4 w-4 mr-2 text-amber-600" />
            Proof of Purchase / Receipt
          </h3>

          {product.receipts && product.receipts.length > 0 ? (
            <div className="space-y-3">
              {product.receipts.map((rcpt) => (
                <div
                  key={rcpt.id}
                  className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between"
                >
                  <div className="truncate">
                    <p className="text-xs font-semibold text-gray-900 truncate">
                      {rcpt.file_name}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {(rcpt.file_size_bytes / 1024).toFixed(1)} KB •{" "}
                      {rcpt.mime_type}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded">
                    Verified
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">
              No proof of purchase document attached.
            </p>
          )}
        </div>
      </div>

      {/* Claims for this product */}
      <ServiceClaimTable
        claims={claims}
        onUpdateStatus={handleUpdateClaimStatus}
        onSelectClaimForAudit={handleSelectClaimForAudit}
      />

      {/* Selected Claim Audit Trail */}
      {selectedClaimId && (
        <AuditLogTimeline
          auditLogs={selectedClaimLogs}
          claimId={selectedClaimId}
        />
      )}

      {/* Modal */}
      <ServiceClaimModal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        product={product}
        onSuccess={fetchData}
      />
    </div>
  );
}
