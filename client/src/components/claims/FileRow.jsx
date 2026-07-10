import React from "react";
import PropTypes from "prop-types";

export default function FileRow({ file, progress, status, onRemove }) {
  const formatSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="flex items-center gap-3 bg-surface p-3 rounded-lg shadow-[0px_4px_12px_rgba(30,58,138,0.05)] border border-outline-variant/20">
      <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-outline-variant/30 bg-surface-container flex items-center justify-center">
        {file.preview ? (
          <img
            src={file.preview}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span
            className="material-symbols-outlined text-on-surface-variant"
            data-icon="image"
          >
            image
          </span>
        )}
        {status === "complete" && (
          <div className="absolute top-1 right-1 bg-secondary text-on-secondary rounded-full w-5 h-5 flex items-center justify-center">
            <span
              className="material-symbols-outlined text-[14px] font-bold"
              data-icon="check"
            >
              check
            </span>
          </div>
        )}
        {status === "uploading" && (
          <div className="absolute inset-0 bg-surface/50 backdrop-blur-[2px] flex items-center justify-center">
            <span
              className="material-symbols-outlined text-primary spin"
              data-icon="progress_activity"
            >
              progress_activity
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-end mb-1">
          <p className="text-body-sm font-medium text-on-surface truncate pr-2">
            {file.name}
          </p>
          {status === "uploading" && (
            <p className="text-body-sm text-primary font-medium">{progress}%</p>
          )}
        </div>
        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2">
          {formatSize(file.size)}{" "}
          {status === "uploading" ? "• Uploading..." : ""}
        </p>
        <div className="w-full bg-surface-variant rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              status === "complete" ? "bg-secondary w-full" : "bg-primary"
            }`}
            style={{ width: status === "complete" ? "100%" : `${progress}%` }}
          ></div>
        </div>
      </div>

      <button
        onClick={onRemove}
        className="text-error hover:bg-error-container/20 p-1.5 rounded-full transition-colors"
        aria-label={`Remove ${file.name}`}
      >
        <span className="material-symbols-outlined text-xl" data-icon="delete">
          delete
        </span>
      </button>
    </div>
  );
}

FileRow.propTypes = {
  file: PropTypes.shape({
    name: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    preview: PropTypes.string,
  }).isRequired,
  progress: PropTypes.number.isRequired,
  status: PropTypes.oneOf(["pending", "uploading", "complete", "failed"])
    .isRequired,
  onRemove: PropTypes.func.isRequired,
};
