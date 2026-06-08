import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/Auth/RegisterForm';

const RegisterPage = () => {
  return (
    <div className='flex items-center justify-center min-h-screen bg-background'>
      <div className='w-full max-w-md p-8 space-y-8 bg-surface-container rounded-2xl shadow-lg'>
        <div className='text-center'>
          <h1 className='font-display text-h1 text-primary'>CineGlow</h1>
          <p className='text-on-surface-variant'>Create your account to get started.</p>
        </div>
        <RegisterForm />
        <p className='text-center text-sm text-on-surface-variant'>
          Already have an account?{' '}
          <Link to='/login' className='font-medium text-primary hover:underline'>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
