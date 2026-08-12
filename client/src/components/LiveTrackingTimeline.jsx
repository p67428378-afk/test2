import React from "react";
import {
  Check,
  Clock,
  AlertTriangle,
  WashingMachine,
  Shirt,
  Sparkles,
  Truck,
  PackageCheck,
  Flame,
} from "lucide-react";

const STAGES = [
  { key: "SCHEDULED_FOR_PICKUP", label: "Scheduled", icon: Clock },
  { key: "Received", label: "Received", icon: PackageCheck },
  { key: "Sorting", label: "Sorting", icon: Sparkles },
  { key: "Washing", label: "Washing", icon: WashingMachine },
  { key: "Drying", label: "Drying", icon: Flame },
  { key: "Ironing", label: "Ironing", icon: Shirt },
  { key: "Ready_for_Delivery", label: "Ready", icon: PackageCheck },
  { key: "Out for Delivery", label: "Out for Delivery", icon: Truck },
];

export default function LiveTrackingTimeline({ order }) {
  if (!order) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center text-slate-500">
        No order selected for live tracking.
      </div>
    );
  }

  const currentStage = order.status || "SCHEDULED_FOR_PICKUP";
  const isSpecial = currentStage === "SPECIAL_PROCESSING";
  const currentStageIndex = STAGES.findIndex((s) => s.key === currentStage);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
            Live Order Tracking
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-1">
            Order #{order.id?.slice(0, 8)}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Service: {order.service_type || "Wash & Fold"}
          </p>
        </div>

        {isSpecial && (
          <div className="mt-3 sm:mt-0 flex items-center space-x-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-2 rounded-lg font-medium">
            <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />
            <span>Special Processing Flagged</span>
          </div>
        )}
      </div>

      <div className="relative py-4">
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[650px] flex items-center justify-between relative">
            <div className="absolute top-5 left-6 right-6 h-1 bg-slate-200 z-0" />

            {STAGES.map((s, idx) => {
              const isCompleted = currentStageIndex > idx;
              const isCurrent =
                currentStageIndex === idx ||
                (idx === 0 && currentStageIndex === -1);
              const Icon = s.icon;

              return (
                <div
                  key={s.key}
                  className="relative z-10 flex flex-col items-center group"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${
                      isCompleted
                        ? "bg-emerald-600 text-white"
                        : isCurrent
                          ? "bg-blue-600 text-white ring-4 ring-blue-100"
                          : "bg-white border-2 border-slate-300 text-slate-400"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={`text-xs font-semibold mt-2 whitespace-nowrap ${
                      isCurrent
                        ? "text-blue-700 font-bold"
                        : isCompleted
                          ? "text-slate-800"
                          : "text-slate-400"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {order.stages && order.stages.length > 0 && (
        <div className="mt-6 border-t border-slate-100 pt-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
            Stage Logs & Updates
          </h4>
          <div className="space-y-2">
            {order.stages.map((stg) => (
              <div
                key={stg.id || stg.timestamp}
                className="flex justify-between items-center text-xs bg-slate-50 p-2.5 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-slate-800">
                    {stg.stage}
                  </span>
                  {stg.notes && (
                    <span className="text-slate-500 italic">({stg.notes})</span>
                  )}
                </div>
                <span className="text-slate-400 font-mono">
                  {stg.timestamp
                    ? new Date(stg.timestamp).toUTCString()
                    : "N/A"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
