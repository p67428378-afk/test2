import React from "react";

export default function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder = "",
  required = false,
  error = "",
  className = "",
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-gray-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow ${
          error ? "border-rose-500 focus:ring-rose-500" : "border-gray-300"
        }`}
        {...props}
      />
      {error && <span className="text-xs text-rose-500">{error}</span>}
    </div>
  );
}
