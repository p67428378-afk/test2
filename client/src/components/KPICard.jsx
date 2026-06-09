import React from 'react';

export default function KPICard({ title, value, change, changeType, subtitle, progress }) {
  const isPositive = changeType === 'up';
  const isNegative = changeType === 'down';

  return (
    <div className='glass-card rounded-xl p-5 hover:border-l-2 hover:border-l-amber-400 transition-all group bg-white'>
      <h3 className='text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2'>{title}</h3>
      <div className='flex items-end justify-between'>
        <p className='text-3xl font-bold text-slate-900 leading-none'>{value}</p>
      </div>
      {change && (
        <div className={`mt-3 flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded w-max ${
          isPositive ? 'text-emerald-700 bg-emerald-50' : isNegative ? 'text-amber-700 bg-amber-50' : 'text-slate-700 bg-slate-50'
        }`}>
          <span className='material-symbols-outlined text-[16px]'>
            {isPositive ? 'arrow_upward' : isNegative ? 'arrow_downward' : 'remove'}
          </span>
          {change} <span className='text-slate-400 font-normal ml-1'>{subtitle}</span>
        </div>
      )}
      {progress !== undefined && (
        <div className='mt-3'>
          <div className='w-full bg-slate-100 rounded-full h-1.5 overflow-hidden'>
            <div className='bg-slate-600 h-1.5 rounded-full' style={{ width: `${progress}%` }}></div>
          </div>
          <p className='text-xs text-slate-500 mt-2 text-right'>{progress}% utilization</p>
        </div>
      )}
    </div>
  );
}
