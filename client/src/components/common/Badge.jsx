import React from "react";

export default function Badge({ status, className = "" }) {
  const normalizedStatus = status?.toUpperCase() || "MAINTAIN";

  const styles = {
    GROW: "bg-tertiary/10 text-tertiary border-tertiary/20",
    MAINTAIN:
      "bg-secondary-fixed/50 text-on-secondary-fixed border-secondary-fixed",
    SWAP: "bg-primary-container/30 text-primary border-primary-container/40",
    REDUCE:
      "bg-error-container text-on-error-container border-error-container/40",
    PASS: "bg-tertiary/10 text-tertiary border-tertiary/20",
    FAIL: "bg-error-container text-on-error-container border-error-container/20",
  };

  const currentStyle = styles[normalizedStatus] || styles.MAINTAIN;

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-label-sm font-semibold border ${currentStyle} ${className}`}
    >
      {normalizedStatus}
    </span>
  );
}
