import React from "react";
import { Check } from "lucide-react";

const STAGES = [
  { id: "Draft", label: "Draft", step: 1 },
  { id: "Legal Review", label: "Legal Review", step: 2 },
  { id: "Finance Approval", label: "Finance Approval", step: 3 },
  { id: "Pending Signature", label: "Pending Signature", step: 4 },
  { id: "Executed", label: "Executed", step: 5 },
];

export default function WorkflowStepper({ currentStatus }) {
  const currentStepObj =
    STAGES.find((s) => s.id === currentStatus) || STAGES[0];
  const currentStepNum = currentStepObj.step;
  const isExpired = currentStatus === "Expired";

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Workflow Approval State
        </h3>
        {isExpired ? (
          <span className="px-3 py-1 bg-rose-100 text-rose-800 border border-rose-200 rounded-full text-xs font-semibold">
            Contract Expired
          </span>
        ) : (
          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-full text-xs font-semibold">
            Current Stage: {currentStatus}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between relative w-full pt-2">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-0 h-1 bg-indigo-600 -translate-y-1/2 z-0 transition-all duration-300"
          style={{
            width: `${((Math.max(1, currentStepNum) - 1) / (STAGES.length - 1)) * 100}%`,
          }}
        />

        {STAGES.map((stage) => {
          const isCompleted = stage.step < currentStepNum;
          const isCurrent = stage.step === currentStepNum;

          return (
            <div
              key={stage.id}
              className="relative z-10 flex flex-col items-center group"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                  isCompleted
                    ? "bg-emerald-600 text-white"
                    : isCurrent
                      ? "bg-indigo-600 text-white ring-4 ring-indigo-100"
                      : "bg-white border-2 border-slate-300 text-slate-500"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  stage.step
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium text-center ${
                  isCurrent
                    ? "text-indigo-600 font-bold"
                    : isCompleted
                      ? "text-emerald-700"
                      : "text-slate-400"
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
