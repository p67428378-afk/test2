import React, { useState, useRef, useEffect } from "react";

const STATUS_CONFIG = {
  "To Do": {
    bg: "bg-tertiary-container/10",
    border: "border-tertiary-container/30",
    text: "text-tertiary-fixed-dim",
    dot: "bg-tertiary-fixed-dim",
  },
  "In Progress": {
    bg: "bg-primary-fixed-dim/10",
    border: "border-primary-fixed-dim/20",
    text: "text-primary-fixed-dim",
    dot: "bg-primary-fixed-dim",
  },
  Done: {
    bg: "bg-secondary-fixed/10",
    border: "border-secondary-fixed/20",
    text: "text-secondary-fixed",
    dot: "bg-secondary-fixed",
  },
};

export default function StatusDropdown({ currentStatus, onStatusChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const config = STATUS_CONFIG[currentStatus] || STATUS_CONFIG["To Do"];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 ${config.bg} border ${config.border} ${config.text} px-2.5 py-1 rounded-md cursor-pointer w-32 justify-between focus:outline-none`}
      >
        <span className="font-label-md text-label-md">{currentStatus}</span>
        <span className="material-symbols-outlined text-[16px]">
          expand_more
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-32 bg-[#334155] border border-outline-variant rounded-md shadow-lg backdrop-blur-md overflow-hidden z-30 flex flex-col">
          {Object.keys(STATUS_CONFIG).map((status) => {
            const itemConfig = STATUS_CONFIG[status];
            return (
              <button
                key={status}
                type="button"
                onClick={() => {
                  onStatusChange(status);
                  setIsOpen(false);
                }}
                className="px-3 py-2 flex items-center justify-between hover:bg-surface-container-highest cursor-pointer text-left w-full focus:outline-none"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${itemConfig.dot}`}
                  ></span>
                  <span
                    className={`font-label-md text-label-md ${status === currentStatus ? "text-on-surface font-semibold" : "text-on-surface-variant"}`}
                  >
                    {status}
                  </span>
                </div>
                {status === currentStatus && (
                  <span className="material-symbols-outlined text-[16px] text-on-surface">
                    check
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
