import React from "react";
import { MapPin, Trash2, Globe, Layers, Navigation } from "lucide-react";

export default function SiteTable({
  sites = [],
  loading,
  onDeleteSite,
  onSelectSite,
}) {
  if (loading) {
    return (
      <div className="bg-white p-8 rounded-lg border border-stone-200 text-center text-stone-500">
        Loading excavation sites...
      </div>
    );
  }

  if (sites.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg border border-stone-200 text-center text-stone-500">
        No excavation sites found matching criteria.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-stone-200">
          <thead className="bg-stone-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                Site Code / Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                Region & Period
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                GPS Location
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                Altitude
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 bg-white text-sm">
            {sites.map((site) => (
              <tr key={site.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-bold text-stone-900">{site.name}</div>
                  <div className="text-xs font-mono text-amber-800 bg-amber-50 inline-block px-1.5 py-0.5 rounded mt-0.5">
                    {site.site_code}
                  </div>
                  {site.description && (
                    <p className="text-xs text-stone-500 line-clamp-1 mt-1">
                      {site.description}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-1 text-stone-800">
                    <Globe className="w-3.5 h-3.5 text-stone-400" />
                    <span>{site.region}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-stone-500 text-xs mt-0.5">
                    <Layers className="w-3.5 h-3.5 text-stone-400" />
                    <span>{site.historical_period}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-1 font-mono text-xs text-stone-700 bg-stone-100 px-2 py-1 rounded w-fit">
                    <Navigation className="w-3 h-3 text-amber-800 shrink-0" />
                    <span>
                      {site.latitude.toFixed(4)}°, {site.longitude.toFixed(4)}°
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-stone-700 font-mono text-xs">
                  {site.altitude_meters !== null &&
                  site.altitude_meters !== undefined
                    ? `${site.altitude_meters} m`
                    : "N/A"}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  {onSelectSite && (
                    <button
                      onClick={() => onSelectSite(site)}
                      className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded text-xs font-medium hover:bg-amber-100 transition"
                    >
                      View
                    </button>
                  )}
                  {onDeleteSite && (
                    <button
                      onClick={() => onDeleteSite(site.id)}
                      title="Delete Site"
                      className="p-1 text-stone-400 hover:text-red-600 rounded transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
