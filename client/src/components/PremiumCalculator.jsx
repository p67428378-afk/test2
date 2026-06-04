import React, { useState } from 'react';
import { calculatePremium } from '../services/api';

const PremiumCalculator = () => {
  const [policyId, setPolicyId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [baseRate, setBaseRate] = useState(500);
  const [ncb, setNcb] = useState(25);
  const [multiplier, setMultiplier] = useState(1.2);
  const [finalPremium, setFinalPremium] = useState(450.00);

  const handleCalculate = async () => {
    try {
      const response = await calculatePremium({
        base_rate: baseRate,
        ncb_percentage: ncb,
        vehicle_multiplier: multiplier,
      });
      setFinalPremium(response.final_premium);
    } catch (error) {
      console.error('Error calculating premium:', error);
    }
  };

  return (
    <div className='md:col-span-8 bg-white p-stack_lg rounded-xl shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_rgba(0,0,0,0.06)] border border-outline-variant'>
      <div className='flex justify-between items-start mb-6'>
        <div>
          <h3 className='font-headline-md text-headline-md text-[#1F2937]'>Premium Calculation</h3>
          <p className='font-body-md text-body-md text-on-surface-variant'>Configure parameters to generate a real-time quote.</p>
        </div>
        <span className='bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full font-label-caps text-label-caps'>LIVE ENGINE</span>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-stack_md mb-8'>
        <div className='space-y-base'>
          <label className='font-label-caps text-label-caps text-on-surface-variant'>Policy ID (Optional)</label>
          <input className='w-full border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 text-body-md' placeholder='POL-8829' type='text' value={policyId} onChange={(e) => setPolicyId(e.target.value)} />
        </div>
        <div className='space-y-base'>
          <label className='font-label-caps text-label-caps text-on-surface-variant'>Customer ID (Optional)</label>
          <input className='w-full border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 text-body-md' placeholder='CUST-441' type='text' value={customerId} onChange={(e) => setCustomerId(e.target.value)} />
        </div>
        <div className='space-y-base'>
          <label className='font-label-caps text-label-caps text-on-surface-variant'>Vehicle ID (Optional)</label>
          <input className='w-full border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 text-body-md' placeholder='VIN-XYZ-90' type='text' value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} />
        </div>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-stack_md mb-8 bg-surface-container-lowest p-stack_md rounded-xl border border-dashed border-outline-variant'>
        <div className='space-y-base'>
          <label className='font-label-caps text-label-caps text-on-surface-variant'>Base Rate ($)</label>
          <div className='relative'>
            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant'>$</span>
            <input className='w-full pl-7 border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 text-body-md font-bold' type='number' value={baseRate} onChange={(e) => setBaseRate(parseFloat(e.target.value))} />
          </div>
        </div>
        <div className='space-y-base'>
          <label className='font-label-caps text-label-caps text-on-surface-variant'>No-Claim Bonus (%)</label>
          <div className='relative'>
            <span className='absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant'>%</span>
            <input className='w-full pr-7 border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 text-body-md font-bold' type='number' value={ncb} onChange={(e) => setNcb(parseFloat(e.target.value))} />
          </div>
        </div>
        <div className='space-y-base'>
          <label className='font-label-caps text-label-caps text-on-surface-variant'>Vehicle Multiplier</label>
          <div className='relative'>
            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant'>x</span>
            <input className='w-full pl-7 border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 text-body-md font-bold' step='0.1' type='number' value={multiplier} onChange={(e) => setMultiplier(parseFloat(e.target.value))} />
          </div>
        </div>
      </div>
      <div className='flex items-center justify-between'>
        <button onClick={handleCalculate} className='bg-[#3B82F6] text-white px-8 py-3 rounded-lg font-title-sm shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-2'>
          <span className='material-symbols-outlined' data-icon='calculate'>calculate</span>
          Calculate Premium
        </button>
        <div className='text-right'>
          <p className='font-label-caps text-label-caps text-on-surface-variant uppercase'>Final Premium</p>
          <p className='font-display-lg text-display-lg text-[#1F2937]'>${finalPremium.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default PremiumCalculator;
