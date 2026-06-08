import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/api';
import Input from '../UI/Input';
import Button from '../UI/Button';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await login({ email, password });
      localStorage.setItem('token', data.access_token);
      navigate('/');
    } catch (err) {
      setError('Failed to login. Please check your credentials.');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {error && <p className='text-red-500'>{error}</p>}
      <Input
        type='email'
        placeholder='Email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type='password'
        placeholder='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type='submit' className='w-full'>Login</Button>
    </form>
  );
};

export default LoginForm;
