import React from 'react';

const Button = ({ onClick, children, className, ...props }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full bg-[#3B82F6] hover:bg-blue-700 text-white font-headline-md text-headline-md py-4 rounded-lg shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
