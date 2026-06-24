import React from "react";
import PropTypes from "prop-types";

export default function Badge({ children, className = "" }) {
  const baseStyles =
    "inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-semibold border";

  const variants = {
    grow: "bg-primary/10 text-primary border-primary/30",
    maintain:
      "bg-surface-variant text-on-surface-variant border-outline-variant",
    reduce: "bg-error/10 text-error border-error/30",
    swap: "bg-tertiary/10 text-tertiary border-tertiary/30",
    default: "bg-gray-100 text-gray-800 border-gray-300",
  };

  const selectedVariant = variants[children.toLowerCase()] || variants.default;

  return (
    <span className={`${baseStyles} ${selectedVariant} ${className}`}>
      {children.toUpperCase()}
    </span>
  );
}

Badge.propTypes = {
  children: PropTypes.string.isRequired,
  className: PropTypes.string,
};
