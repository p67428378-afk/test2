import React from "react";
import { Edit2, Trash2, MapPin, FileText } from "lucide-react";

export default function EventCard({ event, onEdit, onDelete }) {
  // Format time from HH:MM:SS to HH:MM
  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    return timeStr.substring(0, 5);
  };

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-md relative overflow-hidden group transition-colors hover:bg-[#253247]">
      <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#6366F1]"></div>

      <div className="flex justify-between items-start mb-xs">
        <span className="text-xs font-semibold text-[#6366F1] tracking-wider">
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

      <h4 className="text-sm font-semibold text-[#F8FAFC] mb-2 line-clamp-2">
        {event.title}
      </h4>

      {event.notes && (
        <div className="flex items-start gap-1.5 text-[#94A3B8] text-xs bg-[#0F172A] p-2 rounded border border-[#334155] mt-2">
          <FileText size={12} className="mt-0.5 flex-shrink-0" />
          <span className="line-clamp-3 whitespace-pre-wrap">
            {event.notes}
          </span>
        </div>
      )}
    </div>
  );
}
