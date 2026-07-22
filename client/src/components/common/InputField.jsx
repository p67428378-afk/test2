import React from "react";

export default function InputField({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  error = "",
}) {
  return (
    <div className="flex flex-col gap-xs w-full">
      {label && (
        <label
          htmlFor={id}
          className="font-label-md text-label-md text-on-surface-variant"
        >
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
      />
      {error && <span className="text-[12px] text-error">{error}</span>}
    </div>
  );
}
