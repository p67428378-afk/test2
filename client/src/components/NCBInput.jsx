import React from 'react';

const NCBInput = ({ value, onChange }) => {
  const handleBlur = (e) => {
    let val = e.target.value.replace('%', '');
    if (isNaN(val) || val === '') val = 30;
    if (val < 20) val = 20;
    if (val > 50) val = 50;
    onChange(val);
  };

  return (
    <div className='space-y-xs'>
      <label className='font-label-md text-label-md text-on-surface-variant' htmlFor='ncb-input'>No-Claim Bonus (NCB) Percentage</label>
      <div className='relative'>
        <input
          className='w-full px-md py-sm bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md focus:ring-2 focus:ring-primary focus:border-primary transition-all'
          id='ncb-input'
          placeholder='20-50%'
          type='text'
          value={`${value}%`}
          onChange={(e) => onChange(e.target.value.replace('%', ''))}
          onBlur={handleBlur}
        />
        <span className='material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-outline' data-icon='percent'>percent</span>
      </div>
    </div>
  );
};

export default NCBInput;
