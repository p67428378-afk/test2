import React from "react";
import { Check, Camera, Clock, Award } from "lucide-react";

export default function PackageSelector({
  packages = [],
  selectedPackage,
  onSelectPackage,
}) {
  // Default packages if API hasn't loaded yet or returns empty
  const defaultPackages = [
    {
      id: "pkg-wedding",
      name: "Wedding Package",
      price: 1200.0,
      duration_minutes: 360,
      deliverables_summary:
        "6 hrs coverage • 100 edited photos • Digital proof gallery",
      description:
        "Full wedding day coverage with professional editing and high-resolution downloads.",
    },
    {
      id: "pkg-portrait",
      name: "Portrait Package",
      price: 350.0,
      duration_minutes: 60,
      deliverables_summary: "1 hr coverage • 15 edited photos • 1 location",
      description:
        "Ideal for headshots, individual portraits, or branding photography.",
    },
    {
      id: "pkg-family",
      name: "Family Session",
      price: 500.0,
      duration_minutes: 120,
      deliverables_summary:
        "2 hrs coverage • 35 edited photos • Group & individual poses",
      description:
        "Outdoor or studio family session tailored for print and holiday cards.",
    },
  ];

  const list = packages.length > 0 ? packages : defaultPackages;

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-stone-800">
        Select Photography Package
      </label>

      {/* Select Dropdown */}
      <select
        value={selectedPackage?.id || list[0]?.id}
        onChange={(e) => {
          const pkg = list.find((p) => p.id === e.target.value);
          if (pkg) onSelectPackage(pkg);
        }}
        className="w-full border border-stone-300 p-2.5 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A059] shadow-sm font-medium"
      >
        {list.map((pkg) => (
          <option key={pkg.id} value={pkg.id}>
            {pkg.name} (${pkg.price.toFixed(2)}) — {pkg.duration_minutes / 60}{" "}
            hrs
          </option>
        ))}
      </select>

      {/* Cards View */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
        {list.map((pkg) => {
          const isSelected = selectedPackage?.id === pkg.id;
          return (
            <div
              key={pkg.id}
              onClick={() => onSelectPackage(pkg)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? "border-[#C5A059] bg-amber-50/60 ring-2 ring-[#C5A059] shadow-md"
                  : "border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-serif font-bold text-stone-900 text-base">
                  {pkg.name}
                </h4>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-[#C5A059] text-white flex items-center justify-center text-xs">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>
              <p className="text-xl font-bold text-[#775A19] mb-2">
                ${pkg.price.toFixed(2)}
              </p>
              <div className="flex items-center text-xs text-stone-500 mb-1">
                <Clock className="w-3.5 h-3.5 mr-1" />
                <span>{pkg.duration_minutes} minutes</span>
              </div>
              <p className="text-xs text-stone-600 line-clamp-2 mt-2 font-medium">
                {pkg.deliverables_summary || pkg.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
