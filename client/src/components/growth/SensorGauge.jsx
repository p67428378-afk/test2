import React from 'react';

export default function SensorGauge({ label, value, unit, icon, colorClass = 'text-primary' }) {
  return (
    <div className='card-level-1 rounded-xl p-5 micro-shadow flex items-center gap-4'>
      <div className={`w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center ${colorClass}`}>
        <span className='material-symbols-outlined text-[28px]'>{icon}</span>
      </div>
      <div>
        <p className='font-label-sm text-on-surface-variant'>{label}</p>
        <p className='font-headline-md text-on-surface font-bold mt-1'>
          {value !== undefined && value !== null ? `${value}${unit}` : '--'}
        </p>
      </div>
    </div>
  );
}