import React from "react";

export default function AlternativeCard({
  name,
  description,
  estimatedCost,
  estimatedSavings,
  onAction,
  actionLabel = "Explore",
}) {
  return (
    <div className="glass-card rounded-xl p-lg flex flex-col h-full border-t-2 border-t-secondary transition-transform hover:-translate-y-1 duration-300">
      <div className="mb-md">
        <h4 className="font-headline-md text-headline-md font-semibold text-on-surface">
          {name}
        </h4>
        <div className="font-mono-data text-primary text-[20px] font-bold mt-1">
          ${estimatedCost.toFixed(2)}
          <span className="text-label-md text-on-surface-variant font-normal">
            /mo
          </span>
        </div>
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant mb-xl flex-1 flex items-center gap-2">
        <span className="material-symbols-outlined text-secondary text-[18px]">
          trending_down
        </span>
        <span className="text-secondary font-medium">
          Save ${estimatedSavings.toFixed(2)}/mo
        </span>{" "}
        {description}
      </p>
      <button
        onClick={onAction}
        className="w-full bg-primary text-on-primary font-label-md text-label-md py-sm rounded-lg hover:bg-primary-fixed transition-colors font-bold shadow-[0_0_15px_rgba(192,193,255,0.2)]"
      >
        {actionLabel}
      </button>
    </div>
  );
}
