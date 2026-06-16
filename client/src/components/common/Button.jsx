import React from 'react';

export default function Button({ children, onClick, variant = 'primary', className = '', disabled = false, type = 'button' }) {
  const baseStyle = 'font-label-bold text-label-bold px-4 py-2 rounded-DEFAULT transition-all duration-200 ease-in-out flex items-center justify-center gap-2 active:scale-95';
  
  const variants = {
    primary: 'bg-primary-container text-on-primary-container hover:bg-surface-container-high',
    secondary: 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest border border-outline-variant',
    danger: 'bg-error text-on-error hover:opacity-90',
    submit: 'bg-[#FFD200] text-[#111111] font-headline-md text-headline-md py-3 rounded-lg hover:brightness-95 shadow-sm active:scale-[0.98] w-full',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed active:scale-100' : ''}`}
    >
      {children}
    </button>
  );
}
