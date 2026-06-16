import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.data);
      } catch (error) {
        console.error('Not authenticated', error);
        setUser(null);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (username, password) => {
    // This is a mock login. In a real app, you'd call an API endpoint.
    // The backend for this project uses HTTP Basic Auth, so we can't
    // easily do a form-based login without more backend changes.
    // We will simulate a login and fetch the user.
    try {
      const response = await getCurrentUser(); // This will succeed if credentials are correct
      setUser(response.data);
    } catch (e) {
      throw new Error('Login failed');
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
