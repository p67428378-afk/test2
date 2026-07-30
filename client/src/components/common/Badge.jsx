import React from "react";
import PropTypes from "prop-types";

const Badge = ({ children, variant = "info", className = "" }) => {
  const baseStyles =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

  const variants = {
    success: "bg-emerald-100 text-emerald-800",
    warning: "bg-amber-100 text-amber-800",
    error: "bg-rose-100 text-rose-800",
    info: "bg-sky-100 text-sky-800",
    neutral: "bg-slate-100 text-slate-800",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["success", "warning", "error", "info", "neutral"]),
  className: PropTypes.string,
};

export default Badge;
