import React from "react";
import { Sun, Droplet, Wind, Plus, Info } from "lucide-react";

export default function SpeciesCard({ species, onAddToGarden }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-gray-900 text-lg leading-tight">
              {species.common_name}
            </h3>
            {species.scientific_name && (
              <p className="text-xs text-gray-500 italic mt-0.5">
                {species.scientific_name}
              </p>
            )}
          </div>
          <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-[#1C8A5C] border border-emerald-100 rounded-full">
            Water: {species.recommended_watering_days || 7}d
          </span>
        </div>

        <p className="text-xs text-gray-600 line-clamp-3 my-3">
          {species.description ||
            "Comprehensive houseplant care guide specifying ideal light, humidity, and moisture requirements for thriving growth."}
        </p>

        <div className="space-y-2 pt-2 border-t border-gray-100 text-xs text-gray-700">
          <div className="flex items-center space-x-2">
            <Sun className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              <strong>Sunlight:</strong> {species.sunlight_requirement}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Wind className="w-4 h-4 text-blue-500 shrink-0" />
            <span>
              <strong>Humidity:</strong> {species.humidity_requirement}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Droplet className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Schedule:</strong> Every{" "}
              {species.recommended_watering_days || 7} days
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-gray-100 flex justify-end">
        <button
          onClick={() => onAddToGarden && onAddToGarden(species)}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#1C8A5C] text-white rounded-lg text-xs font-semibold hover:bg-[#0F4E34] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add to My Garden</span>
        </button>
      </div>
    </div>
  );
}
