import React from "react";
import { Clock, Binary, Layers } from "lucide-react";

export default function ClockViewSwitcher({
  currentMode = "flip",
  onModeChange,
}) {
  const modes = [
    { id: "flip", label: "Flip View", icon: Binary },
    { id: "analog", label: "Analog View", icon: Clock },
    { id: "hybrid", label: "Hybrid View", icon: Layers },
  ];

  return (
    <div
      className="flex items-center justify-center p-1.5 bg-stone-900/80 border border-amber-500/30 rounded-xl shadow-lg backdrop-blur-md"
      role="group"
      aria-label="Clock View Switcher"
    >
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = currentMode === mode.id;

        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => onModeChange && onModeChange(mode.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-serif font-semibold transition-all duration-200 ${
              isActive
                ? "bg-gradient-to-r from-amber-600 to-amber-700 text-stone-950 shadow-md border border-amber-400"
                : "text-amber-200/80 hover:text-amber-100 hover:bg-amber-950/40"
            }`}
          >
            <Icon
              className={`w-4 h-4 ${isActive ? "text-stone-950" : "text-amber-400"}`}
            />
            <span>{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
}
