import React from "react";

export default function Input({
  label,
  type = "text",
  error,
  className = "",
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-sm font-medium text-on-surface-variant">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`w-full px-3 py-2 bg-surface-container-low border ${
          error
            ? "border-error focus:border-error focus:ring-error/20"
            : "border-outline-variant focus:border-primary focus:ring-primary/20"
        } rounded-lg focus:outline-none focus:ring-2 text-body-md transition-all text-on-surface`}
        {...props}
      />
      {error && (
        <span className="text-xs text-error font-medium" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
