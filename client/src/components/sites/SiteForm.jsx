import React, { useState } from "react";
import { MapPin, PlusCircle, AlertCircle } from "lucide-react";

export default function SiteForm({ onSiteCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    site_code: "",
    region: "",
    historical_period: "",
    latitude: "",
    longitude: "",
    altitude_meters: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const validateGPS = (lat, lng) => {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    if (isNaN(latitude) || latitude < -90 || latitude > 90) {
      return "Latitude must be a valid number between -90 and 90.";
    }
    if (isNaN(longitude) || longitude < -180 || longitude > 180) {
      return "Longitude must be a valid number between -180 and 180.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const gpsError = validateGPS(formData.latitude, formData.longitude);
    if (gpsError) {
      setError(gpsError);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        site_code: formData.site_code.trim(),
        region: formData.region.trim(),
        historical_period: formData.historical_period.trim(),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        altitude_meters:
          formData.altitude_meters !== ""
            ? parseFloat(formData.altitude_meters)
            : null,
        description: formData.description.trim() || null,
      };

      await onSiteCreated(payload);
      setSuccess("Site registered successfully!");
      setFormData({
        name: "",
        site_code: "",
        region: "",
        historical_period: "",
        latitude: "",
        longitude: "",
        altitude_meters: "",
        description: "",
      });
    } catch (err) {
      console.error("Failed to register site:", err);
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(
          detail
            .map((d) => `${d.loc ? d.loc.join(".") + ": " : ""}${d.msg}`)
            .join(", "),
        );
      } else if (typeof detail === "string") {
        setError(detail);
      } else {
        setError("Failed to register site. Please check input values.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm">
      <div className="flex items-center space-x-2 mb-4 border-b border-stone-100 pb-3">
        <MapPin className="w-5 h-5 text-amber-800" />
        <h3 className="text-lg font-bold text-stone-900">
          Register New Excavation Site
        </h3>
      </div>

      {error && (
        <div
          className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded text-sm flex items-start space-x-2"
          role="alert"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Site Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Alpha Trench"
              className="w-full px-3 py-2 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Site Code *
            </label>
            <input
              type="text"
              name="site_code"
              required
              value={formData.site_code}
              onChange={handleChange}
              placeholder="e.g. SITE-ALPHA-01"
              className="w-full px-3 py-2 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Region *
            </label>
            <input
              type="text"
              name="region"
              required
              value={formData.region}
              onChange={handleChange}
              placeholder="e.g. Mediterranean, Near East"
              className="w-full px-3 py-2 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Historical Period *
            </label>
            <input
              type="text"
              name="historical_period"
              required
              value={formData.historical_period}
              onChange={handleChange}
              placeholder="e.g. Bronze Age, Hellenistic"
              className="w-full px-3 py-2 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
            />
          </div>
        </div>

        <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-100 space-y-3">
          <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
            GPS Coordinates (Required)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-stone-600 mb-1">
                Latitude [-90 to 90] *
              </label>
              <input
                type="number"
                step="any"
                name="latitude"
                required
                value={formData.latitude}
                onChange={handleChange}
                placeholder="34.0522"
                className="w-full px-3 py-1.5 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-600 mb-1">
                Longitude [-180 to 180] *
              </label>
              <input
                type="number"
                step="any"
                name="longitude"
                required
                value={formData.longitude}
                onChange={handleChange}
                placeholder="-118.2437"
                className="w-full px-3 py-1.5 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-600 mb-1">
                Altitude (m)
              </label>
              <input
                type="number"
                step="any"
                name="altitude_meters"
                value={formData.altitude_meters}
                onChange={handleChange}
                placeholder="120"
                className="w-full px-3 py-1.5 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
            Site Description
          </label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Landscape context, excavation notes, stratum layer info..."
            className="w-full px-3 py-2 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-amber-800 text-white rounded font-medium text-sm hover:bg-amber-900 transition flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{loading ? "Registering..." : "Register Site"}</span>
        </button>
      </form>
    </div>
  );
}
