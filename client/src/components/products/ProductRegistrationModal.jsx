import React, { useState } from "react";
import { X, Plus, AlertCircle, Loader2 } from "lucide-react";
import ReceiptUploadZone from "./ReceiptUploadZone";
import { registerProduct, uploadDocument } from "../../services/api";

export default function ProductRegistrationModal({
  isOpen,
  onClose,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    product_name: "",
    serial_number: "",
    purchase_date: new Date().toISOString().split("T")[0],
    duration_months: 12,
    brand: "",
    category: "",
    vendor_name: "",
  });

  const [receiptFile, setReceiptFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "duration_months" ? parseInt(value, 10) || 1 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.product_name.trim()) {
      setError("Product Name is required.");
      return;
    }
    if (!formData.serial_number.trim()) {
      setError("Serial Number is required.");
      return;
    }
    if (!formData.purchase_date) {
      setError("Purchase Date is required.");
      return;
    }
    if (formData.duration_months < 1) {
      setError("Warranty duration must be at least 1 month.");
      return;
    }

    try {
      setLoading(true);
      const product = await registerProduct(formData);

      if (receiptFile && product.id) {
        try {
          await uploadDocument(product.id, receiptFile);
        } catch (uploadErr) {
          console.warn(
            "Product registered but receipt upload failed:",
            uploadErr,
          );
        }
      }

      setLoading(false);
      onSuccess(product);
      onClose();
    } catch (err) {
      setLoading(false);
      const msg =
        err.response?.data?.detail ||
        err.message ||
        "Failed to register product.";
      setError(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl relative animate-in fade-in zoom-in duration-150">
        <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Plus className="h-5 w-5 mr-2 text-primary" />
            Register New Product & Warranty
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                placeholder="e.g. Dell XPS 15 Laptop"
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Serial Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="serial_number"
                value={formData.serial_number}
                onChange={handleChange}
                placeholder="e.g. SN-987654321"
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Purchase Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="purchase_date"
                value={formData.purchase_date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Warranty Duration (Months){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="duration_months"
                value={formData.duration_months}
                onChange={handleChange}
                min="1"
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Brand / Manufacturer
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. Dell"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Electronics"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Vendor / Store Name
            </label>
            <input
              type="text"
              name="vendor_name"
              value={formData.vendor_name}
              onChange={handleChange}
              placeholder="e.g. Best Buy / Dell Official"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>

          <ReceiptUploadZone
            selectedFile={receiptFile}
            onFileSelect={(file) => setReceiptFile(file)}
            onClearFile={() => setReceiptFile(null)}
          />

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
              className="inline-flex items-center px-5 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-lg shadow-sm transition-colors disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {loading ? "Registering..." : "Register Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
