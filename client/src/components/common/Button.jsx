import React from 'react';

const Button = ({ onClick, children, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
