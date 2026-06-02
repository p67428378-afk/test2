
import React, { useState } from 'react';
import { registerUser } from '../services/api';

const RegistrationForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const userData = { email, password, phone_number: phoneNumber };
      await registerUser(userData);
      setSuccess('Registration successful! Please log in.');
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      {error && <div className='text-red-500'>{error}</div>}
      {success && <div className='text-green-500'>{success}</div>}
      <div>
        <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
          Email address
        </label>
        <input
          type='email'
          id='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          required
        />
      </div>
      <div>
        <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
          Password
        </label>
        <input
          type='password'
          id='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          required
        />
      </div>
      <div>
        <label htmlFor='phoneNumber' className='block text-sm font-medium text-gray-700'>
          Phone Number
        </label>
        <input
          type='tel'
          id='phoneNumber'
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          required
        />
      </div>
      <button
        type='submit'
        className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
      >
        Register
      </button>
    </form>
  );
};

export default RegistrationForm;
