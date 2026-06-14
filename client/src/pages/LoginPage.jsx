import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/api';

const LoginPage = () => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/dashboard');
    }
    if (searchParams.get('expired') === 'true') {
      setError('Your session has expired (PCI-DSS v4.0). Please log in again.');
    }
  }, [navigate, searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(loginId, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid login ID or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='flex justify-center mb-4'>
          <div className='w-12 h-10 bg-primary rounded flex items-center justify-center text-white font-bold text-2xl shadow-md'>
            A
          </div>
        </div>
        <h2 className='text-center text-3xl font-extrabold text-on-background tracking-tight'>
          Sign in to ApexBank
        </h2>
        <p className='mt-2 text-center text-sm text-on-surface-variant'>
          Institutional Strength Retail Banking
        </p>
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-surface-container-lowest py-8 px-4 shadow-md rounded-xl sm:px-10 border border-outline-variant'>
          {error && (
            <div className='mb-4 bg-error-container border border-error text-on-error-container px-4 py-3 rounded-lg text-sm flex items-start gap-2'>
              <span className='material-symbols-outlined text-[18px] mt-0.5'>error</span>
              <span>{error}</span>
            </div>
          )}

          <form className='space-y-6' onSubmit={handleSubmit}>
            <div>
              <label htmlFor='loginId' className='block text-sm font-medium text-on-surface-variant'>
                Login ID
              </label>
              <div className='mt-1'>
                <input
                  id='loginId'
                  name='loginId'
                  type='text'
                  required
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  className='appearance-none block w-full px-3 py-2 border border-outline-variant rounded-lg shadow-sm placeholder-outline focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-surface text-on-background'
                  placeholder='e.g. user1'
                />
              </div>
            </div>

            <div>
              <label htmlFor='password' className='block text-sm font-medium text-on-surface-variant'>
                Password
              </label>
              <div className='mt-1'>
                <input
                  id='password'
                  name='password'
                  type='password'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='appearance-none block w-full px-3 py-2 border border-outline-variant rounded-lg shadow-sm placeholder-outline focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-surface text-on-background'
                  placeholder='••••••••'
                />
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <input
                  id='remember-me'
                  name='remember-remember-me'
                  type='checkbox'
                  className='h-4 w-4 text-primary focus:ring-primary border-outline-variant rounded'
                />
                <label htmlFor='remember-me' className='ml-2 block text-sm text-on-surface-variant'>
                  Remember me
                </label>
              </div>

              <div className='text-sm'>
                <a href='#' className='font-medium text-primary hover:text-primary-container'>
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type='submit'
                disabled={loading}
                className='w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-on-secondary bg-secondary hover:bg-secondary-fixed hover:text-on-secondary-fixed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors disabled:opacity-50'
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className='mt-6 border-t border-outline-variant pt-6 text-center'>
            <p className='text-sm font-medium text-on-surface-variant'>
              Secured by PCI-DSS v4.0 &amp; RBI Master Direction Compliance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
