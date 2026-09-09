import React, { useState } from "react";
import {
  FileVideo,
  UploadCloud,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import Badge from "../common/Badge";

export default function EvidenceUploadCard({
  onFileSelect,
  uploadProgress,
  verifiedHash,
  isUploading,
}) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (onFileSelect) onFileSelect(file);
    }
  };

  return (
    <div className="border-2 border-dashed border-slate-700 hover:border-blue-500/60 bg-slate-950/50 rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors">
      <FileVideo className="w-12 h-12 text-blue-400 mb-3" />

      {selectedFile ? (
        <div className="w-full space-y-3">
          <p className="font-semibold text-slate-200 text-base">
            {selectedFile.name} (
            {(selectedFile.size / (1024 * 1024 * 1024)).toFixed(2)} GB)
          </p>
          <p className="text-xs text-slate-400">
            Status:{" "}
            {isUploading
              ? "Streaming via Presigned GCS URL..."
              : "File Staged for Upload"}
          </p>

          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300"
              style={{
                width: `${uploadProgress || (verifiedHash ? 100 : 0)}%`,
              }}
            />
          </div>

          {verifiedHash && (
            <div className="mt-4 bg-emerald-950/40 border border-emerald-800 rounded-lg p-3 text-left w-full space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">
                  SHA-256 Hash Digest
                </span>
                <Badge variant="success">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Hash Verified & Un-tampered</span>
                </Badge>
              </div>
              <p className="text-xs font-mono text-emerald-400 break-all">
                {verifiedHash}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="font-medium text-slate-200">
            Drag & drop evidence artifact or click to browse
          </p>
          <p className="text-xs text-slate-400">
            Supports MP4, AVI, PDF, PNG, RAW binary files up to 5.0 GB
          </p>
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-medium rounded-lg cursor-pointer transition-colors mt-2">
            <UploadCloud className="w-4 h-4 text-blue-400" />
            <span>Select Local File</span>
            <input type="file" onChange={handleFileChange} className="hidden" />
          </label>
        </div>
      )}
    </div>
  );
}
