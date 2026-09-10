import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  AlertCircle,
  X,
  CheckCircle,
  Loader2,
} from "lucide-react";

const ALLOWED_EXTS = [".eml", ".txt", ".pdf"];
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export default function FileUploadDropzone({
  onFileSubmit,
  isLoading = false,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [validationError, setValidationError] = useState("");
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!file) return false;
    const name = file.name.toLowerCase();
    const hasValidExt = ALLOWED_EXTS.some((ext) => name.endsWith(ext));

    if (!hasValidExt) {
      setValidationError(
        `Unsupported file format '${file.name}'. Please upload .eml, .txt, or .pdf`,
      );
      setSelectedFile(null);
      return false;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setValidationError(
        `File size exceeds ${MAX_SIZE_MB}MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
      );
      setSelectedFile(null);
      return false;
    }

    setValidationError("");
    setSelectedFile(file);
    return true;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateFile(e.target.files[0]);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setValidationError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setValidationError("Please select a file to classify.");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    onFileSubmit(formData, handleClear);
  };

  return (
    <div className="space-y-4">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".eml,.txt,.pdf"
        onChange={handleChange}
        className="hidden"
        id="email-file-input"
      />

      {/* Dropzone Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !selectedFile && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
          dragActive
            ? "border-indigo-500 bg-indigo-50/50 scale-[0.99]"
            : selectedFile
              ? "border-emerald-300 bg-emerald-50/20"
              : "border-slate-300 hover:border-indigo-400 bg-slate-50/50"
        }`}
      >
        {!selectedFile ? (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">
              Click to browse or drag and drop email files here
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports standard formats:{" "}
              <span className="font-semibold text-indigo-600">
                .eml, .txt, .pdf
              </span>{" "}
              (Max {MAX_SIZE_MB}MB)
            </p>
            <button
              type="button"
              className="mt-4 px-4 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 shadow-sm transition-colors"
            >
              Browse Files
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 truncate">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="text-left truncate">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-slate-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB •{" "}
                  {selectedFile.type || "Email document"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                <CheckCircle className="w-3.5 h-3.5" /> Ready
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                aria-label="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-600" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Submit File Button */}
      {selectedFile && (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-100 transition-colors disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Parsing & Classifying File...
            </>
          ) : (
            <>
              <UploadCloud className="w-4 h-4" />
              Upload & Classify {selectedFile.name}
            </>
          )}
        </button>
      )}
    </div>
  );
}
