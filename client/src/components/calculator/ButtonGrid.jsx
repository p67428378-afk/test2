import React from 'react';

export default function ButtonGrid({ onButtonClick }) {
  const buttons = [
    { label: 'C', type: 'danger', value: 'C' },
    { label: '+/-', type: 'secondary', value: '+/-' },
    { label: '%', type: 'secondary', value: '%' },
    { label: 'devices', type: 'operator', value: '/' }, // Division
    { label: '7', type: 'number', value: '7' },
    { label: '8', type: 'number', value: '8' },
    { label: '9', type: 'number', value: '9' },
    { label: 'close', type: 'operator', value: '*' }, // Multiplication
    { label: '4', type: 'number', value: '4' },
    { label: '5', type: 'number', value: '5' },
    { label: '6', type: 'number', value: '6' },
    { label: 'remove', type: 'operator', value: '-' }, // Subtraction
    { label: '1', type: 'number', value: '1' },
    { label: '2', type: 'number', value: '2' },
    { label: '3', type: 'number', value: '3' },
    { label: 'add', type: 'operator', value: '+' }, // Addition
    { label: '0', type: 'number', value: '0', colSpan: 2 },
    { label: '.', type: 'number', value: '.' },
    { label: 'equal', type: 'primary', value: '=' }, // Equals
  ];

  return (
    <div className='grid grid-cols-4 gap-grid-gap'>
      {buttons.map((btn, idx) => {
        let btnClass = 'calc-btn';
        if (btn.type === 'danger') {
          btnClass += ' calc-btn-danger';
        } else if (btn.type === 'operator') {
          btnClass += ' calc-btn-operator';
        } else if (btn.type === 'primary') {
          btnClass += ' calc-btn-primary';
        } else if (btn.type === 'secondary') {
          btnClass += ' text-on-surface-variant';
        }
        if (btn.colSpan) {
          btnClass += ` col-span-${btn.colSpan}`;
        }

        const isIcon = ['devices', 'close', 'remove', 'add', 'equal'].includes(btn.label);

        return (
          <button
            key={idx}
            className={btnClass}
            onClick={() => onButtonClick(btn.value)}
          >
            {isIcon ? (
              <span className='material-symbols-outlined font-bold'>{btn.label}</span>
            ) : (
              btn.label
            )}
          </button>
        );
      })}
    </div>
  );
}