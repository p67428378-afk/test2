import React from 'react';

export default function HistorySidebar({ history, onClearHistory, onLoadHistoryItem }) {
  return (
    <div className='w-full md:w-[40%] flex flex-col'>
      <div className='bg-surface-bright border border-outline-variant rounded-xl p-container-padding flex-grow flex flex-col shadow-lg h-[500px] md:h-auto'>
        <h2 className='font-button-label text-button-label text-on-surface mb-6 pb-4 border-b border-outline-variant flex items-center justify-between'>
          <span>Calculation History</span>
          <span className='material-symbols-outlined text-on-surface-variant' data-icon='history'>history</span>
        </h2>
        
        <div className='flex-grow overflow-y-auto pr-2 space-y-4' data-testid='history-list'>
          {history.length === 0 ? (
            <div className='text-center text-outline py-8 font-history-entry text-history-entry'>
              No calculations yet
            </div>
          ) : (
            history.map((item, index) => (
              <div
                key={index}
                onClick={() => onLoadHistoryItem(item)}
                className='p-4 rounded-lg hover:bg-surface-variant transition-colors cursor-pointer group border border-transparent hover:border-outline-variant'
                data-testid={`history-item-${index}`}
              >
                <div className='flex justify-between items-end mb-1'>
                  <span className='font-history-entry text-history-entry text-on-surface-variant'>
                    {item.operand1} {item.operator} {item.operand2}
                  </span>
                  <span className='font-label-sm text-label-sm text-outline'>
                    {item.time || 'Just now'}
                  </span>
                </div>
                <div className='font-button-label text-button-label text-on-surface group-hover:text-primary transition-colors'>
                  = {item.result}
                </div>
              </div>
            ))
          )}
        </div>

        <div className='pt-6 mt-4 border-t border-outline-variant'>
          <button
            onClick={onClearHistory}
            disabled={history.length === 0}
            className='w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-outline-variant text-on-surface hover:bg-error-container hover:text-on-error-container hover:border-error transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <span className='material-symbols-outlined text-sm' data-icon='delete'>delete</span>
            <span className='font-button-label text-button-label'>Clear History</span>
          </button>
        </div>
      </div>
    </div>
  );
}