import React from 'react';

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  onClick,
  disabled = false,
  className = '',
  icon
}) {
  const baseStyles = 'w-full sm:w-auto px-lg py-sm font-label-md text-label-md rounded-DEFAULT transition-colors cursor-pointer flex items-center justify-center gap-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#0F172A] border border-[#0F172A] text-on-primary hover:bg-[#0F172A]/90',
    secondary: 'bg-surface-container-lowest border border-[#0F172A] text-[#0F172A] hover:bg-surface-variant',
    danger: 'bg-error border border-error text-on-error hover:bg-error/90'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {icon && <span className='material-symbols-outlined text-[18px]'>{icon}</span>}
      {children}
    </button>
  );
}
