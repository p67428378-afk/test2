import React, { useState } from "react";
import { updateTicketStatus } from "../../services/api";
import {
  User,
  Tag,
  Clock,
  Monitor,
  Play,
  Check,
  X,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function AgentQueueTable({ tickets = [], onRefresh }) {
  const [updatingId, setUpdatingId] = useState(null);
  const [counterInputs, setCounterInputs] = useState({});
  const [error, setError] = useState(null);

  const handleStatusChange = async (ticketId, newStatus) => {
    setUpdatingId(ticketId);
    setError(null);

    const counter = counterInputs[ticketId] || "Counter 1";

    try {
      await updateTicketStatus(ticketId, newStatus, counter);
      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.error("Status update failed:", err);
      const msg =
        err.response?.data?.detail || "Failed to update ticket status.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCounterChange = (ticketId, value) => {
    setCounterInputs((prev) => ({ ...prev, [ticketId]: value }));
  };

  if (!tickets || tickets.length === 0) {
    return (
      <div className="bg-white border border-[#e3e8f0] rounded-xl p-8 text-center text-[#707a8c]">
        <p className="text-base font-medium">
          No tickets match the selected criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl shadow-sm overflow-hidden w-full">
      {error && (
        <div
          role="alert"
          className="m-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f7fafc] border-b border-[#e3e8f0] text-xs font-semibold text-[#707a8c] uppercase tracking-wider">
              <th className="p-4">Ticket #</th>
              <th className="p-4">Customer Name</th>
              <th className="p-4">Service Category</th>
              <th className="p-4">Current Status</th>
              <th className="p-4">Line Position</th>
              <th className="p-4">Assigned Counter</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e3e8f0] text-sm text-[#171c29]">
            {tickets.map((t) => {
              const isUpdating = updatingId === t.ticket_id;

              return (
                <tr
                  key={t.ticket_id}
                  className="hover:bg-[#f2f5fa] transition-colors"
                >
                  <td className="p-4 font-extrabold text-[#2663eb]">
                    {t.ticket_number}
                  </td>
                  <td className="p-4 font-medium flex items-center gap-2">
                    <User className="w-4 h-4 text-[#707a8c]" />
                    <span>{t.customer_name}</span>
                  </td>
                  <td className="p-4 text-[#707a8c]">
                    <span className="inline-flex items-center gap-1 bg-gray-100 px-2.5 py-1 rounded-md text-xs font-medium text-gray-700">
                      <Tag className="w-3 h-3" />
                      {t.service_type}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                        t.status === "Waiting"
                          ? "bg-yellow-100 text-yellow-800"
                          : t.status === "In Progress"
                            ? "bg-blue-100 text-blue-800 animate-pulse"
                            : t.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-center sm:text-left">
                    {t.status === "Waiting" ? `#${t.position_in_line}` : "-"}
                  </td>
                  <td className="p-4">
                    {t.status === "Waiting" || t.status === "In Progress" ? (
                      <input
                        type="text"
                        value={
                          counterInputs[t.ticket_id] ??
                          (t.counter_number || "Counter 1")
                        }
                        onChange={(e) =>
                          handleCounterChange(t.ticket_id, e.target.value)
                        }
                        placeholder="e.g. Counter 3"
                        className="bg-[#f2f5fa] border border-[#e3e8f0] rounded px-2 py-1 text-xs w-28 focus:outline-none focus:ring-1 focus:ring-[#2663eb]"
                      />
                    ) : (
                      <span className="text-xs text-[#707a8c]">
                        {t.counter_number || "-"}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {isUpdating ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[#2663eb]" />
                      ) : (
                        <>
                          {t.status === "Waiting" && (
                            <button
                              onClick={() =>
                                handleStatusChange(t.ticket_id, "In Progress")
                              }
                              className="bg-[#2663eb] hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                              title="Call to Counter"
                            >
                              <Play className="w-3 h-3" />
                              <span>Call Next</span>
                            </button>
                          )}

                          {t.status === "In Progress" && (
                            <button
                              onClick={() =>
                                handleStatusChange(t.ticket_id, "Completed")
                              }
                              className="bg-[#17a34a] hover:bg-green-700 text-white text-xs font-medium px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                              title="Complete Service"
                            >
                              <Check className="w-3 h-3" />
                              <span>Complete</span>
                            </button>
                          )}

                          {(t.status === "Waiting" ||
                            t.status === "In Progress") && (
                            <button
                              onClick={() =>
                                handleStatusChange(t.ticket_id, "Cancelled")
                              }
                              className="bg-red-50 hover:bg-red-100 text-[#db2626] text-xs font-medium px-2.5 py-1.5 rounded border border-red-200 transition-colors"
                              title="Cancel Ticket"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
