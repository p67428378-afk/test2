import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Auth
export const register = (userData) => apiClient.post('/api/v1/auth/register', userData);
export const login = (credentials) => apiClient.post('/api/v1/auth/login', credentials);

// User
export const getUserProfile = () => apiClient.get('/api/v1/users/me');
export const updateUserProfile = (profileData) => apiClient.put('/api/v1/users/me', profileData);

// Movies
export const getMovies = (params) => apiClient.get('/api/v1/movies', { params });
export const getMovieById = (movieId) => apiClient.get(`/api/v1/movies/${movieId}`);

// Watch History
export const getWatchHistory = () => apiClient.get('/api/v1/users/me/watch-history');
export const addToWatchHistory = (data) => apiClient.post('/api/v1/users/me/watch-history', data);
export const updateWatchHistory = (watchId, data) => apiClient.put(`/api/v1/users/me/watch-history/${watchId}`, data);
export const deleteFromWatchHistory = (watchId) => apiClient.delete(`/api/v1/users/me/watch-history/${watchId}`);

// Recommendations
export const getRecommendations = () => apiClient.get('/api/v1/users/me/recommendations');

export default apiClient;
