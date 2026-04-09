import React from 'react';

const MetricCard = ({ title, value, change, changeType, icon, iconColor, progressBarValue }) => {
  let changeColorClass = '';
  let changeIcon = '';

  if (changeType === 'positive') {
    changeColorClass = 'text-green-600';
    changeIcon = 'trending_up';
  } else if (changeType === 'negative') {
    changeColorClass = 'text-red-600';
    changeIcon = 'trending_down';
  } else if (changeType === 'info') {
    changeColorClass = 'text-amber-600';
    changeIcon = 'info';
  }

  return (
    <div className='bg-surface-container-lowest p-6 rounded-xl ghost-border'>
      <div className='flex justify-between items-start mb-4'>
        <span className='text-[12px] font-bold text-on-surface-variant uppercase tracking-widest headline'>{title}</span>
        <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
      </div>
      <div className='text-4xl font-extrabold text-primary mb-1 headline'>{value}</div>
      {change && (
        <div className={`flex items-center gap-2 text-[12px] font-bold ${changeColorClass}`}>
          {changeIcon && <span className='material-symbols-outlined text-[16px]'>{changeIcon}</span>}
          <span>{change}</span>
        </div>
      )}
      {progressBarValue !== undefined && (
        <div className='w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-4'>
          <div className='bg-green-600 h-full' style={{ width: `${progressBarValue}%` }}></div>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
