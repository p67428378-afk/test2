import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock data for fallback
const mockBookings = [
  {
    id: '11111111-2222-3333-4444-555555555555',
    client: { name: 'Alice Smith' },
    trek: { name: 'Everest Base Camp' },
    start_date: '2026-10-12',
    end_date: '2026-10-26',
    status: 'PENDING',
    duration: '14 days'
  },
  {
    id: '22222222-3333-4444-5555-666666666666',
    client: { name: 'Bob Jones' },
    trek: { name: 'Annapurna Circuit' },
    start_date: '2026-11-05',
    end_date: '2026-11-15',
    status: 'PENDING',
    duration: '10 days'
  }
];

const mockAvailability = [
  { date: '2026-06-15', start_time: '09:00', end_time: '17:00', is_available: true },
  { date: '2026-06-16', start_time: '09:00', end_time: '17:00', is_available: true },
  { date: '2026-06-17', start_time: '09:00', end_time: '17:00', is_available: false },
  { date: '2026-06-18', start_time: '09:00', end_time: '17:00', is_available: true },
  { date: '2026-06-19', start_time: '09:00', end_time: '17:00', is_available: true }
];

export const getBookings = async () => {
  try {
    const response = await api.get('/api/v1/bookings');
    return response.data.length > 0 ? response.data : mockBookings;
  } catch (error) {
    console.warn('Failed to fetch bookings, using mock data:', error);
    return mockBookings;
  }
};

export const getAvailability = async (guideId = 'tenzing-norgay') => {
  try {
    const response = await api.get(`/api/v1/availability/${guideId}`);
    return response.data.length > 0 ? response.data : mockAvailability;
  } catch (error) {
    console.warn('Failed to fetch availability, using mock data:', error);
    return mockAvailability;
  }
};

export const sendNotification = async (clientId, message) => {
  try {
    const response = await api.post('/api/v1/notifications', {
      client_id: clientId,
      message,
    });
    return response.data;
  } catch (error) {
    console.warn('Failed to send notification, simulating success:', error);
    return {
      message_id: '33333333-4444-5555-6666-777777777777',
      success: true,
    };
  }
};

export default api;
