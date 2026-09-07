import React, { useEffect } from "react";

const Toast = ({ message, type = "info", onClose, duration = 3000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const bgColors = {
    info: "bg-[#122131] border-[#00f0ff] text-[#00f0ff]",
    success: "bg-[#122131] border-[#00dbe9] text-[#00dbe9]",
    error: "bg-[#122131] border-[#ffb4ab] text-[#ffb4ab]",
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-xl transition-all duration-300 transform translate-y-0"
      role="alert"
    >
      <div
        className={`p-3 rounded-lg border text-sm font-medium ${bgColors[type] || bgColors.info} flex items-center gap-2`}
      >
        <span>✨</span>
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-xs opacity-70 hover:opacity-100 focus:outline-none"
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Toast;
