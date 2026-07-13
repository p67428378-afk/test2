import React from "react";

export default function FrequencySelector({ selectedFrequency, onChange }) {
  const options = [
    { value: 2, label: "Every 2 Weeks" },
    { value: 4, label: "Every 4 Weeks" },
    { value: 6, label: "Every 6 Weeks" },
  ];

  return (
    <div>
      <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6 flex items-center gap-3">
        <span className="material-symbols-outlined text-surface-tint">
          event_repeat
        </span>
        Step 2: Delivery Frequency
      </h2>
      <div className="bg-surface-container-high p-1.5 rounded-full inline-flex w-full max-w-xl">
        {options.map((opt) => {
          const isSelected = selectedFrequency === opt.value;
          return (
            <label
              key={opt.value}
              className="flex-1 text-center cursor-pointer"
            >
              <input
                className="sr-only"
                name="frequency"
                type="radio"
                value={opt.value}
                checked={isSelected}
                onChange={() => onChange(opt.value)}
              />
              <div
                className={`py-3 px-2 rounded-full font-label-md text-label-md transition-all ${
                  isSelected
                    ? "bg-primary-container text-secondary-fixed-dim shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {opt.label}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
