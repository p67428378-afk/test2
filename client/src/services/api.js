import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle AUTH_EXPIRED or other 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const detail = error.response.data?.detail;
      if (detail === 'AUTH_EXPIRED' || detail === 'Invalid session token') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login?expired=true';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (login_id, password) => {
    const response = await api.post('/api/v1/auth/login', { login_id, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export const accountService = {
  getAccounts: async () => {
    const response = await api.get('/api/v1/accounts');
    return response.data.accounts;
  },
  getBalance: async (accountId) => {
    const response = await api.get(`/api/v1/accounts/${accountId}/balance`);
    return response.data;
  },
  getTransactions: async (accountId, skip = 0, limit = 20) => {
    const response = await api.get(`/api/v1/accounts/${accountId}/transactions`, {
      params: { skip, limit },
    });
    return response.data.transactions;
  },
};

export const auditService = {
  getAuditLogs: async (skip = 0, limit = 20) => {
    const response = await api.get('/api/v1/audit/logs', {
      params: { skip, limit },
    });
    return response.data.logs;
  },
};

export default api;
