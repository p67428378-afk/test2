import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/api';
import { User, Lock, LogIn } from 'lucide-react';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await login(credentials);
      localStorage.setItem('authToken', response.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <div className="relative group">
        <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary" />
        <input
          className="w-full h-12 pl-10 pr-4 rounded-lg border border-outline-variant bg-surface-bright focus:border-primary focus:outline-none"
          id="username"
          name="username"
          placeholder="Enter your username"
          type="text"
          value={credentials.username}
          onChange={handleChange}
          required
        />
      </div>
      <div className="relative group">
        <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary" />
        <input
          className="w-full h-12 pl-10 pr-4 rounded-lg border border-outline-variant bg-surface-bright focus:border-primary focus:outline-none"
          id="password"
          name="password"
          placeholder="••••••••"
          type="password"
          value={credentials.password}
          onChange={handleChange}
          required
        />
      </div>
      <div className="pt-2">
        <button 
          className="w-full h-12 bg-primary-container text-on-primary font-semibold rounded-lg shadow-sm hover:shadow-md hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-on-primary"></div>
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <span>Login</span>
              <LogIn className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
