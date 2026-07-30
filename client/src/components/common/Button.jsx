import React from "react";
import PropTypes from "prop-types";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
}) => {
  const baseStyles =
    "px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-primary hover:bg-primary-dark text-white focus:ring-primary",
    secondary:
      "bg-slate-200 hover:bg-slate-300 text-slate-800 focus:ring-slate-500",
    accent: "bg-accent hover:bg-accent-dark text-white focus:ring-accent",
    outline:
      "border border-slate-300 hover:bg-slate-50 text-slate-700 focus:ring-slate-500",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.string,
  variant: PropTypes.oneOf(["primary", "secondary", "accent", "outline"]),
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Button;
