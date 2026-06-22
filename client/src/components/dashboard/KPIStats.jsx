import React from "react";

export default function KPIStats({ stats }) {
  const formatStorage = (bytes) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const cards = [
    {
      title: "Total Notes",
      value: stats?.total_notes ?? 0,
      icon: "description",
      color: "text-primary bg-primary/10",
    },
    {
      title: "Active Tags",
      value: stats?.active_tags ?? 0,
      icon: "label",
      color: "text-secondary bg-secondary/10",
    },
    {
      title: "Storage Usage",
      value: formatStorage(stats?.storage_usage_bytes ?? 0),
      icon: "cloud",
      color: "text-tertiary bg-tertiary/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-surface-container border border-outline-variant/30 rounded-xl p-6 flex items-center justify-between"
        >
          <div>
            <p className="text-outline font-label-sm text-label-sm uppercase tracking-wider mb-1">
              {card.title}
            </p>
            <h3 className="text-on-surface font-display text-headline-lg font-bold">
              {card.value}
            </h3>
          </div>
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}
          >
            <span className="material-symbols-outlined text-[24px]">
              {card.icon}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
