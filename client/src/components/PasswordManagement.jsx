
import React, { useState } from 'react';

const PasswordManagement = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    // TODO: Implement password change logic
    console.log('Changing password...');
    setSuccess('Password changed successfully!');
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      {error && <div className='text-red-500'>{error}</div>}
      {success && <div className='text-green-500'>{success}</div>}
      <div>
        <label htmlFor='currentPassword' className='block text-sm font-medium text-gray-700'>
          Current Password
        </label>
        <input
          type='password'
          id='currentPassword'
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          required
        />
      </div>
      <div>
        <label htmlFor='newPassword' className='block text-sm font-medium text-gray-700'>
          New Password
        </label>
        <input
          type='password'
          id='newPassword'
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          required
        />
      </div>
      <div>
        <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700'>
          Confirm New Password
        </label>
        <input
          type='password'
          id='confirmPassword'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          required
        />
      </div>
      <button
        type='submit'
        className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
      >
        Change Password
      </button>
    </form>
  );
};

export default PasswordManagement;
