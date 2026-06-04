import React, { useState } from 'react';
import BaseRateDisplay from './BaseRateDisplay';
import NCBInput from './NCBInput';
import VehicleMultiplierSlider from './VehicleMultiplierSlider';
import CalculateButton from './CalculateButton';
import ResultDisplay from './ResultDisplay';
import { calculatePremium } from '../services/api';

const PremiumForm = () => {
  const [ncb, setNcb] = useState(30);
  const [multiplier, setMultiplier] = useState(1.2);
  const [calculatedPremium, setCalculatedPremium] = useState(null);
  const [error, setError] = useState(null);

  const handleCalculate = async () => {
    try {
      const data = {
        ncb_percentage: ncb / 100,
        vehicle_multiplier: multiplier,
      };
      const result = await calculatePremium(data);
      setCalculatedPremium(result.calculated_premium);
      setError(null);
    } catch (err) {
      setError('Failed to calculate premium. Please try again.');
      setCalculatedPremium(null);
    }
  };

  return (
    <div className='space-y-xl'>
      <div className='space-y-sm'>
        <h1 className='font-headline-lg text-headline-lg text-on-surface'>Vehicle Insurance Premium Calculator</h1>
        <BaseRateDisplay />
      </div>
      <div className='grid grid-cols-1 gap-md'>
        <NCBInput value={ncb} onChange={setNcb} />
        <VehicleMultiplierSlider value={multiplier} onChange={setMultiplier} />
      </div>
      <CalculateButton onClick={handleCalculate} />
      {error && <p className="text-red-500">{error}</p>}
      <ResultDisplay premium={calculatedPremium} />
    </div>
  );
};

export default PremiumForm;
