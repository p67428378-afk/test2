import React, { useState } from 'react';
import InputField from './InputField';
import InputSlider from './InputSlider';
import Button from './Button';
import { calculatePremium } from '../services/api';

const PremiumForm = ({ setPremiumResult }) => {
  const [baseRate, setBaseRate] = useState(500);
  const [ncbPercentage, setNcbPercentage] = useState(20);
  const [vehicleMultiplier, setVehicleMultiplier] = useState(0.8);
  const [isLoading, setIsLoading] = useState(false);

  const handleCalculate = async () => {
    setIsLoading(true);
    try {
      const data = {
        base_rate: parseFloat(baseRate),
        ncb_percentage: parseFloat(ncbPercentage),
        vehicle_multiplier: parseFloat(vehicleMultiplier),
      };
      const result = await calculatePremium(data);
      setPremiumResult(result.calculated_premium);
    } catch (error) {
      // Handle error appropriately in a real app
      console.error("Calculation failed", error);
    }
    setIsLoading(false);
  };

  return (
    <section className="md:col-span-8 bg-white rounded-lg shadow-md p-8">
      <div className="space-y-xl">
        <InputField
          id="base-rate"
          label="Base Rate"
          value={baseRate}
          onChange={(e) => setBaseRate(e.target.value)}
          symbol="$"
          placeholder="500"
        />
        <InputSlider
          id="ncb-slider"
          label="No-Claim Bonus (NCB) Percentage"
          min="0"
          max="50"
          step="5"
          value={ncbPercentage}
          onChange={(e) => setNcbPercentage(e.target.value)}
          displayValue={`${ncbPercentage}%`}
        />
        <InputSlider
          id="multiplier-slider"
          label="Vehicle Multiplier"
          min="0.8"
          max="1.6"
          step="0.1"
          value={vehicleMultiplier}
          onChange={(e) => setVehicleMultiplier(e.target.value)}
          displayValue={`${parseFloat(vehicleMultiplier).toFixed(1)}x`}
        />
        <Button onClick={handleCalculate} disabled={isLoading}>
          {isLoading ? 'Calculating...' : 
            <>
              <span className="material-symbols-outlined">calculate</span>
              Calculate Premium
            </>
          }
        </Button>
      </div>
    </section>
  );
};

export default PremiumForm;
