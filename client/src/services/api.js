import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getDashboardSummary = () => apiClient.get('/api/v1/dashboard/summary');

export const getBookings = (params) => apiClient.get('/api/v1/bookings', { params });

export const createBooking = (data) => apiClient.post('/api/v1/bookings', data);

export const getBookingById = (id) => apiClient.get(`/api/v1/bookings/${id}`);

export const updateBooking = (id, data) => apiClient.put(`/api/v1/bookings/${id}`, data);

export const cancelBooking = (id) => apiClient.delete(`/api/v1/bookings/${id}`);

export const getRoomAvailability = () => apiClient.get('/api/v1/rooms/availability');

export const getDailyRevenueReport = () => apiClient.get('/api/v1/finance/reports/daily-revenue');

export const getStaff = () => apiClient.get('/api/v1/staff');
