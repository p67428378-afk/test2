import React from "react";

export default function Header({
  onMenuClick,
  onSave,
  onDelete,
  isSaving,
  hasSelectedNote,
}) {
  return (
    <header className="flex justify-between items-center h-16 px-gutter border-b border-outline-variant/30 bg-surface/90 backdrop-blur-md sticky top-0 z-20">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-on-surface-variant hover:text-on-surface p-2 -ml-2 rounded-lg hover:bg-surface-variant/50 transition-colors"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="hidden md:flex items-center gap-2 text-outline font-label-sm text-label-sm">
          <span className="material-symbols-outlined text-[16px] text-primary">
            {isSaving ? "sync" : "cloud_done"}
          </span>
          {isSaving ? "Saving changes..." : "Saved to cloud"}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {hasSelectedNote && (
          <>
            <button
              onClick={onSave}
              className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-colors group relative"
              title="Save Note"
            >
              <span className="material-symbols-outlined">save</span>
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-colors group relative"
              title="Delete Note"
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
            <div className="w-px h-6 bg-outline-variant/50 mx-2"></div>
          </>
        )}
        <button
          onClick={onSave}
          disabled={!hasSelectedNote}
          className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-primary-fixed transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Note
        </button>
      </div>
    </header>
  );
}
