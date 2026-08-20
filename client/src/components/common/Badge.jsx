import React from "react";

export default function Badge({ status }) {
  let bgColor = "bg-gray-100 text-gray-800";

  if (status === "Active") {
    bgColor = "bg-[#17a34a] text-white";
  } else if (status === "Expiring Soon") {
    bgColor = "bg-[#eb9917] text-white";
  } else if (status === "Expired") {
    bgColor = "bg-[#db2626] text-white";
  }

  return (
    <div
      className={`${bgColor} flex items-center justify-center px-2 py-1 rounded-full shrink-0 text-xs font-medium`}
    >
      <p className="whitespace-nowrap">{status}</p>
    </div>
  );
}
