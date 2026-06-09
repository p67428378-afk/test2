import React from 'react';

export default function Badge({ children, variant = 'info' }) {
  const baseStyles = 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border';
  
  const variants = {
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    danger: 'bg-error/10 text-error border-error/20',
    info: 'bg-secondary/10 text-secondary border-secondary/20',
    primary: 'bg-brand-indigo/10 text-brand-indigo border-brand-indigo/20',
  };

  return (
    <span className={`${baseStyles} ${variants[variant] || variants.info}`}>
      {children}
    </span>
  );
}