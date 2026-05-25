import React from 'react';
import { useField } from 'formik';

const FormInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <div className='mb-4'>
      <label htmlFor={props.id || props.name} className='block text-sm font-medium text-gray-700'>
        {label}
      </label>
      <input
        className={`mt-1 block w-full px-3 py-2 border ${meta.touched && meta.error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? (
        <div className='text-red-500 text-xs mt-1'>{meta.error}</div>
      ) : null}
    </div>
  );
};

export default FormInput;
