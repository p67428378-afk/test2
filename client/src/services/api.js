import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = async (email, password) => {
  const response = await api.post("/api/v1/auth/login", { email, password });
  if (response.data.access_token) {
    localStorage.setItem("auth_token", response.data.access_token);
    if (response.data.user) {
      localStorage.setItem("user_info", JSON.stringify(response.data.user));
    }
  }
  return response.data;
};

export const registerUser = async (email, fullName, password) => {
  const response = await api.post("/api/v1/auth/register", {
    email,
    full_name: fullName,
    password,
  });
  if (response.data.access_token) {
    localStorage.setItem("auth_token", response.data.access_token);
    if (response.data.user) {
      localStorage.setItem("user_info", JSON.stringify(response.data.user));
    }
  }
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user_info");
};

export const getCurrentUser = async () => {
  const response = await api.get("/api/v1/auth/me");
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get("/api/v1/categories");
  return response.data;
};

export const getBoxes = async (params = {}) => {
  const cleanParams = {};
  if (params.category_id) cleanParams.category_id = params.category_id;
  if (
    params.min_price !== undefined &&
    params.min_price !== null &&
    params.min_price !== ""
  ) {
    cleanParams.min_price = Number(params.min_price);
  }
  if (
    params.max_price !== undefined &&
    params.max_price !== null &&
    params.max_price !== ""
  ) {
    cleanParams.max_price = Number(params.max_price);
  }
  if (
    params.min_rating !== undefined &&
    params.min_rating !== null &&
    params.min_rating !== ""
  ) {
    cleanParams.min_rating = Number(params.min_rating);
  }
  if (params.search) cleanParams.search = params.search;
  if (params.billing_frequency)
    cleanParams.billing_frequency = params.billing_frequency;
  if (params.skip !== undefined) cleanParams.skip = params.skip;
  if (params.limit !== undefined) cleanParams.limit = params.limit;

  const response = await api.get("/api/v1/boxes", { params: cleanParams });
  return response.data;
};

export const getBoxDetail = async (id) => {
  const response = await api.get(`/api/v1/boxes/${id}`);
  return response.data;
};

export const getBoxReviews = async (id, params = {}) => {
  const response = await api.get(`/api/v1/boxes/${id}/reviews`, { params });
  return response.data;
};

export const submitBoxReview = async (id, reviewData) => {
  const response = await api.post(`/api/v1/boxes/${id}/reviews`, {
    rating: Number(reviewData.rating),
    comment: reviewData.comment,
  });
  return response.data;
};

export const createGiftSubscription = async (id, giftData) => {
  const response = await api.post(`/api/v1/boxes/${id}/gift`, {
    recipient_email: giftData.recipient_email,
    message: giftData.message || undefined,
  });
  return response.data;
};

export const getBoxCustomizations = async (id) => {
  const response = await api.get(`/api/v1/boxes/${id}/customizations`);
  return response.data;
};

export const submitBoxCustomization = async (id, customizationData) => {
  const response = await api.post(`/api/v1/boxes/${id}/customizations`, {
    original_item_id: customizationData.original_item_id,
    replacement_item_id: customizationData.replacement_item_id,
  });
  return response.data;
};

export default api;
