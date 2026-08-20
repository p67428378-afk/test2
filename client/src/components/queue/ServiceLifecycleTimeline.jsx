import React from "react";
import { CheckCircle2, Clock, PlayCircle, Check, XCircle } from "lucide-react";

const STEPS = [
  {
    key: "Waiting",
    label: "Joined Queue",
    desc: "Ticket generated & waiting in line",
  },
  {
    key: "In Progress",
    label: "Being Served",
    desc: "Called to service counter",
  },
  { key: "Completed", label: "Completed", desc: "Service session finished" },
];

export default function ServiceLifecycleTimeline({ currentStatus }) {
  if (currentStatus === "Cancelled") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center text-red-700">
        <div className="flex items-center justify-center gap-2 font-bold mb-1">
          <XCircle className="w-5 h-5 text-red-600" />
          <span>Ticket Cancelled</span>
        </div>
        <p className="text-xs text-red-600">
          This queue ticket has been cancelled and is no longer active.
        </p>
      </div>
    );
  }

  const getStepIndex = (status) => {
    switch (status) {
      case "Waiting":
        return 0;
      case "In Progress":
        return 1;
      case "Completed":
        return 2;
      default:
        return 0;
    }
  };

  const activeIndex = getStepIndex(currentStatus);

  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm w-full max-w-xl mx-auto">
      <h4 className="text-sm font-bold text-[#171c29] uppercase tracking-wider mb-4">
        Service Status Progression
      </h4>
      <div className="relative flex items-center justify-between">
        {/* Connecting Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[#e3e8f0] z-0" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#2663eb] transition-all duration-500 z-0"
          style={{ width: `${(activeIndex / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((step, idx) => {
          const isDone = idx < activeIndex;
          const isCurrent = idx === activeIndex;

          return (
            <div
              key={step.key}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
                  isDone
                    ? "bg-[#17a34a] border-[#17a34a] text-white"
                    : isCurrent
                      ? "bg-[#2663eb] border-[#2663eb] text-white shadow-lg scale-110"
                      : "bg-white border-[#e3e8f0] text-[#707a8c]"
                }`}
              >
                {isDone ? (
                  <Check className="w-5 h-5" />
                ) : isCurrent ? (
                  <Clock className="w-5 h-5 animate-pulse" />
                ) : (
                  idx + 1
                )}
              </div>
              <span
                className={`text-xs font-semibold mt-2 ${isCurrent ? "text-[#2663eb]" : "text-[#171c29]"}`}
              >
                {step.label}
              </span>
              <span className="text-[10px] text-[#707a8c] max-w-[100px] mt-0.5 hidden sm:block">
                {step.desc}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
