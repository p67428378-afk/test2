import React from 'react';

export default function Button({ children, onClick, variant = 'primary', className = '', disabled = false, ...props }) {
  const baseStyle = 'py-3 px-4 font-bold rounded-lg shadow-sm transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-primary-container text-on-background hover:bg-inverse-primary',
    secondary: 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest',
    danger: 'bg-error text-on-error hover:bg-red-700',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
