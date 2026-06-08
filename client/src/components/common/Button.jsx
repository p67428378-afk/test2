import React from 'react';

const Button = ({ children, onClick, className, ...props }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 bg-primary text-on-primary py-3 rounded-xl font-label-md text-label-md hover:opacity-90 transition-all active:scale-95 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
