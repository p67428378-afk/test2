import React from 'react';

export default function InputField({
  label,
  id,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  error,
  helpText,
  prefix,
  disabled = false,
  maxLength
}) {
  return (
    <div className='w-full'>
      {label && (
        <label className='block font-label-md text-label-md text-[#0F172A] mb-sm' htmlFor={id}>
          {label}
        </label>
      )}
      <div className='flex relative'>
        {prefix && (
          <span className='inline-flex items-center px-md py-sm border border-r-0 border-outline-variant bg-surface-variant text-on-surface-variant font-body-md text-body-md rounded-l-DEFAULT'>
            {prefix}
          </span>
        )}
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          className={`flex-1 px-md py-sm bg-surface-container-lowest border ${
            error ? 'border-error focus:border-error focus:ring-error' : 'border-outline-variant focus:border-[#0F172A] focus:ring-[#0F172A]'
          } ${prefix ? 'rounded-r-DEFAULT' : 'rounded-DEFAULT'} font-body-md text-body-md text-on-surface focus:outline-none focus:ring-1 transition-colors`}
        />
      </div>
      {error && (
        <p className='mt-sm font-label-sm text-label-sm text-error' role='alert'>
          {error}
        </p>
      )}
      {!error && helpText && (
        <p className='mt-sm font-label-sm text-label-sm text-on-surface-variant'>
          {helpText}
        </p>
      )}
    </div>
  );
}
