import React from 'react';

const DisplaySection = ({ history, currentInput }) => {
  return (
    <div className='bg-[#0F172A] rounded-xl p-5 mb-6 text-right shadow-inner flex flex-col justify-end min-h-[100px] relative overflow-hidden'>
      <div className='font-history-item text-history-item text-[#94A3B8] mb-1 min-h-[24px] break-all' data-testid='history-display'>
        {history}
      </div>
      <div className='font-display-result text-display-result text-[#F8FAFC] break-all' data-testid='current-display'>
        {currentInput || '0'}
      </div>
    </div>
  );
};

export default DisplaySection;
