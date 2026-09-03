import React from "react";
import { PlusCircle } from "lucide-react";

export default function AddonCheckboxGroup({
  addons = [],
  selectedAddons = [],
  onToggleAddon,
}) {
  const defaultAddons = [
    {
      id: "addon-drone",
      name: "Drone Aerial Photography",
      price: 250.0,
      description: "4K aerial photos and video clips of event venue.",
    },
    {
      id: "addon-express",
      name: "Express 48-Hour Proofing Delivery",
      price: 150.0,
      description:
        "Expedited photo editing and digital delivery within 48 hours.",
    },
    {
      id: "addon-album",
      name: "Hardcover Deluxe Photo Album",
      price: 300.0,
      description: "Flush-mount 20-page hardcover leather album.",
    },
  ];

  const list = addons.length > 0 ? addons : defaultAddons;

  return (
    <div className="mt-6 border-t border-stone-200 pt-4">
      <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5 mb-3">
        <PlusCircle className="w-4 h-4 text-[#C5A059]" />
        Customize Add-ons & Extras
      </h3>
      <div className="space-y-2.5">
        {list.map((addon) => {
          const isChecked = selectedAddons.some((a) => a.id === addon.id);
          return (
            <label
              key={addon.id}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                isChecked
                  ? "bg-amber-50/80 border-amber-300"
                  : "bg-white border-stone-200 hover:bg-stone-50"
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggleAddon(addon)}
                className="mt-1 rounded text-[#C5A059] focus:ring-[#C5A059] h-4 w-4"
              />
              <div className="flex-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-stone-900 text-sm">
                    {addon.name}
                  </span>
                  <span className="font-bold text-[#775A19] text-sm">
                    +${addon.price.toFixed(2)}
                  </span>
                </div>
                {addon.description && (
                  <p className="text-stone-500 mt-0.5">{addon.description}</p>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
