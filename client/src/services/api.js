import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
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
  (error) => Promise.reject(error)
);

export const authService = {
  login: async (login_id, password) => {
    const response = await api.post('/api/v1/auth/login', { login_id, password });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('userId', response.data.user_id);
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export const accountService = {
  getAccounts: async () => {
    const response = await api.get('/api/v1/accounts');
    return response.data;
  },
  getAccount: async (accountId) => {
    const response = await api.get(`/api/v1/accounts/${accountId}`);
    return response.data;
  }
};

export const transferService = {
  internalTransfer: async (from_account_id, to_account_id, amount, memo = null) => {
    const response = await api.post('/api/v1/transfers/internal', {
      from_account_id,
      to_account_id,
      amount: parseFloat(amount),
      memo
    });
    return response.data;
  },
  p2pTransfer: async (from_account_id, recipient_account_number, amount, password, memo = null) => {
    const response = await api.post('/api/v1/transfers/p2p', {
      from_account_id,
      recipient_account_number,
      amount: parseFloat(amount),
      password,
      memo
    });
    return response.data;
  }
};

export const transactionService = {
  getTransactions: async (params = {}) => {
    const response = await api.get('/api/v1/transactions', { params });
    return response.data;
  }
};

export default api;
