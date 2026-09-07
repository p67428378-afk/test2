import React, { useState } from "react";
import { UserPlus, Calendar, Clock, Car, Phone, Building } from "lucide-react";
import { createVisitorPreApproval } from "../services/api";

export default function ResidentVisitorForm({ onVisitorCreated }) {
  const [formData, setFormData] = useState({
    unit_number: "Unit 4B",
    visitor_name: "Bob Smith",
    contact_phone: "+15550192834",
    vehicle_number: "XYZ-9876",
    valid_from: "2026-06-01T14:00",
    valid_until: "2026-06-01T18:00",
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
      // Format datetime strings to ISO UTC
      const payload = {
        unit_number: formData.unit_number,
        visitor_name: formData.visitor_name,
        contact_phone: formData.contact_phone,
        vehicle_number: formData.vehicle_number || null,
        valid_from: new Date(formData.valid_from).toISOString(),
        valid_until: new Date(formData.valid_until).toISOString(),
      };

      const result = await createVisitorPreApproval(payload);
      setSuccessMsg(
        "Visitor pre-approved successfully! Time-bound QR token generated.",
      );
      if (onVisitorCreated) {
        onVisitorCreated(result);
      }
    } catch (err) {
      console.error("Failed to create visitor pre-approval:", err);
      const detail =
        err.response?.data?.detail ||
        err.message ||
        "Failed to create pre-approval";
      setError(typeof detail === "string" ? detail : JSON.stringify(detail));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
        <UserPlus className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-bold text-slate-900">
          Pre-Approve New Visitor
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
              Unit / Apartment #
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                name="unit_number"
                value={formData.unit_number}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g. Unit 4B"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Visitor Full Name
            </label>
            <div className="relative">
              <UserPlus className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                name="visitor_name"
                value={formData.visitor_name}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g. Bob Smith"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Contact Phone
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g. +15550192834"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Vehicle Plate Number (Optional)
            </label>
            <div className="relative">
              <Car className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                name="vehicle_number"
                value={formData.vehicle_number}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g. XYZ-9876"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Valid From (UTC)
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="datetime-local"
                name="valid_from"
                value={formData.valid_from}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Valid Until (UTC)
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="datetime-local"
                name="valid_until"
                value={formData.valid_until}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg shadow transition duration-150 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Generating QR Code..." : "Generate Time-Bound QR Token"}
          </button>
        </div>
      </form>
    </div>
  );
}
