import React from "react";

export default function AttachmentList({ attachments, onDeleteAttachment }) {
  const formatSize = (bytes) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getFileIcon = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    if (["png", "jpg", "jpeg", "gif", "svg"].includes(ext)) {
      return { icon: "image", color: "bg-secondary/20 text-secondary" };
    }
    if (ext === "pdf") {
      return { icon: "picture_as_pdf", color: "bg-error/20 text-error" };
    }
    return { icon: "description", color: "bg-primary/20 text-primary" };
  };

  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-outline-variant/20">
      <h4 className="font-label-md text-label-md text-on-surface mb-4 uppercase tracking-wider">
        Attachments
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {attachments.map((att) => {
          const { icon, color } = getFileIcon(att.filename);
          return (
            <div
              key={att.id}
              className="flex items-center p-3 rounded-xl border border-outline-variant/40 bg-surface-container/50 hover:bg-surface-container transition-colors group cursor-pointer"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${color}`}
              >
                <span className="material-symbols-outlined">{icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-label-md text-label-md text-on-surface truncate">
                  {att.filename}
                </p>
                <p className="font-label-sm text-label-sm text-outline">
                  {formatSize(att.file_size)}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteAttachment(att.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 text-on-surface-variant hover:text-error transition-all"
                title="Delete attachment"
              >
                <span className="material-symbols-outlined text-[18px]">
                  close
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
