import React from "react";

export default function Stepper({ currentStep }) {
  const steps = [
    { number: 1, label: "Product Info" },
    { number: 2, label: "Warranty Details" },
    { number: 3, label: "Upload Receipt" },
  ];

  return (
    <div className="bg-white border border-[#e3e8f0] flex gap-4 items-center justify-center p-4 rounded-2xl shadow-sm w-full shrink-0">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className="flex gap-2 items-center shrink-0">
            <div
              className={`flex items-center justify-center rounded-full w-6 h-6 shrink-0 ${
                currentStep > step.number
                  ? "bg-[#17a34a]"
                  : currentStep === step.number
                    ? "bg-[#2663eb]"
                    : "bg-[#f2f5fa]"
              }`}
            >
              <p className="font-bold text-xs text-white">
                {currentStep > step.number ? "✓" : step.number}
              </p>
            </div>
            <p
              className={`text-sm ${
                currentStep === step.number
                  ? "font-bold text-[#171c29]"
                  : "font-normal text-[#707a8c]"
              } whitespace-nowrap`}
            >
              {step.label}
            </p>
          </div>
          {index < steps.length - 1 && (
            <p className="font-normal text-[#e3e8f0] text-sm whitespace-nowrap">
              →
            </p>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
