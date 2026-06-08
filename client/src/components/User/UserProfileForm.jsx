import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../../services/api';
import Input from '../UI/Input';
import Button from '../UI/Button';
import Spinner from '../UI/Spinner';

const UserProfileForm = () => {
  const [user, setUser] = useState({ email: '', preferences: {} });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const { data } = await getUserProfile();
        setUser(data);
      } catch (err) {
        setError('Failed to load profile.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferencesChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ 
      ...prev, 
      preferences: { ...prev.preferences, [name]: value } 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await updateUserProfile({ email: user.email, preferences: user.preferences });
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile.');
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <form onSubmit={handleSubmit} className='space-y-6 max-w-lg mx-auto'>
      <h2 className='font-h2 text-h2 text-on-background'>Edit Profile</h2>
      {error && <p className='text-red-500'>{error}</p>}
      {success && <p className='text-green-500'>{success}</p>}
      <Input
        type='email'
        name='email'
        placeholder='Email'
        value={user.email}
        onChange={handleChange}
        required
      />
      <div>
        <label className='block text-sm font-medium text-on-surface-variant mb-2'>Favorite Genre</label>
        <Input
          type='text'
          name='favoriteGenre'
          placeholder='e.g., Sci-Fi, Comedy'
          value={user.preferences?.favoriteGenre || ''}
          onChange={handlePreferencesChange}
        />
      </div>
      <Button type='submit' className='w-full'>Save Changes</Button>
    </form>
  );
};

export default UserProfileForm;
