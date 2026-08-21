import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function RenameModal({ chat, onClose, onSave }) {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (chat) {
      setTitle(chat.title || "");
    }
  }, [chat]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave(title);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!chat) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="bg-[#1f293b] border border-[#334054] rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onKeyDown={handleKeyDown}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#334054]">
          <h3 className="text-lg font-bold text-[#f7fafc]">
            Rename Chat Session
          </h3>
          <button
            onClick={onClose}
            className="text-[#94a3b8] hover:text-white p-1 rounded-lg hover:bg-[#334054] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-[#94a3b8] uppercase tracking-wider">
              New Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              className="w-full bg-[#141c2b] border border-[#334054] focus:border-[#6173f5] rounded-lg px-4 py-3 text-sm text-[#f7fafc] outline-none transition-colors"
              placeholder="Enter new chat title..."
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-[#141c2b] border-t border-[#334054]">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1f293b] border border-[#334054] hover:bg-[#2d3748] text-[#f7fafc] rounded-lg text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !title.trim()
                ? "bg-[#334054] text-[#94a3b8] cursor-not-allowed"
                : "bg-[#6173f5] text-white hover:bg-[#4f5fd8]"
            }`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
