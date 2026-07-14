import React from "react";
import PropTypes from "prop-types";

export default function QueuePhotoCard({ item, onRemove, onRetry, onCancel }) {
  const formatSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div
      className={`bg-surface-lowest border border-outline-variant rounded-xl p-4 flex flex-col gap-3 ${
        item.status === "failed" ? "border-l-4 border-l-error" : ""
      } ${item.status === "uploading" ? "border-l-4 border-l-primary" : ""}`}
    >
      <div className="flex items-center space-x-4">
        {item.base64 ? (
          <img
            alt={item.name}
            className="w-16 h-16 object-cover rounded-lg shrink-0 border border-outline-variant"
            src={item.base64}
          />
        ) : (
          <div className="w-16 h-16 rounded-lg shrink-0 bg-surface-container flex items-center justify-center border border-outline-variant">
            <span className="material-symbols-outlined text-on-surface-variant">
              image
            </span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="font-body-md text-body-md font-medium text-on-surface truncate">
            {item.name}
          </p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              {formatSize(item.size)}
            </span>
            <span className="w-1 h-1 bg-outline-variant rounded-full"></span>

            {item.status === "pending" && (
              <span className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm px-2 py-0.5 rounded-full">
                Pending
              </span>
            )}

            {item.status === "failed" && (
              <span className="bg-error-container text-on-error-container font-label-sm text-label-sm px-2 py-0.5 rounded-full">
                Failed
              </span>
            )}

            {item.status === "complete" && (
              <span className="bg-green-100 text-green-800 font-label-sm text-label-sm px-2 py-0.5 rounded-full">
                Uploaded
              </span>
            )}

            {item.status === "uploading" && (
              <span className="flex items-center space-x-1 text-primary">
                <span className="material-symbols-outlined text-[14px] animate-spin">
                  sync
                </span>
                <span className="font-label-sm text-label-sm font-medium">
                  Uploading...
                </span>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-1 shrink-0">
          {item.status === "failed" && onRetry && (
            <button
              onClick={() => onRetry(item.id)}
              aria-label="Retry"
              className="p-2 text-primary hover:bg-surface-container rounded-full transition-colors"
            >
              <span className="material-symbols-outlined">refresh</span>
            </button>
          )}

          {item.status === "uploading" && onCancel && (
            <button
              onClick={() => onCancel(item.id)}
              aria-label="Cancel"
              className="p-2 text-outline hover:text-error transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          )}

          {item.status !== "uploading" && onRemove && (
            <button
              onClick={() => onRemove(item.id)}
              aria-label="Delete"
              className="p-2 text-outline hover:text-error transition-colors"
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
          )}
        </div>
      </div>

      {item.status === "uploading" && (
        <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-primary h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${item.progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}

QueuePhotoCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    progress: PropTypes.number.isRequired,
    base64: PropTypes.string,
  }).isRequired,
  onRemove: PropTypes.func,
  onRetry: PropTypes.func,
  onCancel: PropTypes.func,
};
