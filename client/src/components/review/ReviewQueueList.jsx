import React from "react";
import { Clock, User, Calendar, ArrowRight, CheckSquare } from "lucide-react";

export function ReviewQueueList({
  queue = [],
  selectedNoteId,
  onSelectNote,
  isLoading = false,
}) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-slate-500 text-xs">
        Loading review queue...
      </div>
    );
  }

  if (queue.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-2">
        <CheckSquare className="h-8 w-8 text-emerald-500 mx-auto opacity-70" />
        <h4 className="font-bold text-slate-800 text-sm">Review Queue Empty</h4>
        <p className="text-xs text-slate-500">
          All submitted technical research notes have been reviewed by experts!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
          <Clock className="h-4 w-4 text-amber-500" />
          <span>Pending Submissions Queue</span>
        </div>
        <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">
          {queue.length} Pending
        </span>
      </div>

      <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
        {queue.map((item) => {
          const isSelected = selectedNoteId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectNote(item)}
              className={`w-full text-left p-4 transition flex items-start justify-between ${
                isSelected
                  ? "bg-emerald-50/80 border-l-4 border-emerald-600"
                  : "hover:bg-slate-50 border-l-4 border-transparent"
              }`}
            >
              <div className="space-y-1.5 pr-2">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-semibold rounded">
                    {item.category || "General"}
                  </span>
                  <span className="text-[10px] text-amber-600 font-semibold flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>Awaiting SME</span>
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {item.body}
                </p>

                <div className="flex items-center space-x-3 text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>
                      Author ID:{" "}
                      {item.author_id
                        ? item.author_id.substring(0, 8)
                        : "Employee"}
                    </span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(
                        item.created_at || Date.now(),
                      ).toLocaleDateString()}
                    </span>
                  </span>
                </div>
              </div>

              <ArrowRight
                className={`h-4 w-4 mt-1 flex-shrink-0 ${isSelected ? "text-emerald-600" : "text-slate-300"}`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ReviewQueueList;
