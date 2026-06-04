import React from 'react';

const VehicleMultiplierSlider = ({ value, onChange }) => {
  return (
    <div className='space-y-xs pt-xs'>
      <div className='flex justify-between items-center'>
        <label className='font-label-md text-label-md text-on-surface-variant'>Vehicle Multiplier</label>
        <span className='font-body-md text-body-md font-bold text-primary' id='multiplier-value'>{value}x</span>
      </div>
      <div className='px-xs'>
        <input
          className='w-full custom-slider appearance-none cursor-pointer'
          id='multiplier-slider'
          max='1.6'
          min='0.8'
          step='0.1'
          type='range'
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
        />
        <div className='flex justify-between mt-xs font-label-sm text-label-sm text-outline'>
          <span>0.8x</span>
          <span>1.2x</span>
          <span>1.6x</span>
        </div>
      </div>
    </div>
  );
};

export default VehicleMultiplierSlider;
