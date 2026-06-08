import React from 'react';

const Input = ({ type, placeholder, value, onChange, required = false, className = '' }) => {
  const baseClasses = 'w-full px-4 py-2 rounded-lg bg-surface-container-high border border-outline-variant/30 focus:ring-2 focus:ring-primary focus:outline-none transition-all';
  const combinedClasses = `${baseClasses} ${className}`;

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className={combinedClasses}
    />
  );
};

export default Input;
