import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/Auth/LoginForm';

const LoginPage = () => {
  return (
    <div className='flex items-center justify-center min-h-screen bg-background'>
      <div className='w-full max-w-md p-8 space-y-8 bg-surface-container rounded-2xl shadow-lg'>
        <div className='text-center'>
          <h1 className='font-display text-h1 text-primary'>CineGlow</h1>
          <p className='text-on-surface-variant'>Welcome back! Sign in to continue.</p>
        </div>
        <LoginForm />
        <p className='text-center text-sm text-on-surface-variant'>
          Don't have an account?{' '}
          <Link to='/register' className='font-medium text-primary hover:underline'>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
