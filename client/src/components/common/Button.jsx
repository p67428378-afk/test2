import React from "react";
import PropTypes from "prop-types";

export default function Button({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  className = "",
  type = "button",
}) {
  const baseStyles =
    "py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";

  const variants = {
    primary:
      "bg-primary-container text-surface-container-lowest hover:bg-surface-tint hover:shadow-lg",
    secondary:
      "bg-surface-container border border-outline-variant text-on-surface hover:bg-surface-bright",
    danger: "bg-error text-on-error hover:opacity-90",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(["primary", "secondary", "danger"]),
  className: PropTypes.string,
  type: PropTypes.string,
};
