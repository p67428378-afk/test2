import React, { useState } from "react";
import { Siren, AlertOctagon, MapPin, Radio, ShieldAlert } from "lucide-react";
import { createSecurityAlert } from "../services/api";

export default function SecurityAlertTrigger({ onAlertCreated }) {
  const [formData, setFormData] = useState({
    alert_type: "UNAUTHORIZED_ENTRY",
    severity: "HIGH",
    location: "North Gate Barrier",
    description: "Vehicle bypassed barrier without valid QR code token.",
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
      const result = await createSecurityAlert(formData);
      setSuccessMsg(
        `EMERGENCY BROADCAST SENT! Location: ${result.location} (${result.severity})`,
      );
      if (onAlertCreated) {
        onAlertCreated(result);
      }
    } catch (err) {
      console.error("Failed to trigger security alert:", err);
      const detail =
        err.response?.data?.detail || err.message || "Failed to trigger alert";
      setError(typeof detail === "string" ? detail : JSON.stringify(detail));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
        <Siren className="w-5 h-5 text-red-600 animate-bounce" />
        <h2 className="text-lg font-bold text-slate-900">
          Emergency Broadcast & Security Alert Control
        </h2>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2"
        >
          <ShieldAlert className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 bg-red-900 text-white font-semibold border border-red-700 text-sm rounded-lg flex items-center gap-2">
          <Radio className="w-5 h-5 text-red-300 animate-ping" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Alert Incident Type
            </label>
            <select
              name="alert_type"
              value={formData.alert_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
            >
              <option value="UNAUTHORIZED_ENTRY">
                Gate Unauthorized Entry
              </option>
              <option value="EMERGENCY_PANIC">
                Resident Emergency Panic Button
              </option>
              <option value="SUSPICIOUS_ACTIVITY">
                Suspicious Intruder Activity
              </option>
              <option value="FIRE_ALARM">Community Fire Alarm Trigger</option>
              <option value="MEDICAL_EMERGENCY">
                Medical Emergency Priority
              </option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Severity Level
            </label>
            <select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:outline-none font-bold"
            >
              <option value="INFO" className="text-blue-600">
                INFO - Informational
              </option>
              <option value="MEDIUM" className="text-amber-600">
                MEDIUM - Moderate Alert
              </option>
              <option value="HIGH" className="text-red-600">
                HIGH - Urgent Incident
              </option>
              <option value="CRITICAL" className="text-red-800">
                CRITICAL - Severe Emergency
              </option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Location Tag
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                placeholder="e.g. North Gate, Building B Lobby"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Incident Details
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              placeholder="Provide context for dispatch..."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-3 px-4 rounded-lg shadow-lg transition duration-150 flex items-center justify-center gap-2 disabled:opacity-50 text-sm tracking-wide"
        >
          <AlertOctagon className="w-5 h-5" />
          {loading
            ? "Broadcasting Alert..."
            : "TRIGGER REAL-TIME EMERGENCY BROADCAST"}
        </button>
      </form>
    </div>
  );
}
