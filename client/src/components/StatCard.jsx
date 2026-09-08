import React from "react";

export default function StatCard({
  title,
  value,
  icon: Icon,
  variant = "neutral",
  subtitle,
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case "income":
        return {
          textColor: "text-emerald-600",
          bgColor: "bg-emerald-50",
          iconColor: "text-emerald-600",
          borderColor: "border-emerald-100",
        };
      case "expense":
        return {
          textColor: "text-rose-600",
          bgColor: "bg-rose-50",
          iconColor: "text-rose-600",
          borderColor: "border-rose-100",
        };
      case "balance":
        return {
          textColor: "text-blue-600",
          bgColor: "bg-blue-50",
          iconColor: "text-blue-600",
          borderColor: "border-blue-100",
        };
      case "savings":
        return {
          textColor: "text-purple-600",
          bgColor: "bg-purple-50",
          iconColor: "text-purple-600",
          borderColor: "border-purple-100",
        };
      default:
        return {
          textColor: "text-slate-900",
          bgColor: "bg-slate-50",
          iconColor: "text-slate-600",
          borderColor: "border-slate-200",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md ${styles.borderColor}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-500 text-xs font-semibold tracking-wider uppercase">
            {title}
          </p>
          <p
            className={`text-2xl sm:text-3xl font-bold mt-2 tracking-tight ${styles.textColor}`}
          >
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1 font-medium">
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div
            className={`p-3 rounded-xl ${styles.bgColor} ${styles.iconColor}`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
