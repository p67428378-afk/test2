import React from "react";

export default function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  min,
  max,
  step,
  className = "",
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-on-surface-variant">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        step={step}
        className="w-full bg-surface-container-high border border-white/10 rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary transition-colors"
      />
    </div>
  );
}
