import React, { useState } from "react";
import { PackagePlus, Building, Truck, Hash, FileText } from "lucide-react";
import { logDelivery } from "../services/api";

export default function PackageLogForm({ onDeliveryLogged }) {
  const [formData, setFormData] = useState({
    unit_number: "Unit 4B",
    courier_name: "FedEx",
    tracking_number: "FX-99201123",
    package_description: "Small box",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const result = await logDelivery(formData);
      setSuccessMsg(
        `Package logged for ${result.unit_number}! Notification dispatched to resident.`,
      );
      if (onDeliveryLogged) {
        onDeliveryLogged(result);
      }
    } catch (err) {
      console.error("Failed to log delivery package:", err);
      const detail =
        err.response?.data?.detail || err.message || "Failed to log package";
      setError(typeof detail === "string" ? detail : JSON.stringify(detail));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
        <PackagePlus className="w-5 h-5 text-amber-600" />
        <h2 className="text-lg font-bold text-slate-900">
          Log Incoming Courier Package
        </h2>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg"
        >
          {error}
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Resident Unit #
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                name="unit_number"
                value={formData.unit_number}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="e.g. Unit 4B"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Courier / Carrier Name
            </label>
            <div className="relative">
              <Truck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                name="courier_name"
                value={formData.courier_name}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="e.g. FedEx, UPS, DHL, Amazon"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Tracking Number
            </label>
            <div className="relative">
              <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                name="tracking_number"
                value={formData.tracking_number}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="e.g. FX-99201123"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Package Description
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                name="package_description"
                value={formData.package_description}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="e.g. Small box, Envelope, Fragile parcel"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2.5 px-4 rounded-lg shadow transition duration-150 flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
        >
          {loading
            ? "Logging Package..."
            : "Log Package & Dispatch Resident Alert"}
        </button>
      </form>
    </div>
  );
}
