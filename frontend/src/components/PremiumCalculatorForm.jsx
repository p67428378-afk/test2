import React, { useState } from 'react';
import { calculatePremium } from '../services/api';

const PremiumCalculatorForm = () => {
  const [formData, setFormData] = useState({
    driver_age: 30,
    ncb_years: 5,
    vehicle_make: 'Toyota',
    vehicle_model: 'Camry',
    vehicle_year: 2020,
    vehicle_risk_factor: 1.0,
  });

  const [calculatedPremium, setCalculatedPremium] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCalculatedPremium(null);

    try {
      const data = await calculatePremium(formData);
      setCalculatedPremium(data.calculated_premium);
    } catch (err) {
      setError(err.detail || 'An error occurred');
    }
    setLoading(false);
  };

  return (
    <div className='bg-surface-container-lowest rounded-lg shadow-md overflow-hidden ghost-border'>
      <div className='p-8 md:p-12'>
        <form className='space-y-8' onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8'>
            <div className='flex flex-col space-y-2'>
              <label className='text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label'>Driver Age</label>
              <div className='bg-surface-container-high rounded-lg p-1 ghost-border-focus transition-all duration-300'>
                <input
                  className='w-full bg-transparent border-none focus:ring-0 text-on-surface font-medium px-4 py-3 h-12'
                  placeholder='e.g., 30'
                  type='number'
                  name='driver_age'
                  value={formData.driver_age}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className='flex flex-col space-y-2'>
              <label className='text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label'>Years No Claims Bonus</label>
              <div className='bg-surface-container-high rounded-lg p-1 ghost-border-focus transition-all duration-300'>
                <input
                  className='w-full bg-transparent border-none focus:ring-0 text-on-surface font-medium px-4 py-3 h-12'
                  placeholder='e.g., 5'
                  type='number'
                  name='ncb_years'
                  value={formData.ncb_years}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className='flex flex-col space-y-2'>
              <label className='text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label'>Vehicle Make</label>
              <div className='bg-surface-container-high rounded-lg p-1 ghost-border-focus transition-all duration-300'>
                <input
                  className='w-full bg-transparent border-none focus:ring-0 text-on-surface font-medium px-4 py-3 h-12'
                  placeholder='e.g., Toyota'
                  type='text'
                  name='vehicle_make'
                  value={formData.vehicle_make}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className='flex flex-col space-y-2'>
              <label className='text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label'>Vehicle Model</label>
              <div className='bg-surface-container-high rounded-lg p-1 ghost-border-focus transition-all duration-300'>
                <input
                  className='w-full bg-transparent border-none focus:ring-0 text-on-surface font-medium px-4 py-3 h-12'
                  placeholder='e.g., Camry'
                  type='text'
                  name='vehicle_model'
                  value={formData.vehicle_model}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className='flex flex-col space-y-2'>
              <label className='text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label'>Vehicle Year</label>
              <div className='bg-surface-container-high rounded-lg p-1 ghost-border-focus transition-all duration-300'>
                <input
                  className='w-full bg-transparent border-none focus:ring-0 text-on-surface font-medium px-4 py-3 h-12'
                  placeholder='e.g., 2020'
                  type='number'
                  name='vehicle_year'
                  value={formData.vehicle_year}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className='flex flex-col space-y-2'>
              <label className='text-xs font-bold uppercase tracking-widest text-on-surface-variant font-label'>Vehicle Risk Factor (0.8 - 1.6)</label>
              <div className='bg-surface-container-high rounded-lg p-1 ghost-border-focus transition-all duration-300'>
                <input
                  className='w-full bg-transparent border-none focus:ring-0 text-on-surface font-medium px-4 py-3 h-12'
                  placeholder='e.g., 1.0'
                  step='0.1'
                  type='number'
                  name='vehicle_risk_factor'
                  value={formData.vehicle_risk_factor}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className='pt-8 flex flex-col items-center border-t border-outline-variant/10'>
            <button
              className='bg-primary-gradient hover:opacity-90 text-on-primary font-bold px-12 py-4 rounded-lg shadow-sm transition-all duration-300 active:scale-95 text-lg'
              type='submit'
              disabled={loading}
            >
              {loading ? 'Calculating...' : 'Calculate Premium'}
            </button>
          </div>
        </form>
        {calculatedPremium !== null && (
          <div className='mt-12 text-center bg-surface-container-low rounded-xl p-8 transition-all'>
            <p className='text-on-surface-variant font-label uppercase tracking-[0.2em] text-xs mb-2'>Estimated Annual Premium</p>
            <div className='text-4xl md:text-5xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tighter'>
              ${calculatedPremium.toFixed(2)}
            </div>
            <p className='mt-4 text-xs text-on-surface-variant italic'>
              *Values are estimates based on standard coverage configurations.
            </p>
          </div>
        )}
        {error && (
          <div className='mt-12 text-center bg-error-container rounded-xl p-8 transition-all'>
            <p className='text-on-error-container font-bold'>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PremiumCalculatorForm;
