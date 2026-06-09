import React from 'react';

const Button = ({ children, onClick, variant = 'primary', disabled = false, className = '', ...props }) => {
  const baseStyles = 'px-4 py-2 rounded font-semibold text-sm transition-colors flex items-center justify-center cursor-pointer active:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary-container text-on-primary-container hover:bg-primary-container/90',
    secondary: 'bg-surface-container-highest text-on-surface hover:bg-surface-container-high',
    outline: 'border border-outline-variant text-on-surface hover:bg-surface-container-high',
    danger: 'bg-error-container text-on-error-container hover:bg-error-container/90',
    text: 'text-primary-container hover:bg-primary-container/10',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
