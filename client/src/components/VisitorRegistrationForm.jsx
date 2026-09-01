import React, { useState } from "react";
import { registerVisitor, screenVisitorWatchlist } from "../services/api";
import {
  UserCheck,
  Upload,
  AlertCircle,
  CheckCircle,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

const VisitorRegistrationForm = ({ onVisitorRegistered }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    national_id: "",
    email: "",
    phone: "",
    address: "",
    photo_id_url: "",
    visitor_type: "STANDARD",
  });

  const [loading, setLoading] = useState(false);
  const [screeningStatus, setScreeningStatus] = useState(null);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [registeredVisitor, setRegisteredVisitor] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleScreeningCheck = async () => {
    if (!formData.national_id) return;
    try {
      const res = await screenVisitorWatchlist({
        national_id: formData.national_id,
        full_name: formData.full_name,
      });
      setScreeningStatus(res);
    } catch (err) {
      console.error("Watchlist check warning:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const payload = {
        ...formData,
        photo_id_url:
          formData.photo_id_url ||
          "https://example.com/uploads/photo_id_default.png",
      };
      const result = await registerVisitor(payload);
      setSuccessMsg(`Registration successful! Visitor ID: ${result.id}`);
      setRegisteredVisitor(result);
      if (onVisitorRegistered) {
        onVisitorRegistered(result);
      }
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.message ||
        "Registration failed. Please check inputs.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 max-w-2xl mx-auto">
      <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 pb-4">
        <div className="p-3 bg-blue-50 text-blue-800 rounded-lg">
          <UserCheck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Online Visitor Registration & Watchlist Screening
          </h2>
          <p className="text-sm text-slate-500">
            Register visitor details for automated facility security clearance
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 rounded flex items-start space-x-2">
          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">{successMsg}</p>
            {registeredVisitor && (
              <div className="text-xs mt-1 text-emerald-800 flex items-center space-x-2">
                <span>
                  Status:{" "}
                  <strong className="font-semibold">
                    {registeredVisitor.verification_status}
                  </strong>
                </span>
                {registeredVisitor.is_watchlist_flagged ? (
                  <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold flex items-center space-x-1">
                    <ShieldAlert className="w-3 h-3" />
                    <span>WATCHLIST FLAG DETECTED</span>
                  </span>
                ) : (
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>WATCHLIST CLEARED</span>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              className="block text-xs font-semibold text-slate-700 uppercase mb-1"
              htmlFor="full_name"
            >
              Full Legal Name *
            </label>
            <input
              id="full_name"
              type="text"
              name="full_name"
              required
              value={formData.full_name}
              onChange={handleChange}
              placeholder="e.g. Jane Doe"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label
              className="block text-xs font-semibold text-slate-700 uppercase mb-1"
              htmlFor="national_id"
            >
              National ID / Passport No. *
            </label>
            <input
              id="national_id"
              type="text"
              name="national_id"
              required
              value={formData.national_id}
              onChange={handleChange}
              onBlur={handleScreeningCheck}
              placeholder="e.g. ID-98765432"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        {screeningStatus && (
          <div
            className={`p-2.5 rounded-lg text-xs font-medium flex items-center space-x-2 ${
              screeningStatus.is_flagged
                ? "bg-red-100 text-red-800 border border-red-300"
                : "bg-emerald-50 text-emerald-800 border border-emerald-200"
            }`}
          >
            {screeningStatus.is_flagged ? (
              <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            )}
            <span>
              Automated Watchlist Check:{" "}
              <strong>{screeningStatus.message}</strong>
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              className="block text-xs font-semibold text-slate-700 uppercase mb-1"
              htmlFor="visitor_type"
            >
              Visitor Category *
            </label>
            <select
              id="visitor_type"
              name="visitor_type"
              value={formData.visitor_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm font-medium"
            >
              <option value="STANDARD">
                Standard Visitor (2 Visits/Wk Quota)
              </option>
              <option value="LEGAL">
                Legal Counsel / Attorney (5 Visits/Wk Quota)
              </option>
            </select>
          </div>

          <div>
            <label
              className="block text-xs font-semibold text-slate-700 uppercase mb-1"
              htmlFor="email"
            >
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. jane.doe@example.com"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              className="block text-xs font-semibold text-slate-700 uppercase mb-1"
              htmlFor="phone"
            >
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +1 555-0199"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label
              className="block text-xs font-semibold text-slate-700 uppercase mb-1"
              htmlFor="address"
            >
              Residential Address
            </label>
            <input
              id="address"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. 123 Main St, Springfield"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        <div>
          <label
            className="block text-xs font-semibold text-slate-700 uppercase mb-1"
            htmlFor="photo_id_url"
          >
            Government-Issued Photo ID Document URL
          </label>
          <div className="flex items-center space-x-2">
            <input
              id="photo_id_url"
              type="text"
              name="photo_id_url"
              value={formData.photo_id_url}
              onChange={handleChange}
              placeholder="https://example.com/id_card.png"
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <div className="p-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-500">
              <Upload className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="pt-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-blue-900 hover:bg-blue-800 text-white font-medium rounded-lg shadow transition disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>Submitting Profile & Running Watchlist Check...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Submit Profile & Execute Security Screening</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VisitorRegistrationForm;
