import React from 'react';

const KeypadButton = ({ children, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`btn-calc ${className}`}
    >
      {children}
    </button>
  );
};

export default KeypadButton;
