
import React, { useState, useEffect } from 'react';
import { getUser } from '../services/api';

const ProfileDetails = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUser(userId);
        setUser(response.data);
      } catch (err) {
        setError('Failed to fetch user details.');
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  if (error) {
    return <div className='text-red-500'>{error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className='bg-white shadow overflow-hidden sm:rounded-lg'>
      <div className='px-4 py-5 sm:px-6'>
        <h3 className='text-lg leading-6 font-medium text-gray-900'>User Profile</h3>
      </div>
      <div className='border-t border-gray-200'>
        <dl>
          <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
            <dt className='text-sm font-medium text-gray-500'>Email address</dt>
            <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{user.email}</dd>
          </div>
          <div className='bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
            <dt className='text-sm font-medium text-gray-500'>Phone number</dt>
            <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{user.phone_number}</dd>
          </div>
          <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
            <dt className='text-sm font-medium text-gray-500'>Member since</dt>
            <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{new Date(user.created_at).toLocaleDateString()}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default ProfileDetails;
