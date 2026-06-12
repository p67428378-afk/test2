import React from 'react';

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyles = 'px-4 py-2 rounded-md font-mono-data text-mono-data transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface';
  
  const variants = {
    primary: 'bg-primary text-on-primary hover:bg-primary-container',
    secondary: 'bg-transparent border border-outline-variant text-on-surface hover:bg-surface-container-highest',
    danger: 'bg-error text-on-error hover:bg-error-container',
    success: 'bg-emerald-500 text-white hover:bg-emerald-600',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}