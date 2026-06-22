import React from "react";
import { Link } from "react-router-dom";

export default function PackageCard({ pkg, isCompared, onCompareToggle }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_15px_-3px_rgba(0,0,0,0.1)] transition-shadow duration-300 flex flex-col group">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          alt={pkg.name}
          src={
            pkg.image_url ||
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
          }
        />
        <div className="absolute top-3 right-3 bg-surface-container-lowest/90 backdrop-blur px-2 py-1 rounded border border-outline-variant/20 flex items-center gap-1 shadow-sm">
          <span
            className="material-symbols-outlined text-xs text-primary-container"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
          <span className="font-label-sm text-label-sm text-on-surface">
            {pkg.rating || "5.0"}
          </span>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-headline-md text-headline-md text-on-surface font-semibold text-lg">
            {pkg.name}
          </h3>
        </div>
        <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">
          {pkg.description}
        </p>
        <div className="flex items-center gap-4 mb-4 text-on-surface-variant">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">schedule</span>
            <span className="font-body-md text-body-md">
              {pkg.duration_days} Days
            </span>
          </div>
          {pkg.inclusions && pkg.inclusions.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">
                check_circle
              </span>
              <span className="font-body-md text-body-md truncate max-w-[150px]">
                {pkg.inclusions[0]}
              </span>
            </div>
          )}
        </div>
        <div className="mt-auto pt-4 border-t border-outline-variant/20 flex justify-between items-center">
          <div>
            <span className="font-headline-md text-headline-md text-primary font-bold text-xl">
              ${pkg.price}
            </span>
            <span className="font-body-md text-body-md text-on-surface-variant">
              /person
            </span>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer group/chk">
              <input
                className="form-checkbox h-4 w-4 text-primary rounded border-outline-variant focus:ring-primary focus:ring-offset-0 transition-colors"
                type="checkbox"
                checked={isCompared}
                onChange={() => onCompareToggle(pkg.id)}
              />
              <span className="font-label-sm text-label-sm text-on-surface-variant group-hover/chk:text-on-surface transition-colors">
                Compare
              </span>
            </label>
            <Link
              to={`/packages/${pkg.id}`}
              className="bg-surface border border-outline-variant/50 text-primary hover:bg-primary-container/10 px-4 py-2 rounded-lg font-label-md text-label-md transition-colors text-sm font-medium"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
