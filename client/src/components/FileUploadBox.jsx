import React, { useState } from "react";
import { Upload, FileCheck, AlertCircle } from "lucide-react";

const FileUploadBox = ({ onFileSelected, selectedFile }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndPass = (file) => {
    setError(null);
    if (!file) return;

    // Validate size (< 20MB)
    if (file.size > 20 * 1024 * 1024) {
      setError("File size exceeds the 20MB limit.");
      return;
    }

    onFileSelected(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndPass(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndPass(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition cursor-pointer relative ${
          dragActive
            ? "border-amber-500 bg-amber-50/50"
            : selectedFile
              ? "border-emerald-500 bg-emerald-50/30"
              : "border-indigo-300 bg-indigo-50/50 hover:bg-indigo-50"
        }`}
      >
        <input
          type="file"
          id="file-upload-input"
          className="hidden"
          accept=".pdf,.docx,.zip,.doc,.txt"
          onChange={handleChange}
        />
        <label htmlFor="file-upload-input" className="cursor-pointer block">
          {selectedFile ? (
            <div className="flex flex-col items-center space-y-1">
              <FileCheck className="w-8 h-8 text-emerald-600" />
              <p className="text-sm font-semibold text-emerald-900">
                {selectedFile.name}
              </p>
              <p className="text-xs text-slate-500">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Click or
                drag to replace
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-1">
              <Upload className="w-8 h-8 text-indigo-700 mb-1" />
              <p className="text-sm text-indigo-900 font-medium">
                Drag & drop submission file (.pdf, .docx, .zip)
              </p>
              <p className="text-xs text-slate-500">Max file size: 20 MB</p>
            </div>
          )}
        </label>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-center gap-1.5 text-xs text-red-600 font-medium"
        >
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUploadBox;
