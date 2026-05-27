import React from 'react';

const AccountInput = ({ value, onChange, error }) => {
  return (
    <div className='flex flex-col gap-unit'>
      <label className='font-label-md text-label-md text-on-surface-variant' htmlFor='account_number'>
        Account Number
      </label>
      <input
        className={`w-full px-4 py-3 rounded-lg border ${error ? 'border-error' : 'border-outline'} outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest transition-all`}
        id='account_number'
        name='account_number'
        onChange={onChange}
        onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9]/g, ''))}
        placeholder='Enter your account number'
        type='text'
        value={value}
      />
      {error && <p className='text-error font-label-sm text-label-sm mt-1'>{error}</p>}
    </div>
  );
};

export default AccountInput;
