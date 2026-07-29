import React from "react";

export default function PlotTable({ plots, onEdit, onDelete, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!plots || plots.length === 0) {
    return (
      <div className="text-center py-12 bg-surface-container-lowest rounded-xl border border-surface-variant">
        <span className="material-symbols-outlined text-4xl text-outline mb-2">
          landscape
        </span>
        <p className="text-on-surface-variant font-medium">No plots found</p>
        <p className="text-outline text-sm">
          Try adjusting your search or filters, or create a new plot.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl soft-loom-shadow border border-surface-variant overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-outline text-xs font-semibold uppercase tracking-wider border-b border-surface-variant">
              <th className="px-6 py-4">Plot ID</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Capacity</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-surface-variant">
            {plots.map((plot) => (
              <tr
                key={plot.id}
                className="hover:bg-surface-bright/50 transition-colors"
              >
                <td className="px-6 py-4 font-mono text-primary-container font-medium">
                  {plot.plot_id}
                </td>
                <td className="px-6 py-4 text-on-surface">
                  {plot.plot_type?.name || "Unknown"}
                </td>
                <td className="px-6 py-4 text-on-surface-variant">
                  Sec {plot.section}, Lot {plot.lot}, P{plot.plot_number}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide ${
                      plot.status === "Available"
                        ? "bg-secondary/10 text-secondary"
                        : plot.status === "Reserved"
                          ? "bg-tertiary-container/10 text-tertiary-container"
                          : "bg-surface-variant text-on-surface-variant"
                    }`}
                  >
                    {plot.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-on-surface">
                  $
                  {plot.price?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="px-6 py-4 text-on-surface-variant">
                  {plot.capacity}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => onEdit(plot)}
                    className="text-primary hover:text-primary-container font-semibold text-xs uppercase tracking-wider transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(plot.id)}
                    className="text-error hover:text-red-700 font-semibold text-xs uppercase tracking-wider transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
