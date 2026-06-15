import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getRooms = async (checkInDate, checkOutDate, roomType) => {
  const params = {
    check_in_date: checkInDate,
    check_out_date: checkOutDate,
  };
  if (roomType) {
    params.room_type = roomType;
  }
  const response = await api.get('/api/v1/rooms', { params });
  return response.data;
};

export const createReservation = async (reservationData) => {
  const response = await api.post('/api/v1/reservations', reservationData);
  return response.data;
};

export const getReservations = async (search = '', skip = 0, limit = 20) => {
  const params = { skip, limit };
  if (search) {
    params.search = search;
  }
  const response = await api.get('/api/v1/reservations', { params });
  return response.data;
};

export const getReservation = async (reservationId) => {
  const response = await api.get(`/api/v1/reservations/${reservationId}`);
  return response.data;
};

export const updateReservation = async (reservationId, reservationData) => {
  const response = await api.put(`/api/v1/reservations/${reservationId}`, reservationData);
  return response.data;
};

export default api;
