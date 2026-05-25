import React from 'react';

const AccountDetail = ({ label, value }) => {
  return (
    <div className='flex justify-between py-2'>
      <span className='text-gray-500'>{label}</span>
      <span className='font-medium'>{value}</span>
    </div>
  );
};

export default AccountDetail;
