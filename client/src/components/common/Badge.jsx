import React from "react";

export default function Badge({ children, variant = "info" }) {
  const baseStyles =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

  const variants = {
    success: "bg-[#00a572]/20 text-[#4edea3]",
    warning: "bg-[#ca8100]/20 text-[#ffb95f]",
    danger: "bg-[#93000a]/20 text-[#ffb4ab]",
    info: "bg-[#8083ff]/20 text-[#c0c1ff]",
    neutral: "bg-[#31394d] text-[#c7c4d7]",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]}`}>{children}</span>
  );
}
