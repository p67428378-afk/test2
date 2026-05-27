import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', disabled = false, className = '' }) => {
  const baseClasses = 'w-full h-[48px] font-body-md font-semibold rounded-lg hover:opacity-90 active:scale-[0.98] transition-all shadow-sm disabled:opacity-50';

  const variants = {
    primary: 'bg-primary-container text-on-primary',
    secondary: 'border border-primary text-primary hover:bg-surface-container-low',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
