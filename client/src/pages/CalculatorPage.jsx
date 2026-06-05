import React, { useState } from 'react';
import CalculatorForm from '../components/calculator/CalculatorForm';
import PremiumResult from '../components/calculator/PremiumResult';
import { calculatePremium } from '../services/api';

const CalculatorPage = () => {
  const [premium, setPremium] = useState(null);
  const [error, setError] = useState(null);

  const handleCalculate = async (formData) => {
    try {
      setError(null);
      const data = await calculatePremium(formData);
      setPremium(data.calculated_premium);
    } catch (err) {
      setError('Failed to calculate premium. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="bg-surface-container-lowest w-full max-w-container-max-width p-padding-card rounded-xl shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1)] border border-outline-variant">
      <h1 className="text-headline-md font-headline-md text-on-surface-variant mb-8">Insurance Premium Calculator</h1>
      <CalculatorForm onCalculate={handleCalculate} />
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <PremiumResult premium={premium} />
    </div>
  );
};

export default CalculatorPage;
