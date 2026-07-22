import React from "react";

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="surface-l1 rounded-xl max-w-md w-full overflow-hidden shadow-2xl border border-[#334155] animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-4 border-b border-[#334155] flex justify-between items-center bg-[#1E293B]">
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
