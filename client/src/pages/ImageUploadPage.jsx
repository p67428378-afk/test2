import React, { useState } from "react";
import PropTypes from "prop-types";
import UploadDropzone from "../components/claims/UploadDropzone.jsx";
import FileRow from "../components/claims/FileRow.jsx";
import { uploadDamagePhotos } from "../services/api.js";

export default function ImageUploadPage({ onUploadSuccess }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFilesSelected = (newFiles) => {
    const mapped = newFiles.map((file) => ({
      file,
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: "pending",
    }));
    setFiles((prev) => [...prev, ...mapped]);
    setError(null);
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => {
      const updated = [...prev];
      if (updated[index].preview) {
        URL.revokeObjectURL(updated[index].preview);
      }
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (files.length < 3) {
      setError("Please upload at least 3 clear photos of the vehicle damage.");
      return;
    }

    setUploading(true);
    setError(null);

    // Simulate upload progress for each file
    const interval = setInterval(() => {
      setFiles((prev) =>
        prev.map((f) => {
          if (f.status === "pending") {
            return { ...f, status: "uploading", progress: 10 };
          }
          if (f.status === "uploading" && f.progress < 100) {
            const nextProgress = Math.min(f.progress + 30, 100);
            return {
              ...f,
              progress: nextProgress,
              status: nextProgress === 100 ? "complete" : "uploading",
            };
          }
          return f;
        }),
      );
    }, 200);

    try {
      const rawFiles = files.map((f) => f.file);
      const response = await uploadDamagePhotos(rawFiles);
      clearInterval(interval);

      // Set all to 100% complete
      setFiles((prev) =>
        prev.map((f) => ({ ...f, progress: 100, status: "complete" })),
      );

      setTimeout(() => {
        onUploadSuccess(response.claim_id);
      }, 500);
    } catch (err) {
      clearInterval(interval);
      setError(
        err.response?.data?.detail ||
          "Failed to upload photos. Please try again.",
      );
      setFiles((prev) =>
        prev.map((f) =>
          f.status === "uploading" ? { ...f, status: "failed" } : f,
        ),
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <header className="w-full top-0 sticky bg-surface flex justify-between items-center px-container-margin h-16 z-10 border-b border-outline-variant/20">
        <button
          aria-label="Go back"
          className="cursor-pointer active:scale-95 transition-transform hover:opacity-80 text-primary"
        >
          <span className="material-symbols-outlined" data-icon="arrow_back">
            arrow_back
          </span>
        </button>
        <div className="flex flex-col items-center">
          <h1 className="font-headline-md text-headline-md font-bold text-primary">
            New Damage Estimate
          </h1>
          <span className="text-body-sm text-on-surface-variant">
            Step 1 of 2: Upload Photos
          </span>
        </div>
        <button
          aria-label="Close"
          className="cursor-pointer active:scale-95 transition-transform hover:opacity-80 text-primary"
        >
          <span className="material-symbols-outlined" data-icon="close">
            close
          </span>
        </button>
      </header>

      <main className="flex-1 px-container-margin py-section-padding flex flex-col gap-stack-gap max-w-2xl mx-auto w-full">
        {/* Instruction Card */}
        <div className="bg-surface-container-low p-gutter rounded-lg flex gap-3 shadow-[0px_4px_12px_rgba(30,58,138,0.05)]">
          <span
            className="material-symbols-outlined text-primary-container shrink-0 mt-0.5"
            data-icon="info"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            info
          </span>
          <p className="text-body-sm text-on-surface">
            Please upload at least 3 clear photos of the vehicle damage from
            different angles (front, side, close-up) for an accurate AI
            estimate.
          </p>
        </div>

        {/* Upload Dropzone */}
        <UploadDropzone onFilesSelected={handleFilesSelected} />

        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded-lg text-sm flex items-center gap-2">
            <span
              className="material-symbols-outlined text-error"
              data-icon="error"
            >
              error
            </span>
            <span>{error}</span>
          </div>
        )}

        {/* Selected Images List */}
        <div className="flex flex-col gap-3 mt-4">
          {files.map((file, index) => (
            <FileRow
              key={file.name + index}
              file={file}
              progress={file.progress}
              status={file.status}
              onRemove={() => handleRemoveFile(index)}
            />
          ))}

          {files.length < 3 && (
            <div className="flex items-center gap-3 bg-surface border border-dashed border-outline-variant p-3 rounded-lg text-left">
              <div className="w-16 h-16 shrink-0 rounded-lg bg-surface-container flex items-center justify-center border border-dashed border-outline-variant">
                <span
                  className="material-symbols-outlined text-on-surface-variant"
                  data-icon="add"
                >
                  add
                </span>
              </div>
              <div className="flex-1">
                <p className="font-button text-button text-on-surface-variant">
                  Add Angle {files.length + 1} (Need {3 - files.length} more)
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer Action */}
      <div className="px-container-margin pb-8 pt-4 mt-auto max-w-2xl mx-auto w-full">
        <button
          onClick={handleSubmit}
          disabled={files.length < 3 || uploading}
          className={`w-full bg-primary text-on-primary font-button text-button py-4 rounded-lg flex items-center justify-center mb-4 transition-all ${
            files.length < 3 || uploading
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-primary/90 active:scale-[0.98]"
          }`}
        >
          {uploading ? "Uploading & Processing..." : "Submit for AI Estimate"}
        </button>
        <div className="flex items-center justify-center gap-1.5 text-on-surface-variant">
          <span
            className="material-symbols-outlined text-[16px]"
            data-icon="lock"
          >
            lock
          </span>
          <span className="text-body-sm">
            Your photos are securely uploaded and encrypted.
          </span>
        </div>
      </div>
    </div>
  );
}

ImageUploadPage.propTypes = {
  onUploadSuccess: PropTypes.func.isRequired,
};
