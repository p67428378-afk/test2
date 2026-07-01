import React from "react";
import { CheckCircle2 } from "lucide-react";

export default function StepTracker({ steps, currentStep, onStepClick }) {
  return (
    <div className="flex justify-between items-center max-w-md mx-auto mb-8">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <React.Fragment key={step.id}>
            <div
              className="flex flex-col items-center cursor-pointer group"
              onClick={() => onStepClick(index)}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCompleted
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : isActive
                      ? "bg-primary border-primary text-white scale-110 shadow-md"
                      : "bg-white border-slate-300 text-slate-400 group-hover:border-slate-400"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <span className="font-bold text-sm">{index + 1}</span>
                )}
              </div>
              <span
                className={`text-xs font-bold mt-1 ${isActive ? "text-primary" : "text-slate-500"}`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-grow h-1 mx-2 rounded transition-colors ${
                  index < currentStep ? "bg-emerald-500" : "bg-slate-200"
                }`}
              ></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
