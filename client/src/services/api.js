import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getGalleries = async () => {
  const response = await api.get("/api/v1/galleries");
  return response.data;
};

export const getGalleryImages = async (galleryId) => {
  const response = await api.get(`/api/v1/galleries/${galleryId}/images`);
  return response.data;
};

export const createBooking = async (bookingData) => {
  const response = await api.post("/api/v1/bookings", bookingData);
  return response.data;
};

export const getAvailability = async (startDate, endDate) => {
  const response = await api.get("/api/v1/bookings/availability", {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
  });
  return response.data;
};

export const processPayment = async (bookingId, paymentData) => {
  const response = await api.post(
    `/api/v1/bookings/${bookingId}/pay`,
    paymentData,
  );
  return response.data;
};

export const submitContactForm = async (contactData) => {
  const response = await api.post("/api/v1/contact", contactData);
  return response.data;
};

export default api;
