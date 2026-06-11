import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8180';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock data for fallback
const MOCK_CUBICLES = [
  { id: '1', name: 'A-101', location: 'Floor 1, Zone A', amenities: ['Dual Monitors', 'Standing Desk', 'Window View'], is_available: true },
  { id: '2', name: 'A-102', location: 'Floor 1, Zone A', amenities: ['Dual Monitors'], is_available: true },
  { id: '3', name: 'A-103', location: 'Floor 1, Zone A', amenities: ['Standing Desk'], is_available: false },
  { id: '4', name: 'A-104', location: 'Floor 1, Zone A', amenities: ['Window View'], is_available: true },
  { id: '5', name: 'A-105', location: 'Floor 1, Zone A', amenities: [], is_available: true },
  { id: '6', name: 'A-106', location: 'Floor 1, Zone A', amenities: ['Quiet Zone'], is_available: false },
  { id: '7', name: 'A-107', location: 'Floor 1, Zone A', amenities: ['Standing Desk'], is_available: true },
  { id: '8', name: 'A-108', location: 'Floor 1, Zone A', amenities: [], is_available: true },
  { id: '9', name: 'A-109', location: 'Floor 1, Zone A', amenities: [], is_available: false },
  { id: '10', name: 'A-110', location: 'Floor 1, Zone A', amenities: [], is_available: true },
  { id: '11', name: 'A-111', location: 'Floor 1, Zone A', amenities: ['Quiet Zone'], is_available: true },
  { id: '12', name: 'A-112', location: 'Floor 1, Zone A', amenities: [], is_available: true },
  { id: '13', name: 'A-113', location: 'Floor 1, Zone A', amenities: [], is_available: false },
  { id: '14', name: 'A-114', location: 'Floor 1, Zone A', amenities: [], is_available: true },
  { id: '15', name: 'A-115', location: 'Floor 1, Zone A', amenities: [], is_available: true },
  { id: '16', name: 'A-116', location: 'Floor 1, Zone A', amenities: [], is_available: true },
];

let mockBookings = [
  {
    id: 'b1',
    booking_date: '2026-05-19',
    cubicle_id: '3',
    status: 'confirmed',
    created_at: '2026-05-18T12:00:00Z',
    cubicle: { name: 'A-103', location: 'Floor 1, Zone A', amenities: ['Standing Desk'] }
  },
  {
    id: 'b2',
    booking_date: '2026-05-19',
    cubicle_id: '6',
    status: 'confirmed',
    created_at: '2026-05-18T12:00:00Z',
    cubicle: { name: 'A-106', location: 'Floor 1, Zone A', amenities: ['Quiet Zone'] }
  }
];

export const cubicleService = {
  getCubicles: async (date, amenities = '') => {
    try {
      const response = await api.get('/api/v1/cubicles', {
        params: { date, amenities },
      });
      return response.data;
    } catch (error) {
      console.warn('API error, falling back to mock data:', error);
      // Filter mock cubicles based on amenities
      let filtered = [...MOCK_CUBICLES];
      if (amenities) {
        const amenityList = amenities.split(',').map(a => a.trim().toLowerCase());
        filtered = filtered.filter(cubicle => 
          amenityList.every(amenity => 
            cubicle.amenities.some(ca => ca.toLowerCase().includes(amenity))
          )
        );
      }
      // Update availability based on mock bookings for this date
      const bookedIds = mockBookings
        .filter(b => b.booking_date === date && b.status === 'confirmed')
        .map(b => b.cubicle_id);
      
      return filtered.map(c => ({
        ...c,
        is_available: !bookedIds.includes(c.id) && c.is_available
      }));
    }
  },
};

export const bookingService = {
  getBookings: async () => {
    try {
      const response = await api.get('/api/v1/users/me/bookings');
      return response.data;
    } catch (error) {
      console.warn('API error, falling back to mock data:', error);
      return mockBookings;
    }
  },

  createBooking: async (cubicleId, date) => {
    try {
      const response = await api.post('/api/v1/bookings', {
        cubicle_id: cubicleId,
        booking_date: date,
      });
      return response.data;
    } catch (error) {
      console.warn('API error, falling back to mock data:', error);
      const cubicle = MOCK_CUBICLES.find(c => c.id === cubicleId);
      const newBooking = {
        id: `b_${Date.now()}`,
        booking_date: date,
        cubicle_id: cubicleId,
        status: 'confirmed',
        created_at: new Date().toISOString(),
        cubicle: cubicle ? { name: cubicle.name, location: cubicle.location, amenities: cubicle.amenities } : { name: 'Unknown', location: 'Unknown', amenities: [] }
      };
      mockBookings.push(newBooking);
      return newBooking;
    }
  },

  cancelBooking: async (bookingId) => {
    try {
      const response = await api.delete(`/api/v1/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      console.warn('API error, falling back to mock data:', error);
      mockBookings = mockBookings.filter(b => b.id !== bookingId);
      return { message: 'Booking cancelled successfully' };
    }
  },
};

export default api;