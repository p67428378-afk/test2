import React from "react";
import Card from "./Card";
import Badge from "./Badge";

export default function StatCard({
  title,
  value,
  badgeText,
  badgeVariant = "success",
  className = "",
}) {
  return (
    <Card className={`flex flex-col gap-1 flex-1 min-w-[200px] ${className}`}>
      <p className="text-xs font-medium text-[#63738c] uppercase tracking-wider">
        {title}
      </p>
      <div className="flex gap-2 items-baseline justify-between mt-1">
        <p className="font-bold text-[#1f293b] text-2xl">{value}</p>
        {badgeText && <Badge variant={badgeVariant}>{badgeText}</Badge>}
      </div>
    </Card>
  );
}
