import React, { useState } from 'react';

export default function ContactForm({ onSubmit, isSubmitting = false, error = '' }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!name.trim()) {
      errors.name = 'Name is required';
    }

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\s+\.\s+/.test(email) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Invalid email format';
    }

    if (!phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else {
      // Standard format: XXX-XXX-XXXX
      const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
      if (!phoneRegex.test(phoneNumber)) {
        errors.phoneNumber = 'Phone number must follow the format XXX-XXX-XXXX';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        name: name.trim(),
        email: email.trim(),
        phone_number: phoneNumber.trim(),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className='bg-surface-container-lowest border border-outline-variant rounded-xl p-6 max-w-xl mx-auto flex flex-col gap-4 shadow-sm'>
      <h3 className='text-lg font-semibold text-on-background mb-2'>Add New Contact</h3>
      
      {error && (
        <div className='p-3 bg-error-container text-on-error-container rounded-lg text-sm' role='alert'>
          {error}
        </div>
      )}

      <div className='flex flex-col gap-1'>
        <label htmlFor='name' className='text-sm font-medium text-on-surface-variant'>
          Full Name
        </label>
        <input
          id='name'
          type='text'
          className={`bg-surface-container-low border ${
            validationErrors.name ? 'border-error' : 'border-outline-variant'
          } text-on-surface text-sm rounded-lg p-2.5 focus:ring-primary focus:border-primary`}
          placeholder='John Doe'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {validationErrors.name && (
          <span className='text-xs text-error'>{validationErrors.name}</span>
        )}
      </div>

      <div className='flex flex-col gap-1'>
        <label htmlFor='email' className='text-sm font-medium text-on-surface-variant'>
          Email Address
        </label>
        <input
          id='email'
          type='email'
          className={`bg-surface-container-low border ${
            validationErrors.email ? 'border-error' : 'border-outline-variant'
          } text-on-surface text-sm rounded-lg p-2.5 focus:ring-primary focus:border-primary`}
          placeholder='john.doe@email.com'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {validationErrors.email && (
          <span className='text-xs text-error'>{validationErrors.email}</span>
        )}
      </div>

      <div className='flex flex-col gap-1'>
        <label htmlFor='phoneNumber' className='text-sm font-medium text-on-surface-variant'>
          Phone Number (XXX-XXX-XXXX)
        </label>
        <input
          id='phoneNumber'
          type='text'
          className={`bg-surface-container-low border ${
            validationErrors.phoneNumber ? 'border-error' : 'border-outline-variant'
          } text-on-surface text-sm rounded-lg p-2.5 focus:ring-primary focus:border-primary`}
          placeholder='555-123-4567'
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        {validationErrors.phoneNumber && (
          <span className='text-xs text-error'>{validationErrors.phoneNumber}</span>
        )}
      </div>

      <button
        type='submit'
        disabled={isSubmitting}
        className='mt-4 bg-primary-container text-on-primary font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-surface-tint transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50'
      >
        {isSubmitting ? 'Adding...' : 'Add Contact'}
      </button>
    </form>
  );
}
