import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getChocolates = async (params = {}) => {
  const query = {};
  if (params.min_cocoa !== undefined && params.min_cocoa !== "") {
    query.min_cocoa = Number(params.min_cocoa);
  }
  if (params.max_cocoa !== undefined && params.max_cocoa !== "") {
    query.max_cocoa = Number(params.max_cocoa);
  }
  if (params.origin) query.origin = params.origin;
  if (params.flavor) query.flavor = params.flavor;
  if (params.dietary) query.dietary = params.dietary;
  if (params.skip !== undefined) query.skip = Number(params.skip);
  if (params.limit !== undefined) query.limit = Number(params.limit);

  const response = await apiClient.get("/api/v1/chocolates", { params: query });
  return response.data;
};

export const getChocolateById = async (chocolateId) => {
  const response = await apiClient.get(`/api/v1/chocolates/${chocolateId}`);
  return response.data;
};

export const createChocolate = async (data) => {
  const response = await apiClient.post("/api/v1/chocolates", data);
  return response.data;
};

export const getCart = async (cartId) => {
  const params = cartId ? { cart_id: cartId } : {};
  const headers = cartId ? { "X-Cart-ID": cartId } : {};
  const response = await apiClient.get("/api/v1/cart", { params, headers });
  return response.data;
};

export const addToCart = async ({ cartId, chocolateId, quantity = 1 }) => {
  const payload = {
    cart_id: cartId || null,
    chocolate_id: chocolateId,
    quantity: Number(quantity),
  };
  const response = await apiClient.post("/api/v1/cart/items", payload);
  return response.data;
};

export const updateCartItem = async (itemId, quantity) => {
  const payload = { quantity: Number(quantity) };
  const response = await apiClient.put(`/api/v1/cart/items/${itemId}`, payload);
  return response.data;
};

export const removeCartItem = async (itemId) => {
  const response = await apiClient.delete(`/api/v1/cart/items/${itemId}`);
  return response.data;
};

export const placeOrder = async ({
  cartId,
  customerName,
  customerEmail,
  shippingAddress,
  shippingMethod = "standard_ground",
}) => {
  const payload = {
    cart_id: cartId,
    customer_name: customerName,
    customer_email: customerEmail,
    shipping_address: shippingAddress,
    shipping_method: shippingMethod,
  };
  const response = await apiClient.post("/api/v1/orders", payload);
  return response.data;
};

export const getOrder = async (orderIdentifier) => {
  const response = await apiClient.get(`/api/v1/orders/${orderIdentifier}`);
  return response.data;
};

export const getHealth = async () => {
  const response = await apiClient.get("/api/v1/health");
  return response.data;
};

export default apiClient;
