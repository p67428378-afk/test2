import React from "react";
import { CheckCircle2, Circle, MapPin, Calendar } from "lucide-react";

export default function StatusTimeline({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 bg-white rounded-xl border border-gray-200 shadow-sm">
        No tracking history available yet.
      </div>
    );
  }

  // Sort history by timestamp descending to show latest first
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
  );

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-indigo-600" />
        Tracking History
      </h3>

      <div className="relative border-l-2 border-gray-200 ml-4 pl-6 space-y-8">
        {sortedHistory.map((item, idx) => {
          const isLatest = idx === 0;
          return (
            <div key={item.id} className="relative">
              {/* Timeline dot */}
              <span
                className={`absolute -left-[31px] top-0.5 rounded-full p-1 bg-white border-2 ${
                  isLatest
                    ? "border-indigo-600 text-indigo-600"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                {isLatest ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4 fill-current" />
                )}
              </span>

              {/* Content */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4
                    className={`font-bold text-sm uppercase tracking-wider ${isLatest ? "text-indigo-600" : "text-gray-700"}`}
                  >
                    {item.status}
                  </h4>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-800 mt-1 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-gray-400" />
                  {item.location}
                </p>
                {item.notes && (
                  <p className="text-sm text-gray-500 mt-1 bg-gray-50 p-2.5 rounded-lg border border-gray-100 italic">
                    "{item.notes}"
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
