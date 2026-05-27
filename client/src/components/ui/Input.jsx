import React from 'react';

const Input = React.forwardRef(({ id, type = 'text', placeholder, value, onChange, required = false, disabled = false, readOnly = false, className = '', children }, ref) => {
  const baseClasses = 'w-full h-[48px] border border-outline-variant rounded-lg font-body-md text-on-surface focus:ring-0 transition-all';

  return (
    <div className="relative">
      {children}
      <input
        ref={ref}
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        className={`${baseClasses} ${className}`}
      />
    </div>
  );
});

export default Input;
