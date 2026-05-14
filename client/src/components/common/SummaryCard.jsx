import React from 'react';

const SummaryCard = ({ title, value, icon }) => {
  return (
    <div className='bg-white p-4 rounded-lg shadow-md flex items-center'>
      <div className='p-3 bg-green-500 text-white rounded-full'>
        {icon}
      </div>
      <div className='ml-4'>
        <p className='text-sm text-gray-500'>{title}</p>
        <p className='text-2xl font-bold text-gray-800'>{value}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
