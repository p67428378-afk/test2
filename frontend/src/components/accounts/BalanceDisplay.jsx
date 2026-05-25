import React from 'react';

const BalanceDisplay = ({ currency, balance }) => {
  const formattedBalance = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(balance);

  return (
    <div className='text-2xl font-bold text-center py-4'>
      {formattedBalance}
    </div>
  );
};

export default BalanceDisplay;
