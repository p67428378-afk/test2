import React from 'react';
import { Field } from 'formik';

const InputField = ({ name, label, type, placeholder, error }) => {
  return (
    <div className='space-y-2'>
      <label htmlFor={name} className='block text-xs font-bold uppercase tracking-[0.05em] text-on-surface-variant'>
        {label}
      </label>
      <Field
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className={`w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 focus:bg-white focus:ring-2 transition-all text-on-surface outline-none ${error ? 'ring-2 ring-error' : 'focus:ring-primary/20'}`}
      />
      {error && <p className='text-error text-xs mt-1'>{error}</p>}
    </div>
  );
};

export default InputField;