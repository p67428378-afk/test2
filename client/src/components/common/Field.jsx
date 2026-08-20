import React from "react";

export default function Field({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error = "",
}) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-[#63738c]">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`bg-[#f2f5fa] border ${
          error ? "border-error" : "border-[#e0e5f0]"
        } rounded-xl p-3 text-sm text-[#1f293b] placeholder-[#63738c] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all w-full`}
      />
      {error && <p className="text-xs text-error mt-0.5">{error}</p>}
    </div>
  );
}
