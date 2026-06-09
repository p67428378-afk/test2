import React from 'react';

export default function Button({ children, onClick, variant = 'primary', className = '', disabled = false, ...props }) {
  const baseStyle = 'px-4 py-2 rounded-lg font-bold transition-colors duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-black',
    secondary: 'border border-[#F59E0B] text-[#F59E0B] hover:bg-[#F59E0B]/10',
    danger: 'bg-rose-700 hover:bg-rose-600 text-white',
    ghost: 'text-[#d8c3ad] hover:text-white hover:bg-[#273647]',
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
