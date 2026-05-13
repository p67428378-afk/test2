import React from 'react';

const SummaryCard = ({ title, value, icon }) => {
  return (
    <div className='bg-white p-6 rounded-lg shadow-md'>
      <div className='flex items-center'>
        {icon && <div className='mr-4'>{icon}</div>}
        <div>
          <p className='text-sm font-medium text-gray-500'>{title}</p>
          <p className='text-2xl font-bold text-gray-800'>{value}</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
