import React from "react";
import { Users, PlayCircle, CheckCircle2, Clock } from "lucide-react";

export default function QueueStatsHeader({ tickets = [] }) {
  const waitingCount = tickets.filter((t) => t.status === "Waiting").length;
  const inProgressCount = tickets.filter(
    (t) => t.status === "In Progress",
  ).length;
  const completedCount = tickets.filter((t) => t.status === "Completed").length;

  // Calculate average wait time (estimated)
  const avgWaitTime = waitingCount > 0 ? Math.round(waitingCount * 5) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-6">
      <div className="bg-white border border-[#e3e8f0] rounded-xl p-4 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-yellow-50 rounded-lg text-yellow-600">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-medium text-[#707a8c] block">
            Waiting in Line
          </span>
          <span className="text-2xl font-bold text-[#171c29]">
            {waitingCount}
          </span>
        </div>
      </div>

      <div className="bg-white border border-[#e3e8f0] rounded-xl p-4 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-blue-50 rounded-lg text-[#2663eb]">
          <PlayCircle className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-medium text-[#707a8c] block">
            Currently Servicing
          </span>
          <span className="text-2xl font-bold text-[#171c29]">
            {inProgressCount}
          </span>
        </div>
      </div>

      <div className="bg-white border border-[#e3e8f0] rounded-xl p-4 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-green-50 rounded-lg text-[#17a34a]">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-medium text-[#707a8c] block">
            Completed Today
          </span>
          <span className="text-2xl font-bold text-[#171c29]">
            {completedCount}
          </span>
        </div>
      </div>

      <div className="bg-white border border-[#e3e8f0] rounded-xl p-4 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-medium text-[#707a8c] block">
            Est. Avg Wait Time
          </span>
          <span className="text-2xl font-bold text-[#171c29]">
            {avgWaitTime} Mins
          </span>
        </div>
      </div>
    </div>
  );
}
