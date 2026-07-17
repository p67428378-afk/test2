import React from "react";

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1E293B] border border-[#334155] rounded-lg max-w-md w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-[#334155] flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#dae2fd]">{title}</h3>
          <button
            onClick={onClose}
            className="text-[#bbcabf] hover:text-[#dae2fd] text-xl font-bold"
          >
            &times;
          </button>
        </div>
        <div className="p-5 text-sm text-[#dae2fd]">{children}</div>
        <div className="p-5 border-t border-[#334155] flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#10b981] text-white px-4 py-2 rounded font-semibold hover:bg-[#059669] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
