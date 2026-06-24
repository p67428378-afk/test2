import React from "react";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  onClick,
  disabled = false,
  className = "",
  ...props
}) => {
  const baseStyles =
    "px-4 py-2 rounded-lg font-body-md text-body-md font-semibold transition-all duration-200 ease-in-out active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-primary-container text-on-primary-container hover:bg-primary hover:text-white",
    secondary:
      "bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-white",
    outline:
      "border border-outline-variant text-on-surface hover:bg-surface-container-high",
    danger: "bg-error text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
