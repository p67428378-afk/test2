import React, { useState } from "react";
import PremiumForm from "../components/PremiumForm/PremiumForm";
import PremiumDisplay from "../components/PremiumDisplay/PremiumDisplay";
import { calculatePremium } from "../services/api";

const PremiumCalculatorPage = () => {
  const [premium, setPremium] = useState(null);
  const [error, setError] = useState(null);

  const handleCalculate = async (formData) => {
    try {
      const data = await calculatePremium(formData);
      setPremium(data);
      setError(null);
    } catch (err) {
      setError("Failed to calculate premium. Please try again.");
      setPremium(null);
    }
  };

  return (
    <main className="flex-grow hero-gradient">
      <div className="max-w-[1440px] mx-auto px-lg py-xl grid grid-cols-12 gap-xl">
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-xl">
          <header>
            <h1 className="font-headline-md text-headline-md text-on-surface">
              Calculate Your Premium
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">
              Complete the details below to generate a real-time insurance quote
              based on your profile.
            </p>
          </header>
          <PremiumForm onCalculate={handleCalculate} />
        </div>
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-xl">
          <header>
            <h2 className="font-headline-md text-headline-md text-on-surface">
              Your Estimated Premium
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">
              Breakdown of your calculated annual insurance rate.
            </p>
          </header>
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              {error}
            </div>
          )}
          <PremiumDisplay premium={premium} />
        </div>
      </div>
    </main>
  );
};

export default PremiumCalculatorPage;
