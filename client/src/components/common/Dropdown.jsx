import React from "react";

export default function Dropdown({
  label,
  options = [],
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
      <select
        className={`w-full py-2 px-3 bg-surface-container-low border ${
          error
            ? "border-error focus:border-error focus:ring-error/20"
            : "border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20"
        } rounded-lg focus:outline-none text-body-md text-on-surface appearance-none cursor-pointer`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-xs text-error font-medium" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
