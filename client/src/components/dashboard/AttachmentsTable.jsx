import React from "react";

export default function AttachmentsTable({ attachments, onDeleteAttachment }) {
  const formatSize = (bytes) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-surface-container border border-outline-variant/30 rounded-xl overflow-hidden">
      <div className="p-6 border-b border-outline-variant/30">
        <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
          Recent Attachments
        </h3>
        <p className="text-outline font-label-sm text-label-sm">
          All uploaded files across your workspace
        </p>
      </div>

      {attachments.length === 0 ? (
        <div className="p-8 text-center text-outline font-label-md">
          No attachments found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/20 text-outline font-label-sm text-label-sm uppercase tracking-wider">
                <th className="p-4 pl-6">Filename</th>
                <th className="p-4">Note Title</th>
                <th className="p-4">Size</th>
                <th className="p-4">Uploaded At</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {attachments.map((att) => (
                <tr
                  key={att.id}
                  className="hover:bg-surface-variant/10 transition-colors"
                >
                  <td className="p-4 pl-6 font-label-md text-label-md text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      description
                    </span>
                    <span
                      className="truncate max-w-[200px]"
                      title={att.filename}
                    >
                      {att.filename}
                    </span>
                  </td>
                  <td className="p-4 font-body-md text-on-surface-variant">
                    {att.note_title || "Untitled Note"}
                  </td>
                  <td className="p-4 font-label-sm text-label-sm text-outline">
                    {formatSize(att.file_size)}
                  </td>
                  <td className="p-4 font-label-sm text-label-sm text-outline">
                    {formatDate(att.created_at)}
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button
                      onClick={() => onDeleteAttachment(att.id)}
                      className="p-1.5 text-outline hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                      title="Delete attachment"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        delete
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
