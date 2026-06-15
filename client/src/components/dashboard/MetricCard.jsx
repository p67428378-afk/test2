import React from 'react';

const MetricCard = ({ title, value, change, changeType, icon }) => {
  const isPositive = changeType === 'positive';
  const changeColor = isPositive ? 'text-tertiary' : 'text-error';
  const bgColor = isPositive ? 'bg-tertiary-fixed/30' : 'bg-error-container/30';

  return (
    <div className='bg-surface-container-lowest border border-outline-variant p-4 rounded-lg flex flex-col justify-between transition-shadow hover:shadow-md'>
      <div className='flex justify-between items-start mb-2'>
        <span className='font-label-caps text-xs text-on-surface-variant'>{title}</span>
        {change && (
          <span className={`font-bold text-xs ${bgColor} ${changeColor} px-2 py-0.5 rounded-full`}>
            {change}
          </span>
        )}
      </div>
      <div className='flex items-end justify-between'>
        <span className='font-display-lg text-3xl text-on-surface'>{value}</span>
        {icon && <div className='text-primary opacity-20'>{icon}</div>}
      </div>
    </div>
  );
};

export default MetricCard;
