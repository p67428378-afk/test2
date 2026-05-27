import React from 'react';

const DeliveryChannelSelect = ({ value, onChange }) => {
  return (
    <div className='flex flex-col gap-unit'>
      <label className='font-label-md text-label-md text-on-surface-variant' htmlFor='delivery_channel'>
        Delivery Channel
      </label>
      <select
        className='w-full px-4 py-3 rounded-lg border border-outline outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest transition-all appearance-none cursor-pointer'
        id='delivery_channel'
        name='delivery_channel'
        onChange={onChange}
        value={value}
      >
        <option value='SMS'>SMS</option>
        <option value='Email'>Email</option>
      </select>
    </div>
  );
};

export default DeliveryChannelSelect;
