import React, { useState } from "react";
import { Shield, Save } from "lucide-react";

export default function EvidenceMetadataForm({
  onSubmit,
  initialData = {},
  isSubmitting,
}) {
  const [formData, setFormData] = useState({
    evidence_code:
      initialData.evidence_code ||
      `EVID-${Math.floor(1000 + Math.random() * 9000)}`,
    file_name: initialData.file_name || "dashcam_footage.mp4",
    file_type: initialData.file_type || "Video / MP4",
    file_size_bytes: initialData.file_size_bytes || 1288490188,
    collection_location:
      initialData.collection_location || "742 Evergreen Terrace, Springfield",
    source_device: initialData.source_device || "Axon Body 3 Dashcam #482-B",
    case_id: initialData.case_id || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-sm font-medium text-slate-300 mb-2">
        Evidence Metadata Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1">
            Evidence Code
          </label>
          <input
            type="text"
            name="evidence_code"
            value={formData.evidence_code}
            onChange={handleChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:border-blue-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">File Type</label>
          <select
            name="file_type"
            value={formData.file_type}
            onChange={handleChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
          >
            <option value="Video / MP4">Video / MP4</option>
            <option value="Audio / WAV">Audio / WAV</option>
            <option value="Document / PDF">Document / PDF</option>
            <option value="Image / PNG">Image / PNG</option>
            <option value="Forensic Disk Image / E01">
              Forensic Disk Image / E01
            </option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs text-slate-400 mb-1">File Name</label>
        <input
          type="text"
          name="file_name"
          value={formData.file_name}
          onChange={handleChange}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-xs text-slate-400 mb-1">
          Collection Location
        </label>
        <input
          type="text"
          name="collection_location"
          value={formData.collection_location}
          onChange={handleChange}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
          placeholder="e.g. 742 Evergreen Terrace, Courtroom 4B"
        />
      </div>

      <div>
        <label className="block text-xs text-slate-400 mb-1">
          Source Device
        </label>
        <input
          type="text"
          name="source_device"
          value={formData.source_device}
          onChange={handleChange}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
          placeholder="e.g. Axon Body 3 Dashcam #482-B"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
      >
        <Save className="w-4 h-4" />
        <span>
          {isSubmitting
            ? "Ingesting Evidence..."
            : "Confirm & Commit to Chain of Custody"}
        </span>
      </button>
    </form>
  );
}
