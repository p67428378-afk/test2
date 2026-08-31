import React from "react";
import { Divide, Percent, DollarSign } from "lucide-react";

export default function SplitTypeTabs({ splitType, onChange }) {
  const options = [
    {
      id: "EQUAL",
      label: "Split Equally",
      icon: Divide,
      desc: "Shared evenly among participants",
    },
    {
      id: "PERCENTAGE",
      label: "By Percentage",
      icon: Percent,
      desc: "Custom % per participant (must sum to 100%)",
    },
    {
      id: "FIXED",
      label: "Fixed Amounts",
      icon: DollarSign,
      desc: "Specific $ amounts (must sum to total)",
    },
  ];

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-[#171C29] mb-2">
        Split Allocation Method
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = splitType === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? "border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 text-blue-900 shadow-sm"
                  : "border-[#E3E8F0] bg-white text-[#171C29] hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`p-1.5 rounded-lg ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-[#707A8C]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </span>
                <span className="text-sm font-semibold">{opt.label}</span>
              </div>
              <p className="text-xs text-[#707A8C]">{opt.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
