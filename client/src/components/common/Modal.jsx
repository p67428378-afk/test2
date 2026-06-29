import React from "react";

export default function Modal({ isOpen, onClose, title, children, footer }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-lg mx-auto my-6 z-50 px-4">
        <div className="border-0 rounded-xl shadow-2xl relative flex flex-col w-full bg-white outline-none focus:outline-none overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-outline-variant">
            <h3 className="text-lg font-headline-md font-bold text-on-surface">
              {title}
            </h3>
            <button
              className="p-1 ml-auto bg-transparent border-0 text-on-surface-variant hover:text-brand-coral float-right text-3xl leading-none font-semibold outline-none focus:outline-none transition-colors"
              onClick={onClose}
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>

          {/* Body */}
          <div className="relative p-6 flex-auto max-h-[70vh] overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-3 p-4 border-t border-outline-variant bg-surface-container-low">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
