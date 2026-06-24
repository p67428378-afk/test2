import React from "react";

export default function Badge({ status }) {
  const normalizedStatus = (status || "").toUpperCase();

  let classes =
    "bg-surface-variant text-on-surface-variant border border-outline-variant";

  if (normalizedStatus === "GROW") {
    classes = "bg-primary/10 text-primary border border-primary/30";
  } else if (normalizedStatus === "REDUCE") {
    classes = "bg-error/10 text-error border border-error/30";
  } else if (normalizedStatus === "SWAP") {
    classes = "bg-tertiary/10 text-tertiary border border-tertiary/30";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-semibold ${classes}`}
    >
      {normalizedStatus}
    </span>
  );
}
