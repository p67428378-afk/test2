import React from "react";

export const KeypadButton = ({
  label,
  value,
  variant = "num",
  colSpan = 1,
  onClick,
  disabled = false,
  ariaLabel,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "ac":
        return "btn-ac bg-rose-100 text-rose-700 hover:bg-rose-200 active:bg-rose-300 font-semibold text-lg";
      case "op":
        return "btn-op bg-indigo-100 text-indigo-700 hover:bg-indigo-200 active:bg-indigo-300 font-semibold text-lg";
      case "slate-op":
        return "btn-op bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300 font-semibold text-lg";
      case "equals":
        return "btn-equals bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 font-bold text-xl shadow-md";
      case "num":
      default:
        return "btn-num bg-slate-50 text-slate-800 hover:bg-slate-100 active:bg-slate-200 border border-slate-200 font-medium text-xl";
    }
  };

  const spanStyle = colSpan === 2 ? "col-span-2" : "col-span-1";

  return (
    <button
      type="button"
      onClick={() => onClick && onClick(value !== undefined ? value : label)}
      disabled={disabled}
      aria-label={
        ariaLabel || (typeof label === "string" ? label : String(value))
      }
      className={`${spanStyle} ${getVariantStyles()} p-4 rounded-xl transition-all duration-150 flex items-center justify-center select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
    >
      {label}
    </button>
  );
};

export default KeypadButton;
