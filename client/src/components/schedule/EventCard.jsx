import React from "react";
import { Edit2, Trash2, FileText, CheckSquare, Square } from "lucide-react";

export default function EventCard({
  event,
  onEdit,
  onDelete,
  onToggleCompletion,
}) {
  // Format time from HH:MM:SS to HH:MM
  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    return timeStr.substring(0, 5);
  };

  const isCompleted = event.is_completed;

  return (
    <div
      className={`border rounded-lg p-md relative overflow-hidden group transition-all duration-200 ${
        isCompleted
          ? "bg-[#1E293B]/40 border-[#334155]/50 opacity-60 shadow-inner"
          : "bg-[#1E293B] border-[#334155] hover:bg-[#253247]"
      }`}
    >
      <div
        className={`absolute left-0 top-0 bottom-0 w-[4px] ${isCompleted ? "bg-[#475569]" : "bg-[#6366F1]"}`}
      ></div>

      <div className="flex justify-between items-start mb-xs">
        <span
          className={`text-xs font-semibold tracking-wider ${isCompleted ? "text-[#475569]" : "text-[#6366F1]"}`}
        >
          {formatTime(event.start_time)} - {formatTime(event.end_time)}
        </span>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          <button
            onClick={() => onEdit(event)}
            className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
            title="Edit slot"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(event.id)}
            className="text-[#94A3B8] hover:text-[#EF4444] transition-colors"
            title="Delete slot"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="flex items-start gap-2 mb-2">
        <button
          onClick={() => onToggleCompletion(event)}
          className={`mt-0.5 flex-shrink-0 transition-colors ${
            isCompleted
              ? "text-emerald-500 hover:text-emerald-400"
              : "text-[#94A3B8] hover:text-[#6366F1]"
          }`}
          title={isCompleted ? "Mark as active" : "Mark as complete"}
        >
          {isCompleted ? <CheckSquare size={16} /> : <Square size={16} />}
        </button>
        <h4
          className={`text-sm font-semibold text-[#F8FAFC] line-clamp-2 ${isCompleted ? "line-through text-[#64748B]" : ""}`}
        >
          {event.title}
        </h4>
      </div>

      {event.notes && (
        <div className="flex items-start gap-1.5 text-[#94A3B8] text-xs bg-[#0F172A]/60 p-2 rounded border border-[#334155]/50 mt-2">
          <FileText size={12} className="mt-0.5 flex-shrink-0" />
          <span
            className={`line-clamp-3 whitespace-pre-wrap ${isCompleted ? "line-through text-[#475569]" : ""}`}
          >
            {event.notes}
          </span>
        </div>
      )}
    </div>
  );
}
