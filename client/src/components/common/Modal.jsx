import React from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
      <div className='bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg max-w-md w-full overflow-hidden flex flex-col'>
        <div className='p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low'>
          <h3 className='font-headline-md text-headline-md font-bold text-on-surface'>{title}</h3>
          <button onClick={onClose} className='text-secondary hover:text-on-surface transition-colors'>
            <span className='material-symbols-outlined'>close</span>
          </button>
        </div>
        <div className='p-6 flex-1 overflow-y-auto'>
          {children}
        </div>
        <div className='p-4 border-t border-outline-variant bg-surface-container-low flex justify-end'>
          <button
            onClick={onClose}
            className='bg-primary-container text-on-primary-container font-label-bold text-label-bold px-4 py-2 rounded-DEFAULT hover:bg-surface-container-high transition-colors'
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
