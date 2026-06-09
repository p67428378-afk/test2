import React from 'react';
import HistoryList from './HistoryList.jsx';

export default function HistoryCard({ calculations, onClear }) {
  return (
    <div className='calc-card w-full max-w-container-width shrink-0 flex flex-col h-[600px] mx-auto xl:mx-0'>
      <div className='flex justify-between items-center mb-6 pb-4 border-b border-outline-variant'>
        <h2 className='font-label-md text-label-md flex items-center gap-2 text-on-surface'>
          <span className='material-symbols-outlined text-on-surface-variant'>history</span>
          Recent Calculations
        </h2>
        {calculations && calculations.length > 0 && (
          <button
            className='text-on-surface-variant hover:text-error transition-colors font-body-sm text-body-sm'
            onClick={onClear}
          >
            Clear
          </button>
        )}
      </div>
      <HistoryList calculations={calculations} />
    </div>
  );
}