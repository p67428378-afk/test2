import React from 'react';

const ThresholdInput = ({ value, onChange }) => {
  return (
    <div className='flex flex-col gap-unit'>
      <label className='font-label-md text-label-md text-on-surface-variant' htmlFor='threshold_amount'>
        Threshold Amount
      </label>
      <div className='relative'>
        <span className='absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant'>$</span>
        <input
          className='w-full pl-8 pr-4 py-3 rounded-lg border border-outline outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest transition-all'
          id='threshold_amount'
          max='10000'
          min='100'
          name='threshold_amount'
          onChange={onChange}
          placeholder='e.g., 500.00'
          step='0.01'
          type='number'
          value={value}
        />
      </div>
      <p className='text-on-surface-variant font-label-sm text-label-sm'>Valid range: 100.00 - 10,000.00</p>
    </div>
  );
};

export default ThresholdInput;
