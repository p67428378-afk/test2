import React from "react";
import { User, Briefcase, GraduationCap, Eye } from "lucide-react";

export default function Stepper({ currentStep, setStep, stepsCompleted = [] }) {
  const steps = [
    { id: 1, label: "Profile", icon: User },
    { id: 2, label: "Experience", icon: Briefcase },
    { id: 3, label: "Education & Skills", icon: GraduationCap },
    { id: 4, label: "Review & Preview", icon: Eye },
  ];

  return (
    <div className="w-full bg-white border border-[#e3e8f0] rounded-xl p-4 shadow-sm mb-6">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCurrent = currentStep === step.id;
          const isCompleted =
            stepsCompleted.includes(step.id) || currentStep > step.id;

          return (
            <React.Fragment key={step.id}>
              <button
                type="button"
                onClick={() => setStep(step.id)}
                className="flex flex-col sm:flex-row items-center gap-2 group cursor-pointer focus:outline-none"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    isCurrent
                      ? "bg-blue-600 text-white ring-4 ring-blue-100 shadow-md"
                      : isCompleted
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xs text-gray-400 font-medium">
                    Step {step.id}
                  </p>
                  <p
                    className={`text-xs sm:text-sm font-semibold transition-colors ${
                      isCurrent
                        ? "text-blue-600"
                        : isCompleted
                          ? "text-gray-800"
                          : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              </button>

              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 sm:mx-4 transition-colors ${
                    currentStep > step.id ? "bg-green-600" : "bg-gray-200"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
