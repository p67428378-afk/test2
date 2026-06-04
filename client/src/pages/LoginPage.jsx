import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/');
    } catch (error) {
      console.error('Login failed', error);
      // Handle login error display
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-surface-dim">
      <form onSubmit={handleSubmit} className="bg-surface-container p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-headline-md text-center mb-6">Login</h1>
        <div className="mb-4">
          <label className="block text-on-surface-variant mb-2" htmlFor="username">Username</label>
          <input 
            type="text" 
            id="username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            className="w-full p-2 rounded bg-surface-container-high border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="mb-6">
          <label className="block text-on-surface-variant mb-2" htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full p-2 rounded bg-surface-container-high border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button type="submit" className="w-full bg-primary text-on-primary p-3 rounded hover:bg-primary-dark transition-colors">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
