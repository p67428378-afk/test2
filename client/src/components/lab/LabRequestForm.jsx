import React, { useState } from "react";
import { FlaskConical, PlusCircle, AlertCircle } from "lucide-react";

export default function LabRequestForm({
  artifacts = [],
  onLabRequestCreated,
}) {
  const [formData, setFormData] = useState({
    artifact_id: "",
    test_type: "Radiocarbon C-14",
    lab_name: "",
    request_date: new Date().toISOString().split("T")[0],
    status: "Pending",
    result_summary: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const testTypes = [
    "Radiocarbon C-14",
    "XRF Spectrometry",
    "Petrographic Analysis",
    "Dendrochronology",
    "Thermoluminescence (TL)",
    "Metallurgic Analysis",
    "Residue Analysis",
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

    if (!formData.artifact_id) {
      setError("Please select an artifact for analysis.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        artifact_id: formData.artifact_id,
        test_type: formData.test_type,
        lab_name: formData.lab_name.trim(),
        request_date: formData.request_date,
        status: formData.status,
        result_summary: formData.result_summary.trim() || null,
      };

      await onLabRequestCreated(payload);
      setSuccess("Lab analysis request created successfully!");
      setFormData({
        artifact_id: formData.artifact_id,
        test_type: "Radiocarbon C-14",
        lab_name: "",
        request_date: new Date().toISOString().split("T")[0],
        status: "Pending",
        result_summary: "",
      });
    } catch (err) {
      console.error("Failed to submit lab request:", err);
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
        setError("Failed to create lab analysis request. Please check inputs.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm">
      <div className="flex items-center space-x-2 mb-4 border-b border-stone-100 pb-3">
        <FlaskConical className="w-5 h-5 text-amber-800" />
        <h3 className="text-lg font-bold text-stone-900">
          Request Laboratory Analysis
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
            Select Artifact *
          </label>
          <select
            name="artifact_id"
            required
            value={formData.artifact_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-800 bg-white"
          >
            <option value="">-- Select Cataloged Artifact --</option>
            {artifacts.map((art) => (
              <option key={art.id} value={art.id}>
                {art.artifact_code} - {art.material} ({art.context_layer})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Testing Type *
            </label>
            <select
              name="test_type"
              required
              value={formData.test_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-800 bg-white"
            >
              {testTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Laboratory Name *
            </label>
            <input
              type="text"
              name="lab_name"
              required
              value={formData.lab_name}
              onChange={handleChange}
              placeholder="e.g. Beta Analytic Lab, Oxford Radiocarbon"
              className="w-full px-3 py-2 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Request Date *
            </label>
            <input
              type="date"
              name="request_date"
              required
              value={formData.request_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Initial Workflow Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-800 bg-white"
            >
              <option value="Pending">Pending</option>
              <option value="In-Progress">In-Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
            Initial Findings / Result Summary
          </label>
          <textarea
            name="result_summary"
            rows="3"
            value={formData.result_summary}
            onChange={handleChange}
            placeholder="e.g. Radiocarbon C-14 estimated date 1200 BCE ± 30 years..."
            className="w-full px-3 py-2 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-amber-800 text-white rounded font-medium text-sm hover:bg-amber-900 transition flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{loading ? "Submitting..." : "Submit Lab Request"}</span>
        </button>
      </form>
    </div>
  );
}
