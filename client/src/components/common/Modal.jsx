import React from 'react';

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4' id='success-modal'>
      <div className='bg-[#1E293B] border border-[#334155] rounded-xl shadow-2xl w-full max-w-md p-6 relative flex flex-col items-center text-center'>
        {children}
      </div>
    </div>
  );
}
