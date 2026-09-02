import React, { useState } from "react";
import { BookOpen, PlusCircle, AlertCircle } from "lucide-react";

export default function PublicationForm({
  artifacts = [],
  onPublicationCreated,
}) {
  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    journal_publisher: "",
    publication_date: new Date().toISOString().split("T")[0],
    doi: "",
    selected_artifact_ids: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleArtifactToggle = (artifactId) => {
    setFormData((prev) => {
      const exists = prev.selected_artifact_ids.includes(artifactId);
      return {
        ...prev,
        selected_artifact_ids: exists
          ? prev.selected_artifact_ids.filter((id) => id !== artifactId)
          : [...prev.selected_artifact_ids, artifactId],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    setLoading(true);
    try {
      const payload = {
        title: formData.title.trim(),
        authors: formData.authors.trim(),
        journal_publisher: formData.journal_publisher.trim(),
        publication_date: formData.publication_date,
        doi: formData.doi.trim() || null,
        artifact_ids: formData.selected_artifact_ids,
      };

      await onPublicationCreated(payload);
      setSuccess("Publication record added successfully!");
      setFormData({
        title: "",
        authors: "",
        journal_publisher: "",
        publication_date: new Date().toISOString().split("T")[0],
        doi: "",
        selected_artifact_ids: [],
      });
    } catch (err) {
      console.error("Failed to add publication record:", err);
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
        setError(
          "Failed to add publication record. Please check input values.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm">
      <div className="flex items-center space-x-2 mb-4 border-b border-stone-100 pb-3">
        <BookOpen className="w-5 h-5 text-amber-800" />
        <h3 className="text-lg font-bold text-stone-900">
          Add Academic Publication Record
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
            Article / Monograph Title *
          </label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Bronze Age Pottery of Alpha Trench"
            className="w-full px-3 py-2 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Authors *
            </label>
            <input
              type="text"
              name="authors"
              required
              value={formData.authors}
              onChange={handleChange}
              placeholder="e.g. Dr. Jane Doe, Dr. John Smith"
              className="w-full px-3 py-2 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Journal / Publisher *
            </label>
            <input
              type="text"
              name="journal_publisher"
              required
              value={formData.journal_publisher}
              onChange={handleChange}
              placeholder="e.g. Journal of Archaeological Science"
              className="w-full px-3 py-2 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Publication Date *
            </label>
            <input
              type="date"
              name="publication_date"
              required
              value={formData.publication_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              DOI (Digital Object Identifier)
            </label>
            <input
              type="text"
              name="doi"
              value={formData.doi}
              onChange={handleChange}
              placeholder="e.g. 10.1016/j.jas.2026.1001"
              className="w-full px-3 py-2 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
            />
          </div>
        </div>

        {artifacts.length > 0 && (
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Link Cataloged Artifacts
            </label>
            <div className="max-h-36 overflow-y-auto border border-stone-200 rounded p-2 bg-stone-50 space-y-1.5">
              {artifacts.map((art) => (
                <label
                  key={art.id}
                  className="flex items-center space-x-2 text-xs text-stone-800 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.selected_artifact_ids.includes(art.id)}
                    onChange={() => handleArtifactToggle(art.id)}
                    className="rounded text-amber-800 focus:ring-amber-800"
                  />
                  <span>
                    <strong className="font-mono">{art.artifact_code}</strong> -{" "}
                    {art.material} ({art.context_layer})
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-amber-800 text-white rounded font-medium text-sm hover:bg-amber-900 transition flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{loading ? "Saving..." : "Add Publication Record"}</span>
        </button>
      </form>
    </div>
  );
}
