import React, { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Stepper from "../components/common/Stepper";
import RegistrationForm from "../components/warranty/RegistrationForm";

export default function ProductRegistrationPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const handleStepChange = (step) => {
    setCurrentStep(step);
  };

  return (
    <div className="bg-[#f7fafc] flex flex-col gap-6 items-start p-8 min-h-screen w-full">
      <Navbar />

      <div className="max-w-3xl w-full mx-auto flex flex-col gap-6">
        <Stepper currentStep={currentStep} />
        <RegistrationForm onStepChange={handleStepChange} />
      </div>
    </div>
  );
}
