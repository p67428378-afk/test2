import React from 'react';

const OverviewCard = ({ title, value, subtitle, icon, iconBgColor, trend }) => {
  return (
    <div className='bg-surface-container-lowest p-xl rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-sm hover:shadow-md transition-shadow'>
      <div className='flex justify-between items-start'>
        <span className='text-outline font-label-md text-label-md'>{title}</span>
        <span className={`material-icons text-${iconBgColor}`}>{icon}</span>
      </div>
      <div className='flex items-baseline gap-xs'>
        <span className='font-headline-xl text-headline-xl text-on-surface'>{value}</span>
        {trend && <span className='text-secondary font-label-sm text-label-sm'>{trend}</span>}
      </div>
      <div className='text-on-surface-variant font-label-md text-label-md'>{subtitle}</div>
    </div>
  );
};

export default OverviewCard;
