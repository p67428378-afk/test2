import React from "react";

export default function Field({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helpText,
  options, // For select dropdowns
  rows = 3, // For textareas
  disabled = false,
  className = "",
  ...props
}) {
  const inputBaseStyles =
    "w-full px-3 py-2 bg-white border border-[#e0e8f0] rounded-lg text-sm text-[#171f2e] placeholder-[#6b7a8f] focus:outline-none focus:ring-2 focus:ring-[#1485b8] focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed transition-colors";

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-[#171f2e]">
          {label} {required && <span className="text-[#db2727]">*</span>}
        </label>
      )}

      {type === "select" ? (
        <select
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`${inputBaseStyles} ${error ? "border-[#db2727] focus:ring-[#db2727]" : ""}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options?.map((opt, idx) => (
            <option key={idx} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          id={id}
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`${inputBaseStyles} ${error ? "border-[#db2727] focus:ring-[#db2727]" : ""}`}
          {...props}
        />
      ) : (
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`${inputBaseStyles} ${error ? "border-[#db2727] focus:ring-[#db2727]" : ""}`}
          {...props}
        />
      )}

      {helpText && !error && (
        <span className="text-[11px] text-[#6b7a8f]">{helpText}</span>
      )}

      {error && (
        <span className="text-xs text-[#db2727] font-medium">{error}</span>
      )}
    </div>
  );
}
