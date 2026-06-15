import React from 'react';

export default function Keypad({ onKeyPress }) {
  const keys = [
    { label: 'C', value: 'C', className: 'text-[#F59E0B] font-semibold bg-surface-container-highest hover:bg-surface-variant' },
    { label: '()', value: '()', className: 'text-on-surface-variant bg-surface-container-highest hover:bg-surface-variant' },
    { label: '%', value: '%', className: 'text-on-surface-variant bg-surface-container-highest hover:bg-surface-variant' },
    { label: '/', value: '/', className: 'text-primary bg-primary-container/20 hover:bg-primary-container/30 border-primary/30' },
    
    { label: '7', value: '7', className: 'text-on-surface bg-surface hover:bg-surface-container' },
    { label: '8', value: '8', className: 'text-on-surface bg-surface hover:bg-surface-container' },
    { label: '9', value: '9', className: 'text-on-surface bg-surface hover:bg-surface-container' },
    { label: '*', value: '*', className: 'text-primary bg-primary-container/20 hover:bg-primary-container/30 border-primary/30' },
    
    { label: '4', value: '4', className: 'text-on-surface bg-surface hover:bg-surface-container' },
    { label: '5', value: '5', className: 'text-on-surface bg-surface hover:bg-surface-container' },
    { label: '6', value: '6', className: 'text-on-surface bg-surface hover:bg-surface-container' },
    { label: '-', value: '-', className: 'text-primary bg-primary-container/20 hover:bg-primary-container/30 border-primary/30' },
    
    { label: '1', value: '1', className: 'text-on-surface bg-surface hover:bg-surface-container' },
    { label: '2', value: '2', className: 'text-on-surface bg-surface hover:bg-surface-container' },
    { label: '3', value: '3', className: 'text-on-surface bg-surface hover:bg-surface-container' },
    { label: '+', value: '+', className: 'text-primary bg-primary-container/20 hover:bg-primary-container/30 border-primary/30' },
    
    { label: '0', value: '0', className: 'text-on-surface bg-surface hover:bg-surface-container col-span-2' },
    { label: '.', value: '.', className: 'text-on-surface bg-surface hover:bg-surface-container' },
    { label: '=', value: '=', className: 'text-secondary-fixed bg-secondary-container/20 hover:bg-secondary-container/30 border-secondary-fixed/30 shadow-[0_0_15px_rgba(78,222,163,0.1)]' },
  ];

  return (
    <div className='grid grid-cols-4 gap-sm p-md bg-surface-container/50'>
      {keys.map((key, index) => (
        <button
          key={index}
          onClick={() => onKeyPress(key.value)}
          className={`calc-key h-16 rounded-lg font-display-sm text-display-sm flex items-center justify-center ${key.className}`}
        >
          {key.label}
        </button>
      ))}
    </div>
  );
}
