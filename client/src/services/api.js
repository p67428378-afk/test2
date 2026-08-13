import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const paintingService = {
  getPaintings: async (skip = 0, limit = 20) => {
    const response = await api.get("/api/v1/paintings", {
      params: { skip, limit },
    });
    return response.data;
  },
  getPainting: async (paintingId) => {
    const response = await api.get(`/api/v1/paintings/${paintingId}`);
    return response.data;
  },
  createPainting: async (paintingData) => {
    const response = await api.post("/api/v1/paintings", paintingData);
    return response.data;
  },
  updatePainting: async (paintingId, paintingData) => {
    const response = await api.put(
      `/api/v1/paintings/${paintingId}`,
      paintingData,
    );
    return response.data;
  },
  deletePainting: async (paintingId) => {
    const response = await api.delete(`/api/v1/paintings/${paintingId}`);
    return response.data;
  },
};

export const cartService = {
  getCart: async () => {
    const response = await api.get("/api/v1/cart");
    return response.data;
  },
  addCartItem: async (paintingId) => {
    const response = await api.post("/api/v1/cart/items", {
      painting_id: paintingId,
    });
    return response.data;
  },
  removeCartItem: async (itemId) => {
    const response = await api.delete(`/api/v1/cart/items/${itemId}`);
    return response.data;
  },
};

export const orderService = {
  checkout: async (paymentMethodId, shippingAddress) => {
    const response = await api.post("/api/v1/orders/checkout", {
      payment_method_id: paymentMethodId,
      shipping_address: shippingAddress,
    });
    return response.data;
  },
  getOrder: async (orderId) => {
    const response = await api.get(`/api/v1/orders/${orderId}`);
    return response.data;
  },
};

export default api;
