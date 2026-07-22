import React from "react";
import { Edit2, Trash2, Eye, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ComponentsTable({
  components = [],
  onEdit,
  onDelete,
  onViewDetails,
  userRole,
}) {
  const canModify = userRole === "Engineer" || userRole === "Admin";

  return (
    <div className="bg-[#1b2120] border border-[#3d4947] rounded-lg overflow-hidden">
      <div className="p-5 border-b border-[#3d4947] bg-[#1b2120]/50 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[#dee4e1]">
          Spacecraft Components
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0a0f0e]/50 border-b border-[#3d4947]">
              <th className="p-4 text-xs font-semibold text-[#bcc9c6] uppercase tracking-wider font-mono">
                Name
              </th>
              <th className="p-4 text-xs font-semibold text-[#bcc9c6] uppercase tracking-wider font-mono">
                Location
              </th>
              <th className="p-4 text-xs font-semibold text-[#bcc9c6] uppercase tracking-wider font-mono">
                Status
              </th>
              <th className="p-4 text-xs font-semibold text-[#bcc9c6] uppercase tracking-wider font-mono">
                Inventory
              </th>
              <th className="p-4 text-xs font-semibold text-[#bcc9c6] uppercase tracking-wider font-mono">
                Next Inspection
              </th>
              <th className="p-4 text-xs font-semibold text-[#bcc9c6] uppercase tracking-wider font-mono">
                Next Calibration
              </th>
              <th className="p-4 text-xs font-semibold text-[#bcc9c6] uppercase tracking-wider font-mono">
                Review Status
              </th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-[#3d4947]/50">
            {components.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-8 text-center text-[#bcc9c6]">
                  No components found.
                </td>
              </tr>
            ) : (
              components.map((component) => (
                <tr
                  key={component.id}
                  className="hover:bg-[#303635] transition-colors group"
                >
                  <td className="p-4 font-medium text-[#dee4e1]">
                    <div>
                      <div className="text-base font-semibold">
                        {component.name}
                      </div>
                      {component.description && (
                        <div className="text-xs text-[#bcc9c6] line-clamp-1">
                          {component.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-[#bcc9c6] font-mono">
                    {component.location}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        component.status === "Available"
                          ? "bg-[#6bd8cb]/10 text-[#6bd8cb] border-[#6bd8cb]/20"
                          : component.status === "Maintenance"
                            ? "bg-[#d27956]/10 text-[#d27956] border-[#d27956]/20"
                            : "bg-[#ffb4ab]/10 text-[#ffb4ab] border-[#ffb4ab]/20"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          component.status === "Available"
                            ? "bg-[#6bd8cb]"
                            : component.status === "Maintenance"
                              ? "bg-[#d27956]"
                              : "bg-[#ffb4ab]"
                        }`}
                      ></span>
                      {component.status}
                    </span>
                  </td>
                  <td className="p-4 text-[#dee4e1] font-mono">
                    {component.inventory_count}
                  </td>
                  <td className="p-4 text-[#bcc9c6] font-mono">
                    {component.next_inspection || "N/A"}
                  </td>
                  <td className="p-4 text-[#bcc9c6] font-mono">
                    {component.next_calibration || "N/A"}
                  </td>
                  <td className="p-4">
                    {component.flagged_for_review ? (
                      <span className="inline-flex items-center gap-1 text-xs text-[#ffb4ab] bg-[#ffb4ab]/10 px-2 py-1 rounded border border-[#ffb4ab]/20">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {component.supervisor_approved
                          ? "Approved"
                          : "Pending Review"}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-[#6bd8cb] bg-[#6bd8cb]/10 px-2 py-1 rounded border border-[#6bd8cb]/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Clear
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onViewDetails(component)}
                        className="text-[#bcc9c6] hover:text-[#6bd8cb] p-1 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {canModify && (
                        <>
                          <button
                            onClick={() => onEdit(component)}
                            className="text-[#bcc9c6] hover:text-[#7bd0ff] p-1 rounded transition-colors"
                            title="Edit Component"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete(component.id)}
                            className="text-[#bcc9c6] hover:text-[#ffb4ab] p-1 rounded transition-colors"
                            title="Delete Component"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
