import React, { useState } from 'react';

const vehicleTypeMultipliers = {
  sedan: 1.0,
  suv: 1.2,
  hatchback: 0.9,
  truck: 1.5,
  sportscar: 2.2,
};

const CalculatorForm = ({ onCalculate }) => {
  const [vehicleValue, setVehicleValue] = useState('');
  const [ncbPercentage, setNcbPercentage] = useState(20);
  const [vehicleType, setVehicleType] = useState('sedan');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!vehicleValue || vehicleValue <= 0) {
      alert('Please enter a valid vehicle value.');
      return;
    }

    onCalculate({
      vehicle_value: parseFloat(vehicleValue),
      ncb_percentage: ncbPercentage,
      vehicle_multiplier: vehicleTypeMultipliers[vehicleType],
    });
  };

  return (
    <form className="space-y-stack-gap" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-label-sm font-label-sm text-on-surface-variant" htmlFor="vehicleValue">Vehicle Value ($)</label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">attach_money</span>
          <input
            className="w-full pl-10 pr-4 py-3 bg-surface border border-outline-variant rounded focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-body-md outline-none"
            id="vehicleValue"
            placeholder="e.g., 25000"
            required
            type="number"
            value={vehicleValue}
            onChange={(e) => setVehicleValue(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-label-sm font-label-sm text-on-surface-variant">No Claims Bonus (NCB)</label>
          <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-caption font-bold">{ncbPercentage}%</span>
        </div>
        <div className="relative pt-2">
          <input
            className="w-full h-1 bg-surface-variant rounded-full appearance-none cursor-pointer accent-primary"
            id="ncbSlider"
            max="50"
            min="20"
            type="range"
            value={ncbPercentage}
            onChange={(e) => setNcbPercentage(parseInt(e.target.value, 10))}
          />
          <div className="flex justify-between mt-2 text-caption text-outline">
            <span>20%</span>
            <span>50%</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-label-sm font-label-sm text-on-surface-variant" htmlFor="vehicleType">Vehicle Type</label>
        <div className="relative">
          <select
            className="w-full px-4 py-3 bg-surface border border-outline-variant rounded appearance-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-body-md outline-none"
            id="vehicleType"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
          >
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="hatchback">Hatchback</option>
            <option value="truck">Truck</option>
            <option value="sportscar">Sports Car</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
        </div>
      </div>

      <button
        className="w-full bg-primary text-on-primary py-4 rounded font-bold text-body-md shadow-lg hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        type="submit"
      >
        Calculate Premium
      </button>
    </form>
  );
};

export default CalculatorForm;
