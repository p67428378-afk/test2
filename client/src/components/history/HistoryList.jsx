import React from 'react';
import HistoryItem from './HistoryItem.jsx';

export default function HistoryList({ calculations }) {
  if (!calculations || calculations.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center h-full text-on-surface-variant/50 py-8'>
        <span className='material-symbols-outlined text-4xl mb-2'>history</span>
        <p className='text-sm'>No calculations yet</p>
      </div>
    );
  }

  return (
    <div className='flex-grow overflow-y-auto pr-2'>
      {calculations.map((calc) => (
        <HistoryItem key={calc.id} calculation={calc} />
      ))}
    </div>
  );
}