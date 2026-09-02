import React, { useState } from "react";
import {
  UploadCloud,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { uploadMediaRecord } from "../../services/api";

export default function PhotoUploader({
  siteId = null,
  artifactId = null,
  labAnalysisId = null,
  onMediaUploaded,
}) {
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [cameraMetadata, setCameraMetadata] = useState("");
  const [mediaType, setMediaType] = useState("image/jpeg");
  const [fileSizeBytes, setFileSizeBytes] = useState(1024000);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFileSimulate = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setMediaType(file.type || "image/jpeg");
      setFileSizeBytes(file.size);
      // Create object URL for preview / link
      const previewUrl = URL.createObjectURL(file);
      setFileUrl(previewUrl);
      setCameraMetadata(
        JSON.stringify({
          filename: file.name,
          lastModified: new Date(file.lastModified).toISOString(),
          type: file.type,
        }),
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!fileName.trim()) {
      setError("Please select or specify a photograph / media file name.");
      return;
    }

    if (!fileUrl.trim()) {
      setError("File URL is required.");
      return;
    }

    setLoading(true);
    try {
      let parsedCameraMetadata = null;
      if (cameraMetadata.trim()) {
        try {
          parsedCameraMetadata = JSON.parse(cameraMetadata);
        } catch {
          parsedCameraMetadata = { raw: cameraMetadata };
        }
      }

      const payload = {
        site_id: siteId || null,
        artifact_id: artifactId || null,
        lab_analysis_id: labAnalysisId || null,
        file_name: fileName.trim(),
        file_url: fileUrl.trim(),
        media_type: mediaType || "image/jpeg",
        file_size_bytes: parseInt(fileSizeBytes, 10) || 1024000,
        caption: caption.trim() || null,
        camera_metadata: parsedCameraMetadata,
      };

      const result = await uploadMediaRecord(payload);
      setSuccess("Photograph uploaded and linked successfully!");
      if (onMediaUploaded) onMediaUploaded(result);

      // Reset
      setFileName("");
      setFileUrl("");
      setCaption("");
      setCameraMetadata("");
    } catch (err) {
      console.error("Failed to upload photograph record:", err);
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
        setError("Failed to upload photo record. Please check inputs.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-sm">
      <div className="flex items-center space-x-2 mb-3 border-b border-stone-100 pb-2">
        <ImageIcon className="w-5 h-5 text-amber-800" />
        <h4 className="text-base font-bold text-stone-900">
          Attach Photograph / Media Asset
        </h4>
      </div>

      {error && (
        <div
          className="mb-3 p-3 bg-red-50 border border-red-200 text-red-800 rounded text-xs flex items-start space-x-2"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center space-x-2">
          <CheckCircle className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="border-2 border-dashed border-stone-300 hover:border-amber-700 p-4 rounded-lg text-center bg-stone-50 transition cursor-pointer">
          <input
            type="file"
            id="photo-file-input"
            accept="image/*,.tiff"
            onChange={handleFileSimulate}
            className="hidden"
          />
          <label htmlFor="photo-file-input" className="cursor-pointer block">
            <UploadCloud className="w-8 h-8 mx-auto text-amber-800 mb-1" />
            <p className="text-xs font-semibold text-stone-800">
              {fileName
                ? fileName
                : "Drag and drop high-res photograph or click to select"}
            </p>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Supports JPEG, PNG, WEBP, TIFF (up to 50MB)
            </p>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              File Name *
            </label>
            <input
              type="text"
              required
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="e.g. Amphora_Detail_001.jpg"
              className="w-full px-3 py-1.5 border border-stone-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              File Storage URL *
            </label>
            <input
              type="text"
              required
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="https://storage.googleapis.com/..."
              className="w-full px-3 py-1.5 border border-stone-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
            Caption & Photograph Notes
          </label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="e.g. Surface detail showing amphora stamp handle"
            className="w-full px-3 py-1.5 border border-stone-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-800"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-amber-800 text-white rounded font-medium text-xs hover:bg-amber-900 transition flex items-center justify-center space-x-1 disabled:opacity-50"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>{loading ? "Uploading..." : "Save Media Record"}</span>
        </button>
      </form>
    </div>
  );
}
