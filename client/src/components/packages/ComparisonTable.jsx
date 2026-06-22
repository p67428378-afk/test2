import React from "react";
import { Link } from "react-router-dom";

export default function ComparisonTable({ packages, onRemove }) {
  if (packages.length === 0) {
    return (
      <div className="text-center py-12 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm">
        <span className="material-symbols-outlined text-5xl text-outline-variant mb-4">
          compare_arrows
        </span>
        <h3 className="text-lg font-semibold text-on-surface mb-2">
          No packages selected for comparison
        </h3>
        <p className="text-on-surface-variant mb-6">
          Go back to the Explore page and check "Compare" on packages you like.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-primary-container text-on-primary hover:bg-primary-container/90 px-6 py-2.5 rounded-lg font-label-md text-label-md shadow-sm transition-colors"
        >
          Explore Packages
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-outline-variant/30 bg-surface-container-low">
              <th className="p-4 font-label-md text-label-md text-on-surface-variant w-1/4">
                Features
              </th>
              {packages.map((pkg) => (
                <th
                  key={pkg.id}
                  className="p-4 font-label-md text-label-md text-on-surface w-1/4 min-w-[200px] relative"
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-bold text-base block truncate max-w-[180px]">
                      {pkg.name}
                    </span>
                    <button
                      onClick={() => onRemove(pkg.id)}
                      className="text-error hover:bg-error-container/20 p-1 rounded-full transition-colors"
                      title="Remove from comparison"
                    >
                      <span className="material-symbols-outlined text-sm">
                        close
                      </span>
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            <tr>
              <td className="p-4 font-label-md text-label-md text-on-surface-variant font-medium">
                Price
              </td>
              {packages.map((pkg) => (
                <td
                  key={pkg.id}
                  className="p-4 font-headline-md text-headline-md text-primary font-bold"
                >
                  ${pkg.price}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-label-md text-label-md text-on-surface-variant font-medium">
                Destination
              </td>
              {packages.map((pkg) => (
                <td
                  key={pkg.id}
                  className="p-4 font-body-md text-body-md text-on-surface"
                >
                  {pkg.destination}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-label-md text-label-md text-on-surface-variant font-medium">
                Duration
              </td>
              {packages.map((pkg) => (
                <td
                  key={pkg.id}
                  className="p-4 font-body-md text-body-md text-on-surface"
                >
                  {pkg.duration_days} Days
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-label-md text-label-md text-on-surface-variant font-medium">
                Rating
              </td>
              {packages.map((pkg) => (
                <td
                  key={pkg.id}
                  className="p-4 font-body-md text-body-md text-on-surface"
                >
                  <div className="flex items-center gap-1">
                    <span
                      className="material-symbols-outlined text-sm text-primary-container"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span>{pkg.rating}</span>
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-label-md text-label-md text-on-surface-variant font-medium">
                Inclusions
              </td>
              {packages.map((pkg) => (
                <td
                  key={pkg.id}
                  className="p-4 font-body-md text-body-md text-on-surface"
                >
                  <ul className="list-disc list-inside space-y-1">
                    {pkg.inclusions.map((inc, idx) => (
                      <li key={idx} className="truncate">
                        {inc}
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-label-md text-label-md text-on-surface-variant font-medium">
                Actions
              </td>
              {packages.map((pkg) => (
                <td key={pkg.id} className="p-4">
                  <div className="flex flex-col gap-2">
                    <Link
                      to={`/packages/${pkg.id}`}
                      className="text-center bg-surface border border-outline-variant/50 text-primary hover:bg-primary-container/10 py-2 px-4 rounded-lg font-label-md text-label-md transition-colors text-sm font-medium"
                    >
                      View Details
                    </Link>
                    <Link
                      to={`/booking/${pkg.id}`}
                      className="text-center bg-primary-container text-on-primary hover:bg-primary-container/90 py-2 px-4 rounded-lg font-label-md text-label-md transition-colors text-sm font-medium"
                    >
                      Book Now
                    </Link>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
