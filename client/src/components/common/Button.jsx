import React from 'react';

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
  ...props
}) {
  const baseStyles = 'font-bold py-2 px-4 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1E293B]';
  
  const variants = {
    primary: 'bg-[#FFD100] text-black hover:bg-[#edc200] focus:ring-[#FFD100]',
    secondary: 'bg-[#334155] text-on-surface hover:bg-[#475569] focus:ring-[#475569]',
    danger: 'bg-error text-on-error hover:bg-red-600 focus:ring-error',
    outline: 'border border-[#334155] text-on-surface hover:bg-[#1E293B] focus:ring-[#334155]',
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${disabled ? disabledStyles : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
