import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: async (email, password) => {
    const response = await apiClient.post("/api/v1/auth/login", {
      email,
      password,
    });
    return response.data;
  },
  getMe: async () => {
    const response = await apiClient.get("/api/v1/auth/me");
    return response.data;
  },
};

export const roomsApi = {
  getRooms: async (params = {}) => {
    const response = await apiClient.get("/api/v1/rooms", { params });
    return response.data;
  },
  getRoom: async (roomId) => {
    const response = await apiClient.get(`/api/v1/rooms/${roomId}`);
    return response.data;
  },
  createRoom: async (roomData) => {
    const response = await apiClient.post("/api/v1/rooms", roomData);
    return response.data;
  },
  updateRoomStatus: async (roomId, status) => {
    const response = await apiClient.patch(`/api/v1/rooms/${roomId}/status`, {
      status,
    });
    return response.data;
  },
};

export const reservationsApi = {
  getReservations: async (params = {}) => {
    const response = await apiClient.get("/api/v1/reservations", { params });
    return response.data;
  },
  getReservation: async (reservationId) => {
    const response = await apiClient.get(
      `/api/v1/reservations/${reservationId}`,
    );
    return response.data;
  },
  createReservation: async (data) => {
    const response = await apiClient.post("/api/v1/reservations", data);
    return response.data;
  },
  updateReservation: async (reservationId, data) => {
    const response = await apiClient.put(
      `/api/v1/reservations/${reservationId}`,
      data,
    );
    return response.data;
  },
  cancelReservation: async (reservationId) => {
    const response = await apiClient.post(
      `/api/v1/reservations/${reservationId}/cancel`,
    );
    return response.data;
  },
};

export const frontDeskApi = {
  checkIn: async (reservationId, roomId = null) => {
    const response = await apiClient.post("/api/v1/check-in", {
      reservation_id: reservationId,
      room_id: roomId || null,
    });
    return response.data;
  },
  checkOut: async (reservationId, payload = {}) => {
    const response = await apiClient.post("/api/v1/check-out", {
      reservation_id: reservationId,
      service_fees: payload.service_fees || 0.0,
      discount_amount: payload.discount_amount || 0.0,
      promo_code: payload.promo_code || null,
    });
    return response.data;
  },
};

export const invoicesApi = {
  getInvoices: async (params = {}) => {
    const response = await apiClient.get("/api/v1/invoices", { params });
    return response.data;
  },
  getInvoiceByReservation: async (reservationId) => {
    const response = await apiClient.get(`/api/v1/invoices/${reservationId}`);
    return response.data;
  },
  payInvoice: async (reservationId, paymentData = {}) => {
    const response = await apiClient.post(
      `/api/v1/invoices/${reservationId}/pay`,
      paymentData,
    );
    return response.data;
  },
};

export default {
  auth: authApi,
  rooms: roomsApi,
  reservations: reservationsApi,
  frontDesk: frontDeskApi,
  invoices: invoicesApi,
};
