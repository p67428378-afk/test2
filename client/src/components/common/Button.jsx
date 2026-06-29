import React from "react";
import PropTypes from "prop-types";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
}) {
  const baseStyles =
    "font-label-md text-sm py-2.5 px-5 rounded-brand shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2";

  const variants = {
    primary:
      "bg-brand-coral hover:bg-brand-coral/90 text-white font-bold disabled:bg-brand-coral/50 disabled:scale-100",
    secondary:
      "bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-semibold border border-outline-variant disabled:opacity-50 disabled:scale-100",
    danger:
      "bg-error hover:bg-error/90 text-white font-bold disabled:bg-error/50 disabled:scale-100",
    success:
      "bg-brand-green hover:bg-brand-green/90 text-white font-bold disabled:bg-brand-green/50 disabled:scale-100",
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
  type: PropTypes.string,
  variant: PropTypes.oneOf(["primary", "secondary", "danger", "success"]),
  disabled: PropTypes.bool,
  className: PropTypes.string,
};
