import React from 'react';

export default function Button({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false }) {
  const baseStyles = 'font-medium text-sm px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-brand-indigo hover:bg-brand-indigo/90 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]',
    secondary: 'bg-surface-variant hover:bg-surface-variant/80 text-on-surface border border-outline-variant/30',
    danger: 'bg-error-container hover:bg-error-container/80 text-on-error-container border border-error/20',
    success: 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}