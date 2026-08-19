import React, { useState, useEffect } from "react";
import { X, Wrench, AlertCircle, Loader2 } from "lucide-react";
import { submitClaim } from "../../services/api";

export default function ServiceClaimModal({
  isOpen,
  onClose,
  product,
  products = [],
  onSuccess,
}) {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [claimDate, setClaimDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [issueDescription, setIssueDescription] = useState("");
  const [serviceProvider, setServiceProvider] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (product && product.id) {
      setSelectedProductId(product.id);
    } else if (products.length > 0) {
      setSelectedProductId(products[0].id);
    }
  }, [product, products]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!selectedProductId) {
      setError("Please select a product.");
      return;
    }
    if (!issueDescription.trim()) {
      setError("Issue Description is required.");
      return;
    }

    try {
      setLoading(true);
      const claim = await submitClaim({
        product_id: selectedProductId,
        claim_date: claimDate,
        issue_description: issueDescription,
        service_provider: serviceProvider || null,
      });

      setLoading(false);
      onSuccess(claim);
      onClose();
    } catch (err) {
      setLoading(false);
      const msg =
        err.response?.data?.detail ||
        err.message ||
        "Failed to submit service claim.";
      setError(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative animate-in fade-in zoom-in duration-150">
        <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Wrench className="h-5 w-5 mr-2 text-purple-600" />
            File Warranty & Service Claim
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-xs text-red-700">
            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Select Product <span className="text-red-500">*</span>
            </label>
            {product ? (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm font-semibold text-gray-900">
                  {product.product_name}
                </p>
                <p className="text-xs text-gray-500">
                  S/N: {product.serial_number}
                </p>
              </div>
            ) : (
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.product_name} ({p.serial_number})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Claim Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={claimDate}
              onChange={(e) => setClaimDate(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Service Provider / Repair Center
            </label>
            <input
              type="text"
              value={serviceProvider}
              onChange={(e) => setServiceProvider(e.target.value)}
              placeholder="e.g. Authorized Service Center / AppleCare"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Issue Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows="4"
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              placeholder="Describe the hardware fault or service issue in detail..."
              required
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-5 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {loading ? "Submitting..." : "Submit Claim"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
