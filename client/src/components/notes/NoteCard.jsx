import React from "react";

export default function NoteCard({ note, isSelected, onClick }) {
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 6000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  const tagColors = {
    work: "bg-secondary-container/20 text-secondary-container border-secondary-container/30",
    personal: "bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30",
    ideas:
      "bg-tertiary-container/20 text-tertiary-container border-tertiary-container/30",
    finance: "bg-[#f59e0b]/20 text-[#f59e0b] border-[#f59e0b]/30",
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 cursor-pointer rounded-xl border transition-all ${
        isSelected
          ? "bg-surface-variant/40 border-l-4 border-l-primary border-outline-variant/50 shadow-[inset_0_0_20px_rgba(192,193,255,0.05)]"
          : "bg-surface/30 border-transparent hover:border-outline-variant/30 hover:bg-surface-variant/20"
      }`}
    >
      <div className="flex justify-between items-start mb-1">
        <h3
          className={`font-headline-md text-[16px] leading-tight font-semibold truncate pr-4 ${
            isSelected ? "text-on-surface" : "text-on-surface-variant"
          }`}
        >
          {note.title || "Untitled Note"}
        </h3>
        <span
          className={`font-label-sm text-[11px] whitespace-nowrap ${
            isSelected ? "text-primary" : "text-outline"
          }`}
        >
          {formatTime(note.updated_at || note.created_at)}
        </span>
      </div>
      <p
        className={`font-body-md text-label-md line-clamp-2 mb-3 ${
          isSelected ? "text-on-surface-variant" : "text-outline"
        }`}
      >
        {note.content || "No content"}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {note.tags &&
            note.tags.map((tag) => (
              <span
                key={tag}
                className={`px-2 py-0.5 rounded-full font-label-sm text-[10px] border ${
                  tagColors[tag.toLowerCase()] ||
                  "bg-primary/10 text-primary border-primary/20"
                }`}
              >
                #{tag}
              </span>
            ))}
        </div>
        {note.attachments_count > 0 && (
          <div className="flex items-center gap-1 text-outline">
            <span className="material-symbols-outlined text-[14px]">
              attachment
            </span>
            <span className="font-label-sm text-[11px]">
              {note.attachments_count}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
