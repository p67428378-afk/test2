import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";

export default function ReceiptUploadZone({
  onFileSelect,
  selectedFile,
  onClearFile,
  error,
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
        Proof of Purchase / Receipt Attachment
      </label>

      {selectedFile ? (
        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="p-2 bg-blue-100 rounded text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-gray-900 truncate">
                {selectedFile.name}
              </p>
              <p className="text-[10px] text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClearFile}
            className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-white transition-colors"
            title="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragOver
              ? "border-primary bg-blue-50"
              : "border-gray-300 hover:border-gray-400 bg-gray-50"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png,image/jpeg,image/webp,application/pdf"
            className="hidden"
          />
          <UploadCloud className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <p className="text-xs font-medium text-gray-700">
            <span className="text-primary font-semibold">Click to upload</span>{" "}
            or drag and drop
          </p>
          <p className="text-[10px] text-gray-500 mt-1">
            PNG, JPG, WEBP or PDF (max 10MB)
          </p>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-600 mt-1 flex items-center">
          <AlertCircle className="h-3.5 w-3.5 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
}
