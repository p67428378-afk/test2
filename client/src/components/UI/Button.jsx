import React from 'react';

const Button = ({ children, onClick, type = 'button', className = '' }) => {
  const baseClasses = 'py-2 px-4 rounded-lg font-bold transition-all';
  const combinedClasses = `${baseClasses} ${className}`;

  return (
    <button type={type} onClick={onClick} className={combinedClasses}>
      {children}
    </button>
  );
};

export default Button;
