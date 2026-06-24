import React from "react";

const Badge = ({ children, variant = "success", className = "" }) => {
  const baseStyles =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border";

  const variants = {
    success:
      "bg-primary-container/10 text-primary-container border-primary-container/20",
    warning: "bg-error-container text-on-error-container border-error/20",
    info: "bg-secondary-container text-on-secondary-container border-secondary/20",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
