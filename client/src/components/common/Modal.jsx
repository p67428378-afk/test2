import React from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm'>
      <div className='relative w-full max-w-lg bg-[#1E293B] border border-[#334155] rounded-xl shadow-2xl overflow-hidden'>
        <div className='p-md border-b border-[#334155] flex justify-between items-center bg-surface-container-low'>
          <h3 className='font-title-sm text-title-sm text-on-surface'>{title}</h3>
          <button
            onClick={onClose}
            className='text-on-surface-variant hover:text-on-surface transition-colors'
          >
            <span className='material-symbols-outlined'>close</span>
          </button>
        </div>
        <div className='p-md'>{children}</div>
      </div>
    </div>
  );
}
