import React, { useState } from "react";
import { Package, PlusCircle, AlertCircle } from "lucide-react";

export default function ArtifactForm({
  sites = [],
  members = [],
  onArtifactCreated,
}) {
  const [formData, setFormData] = useState({
    site_id: "",
    artifact_code: "",
    material: "Ceramic",
    context_layer: "",
    depth_meters: "",
    excavation_date: new Date().toISOString().split("T")[0],
    finder_member_id: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const materials = [
    "Ceramic",
    "Bronze",
    "Lithic",
    "Bone",
    "Organic",
    "Glass",
    "Gold",
    "Iron",
    "Stone",
    "Textile",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.site_id) {
      setError("Please select an excavation site.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        site_id: formData.site_id,
        artifact_code: formData.artifact_code.trim(),
        material: formData.material,
        context_layer: formData.context_layer.trim(),
        depth_meters: parseFloat(formData.depth_meters),
        excavation_date: formData.excavation_date,
        finder_member_id: formData.finder_member_id || null,
        description: formData.description.trim() || null,
      };

      await onArtifactCreated(payload);
      setSuccess("Artifact cataloged successfully!");
      setFormData({
        site_id: formData.site_id, // keep selected site
        artifact_code: "",
        material: "Ceramic",
        context_layer: "",
        depth_meters: "",
        excavation_date: new Date().toISOString().split("T")[0],
        finder_member_id: "",
        description: "",
      });
    } catch (err) {
      console.error("Failed to catalog artifact:", err);
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
        setError("Failed to log artifact. Please check input values.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm">
      <div className="flex items-center space-x-2 mb-4 border-b border-stone-100 pb-3">
        <Package className="w-5 h-5 text-amber-800" />
        <h3 className="text-lg font-bold text-stone-900">
          Log Discovered Artifact
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
        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
            Excavation Site *
          </label>
          <select
            name="site_id"
            required
            value={formData.site_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-800 bg-white"
          >
            <option value="">-- Select Excavation Site --</option>
            {sites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name} ({site.site_code})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Artifact Code / ID *
            </label>
            <input
              type="text"
              name="artifact_code"
              required
              value={formData.artifact_code}
              onChange={handleChange}
              placeholder="e.g. ART-2026-001"
              className="w-full px-3 py-2 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Material *
            </label>
            <select
              name="material"
              required
              value={formData.material}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-800 bg-white"
            >
              {materials.map((mat) => (
                <option key={mat} value={mat}>
                  {mat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Context Stratum Layer *
            </label>
            <input
              type="text"
              name="context_layer"
              required
              value={formData.context_layer}
              onChange={handleChange}
              placeholder="e.g. Stratum Layer 3"
              className="w-full px-3 py-2 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Depth (Meters) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="depth_meters"
              required
              value={formData.depth_meters}
              onChange={handleChange}
              placeholder="2.5"
              className="w-full px-3 py-2 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Excavation Date *
            </label>
            <input
              type="date"
              name="excavation_date"
              required
              value={formData.excavation_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
            Discoverer / Excavator
          </label>
          <select
            name="finder_member_id"
            value={formData.finder_member_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-800 bg-white"
          >
            <option value="">-- Optional: Select Excavator Member --</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.full_name} ({member.role})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
            Artifact Description
          </label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Surface condition, dimensions, decorations, inscription..."
            className="w-full px-3 py-2 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-amber-800 text-white rounded font-medium text-sm hover:bg-amber-900 transition flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{loading ? "Cataloging..." : "Log Artifact"}</span>
        </button>
      </form>
    </div>
  );
}
