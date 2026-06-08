import React from 'react';

export default function ProgressStepper({ currentStep }) {
  const steps = [
    { number: 1, label: 'Account Details' },
    { number: 2, label: 'OTP Verification' },
    { number: 3, label: 'Confirmation' }
  ];

  return (
    <div className='flex items-center justify-between mb-xl relative'>
      {/* Track */}
      <div className='absolute top-1/2 left-0 w-full h-[2px] bg-surface-variant -z-10 -translate-y-1/2'></div>
      
      {steps.map((step) => {
        const isActive = currentStep === step.number;
        const isCompleted = currentStep > step.number;
        
        return (
          <div key={step.number} className='flex flex-col items-center bg-surface-container-lowest px-2 relative'>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 border-2 ${
              isActive 
                ? 'bg-surface-container-lowest border-[#0F172A]' 
                : isCompleted 
                  ? 'bg-[#0F172A] border-[#0F172A]' 
                  : 'bg-surface-variant border-surface-variant'
            }`}>
              {isCompleted ? (
                <span className='material-symbols-outlined text-on-primary text-[16px]'>check</span>
              ) : (
                <span className={`font-label-sm text-label-sm ${isActive ? 'text-[#0F172A]' : 'text-on-surface-variant'}`}>
                  {step.number}
                </span>
              )}
            </div>
            <span className={`font-label-sm text-label-sm ${isActive || isCompleted ? 'text-[#0F172A]' : 'text-on-surface-variant opacity-70'}`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
